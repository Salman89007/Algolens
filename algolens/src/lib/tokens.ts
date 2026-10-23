export const tokens = {
  colors: {
    background: '#f8fafc',
    surface: 'rgba(255, 255, 255, 0.85)',
    surfaceElevated: '#ffffff',
    surfaceHover: '#f1f5f9',
    border: 'rgba(0, 0, 0, 0.08)',
    borderHover: 'rgba(0, 0, 0, 0.18)',
    borderActive: 'rgba(0, 0, 0, 0.4)',
    accent: {
      DEFAULT: '#0f172a', // Obsidian black for primary buttons & clickable elements
      hover: '#1e293b',
      active: '#000000',
      muted: 'rgba(15, 23, 42, 0.06)',
      border: 'rgba(15, 23, 42, 0.15)',
      glow: 'rgba(0, 0, 0, 0.08)',
      light: '#334155',
    },
    signal: {
      solid: '#0f172a',
      bg: 'rgba(15, 23, 42, 0.08)',
      border: 'rgba(15, 23, 42, 0.25)',
      text: '#0f172a',
    },
    status: {
      compare: {
        solid: '#0f172a',
        bg: 'rgba(15, 23, 42, 0.08)',
        border: 'rgba(15, 23, 42, 0.3)',
        text: '#0f172a',
      },
      swap: {
        solid: '#000000',
        bg: 'rgba(0, 0, 0, 0.12)',
        border: 'rgba(0, 0, 0, 0.4)',
        text: '#000000',
      },
      sorted: {
        solid: '#059669',
        bg: 'rgba(5, 150, 105, 0.1)',
        border: 'rgba(5, 150, 105, 0.3)',
        text: '#047857',
      },
      current: {
        solid: '#334155',
        bg: 'rgba(51, 65, 85, 0.08)',
        border: 'rgba(51, 65, 85, 0.25)',
        text: '#1e293b',
      },
      pivot: {
        solid: '#64748b',
        bg: 'rgba(100, 116, 139, 0.08)',
        border: 'rgba(100, 116, 139, 0.25)',
        text: '#334155',
      },
      defaultBar: {
        solid: '#cbd5e1',
        bg: 'rgba(203, 213, 225, 0.35)',
        border: 'rgba(203, 213, 225, 0.7)',
        text: '#64748b',
      },
    },
    text: {
      primary: '#0f172a',
      secondary: '#475569',
      muted: '#64748b',
      faint: '#94a3b8',
    },
  },
  fonts: {
    heading: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
    display: '"Space Grotesk", system-ui, sans-serif',
  },
  radii: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '24px',
    full: '9999px',
  },
  shadows: {
    subtle: '0 1px 3px rgba(0, 0, 0, 0.04), 0 1px 2px rgba(0, 0, 0, 0.02)',
    card: '0 12px 35px -8px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
    elevated: '0 20px 50px -10px rgba(0, 0, 0, 0.08), 0 1px 3px rgba(0, 0, 0, 0.04)',
    innerHairline: 'inset 0 1px rgba(255, 255, 255, 0.8)',
  },
  motion: {
    durationFast: '120ms',
    durationNormal: '180ms',
    durationSlow: '240ms',
    springEasing: 'cubic-bezier(0.16, 1, 0.3, 1)',
    springTransition: {
      type: 'spring',
      stiffness: 420,
      damping: 32,
      mass: 0.8,
    },
  },
} as const;

export type DesignTokens = typeof tokens;
