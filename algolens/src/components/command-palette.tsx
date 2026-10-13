import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { ArrowRight, Search, X } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';

interface CommandPaletteProps { isOpen: boolean; onClose: () => void }

export function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(0);
  const navigate = useNavigate();
  const filtered = useMemo(() => ALGORITHMS.filter((algo) => `${algo.name} ${algo.id} ${algo.categoryLabel}`.toLowerCase().includes(query.toLowerCase())), [query]);

  useEffect(() => {
    if (!isOpen) return;
    setQuery('');
    setActiveIndex(0);
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = previousOverflow; };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); onClose(); }
      if (event.key === 'Escape') onClose();
      if (event.key === 'ArrowDown' && filtered.length) { event.preventDefault(); setActiveIndex((index) => Math.min(index + 1, filtered.length - 1)); }
      if (event.key === 'ArrowUp' && filtered.length) { event.preventDefault(); setActiveIndex((index) => Math.max(index - 1, 0)); }
      if (event.key === 'Enter' && filtered[activeIndex]) { navigate(`/visualize/${filtered[activeIndex].id}`); onClose(); }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeIndex, filtered, isOpen, navigate, onClose]);

  if (!isOpen) return null;
  return (
    <div className="palette-overlay" onMouseDown={onClose}>
      <section className="palette-dialog" role="dialog" aria-modal="true" aria-label="Search algorithms" onMouseDown={(event) => event.stopPropagation()}>
        <div className="palette-search"><Search size={18} /><input autoFocus value={query} onChange={(event) => { setQuery(event.target.value); setActiveIndex(0); }} placeholder="Search algorithms…" aria-label="Search algorithms" /><kbd>ESC</kbd><button onClick={onClose} aria-label="Close search"><X size={17} /></button></div>
        <div className="palette-list"><div className="palette-label">AVAILABLE ALGORITHMS</div>{filtered.map((algo, index) => <button key={algo.id} className={`palette-result ${index === activeIndex ? 'palette-result-active' : ''}`} onMouseEnter={() => setActiveIndex(index)} onClick={() => { navigate(`/visualize/${algo.id}`); onClose(); }}><span className="palette-result-icon">{algo.name.slice(0, 2).toUpperCase()}</span><span className="palette-result-copy"><strong>{algo.name}</strong><small>{algo.shortDescription}</small></span><span className="palette-complexity">{algo.complexity.average}</span><ArrowRight size={15} /></button>)}{filtered.length === 0 && <p className="palette-empty">No algorithms match “{query}”.</p>}</div>
        <div className="palette-hint"><span><kbd>↑</kbd><kbd>↓</kbd> Navigate</span><span><kbd>↵</kbd> Open</span><span><kbd>ESC</kbd> Close</span></div>
      </section>
    </div>
  );
}
