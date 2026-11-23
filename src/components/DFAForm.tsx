import React, { useState, useEffect } from 'react';
import { DFA, ValidationResult } from '../types/dfa';
import { Pencil, Sparkles, Lightbulb, Table, ChevronDown, Check, AlertCircle } from 'lucide-react';

interface DFAFormProps {
  dfa: DFA;
  validation: ValidationResult;
  onChange: (updatedDFA: DFA) => void;
  onOpenTransitionEditor: () => void;
  onMinimizeClick: () => void;
}

export const DFAForm: React.FC<DFAFormProps> = ({
  dfa,
  validation,
  onChange,
  onOpenTransitionEditor,
  onMinimizeClick,
}) => {
  const [statesInput, setStatesInput] = useState(dfa.states.join(', '));
  const [isFinalsDropdownOpen, setIsFinalsDropdownOpen] = useState(false);

  // Sync internal text input when parent DFA changes
  useEffect(() => {
    setStatesInput(dfa.states.join(', '));
  }, [dfa.states]);

  // Handle States text input change
  const handleStatesChange = (val: string) => {
    setStatesInput(val);
    const parsedStates = val
      .split(/[, space\s]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const newStates = Array.from(new Set(parsedStates));

    let newStart = dfa.startState;
    if (newStates.length > 0 && !newStates.includes(newStart)) {
      newStart = newStates[0];
    }

    const newFinals = dfa.finalStates.filter((s) => newStates.includes(s));

    const newTransitions: Record<string, Record<string, string>> = {};
    newStates.forEach((st) => {
      newTransitions[st] = {};
      dfa.alphabet.forEach((sym) => {
        const existing = dfa.transitions[st]?.[sym];
        newTransitions[st][sym] = newStates.includes(existing) ? existing : (newStates[0] || '');
      });
    });

    onChange({
      ...dfa,
      states: newStates,
      startState: newStart,
      finalStates: newFinals,
      transitions: newTransitions,
    });
  };

  // Toggle final state in/out
  const toggleFinalState = (state: string) => {
    const isCurrentlyFinal = dfa.finalStates.includes(state);
    const updatedFinals = isCurrentlyFinal
      ? dfa.finalStates.filter((s) => s !== state)
      : [...dfa.finalStates, state];

    onChange({
      ...dfa,
      finalStates: updatedFinals,
    });
  };

  return (
    <div className="relative w-full rounded-2xl bg-[#fdf8ed] border-2 border-[#dfcca8] shadow-2xl p-5 sm:p-6 text-[#3b2b1f] flex flex-col justify-between">
      {/* Hand-drawn Antique Open Book Illustration in top right */}
      <div className="absolute top-3.5 right-4 pointer-events-none opacity-85 select-none">
        <svg className="w-16 h-12 drop-shadow-sm" viewBox="0 0 80 50" fill="none">
          {/* Book Leather Cover Backing */}
          <path d="M 6 36 Q 22 34 39 37 L 39 42 Q 22 39 6 41 Z" fill="#6d4c2b" stroke="#4a3118" strokeWidth="1" />
          <path d="M 74 36 Q 58 34 41 37 L 41 42 Q 58 39 74 41 Z" fill="#6d4c2b" stroke="#4a3118" strokeWidth="1" />
          
          {/* Thick Paper Edge Layers */}
          <path d="M 8 34 Q 23 32 39 35 L 39 39 Q 23 36 8 38 Z" fill="#ebd7b5" />
          <path d="M 72 34 Q 57 32 41 35 L 41 39 Q 57 36 72 38 Z" fill="#ebd7b5" />

          {/* Left Open Page with Curvature */}
          <path
            d="M 10 12 Q 24 16 39 18 L 39 35 Q 23 33 10 29 Z"
            fill="#fcf8ec"
            stroke="#c8ab80"
            strokeWidth="1.2"
          />
          {/* Right Open Page with Curvature */}
          <path
            d="M 70 12 Q 56 16 41 18 L 41 35 Q 57 33 70 29 Z"
            fill="#fdfbf1"
            stroke="#c8ab80"
            strokeWidth="1.2"
          />

          {/* Top Page Curl Leaves */}
          <path d="M 12 14 Q 25 17 39 19" stroke="#dfcca8" strokeWidth="0.8" fill="none" />
          <path d="M 68 14 Q 55 17 41 19" stroke="#dfcca8" strokeWidth="0.8" fill="none" />

          {/* Spine Center Groove */}
          <path d="M 39 18 Q 40 27 40 37" stroke="#8d6840" strokeWidth="1.5" />
          
          {/* Crimson Bookmark Ribbon dangling out */}
          <path d="M 40 26 Q 43 36 38 45 L 35 44 L 38 41 Z" fill="#b91c1c" opacity="0.9" />

          {/* Subtle Inked Text Lines */}
          <line x1="16" y1="18" x2="33" y2="21" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="16" y1="22" x2="31" y2="25" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="16" y1="26" x2="28" y2="28" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />

          <line x1="47" y1="21" x2="64" y2="18" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="49" y1="25" x2="64" y2="22" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="52" y1="28" x2="64" y2="26" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.5" />
        </svg>
      </div>

      <div className="space-y-4">
        {/* Card Header: Pencil icon + "Your DFA" */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6d5bd]">
          <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 shadow-sm transition-transform hover:scale-110">
            <Pencil className="w-4 h-4" />
          </div>
          <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2d1e13]">
            Your DFA
          </h2>
        </div>

        {/* Validation Error/Warning Banner if any */}
        {!validation.isValid && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-pop-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5 animate-bounce" />
            <div>
              <p className="font-semibold">Automaton Notice:</p>
              <ul className="list-disc list-inside mt-0.5 space-y-0.5 opacity-90">
                {validation.errors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {/* Field 1: Enter States */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#543d2b] tracking-wide">
            Enter States <span className="font-normal text-stone-500">(comma separated)</span>
          </label>
          <input
            type="text"
            value={statesInput}
            onChange={(e) => handleStatesChange(e.target.value)}
            placeholder="A, B, C, D, E"
            className="w-full px-3.5 py-2 text-sm font-mono font-medium rounded-xl bg-white border border-[#d6c19f] text-[#2b1f16] focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition-all duration-200 shadow-inner"
          />
        </div>

        {/* Field 2: Start State */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#543d2b] tracking-wide">
            Start State
          </label>
          <div className="relative">
            <select
              value={dfa.startState}
              onChange={(e) => onChange({ ...dfa, startState: e.target.value })}
              className="w-full appearance-none px-3.5 py-2 text-sm font-mono font-semibold rounded-xl bg-white border border-[#d6c19f] text-[#2b1f16] focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition cursor-pointer pr-9 shadow-inner"
            >
              {dfa.states.map((st) => (
                <option key={st} value={st}>
                  {st}
                </option>
              ))}
            </select>
            <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Field 3: End States (Accepting) */}
        <div className="space-y-1.5">
          <label className="block text-xs font-semibold text-[#543d2b] tracking-wide">
            End States <span className="font-normal text-stone-500">(Accepting)</span>
          </label>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFinalsDropdownOpen(!isFinalsDropdownOpen)}
              className="w-full text-left px-3.5 py-2 text-sm font-mono rounded-xl bg-white border border-[#d6c19f] text-[#2b1f16] flex items-center justify-between shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all"
            >
              <div className="flex flex-wrap gap-1 items-center">
                {dfa.finalStates.length === 0 ? (
                  <span className="text-stone-400 font-sans text-xs">Select accepting states...</span>
                ) : (
                  dfa.finalStates.map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 rounded-md text-xs font-bold font-mono bg-[#daf1e0] text-[#1c6b39] border border-[#228646]/40 flex items-center gap-1 transition-transform hover:scale-105"
                    >
                      {st}
                    </span>
                  ))
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${isFinalsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isFinalsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-white rounded-xl border border-[#d6c19f] shadow-2xl z-30 max-h-48 overflow-y-auto space-y-1 animate-pop-in">
                {dfa.states.map((st) => {
                  const isChecked = dfa.finalStates.includes(st);
                  return (
                    <div
                      key={st}
                      onClick={() => toggleFinalState(st)}
                      className={`flex items-center justify-between px-3 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition ${
                        isChecked ? 'bg-[#edf7ef] text-[#1a5b32]' : 'hover:bg-amber-50 text-stone-700'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                          isChecked ? 'bg-[#daf1e0] border-[#228646] text-[#1c6b39]' : 'bg-[#e9edf5] border-[#cbd5e1] text-stone-600'
                        }`}>
                          {st}
                        </span>
                        State {st}
                      </span>
                      {isChecked && <Check className="w-4 h-4 text-[#228646]" />}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        {/* Transition Table Quick Link */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenTransitionEditor}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#483321] hover:text-[#20140a] bg-[#f2e5d0] hover:bg-[#ebd9bf] border border-[#dbcaa9] rounded-xl transition-all duration-200 shadow-sm hover:scale-[1.02] active:scale-[0.98] group"
          >
            <Table className="w-3.5 h-3.5 text-amber-800 group-hover:rotate-6 transition-transform" />
            <span>Edit Transition Rules δ(q, a)</span>
          </button>
        </div>

        {/* Action Button: Minimize DFA (With Shimmer Light Beam Effect) */}
        <div className="pt-2">
          <button
            type="button"
            onClick={onMinimizeClick}
            disabled={!validation.isValid}
            className="w-full py-2.5 px-4 rounded-xl text-white font-semibold text-sm bg-[#252d4a] hover:bg-[#1b223a] active:scale-[0.98] transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed group"
            style={{
              boxShadow: '0 4px 14px rgba(37, 45, 74, 0.4)',
            }}
          >
            <Sparkles className="w-4 h-4 text-amber-300 group-hover:scale-110 transition-transform" />
            <span className="tracking-wide">Minimize DFA →</span>
          </button>
        </div>
      </div>

      {/* Tip Callout Banner at Bottom */}
      <div className="mt-5 p-3 rounded-xl bg-[#fff8e7] border border-[#f5dfa8] flex items-start gap-2.5 shadow-sm transition-transform hover:scale-[1.01]">
        <div className="p-1 rounded-md bg-amber-200/70 text-amber-900 shrink-0 animate-pulse">
          <Lightbulb className="w-4 h-4 text-amber-800" />
        </div>
        <p className="text-xs text-[#5c4323] leading-relaxed">
          <strong className="text-[#3b2713]">Tip:</strong> Enter the states and let the magic happen!
        </p>
      </div>
    </div>
  );
};
