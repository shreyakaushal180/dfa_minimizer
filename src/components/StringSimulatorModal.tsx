import React from 'react';
import { DFA } from '../types/dfa';
import { SideBySideSimulator } from './SideBySideSimulator';
import { Sparkles, X } from 'lucide-react';
import { Mascot } from './Mascot';

interface StringSimulatorModalProps {
  isOpen: boolean;
  onClose: () => void;
  originalDFA: DFA;
  minimizedDFA: DFA;
  initialStrings?: string[];
}

export const StringSimulatorModal: React.FC<StringSimulatorModalProps> = ({
  isOpen,
  onClose,
  originalDFA,
  minimizedDFA,
  initialStrings = ["01", "101", "00", "110", "011"],
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-5xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcca8] shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot size="sm" expression="reading" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2d1e13] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                Side-by-Side Simulation & Equivalence Proof
              </h3>
              <p className="text-xs text-[#6e5540]">
                Watch strings traverse Original DFA and Minimized DFA simultaneously
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

        {/* Modal Body */}
        <div className="p-4 sm:p-6 overflow-y-auto">
          <SideBySideSimulator
            originalDFA={originalDFA}
            minimizedDFA={minimizedDFA}
            initialStrings={initialStrings}
          />
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#252d4a] hover:bg-[#1a2138] rounded-lg shadow transition"
          >
            Close Simulator
          </button>
        </div>
      </div>
    </div>
  );
};
