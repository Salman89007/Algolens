import { ArrowLeftRight, CheckCheck, Hash, Layers } from 'lucide-react';
import type { Counters } from '@/types/trace';

interface CountersPanelProps {
  counters: Counters;
  arraySize: number;
}

export function CountersPanel({ counters, arraySize }: CountersPanelProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full">
      {/* Comparisons */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all hover:border-slate-300">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Comparisons
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
            <ArrowLeftRight className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
          {counters.comparisons}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">Elements evaluated</div>
      </div>

      {/* Swaps */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all hover:border-slate-300">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Swaps
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
            <CheckCheck className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
          {counters.swaps}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">Positions exchanged</div>
      </div>

      {/* Engine Steps */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all hover:border-slate-300">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Total Steps
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
            <Hash className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
          {counters.steps}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">Atomic trace frames</div>
      </div>

      {/* Array Size */}
      <div className="rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-[0_4px_16px_rgba(0,0,0,0.02)] backdrop-blur-md transition-all hover:border-slate-300">
        <div className="flex items-center justify-between text-slate-500 mb-2">
          <span className="text-xs font-semibold uppercase tracking-wider">
            Array Size (n)
          </span>
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-100 text-slate-800">
            <Layers className="h-3.5 w-3.5" />
          </div>
        </div>
        <div className="text-2xl sm:text-3xl font-black font-mono text-slate-950 tracking-tight">
          {arraySize}
        </div>
        <div className="text-xs text-slate-500 mt-1 font-medium">Input elements count</div>
      </div>
    </div>
  );
}
