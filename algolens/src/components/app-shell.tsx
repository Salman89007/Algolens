import { useState, useEffect, type ReactNode } from 'react';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { CommandPalette } from '@/components/command-palette';

interface AppShellProps { children: ReactNode }

export function AppShell({ children }: AppShellProps) {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  useEffect(() => {
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
