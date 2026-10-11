import { Link } from 'react-router';
import {
  ArrowRight,
  Code2,
  Cpu,
  Terminal,
  Zap,
  BarChart3,
  CheckCircle2,
  Search,
} from 'lucide-react';
import { ALGORITHMS, ALL_CATEGORIES } from '@/lib/algorithms-registry';
import { HeroPreview } from '@/components/hero-preview';

export default function Home() {
  return (
    <div className="flex flex-col gap-20 pb-20">
      {/* ─── HERO SECTION ────────────────────────────────────────── */}
      <section className="relative pt-12 md:pt-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading and CTAs */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Pill Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-500/30 bg-cyan-500/10 px-3.5 py-1.5 text-xs font-medium text-cyan-300 shadow-sm backdrop-blur-md">
              <span className="flex h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="font-mono">C++17 Engine compiled to WebAssembly</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.1]">
              Watch Code Think.{' '}
              <span className="block mt-1 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400">
                Step by Step.
              </span>
            </h1>

            {/* Subheading */}
            <p className="text-base sm:text-lg text-slate-300 max-w-2xl leading-relaxed">
              AlgoLens executes high-performance C++ algorithm traces right inside your browser.
              Observe every comparison, swap, and recursion frame mapped line-by-line to real
              source code.
            </p>

            {/* CTA Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/visualize/quick-sort"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 px-6 py-3.5 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-500/25 hover:shadow-cyan-400/40 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <span>Launch Quick Sort Lab</span>
                <ArrowRight className="h-4 w-4" />
              </Link>

              <button
                onClick={() => (window as any).__openCommandPalette?.()}
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-5 py-3.5 text-sm font-medium text-slate-200 hover:bg-white/10 hover:border-white/25 transition-all shadow-sm"
              >
                <Search className="h-4 w-4 text-cyan-400" />
                <span>Quick Search</span>
                <span className="font-mono text-xs text-slate-400 bg-white/10 px-1.5 py-0.5 rounded">
                  Ctrl+K
                </span>
              </button>
            </div>

            {/* Feature Metrics Bar */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <div className="text-2xl font-bold font-mono text-white">0 ms</div>
                <div className="text-xs text-slate-400 mt-0.5">Server Latency (Local WASM)</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-cyan-400">3 Sorts</div>
                <div className="text-xs text-slate-400 mt-0.5">Phase 1 Engine Online</div>
              </div>
              <div>
                <div className="text-2xl font-bold font-mono text-emerald-400">100%</div>
                <div className="text-xs text-slate-400 mt-0.5">Deterministic Traces</div>
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Live Preview Teaser */}
          <div className="lg:col-span-5 relative">
            <HeroPreview />
          </div>
        </div>
      </section>

      {/* ─── PHASE 1 ALGORITHMS CARDS ───────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-1">
              Phase 1 Deliverables
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Featured Sorting Algorithms
            </h2>
          </div>
          <p className="text-sm text-slate-400 max-w-md">
            Built in pure C++17, compiled to WebAssembly, ready for step-by-step interactive
            execution with custom datasets.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {ALGORITHMS.map((algo) => (
            <div
              key={algo.id}
              className="group relative flex flex-col justify-between rounded-2xl border border-white/10 bg-gradient-to-b from-slate-900/90 to-slate-950/90 p-6 shadow-xl backdrop-blur-md hover:border-cyan-500/40 hover:shadow-cyan-950/30 transition-all duration-300"
            >
              <div>
                {/* Header pill */}
                <div className="flex items-center justify-between mb-4">
                  <span className="inline-flex items-center gap-1.5 rounded-lg bg-cyan-500/10 px-2.5 py-1 text-xs font-mono font-medium text-cyan-300 border border-cyan-500/20">
                    <Zap className="h-3 w-3" />
                    WASM Engine
                  </span>
                  <span className="font-mono text-xs px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    {algo.complexity.average}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors">
                  {algo.name}
                </h3>
                <p className="mt-2 text-xs text-slate-300 line-clamp-3 leading-relaxed">
                  {algo.description}
                </p>

                {/* Complexity Specs */}
                <div className="mt-5 grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Best Time</span>
                    <span className="text-slate-200 font-semibold">{algo.complexity.best}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Worst Time</span>
                    <span className="text-slate-200 font-semibold">{algo.complexity.worst}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Space Aux</span>
                    <span className="text-slate-200 font-semibold">{algo.complexity.space}</span>
                  </div>
                  <div className="rounded-lg bg-white/5 p-2 border border-white/5">
                    <span className="text-slate-400 block text-[10px] uppercase">Stable?</span>
                    <span className={algo.complexity.stable ? 'text-emerald-400' : 'text-amber-400'}>
                      {algo.complexity.stable ? 'Yes' : 'No'}
                    </span>
                  </div>
                </div>

                {/* Key Points */}
                <ul className="mt-4 space-y-1.5 text-xs text-slate-400">
                  {algo.keyHighlights.slice(0, 2).map((point, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-cyan-400 shrink-0 mt-0.5" />
                      <span>{point}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Action */}
              <div className="mt-6 pt-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-mono">C++17 Source</span>
                <Link
                  to={`/visualize/${algo.id}`}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold text-cyan-400 hover:text-cyan-300 group-hover:translate-x-0.5 transition-transform"
                >
                  <span>Launch Visualizer</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── ARCHITECTURE DEEP DIVE ─────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="rounded-3xl border border-white/10 bg-slate-900/60 p-8 sm:p-12 relative overflow-hidden backdrop-blur-xl">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 h-80 w-80 rounded-full bg-cyan-500/10 blur-[100px] pointer-events-none" />

          <div className="max-w-3xl mb-10">
            <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-2">
              System Architecture
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
              Zero JavaScript Math. Pure C++17 Core.
            </h2>
            <p className="mt-3 text-sm text-slate-300 leading-relaxed">
              Unlike ordinary visualizers that script algorithm steps in JavaScript, AlgoLens uses
              a decoupled architecture: an authentic C++17 engine generates deterministic JSON traces
              that the browser UI replays with micro-animation control.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <Code2 className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-white">1. C++ Source</div>
              <p className="text-xs text-slate-400">
                Written in standard C++17 with strict algorithmic guarantees and trace instrumentation.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                <code>engine/algorithms/*.cpp</code>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cpu className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-white">2. Emscripten WASM</div>
              <p className="text-xs text-slate-400">
                Compiles to native WebAssembly bytecode executed at near-native CPU speeds inside browser sandbox.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                <code>engine.wasm (170 KB)</code>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Terminal className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-white">3. JSON Step Trace</div>
              <p className="text-xs text-slate-400">
                Returns an ordered array of atomic steps: array values, comparisons, swaps, codeLine & explanations.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                <code>run_algorithm(id, input)</code>
              </div>
            </div>

            <div className="rounded-xl border border-white/10 bg-slate-950/70 p-5 space-y-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-rose-500/10 text-rose-400 border border-rose-500/20">
                <BarChart3 className="h-5 w-5" />
              </div>
              <div className="text-sm font-bold text-white">4. Visual Playback</div>
              <p className="text-xs text-slate-400">
                React 19 smoothly renders state transitions, active code line highlights, and metric counters.
              </p>
              <div className="text-[11px] font-mono text-slate-500">
                <code>Interactive Playback & Scrubbing</code>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── FULL CURRICULUM ROADMAP ─────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold uppercase tracking-wider text-cyan-400 font-mono mb-2">
            Curriculum Coverage
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            Comprehensive Data Structures & Algorithms
          </h2>
          <p className="mt-2 text-sm text-slate-400">
            Phase 1 delivers the core C++ WASM infrastructure and sorting engine. Future phases
            will introduce trees, graphs, dynamic programming, and string search algorithms.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-3">
          {ALL_CATEGORIES.map((cat) => (
            <div
              key={cat.id}
              className={`rounded-xl border p-3.5 flex flex-col justify-between transition-all ${
                cat.implemented > 0
                  ? 'border-cyan-500/40 bg-cyan-950/20 hover:border-cyan-400 shadow-sm'
                  : 'border-white/5 bg-slate-950/40 opacity-75 hover:opacity-100 hover:border-white/15'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-mono text-slate-400">
                    {cat.implemented}/{cat.count}
                  </span>
                  {cat.implemented > 0 ? (
                    <span className="h-2 w-2 rounded-full bg-cyan-400 animate-pulse" />
                  ) : (
                    <span className="h-1.5 w-1.5 rounded-full bg-slate-600" />
                  )}
                </div>
                <div className="font-semibold text-xs text-slate-200">{cat.name}</div>
              </div>
              <div className="mt-3 text-[10px] font-mono text-slate-500">
                {cat.implemented > 0 ? (
                  <span className="text-cyan-400">Phase 1 Live</span>
                ) : (
                  'Planned'
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CTA FOOTER BANNER ───────────────────────────────────── */}
      <section className="px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="relative rounded-3xl border border-white/10 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-8 sm:p-12 text-center overflow-hidden">
          <div className="relative z-10 max-w-2xl mx-auto space-y-4">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Ready to explore sorting algorithms in real time?
            </h2>
            <p className="text-sm text-slate-300">
              Jump directly into the interactive visualizer, input your own custom numbers, step
              through comparisons, and watch the C++ engine in action.
            </p>
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
              <Link
                to="/visualize/bubble-sort"
                className="rounded-xl bg-cyan-400 px-6 py-3 text-sm font-semibold text-slate-950 shadow-lg shadow-cyan-400/20 hover:bg-cyan-300 transition-colors"
              >
                Launch Bubble Sort
              </Link>
              <Link
                to="/visualize/merge-sort"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Launch Merge Sort
              </Link>
              <Link
                to="/visualize/quick-sort"
                className="rounded-xl border border-white/15 bg-white/5 px-6 py-3 text-sm font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Launch Quick Sort
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
