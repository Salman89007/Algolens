import { useState, useEffect, type ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CommandPalette } from '@/components/command-palette';
import { tokens } from '@/lib/tokens';

interface AppShellProps { children: ReactNode }

export function AppShell({ children }: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--page-bg', tokens.colors.background);
    root.style.setProperty('--page-surface', tokens.colors.surface);
    root.style.setProperty('--soft-surface', tokens.colors.surfaceHover);
    root.style.setProperty('--page-text', tokens.colors.text.primary);
    root.style.setProperty('--muted-text', tokens.colors.text.secondary);
    root.style.setProperty('--hairline', tokens.colors.border);
    root.style.setProperty('--accent-color', tokens.colors.accent.DEFAULT);
    root.style.setProperty('--accent-hover', tokens.colors.accent.hover);
    root.style.setProperty('--font-heading', tokens.fonts.heading);
    root.style.setProperty('--font-body', tokens.fonts.body);
    root.style.setProperty('--font-mono', tokens.fonts.mono);
    root.style.setProperty('--spring', tokens.motion.springEasing);
    (window as any).__openCommandPalette = () => setCommandPaletteOpen(true);
    return () => { delete (window as any).__openCommandPalette; };
  }, []);
  return (
    <div className="app-shell">
      <Navbar onOpenCommandPalette={() => setCommandPaletteOpen(true)} />
      <main className="app-main">{children}</main>
      <Footer />
      <CommandPalette isOpen={commandPaletteOpen} onClose={() => setCommandPaletteOpen(false)} />
    </div>
  );
}
