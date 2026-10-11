import type { AlgorithmMeta } from '@/types/algorithm';

export const ALGORITHMS: AlgorithmMeta[] = [
  {
    id: 'bubble-sort',
    name: 'Bubble Sort',
    category: 'sorting',
    categoryLabel: 'Sorting',
    phase: 1,
    isImplemented: true,
    shortDescription: 'Repeatedly steps through the list, compares adjacent elements, and swaps them if in wrong order.',
    description:
      'Bubble Sort is an intuitive comparison-based sorting algorithm. It traverses through an array from left to right, comparing adjacent elements and swapping them if they are in the wrong order. With each pass, the largest unsorted element "bubbles up" to its correct position at the end of the array.',
    complexity: {
      best: 'O(n)',
      average: 'O(n²)',
      worst: 'O(n²)',
      space: 'O(1)',
      stable: true,
      inPlace: true,
    },
    whenToUse: [
      'Educational demonstration of sorting basics and loop invariants.',
      'Small datasets or lists that are already nearly sorted (with early termination check).',
      'When an extremely simple in-place, stable sort is desired without additional memory overhead.',
    ],
    keyHighlights: [
      'Simple adjacent comparisons and pairwise swaps',
      'Guaranteed stability preserving relative order of equal items',
      'Early termination when no swaps occur in a pass',
    ],
    defaultInput: [5, 3, 8, 4, 2, 7, 1, 6],
    sampleInputs: [
      {
        label: 'Random Mixed',
        description: 'Standard unsorted array with mixed values',
        input: [5, 3, 8, 4, 2, 7, 1, 6],
      },
      {
        label: 'Nearly Sorted',
        description: 'Array with only 1-2 elements out of order',
        input: [1, 2, 4, 3, 5, 6, 8, 7],
      },
      {
        label: 'Reverse Sorted',
        description: 'Worst-case input requiring maximum swaps',
        input: [9, 8, 7, 6, 5, 4, 3, 2, 1],
      },
      {
        label: 'With Duplicates',
        description: 'Demonstrating algorithm stability with duplicate values',
        input: [4, 2, 7, 2, 9, 4, 1, 5],
      },
      {
        label: 'Small Array',
        description: 'Quick 5-element array for step-by-step inspection',
        input: [5, 3, 1, 4, 2],
      },
    ],
  },
  {
    id: 'merge-sort',
    name: 'Merge Sort',
    category: 'sorting',
    categoryLabel: 'Sorting',
    phase: 1,
    isImplemented: true,
    shortDescription: 'Divide-and-conquer algorithm that recursively splits the array and merges sorted halves.',
    description:
      'Merge Sort is a quintessential divide-and-conquer sorting algorithm. It divides the input array into two halves, recursively sorts each half, and then systematically merges the two sorted sub-arrays back together into a single sorted array. It guarantees O(n log n) worst-case time complexity.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n log n)',
      space: 'O(n)',
      stable: true,
      inPlace: false,
    },
    whenToUse: [
      'When predictable, guaranteed O(n log n) runtime performance is required.',
      'Sorting linked lists where auxiliary space allocation can be avoided.',
      'External sorting when datasets exceed available RAM and stream from disk.',
      'When stable sorting is strictly necessary for compound object keys.',
    ],
    keyHighlights: [
      'Guaranteed O(n log n) time across all input distributions',
      'Recursive divide-and-conquer decomposition',
      'Two-pointer linear merge step with auxiliary array buffer',
    ],
    defaultInput: [38, 27, 43, 3, 9, 82, 10],
    sampleInputs: [
      {
        label: 'Textbook Example',
        description: 'Classic textbook unsorted sequence',
        input: [38, 27, 43, 3, 9, 82, 10],
      },
      {
        label: 'Reverse Sorted',
        description: 'Reverse order showing balanced recursion tree',
        input: [80, 70, 60, 50, 40, 30, 20, 10],
      },
      {
        label: 'Equal Values',
        description: 'Testing merge stability on duplicate values',
        input: [6, 2, 6, 1, 9, 2, 6, 4],
      },
      {
        label: 'Power of Two',
        description: '8 elements for a perfectly balanced recursion tree',
        input: [14, 7, 3, 12, 9, 11, 6, 2],
      },
      {
        label: 'Small Array',
        description: '5-element array for easy step-by-step tracing',
        input: [5, 3, 1, 4, 2],
      },
    ],
  },
  {
    id: 'quick-sort',
    name: 'Quick Sort',
    category: 'sorting',
    categoryLabel: 'Sorting',
    phase: 1,
    isImplemented: true,
    shortDescription: 'Picks a pivot and partitions the array around it, then sorts sub-arrays recursively.',
    description:
      'Quick Sort is a highly efficient divide-and-conquer sorting algorithm. It selects a pivot element from the array and partitions the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively in-place with minimal memory overhead.',
    complexity: {
      best: 'O(n log n)',
      average: 'O(n log n)',
      worst: 'O(n²)',
      space: 'O(log n)',
      stable: false,
      inPlace: true,
    },
    whenToUse: [
      'General-purpose internal sorting where cache locality and low constants matter.',
      'Systems with tight memory constraints requiring in-place sorting.',
      'Default sorting library primitive (e.g. C qsort, C++ std::sort intro-sort core).',
    ],
    keyHighlights: [
      'Lomuto / Hoare partitioning with in-place swaps',
      'Pivot element isolation and color highlighting',
      'Excellent CPU cache performance in real-world benchmarks',
    ],
    defaultInput: [10, 80, 30, 90, 40, 50, 70],
    sampleInputs: [
      {
        label: 'Classic Partition',
        description: 'Standard array with clear pivot transitions',
        input: [10, 80, 30, 90, 40, 50, 70],
      },
      {
        label: 'Already Sorted',
        description: 'Shows pivot behavior when already sorted',
        input: [10, 20, 30, 40, 50, 60, 70],
      },
      {
        label: 'Reverse Sorted',
        description: 'Reveals recursion depth with reversed data',
        input: [70, 60, 50, 40, 30, 20, 10],
      },
      {
        label: 'Many Duplicates',
        description: 'Partitioning array with recurring values',
        input: [40, 10, 40, 70, 40, 20, 90, 40],
      },
      {
        label: 'Small Array',
        description: '5-element array for clean debugging',
        input: [5, 3, 1, 4, 2],
      },
    ],
  },
];

