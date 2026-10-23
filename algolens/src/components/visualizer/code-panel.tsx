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
      className="w-full rounded-2xl border border-slate-200/80 bg-white/95 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl flex flex-col overflow-hidden"
      style={{ overflowAnchor: 'none' }}
    >
      {/* Code Editor Header */}
      <div className="flex items-center justify-between border-b border-slate-100 bg-slate-50/80 px-4 py-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-950 text-white shadow-2xs">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-mono font-bold text-slate-900">
            {algorithmId.replace('-', '_')}.cpp
          </span>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700 font-semibold">
            C++17 Engine
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-xs font-mono text-slate-500 font-medium">
            line {safeActive + 1}
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 shadow-2xs transition-colors"
            title="Copy C++ code"
          >
            {copied ? (
              <>
                <Check className="h-3.5 w-3.5 text-emerald-600" />
                <span className="text-emerald-700 font-semibold">Copied</span>
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
        className="p-3 font-mono text-xs sm:text-sm leading-relaxed select-text bg-white"
        style={{ overflowAnchor: 'none' }}
        aria-label="Current C++ code window"
      >
        {visibleLines.map((line, index) => {
          const lineIndex = start + index;
          const isActive = lineIndex === safeActive;

          return (
            <div
              key={lineIndex}
              className={`flex items-start rounded-md px-2.5 py-1 transition-colors ${
                isActive
                  ? 'bg-slate-100/90 border-l-4 border-slate-950 text-slate-950 font-semibold shadow-2xs'
                  : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-7 shrink-0 select-none text-right pr-3 text-xs font-mono ${
                  isActive ? 'text-slate-950 font-bold' : 'text-slate-400'
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
                <span className="hidden sm:inline-flex items-center gap-1 text-[10px] text-slate-900 bg-slate-200/80 px-1.5 py-0.2 rounded font-mono font-bold ml-2">
                  <Terminal className="h-2.5 w-2.5" /> exec
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
      className="rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl"
      style={{ overflowAnchor: 'none' }}
    >
      <div className="mb-3 flex items-center justify-between text-xs sm:text-sm font-mono text-slate-800">
        <span className="font-bold">{algorithmId.replace('-', '_')}.cpp</span>
        <span className="text-slate-500 font-medium">line {safeActive + 1}</span>
      </div>
      <div
        className="space-y-1 font-mono text-xs sm:text-sm leading-relaxed"
        style={{ overflowAnchor: 'none' }}
        aria-label="Current C++ code window"
      >
        {visibleLines.map((line, index) => {
          const lineIndex = start + index;
          const isActive = lineIndex === safeActive;
          return (
            <div
              key={lineIndex}
              className={`flex rounded-md px-2 py-1 ${
                isActive
                  ? 'bg-slate-100 border-l-4 border-slate-950 text-slate-950 font-semibold'
                  : 'text-slate-600'
              }`}
            >
              <span className={`w-8 shrink-0 select-none text-right pr-3 ${isActive ? 'text-slate-950 font-bold' : 'text-slate-400'}`}>
                {lineIndex + 1}
              </span>
              <code className="min-w-0 break-all whitespace-pre-wrap">{line}</code>
            </div>
          );
        })}
      </div>
    </section>
  );
}
