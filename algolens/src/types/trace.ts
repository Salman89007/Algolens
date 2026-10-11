export type HighlightType =
  | 'compare'
  | 'swap'
  | 'sorted'
  | 'pivot'
  | 'current'
  | 'left'
  | 'right';

export interface Highlight {
  index: number;
  type: HighlightType | string;
}

export interface Counters {
  comparisons: number;
  swaps: number;
  steps: number;
}

export interface Step {
  array: number[];
  highlights: Highlight[];
  codeLine: number;
  explanation: string;
  counters: Counters;
}

export interface Trace {
  algorithmId: string;
  codeLines: string[];
  steps: Step[];
}
