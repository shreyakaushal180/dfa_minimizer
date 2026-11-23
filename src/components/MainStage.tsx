import React, { useState, useEffect } from 'react';
import { MinimizationResult } from '../types/dfa';
import { AutomatonGraph } from './AutomatonGraph';
import { Mascot } from './Mascot';
import {
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Sparkles,
  Info,
  ArrowRight,
  CheckCircle2,
  Table
} from 'lucide-react';

interface MainStageProps {
  minimizationResult: MinimizationResult | null;
  currentStepIndex: number;
  onStepChange: (index: number) => void;
  onOpenSimulator: () => void;
}

export const MainStage: React.FC<MainStageProps> = ({
  minimizationResult,
  currentStepIndex,
  onStepChange,
  onOpenSimulator,
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  // If no result yet, display empty state
  if (!minimizationResult) {
    return (
      <div className="w-full parchment-card p-12 text-center text-stone-600 space-y-4 animate-pop-in">
        <Mascot size="lg" expression="thinking" className="mx-auto" />
        <h3 className="font-serif text-lg font-bold text-stone-800">
          Awaiting Valid Automaton
        </h3>
        <p className="text-xs max-w-md mx-auto text-stone-500">
          Please provide a valid DFA with states, alphabet, start state, and transitions in the left panel to begin.
        </p>
      </div>
    );
  }

  const { originalDFA, minimizedDFA, steps } = minimizationResult;

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      timer = setInterval(() => {
        if (currentStepIndex >= steps.length - 1) {
          setIsPlaying(false);
        } else {
          onStepChange(currentStepIndex + 1);
        }
      }, 2200);
    }
    return () => clearInterval(timer);
  }, [isPlaying, steps.length, currentStepIndex, onStepChange]);

  const currentStep = steps[currentStepIndex] || steps[0];

  // Stepper labels matching the reference image
  const stepperLabels = [
    { num: 1, label: 'Initial DFA' },
    { num: 2, label: 'Partition 1' },
    { num: 3, label: 'Partition 2' },
    { num: 4, label: 'Stable Partition' },
    { num: 5, label: 'Minimized DFA' },
  ];

  // Map 0..steps.length-1 to 1..5 for the visual track
  const activeStepperIndex =
    currentStepIndex === 0
      ? 0
      : currentStepIndex === steps.length - 1
      ? 4
      : Math.min(3, Math.max(1, currentStepIndex));

  // Compute progress line percentage
  const progressPercent = (activeStepperIndex / (stepperLabels.length - 1)) * 100;

  // Partition groups for Step 1
  const nonFinalStates = originalDFA.states.filter(
    (s) => !originalDFA.finalStates.includes(s)
  );
  const finalStates = originalDFA.finalStates;

  return (
    <div className="w-full space-y-5">
      {/* ============================================================== */}
      {/* 1. TOP TIMELINE / PROGRESS STEPPER WITH ANIMATED FILL LINE     */}
      {/* ============================================================== */}
      <div className="relative w-full max-w-2xl mx-auto px-4 py-2">
        {/* Base Connecting Gray Line */}
        <div className="absolute top-6 left-12 right-12 h-0.5 bg-stone-700/60 z-0" />

        {/* Animated Golden Progress Fill Line */}
        <div
          className="absolute top-6 left-12 h-0.5 bg-gradient-to-r from-amber-500 to-amber-300 z-0 transition-all duration-500 ease-out shadow-sm shadow-amber-400"
          style={{ width: `calc(${progressPercent}% * 0.88)` }}
        />

        <div className="relative z-10 flex items-center justify-between">
          {stepperLabels.map((stepItem, idx) => {
            const isActive = activeStepperIndex === idx;
            const isCompleted = activeStepperIndex > idx;

            const targetAlgoIndex =
              idx === 0
                ? 0
                : idx === 4
                ? steps.length - 1
                : Math.min(steps.length - 1, idx);

            return (
              <div
                key={idx}
                onClick={() => onStepChange(targetAlgoIndex)}
                className="flex flex-col items-center cursor-pointer group"
              >
                {/* Step Circle */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs transition-all duration-200 ${
                    isActive
                      ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-400/50 scale-110 shadow-md'
                      : isCompleted
                      ? 'bg-amber-700 text-amber-100 border border-amber-600/70 hover:scale-105'
                      : 'bg-stone-800/90 text-stone-400 border border-stone-700/80 group-hover:border-stone-500 hover:scale-105'
                  }`}
                >
                  {stepItem.num}
                </div>

                {/* Step Label */}
                <span
                  className={`text-[11px] font-medium mt-1.5 transition-colors text-center whitespace-nowrap ${
                    isActive
                      ? 'text-amber-300 font-bold'
                      : isCompleted
                      ? 'text-amber-200/80'
                      : 'text-stone-400 group-hover:text-stone-300'
                  }`}
                >
                  {stepItem.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. MAIN PARCHMENT STAGE WINDOW                                */}
      {/* ============================================================== */}
      <div 
        key={currentStepIndex}
        className="relative w-full rounded-2xl bg-[#fdf8ed] border-2 border-[#dfcca8] shadow-2xl p-5 sm:p-6 text-[#3b2b1f] space-y-5 animate-pop-in"
      >
        {/* Step Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc4] pb-3.5">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#fae8b8] text-[#784408] border border-[#ecd295] shadow-sm animate-pulse">
                Step {currentStepIndex + 1}
              </span>
              <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2d1e13] flex items-center gap-2">
                {currentStepIndex === 0
                  ? 'Your DFA'
                  : currentStepIndex === steps.length - 1
                  ? 'Minimized DFA'
                  : currentStep.title}

                {/* Celebratory Star burst on completion */}
                {currentStepIndex === steps.length - 1 && (
                  <span className="text-amber-500 text-base animate-bounce">✨</span>
                )}
              </h2>
            </div>
            <p className="text-xs text-[#6e5540] mt-1 font-sans">
              {currentStepIndex === 0
                ? "Here's the automaton you entered:"
                : currentStep.description}
            </p>
          </div>

          {/* Quick Simulation Link with hover motion */}
          <button
            onClick={onOpenSimulator}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#252d4a] bg-[#ebe0cb] hover:bg-[#dfd0b6] border border-[#d6c19f] rounded-lg transition-all duration-200 shadow-sm hover:scale-105 active:scale-95 group"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-700 group-hover:rotate-45 transition-transform" />
            <span>Test Strings & Trace</span>
          </button>
        </div>

        {/* ============================================================ */}
        {/* Step Content: Dynamic 3-Column Card View                     */}
        {/* ============================================================ */}
        {currentStepIndex === 0 ? (
          /* STEP 1 VIEW: Matches Reference Image 3-Column Layout */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-stretch">
            {/* Column 1: Automaton SVG Graph */}
            <div className="md:col-span-5 bg-[#fffefb] rounded-xl border border-[#dfcca8] p-3 shadow-inner flex flex-col justify-center items-center min-h-[260px] transition-all hover:border-amber-400">
              <AutomatonGraph dfa={originalDFA} width={340} height={230} />
            </div>

            {/* Column 2: Step 2: Split by Acceptance */}
            <div className="md:col-span-4 bg-[#f8f3e7] rounded-xl border border-[#dfcca8] p-4 flex flex-col justify-between space-y-3 shadow-sm hover:shadow-md transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-200/80 text-stone-700">
                    Step 2
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#2e2015]">
                    Split by Acceptance
                  </h3>
                </div>
                <p className="text-xs text-[#5e4735] leading-relaxed">
                  First, separate accepting and non-accepting states.
                </p>

                {/* Partition Boxes */}
                <div className="pt-2 flex items-center justify-center gap-2.5">
                  {/* Non-Accepting Box */}
                  <div className="flex-1 bg-[#e8ecf8] border border-[#c5d2f0] rounded-xl p-3 text-center shadow-sm transition-transform hover:scale-105">
                    <span className="block text-[10px] font-bold text-[#2a3861] uppercase tracking-wider mb-1">
                      Non-Accepting
                    </span>
                    <span className="font-mono font-bold text-sm text-[#1e293b]">
                      {nonFinalStates.join(', ') || 'Ø'}
                    </span>
                  </div>

                  <ArrowRight className="w-4 h-4 text-stone-400 shrink-0 animate-pulse" />

                  {/* Accepting Box */}
                  <div className="flex-1 bg-[#daf1e0] border border-[#9ed9b0] rounded-xl p-3 text-center shadow-sm transition-transform hover:scale-105">
                    <span className="block text-[10px] font-bold text-[#14532d] uppercase tracking-wider mb-1">
                      Accepting
                    </span>
                    <span className="font-mono font-bold text-sm text-[#166534]">
                      {finalStates.join(', ') || 'Ø'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Footnote Info */}
              <div className="pt-2 border-t border-[#ebdcc4] flex items-center gap-2 text-[11px] text-[#6b523d]">
                <Info className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>Accepting states cannot be equivalent to non-accepting states.</span>
              </div>
            </div>

            {/* Column 3: Step 3: Refine Partitions */}
            <div className="md:col-span-3 bg-[#f8f3e7]/60 rounded-xl border border-dashed border-[#d1be9b] p-4 flex flex-col justify-between space-y-3 opacity-90 hover:opacity-100 transition-all">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-stone-200/80 text-stone-600">
                    Step 3
                  </span>
                  <h3 className="font-serif font-bold text-sm text-[#48372a]">
                    Refine Partitions
                  </h3>
                </div>
                <p className="text-xs text-[#6e5643] leading-relaxed">
                  Compare transition behavior of states.
                </p>

                {/* Ghost preview boxes */}
                <div className="pt-3 flex items-center justify-center gap-2">
                  <div className="flex-1 py-4 border-2 border-dashed border-stone-300 rounded-xl text-center text-xs font-mono text-stone-400 bg-white/40">
                    ...
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-stone-300 shrink-0" />
                  <div className="flex-1 py-4 border-2 border-dashed border-stone-300 rounded-xl text-center text-xs font-mono text-stone-400 bg-white/40">
                    ...
                  </div>
                </div>
              </div>

              <span className="text-[10px] text-stone-400 italic text-center block animate-pulse">
                Click "Next Step" to observe partition refinement
              </span>
            </div>
          </div>
        ) : currentStepIndex === steps.length - 1 ? (
          /* FINAL MINIMIZED STEP VIEW */
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
            {/* Minimized Automaton Graph */}
            <div className="md:col-span-7 bg-[#fffefb] rounded-xl border border-[#dfcca8] p-4 shadow-inner flex flex-col items-center justify-center min-h-[270px]">
              <div className="w-full flex items-center justify-between pb-2 mb-2 border-b border-stone-100 text-xs">
                <span className="font-serif font-bold text-[#2d1e13]">
                  Minimized DFA Automaton
                </span>
                <span className="font-mono text-[11px] text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold animate-pulse">
                  {minimizedDFA.states.length} States ({Math.round((1 - minimizedDFA.states.length / originalDFA.states.length) * 100)}% Reduction)
                </span>
              </div>
              <AutomatonGraph dfa={minimizedDFA} width={380} height={220} />
            </div>

            {/* State Equivalence Classes & Mapping */}
            <div className="md:col-span-5 bg-[#f8f3e7] rounded-xl border border-[#dfcca8] p-4 space-y-3 shadow-sm">
              <h3 className="font-serif font-bold text-sm text-[#2d1e13] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-700 animate-bounce" />
                Final Equivalence Classes
              </h3>

              <div className="space-y-2 text-xs">
                {currentStep.partitions.map((group, gIdx) => {
                  const isMerged = group.length > 1;
                  return (
                    <div
                      key={gIdx}
                      className={`p-2.5 rounded-lg border flex items-center justify-between font-mono transition-transform hover:scale-[1.02] ${
                        isMerged
                          ? 'bg-[#eef8f0] border-[#a0d8af] text-[#165a2d] shadow-sm'
                          : 'bg-white border-[#ebdcc4] text-stone-800'
                      }`}
                    >
                      <span className="font-semibold">
                        Group {gIdx + 1}: {'{' + group.join(', ') + '}'}
                      </span>
                      {isMerged && (
                        <span className="text-[10px] font-sans font-bold bg-emerald-200/80 px-2 py-0.5 rounded-full text-emerald-900 animate-pulse">
                          Merged ({group.length} states)
                        </span>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 border-t border-[#e6d6bc] text-[11px] text-[#634d39] space-y-1">
                <p>
                  <strong>Theorem:</strong> States within each partition have identical future language acceptance and can be merged without loss of language specificity.
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* INTERMEDIATE REFINEMENT STEP VIEW */
          <div className="space-y-4">
            {/* Partition Group Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {currentStep.partitions.map((group, idx) => (
                <div
                  key={idx}
                  className="bg-[#fffefb] p-3.5 rounded-xl border border-[#dfcca8] shadow-sm space-y-2 transition-transform hover:scale-105"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-serif font-bold text-amber-900">
                      Partition Block {idx + 1}
                    </span>
                    <span className="text-[11px] font-mono text-stone-500">
                      {group.length} state{group.length > 1 ? 's' : ''}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {group.map((st) => (
                      <span
                        key={st}
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-mono font-bold text-xs border transition-transform hover:scale-110 ${
                          originalDFA.finalStates.includes(st)
                            ? 'bg-[#daf1e0] text-[#1c6b39] border-[#228646]'
                            : 'bg-[#dce4f7] text-[#253359] border-[#374872]'
                        }`}
                      >
                        {st}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Split Details / State Signatures Table if present */}
            {currentStep.signatures && currentStep.signatures.length > 0 && (
              <div className="bg-[#fffefb] rounded-xl border border-[#dfcca8] p-3.5 overflow-x-auto shadow-sm">
                <div className="flex items-center gap-2 mb-2 text-xs font-serif font-bold text-[#352519]">
                  <Table className="w-3.5 h-3.5 text-amber-800" />
                  <span>Transition Signatures Under Evaluation</span>
                </div>
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-stone-200 text-stone-600 bg-stone-50">
                      <th className="py-2 px-3 font-semibold">State q</th>
                      {originalDFA.alphabet.map((sym) => (
                        <th key={sym} className="py-2 px-3 font-semibold font-mono">
                          Input '{sym}' → State [Group]
                        </th>
                      ))}
                      <th className="py-2 px-3 font-semibold">Signature Key</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-mono">
                    {currentStep.signatures.map((sig) => (
                      <tr key={sig.state} className="hover:bg-amber-50/50 transition-colors">
                        <td className="py-2 px-3 font-bold text-stone-900">
                          {sig.state}
                        </td>
                        {originalDFA.alphabet.map((sym) => {
                          const targetSt = sig.targetStates[sym];
                          const targetGrp = sig.targetGroupIndices[sym];
                          return (
                            <td key={sym} className="py-2 px-3 text-stone-700">
                              {targetSt} <span className="text-stone-400 font-sans text-[11px]">(Group {targetGrp + 1})</span>
                            </td>
                          );
                        })}
                        <td className="py-2 px-3 text-amber-900 font-semibold text-[11px]">
                          {sig.signatureKey}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ============================================================== */}
      {/* 3. BOTTOM EXPLANATORY BANNER ("What's happening?")             */}
      {/* ============================================================== */}
      <div className="relative w-full rounded-2xl bg-[#fdf8ed] border-2 border-[#dfcca8] shadow-2xl p-4 sm:p-5 text-[#3b2b1f] flex flex-col md:flex-row items-center justify-between gap-4 transition-all">
        {/* Left Side: Explanatory Content */}
        <div className="flex-1 space-y-1.5">
          <div className="flex items-center gap-2">
            <span className="text-base sm:text-lg animate-float">📖</span>
            <h3 className="font-serif text-sm sm:text-base font-bold text-[#2d1e13]">
              What's happening?
            </h3>
          </div>
          <p className="text-xs sm:text-sm text-[#5a4331] leading-relaxed max-w-2xl">
            {currentStepIndex === 0 ? (
              <>
                A DFA is an automaton that moves between states based on input symbols. Our goal is to find and merge equivalent states to get the smallest possible DFA.
              </>
            ) : currentStepIndex === steps.length - 1 ? (
              <>
                🎉 <strong>Minimization Complete!</strong> All remaining states in each group behave identically on every possible string. Merging them yields the minimal canonical DFA!
              </>
            ) : (
              currentStep.description
            )}
          </p>
        </div>

        {/* Center / Right: Mascot speech bubble & Navigation controls */}
        <div className="flex items-center gap-4 shrink-0">
          {/* Mascot with Dynamic Interactive Speech Bubble */}
          <div className="hidden sm:flex items-center gap-2.5">
            <div className="relative bg-white px-3 py-1.5 rounded-xl border border-[#d6c19f] text-[11px] font-semibold text-[#453221] shadow-sm animate-soft-float cursor-pointer hover:border-amber-500 transition-colors">
              {currentStepIndex === steps.length - 1
                ? 'All minimized! 🎉'
                : currentStepIndex === 0
                ? 'Ready for the next step?'
                : currentStep.type === 'refinement'
                ? 'Splitting distinguishable states! 🔍'
                : 'Partitions looking great! ✨'}
              {/* Little speech bubble tail */}
              <div className="absolute top-1/2 -right-1.5 -translate-y-1/2 w-3 h-3 bg-white border-r border-t border-[#d6c19f] rotate-45" />
            </div>
            <Mascot
              size="md"
              expression={
                currentStepIndex === steps.length - 1
                  ? 'celebrating'
                  : currentStepIndex === 0
                  ? 'reading'
                  : currentStep.type === 'refinement'
                  ? 'thinking'
                  : 'happy'
              }
              interactive={true}
            />
          </div>

          {/* Stepper Buttons */}
          <div className="flex items-center space-x-2">
            {/* Prev Button */}
            <button
              onClick={() => onStepChange(Math.max(0, currentStepIndex - 1))}
              disabled={currentStepIndex === 0}
              className="p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl bg-white hover:bg-stone-100 border border-[#d6c19f] text-[#3d2b1e] disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span className="hidden sm:inline">Prev</span>
            </button>

            {/* Auto Play / Pause Toggle with live indicator */}
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className={`p-2 sm:px-3 sm:py-2 text-xs font-semibold rounded-xl border transition-all shadow-sm hover:scale-105 active:scale-95 flex items-center gap-1 ${
                isPlaying
                  ? 'bg-amber-100 border-amber-400 text-amber-900 ring-2 ring-amber-300'
                  : 'bg-white hover:bg-stone-100 border-[#d6c19f] text-[#3d2b1e]'
              }`}
              title={isPlaying ? 'Pause Auto-Play' : 'Auto-Play Minimization'}
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-amber-700 animate-pulse" />
                  <span className="hidden sm:inline font-bold">Pause</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-amber-600" />
                  <span className="hidden sm:inline">Play</span>
                </>
              )}
            </button>

            {/* Next Step Button */}
            <button
              onClick={() => onStepChange(Math.min(steps.length - 1, currentStepIndex + 1))}
              disabled={currentStepIndex === steps.length - 1}
              className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl text-white bg-[#252d4a] hover:bg-[#1b223a] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md flex items-center gap-1.5 group"
              style={{
                boxShadow: '0 4px 14px rgba(37, 45, 74, 0.4)',
              }}
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
