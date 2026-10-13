import { useState } from 'react';
import { Dices, Sparkles, Sliders, AlertCircle } from 'lucide-react';
import type { SampleInput } from '@/types/algorithm';

interface CustomInputCardProps {
  currentInput: number[];
  sampleInputs: SampleInput[];
  onApplyInput: (newArray: number[]) => void;
}

export function CustomInputCard({
  currentInput,
  sampleInputs,
  onApplyInput,
}: CustomInputCardProps) {
  const [inputText, setInputText] = useState(currentInput.join(', '));
  const [error, setError] = useState<string | null>(null);
  const [randomSize, setRandomSize] = useState(8);

  const handleApply = (text: string) => {
    try {
      const parts = text
        .split(',')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

      if (parts.length === 0) {
        setError('Please enter at least one number.');
        return;
      }

      if (parts.length > 40) {
        setError('Maximum array size is 40 elements for optimal visual clarity.');
        return;
      }

      const parsed: number[] = [];
      for (const part of parts) {
        const num = Number(part);
        if (isNaN(num)) {
          setError(`"${part}" is not a valid integer number.`);
          return;
        }
        if (num < -999 || num > 999) {
          setError('Please keep values between -999 and 999.');
          return;
        }
        parsed.push(num);
      }

      setError(null);
      onApplyInput(parsed);
    } catch {
      setError('Invalid format. Use comma-separated integers (e.g. 5, 3, 1, 4, 2).');
    }
  };

  const handleRandomize = () => {
    const arr: number[] = [];
    for (let i = 0; i < randomSize; i++) {
      arr.push(Math.floor(Math.random() * 90) + 10);
    }
    const formatted = arr.join(', ');
    setInputText(formatted);
    setError(null);
    onApplyInput(arr);
  };

  const handlePreset = (presetArr: number[]) => {
    const formatted = presetArr.join(', ');
    setInputText(formatted);
    setError(null);
    onApplyInput(presetArr);
  };

  return (
    <div className="w-full rounded-2xl border border-white/10 bg-slate-950/80 p-5 shadow-xl backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-white/10 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-cyan-400" />
          <span className="text-sm font-semibold text-white">Custom Array Input</span>
        </div>
        <span className="text-sm text-slate-400 font-mono">
          {currentInput.length} elements loaded
        </span>
      </div>

      {/* Input Field Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleApply(inputText);
        }}
        className="space-y-3"
      >
        <div className="relative">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              setError(null);
            }}
            placeholder="e.g. 5, 3, 8, 4, 2, 7, 1, 6"
            className="w-full rounded-xl border border-white/10 bg-slate-900/90 px-3.5 py-3 text-base font-mono text-cyan-300 placeholder-slate-500 focus:border-cyan-500/50 focus:outline-none focus:ring-1 focus:ring-cyan-500/50"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-sm text-rose-400 font-medium">
            <AlertCircle className="h-3.5 w-3.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-sm text-slate-400 mr-1 flex items-center gap-1">
              <Sparkles className="h-3 w-3 text-cyan-400" /> Presets:
            </span>
            {sampleInputs.slice(0, 4).map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => handlePreset(preset.input)}
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-slate-300 hover:text-white hover:bg-white/10 hover:border-cyan-500/30 transition-colors"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Random generator */}
            <div className="flex items-center gap-1 rounded-xl border border-white/10 bg-white/5 p-1">
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-1.5 px-3 py-2 text-sm text-slate-300 hover:text-cyan-300 transition-colors"
                title="Generate random array"
              >
                <Dices className="h-3.5 w-3.5 text-cyan-400" />
                <span>Random</span>
              </button>
              <select
                value={randomSize}
                onChange={(e) => setRandomSize(Number(e.target.value))}
                className="bg-transparent text-sm font-mono text-slate-300 focus:outline-none pr-1"
                title="Random array length"
              >
                <option value={5} className="bg-slate-900">
                  5 items
                </option>
                <option value={8} className="bg-slate-900">
                  8 items
                </option>
                <option value={12} className="bg-slate-900">
                  12 items
                </option>
                <option value={16} className="bg-slate-900">
                  16 items
                </option>
                <option value={20} className="bg-slate-900">
                  20 items
                </option>
              </select>
            </div>

            <button
              type="submit"
              className="rounded-xl bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-300 shadow-sm transition-colors"
            >
              Apply Array
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
