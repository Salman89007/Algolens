import { Link } from 'react-router';
import { Code2, Cpu, Sparkles, Terminal, CheckCircle2 } from 'lucide-react';
import { ALGORITHMS } from '@/lib/algorithms-registry';

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-slate-950/90 text-slate-400 text-sm">
      <div className="container mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Column 1: Brand & Bio */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Code2 className="h-4 w-4" />
              </div>
              <span className="font-bold text-white text-base">
                Algo<span className="text-cyan-400">Lens</span>
              </span>
              <span className="rounded bg-cyan-500/10 px-2 py-0.5 text-xs font-mono font-medium text-cyan-300 border border-cyan-500/20">
                C++ WebAssembly
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-md">
              A high-performance interactive algorithm visualizer and step debugger. Built with a
              pure C++17 algorithm engine compiled directly to WebAssembly for instant in-browser
              execution without server dependencies.
            </p>
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Cpu className="h-3 w-3 text-cyan-400" /> C++17 Emscripten
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Terminal className="h-3 w-3 text-emerald-400" /> Deterministic JSON Trace
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                <Sparkles className="h-3 w-3 text-indigo-400" /> React + Tailwind CSS
              </span>
            </div>
          </div>

          {/* Column 2: Phase 1 Algorithms */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              Phase 1 Algorithms
            </div>
            <ul className="space-y-2 text-xs">
              {ALGORITHMS.map((algo) => (
                <li key={algo.id}>
                  <Link
                    to={`/visualize/${algo.id}`}
                    className="hover:text-cyan-400 transition-colors flex items-center justify-between"
                  >
                    <span>{algo.name}</span>
                    <span className="font-mono text-[10px] text-slate-500">
                      {algo.complexity.average}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Architecture & Status */}
          <div className="space-y-3">
            <div className="text-xs font-semibold uppercase tracking-wider text-white">
              System Architecture
            </div>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-center gap-1.5 text-emerald-400">
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span className="font-medium">WASM Engine Online</span>
              </div>
              <p className="text-[11px] text-slate-500">
                Compiled C++ binary (<code className="text-slate-400">engine.wasm</code>) runs locally in your browser memory sandbox.
              </p>
              <div className="pt-2 text-[11px] text-slate-500">
                Architecture: Client-side only. Zero backend telemetry or latency.
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <div>
            AlgoLens &copy; {new Date().getFullYear()}. Built for computer science students and engineers.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="hover:text-slate-300 transition-colors">
              Home
            </Link>
            <Link to="/visualize/bubble-sort" className="hover:text-slate-300 transition-colors">
              Visualizer
            </Link>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              className="hover:text-slate-300 transition-colors"
            >
              GitHub Repository
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
