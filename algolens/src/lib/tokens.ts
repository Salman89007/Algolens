export const tokens = {
  colors: {
    background: '#f7f7f5', surface: 'rgba(255,255,255,.72)', surfaceElevated: 'rgba(255,255,255,.9)', surfaceHover: 'rgba(255,255,255,.98)', border: 'rgba(0,0,0,.1)', borderHover: 'rgba(0,0,0,.22)', borderActive: 'rgba(0,0,0,.5)',
    accent: { DEFAULT: '#111111', hover: '#303030', active: '#000000', muted: 'rgba(0,0,0,.06)', border: 'rgba(0,0,0,.14)', glow: 'rgba(0,0,0,.12)', light: '#525252' },
    signal: { solid: '#e10600', bg: 'rgba(225,6,0,.1)', border: 'rgba(225,6,0,.35)', text: '#c00000' },
    status: {
      compare: { solid: '#e10600', bg: 'rgba(225,6,0,.1)', border: 'rgba(225,6,0,.35)', text: '#c00000' }, swap: { solid: '#e10600', bg: 'rgba(225,6,0,.1)', border: 'rgba(225,6,0,.35)', text: '#c00000' }, sorted: { solid: '#161616', bg: 'rgba(0,0,0,.08)', border: 'rgba(0,0,0,.25)', text: '#161616' }, current: { solid: '#4b4b4b', bg: 'rgba(0,0,0,.08)', border: 'rgba(0,0,0,.25)', text: '#303030' }, pivot: { solid: '#777777', bg: 'rgba(0,0,0,.06)', border: 'rgba(0,0,0,.2)', text: '#454545' }, defaultBar: { solid: '#b8b8b8', bg: 'rgba(0,0,0,.05)', border: 'rgba(0,0,0,.12)', text: '#161616' },
    },
    text: { primary: '#111111', secondary: '#5c5c5c', muted: '#777777', faint: '#a1a1a1' },
  },
  fonts: { heading: '"Inter", system-ui, sans-serif', body: '"Inter", system-ui, sans-serif', mono: '"JetBrains Mono", ui-monospace, monospace', display: '"Doto", ui-monospace, monospace' },
  radii: { sm: '10px', md: '14px', lg: '20px', xl: '28px', full: '9999px' },
  shadows: { subtle: '0 1px 2px rgba(0,0,0,.04)', card: '0 16px 45px rgba(0,0,0,.08), inset 0 1px rgba(255,255,255,.9)', violetGlow: '0 12px 36px rgba(0,0,0,.12)', innerHairline: 'inset 0 1px rgba(255,255,255,.92)' },
  motion: { durationFast: '120ms', durationNormal: '180ms', durationSlow: '240ms', springEasing: 'cubic-bezier(.16,1,.3,1)', springTransition: { type: 'spring', stiffness: 420, damping: 32, mass: .8 } },
} as const;
export type DesignTokens = typeof tokens;
