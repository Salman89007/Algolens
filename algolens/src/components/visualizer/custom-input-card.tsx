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
    <div className="w-full rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_8px_24px_rgba(0,0,0,0.04)] backdrop-blur-xl space-y-4">
      <div className="flex items-center justify-between border-b border-slate-100 pb-3">
        <div className="flex items-center gap-2">
          <Sliders className="h-4 w-4 text-slate-700" />
          <span className="text-sm font-bold text-slate-900 font-heading">
            Custom Array Input
          </span>
        </div>
        <span className="text-xs text-slate-500 font-mono">
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
            className="w-full rounded-xl border border-slate-200 bg-slate-50/70 px-4 py-2.5 text-sm font-mono text-slate-900 placeholder-slate-400 focus:border-slate-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900 transition-all shadow-xs"
            aria-label="Custom input array"
          />
        </div>

        {error && (
          <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs text-slate-500 mr-1 flex items-center gap-1 font-medium">
              <Sparkles className="h-3 w-3 text-slate-700" /> Presets:
            </span>
            {sampleInputs.slice(0, 4).map((preset) => (
              <button
                type="button"
                key={preset.label}
                onClick={() => handlePreset(preset.input)}
                className="rounded-lg border border-slate-200 bg-white px-2.5 py-1 text-xs font-medium text-slate-700 hover:text-slate-950 hover:bg-slate-50 hover:border-slate-300 shadow-2xs transition-colors"
                title={preset.description}
              >
                {preset.label}
              </button>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            {/* Random generator */}
            <div className="flex items-center gap-1 rounded-xl border border-slate-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={handleRandomize}
                className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-slate-700 hover:text-slate-950 transition-colors"
                title="Generate random array"
              >
                <Dices className="h-3.5 w-3.5 text-slate-800" />
                <span>Random</span>
              </button>
              <select
                value={randomSize}
                onChange={(e) => setRandomSize(Number(e.target.value))}
                className="bg-transparent text-xs font-mono text-slate-700 focus:outline-none pr-1 font-semibold"
                title="Random array length"
                aria-label="Random array size"
              >
                <option value={5}>5 items</option>
                <option value={8}>8 items</option>
                <option value={12}>12 items</option>
                <option value={16}>16 items</option>
                <option value={20}>20 items</option>
              </select>
            </div>

            {/* Primary Apply Button */}
            <button
              type="submit"
              className="rounded-xl bg-slate-950 px-4 py-2 text-xs font-semibold text-white shadow-xs hover:bg-slate-800 active:scale-98 transition-all"
            >
              Apply Array
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
