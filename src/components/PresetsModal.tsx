import React from 'react';
import { PRESET_DFAS } from '../utils/dfaUtils';
import { PresetTestCase } from '../types/dfa';
import { ArrowRight, X, Layers, CheckCircle } from 'lucide-react';
import { Mascot } from './Mascot';

interface PresetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPresetId: string;
  onSelectPreset: (preset: PresetTestCase) => void;
}

export const PresetsModal: React.FC<PresetsModalProps> = ({
  isOpen,
  onClose,
  currentPresetId,
  onSelectPreset,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-3xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcba8] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot size="sm" expression="happy" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2d1e13] flex items-center gap-2">
                <Layers className="w-5 h-5 text-amber-700" />
                Library of Automata Presets
              </h3>
              <p className="text-xs text-[#6e5540]">
                Select standard benchmarks, edge cases, and textbook examples
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#e8dac1] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Presets Grid */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {PRESET_DFAS.map((preset) => {
            const isSelected = currentPresetId === preset.id;
            return (
              <div
                key={preset.id}
                onClick={() => {
                  onSelectPreset(preset);
                  onClose();
                }}
                className={`p-4 rounded-xl border-2 transition-all cursor-pointer flex flex-col justify-between space-y-2.5 ${
                  isSelected
                    ? 'bg-[#f5ebd9] border-amber-600 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-white border-[#dfcca8] hover:border-amber-500 hover:bg-[#fffdfa] shadow-sm'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h4 className="font-serif font-bold text-sm text-[#2b1f16] flex items-center gap-1.5">
                      {preset.name}
                    </h4>
                    {isSelected ? (
                      <span className="flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full border border-amber-300">
                        <CheckCircle className="w-3 h-3 text-amber-700" /> Active
                      </span>
                    ) : (
                      <span className="text-[11px] font-mono text-stone-500">
                        {preset.dfa.states.length} states → {preset.expectedStateCount} min
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5c4634] mt-1.5 leading-relaxed">
                    {preset.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#ebdcc4] flex items-center justify-between text-xs font-mono text-stone-600">
                  <div className="flex gap-1.5 text-[11px]">
                    <span className="px-1.5 py-0.5 rounded bg-stone-100 border border-stone-200">
                      Alphabet: {preset.dfa.alphabet.join(', ')}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-emerald-50 border border-emerald-200 text-emerald-800">
                      Final: {preset.dfa.finalStates.join(', ') || 'Ø'}
                    </span>
                  </div>

                  <span className="font-sans font-semibold text-xs text-[#263152] flex items-center gap-1 hover:underline">
                    Load <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-between">
          <span className="text-xs text-[#7d634e]">Click any preset to load instantly into the minimizer.</span>
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-semibold text-stone-700 hover:bg-[#e6d8c0] rounded-lg transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
