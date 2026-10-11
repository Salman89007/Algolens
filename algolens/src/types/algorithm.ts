export type AlgorithmCategory =
  | 'sorting'
  | 'searching'
  | 'arrays'
  | 'linked-lists'
  | 'stacks-queues'
  | 'hashing'
  | 'trees'
  | 'graphs'
  | 'dynamic-programming'
  | 'backtracking'
  | 'greedy'
  | 'strings'
  | 'math-bits'
  | 'geometry';

export interface ComplexityInfo {
  best: string;
  average: string;
  worst: string;
  space: string;
  stable: boolean;
  inPlace: boolean;
}

export interface SampleInput {
  label: string;
  description: string;
  input: number[];
}

export interface AlgorithmMeta {
  id: string; // matches C++ registry id: 'bubble-sort', 'merge-sort', 'quick-sort'
  name: string;
  category: AlgorithmCategory;
  categoryLabel: string;
  phase: number;
  isImplemented: boolean;
  shortDescription: string;
  description: string;
  complexity: ComplexityInfo;
  whenToUse: string[];
  keyHighlights: string[];
  defaultInput: number[];
  sampleInputs: SampleInput[];
}
