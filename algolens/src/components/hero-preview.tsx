import { useState, useEffect } from 'react';
import { Play, Pause, RotateCcw, Code2 } from 'lucide-react';
import { useWasmEngine } from '@/hooks/use-wasm-engine';
import { tokens } from '@/lib/tokens';
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
    return () => { active = false; };
  }, [isReady, executeAlgorithm]);

  useEffect(() => {
    if (!isPlaying || !trace?.steps.length) return;
    const timer = window.setInterval(() => {
      setCurrentStepIdx((index) => index >= trace.steps.length - 1 ? 0 : index + 1);
    }, 520);
    return () => window.clearInterval(timer);
  }, [isPlaying, trace]);

  const currentStep = trace?.steps[currentStepIdx] || {
    array: DEFAULT_HERO_ARRAY,
    highlights: [],
    codeLine: 1,
    explanation: isReady ? 'Building a real C++ trace…' : 'Loading the WebAssembly engine…',
    counters: { comparisons: 0, swaps: 0, steps: 0 },
  };
  const maxValue = Math.max(...currentStep.array, 100);
  const barColor = (index: number) => {
    const highlight = currentStep.highlights?.find((item) => item.index === index);
    const status = highlight
      ? highlight.type === 'swap' ? tokens.colors.status.swap
        : highlight.type === 'sorted' ? tokens.colors.status.sorted
          : highlight.type === 'pivot' ? tokens.colors.status.pivot
            : highlight.type === 'compare' ? tokens.colors.status.compare
              : tokens.colors.status.current
      : tokens.colors.status.defaultBar;
    return { backgroundColor: status.solid, boxShadow: highlight ? `0 0 18px ${status.bg}` : undefined };
  };

  return (
    <div className="preview-card">
      <div className="preview-topline">
        <span className="preview-file"><span className="preview-icon"><Code2 size={15} /></span><span>QUICK SORT <small>· C++ TRACE</small></span></span>
        <span className="preview-live"><i /> {trace ? 'LIVE TRACE' : 'ENGINE'}</span>
      </div>
      <div className="preview-chart" aria-label="Live quick sort visualization">
        {currentStep.array.map((value, index) => (
          <div className="preview-column" key={`${index}-${value}`}>
            <span className="preview-value">{value}</span>
            <div className="preview-bar" style={{ height: `${Math.max((value / maxValue) * 74, 13)}%`, ...barColor(index) }} />
            <span className="preview-index">{index}</span>
          </div>
        ))}
      </div>
      <div className="preview-explanation">
        <span className="preview-step">STEP {currentStepIdx + 1}<span>/</span>{trace?.steps.length ?? '—'}</span>
        <p>{currentStep.explanation}</p>
        <div className="preview-controls">
          <button onClick={() => setIsPlaying((playing) => !playing)} aria-label={isPlaying ? 'Pause animation' : 'Play animation'}>{isPlaying ? <Pause size={14} /> : <Play size={14} />}</button>
          <button onClick={() => setCurrentStepIdx(0)} aria-label="Restart animation"><RotateCcw size={14} /></button>
        </div>
      </div>
      <div className="preview-progress"><span style={{ width: `${trace ? ((currentStepIdx + 1) / trace.steps.length) * 100 : 7}%` }} /></div>
    </div>
  );
}
