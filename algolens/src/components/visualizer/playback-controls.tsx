import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCcw,
  FastForward,
  Gauge,
} from 'lucide-react';

interface PlaybackControlsProps {
  currentStep: number;
  totalSteps: number;
  isPlaying: boolean;
  speed: number; // in milliseconds (e.g. 50 to 1000)
  onPlayPause: () => void;
  onStepBack: () => void;
  onStepForward: () => void;
  onReset: () => void;
  onJumpToEnd: () => void;
  onScrub: (stepIndex: number) => void;
  onSpeedChange: (speedMs: number) => void;
}

const SPEED_PRESETS = [
  { label: '0.25x', ms: 1000 },
  { label: '0.5x', ms: 600 },
  { label: '1x', ms: 300 },
  { label: '2x', ms: 150 },
  { label: '4x', ms: 60 },
];

export function PlaybackControls({
  currentStep,
  totalSteps,
  isPlaying,
  speed,
  onPlayPause,
  onStepBack,
  onStepForward,
  onReset,
  onJumpToEnd,
  onScrub,
  onSpeedChange,
}: PlaybackControlsProps) {
  const progressPercent =
    totalSteps > 1 ? Math.round((currentStep / (totalSteps - 1)) * 100) : 100;

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-4 sm:p-5 shadow-xl backdrop-blur-xl space-y-4">
      {/* Scrubbable Timeline Progress Bar */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between text-sm font-mono">
          <span className="text-slate-400">
            Execution Timeline:{' '}
            <span className="text-cyan-400 font-bold">
              {currentStep + 1} / {totalSteps || 1}
            </span>{' '}
            steps
          </span>
          <span className="text-slate-400">{progressPercent}%</span>
        </div>

        <div className="relative flex items-center group">
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={currentStep}
            onChange={(e) => onScrub(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-800 accent-cyan-400 cursor-pointer appearance-none focus:outline-none transition-all"
          />
        </div>
      </div>

      {/* Control Buttons & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-4 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 hover:border-white/20 transition-colors"
            title="Restart from beginning (R)"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBack}
            disabled={currentStep <= 0}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Step Back (← Left Arrow)"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Play / Pause Primary Button */}
          <button
            onClick={onPlayPause}
            className={`flex h-10 px-5 items-center justify-center gap-2 rounded-xl font-semibold text-sm transition-all shadow-md ${
              isPlaying
                ? 'bg-amber-400 text-slate-950 hover:bg-amber-300 shadow-amber-500/20'
                : 'bg-cyan-400 text-slate-950 hover:bg-cyan-300 shadow-cyan-400/30'
            }`}
            title="Play / Pause (Space)"
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Step Forward (→ Right Arrow)"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Jump to End */}
          <button
            onClick={onJumpToEnd}
            disabled={currentStep >= totalSteps - 1}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-slate-300 hover:text-white hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-colors"
            title="Jump to complete state"
          >
            <FastForward className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Selector Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-sm text-slate-400 mr-1">
            <Gauge className="h-3.5 w-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Speed:</span>
          </div>

          <div className="flex items-center rounded-xl border border-white/10 bg-slate-900/90 p-1">
            {SPEED_PRESETS.map((p) => {
              const active = speed === p.ms;
              return (
                <button
                  key={p.label}
                  onClick={() => onSpeedChange(p.ms)}
                  className={`px-2.5 py-1.5 text-sm font-mono rounded-lg transition-colors ${
                    active
                      ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
