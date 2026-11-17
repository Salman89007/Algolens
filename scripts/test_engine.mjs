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

// Array patterns must report the result they actually computed
function finalStep(trace) {
    return trace.steps[trace.steps.length - 1];
}

function indicesOfType(step, type) {
    return step.highlights
        .filter(h => h.type === type)
        .map(h => h.index)
        .sort((a, b) => a - b);
}

function sumAt(arr, indices) {
    return indices.reduce((total, i) => total + arr[i], 0);
}

function caseArray(input) {
    return Array.isArray(input) ? input : input.array;
}

function caseTarget(input) {
    return Array.isArray(input) ? undefined : input.target;
}

// Expected maximum sum over every non-empty contiguous subarray
function bruteForceMaxSubarray(arr) {
    let best = -Infinity;
    for (let start = 0; start < arr.length; start++) {
        let sum = 0;
        for (let end = start; end < arr.length; end++) {
            sum += arr[end];
            if (sum > best) best = sum;
        }
    }
    return best;
}

function bruteForceMaxWindowSum(arr, k) {
    let best = -Infinity;
    for (let start = 0; start + k <= arr.length; start++) {
        let sum = 0;
        for (let i = start; i < start + k; i++) sum += arr[i];
        if (sum > best) best = sum;
    }
    return best;
}

function valueCounts(arr) {
    const counts = new Map();
    for (const value of arr) counts.set(value, (counts.get(value) ?? 0) + 1);
    return [...counts.entries()].sort((a, b) => a[0] - b[0]);
}

function validateTwoPointers(trace, input) {
    const arr = caseArray(input);
    const target = caseTarget(input);
    const last = finalStep(trace);

    let pairExists = false;
    for (let i = 0; i < arr.length && !pairExists; i++) {
        for (let j = i + 1; j < arr.length; j++) {
            if (arr[i] + arr[j] === target) {
                pairExists = true;
                break;
            }
        }
    }

    if (pairExists) {
        const found = indicesOfType(last, 'found');
        assert(found.length === 2, `final step highlights exactly two pair indices (got ${found.length})`);
        const values = found.map(i => arr[i]).sort((a, b) => a - b);
        assert(
            values.length === 2 && values[0] + values[1] === target,
            `highlighted pair ${values[0]} + ${values[1]} equals target ${target}`
        );
        assert(
            last.explanation.includes(`(${values[0]}, ${values[1]})`),
            `final step names the pair (${values[0]}, ${values[1]})`
        );
    } else {
        assert(
            !trace.steps.some(s => s.highlights.some(h => h.type === 'found')),
            `no pair highlighted when none sums to ${target}`
        );
        assert(
            last.explanation === `No pair sums to target ${target}`,
            `final step reports that no pair sums to ${target}`
        );
    }
}

function validateSlidingWindow(trace, input) {
    const arr = caseArray(input);
    const k = caseTarget(input);
    const last = finalStep(trace);

    if (k <= 0 || k > arr.length) {
        assert(/invalid/i.test(last.explanation), `rejects window size ${k} for ${arr.length} elements`);
        assert(indicesOfType(last, 'found').length === 0, `invalid window size ${k} produces no result highlight`);
        return;
    }

    const best = bruteForceMaxWindowSum(arr, k);
    const found = indicesOfType(last, 'found');
    assert(found.length === k, `final step highlights exactly ${k} window elements`);
    assert(
        found.length > 0 && found[found.length - 1] - found[0] === k - 1,
        `highlighted window is contiguous`
    );
    assert(sumAt(arr, found) === best, `highlighted window sums to maximum window sum ${best}`);
    assert(last.explanation.endsWith(`is ${best}`), `final step reports maximum window sum ${best}`);
}

function validateKadane(trace, input) {
    const arr = caseArray(input);
    if (arr.length === 0) return;

    const best = bruteForceMaxSubarray(arr);
    const last = finalStep(trace);
    const found = indicesOfType(last, 'found');

    assert(
        found.length > 0 && found[found.length - 1] - found[0] === found.length - 1,
        `final best subarray is contiguous`
    );
    assert(sumAt(arr, found) === best, `highlighted subarray sums to maximum subarray sum ${best}`);
    assert(
        last.explanation.includes(`Maximum subarray sum is ${best}`),
        `final step reports maximum subarray sum ${best}`
    );
}

function validateDutchFlag(trace, input) {
    const arr = caseArray(input);
    const pivot = caseTarget(input);
    const last = finalStep(trace);

    assert(
        JSON.stringify(valueCounts(last.array)) === JSON.stringify(valueCounts(arr)),
        `final array is a permutation of the input`
    );

    const regions = last.array.map(v => (v < pivot ? -1 : v > pivot ? 1 : 0));
    assert(
        regions.every((r, i) => i === 0 || regions[i - 1] <= r),
        `final array is ordered smaller | equal | larger around pivot ${pivot}`
    );

    const lastSmaller = regions.lastIndexOf(-1);
    const firstLarger = regions.indexOf(1);
    assert(
        lastSmaller === -1 || firstLarger === -1 || lastSmaller < firstLarger,
        `every smaller value sits left of every larger value`
    );
    assert(
        /Partition complete/.test(last.explanation) && last.explanation.includes(`pivot ${pivot}`),
        `final step describes the completed partition around pivot ${pivot}`
    );
}

function validatePrefixSum(trace, input) {
    const arr = caseArray(input);
    const n = arr.length;
    const k = Math.max(0, Math.min(caseTarget(input), n));

    const prefix = [0];
    for (const value of arr) prefix.push(prefix[prefix.length - 1] + value);

    const last = finalStep(trace);
    assert(
        JSON.stringify(last.array) === JSON.stringify(prefix),
        `final step shows the full prefix-sum array [${prefix.join(', ')}]`
    );

    let running = 0;
    let cumulative = last.array.length === n + 1;
    for (let i = 1; i < last.array.length && cumulative; i++) {
        running += arr[i - 1];
        if (last.array[i] !== running) cumulative = false;
    }
    assert(cumulative, `every prefix entry is the running total of all earlier values`);

    const expected = prefix[k];
    assert(last.explanation.includes(`is ${expected}`), `final step reports prefix total ${expected} for k=${k}`);
    assert(
        JSON.stringify(indicesOfType(last, 'found')) === JSON.stringify([k]),
        `final step highlights prefix index ${k}`
    );
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
            validate: validateTwoPointers,
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
            validate: validateSlidingWindow,
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
            validate: validateKadane,
            cases: [
                { name: 'mixed', input: [-2, 1, -3, 4, -1, 2, 1, -5, 4] },
                { name: 'all negative', input: [-5, -2, -8] },
                { name: 'all positive', input: [1, 2, 3, 4] },
                { name: 'single', input: [7] },
            ],
        },
        'dutch-flag': {
            pattern: /partition/i,
            validate: validateDutchFlag,
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
            validate: validatePrefixSum,
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
                assert(
                    config.pattern.test(finalStep(trace).explanation),
                    `final step describes the result`
                );
                config.validate(trace, tc.input);
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
