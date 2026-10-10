/**
 * Node.js test harness for AlgoLens WASM engine.
 * Tests all registered algorithms and validates trace output.
 *
 * Usage: node scripts/test_engine.mjs
 */

import { readFileSync } from 'fs';
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
    const result = Module.ccall(
        'run_algorithm',
        'string',
        ['string', 'string'],
        [algoId, input]
    );
    return JSON.parse(result);
}

function listAlgorithms(Module) {
    const result = Module.ccall('list_algorithms', 'string', [], []);
    return JSON.parse(result);
}

function validateTrace(trace, algoId, inputArr) {
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

    // Check last step is sorted
    const lastStep = trace.steps[trace.steps.length - 1];
    const sorted = [...inputArr].sort((a, b) => a - b);
    assert(
        JSON.stringify(lastStep.array) === JSON.stringify(sorted),
        `last step has sorted array`
    );

    // Check all sorted highlights on last step
    assert(
        lastStep.highlights.length === inputArr.length &&
        lastStep.highlights.every(h => h.type === 'sorted'),
        `last step highlights all elements as "sorted"`
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

async function main() {
    console.log(`\n${BOLD}${CYAN}AlgoLens Engine Test Harness${RESET}\n`);

    let Module;
    try {
        Module = await loadEngine();
        console.log(`${GREEN}✓${RESET} WASM module loaded successfully\n`);
    } catch (e) {
        console.error(`${RED}✗${RESET} Failed to load WASM module:`, e.message);
        console.error(`\n  Make sure you ran: .\\scripts\\build.ps1`);
        process.exit(1);
    }

    // List algorithms
    const algos = listAlgorithms(Module);
    console.log(`${CYAN}Registered algorithms:${RESET} ${algos.join(', ')}\n`);
    assert(algos.length >= 3, `at least 3 algorithms registered (got ${algos.length})`);

    // Test inputs
    const testCases = [
        { name: 'normal', input: [5, 3, 1, 4, 2] },
        { name: 'already sorted', input: [1, 2, 3, 4, 5] },
        { name: 'reverse sorted', input: [5, 4, 3, 2, 1] },
        { name: 'single element', input: [42] },
        { name: 'two elements', input: [2, 1] },
        { name: 'duplicates', input: [3, 1, 4, 1, 5, 9, 2, 6, 5, 3] },
    ];

    for (const algoId of algos) {
        console.log(`\n${BOLD}Testing: ${YELLOW}${algoId}${RESET}`);

        for (const tc of testCases) {
            console.log(`\n  ${CYAN}Input (${tc.name}):${RESET} [${tc.input.join(', ')}]`);
            try {
                const trace = runAlgorithm(Module, algoId, JSON.stringify(tc.input));
                validateTrace(trace, algoId, tc.input);
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
