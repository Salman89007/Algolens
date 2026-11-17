import { useState, useEffect, useCallback, useRef } from 'react';
import { useParams, useNavigate, useSearchParams, Link } from 'react-router';
import {
  Sparkles,
  Share2,
  Check,
  RefreshCw,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
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
  const supportsTarget = currentAlgo.defaultTarget !== undefined;
  const [target, setTarget] = useState<number>(() => {
    const targetParam = searchParams.get('target');
    if (targetParam !== null && targetParam.trim() !== '' && !isNaN(Number(targetParam))) {
      return Number(targetParam);
    }
    return currentAlgo.defaultTarget ?? 0;
  });
  const [trace, setTrace] = useState<Trace | null>(null);
  const [currentStepIdx, setCurrentStepIdx] = useState(0);
  const tabsRef = useRef<HTMLDivElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMs, setSpeedMs] = useState(300);
  const [loadingTrace, setLoadingTrace] = useState(false);
  const [traceError, setTraceError] = useState<string | null>(null);
  const [copiedShare, setCopiedShare] = useState(false);

  // Re-run algorithm trace when algoId or inputArray changes
  const runTrace = useCallback(
    async (id: string, input: number[], targetValue: number) => {
      setLoadingTrace(true);
      setTraceError(null);
      try {
        const meta = getAlgorithmById(id);
        const payload =
          meta?.defaultTarget !== undefined
            ? JSON.stringify({ array: input, target: targetValue })
            : input;
        const result = await executeAlgorithm(id, payload);
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
      runTrace(currentAlgo.id, inputArray, target);
    }
  }, [isReady, currentAlgo.id, inputArray, target, runTrace]);

  // Synchronize URL with algorithm and array input
  const updateUrlParams = (newArray: number[], newTarget?: number) => {
    const params: Record<string, string> = { data: newArray.join(',') };
    if (newTarget !== undefined) {
      params.target = String(newTarget);
    }
    setSearchParams(params);
  };

  // Keep the active algorithm tab visible inside the horizontally scrolling strip
  useEffect(() => {
    const strip = tabsRef.current;
    if (!strip) return;

    const ensureActiveTabVisible = () => {
      const activeTab = strip.querySelector<HTMLButtonElement>('[data-active="true"]');
      if (!activeTab) return;

      const stripRect = strip.getBoundingClientRect();
      const tabRect = activeTab.getBoundingClientRect();

      // Instant scrolling keeps the strip usable even when smooth scrolling
      // is disabled by the browser or the user's motion preferences.
      if (tabRect.left < stripRect.left) {
        strip.scrollLeft -= stripRect.left - tabRect.left + 8;
      } else if (tabRect.right > stripRect.right) {
        strip.scrollLeft += tabRect.right - stripRect.right + 8;
      }
    };

    ensureActiveTabVisible();

    // Webfonts and responsive layout change tab widths after first paint,
    // so keep the active tab visible when the strip or tab resizes.
    const observer = new ResizeObserver(ensureActiveTabVisible);
    observer.observe(strip);
    const activeTab = strip.querySelector<HTMLButtonElement>('[data-active="true"]');
    if (activeTab) observer.observe(activeTab);

    document.fonts?.ready.then(ensureActiveTabVisible).catch(() => undefined);
    window.addEventListener('resize', ensureActiveTabVisible);

    return () => {
      observer.disconnect();
      window.removeEventListener('resize', ensureActiveTabVisible);
    };
  }, [currentAlgo.id]);

  // Switch algorithm handler
  const handleSelectAlgo = (newId: string) => {
    const targetMeta = getAlgorithmById(newId);
    if (!targetMeta) return;
    const nextTarget = targetMeta.defaultTarget ?? 0;
    const params = new URLSearchParams({ data: targetMeta.defaultInput.join(',') });
    if (targetMeta.defaultTarget !== undefined) {
      params.set('target', String(nextTarget));
    }
    setInputArray(targetMeta.defaultInput);
    setTarget(nextTarget);
    // One navigation keeps the new path and its query string together;
    // a separate setSearchParams would resolve against the old path.
    navigate(`/visualize/${newId}?${params.toString()}`);
  };

  // Handle custom input submission
  const handleApplyInput = (newArr: number[], newTarget?: number) => {
    const resolvedTarget = newTarget ?? target;
    setInputArray(newArr);
    if (newTarget !== undefined) {
      setTarget(newTarget);
    }
    updateUrlParams(newArr, supportsTarget ? resolvedTarget : undefined);
    runTrace(currentAlgo.id, newArr, resolvedTarget);
  };

  // Copy share URL
  const handleShareLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedShare(true);
    setTimeout(() => setCopiedShare(false), 2000);
  };

  // Playback timer loop
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isPlaying && trace) {
      timerRef.current = window.setInterval(() => {
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

  // Keyboard shortcut controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ignore if typing inside input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) {
        return;
      }

      if (e.code === 'Space') {
        e.preventDefault();
        setIsPlaying((p) => !p);
      } else if (e.code === 'ArrowRight') {
        e.preventDefault();
        setIsPlaying(false);
        if (trace) setCurrentStepIdx((p) => Math.min(p + 1, trace.steps.length - 1));
      } else if (e.code === 'ArrowLeft') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx((p) => Math.max(p - 1, 0));
      } else if (e.code === 'KeyR') {
        e.preventDefault();
        setIsPlaying(false);
        setCurrentStepIdx(0);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [trace]);

  // Current active step data fallback
  const currentStep: Step = trace?.steps[currentStepIdx] || {
    array: inputArray,
    highlights: [],
    codeLine: 1,
    explanation: loadingTrace ? 'Computing trace...' : 'Ready to execute',
    counters: { comparisons: 0, swaps: 0, steps: 0 },
  };

  const totalSteps = trace?.steps.length || 0;

  return (
    <div
      className="visualizer-page mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8"
      style={{ overflowAnchor: 'none' }}
    >
      {/* ─── Top Header Bar ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-6">
        <div>
          {/* Breadcrumb / Algorithm Category */}
          <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-500 mb-2">
            <Link to="/algorithms" className="hover:text-slate-950 transition-colors flex items-center gap-1">
              <ArrowLeft className="h-3 w-3" />
              <span>ALGORITHMS</span>
            </Link>
            <span>/</span>
            <span>{currentAlgo.categoryLabel.toUpperCase()}</span>
            <span>/</span>
            <span className="text-slate-950 font-bold">{currentAlgo.name.toUpperCase()}</span>
          </div>

          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-950 tracking-tight font-heading">
              {currentAlgo.name}
            </h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-mono font-bold text-slate-800 border border-slate-200/80">
              Avg {currentAlgo.complexity.average}
            </span>
          </div>
          <p className="text-sm text-slate-600 mt-1.5 max-w-2xl font-medium">
            {currentAlgo.shortDescription}
          </p>
        </div>

        {/* Algorithm Switcher Tabs & Share Link */}
        <div className="flex w-full min-w-0 flex-wrap items-center gap-2.5 md:w-auto md:max-w-[60%] md:justify-end">
          {/* Algorithm selector tabs: stay on one row and scroll horizontally when they overflow */}
          <div
            ref={tabsRef}
            className="flex min-w-0 max-w-full items-center overflow-x-auto rounded-xl border border-slate-200/80 bg-slate-100/80 p-1"
          >
            {ALGORITHMS.map((algo) => {
              const active = algo.id === currentAlgo.id;
              return (
                <button
                  key={algo.id}
                  data-active={active}
                  onClick={() => handleSelectAlgo(algo.id)}
                  className={`shrink-0 whitespace-nowrap px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
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
            className="flex shrink-0 items-center gap-1.5 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-xs font-semibold text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Copy shareable link with current array"
          >
            {copiedShare ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700">Copied!</span>
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

      {/* ─── Live Error Notification ─────────────────────────────── */}
      {traceError && (
        <div className="rounded-2xl border border-rose-200 bg-rose-50/80 p-4 text-xs sm:text-sm text-rose-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-600" />
            <span className="font-medium">{traceError}</span>
          </div>
          <button
            onClick={() => runTrace(currentAlgo.id, inputArray, target)}
            className="px-3 py-1.5 rounded-xl bg-rose-600 text-white hover:bg-rose-700 font-semibold text-xs shadow-xs"
          >
            Retry Trace
          </button>
        </div>
      )}

      {/* ─── Main Workspace Grid ─────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Visualization Canvas + Playback Controls + Counters (8 cols) */}
        <div className="lg:col-span-8 space-y-6">
          {/* Canvas Box */}
          <div className="relative">
            {loadingTrace && (
              <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/70 backdrop-blur-sm rounded-2xl">
                <div className="flex items-center gap-2 text-xs font-mono font-semibold text-slate-900 bg-white px-4 py-2 rounded-full border border-slate-200 shadow-md">
                  <RefreshCw className="h-4 w-4 animate-spin text-slate-950" />
                  <span>Computing C++ execution trace…</span>
                </div>
              </div>
            )}

            <ArrayBars
              array={currentStep.array}
              highlights={currentStep.highlights}
            />
          </div>

          {/* Current Step Explanation Box */}
          <div className="rounded-2xl border border-slate-200/80 bg-white/95 px-5 py-4 shadow-[0_4px_16px_rgba(0,0,0,0.03)] backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-900 shrink-0">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="truncate">
                <div className="text-[11px] font-mono uppercase tracking-wider text-slate-500 font-bold">
                  Step {currentStepIdx + 1} of {totalSteps || 1}
                </div>
                <div className="text-sm sm:text-base font-semibold text-slate-900 truncate mt-0.5">
                  {currentStep.explanation}
                </div>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-2 text-xs font-mono font-semibold text-slate-600 shrink-0">
              <span className="rounded-md bg-slate-100 px-2.5 py-1 border border-slate-200/60">
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

          {/* Mobile Code Window */}
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
            supportsTarget={supportsTarget}
            currentTarget={supportsTarget ? target : undefined}
            targetLabel={currentAlgo.paramLabel}
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
          <div className="rounded-2xl border border-slate-200/80 bg-white/80 p-4 text-xs text-slate-600 backdrop-blur-md shadow-2xs">
            <div className="flex items-center gap-2 font-bold text-slate-900 mb-3 font-heading">
              <HelpCircle className="h-4 w-4 text-slate-700" />
              <span>Keyboard Controls</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5 text-xs font-mono">
              <div className="flex items-center justify-between">
                <span>Play / Pause:</span>
                <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                  Space
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Step Forward:</span>
                <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                  →
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Step Back:</span>
                <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold">
                  ←
                </kbd>
              </div>
              <div className="flex items-center justify-between">
                <span>Restart:</span>
                <kbd className="px-2 py-0.5 rounded-md bg-slate-100 border border-slate-200 text-slate-800 font-bold">
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
