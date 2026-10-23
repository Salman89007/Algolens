import { Info, CheckCircle2, ShieldCheck, Cpu } from 'lucide-react';
import type { AlgorithmMeta } from '@/types/algorithm';

interface InfoCardProps {
  algorithm: AlgorithmMeta;
}

export function InfoCard({ algorithm }: InfoCardProps) {
  const { complexity } = algorithm;

  return (
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-5 sm:p-6 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Info className="h-4 w-4 text-slate-700" />
          <span className="text-sm font-bold text-slate-900 font-heading">
            Algorithm Analysis
          </span>
        </div>
        <span className="text-xs font-mono font-semibold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-0.5 rounded-full">
          {algorithm.categoryLabel}
        </span>
      </div>

      {/* Description */}
      <div>
        <h4 className="text-sm font-bold text-slate-900 mb-1.5 font-heading">
          {algorithm.name} Overview
        </h4>
        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-medium">
          {algorithm.description}
        </p>
      </div>

      {/* Complexity Matrix */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-3 font-mono">
          Asymptotic Complexities
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Best Time</span>
            <span className="text-sm font-mono font-bold text-slate-900">{complexity.best}</span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Average Time</span>
            <span className="text-sm font-mono font-bold text-slate-950 font-black">{complexity.average}</span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Worst Time</span>
            <span className="text-sm font-mono font-bold text-slate-900">{complexity.worst}</span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/80 p-3">
            <span className="text-[10px] uppercase font-mono text-slate-500 block">Space Aux</span>
            <span className="text-sm font-mono font-bold text-slate-900">{complexity.space}</span>
          </div>
        </div>

        {/* Properties: Stability and In-place */}
        <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <ShieldCheck className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 font-medium">Stable Sort:</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {complexity.stable ? 'Yes' : 'No'}
            </span>
          </div>

          <div className="rounded-xl border border-slate-200/80 bg-slate-50/60 p-3 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <Cpu className="h-4 w-4 text-slate-500" />
              <span className="text-slate-600 font-medium">In-Place:</span>
            </div>
            <span className="font-mono font-bold text-slate-900">
              {complexity.inPlace ? 'Yes' : 'No (Aux memory)'}
            </span>
          </div>
        </div>
      </div>

      {/* When to Use */}
      <div>
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2 font-mono">
          When to Use
        </h4>
        <ul className="space-y-2 text-xs sm:text-sm text-slate-600 font-medium">
          {algorithm.whenToUse.map((point, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <CheckCircle2 className="h-4 w-4 text-slate-900 shrink-0 mt-0.5" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
