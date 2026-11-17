/**
 * Node.js test harness for AlgoLens WASM engine.
 * Tests every registered algorithm and validates trace output.
 *
 * Sorting algorithms must end fully sorted; search algorithms must end
 * with an explicit found / not-found step and highlight the match.
 *
 * Usage: node scripts/test_engine.mjs
 */

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const wasmDir = join(projectRoot, 'algolens', 'public', 'wasm');

// Colors for terminal
const GREEN = '\x1b[32m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';
const YELLOW = '\x1b[33m';
const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';

let passed = 0;
let failed = 0;

const SORTS = [
    'bubble-sort',
    'merge-sort',
    'quick-sort',
    'insertion-sort',
    'selection-sort',
    'shell-sort',
    'heap-sort',
    'counting-sort',
    'radix-sort',
    'bucket-sort',
];

const SEARCHES = [
    'linear-search',
    'binary-search',
    'jump-search',
    'interpolation-search',
    'exponential-search',
];

const ARRAY_PATTERNS = [
    'two-pointers',
    'sliding-window',
    'kadane',
    'dutch-flag',
    'prefix-sum',
];

function assert(condition, message) {
    if (condition) {
        passed++;
        console.log(`  ${GREEN}✓${RESET} ${message}`);
    } else {
        failed++;
        console.log(`  ${RED}✗${RESET} ${message}`);
    }
}

async function loadEngine() {
    // Load the Emscripten module
    const engineJsPath = join(wasmDir, 'engine.js');
    const require = createRequire(import.meta.url);

    const mod = require(engineJsPath);
    // Handle CJS/ESM interop: might be mod itself or mod.default
    const createAlgoEngine = typeof mod === 'function' ? mod : mod.default;
    if (typeof createAlgoEngine !== 'function') {
        throw new Error('Could not find createAlgoEngine export. Got: ' + typeof mod);
    }
    const Module = await createAlgoEngine({
        locateFile: (path) => join(wasmDir, path),
    });
    return Module;
}

function runAlgorithm(Module, algoId, input) {
    const inputJson = typeof input === 'string' ? input : JSON.stringify(input);
    const result = Module.ccall(
        'run_algorithm',
        'string',
        ['string', 'string'],
        [algoId, inputJson]
    );
    return JSON.parse(result);
}

function listAlgorithms(Module) {
    const result = Module.ccall('list_algorithms', 'string', [], []);
    return JSON.parse(result);
}

// Checks every trace must satisfy, regardless of algorithm family
function validateCommonTrace(trace, algoId, inputArr) {
    assert(trace.algorithmId === algoId, `algorithmId is "${algoId}"`);
    assert(Array.isArray(trace.codeLines), `codeLines is an array`);
    assert(trace.codeLines.length > 0, `codeLines is non-empty`);
    assert(Array.isArray(trace.steps), `steps is an array`);
    assert(trace.steps.length >= 2, `has at least 2 steps (got ${trace.steps.length})`);

    // Check first step has original array
    const firstStep = trace.steps[0];
    assert(
        JSON.stringify(firstStep.array) === JSON.stringify(inputArr),
        `first step has original array`
    );

    // Check counters are non-decreasing
    let prevComparisons = 0;
    let prevSwaps = 0;
    let valid = true;
    for (const step of trace.steps) {
        if (step.counters.comparisons < prevComparisons || step.counters.swaps < prevSwaps) {
            valid = false;
            break;
        }
        prevComparisons = step.counters.comparisons;
        prevSwaps = step.counters.swaps;
    }
    assert(valid, `counters are non-decreasing across steps`);

    // Check each step has explanation
    assert(
        trace.steps.every(s => typeof s.explanation === 'string' && s.explanation.length > 0),
        `every step has a non-empty explanation`
    );

    // Check codeLine is a number
    assert(
        trace.steps.every(s => typeof s.codeLine === 'number'),
        `every step has a numeric codeLine`
    );
}

// Sorting algorithms end with a fully sorted array
function validateSortTrace(trace, inputArr) {
    const lastStep = trace.steps[trace.steps.length - 1];
    const sorted = [...inputArr].sort((a, b) => a - b);
    assert(
        JSON.stringify(lastStep.array) === JSON.stringify(sorted),
        `last step has sorted array`
    );
    assert(
        lastStep.highlights.length === inputArr.length &&
        lastStep.highlights.every(h => h.type === 'sorted'),
        `last step highlights all elements as "sorted"`
    );
}

