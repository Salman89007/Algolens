import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Code2, Search, Github, Menu, X } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';

interface NavbarProps { onOpenCommandPalette: () => void }

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  return (
    <header className="site-header">
      <div className="site-nav">
        <Link to="/" className="brand"><span className="brand-icon"><Code2 size={17} /></span><span>Algo<span>Lens</span></span></Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <Link to="/" className={location.pathname === '/' ? 'nav-active' : ''}>Overview</Link>
          <Link to="/visualize/bubble-sort" className={location.pathname.startsWith('/visualize') ? 'nav-active' : ''}>Visualizer</Link>
        </nav>
        <div className="nav-actions">
          <button className="palette-trigger" onClick={onOpenCommandPalette} aria-label="Search algorithms"><Search size={15} /><span>Search algorithms</span><kbd>Ctrl K</kbd></button>
          <a className="github-link" href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub"><Github size={16} /><span>GitHub</span></a>
          <button className="mobile-menu-trigger" onClick={() => setMobileMenuOpen((open) => !open)} aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}>{mobileMenuOpen ? <X size={19} /> : <Menu size={19} />}</button>
        </div>
      </div>
      {mobileMenuOpen && <div className="mobile-menu"><Link to="/" onClick={() => setMobileMenuOpen(false)}>Overview</Link><Link to="/visualize/bubble-sort" onClick={() => setMobileMenuOpen(false)}>Sorting visualizer</Link>{ALGORITHMS.map((algo) => <Link key={algo.id} to={`/visualize/${algo.id}`} onClick={() => setMobileMenuOpen(false)}>{algo.name}<span>{algo.complexity.average}</span></Link>)}<button onClick={() => { setMobileMenuOpen(false); onOpenCommandPalette(); }}>Search algorithms <kbd>Ctrl K</kbd></button></div>}
    </header>
  );
}
