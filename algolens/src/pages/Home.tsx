import { Link } from 'react-router';
import { ArrowRight, Command, Search, Sparkles, Cpu, Zap } from 'lucide-react';
import { motion, useReducedMotion } from 'framer-motion';
import { ALGORITHMS, ALL_CATEGORIES } from '@/lib/algorithms-registry';
import { HeroPreview } from '@/components/hero-preview';

const CATEGORY_META: Record<string, { description: string; icon: string }> = {
  sorting: { description: 'Compare three sorting strategies, step by step.', icon: '↕' },
  searching: { description: 'Find values with classic search strategies.', icon: '⌕' },
  arrays: { description: 'Solve common array and window problems.', icon: '[]' },
  'linked-lists': { description: 'Trace pointers through linked structures.', icon: '↗' },
  'stacks-queues': { description: 'Explore ordered access and queue behavior.', icon: '▤' },
  hashing: { description: 'See how hash tables place and find values.', icon: '#' },
  trees: { description: 'Follow traversals, balancing, and heaps.', icon: '⌘' },
  graphs: { description: 'Watch paths and connections take shape.', icon: '⌯' },
  'dynamic-programming': { description: 'Build answers from smaller subproblems.', icon: '▦' },
  backtracking: { description: 'Explore choices, recursion, and pruning.', icon: '↶' },
  greedy: { description: 'See locally optimal choices in action.', icon: '↗' },
  strings: { description: 'Trace pattern matching across text.', icon: 'Aa' },
  'math-bits': { description: 'Unpack number theory and bit tricks.', icon: '01' },
  geometry: { description: 'Watch geometric structures emerge.', icon: '◇' },
};

export default function Home() {
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 16 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: shouldReduceMotion ? 0 : 0.35,
        ease: 'easeOut' as const,
        staggerChildren: shouldReduceMotion ? 0 : 0.08,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 12 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: shouldReduceMotion ? 0 : 0.3, ease: 'easeOut' as const },
    },
  };

  return (
    <div className="landing-page">
      {/* ─── Hero Section ─────────────────────────────────────── */}
      <motion.section
        className="landing-hero"
        initial="hidden"
        animate="visible"
        variants={containerVariants}
      >
        <motion.div className="hero-copy" variants={itemVariants}>
          <div className="eyebrow">
            <span className="eyebrow-dot" />
            <span>C++17 · WebAssembly · Step-by-step</span>
          </div>

          <h1>
            See how algorithms <span>think.</span>
          </h1>

          <p className="hero-subline">
            Follow every comparison, swap, and decision as real C++ algorithms execute in your
            browser with zero server roundtrips.
          </p>

          <div className="hero-actions">
            <Link to="/visualize/quick-sort" className="primary-action">
              Explore algorithms <ArrowRight size={17} />
            </Link>
            <button
              className="secondary-action"
              onClick={() => (window as any).__openCommandPalette?.()}
            >
              <Search size={16} /> Search algorithms <kbd>Ctrl K</kbd>
            </button>
          </div>

          <div className="hero-proof">
            <span>
              <Cpu size={16} /> Compiled WebAssembly
            </span>
            <span>
              <Zap size={16} /> Instant local execution
            </span>
            <span>
              <Sparkles size={16} /> Exact memory traces
            </span>
          </div>
        </motion.div>

        <motion.div className="hero-demo" variants={itemVariants}>
          <HeroPreview />
        </motion.div>
      </motion.section>

      {/* ─── Algorithms Section ───────────────────────────────── */}
      <section className="landing-section algorithms-section" id="algorithms">
        <div className="section-heading">
          <div>
            <span className="section-kicker">START EXPLORING</span>
            <h2>Sorting, brought to life.</h2>
          </div>
          <p>Choose an algorithm to inspect internal comparisons, swaps, and pointer states.</p>
        </div>

        <div className="algorithm-grid">
          {ALGORITHMS.map((algo) => (
            <Link key={algo.id} to={`/visualize/${algo.id}`} className="algorithm-card">
              <div className="algorithm-card-top">
                <span className="card-mark">{algo.name.slice(0, 2).toUpperCase()}</span>
                <span className="complexity">{algo.complexity.average}</span>
              </div>
              <h3>{algo.name}</h3>
              <p>{algo.shortDescription}</p>
              <span className="card-link">
                Open visualizer <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ─── Roadmap / Categories Section ─────────────────────── */}
      <section className="landing-section category-section">
        <div className="section-heading">
          <div>
            <span className="section-kicker">THE ROADMAP</span>
            <h2>More ways to understand.</h2>
          </div>
          <p>One clear step at a time, across the entire data structures and algorithms toolkit.</p>
        </div>

        <div className="category-grid">
          {ALL_CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category.id];
            const ready = category.implemented > 0;
            return ready ? (
              <Link
                key={category.id}
                to="/visualize/bubble-sort"
                className="category-card category-ready"
              >
                <span className="category-icon">{meta.icon}</span>
                <span className="category-info">
                  <strong>{category.name}</strong>
                  <small>{meta.description}</small>
                </span>
                <span className="category-state">{category.implemented} ready</span>
              </Link>
            ) : (
              <div
                key={category.id}
                className="category-card category-soon"
                aria-label={`${category.name}, coming soon`}
              >
                <span className="category-icon">{meta.icon}</span>
                <span className="category-info">
                  <strong>{category.name}</strong>
                  <small>{meta.description}</small>
                </span>
                <span className="category-state">Coming soon</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── Keyboard Shortcut Helper ─────────────────────────── */}
      <div className="landing-bottom-note">
        <Command size={15} /> Tip: press <kbd>Ctrl K</kbd> anywhere to jump straight to an algorithm.
      </div>
    </div>
  );
}
