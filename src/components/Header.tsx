import React from 'react';
import { Cpu, RotateCcw, Play } from 'lucide-react';

interface HeaderProps {
  onResetToExample: () => void;
  onAutoRunAll: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onResetToExample,
  onAutoRunAll,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40 shadow-xl backdrop-blur bg-opacity-90">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-wrap items-center justify-between gap-4">
        {/* Title and Badge */}
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-indigo-600/20 border border-indigo-500/30 rounded-xl text-indigo-400">
            <Cpu className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h1 className="text-xl font-bold text-white tracking-tight">DFA Minimization Simulator</h1>
              <span className="px-2 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
                Automata Theory
              </span>
            </div>
            <p className="text-xs text-slate-400">
              Interactive Partition Refinement & Equivalence Proof Tool
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onResetToExample}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition"
            title="Load standard project example"
          >
            <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
            <span>Load Example</span>
          </button>

          <button
            onClick={onAutoRunAll}
            className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg shadow-sm transition"
          >
            <Play className="w-3.5 h-3.5" />
            <span>Run Minimization</span>
          </button>
        </div>
      </div>
    </header>
  );
};
