import { useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';

interface CodePanelProps {
  algorithmId: string;
  codeLines: string[];
  activeLineIndex: number; // 0-indexed corresponding to step.codeLine
}

/** How many lines to show in the static code window */
const VISIBLE_LINES = 7;

/**
 * Compute a stable window of VISIBLE_LINES centred around the active line.
 * The highlighted line stays roughly in the middle of the window.
 */
function computeWindow(totalLines: number, activeIndex: number) {
  const safeActive = Math.max(0, Math.min(activeIndex, Math.max(totalLines - 1, 0)));
  const half = Math.floor(VISIBLE_LINES / 2); // 3
  let start = safeActive - half;
  start = Math.max(0, Math.min(start, Math.max(totalLines - VISIBLE_LINES, 0)));
  return { start, end: start + VISIBLE_LINES, safeActive };
}

export function CodePanel({
  algorithmId,
  codeLines,
  activeLineIndex,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const { start, end, safeActive } = computeWindow(codeLines.length, activeLineIndex);
  const visibleLines = codeLines.slice(start, end);

  return (
    <div
      className="w-full rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl backdrop-blur-xl flex flex-col overflow-hidden"
      style={{ overflowAnchor: 'none' }}
    >
      {/* Code Editor Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-mono font-semibold text-slate-200">
            {algorithmId.replace('-', '_')}.cpp
          </span>
          <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
            C++17 Engine Source
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-slate-500">
            line {safeActive + 1}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
            title="Copy C++ code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-400" />
                <span className="text-emerald-400">Copied</span>
              </>
            ) : (
              <>
                <Copy className="h-3.5 w-3.5" />
                <span>Copy</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Static code window — no internal scrolling, no scrollIntoView */}
      <div
        className="p-3 font-mono text-sm leading-relaxed select-text"
        style={{ overflowAnchor: 'none' }}
        aria-label="Current C++ code window"
      >
        {visibleLines.map((line, index) => {
          const lineIndex = start + index;
          const isActive = lineIndex === safeActive;

          return (
            <div
              key={lineIndex}
              className={`flex items-start rounded-md px-2 py-0.5 transition-colors group ${
                isActive
                  ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-200 font-semibold shadow-inner'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-7 shrink-0 select-none text-right pr-3 text-[11px] font-mono ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-600'
                }`}
              >
                {lineIndex + 1}
              </span>

              {/* Code line content */}
              <pre className="flex-1 overflow-x-auto whitespace-pre font-mono">
                {line}
              </pre>

              {/* Active execution pointer indicator */}
              {isActive && (
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-cyan-400 bg-cyan-950/60 border border-cyan-400/30 px-1.5 py-0.2 rounded font-mono ml-2">
                  <Terminal className="h-2.5 w-2.5" /> executing
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MobileCodeWindow({ algorithmId, codeLines, activeLineIndex }: CodePanelProps) {
  const { start, end, safeActive } = computeWindow(codeLines.length, activeLineIndex);
  const visibleLines = codeLines.slice(start, end);

  return (
    <section
      className="rounded-2xl border border-white/10 bg-slate-950/90 p-4 shadow-xl backdrop-blur-xl"
      style={{ overflowAnchor: 'none' }}
    >
      <div className="mb-3 flex items-center justify-between text-sm font-mono text-slate-300">
        <span>{algorithmId.replace('-', '_')}.cpp</span>
        <span className="text-slate-500">line {safeActive + 1}</span>
      </div>
      <div
        className="space-y-1 font-mono text-sm leading-relaxed"
        style={{ overflowAnchor: 'none' }}
        aria-label="Current C++ code window"
      >
        {visibleLines.map((line, index) => {
          const lineIndex = start + index;
          return (
            <div key={lineIndex} className={`flex rounded-md px-2 py-1 ${lineIndex === safeActive ? 'bg-cyan-500/20 text-cyan-100 ring-1 ring-cyan-400/40' : 'text-slate-400'}`}>
              <span className="w-8 shrink-0 select-none text-right pr-3 text-slate-500">{lineIndex + 1}</span>
              <code className="min-w-0 break-all whitespace-pre-wrap">{line}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}