export const ALL_CATEGORIES = [
  { id: 'sorting', name: 'Sorting', count: 10, implemented: 3, icon: 'ArrowUpDown' },
  { id: 'searching', name: 'Searching', count: 5, implemented: 0, icon: 'Search' },
  { id: 'arrays', name: 'Array Patterns', count: 5, implemented: 0, icon: 'Grid' },
  { id: 'linked-lists', name: 'Linked Lists', count: 4, implemented: 0, icon: 'GitCommit' },
  { id: 'stacks-queues', name: 'Stacks & Queues', count: 5, implemented: 0, icon: 'Layers' },
  { id: 'hashing', name: 'Hashing', count: 4, implemented: 0, icon: 'Hash' },
  { id: 'trees', name: 'Trees & Heaps', count: 9, implemented: 0, icon: 'Network' },
  { id: 'graphs', name: 'Graph Algorithms', count: 12, implemented: 0, icon: 'Share2' },
  { id: 'dynamic-programming', name: 'Dynamic Programming', count: 8, implemented: 0, icon: 'Table' },
  { id: 'backtracking', name: 'Backtracking', count: 5, implemented: 0, icon: 'Undo2' },
  { id: 'greedy', name: 'Greedy Algorithms', count: 3, implemented: 0, icon: 'Zap' },
  { id: 'strings', name: 'String Algorithms', count: 5, implemented: 0, icon: 'FileText' },
  { id: 'math-bits', name: 'Math & Bit Manipulation', count: 4, implemented: 0, icon: 'Binary' },
  { id: 'geometry', name: 'Computational Geometry', count: 1, implemented: 0, icon: 'Shapes' },
];

export function getAlgorithmById(id: string): AlgorithmMeta | undefined {
  return ALGORITHMS.find((a) => a.id === id);
}
