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
        bg: 'from-slate-300 to-slate-200/90',
        border: 'border-slate-300/80',
        text: 'text-slate-800 font-bold',
        shadow: 'shadow-xs',
        badge: null,
      };
    }

    switch (type) {
      case 'compare':
        return {
          bg: 'from-slate-900 to-slate-800',
          border: 'border-slate-900 ring-2 ring-slate-400/40',
          text: 'text-white font-bold',
          shadow: 'shadow-md shadow-slate-900/20',
          badge: 'CMP',
        };
      case 'swap':
        return {
          bg: 'from-black to-slate-950',
          border: 'border-black ring-2 ring-black/30 scale-105',
          text: 'text-white font-black',
          shadow: 'shadow-xl shadow-black/25',
          badge: 'SWP',
        };
      case 'sorted':
        return {
          bg: 'from-emerald-600 to-emerald-700',
          border: 'border-emerald-600 ring-1 ring-emerald-500/30',
          text: 'text-white font-bold',
          shadow: 'shadow-sm shadow-emerald-600/20',
          badge: '✓',
        };
      case 'pivot':
        return {
          bg: 'from-slate-700 to-slate-800',
          border: 'border-slate-700 ring-2 ring-slate-500/40 scale-102',
          text: 'text-white font-bold',
          shadow: 'shadow-md shadow-slate-800/25',
          badge: 'PIVOT',
        };
      case 'current':
        return {
          bg: 'from-slate-800 to-slate-700',
          border: 'border-slate-800 ring-2 ring-slate-600/30',
          text: 'text-white font-bold',
          shadow: 'shadow-sm',
          badge: 'CURR',
        };
      case 'left':
        return {
          bg: 'from-slate-600 to-slate-700',
          border: 'border-slate-600',
          text: 'text-white font-bold',
          shadow: 'shadow-xs',
          badge: 'L',
        };
      case 'right':
        return {
          bg: 'from-slate-500 to-slate-600',
          border: 'border-slate-500',
          text: 'text-white font-bold',
          shadow: 'shadow-xs',
          badge: 'R',
        };
      default:
        return {
          bg: 'from-slate-800 to-slate-700',
          border: 'border-slate-800',
          text: 'text-white font-bold',
          shadow: 'shadow-xs',
          badge: type.toUpperCase(),
        };
    }
  };

  return (
    <div className="visualizer-canvas relative w-full rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-6 shadow-[0_10px_30px_rgba(0,0,0,0.04)] backdrop-blur-xl flex flex-col justify-between h-[min(44dvh,340px)] min-h-[260px] sm:h-auto sm:min-h-[440px]">
      {/* Visual Canvas Arena */}
      <div className="w-full flex-1 flex items-end justify-center gap-1.5 sm:gap-3 px-2 pb-3 pt-12 rounded-xl bg-gradient-to-b from-slate-50/70 to-slate-100/60 border border-slate-200/60 relative overflow-hidden">
        {/* Subtle dot matrix grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:18px_18px] opacity-60 pointer-events-none" />

        {array.map((val, idx) => {
          const heightPercent = Math.max((val / maxValue) * 100, 14);
          const config = getHighlightConfig(idx);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[58px] transition-all duration-200 z-10"
            >
              {/* Status Badge */}
              <div className="h-6 flex items-center justify-center mb-1">
                {config.badge && (
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-md bg-slate-950 text-white shadow-xs select-none">
                    {config.badge}
                  </span>
                )}
              </div>

              {/* Bar Element */}
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg bg-gradient-to-t border ${config.bg} ${config.border} ${config.shadow} flex flex-col items-center justify-start pt-1.5 transition-all duration-200 relative group`}
              >
                <span className={`text-xs sm:text-sm font-mono tracking-tight select-none ${config.text}`}>
                  {val}
                </span>
              </div>

              {/* Index Subscript */}
              <span className="text-[11px] font-mono font-medium text-slate-400 mt-2 select-none">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Modern Legend */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex flex-wrap items-center justify-center gap-3 sm:gap-6 text-xs font-medium">
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-slate-300 border border-slate-400/60 shadow-2xs" />
          <span className="text-slate-600">Default</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-slate-900 border border-slate-900 shadow-2xs" />
          <span className="text-slate-950 font-bold">Comparing</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-black border border-black shadow-2xs ring-1 ring-slate-400/40" />
          <span className="text-black font-extrabold">Swapping</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-slate-700 border border-slate-700 shadow-2xs" />
          <span className="text-slate-900 font-bold">Pivot</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-3 w-3 rounded-md bg-emerald-600 border border-emerald-600 shadow-2xs" />
          <span className="text-emerald-700 font-bold">Sorted</span>
        </div>
      </div>
    </div>
  );
}
