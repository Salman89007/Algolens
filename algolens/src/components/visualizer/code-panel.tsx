import { useEffect, useRef, useState } from 'react';
import { Code2, Copy, Check, Terminal } from 'lucide-react';

interface CodePanelProps {
  algorithmId: string;
  codeLines: string[];
  activeLineIndex: number; // 0-indexed corresponding to step.codeLine
}

export function CodePanel({
  algorithmId,
  codeLines,
  activeLineIndex,
}: CodePanelProps) {
  const [copied, setCopied] = useState(false);
  const activeLineRef = useRef<HTMLDivElement | null>(null);
  const scrollContainerRef = useRef<HTMLDivElement | null>(null);

  // Keep the active line visible without moving the document viewport.
  useEffect(() => {
    const activeLine = activeLineRef.current;
    const container = scrollContainerRef.current;

    if (activeLine && container) {
      const lineTop = activeLine.offsetTop;
      const lineBottom = lineTop + activeLine.offsetHeight;
      const visibleTop = container.scrollTop;
      const visibleBottom = visibleTop + container.clientHeight;

      if (lineTop < visibleTop || lineBottom > visibleBottom) {
        container.scrollTo({
          top: Math.max(0, lineTop - (container.clientHeight - activeLine.offsetHeight) / 2),
          behavior: 'smooth',
        });
      }
    }
  }, [activeLineIndex]);

  const handleCopy = () => {
    navigator.clipboard.writeText(codeLines.join('\n'));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/90 shadow-xl backdrop-blur-xl flex flex-col overflow-hidden">
      {/* Code Editor Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-slate-900/60 px-4 py-2.5">
        <div className="flex items-center gap-2">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
            <Code2 className="h-3.5 w-3.5" />
          </div>
          <span className="text-sm font-mono font-semibold text-slate-200">
            {algorithmId.replace('-', '_')}.cpp
          </span>
          <span className="hidden sm:inline text-sm font-mono px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-slate-400">
            C++17 Engine Source
          </span>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 transition-colors"
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

      {/* Code Lines Display */}
      <div ref={scrollContainerRef} className="max-h-80 overflow-y-auto p-3 font-mono text-sm leading-relaxed select-text">
        {codeLines.map((line, idx) => {
          const isActive = idx === activeLineIndex;

          return (
            <div
              key={idx}
              ref={isActive ? activeLineRef : null}
              className={`flex items-start rounded-md px-2 py-0.5 transition-colors group ${
                isActive
                  ? 'bg-cyan-500/20 border-l-4 border-cyan-400 text-cyan-200 font-semibold shadow-inner'
                  : 'text-slate-300 hover:bg-white/5'
              }`}
            >
              {/* Line Number */}
              <span
                className={`w-8 shrink-0 select-none text-right pr-3 text-sm font-mono ${
                  isActive ? 'text-cyan-400 font-bold' : 'text-slate-600'
                }`}
              >
                {idx + 1}
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
