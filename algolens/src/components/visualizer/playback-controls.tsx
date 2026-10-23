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
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-4 sm:p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-4">
      {/* Scrubbable Timeline Progress Bar */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs sm:text-sm font-mono">
          <span className="text-slate-600 font-medium">
            Timeline:{' '}
            <span className="text-slate-950 font-bold">
              {currentStep + 1} / {totalSteps || 1}
            </span>{' '}
            steps
          </span>
          <span className="text-slate-900 font-bold">{progressPercent}%</span>
        </div>

        <div className="relative flex items-center group">
          <input
            type="range"
            min={0}
            max={Math.max(totalSteps - 1, 0)}
            value={currentStep}
            onChange={(e) => onScrub(Number(e.target.value))}
            className="w-full h-2 rounded-lg bg-slate-200 accent-slate-950 cursor-pointer appearance-none focus:outline-none transition-all"
            aria-label="Execution timeline scrubber"
          />
        </div>
      </div>

      {/* Control Buttons & Speed */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
        {/* Playback Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Reset */}
          <button
            onClick={onReset}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 active:scale-95 transition-all"
            title="Restart from beginning"
            aria-label="Restart"
          >
            <RotateCcw className="h-4 w-4" />
          </button>

          {/* Step Back */}
          <button
            onClick={onStepBack}
            disabled={currentStep <= 0}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            title="Step Back"
            aria-label="Step Back"
          >
            <SkipBack className="h-4 w-4" />
          </button>

          {/* Play / Pause Primary Obsidian Button */}
          <button
            onClick={onPlayPause}
            className="flex h-10 px-5 items-center justify-center gap-2 rounded-xl bg-slate-950 text-white font-semibold text-sm shadow-md hover:bg-slate-800 active:scale-98 transition-all"
            title={isPlaying ? 'Pause animation' : 'Play animation'}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <>
                <Pause className="h-4 w-4 fill-current" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="h-4 w-4 fill-current ml-0.5" />
                <span>Play</span>
              </>
            )}
          </button>

          {/* Step Forward */}
          <button
            onClick={onStepForward}
            disabled={currentStep >= totalSteps - 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            title="Step Forward"
            aria-label="Step Forward"
          >
            <SkipForward className="h-4 w-4" />
          </button>

          {/* Jump to End */}
          <button
            onClick={onJumpToEnd}
            disabled={currentStep >= totalSteps - 1}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-700 shadow-2xs hover:bg-slate-50 hover:text-slate-950 disabled:opacity-30 disabled:pointer-events-none active:scale-95 transition-all"
            title="Jump to completion"
            aria-label="Jump to completion"
          >
            <FastForward className="h-4 w-4" />
          </button>
        </div>

        {/* Speed Selector Presets */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1 text-xs text-slate-500 mr-1 font-medium">
            <Gauge className="h-3.5 w-3.5 text-slate-700" />
            <span className="hidden sm:inline">Speed:</span>
          </div>

          <div className="flex items-center rounded-xl border border-slate-200/80 bg-slate-100/80 p-1">
            {SPEED_PRESETS.map((p) => {
              const active = speed === p.ms;
              return (
                <button
                  key={p.label}
                  onClick={() => onSpeedChange(p.ms)}
                  className={`px-2.5 py-1 text-xs font-mono font-semibold rounded-lg transition-all ${
                    active
                      ? 'bg-slate-950 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-950 hover:bg-white/60'
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
