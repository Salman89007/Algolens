import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Code2, Sparkles } from 'lucide-react';
import { useWasmEngine } from '@/hooks/use-wasm-engine';
import type { Trace } from '@/types/trace';

const DEFAULT_HERO_ARRAY = [45, 18, 62, 28, 85, 33, 50];

export function HeroPreview() {
  const { isReady, executeAlgorithm } = useWasmEngine();
  const [trace, setTrace] = useState<Trace | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  useEffect(() => {
    let active = true;
    if (isReady) {
      executeAlgorithm('quick-sort', DEFAULT_HERO_ARRAY)
        .then((result) => {
          if (active) {
            setTrace(result);
            setCurrentStepIdx(0);
          }
        })
        .catch(() => {});
    }
    return () => {
      active = false;
    };
  }, [isReady, executeAlgorithm]);

  useEffect(() => {
    if (!isPlaying || !trace?.steps.length) return;
    const timer = window.setInterval(() => {
      setCurrentStepIdx((index) => (index >= trace.steps.length - 1 ? 0 : index + 1));
    }, 550);
    return () => window.clearInterval(timer);
  }, [isPlaying, trace]);

  const currentStep = trace?.steps[currentStepIdx] || {
    array: DEFAULT_HERO_ARRAY,
    highlights: [],
    codeLine: 1,
    explanation: isReady ? 'Building real C++ trace…' : 'Initializing WebAssembly engine…',
    counters: { comparisons: 0, swaps: 0, steps: 0 },
  };

  const maxValue = Math.max(...currentStep.array, 100);

  const getBarAppearance = (index: number) => {
    const highlight = currentStep.highlights?.find((item) => item.index === index);
    if (!highlight) {
      return {
        bg: 'bg-slate-300 hover:bg-slate-400',
        border: 'border-slate-300',
        text: 'text-slate-600',
        badge: null,
      };
    }

    switch (highlight.type) {
      case 'compare':
        return {
          bg: 'bg-slate-900 shadow-md ring-2 ring-slate-400/40',
          border: 'border-slate-900',
          text: 'text-slate-950 font-bold',
          badge: 'CMP',
        };
      case 'swap':
        return {
          bg: 'bg-black shadow-lg ring-2 ring-black/30 scale-105',
          border: 'border-black',
          text: 'text-black font-extrabold',
          badge: 'SWAP',
        };
      case 'sorted':
        return {
          bg: 'bg-emerald-600 shadow-sm ring-1 ring-emerald-500/30',
          border: 'border-emerald-600',
          text: 'text-emerald-800 font-semibold',
          badge: '✓',
        };
      case 'pivot':
        return {
          bg: 'bg-slate-700 shadow-md ring-2 ring-slate-600/30',
          border: 'border-slate-700',
          text: 'text-slate-900 font-bold',
          badge: 'PIVOT',
        };
      default:
        return {
          bg: 'bg-slate-800',
          border: 'border-slate-800',
          text: 'text-slate-900',
          badge: null,
        };
    }
  };

  const progressPercent = trace
    ? ((currentStepIdx + 1) / trace.steps.length) * 100
    : 10;

  return (
    <div className="relative rounded-2xl border border-slate-200/80 bg-white/80 p-5 sm:p-6 shadow-[0_20px_50px_rgba(0,0,0,0.06),0_1px_3px_rgba(0,0,0,0.04)] backdrop-blur-xl transition-all hover:shadow-[0_24px_60px_rgba(0,0,0,0.09)]">
      {/* Top bar */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900 text-white shadow-sm">
            <Code2 className="h-4 w-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-slate-900">
                Quick Sort
              </span>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-mono font-medium text-slate-700 border border-slate-200/60">
                C++17 WASM
              </span>
            </div>
            <span className="text-xs text-slate-500 font-medium">Real-time memory trace</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full bg-slate-100/90 px-3 py-1 text-xs font-medium text-slate-700 border border-slate-200/50">
          <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
          <span>{trace ? 'Active Engine' : 'Loading…'}</span>
        </div>
      </div>

      {/* Chart visualization */}
      <div
        className="relative flex h-56 sm:h-64 items-end justify-between gap-2 sm:gap-3 rounded-xl border border-slate-200/60 bg-gradient-to-b from-slate-50/70 to-slate-100/60 p-4 sm:p-5"
        aria-label="Interactive Quick Sort array preview"
      >
        {currentStep.array.map((value, index) => {
          const appearance = getBarAppearance(index);
          const heightPercent = Math.max((value / maxValue) * 78, 14);

          return (
            <div
              key={`${index}-${value}`}
              className="flex flex-1 flex-col items-center justify-end h-full gap-2 transition-transform duration-200"
            >
              {/* Value label */}
              <div className="flex flex-col items-center gap-0.5">
                {appearance.badge && (
                  <span className="rounded bg-slate-900 px-1 py-0.2 text-[9px] font-mono font-bold text-white shadow-xs">
                    {appearance.badge}
                  </span>
                )}
                <span className={`text-xs sm:text-sm font-mono font-bold ${appearance.text}`}>
                  {value}
                </span>
              </div>

              {/* Bar element */}
              <div
                className={`w-full max-w-[42px] min-h-[16px] rounded-t-md transition-all duration-300 ease-out ${appearance.bg}`}
                style={{ height: `${heightPercent}%` }}
              />

              {/* Index label */}
              <span className="text-[11px] font-mono text-slate-400 font-medium">
                [{index}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Step explanation & controls */}
      <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
        <div className="flex items-start gap-2.5 min-w-0">
          <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-700">
            <Sparkles className="h-3 w-3" />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-900">
                Step {currentStepIdx + 1}
              </span>
              <span className="text-xs text-slate-400 font-mono">
                / {trace?.steps.length ?? '—'}
              </span>
            </div>
            <p className="text-sm font-medium text-slate-700 leading-snug line-clamp-2 mt-0.5">
              {currentStep.explanation}
            </p>
          </div>
        </div>

        {/* Playback action buttons */}
        <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
          <button
            onClick={() => setIsPlaying((p) => !p)}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm hover:bg-slate-800 active:scale-95 transition-all"
            aria-label={isPlaying ? 'Pause preview' : 'Play preview'}
          >
            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 fill-current ml-0.5" />}
          </button>
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-xs hover:bg-slate-50 hover:text-slate-950 active:scale-95 transition-all"
            aria-label="Restart preview"
          >
            <RotateCcw className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Progress track */}
      <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
        <div
          className="h-full bg-slate-900 transition-all duration-300 ease-linear rounded-full"
          style={{ width: `${progressPercent}%` }}
        />
      </div>
    </div>
  );
}
