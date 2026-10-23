import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Code2, Search, Github, Menu, X, ArrowUpRight } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="site-header sticky top-0 z-40 border-b border-slate-200/80 bg-white/85 backdrop-blur-md transition-all">
      <div className="site-nav mx-auto flex min-h-[72px] max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <Link to="/" className="brand flex items-center gap-3 text-slate-950 no-underline">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-950 text-white shadow-sm transition-transform hover:scale-105">
            <Code2 className="h-5 w-5" />
          </div>
          <span className="font-heading text-xl font-bold tracking-tight text-slate-950">
            Algo<span className="text-slate-500 font-medium">Lens</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="desktop-nav hidden md:flex items-center gap-1.5" aria-label="Main navigation">
          <Link
            to="/"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              location.pathname === '/'
                ? 'bg-slate-100 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Overview
          </Link>
          <Link
            to="/algorithms"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              location.pathname === '/algorithms'
                ? 'bg-slate-100 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Algorithms
          </Link>
          <Link
            to="/visualize/bubble-sort"
            className={`rounded-lg px-3.5 py-2 text-sm font-semibold transition-colors ${
              location.pathname.startsWith('/visualize')
                ? 'bg-slate-100 text-slate-950 shadow-xs'
                : 'text-slate-600 hover:text-slate-950 hover:bg-slate-50'
            }`}
          >
            Visualizer
          </Link>
        </nav>

        {/* Actions */}
        <div className="nav-actions flex items-center gap-2.5">
          <button
            onClick={onOpenCommandPalette}
            className="palette-trigger flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-slate-50/80 px-3.5 py-2 text-sm font-medium text-slate-600 shadow-xs hover:border-slate-300 hover:bg-white hover:text-slate-950 active:scale-98 transition-all"
            aria-label="Search algorithms"
          >
            <Search className="h-4 w-4" />
            <span className="hidden sm:inline">Search algorithms</span>
            <kbd className="hidden sm:inline-flex items-center rounded-md border border-slate-200 bg-white px-2 py-0.5 text-[11px] font-mono font-semibold text-slate-500 shadow-2xs">
              Ctrl K
            </kbd>
          </button>

          <a
            href="https://github.com/Salman89007/Algolens"
            target="_blank"
            rel="noreferrer"
            className="github-link hidden sm:inline-flex items-center gap-1.5 rounded-xl border border-slate-200/80 bg-white px-3.5 py-2 text-sm font-medium text-slate-700 shadow-xs hover:border-slate-300 hover:text-slate-950 active:scale-98 transition-all"
            aria-label="GitHub Repository"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="mobile-menu-trigger flex md:hidden h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-800 shadow-xs hover:bg-slate-50"
            aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-menu flex md:hidden flex-col border-t border-slate-200/80 bg-white/95 px-5 py-4 backdrop-blur-xl shadow-lg space-y-2">
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
          >
            Overview
          </Link>
          <Link
            to="/visualize/bubble-sort"
            onClick={() => setMobileMenuOpen(false)}
            className="flex items-center justify-between rounded-xl px-4 py-3 text-base font-semibold text-slate-900 hover:bg-slate-100"
          >
            Sorting Visualizer
          </Link>

          <div className="pt-2 border-t border-slate-100">
            <span className="px-4 text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
              Quick Select
            </span>
            <div className="mt-1 space-y-1">
              {ALGORITHMS.map((algo) => (
                <Link
                  key={algo.id}
                  to={`/visualize/${algo.id}`}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100 hover:text-slate-950"
                >
                  <span>{algo.name}</span>
                  <span className="font-mono text-xs text-slate-400">{algo.complexity.average}</span>
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenCommandPalette();
              }}
              className="flex w-full items-center justify-between rounded-xl bg-slate-100 px-4 py-3 text-sm font-semibold text-slate-900"
            >
              <div className="flex items-center gap-2">
                <Search className="h-4 w-4" />
                <span>Search algorithms</span>
              </div>
              <kbd className="rounded border border-slate-300 bg-white px-2 py-0.5 text-xs font-mono font-semibold">
                Ctrl K
              </kbd>
            </button>
            <a
              href="https://github.com/Salman89007/Algolens"
              target="_blank"
              rel="noreferrer"
              className="flex w-full items-center justify-between rounded-xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50"
            >
              <div className="flex items-center gap-2">
                <Github className="h-4 w-4" />
                <span>GitHub Repository</span>
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
