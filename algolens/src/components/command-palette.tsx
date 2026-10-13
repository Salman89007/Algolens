import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router';
import { Search, Zap, Code2, Sun, Moon, ArrowRight, X } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';
import { useTheme } from '@/components/theme-provider';

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) {
          onClose();
        } else {
          // Open palette
          (window as any).__openCommandPalette?.();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredAlgos = ALGORITHMS.filter(
    (a) =>
      a.name.toLowerCase().includes(query.toLowerCase()) ||
      a.id.toLowerCase().includes(query.toLowerCase()) ||
      a.categoryLabel.toLowerCase().includes(query.toLowerCase())
  );

  const handleSelectAlgo = (id: string) => {
    navigate(`/visualize/${id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-2xl rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl shadow-cyan-950/30 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Search Input Bar */}
        <div className="relative flex items-center border-b border-white/10 pb-3">
          <Search className="h-5 w-5 text-cyan-400 mr-3 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search algorithms, sorting techniques, actions..."
            className="w-full bg-transparent text-lg text-slate-100 placeholder-slate-500 focus:outline-none"
            autoFocus
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="text-slate-400 hover:text-slate-200 mr-2"
            >
              <X className="h-4 w-4" />
            </button>
          )}
          <span className="hidden sm:inline-flex items-center px-2 py-0.5 text-xs font-mono font-medium rounded border border-white/15 bg-white/5 text-slate-400">
            ESC
          </span>
        </div>

        {/* Content list */}
        <div className="mt-3 max-h-96 overflow-y-auto space-y-4 py-2 pr-1">
          {/* Quick Actions */}
          {!query && (
            <div>
              <div className="px-2 py-1 text-xs font-semibold uppercase tracking-wider text-slate-500">
                Quick Actions
              </div>
              <div className="mt-1 space-y-1">
                <button
                  onClick={() => {
                    handleSelectAlgo('quick-sort');
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-cyan-500/10 hover:text-cyan-300 transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="h-4 w-4 text-cyan-400" />
                    <span>Launch Visualizer (Quick Sort)</span>
                  </div>
                  <ArrowRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                </button>
                <button
                  onClick={() => {
                    toggleTheme();
                    onClose();
                  }}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2 text-sm text-slate-300 hover:bg-white/5 hover:text-white transition-colors"
                >
                  <div className="flex items-center gap-3">
                    {theme === 'dark' ? (
                      <Sun className="h-4 w-4 text-amber-400" />
                    ) : (
                      <Moon className="h-4 w-4 text-indigo-400" />
                    )}
                    <span>Switch to {theme === 'dark' ? 'Light' : 'Dark'} Mode</span>
                  </div>
                  <span className="text-xs text-slate-500 font-mono">Theme</span>
                </button>
              </div>
            </div>
          )}

          {/* Implemented Algorithms */}
          <div>
            <div className="flex items-center justify-between px-2 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-400/90">
              <span>WASM C++ Engine Algorithms</span>
              <span className="text-[10px] bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-1.5 py-0.5 rounded">
                Interactive
              </span>
            </div>
            <div className="mt-1 space-y-1">
              {filteredAlgos.map((algo) => (
                <button
                  key={algo.id}
                  onClick={() => handleSelectAlgo(algo.id)}
                  className="w-full flex items-center justify-between rounded-xl px-3 py-2.5 text-left text-sm text-slate-200 hover:bg-cyan-500/10 hover:border-cyan-500/30 border border-transparent transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 group-hover:bg-cyan-500/20">
                      <Code2 className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-medium text-slate-100 flex items-center gap-2">
                        {algo.name}
                        <span className="text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">
                          {algo.complexity.average}
                        </span>
                      </div>
                      <div className="text-xs text-slate-400 line-clamp-1">
                        {algo.shortDescription}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-cyan-400 hidden sm:inline">
                      Run trace
                    </span>
                    <ArrowRight className="h-4 w-4 text-cyan-400 opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                  </div>
                </button>
              ))}

              {filteredAlgos.length === 0 && (
                <div className="p-4 text-center text-sm text-slate-500">
                  No algorithms found matching "{query}".
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer shortcuts */}
        <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
          <div className="flex items-center gap-3">
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                ↑↓
              </kbd>{' '}
              Navigate
            </span>
            <span>
              <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 font-mono">
                ↵
              </kbd>{' '}
              Open
            </span>
          </div>
          <span className="font-mono text-cyan-400/80">AlgoLens v1.0 • WebAssembly Engine</span>
        </div>
      </div>
    </div>
  );
}

