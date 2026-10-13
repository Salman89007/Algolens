import { useMemo } from 'react';
import type { Highlight } from '@/types/trace';

interface ArrayBarsProps {
  array: number[];
  highlights: Highlight[];
}

export function ArrayBars({ array, highlights }: ArrayBarsProps) {
  const maxValue = useMemo(() => {
    if (!array || array.length === 0) return 100;
    return Math.max(...array, 10);
  }, [array]);

  const highlightMap = useMemo(() => {
    const map = new Map<number, string>();
    highlights?.forEach((h) => {
      map.set(h.index, h.type);
    });
    return map;
  }, [highlights]);

  const getHighlightConfig = (index: number) => {
    const type = highlightMap.get(index);
    if (!type) {
      return {
        bg: 'from-cyan-500/80 to-blue-600/90',
        border: 'border-cyan-400/40',
        text: 'text-cyan-200',
        shadow: 'shadow-cyan-950/20',
        badge: null,
      };
    }

    switch (type) {
      case 'compare':
        return {
          bg: 'from-amber-400 to-amber-600',
          border: 'border-amber-300 ring-2 ring-amber-400/40',
          text: 'text-amber-100',
          shadow: 'shadow-lg shadow-amber-500/40',
          badge: 'CMP',
        };
      case 'swap':
        return {
          bg: 'from-rose-500 to-rose-700',
          border: 'border-rose-300 ring-2 ring-rose-400/50 scale-105',
          text: 'text-rose-100',
          shadow: 'shadow-xl shadow-rose-500/50',
          badge: 'SWP',
        };
      case 'sorted':
        return {
          bg: 'from-emerald-400 to-emerald-600',
          border: 'border-emerald-300 ring-1 ring-emerald-400/30',
          text: 'text-emerald-100',
          shadow: 'shadow-md shadow-emerald-500/30',
          badge: '✓',
        };
      case 'pivot':
        return {
          bg: 'from-purple-500 to-violet-700',
          border: 'border-purple-300 ring-2 ring-purple-400/50 scale-105',
          text: 'text-purple-100',
          shadow: 'shadow-xl shadow-purple-500/40',
          badge: 'PIVOT',
        };
      case 'current':
        return {
          bg: 'from-sky-400 to-sky-600',
          border: 'border-sky-300 ring-2 ring-sky-400/40',
          text: 'text-sky-100',
          shadow: 'shadow-md shadow-sky-500/30',
          badge: 'CURR',
        };
      case 'left':
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-300',
          text: 'text-blue-100',
          shadow: 'shadow-md shadow-blue-500/30',
          badge: 'L',
        };
      case 'right':
        return {
          bg: 'from-teal-400 to-teal-600',
          border: 'border-teal-300',
          text: 'text-teal-100',
          shadow: 'shadow-md shadow-teal-500/30',
          badge: 'R',
        };
      default:
        return {
          bg: 'from-cyan-400 to-blue-500',
          border: 'border-cyan-300',
          text: 'text-cyan-100',
          shadow: 'shadow-md shadow-cyan-500/30',
          badge: type.toUpperCase(),
        };
    }
  };

  return (
    <div className="relative w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 sm:p-6 backdrop-blur-xl flex flex-col justify-between min-h-[280px] sm:min-h-[420px]">
      {/* Visual Canvas */}
      <div className="w-full flex-1 flex items-end justify-center gap-1.5 sm:gap-3 px-2 pb-2 pt-10 rounded-xl bg-slate-900/60 border border-white/5 relative overflow-hidden">
        {/* Subtle grid lines background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

        {array.map((val, idx) => {
          const heightPercent = Math.max((val / maxValue) * 100, 12);
          const config = getHighlightConfig(idx);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[56px] transition-all duration-200 z-10"
            >
              {/* Status Badge */}
              <div className="h-5 flex items-center justify-center mb-1">
                {config.badge && (
                  <span className="text-[9px] font-mono font-bold px-1 py-0.5 rounded bg-black/60 text-white border border-white/20 select-none animate-in fade-in">
                    {config.badge}
                  </span>
                )}
              </div>

              {/* Bar Element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg bg-gradient-to-t border ${config.bg} ${config.border} ${config.shadow} flex flex-col items-center justify-start pt-1.5 transition-all duration-200 relative group`}
              >
                <span className={`text-sm font-mono font-bold tracking-tight select-none ${config.text}`}>
                  {val}
                </span>
              </div>

              {/* Index Subscript */}
              <span className="text-sm font-mono text-slate-500 mt-2 select-none">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend Footer */}
      <div className="mt-4 pt-3 border-t border-white/10 flex flex-wrap items-center justify-center gap-4 text-sm">
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gradient-to-t from-cyan-500 to-blue-600 border border-cyan-400" />
          <span className="text-slate-400">Default</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gradient-to-t from-amber-400 to-amber-600 border border-amber-300" />
          <span className="text-amber-300 font-medium">Comparing</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gradient-to-t from-rose-500 to-rose-700 border border-rose-300" />
          <span className="text-rose-300 font-medium">Swapping</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gradient-to-t from-purple-500 to-violet-700 border border-purple-300" />
          <span className="text-purple-300 font-medium">Pivot</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-gradient-to-t from-emerald-400 to-emerald-600 border border-emerald-300" />
          <span className="text-emerald-300 font-medium">Sorted</span>
        </div>
      </div>
    </div>
  );
}
