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
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Comparisons
          </span>
          <ArrowLeftRight className="h-4 w-4 text-amber-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {counters.comparisons}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Elements evaluated</div>
      </div>

      {/* Swaps */}
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Swaps
          </span>
          <CheckCheck className="h-4 w-4 text-rose-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {counters.swaps}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Positions exchanged</div>
      </div>

      {/* Engine Steps */}
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Total Steps
          </span>
          <Hash className="h-4 w-4 text-cyan-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {counters.steps}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Atomic trace frames</div>
      </div>

      {/* Array Size */}
      <div className="rounded-xl border border-white/10 bg-slate-950/70 p-3.5 backdrop-blur-md">
        <div className="flex items-center justify-between text-slate-400 mb-1">
          <span className="text-[11px] font-semibold uppercase tracking-wider">
            Array Size (n)
          </span>
          <Layers className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="text-2xl font-bold font-mono text-white">
          {arraySize}
        </div>
        <div className="text-[10px] text-slate-500 mt-0.5">Input elements count</div>
      </div>
    </div>
  );
}
