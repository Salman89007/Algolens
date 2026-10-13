import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router';
import {
  Sparkles,
  Share2,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { ALGORITHMS, getAlgorithmById } from '@/lib/algorithms-registry';
import { useWasmEngine } from '@/hooks/use-wasm-engine';
import type { Trace, Step } from '@/types/trace';
import { ArrayBars } from '@/components/visualizer/array-bars';
import { PlaybackControls } from '@/components/visualizer/playback-controls';
import { CodePanel, MobileCodeWindow } from '@/components/visualizer/code-panel';
import { CountersPanel } from '@/components/visualizer/counters-panel';
import { CustomInputCard } from '@/components/visualizer/custom-input-card';
import { InfoCard } from '@/components/visualizer/info-card';

export default function Visualizer() {
  const { algoId = 'bubble-sort' } = useParams<{ algoId: string }>();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const { isReady, executeAlgorithm } = useWasmEngine();

  // Find meta
  const currentAlgo = getAlgorithmById(algoId) || ALGORITHMS[0];

  // Parse initial array from URL or default
  const getInitialInput = useCallback((): number[] => {
    const dataParam = searchParams.get('data');
    if (dataParam) {
      try {
        const parsed = dataParam
          .split(',')
          .map((n) => Number(n.trim()))
          .filter((n) => !isNaN(n));
        if (parsed.length > 0) return parsed;
      } catch {
        // ignore
      }
    }
    return currentAlgo.defaultInput;
  }, [searchParams, currentAlgo]);

  const [inputArray, setInputArray] = useState<number[]>(getInitialInput);
  const [trace, setTrace] = useState<Trace | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);
  const [loadingTrace, setLoadingTrace] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Re-run algorithm trace when algoId or inputArray changes
  const runTrace = useCallback(
    async (id: string, input: number[]) => {
      setLoadingTrace(true);
      setTraceError(null);
      try {
        const result = await executeAlgorithm(id, input);
        setTrace(result);
        setCurrentStepIdx(0);
        setIsPlaying(false);
      } catch (err: any) {
        setTraceError(err?.message || 'Error generating trace from WASM engine');
      } finally {
        setLoadingTrace(false);
      }
    },
    [executeAlgorithm]
  );

  // Initial load or when engine is ready
  useEffect(() => {
    if (isReady) {
      runTrace(currentAlgo.id, inputArray);
    }
  }, [isReady, currentAlgo.id, inputArray, runTrace]);

  // Synchronize URL with algorithm and array input
  const updateUrlParams = (newArray: number[]) => {
    const paramVal = newArray.join(',');
    setSearchParams({ data: paramVal });
  };

  // Switch algorithm handler
  const handleSelectAlgo = (newId: string) => {
    const targetMeta = getAlgorithmById(newId);
    if (!targetMeta) return;
    navigate(`/visualize/${newId}`);
    setInputArray(targetMeta.defaultInput);
    setSearchParams({ data: targetMeta.defaultInput.join(',') });
  };

  // Handle custom input submission
  const handleApplyInput = (newArr: number[]) => {
    setInputArray(newArr);
    updateUrlParams(newArr);
  };

  // Playback timer loop
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (isPlaying && trace && trace.steps.length > 0) {
      timerRef.current = setInterval(() => {
        setCurrentStepIdx((prev) => {
          if (prev >= trace.steps.length - 1) {
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, speedMs);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, trace, speedMs]);

  // Keyboard navigation shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing in input field
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((prev) => !prev);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        if (trace) {
          setCurrentStepIdx((prev) => Math.min(prev + 1, trace.steps.length - 1));
        }
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((prev) => Math.max(prev - 1, 0));
      } else if (e.key === 'r' || e.key === 'R' || e.code === 'Home') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(0);
      } else if (e.code === 'End') {
        e.preventDefault();
        setIsPlaying(false);
        if (trace) {
          setCurrentStepIdx(trace.steps.length - 1);
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace]);

  // Copy shareable link
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2500);
  };

  const currentStep: Step = trace?.steps[currentStepIdx] || {
    array: inputArray,
    highlights: [],
    codeLine: 0,
    explanation: 'Initializing algorithm execution trace...',
    counters: { comparisons: 0, swaps: 0, steps: 0 },
  };

  const totalSteps = trace?.steps.length || 0;

  return (
    <div className="visualizer-page container mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8 space-y-6">
      {/* ─── TOP HEADER BAR ─────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          {/* Breadcrumb / Algorithm Category */}
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 mb-1.5">
            <span>ALGORITHMS</span>
            <span>/</span>
            <span className="text-slate-400">{currentAlgo.categoryLabel.toUpperCase()}</span>
            <span>/</span>
            <span className="text-white font-bold">{currentAlgo.name.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {currentAlgo.name}
            </h1>
            <span className="rounded-md bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-semibold text-cyan-300 border border-cyan-500/20">
              {currentAlgo.complexity.average}
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            {currentAlgo.shortDescription}
          </p>
        </div>

        {/* Algorithm Switcher Tabs & Share Link */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Sorting algorithm selector tabs */}
          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/80 p-1">
            {ALGORITHMS.map((algo) => {
              const active = algo.id === currentAlgo.id;
              return (
                <button
                  key={algo.id}
                  onClick={() => handleSelectAlgo(algo.id)}
                  className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 shadow-sm'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {algo.name}
                </button>
              );
            })}
          </div>

          {/* Share Button */}
          <button
            onClick={handleShareLink}
            className="flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-medium text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy shareable link with current array"
          >
            {copiedShare ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="h-3.5 w-3.5" />
                <span>Share URL</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ─── LIVE ERROR OR LOADING STATE ─────────────────────────── */}
      {traceError && (
        <div className="rounded-xl border border-rose-500/30 bg-rose-950/30 p-4 text-xs text-rose-300 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{traceError}</span>
          </div>
          <button
            onClick={() => runTrace(currentAlgo.id, inputArray)}
            className="px-3 py-1 rounded-lg bg-rose-500/20 text-rose-200 hover:bg-rose-500/30 font-medium"
          >
            Retry Trace
          </button>
        </div>
      )}

      {/* ─── MAIN WORKSPACE GRID ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Visualization Canvas + Playback Controls + Counters (8 cols) */}
        <div className="lg:col-span-8 space-y-4">
          {/* Canvas Box */}
          <div className="relative">
            {loadingTrace && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-slate-950/60 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-mono text-cyan-400">
                  <RefreshCw className="h-4 w-4 animate-spin" />
                  <span>Computing C++ execution trace...</span>
                </div>
              </div>
            )}

            <ArrayBars
              array={currentStep.array}
              highlights={currentStep.highlights}
            />
          </div>

          {/* Current Step Explanation Box */}
          <div className="rounded-xl border border-cyan-500/30 bg-slate-900/90 px-4 py-3 shadow-sm backdrop-blur-md flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5 overflow-hidden">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="text-[10px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                  Step {currentStepIdx + 1} of {totalSteps || 1}
                </div>
                <div className="text-sm font-medium text-slate-100 truncate">
                  {currentStep.explanation}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-[11px] font-mono text-slate-400 shrink-0">
              <span className="rounded bg-white/5 px-2 py-0.5 border border-white/5">
                Line {currentStep.codeLine + 1}
              </span>
            </div>
          </div>

          {/* Playback Controls */}
          <PlaybackControls
            currentStep={currentStepIdx}
            totalSteps={totalSteps}
            isPlaying={isPlaying}
            speed={speedMs}
            onPlayPause={() => setIsPlaying(!isPlaying)}
            onStepBack={() => {
              setIsPlaying(false);
              setCurrentStepIdx((p) => Math.max(p - 1, 0));
            }}
            onStepForward={() => {
              setIsPlaying(false);
              setCurrentStepIdx((p) => Math.min(p + 1, totalSteps - 1));
            }}
            onReset={() => {
              setIsPlaying(false);
              setCurrentStepIdx(0);
            }}
            onJumpToEnd={() => {
              setIsPlaying(false);
              setCurrentStepIdx(totalSteps - 1);
            }}
            onScrub={(step) => {
              setIsPlaying(false);
              setCurrentStepIdx(step);
            }}
            onSpeedChange={(newSpeed) => setSpeedMs(newSpeed)}
          />

          <div className="lg:hidden">
            <MobileCodeWindow
              algorithmId={currentAlgo.id}
              codeLines={trace?.codeLines || []}
              activeLineIndex={currentStep.codeLine}
            />
          </div>

          {/* Counters Metrics */}
          <CountersPanel
            counters={currentStep.counters}
            arraySize={currentStep.array.length}
          />

          {/* Custom Array Input Card */}
          <CustomInputCard
            currentInput={inputArray}
            sampleInputs={currentAlgo.sampleInputs}
            onApplyInput={handleApplyInput}
          />

        </div>

        {/* Right Column: Live C++ Code Panel + Info Card (4 cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Live Code Panel */}
          <div className="hidden lg:block">
            <CodePanel
              algorithmId={currentAlgo.id}
              codeLines={trace?.codeLines || []}
              activeLineIndex={currentStep.codeLine}
            />
          </div>

          {/* Keyboard Shortcuts Hint Card */}
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-3.5 text-xs text-slate-400 backdrop-blur-md">
            <div className="flex items-center gap-1.5 font-semibold text-slate-200 mb-2">
              <HelpCircle className="h-3.5 w-3.5 text-cyan-400" />
              <span>Keyboard Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2 text-[11px] font-mono">
              <div className="flex items-center justify-between">
                <span>Play / Pause:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Step Forward:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  →
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Step Back:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  ←
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Restart:</span>
                <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-300">
                  R
                </kbd>
              </div>
            </div>
          </div>

          {/* Algorithm Info & Complexity Card */}
          <InfoCard algorithm={currentAlgo} />
        </div>
      </div>
    </div>
  );
}
