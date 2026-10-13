import { Link } from 'react-router';
import { Code2, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <Link to="/" className="brand footer-brand"><span className="brand-icon"><Code2 size={16} /></span><span>Algo<span>Lens</span></span></Link>
        <p>Understand the decisions behind the code.</p>
        <a href="https://github.com" target="_blank" rel="noreferrer"><Github size={15} /> GitHub</a>
        <span className="footer-copy">© {new Date().getFullYear()} AlgoLens</span>
      </div>
    </footer>
  );
}
