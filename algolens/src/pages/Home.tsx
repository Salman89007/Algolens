import { Link } from 'react-router';
import { ArrowRight, Command, Layers3, Search, Sparkles } from 'lucide-react';
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
  return (
    <div className="landing-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <div className="eyebrow"><span className="eyebrow-dot" /> C++17 · WebAssembly · Step by step</div>
          <h1>See how algorithms <span>think.</span></h1>
          <p className="hero-subline">Follow every comparison, swap, and decision as real C++ algorithms run in your browser.</p>
          <div className="hero-actions">
            <Link to="/visualize/quick-sort" className="primary-action">Explore algorithms <ArrowRight size={16} /></Link>
            <button className="secondary-action" onClick={() => (window as any).__openCommandPalette?.()}><Search size={16} /> Search <kbd>Ctrl K</kbd></button>
          </div>
          <div className="hero-proof"><span><Sparkles size={14} /> Real C++ traces</span><span><Layers3 size={14} /> 3 sorting algorithms ready</span></div>
        </div>
        <div className="hero-demo"><HeroPreview /></div>
      </section>

      <section className="landing-section algorithms-section" id="algorithms">
        <div className="section-heading"><div><span className="section-kicker">START EXPLORING</span><h2>Sorting, brought to life.</h2></div><p>Choose an algorithm to step through its decisions.</p></div>
        <div className="algorithm-grid">
          {ALGORITHMS.map((algo) => (
            <Link key={algo.id} to={`/visualize/${algo.id}`} className="algorithm-card">
              <div className="algorithm-card-top"><span className="card-mark">{algo.name.slice(0, 2).toUpperCase()}</span><span className="complexity">{algo.complexity.average}</span></div>
              <h3>{algo.name}</h3><p>{algo.shortDescription}</p>
              <span className="card-link">Open visualizer <ArrowRight size={14} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="landing-section category-section">
        <div className="section-heading"><div><span className="section-kicker">THE ROADMAP</span><h2>More ways to understand.</h2></div><p>One clear step at a time, across the whole DSA toolkit.</p></div>
        <div className="category-grid">
          {ALL_CATEGORIES.map((category) => {
            const meta = CATEGORY_META[category.id];
            const ready = category.implemented > 0;
            return ready ? (
              <Link key={category.id} to="/visualize/bubble-sort" className="category-card category-ready">
                <span className="category-icon">{meta.icon}</span><span className="category-info"><strong>{category.name}</strong><small>{meta.description}</small></span><span className="category-state">{category.implemented} ready</span>
              </Link>
            ) : (
              <div key={category.id} className="category-card category-soon" aria-label={`${category.name}, coming soon`}>
                <span className="category-icon">{meta.icon}</span><span className="category-info"><strong>{category.name}</strong><small>{meta.description}</small></span><span className="category-state">Coming soon</span>
              </div>
            );
          })}
        </div>
      </section>
      <div className="landing-bottom-note"><Command size={15} /> Tip: press <kbd>Ctrl K</kbd> anytime to jump to an algorithm.</div>
    </div>
  );
}
