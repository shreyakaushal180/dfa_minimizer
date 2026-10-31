import React, { useState, useEffect } from 'react';
import { MinimizationResult } from '../types/dfa';
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Play,
  Pause,
  CheckCircle,
  Split,
  Layers,
  ArrowRight,
  Info
} from 'lucide-react';

interface StepByStepViewProps {
  minimizationResult: MinimizationResult;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
}

export const StepByStepView: React.FC<StepByStepViewProps> = ({
  minimizationResult,
  currentStepIndex,
  onStepChange,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const steps = minimizationResult.steps;
  const currentStep = steps[currentStepIndex] || steps[0];

  // Auto-play timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStepIndex >= steps.length - 1) {
          setIsPlaying(false);
        } else {
          onStepChange(currentStepIndex + 1);
        }
      }, 1500);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, currentStepIndex, onStepChange]);

  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-semibold text-white">Step-by-Step Minimization</h2>
            <span className="px-2.5 py-0.5 text-xs font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 rounded-full">
              Hopcroft's Partition Algorithm
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Step {currentStepIndex + 1} of {steps.length}: <span className="text-slate-200 font-medium">{currentStep.title}</span>
          </p>
        </div>

        {/* Stepper Control Buttons */}
        <div className="flex items-center space-x-2">
          <button
            onClick={() => onStepChange(0)}
            disabled={currentStepIndex === 0}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-slate-700 transition"
            title="Reset to Step 1"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          <button
            onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
            disabled={currentStepIndex === 0}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-slate-700 flex items-center space-x-1 transition"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Prev</span>
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="px-3.5 py-1.5 text-xs font-medium text-white bg-indigo-600 hover:bg-indigo-500 rounded-lg flex items-center space-x-1.5 transition shadow-sm"
          >
            {isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                <span>Pause</span>
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                <span>Auto Play</span>
              </>
            )}
          </button>

          <button
            onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
            disabled={currentStepIndex === steps.length - 1}
            className="px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg border border-slate-700 flex items-center space-x-1 transition"
          >
            <span>Next</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Progress Slider */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={steps.length - 1}
          value={currentStepIndex}
          onChange={(e) => onStepChange(parseInt(e.target.value))}
          className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500"
        />
        <div className="flex justify-between text-[11px] text-slate-500 font-mono">
          <span>Start (Reachability)</span>
          <span>Final Stable Partition</span>
        </div>
      </div>

      {/* Step Description Card */}
      <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-indigo-300 flex items-center gap-2">
              <Info className="w-4 h-4 text-indigo-400" />
              {currentStep.title}
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">{currentStep.description}</p>
          </div>
          {currentStep.isStable && (
            <span className="px-2.5 py-1 text-xs font-semibold bg-emerald-950 text-emerald-300 border border-emerald-700 rounded-lg flex items-center gap-1.5">
              <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
              Stable Equilibrium
            </span>
          )}
        </div>
      </div>

      {/* STEP TYPE 0: Reachability Details */}
      {currentStep.type === 'reachability' && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
              <CheckCircle className="w-4 h-4" />
              Reachable States ({currentStep.reachableStates.length})
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStep.reachableStates.map(st => (
                <span key={st} className="px-2.5 py-1 bg-emerald-950/50 border border-emerald-800/60 text-emerald-300 font-mono text-xs rounded-md">
                  {st}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-slate-950/60 border border-slate-800 rounded-lg p-4 space-y-2">
            <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
              <Split className="w-4 h-4" />
              Unreachable States ({currentStep.unreachableStates.length})
            </span>
            <div className="flex flex-wrap gap-2 pt-1">
              {currentStep.unreachableStates.length === 0 ? (
                <span className="text-xs text-slate-500 italic">None (All states are reachable)</span>
              ) : (
                currentStep.unreachableStates.map(st => (
                  <span key={st} className="px-2.5 py-1 bg-rose-950/50 border border-rose-800/60 text-rose-300 font-mono text-xs rounded-md line-through">
                    {st}
                  </span>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* PARTITION DISPLAY (FOR ALL PARTITION STEPS) */}
      {currentStep.partitions.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
              <Layers className="w-4 h-4 text-indigo-400" />
              Current Equivalence Classes (Partitions)
            </h4>
            <span className="text-xs font-mono text-slate-400">
              {currentStep.partitions.length} block(s)
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
            {currentStep.partitions.map((group, idx) => (
              <div
                key={idx}
                className="bg-slate-950 border border-indigo-900/40 rounded-xl p-3 shadow-sm hover:border-indigo-500/50 transition space-y-2"
              >
                <div className="flex items-center justify-between border-b border-slate-800/80 pb-1.5">
                  <span className="text-xs font-semibold text-indigo-400 font-mono">Group P{idx}</span>
                  <span className="text-[10px] text-slate-500 font-mono">{group.length} state(s)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {group.map(st => (
                    <span
                      key={st}
                      className="px-2 py-0.5 text-xs font-mono font-medium bg-indigo-950/60 text-indigo-200 border border-indigo-800/40 rounded-md"
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SIGNATURE TABLES (FOR REFINEMENT STEPS) */}
      {currentStep.signatures && currentStep.signatures.length > 0 && (
        <div className="space-y-3 pt-2">
          <h4 className="text-xs font-semibold text-slate-300 uppercase tracking-wider">
            Transition Signature Table δ(state, symbol) → Target Group Index
          </h4>

          <div className="overflow-x-auto border border-slate-800 rounded-lg">
            <table className="w-full text-xs text-left text-slate-300 font-mono">
              <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
                <tr>
                  <th className="px-4 py-2 border-r border-slate-800">State</th>
                  {minimizationResult.originalDFA.alphabet.map(sym => (
                    <th key={sym} className="px-4 py-2 border-r border-slate-800 text-center">
                      Symbol '{sym}' (Target State → Group)
                    </th>
                  ))}
                  <th className="px-4 py-2">Signature Key</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
                {currentStep.signatures.map(sig => (
                  <tr key={sig.state} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2 font-semibold text-slate-200 border-r border-slate-800">
                      {sig.state}
                    </td>

                    {minimizationResult.originalDFA.alphabet.map(sym => (
                      <td key={sym} className="px-4 py-2 border-r border-slate-800 text-center">
                        <span className="text-slate-400">{sig.targetStates[sym]}</span>
                        <ArrowRight className="w-3 h-3 inline mx-1 text-slate-600" />
                        <span className="px-1.5 py-0.5 bg-indigo-950 text-indigo-300 border border-indigo-800/60 rounded text-[11px]">
                          P{sig.targetGroupIndices[sym]}
                        </span>
                      </td>
                    ))}

                    <td className="px-4 py-2 text-indigo-300 font-medium">
                      {sig.signatureKey}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* FINAL STABLE STATE SUMMARY */}
      {currentStep.isStable && (
        <div className="bg-emerald-950/30 border border-emerald-800/60 rounded-xl p-4 space-y-3">
          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Minimized DFA Construction Summary
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Original States</span>
              <span className="font-bold text-slate-200 text-sm font-mono">
                {minimizationResult.originalDFA.states.length} states
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Reachable States</span>
              <span className="font-bold text-slate-200 text-sm font-mono">
                {minimizationResult.reachableStates.length} states
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Minimized States</span>
              <span className="font-bold text-emerald-400 text-sm font-mono">
                {minimizationResult.minimizedDFA.states.length} states
              </span>
            </div>

            <div className="bg-slate-900 p-2.5 rounded-lg border border-slate-800">
              <span className="text-slate-400 block text-[11px]">Reduction Ratio</span>
              <span className="font-bold text-indigo-400 text-sm font-mono">
                {Math.round((1 - minimizationResult.minimizedDFA.states.length / minimizationResult.originalDFA.states.length) * 100)}% smaller
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