// Search algorithms end with an explicit found / not-found result
function validateArrayTrace(trace, finalPattern) {
    const lastStep = trace.steps[trace.steps.length - 1];
    assert(finalPattern.test(lastStep.explanation), `final step describes the result`);
}

function validateSearchTrace(trace, target, shouldFind) {
    const lastStep = trace.steps[trace.steps.length - 1];
    const hasFoundHighlight = trace.steps.some(s =>
        s.highlights.some(h => h.type === 'found')
    );

    assert(
        hasFoundHighlight === shouldFind,
        shouldFind ? `highlights a "found" match` : `no "found" highlight when absent`
    );
    assert(
        lastStep.explanation.includes(String(target)),
        `final step names target ${target}`
    );
    assert(
        shouldFind
            ? /found/i.test(lastStep.explanation)
            : /not present|not found/i.test(lastStep.explanation),
        shouldFind ? `final step says found` : `final step says not present`
    );
}

async function main() {
    console.log(`\n${BOLD}${CYAN}AlgoLens Engine Test Harness${RESET}\n`);

    let Module;
    try {
        Module = await loadEngine();
        console.log(`${GREEN}✓${RESET} WASM module loaded successfully\n`);
    } catch (e) {
        console.error(`${RED}✗${RESET} Failed to load WASM module:`, e.message);
        console.error(`\n  Make sure you ran: .\\\\scripts\\\\build.ps1`);
        process.exit(1);
    }

    // List algorithms
    const algos = listAlgorithms(Module);
    console.log(`${CYAN}Registered algorithms:${RESET} ${algos.join(', ')}\n`);
    assert(algos.length >= 3, `at least 3 algorithms registered (got ${algos.length})`);

    // Every implemented sort and search must be registered
    for (const id of [...SORTS, ...SEARCHES, ...ARRAY_PATTERNS]) {
        assert(algos.includes(id), `registered: ${id}`);
    }

    // Sorting test inputs
    const sortCases = [
        { name: 'normal', input: [5, 3, 1, 4, 2] },
        { name: 'already sorted', input: [1, 2, 3, 4, 5] },
        { name: 'reverse sorted', input: [5, 4, 3, 2, 1] },
        { name: 'single element', input: [42] },
        { name: 'two elements', input: [2, 1] },
        { name: 'duplicates', input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3] },
    ];

    for (const algoId of SORTS) {
        console.log(`\n${BOLD}Testing: ${YELLOW}${algoId}${RESET}`);

        for (const tc of sortCases) {
            console.log(`\n  ${CYAN}Input (${tc.name}):${RESET} [${tc.input.join(', ')}]`);
            try {
                const trace = runAlgorithm(Module, algoId, tc.input);
                validateCommonTrace(trace, algoId, tc.input);
                validateSortTrace(trace, tc.input);
            } catch (e) {
                failed++;
                console.log(`  ${RED}✗ Exception: ${e.message}${RESET}`);
            }
        }
    }

    // Search test inputs (sorted where the algorithm requires it)
    const searchCases = [
        { name: 'target in middle', array: [1, 3, 5, 7, 9, 11], target: 7, shouldFind: true },
        { name: 'target at start', array: [2, 4, 6, 8, 10], target: 2, shouldFind: true },
        { name: 'target absent', array: [1, 2, 3, 4, 5], target: 9, shouldFind: false },
        { name: 'single element hit', array: [42], target: 42, shouldFind: true },
        { name: 'single element miss', array: [42], target: 7, shouldFind: false },
        { name: 'duplicates', array: [2, 2, 3, 7, 7, 7, 9], target: 7, shouldFind: true },
    ];

    for (const algoId of SEARCHES) {
        console.log(`\n${BOLD}Testing: ${YELLOW}${algoId}${RESET}`);

        for (const tc of searchCases) {
            console.log(
                `\n  ${CYAN}Input (${tc.name}):${RESET} [${tc.array.join(', ')}] target ${tc.target}`
            );
            try {
                const trace = runAlgorithm(
                    Module,
                    algoId,
                    { array: tc.array, target: tc.target }
                );
                validateCommonTrace(trace, algoId, tc.array);
                validateSearchTrace(trace, tc.target, tc.shouldFind);
            } catch (e) {
                failed++;
                console.log(`  ${RED}✗ Exception: ${e.message}${RESET}`);
            }
        }
    }

    // Array pattern cases, with a final-result pattern per algorithm
    const arrayCases = {
        'two-pointers': {
            pattern: /pair/i,
            cases: [
                { name: 'pair present', input: { array: [2, 3, 4, 6, 8, 11], target: 10 } },
                { name: 'pair at ends', input: { array: [1, 2, 3, 4, 5], target: 6 } },
                { name: 'no pair', input: { array: [1, 2, 3, 9], target: 20 } },
                { name: 'single element', input: { array: [5], target: 10 } },
                { name: 'duplicates', input: { array: [1, 1, 2, 3, 4], target: 2 } },
            ],
        },
        'sliding-window': {
            pattern: /window/i,
            cases: [
                { name: 'k=3', input: { array: [2, 1, 5, 1, 3, 2], target: 3 } },
                { name: 'k=1', input: { array: [4, 2, 9, 1], target: 1 } },
                { name: 'k=n', input: { array: [1, 2, 3], target: 3 } },
                { name: 'k too large', input: { array: [1, 2], target: 5 } },
                { name: 'negatives', input: { array: [-1, 2, 3, -4, 5], target: 2 } },
            ],
        },
        'kadane': {
            pattern: /maximum subarray/i,
            cases: [
                { name: 'mixed', input: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
                { name: 'all negative', input: [-5, -2, -8] },
                { name: 'all positive', input: [1, 2, 3, 4] },
                { name: 'single', input: [7] },
            ],
        },
        'dutch-flag': {
            pattern: /partition/i,
            cases: [
                { name: 'classic', input: { array: [2, 0, 2, 1, 1, 0], target: 1 } },
                { name: 'pivot absent', input: { array: [3, 1, 2], target: 5 } },
                { name: 'all equal', input: { array: [2, 2, 2], target: 2 } },
                { name: 'single', input: { array: [1], target: 1 } },
                { name: 'duplicates', input: { array: [0, 1, 1, 2, 1, 0], target: 1 } },
            ],
        },
        'prefix-sum': {
            pattern: /prefix/i,
            cases: [
                { name: 'k=4', input: { array: [3, 1, 4, 1, 5, 9, 2, 6], target: 4 } },
                { name: 'k=0', input: { array: [3, 1, 4], target: 0 } },
                { name: 'k=n', input: { array: [3, 1, 4], target: 3 } },
                { name: 'k too large', input: { array: [1, 2], target: 9 } },
                { name: 'negatives', input: { array: [-2, 5, -1], target: 2 } },
            ],
        },
    };

    for (const algoId of ARRAY_PATTERNS) {
        const config = arrayCases[algoId];
        console.log(`\n${BOLD}Testing: ${YELLOW}${algoId}${RESET}`);

        for (const tc of config.cases) {
            const inputArr = Array.isArray(tc.input) ? tc.input : tc.input.array;
            console.log(`\n  ${CYAN}Input (${tc.name}):${RESET} [${inputArr.join(', ')}]`);
            try {
                const trace = runAlgorithm(Module, algoId, tc.input);
                validateCommonTrace(trace, algoId, inputArr);
                validateArrayTrace(trace, config.pattern);
            } catch (e) {
                failed++;
                console.log(`  ${RED}✗ Exception: ${e.message}${RESET}`);
            }
        }
    }

    // Test unknown algorithm
    console.log(`\n${BOLD}Testing: ${YELLOW}unknown algorithm${RESET}`);
    try {
        const trace = runAlgorithm(Module, 'nonexistent', '[1,2,3]');
        assert(trace.steps.length > 0, `unknown algo returns error step`);
        assert(
            trace.steps[0].explanation.includes('Unknown'),
            `error step mentions "Unknown"`
        );
    } catch (e) {
        failed++;
        console.log(`  ${RED}✗ Exception: ${e.message}${RESET}`);
    }

    // Summary
    console.log(`\n${BOLD}${'─'.repeat(40)}${RESET}`);
    console.log(`${BOLD}Results: ${GREEN}${passed} passed${RESET}, ${failed > 0 ? RED : ''}${failed} failed${RESET}`);
    console.log(`${BOLD}${'─'.repeat(40)}${RESET}\n`);

    process.exit(failed > 0 ? 1 : 0);
}

main();
