import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Search, X, CornerDownLeft } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();

  const filtered = useMemo(
    () =>
      ALGORITHMS.filter((algo) =>
        `${algo.name} ${algo.id} ${algo.categoryLabel}`
          .toLowerCase()
          .includes(query.toLowerCase())
      ),
    [query]
  );

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        onClose();
      }
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown' && filtered.length) {
        event.preventDefault();
        setActiveIndex((index) => Math.min(index + 1, filtered.length - 1));
      }
      if (event.key === 'ArrowUp' && filtered.length) {
        event.preventDefault();
        setActiveIndex((index) => Math.max(index - 1, 0));
      }
      if (event.key === 'Enter' && filtered[activeIndex]) {
        navigate(`/visualize/${filtered[activeIndex].id}`);
        onClose();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filtered, isOpen, navigate, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="palette-overlay fixed inset-0 z-50 flex items-start justify-center bg-slate-900/40 p-4 pt-[12vh] backdrop-blur-sm sm:p-6 sm:pt-[15vh]"
      onMouseDown={onClose}
    >
      <section
        className="palette-dialog w-full max-w-xl overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl transition-all"
        role="dialog"
        aria-modal="true"
        aria-label="Search algorithms"
        onMouseDown={(event) => event.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="flex items-center gap-3 border-b border-slate-100 px-4 py-3.5 sm:px-5">
          <Search className="h-5 w-5 text-slate-400 shrink-0" />
          <input
            autoFocus
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setActiveIndex(0);
            }}
            placeholder="Type an algorithm name or keyword…"
            className="w-full bg-transparent text-base font-medium text-slate-900 placeholder:text-slate-400 outline-none"
            aria-label="Search algorithms"
          />
          <kbd className="hidden sm:inline-block rounded-md border border-slate-200 bg-slate-100 px-2 py-0.5 text-xs font-mono font-semibold text-slate-500">
            ESC
          </kbd>
          <button
            onClick={onClose}
            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 sm:hidden"
            aria-label="Close search"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Results List */}
        <div className="max-h-[50vh] overflow-y-auto p-2">
          <div className="px-3 py-2 text-[11px] font-mono font-bold uppercase tracking-wider text-slate-400">
            Available Algorithms ({filtered.length})
          </div>

          <div className="space-y-1">
            {filtered.map((algo, index) => {
              const active = index === activeIndex;
              return (
                <button
                  key={algo.id}
                  className={`flex w-full items-center justify-between gap-3 rounded-xl px-3.5 py-3 text-left transition-all ${
                    active
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-slate-800 hover:bg-slate-100'
                  }`}
                  onMouseEnter={() => setActiveIndex(index)}
                  onClick={() => {
                    navigate(`/visualize/${algo.id}`);
                    onClose();
                  }}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <span
                      className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg font-mono text-xs font-bold ${
                        active
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-100 text-slate-800 border border-slate-200/60'
                      }`}
                    >
                      {algo.name.slice(0, 2).toUpperCase()}
                    </span>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <strong className="text-sm font-semibold truncate">
                          {algo.name}
                        </strong>
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${
                            active
                              ? 'bg-white/20 text-white'
                              : 'bg-slate-100 text-slate-500'
                          }`}
                        >
                          {algo.categoryLabel}
                        </span>
                      </div>
                      <p
                        className={`text-xs truncate ${
                          active ? 'text-slate-300' : 'text-slate-500'
                        }`}
                      >
                        {algo.shortDescription}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <span
                      className={`font-mono text-xs font-medium ${
                        active ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {algo.complexity.average}
                    </span>
                    <ArrowRight
                      className={`h-4 w-4 ${
                        active ? 'text-white' : 'text-slate-400'
                      }`}
                    />
                  </div>
                </button>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-sm text-slate-500">
                No algorithms match “{query}”.
              </div>
            )}
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/70 px-4 py-2.5 text-xs text-slate-500">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono">
                ↑
              </kbd>
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono">
                ↓
              </kbd>{' '}
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="rounded border border-slate-200 bg-white px-1.5 py-0.5 text-[10px] font-mono">
                <CornerDownLeft className="h-2.5 w-2.5" />
              </kbd>{' '}
              Select
            </span>
          </div>
          <span>ESC to close</span>
        </div>
      </section>
    </div>
  );
}
