import { Link } from 'react-router';
import { Code2, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer mt-auto border-t border-slate-200/80 bg-white/70 py-8 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 sm:flex-row sm:px-6 lg:px-8">
        <Link to="/" className="brand flex items-center gap-2.5 text-slate-900 no-underline">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-950 text-white shadow-xs">
            <Code2 className="h-4 w-4" />
          </div>
          <span className="font-heading text-base font-bold tracking-tight text-slate-900">
            Algo<span className="text-slate-500 font-medium">Lens</span>
          </span>
        </Link>

        <p className="text-center text-sm font-medium text-slate-500">
          Understand the decisions behind algorithms through live C++ execution.
        </p>

        <div className="flex items-center gap-4 text-sm font-medium text-slate-600">
          <a
            href="https://github.com/Salman89007/Algolens"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-1.5 hover:text-slate-950 transition-colors"
          >
            <Github className="h-4 w-4" />
            <span>GitHub</span>
          </a>
          <span className="text-slate-300">·</span>
          <span className="text-xs font-mono text-slate-400">
            © {new Date().getFullYear()} AlgoLens
          </span>
        </div>
      </div>
    </footer>
  );
}
