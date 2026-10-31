import React from 'react';
import { PRESET_DFAS } from '../utils/dfaUtils';
import { PresetTestCase } from '../types/dfa';
import { Sparkles, ArrowRight } from 'lucide-react';

interface TestPresetsProps {
  currentPresetId?: string;
  onSelectPreset: (preset: PresetTestCase) => void;
}

export const TestPresets: React.FC<TestPresetsProps> = ({
  currentPresetId,
  onSelectPreset,
}) => {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      <div>
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-indigo-400" />
          Preset Test Suite & Edge Cases
        </h2>
        <p className="text-xs text-slate-400">
          Load standard and edge case test scenarios required by academic evaluation specifications.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {PRESET_DFAS.map((preset) => {
          const isSelected = currentPresetId === preset.id;
          return (
            <div
              key={preset.id}
              onClick={() => onSelectPreset(preset)}
              className={`p-3.5 rounded-xl border transition cursor-pointer flex flex-col justify-between space-y-2 ${
                isSelected
                  ? 'bg-indigo-950/40 border-indigo-500 shadow-md ring-1 ring-indigo-500/50'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
              }`}
            >
              <div>
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-white flex items-center gap-1.5">
                    {preset.name}
                  </h3>
                  {isSelected && (
                    <span className="text-indigo-400 text-xs font-bold">Loaded ✓</span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 mt-1 line-clamp-2">{preset.description}</p>
              </div>

              <div className="flex items-center justify-between border-t border-slate-800/80 pt-2 text-[11px] font-mono text-slate-400">
                <span>{preset.dfa.states.length} states → {preset.expectedStateCount} min</span>
                <span className="text-indigo-400 font-sans text-xs flex items-center gap-1 hover:underline">
                  Load <ArrowRight className="w-3 h-3" />
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
