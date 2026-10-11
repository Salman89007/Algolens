import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import {
  Code2,
  Search,
  Sun,
  Moon,
  Github,
  Menu,
  X,
  ChevronDown,
  Zap,
} from 'lucide-react';
import { useTheme } from '@/components/theme-provider';
import { ALGORITHMS } from '@/lib/algorithms-registry';

interface NavbarProps {
  onOpenCommandPalette: () => void;
}

export function Navbar({ onOpenCommandPalette }: NavbarProps) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [algoDropdownOpen, setAlgoDropdownOpen] = useState(false);

  const isVisualizerActive = location.pathname.startsWith('/visualize');

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/10 bg-slate-950/80 backdrop-blur-md transition-colors">
      <div className="container mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo */}
        <div className="flex items-center gap-6">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-400 via-teal-500 to-indigo-600 p-0.5 shadow-md shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-shadow">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Code2 className="h-5 w-5 text-cyan-400 group-hover:scale-110 transition-transform" />
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  Algo<span className="text-cyan-400">Lens</span>
                </span>
                <span className="inline-flex items-center rounded-md bg-cyan-500/10 px-1.5 py-0.5 text-[10px] font-mono font-semibold text-cyan-300 border border-cyan-500/25">
                  WASM C++
                </span>
              </div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium">
            <Link
              to="/"
              className={`px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname === '/'
                  ? 'text-cyan-400 bg-white/5 font-semibold'
                  : 'text-slate-300 hover:text-white hover:bg-white/5'
              }`}
            >
              Overview
            </Link>

            {/* Algorithms Dropdown */}
            <div className="relative">
              <button
                onClick={() => setAlgoDropdownOpen(!algoDropdownOpen)}
                onBlur={() => setTimeout(() => setAlgoDropdownOpen(false), 200)}
                className={`flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors ${
                  isVisualizerActive
                    ? 'text-cyan-400 bg-white/5 font-semibold'
                    : 'text-slate-300 hover:text-white hover:bg-white/5'
                }`}
              >
                <span>Visualizer</span>
                <ChevronDown
                  className={`h-3.5 w-3.5 transition-transform ${
                    algoDropdownOpen ? 'rotate-180 text-cyan-400' : 'text-slate-400'
                  }`}
                />
              </button>

              {algoDropdownOpen && (
                <div className="absolute left-0 mt-2 w-64 rounded-xl border border-white/10 bg-slate-950/95 p-2 shadow-xl shadow-cyan-950/20 backdrop-blur-xl animate-in fade-in zoom-in-95 duration-100">
                  <div className="px-2 py-1 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
                    Phase 1 Sorting Engine
                  </div>
                  {ALGORITHMS.map((algo) => (
                    <Link
                      key={algo.id}
                      to={`/visualize/${algo.id}`}
                      onClick={() => setAlgoDropdownOpen(false)}
                      className="flex items-center justify-between rounded-lg px-2.5 py-2 text-xs text-slate-200 hover:bg-cyan-500/15 hover:text-cyan-300 transition-colors"
                    >
                      <div className="font-medium">{algo.name}</div>
                      <span className="font-mono text-[10px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20">
                        {algo.complexity.average}
                      </span>
                    </Link>
                  ))}
                  <div className="mt-1 pt-1 border-t border-white/10 px-2 py-1 flex items-center justify-between text-[11px] text-slate-400">
                    <span className="flex items-center gap-1">
                      <Zap className="h-3 w-3 text-cyan-400" /> C++17 Core
                    </span>
                    <span className="text-emerald-400">3 Ready</span>
                  </div>
                </div>
              )}
            </div>

            <Link
              to="/visualize/bubble-sort"
              className="px-3 py-1.5 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
            >
              Interactive Lab
            </Link>
          </nav>
        </div>

        {/* Right Section: Command Palette Trigger, Theme Toggle, Github */}
        <div className="flex items-center gap-2.5">
          {/* Command Palette Button */}
          <button
            onClick={onOpenCommandPalette}
            className="flex items-center gap-2 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-400 hover:border-cyan-500/40 hover:text-slate-200 hover:bg-white/10 transition-all shadow-inner"
            title="Search algorithms (Ctrl+K)"
          >
            <Search className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Search algorithms...</span>
            <span className="flex items-center gap-0.5 font-mono text-[10px] bg-slate-900 border border-white/15 px-1.5 py-0.5 rounded text-slate-300">
              <kbd>Ctrl</kbd>+<kbd>K</kbd>
            </span>
          </button>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:border-cyan-500/30 hover:text-cyan-400 hover:bg-white/10 transition-colors"
            aria-label="Toggle color theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-300 hover:rotate-45 transition-transform" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-400 hover:-rotate-12 transition-transform" />
            )}
          </button>

          {/* Source Code Badge / Github Link */}
          <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:border-white/25 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Github className="h-3.5 w-3.5" />
            <span>GitHub</span>
          </a>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white"
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/10 bg-slate-950/98 px-4 py-4 space-y-3 backdrop-blur-xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-500 px-2">
            Navigation
          </div>
          <Link
            to="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-white/5"
          >
            Home Overview
          </Link>
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400/90 px-2 pt-2">
            Sorting Algorithms
          </div>
          {ALGORITHMS.map((algo) => (
            <Link
              key={algo.id}
              to={`/visualize/${algo.id}`}
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center justify-between rounded-lg px-3 py-2 text-sm text-slate-200 hover:bg-cyan-500/10 hover:text-cyan-300"
            >
              <span>{algo.name}</span>
              <span className="font-mono text-xs text-cyan-400">{algo.complexity.average}</span>
            </Link>
          ))}
        </div>
      )}
    </header>
  );
}
