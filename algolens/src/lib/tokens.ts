/**
 * AlgoLens Design System Tokens
 * Linear / Vercel / Raycast-inspired developer aesthetics.
 */

export const tokens = {
  colors: {
    // Canvas & Surfaces
    background: '#09090b', // Near-black zinc-950
    surface: '#111114', // Subtle matte card surface
    surfaceElevated: '#18181b', // Modal, dropdown, tooltip surface
    surfaceHover: '#1f1f23',

    // Borders & Hairlines
    border: 'rgba(255, 255, 255, 0.08)',
    borderHover: 'rgba(255, 255, 255, 0.16)',
    borderActive: 'rgba(139, 92, 246, 0.4)',

    // Primary Brand Accent (Electric Violet)
    accent: {
      DEFAULT: '#8b5cf6', // Electric Violet (violet-500)
      hover: '#7c3aed', // violet-600
      active: '#6d28d9', // violet-700
      muted: 'rgba(139, 92, 246, 0.12)',
      border: 'rgba(139, 92, 246, 0.28)',
      glow: 'rgba(139, 92, 246, 0.22)',
      light: '#a78bfa', // violet-400
    },

    // Algorithm State Colors (Restrained, High-Contrast)
    status: {
      compare: {
        solid: '#f59e0b', // Amber
        bg: 'rgba(245, 158, 11, 0.14)',
        border: 'rgba(245, 158, 11, 0.35)',
        text: '#fbbf24',
      },
      swap: {
        solid: '#f43f5e', // Rose
        bg: 'rgba(244, 63, 94, 0.14)',
        border: 'rgba(244, 63, 94, 0.35)',
        text: '#fda4af',
      },
      sorted: {
        solid: '#10b981', // Emerald
        bg: 'rgba(16, 185, 129, 0.14)',
        border: 'rgba(16, 185, 129, 0.35)',
        text: '#34d399',
      },
      current: {
        solid: '#0ea5e9', // Sky
        bg: 'rgba(14, 165, 233, 0.14)',
        border: 'rgba(14, 165, 233, 0.35)',
        text: '#38bdf8',
      },
      pivot: {
        solid: '#8b5cf6', // Violet
        bg: 'rgba(139, 92, 246, 0.18)',
        border: 'rgba(139, 92, 246, 0.45)',
        text: '#c4b5fd',
      },
      defaultBar: {
        solid: '#3f3f46', // Neutral bar
        bg: 'rgba(63, 63, 70, 0.3)',
        border: 'rgba(161, 161, 170, 0.25)',
        text: '#d4d4d8',
      },
    },

    // Typography
    text: {
      primary: '#fafafa', // zinc-50
      secondary: '#a1a1aa', // zinc-400
      muted: '#71717a', // zinc-500
      faint: '#52525b', // zinc-600
    },
  },

  fonts: {
    heading: '"Space Grotesk", system-ui, -apple-system, sans-serif',
    body: '"Inter", system-ui, -apple-system, sans-serif',
    mono: '"JetBrains Mono", ui-monospace, SFMono-Regular, monospace',
  },

  radii: {
    sm: '6px',
    md: '8px',
    lg: '12px',
    xl: '16px',
    full: '9999px',
  },

  shadows: {
    subtle: '0 1px 2px 0 rgba(0, 0, 0, 0.4)',
    card: '0 4px 16px -2px rgba(0, 0, 0, 0.5), 0 1px 2px 0 rgba(0, 0, 0, 0.3)',
    violetGlow: '0 0 24px -4px rgba(139, 92, 246, 0.25)',
    innerHairline: 'inset 0 1px 0 0 rgba(255, 255, 255, 0.08)',
  },

  motion: {
    // Springs & Transitions (All durations <= 250ms)
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
