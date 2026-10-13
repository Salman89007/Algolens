import { Info, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import type { AlgorithmMeta } from '@/types/algorithm';

interface InfoCardProps {
  algorithm: AlgorithmMeta;
}

export function InfoCard({ algorithm }: InfoCardProps) {
  const { complexity } = algorithm;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Algorithm Analysis</span>
        </div>
        <span className="text-sm font-mono text-cyan-400 bg-cyan-500/10 border border-cyan-500/20 px-2 py-0.5 rounded">
          {algorithm.categoryLabel}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-bold text-slate-100 mb-1.5">{algorithm.name} Overview</h4>
        <p className="text-base text-slate-300 leading-relaxed">{algorithm.description}</p>
      </div>

      {/* Complexity Matrix */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-3">
          Asymptotic Complexities
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
            <span className="text-sm uppercase font-mono text-slate-400 block">Best Time</span>
            <span className="text-base font-mono font-bold text-emerald-400">{complexity.best}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
            <span className="text-sm uppercase font-mono text-slate-400 block">Average Time</span>
            <span className="text-base font-mono font-bold text-cyan-300">{complexity.average}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
            <span className="text-sm uppercase font-mono text-slate-400 block">Worst Time</span>
            <span className="text-base font-mono font-bold text-rose-400">{complexity.worst}</span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/80 p-3">
            <span className="text-sm uppercase font-mono text-slate-400 block">Space Aux</span>
            <span className="text-base font-mono font-bold text-indigo-300">{complexity.space}</span>
          </div>
        </div>

        {/* Properties: Stability and In-place */}
        <div className="mt-3 grid grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">Stable Sort:</span>
            </div>
            <span
              className={`font-mono font-semibold ${
                complexity.stable ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {complexity.stable ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="rounded-xl border border-white/5 bg-slate-900/60 p-2.5 flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-400" />
              <span className="text-slate-300">In-Place:</span>
            </div>
            <span
              className={`font-mono font-semibold ${
                complexity.inPlace ? 'text-emerald-400' : 'text-amber-400'
              }`}
            >
              {complexity.inPlace ? 'Yes' : 'No (Aux array)'}
            </span>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div>
        <h4 className="text-sm font-semibold uppercase tracking-wider text-slate-400 mb-2">
          When to Use
        </h4>
        <ul className="space-y-1.5 text-base text-slate-300">
          {algorithm.whenToUse.map((point, i) => (
            <li key={i} className="flex items-start gap-2">
              <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
