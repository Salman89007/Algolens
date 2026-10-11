import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Cpu, Sparkles } from 'lucide-react';
import { useWasmEngine } from '@/hooks/use-wasm-engine';
import type { Trace } from '@/types/trace';

const DEFAULT_HERO_ARRAY = [45, 18, 62, 28, 85, 33, 50];

export function HeroPreview() {
  const { isReady, executeAlgorithm } = useWasmEngine();
  const [trace, setTrace] = useState<Trace | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  // Load quick-sort trace for hero preview
  useEffect(() => {
    let active = true;
    if (isReady) {
      executeAlgorithm('quick-sort', DEFAULT_HERO_ARRAY)
        .then((res) => {
          if (active) {
            setTrace(res);
            setCurrentStepIdx(0);
          }
        })
        .catch(() => {
          // If wasm is still warming up, fallback trace
        });
    }
    return () => {
      active = false;
    };
  }, [isReady, executeAlgorithm]);

  // Autoplay loop
  useEffect(() => {
    if (!isPlaying || !trace || trace.steps.length === 0) return;

    const timer = setInterval(() => {
      setCurrentStepIdx((prev) => {
        if (prev >= trace.steps.length - 1) {
          return 0; // loop back
        }
        return prev + 1;
      });
    }, 600);

    return () => clearInterval(timer);
  }, [isPlaying, trace]);

  const currentStep = trace?.steps[currentStepIdx] || {
    array: DEFAULT_HERO_ARRAY,
    highlights: [],
    codeLine: 1,
    explanation: 'Initializing C++ WebAssembly engine...',
    counters: { comparisons: 0, swaps: 0, steps: 0 },
  };

  const maxValue = Math.max(...currentStep.array, 100);

  const getBarColor = (index: number) => {
    const highlight = currentStep.highlights?.find((h) => h.index === index);
    if (!highlight) {
      return 'from-cyan-500/80 to-blue-600/80 border-cyan-400/40 text-cyan-200';
    }

    switch (highlight.type) {
      case 'compare':
        return 'from-amber-400 to-amber-600 border-amber-300 text-amber-100 shadow-lg shadow-amber-500/30';
      case 'swap':
        return 'from-rose-500 to-rose-700 border-rose-300 text-rose-100 shadow-lg shadow-rose-500/30 scale-105';
      case 'sorted':
        return 'from-emerald-400 to-emerald-600 border-emerald-300 text-emerald-100 shadow-lg shadow-emerald-500/30';
      case 'pivot':
        return 'from-purple-500 to-violet-700 border-purple-300 text-purple-100 shadow-lg shadow-purple-500/40 scale-105';
      default:
        return 'from-cyan-400 to-blue-500 border-cyan-300 text-cyan-100';
    }
  };

  return (
    <div className="relative rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
      {/* Glow highlight */}
      <div className="absolute -top-px left-10 right-10 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent opacity-75" />

      {/* Header bar */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Cpu className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-semibold text-slate-200">
            Live Preview: <span className="text-cyan-400 font-mono">quick_sort.cpp</span>
          </span>
          <span className="inline-flex items-center gap-1 rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono text-emerald-400 border border-emerald-500/20">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            WASM Active
          </span>
        </div>

        {/* Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
            title={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5" />}
          </button>
          <button
            onClick={() => setCurrentStepIdx(0)}
            className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 bg-white/5 text-slate-300 hover:text-cyan-300 hover:border-cyan-500/30 transition-colors"
            title="Reset"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Visualization Canvas */}
      <div className="h-44 w-full flex items-end justify-center gap-2.5 sm:gap-3.5 px-2 pb-2 pt-6 rounded-xl bg-slate-900/60 border border-white/5 relative">
        {currentStep.array.map((val, idx) => {
          const heightPercent = Math.max((val / maxValue) * 100, 15);
          const colorClasses = getBarColor(idx);

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col items-center justify-end h-full max-w-[42px] transition-all duration-300"
            >
              <div
                style={{ height: `${heightPercent}%` }}
                className={`w-full rounded-t-lg bg-gradient-to-t border ${colorClasses} flex items-center justify-center transition-all duration-300 relative group`}
              >
                <span className="text-[11px] font-mono font-bold tracking-tight select-none">
                  {val}
                </span>
              </div>
              <span className="text-[10px] font-mono text-slate-500 mt-1.5 select-none">
                [{idx}]
              </span>
            </div>
          );
        })}
      </div>

      {/* Explanation Banner */}
      <div className="mt-4 rounded-lg bg-slate-900/90 border border-white/10 px-3 py-2 text-xs flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 truncate text-slate-300">
          <Sparkles className="h-3.5 w-3.5 text-cyan-400 shrink-0" />
          <span className="font-mono text-slate-400 text-[11px] shrink-0">
            Step {currentStepIdx + 1}/{trace?.steps.length || 1}:
          </span>
          <span className="truncate text-slate-200">{currentStep.explanation}</span>
        </div>
        <div className="flex items-center gap-2 shrink-0 font-mono text-[10px] text-slate-400">
          <span className="hidden sm:inline">Cmp: {currentStep.counters.comparisons}</span>
          <span className="hidden sm:inline">Swp: {currentStep.counters.swaps}</span>
        </div>
      </div>
    </div>
  );
}
