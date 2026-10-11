import { Routes, Route, Navigate } from 'react-router';
import { ThemeProvider } from '@/components/theme-provider';
import { AppShell } from '@/components/app-shell';
import Home from '@/pages/Home';
import Visualizer from '@/pages/Visualizer';

export default function App() {
  return (
    <ThemeProvider>
      <AppShell>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/visualize/:algoId" element={<Visualizer />} />
          <Route path="/visualize" element={<Navigate to="/visualize/bubble-sort" replace />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AppShell>
    </ThemeProvider>
  );
}
