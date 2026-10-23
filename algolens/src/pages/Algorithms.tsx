import { useState, useMemo } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Search, Filter } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ALGORITHMS, ALL_CATEGORIES } from '@/lib/algorithms-registry';

const CATEGORY_META: Record<string, { description: string; icon: string }> = {
  sorting: { description: 'Compare sorting strategies step-by-step.', icon: '↕' },
  searching: { description: 'Find values with classic search strategies.', icon: '⌕' },
  arrays: { description: 'Solve common array and sliding window problems.', icon: '[]' },
  'linked-lists': { description: 'Trace pointers through linked structures.', icon: '↗' },
  'stacks-queues': { description: 'Explore ordered access and buffer operations.', icon: '▤' },
  hashing: { description: 'See how hash tables place and retrieve values.', icon: '#' },
  trees: { description: 'Follow tree traversals, balancing, and heaps.', icon: '⌘' },
  graphs: { description: 'Watch paths and connections take shape.', icon: '⌯' },
  'dynamic-programming': { description: 'Build answers from smaller subproblems.', icon: '▦' },
  backtracking: { description: 'Explore choices, recursion, and pruning.', icon: '↶' },
  greedy: { description: 'See locally optimal choices in action.', icon: '↗' },
  strings: { description: 'Trace pattern matching across text.', icon: 'Aa' },
  'math-bits': { description: 'Unpack number theory and bit tricks.', icon: '01' },
  geometry: { description: 'Watch geometric structures emerge.', icon: '◇' },
};

export default function Algorithms() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const shouldReduceMotion = useReducedMotion();

  const filteredAlgorithms = useMemo(() => {
    return ALGORITHMS.filter((algo) => {
      const matchesSearch = `${algo.name} ${algo.id} ${algo.shortDescription} ${algo.categoryLabel}`
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesCategory =
        selectedCategory === 'all' || algo.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8 space-y-12">
      {/* ─── Page Header ───────────────────────────────────────── */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-200/80 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-slate-200/80 bg-white px-3 py-1 text-xs font-mono font-semibold text-slate-600 shadow-2xs mb-3">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>ALGORITHM DIRECTORY</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-950 font-heading">
            Algorithms & Data Structures
          </h1>
          <p className="mt-3 text-base sm:text-lg text-slate-600 leading-relaxed font-medium">
            High-performance C++17 implementations compiled to WebAssembly. Inspect memory,
            pointer movements, and step-by-step execution in your browser.
          </p>
        </div>

        {/* Search input */}
        <div className="w-full md:w-80 relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search algorithms…"
            className="w-full rounded-xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm font-medium text-slate-900 placeholder:text-slate-400 shadow-xs outline-none focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-all"
          />
        </div>
      </div>

      {/* ─── Category Filter Pills ─────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-2">
        <button
          onClick={() => setSelectedCategory('all')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            selectedCategory === 'all'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <Filter className="h-3.5 w-3.5" />
          <span>All Modules</span>
          <span className="ml-1 rounded-full bg-slate-200/40 px-1.5 py-0.2 text-[10px] font-mono">
            {ALGORITHMS.length}
          </span>
        </button>

        <button
          onClick={() => setSelectedCategory('sorting')}
          className={`flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
            selectedCategory === 'sorting'
              ? 'bg-slate-950 text-white shadow-sm'
              : 'border border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
          }`}
        >
          <span>Sorting</span>
          <span className="ml-1 rounded-full bg-slate-200/40 px-1.5 py-0.2 text-[10px] font-mono">
            3
          </span>
        </button>

        <span className="text-xs font-medium text-slate-400 px-2 hidden sm:inline">
          Roadmap categories below
        </span>
      </div>

      {/* ─── Algorithm Cards Grid ──────────────────────────────── */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight text-slate-900 font-heading">
            Ready to Visualize ({filteredAlgorithms.length})
          </h2>
          <span className="text-xs font-mono text-slate-500">Real-time WASM traces</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAlgorithms.map((algo) => (
            <motion.div
              key={algo.id}
              whileHover={{ y: shouldReduceMotion ? 0 : -4 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="flex flex-col justify-between rounded-2xl border border-slate-200/80 bg-white/90 p-6 shadow-[0_4px_20px_rgba(0,0,0,0.03)] backdrop-blur-md transition-all hover:border-slate-400 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)]"
            >
              <div>
                {/* Card Top */}
                <div className="flex items-center justify-between gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-100 text-slate-900 font-mono text-sm font-bold border border-slate-200/60 shadow-xs">
                    {algo.name.slice(0, 2).toUpperCase()}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-mono font-semibold text-slate-700 border border-slate-200/60">
                      {algo.complexity.average}
                    </span>
                  </div>
                </div>

                {/* Title & Description */}
                <h3 className="mt-4 text-xl font-bold tracking-tight text-slate-950 font-heading">
                  {algo.name}
                </h3>
                <p className="mt-2 text-sm text-slate-600 leading-relaxed font-medium">
                  {algo.shortDescription}
                </p>

                {/* Complexity Specs */}
                <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-xs font-mono text-slate-600">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Worst</span>
                    <span className="font-semibold text-slate-900">
                      {algo.complexity.worst}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase">Space</span>
                    <span className="font-semibold text-slate-900">
                      {algo.complexity.space}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Link */}
              <div className="mt-6 pt-4 border-t border-slate-100">
                <Link
                  to={`/visualize/${algo.id}`}
                  className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-950 px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
                >
                  <span>Launch Visualizer</span>
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Roadmap Categories ────────────────────────────────── */}
      <section className="space-y-6 pt-8 border-t border-slate-200/80">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <span className="text-xs font-mono font-bold tracking-wider text-slate-400 uppercase">
              Complete DSA Toolkit
            </span>
            <h2 className="text-2xl font-bold tracking-tight text-slate-950 font-heading">
              Categories & Extended Coverage
            </h2>
          </div>
          <p className="text-sm text-slate-500 font-medium">
            Continuous C++ engine expansion across classic algorithmic patterns.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_CATEGORIES.map((cat) => {
            const meta = CATEGORY_META[cat.id] || {
              description: 'Algorithmic module',
              icon: '◇',
            };
            const isReady = cat.implemented > 0;

            return (
              <div
                key={cat.id}
                className={`flex items-start gap-4 rounded-xl border p-4 transition-all ${
                  isReady
                    ? 'border-slate-300 bg-white shadow-xs hover:border-slate-900'
                    : 'border-slate-200/70 bg-white/60 opacity-80'
                }`}
              >
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100 text-slate-900 font-mono text-base font-bold border border-slate-200/60">
                  {meta.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1">
                    <strong className="text-sm font-semibold text-slate-900 truncate">
                      {cat.name}
                    </strong>
                    {isReady ? (
                      <span className="rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-mono font-bold text-emerald-700 border border-emerald-200">
                        {cat.implemented} Ready
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono font-medium text-slate-400">
                        Planned
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-slate-500 leading-snug line-clamp-2">
                    {meta.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
