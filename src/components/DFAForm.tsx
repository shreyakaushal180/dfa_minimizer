import React, { useState, useEffect } from 'react';
import { DFA, ValidationResult } from '../types/dfa';
import { Pencil, Sparkles, Lightbulb, Table, ChevronDown, Check, AlertCircle, Search } from 'lucide-react';

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
  const [finalsSearch, setFinalsSearch] = useState('');

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

    // Limit to 30 states
    const uniqueStates = Array.from(new Set(parsedStates)).slice(0, 30);

    let newStart = dfa.startState;
    if (uniqueStates.length > 0 && !uniqueStates.includes(newStart)) {
      newStart = uniqueStates[0];
    }

    const newFinals = dfa.finalStates.filter((s) => uniqueStates.includes(s));

    const newTransitions: Record<string, Record<string, string>> = {};
    uniqueStates.forEach((st) => {
      newTransitions[st] = {};
      dfa.alphabet.forEach((sym) => {
        const existing = dfa.transitions[st]?.[sym];
        newTransitions[st][sym] = uniqueStates.includes(existing) ? existing : (uniqueStates[0] || '');
      });
    });

    onChange({
      ...dfa,
      states: uniqueStates,
      startState: newStart,
      finalStates: newFinals,
      transitions: newTransitions,
    });
  };

  // Quick State Size Generator (e.g. 5, 10, 15, 20, 30 states)
  const handleGenerateNStates = (count: number) => {
    const clamped = Math.min(30, Math.max(1, count));
    const newStates = Array.from({ length: clamped }, (_, i) => `q${i}`);
    
    // Construct robust modular transitions
    const newTransitions: Record<string, Record<string, string>> = {};
    newStates.forEach((st, i) => {
      newTransitions[st] = {};
      dfa.alphabet.forEach((sym, sIdx) => {
        const targetIdx = (i + sIdx + 1) % clamped;
        newTransitions[st][sym] = newStates[targetIdx];
      });
    });

    // Pick accepting states (approx every 3rd state)
    const newFinals = newStates.filter((_, i) => i % 3 === 0);

    onChange({
      ...dfa,
      states: newStates,
      startState: newStates[0],
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

  const handleSelectAllFinals = () => {
    onChange({
      ...dfa,
      finalStates: [...dfa.states],
    });
  };

  const handleClearAllFinals = () => {
    onChange({
      ...dfa,
      finalStates: [],
    });
  };

  // Filtered states for finals dropdown
  const filteredFinalsStates = dfa.states.filter((st) =>
    st.toLowerCase().includes(finalsSearch.toLowerCase())
  );

  return (
    <div className="relative w-full rounded-2xl bg-[#fdf8ed] border-2 border-[#dfcca8] shadow-2xl p-5 sm:p-6 text-[#3b2b1f] flex flex-col justify-between">
      {/* Hand-drawn Antique Open Book Illustration in top right */}
      <div className="absolute top-3.5 right-4 pointer-events-none opacity-85 select-none">
        <svg className="w-16 h-12 drop-shadow-sm" viewBox="0 0 80 50" fill="none">
          <path d="M 6 36 Q 22 34 39 37 L 39 42 Q 22 39 6 41 Z" fill="#6d4c2b" stroke="#4a3118" strokeWidth="1" />
          <path d="M 74 36 Q 58 34 41 37 L 41 42 Q 58 39 74 41 Z" fill="#6d4c2b" stroke="#4a3118" strokeWidth="1" />
          <path d="M 8 34 Q 23 32 39 35 L 39 39 Q 23 36 8 38 Z" fill="#ebd7b5" />
          <path d="M 72 34 Q 57 32 41 35 L 41 39 Q 57 36 72 38 Z" fill="#ebd7b5" />
          <path d="M 10 12 Q 24 16 39 18 L 39 35 Q 23 33 10 29 Z" fill="#fcf8ec" stroke="#c8ab80" strokeWidth="1.2" />
          <path d="M 70 12 Q 56 16 41 18 L 41 35 Q 57 33 70 29 Z" fill="#fdfbf1" stroke="#c8ab80" strokeWidth="1.2" />
          <path d="M 39 18 Q 40 27 40 37" stroke="#8d6840" strokeWidth="1.5" />
          <path d="M 40 26 Q 43 36 38 45 L 35 44 L 38 41 Z" fill="#b91c1c" opacity="0.9" />
          <line x1="16" y1="18" x2="33" y2="21" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="16" y1="22" x2="31" y2="25" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="47" y1="21" x2="64" y2="18" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
          <line x1="49" y1="25" x2="64" y2="22" stroke="#a4845e" strokeWidth="1" strokeLinecap="round" opacity="0.6" />
        </svg>
      </div>

      <div className="space-y-4">
        {/* Card Header: Pencil icon + "Your DFA" */}
        <div className="flex items-center gap-2.5 pb-2 border-b border-[#e6d5bd]">
          <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 shadow-sm transition-transform hover:scale-110">
            <Pencil className="w-4 h-4" />
          </div>
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold tracking-tight text-[#2d1e13]">
              Your DFA
            </h2>
          </div>
        </div>

        {/* Validation Error/Warning Banner if any */}
        {!validation.isValid && (
          <div className="p-2.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-800 flex items-start gap-2 animate-pop-in">
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
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
          <div className="flex items-center justify-between text-xs font-semibold text-[#543d2b]">
            <span>Enter States</span>
            <span className="font-mono text-[11px] font-bold text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-full border border-amber-300">
              {dfa.states.length} / 30 states
            </span>
          </div>
          <input
            type="text"
            value={statesInput}
            onChange={(e) => handleStatesChange(e.target.value)}
            placeholder="q0, q1, q2... (up to 30 states)"
            className="w-full px-3.5 py-2 text-sm font-mono font-medium rounded-xl bg-white border border-[#d6c19f] text-[#2b1f16] focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-700 transition shadow-inner"
          />

          {/* Quick State Count Chips (up to 30 states) */}
          <div className="pt-1 flex items-center gap-1.5 flex-wrap">
            <span className="text-[11px] text-stone-500">Quick set:</span>
            {[5, 10, 15, 20, 30].map((count) => (
              <button
                key={count}
                type="button"
                onClick={() => handleGenerateNStates(count)}
                className={`px-2 py-0.5 rounded text-[10.5px] font-mono font-semibold transition border ${
                  dfa.states.length === count
                    ? 'bg-amber-300 text-stone-900 border-amber-500 font-bold shadow-sm'
                    : 'bg-white hover:bg-amber-50 text-stone-700 border-[#d6c19f]'
                }`}
              >
                {count} states
              </button>
            ))}
          </div>
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

        {/* Field 3: End States (Accepting) - Optimized for up to 30 states */}
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-xs font-semibold text-[#543d2b]">
            <span>End States (Accepting)</span>
            <span className="text-[11px] font-mono text-stone-500">
              {dfa.finalStates.length} of {dfa.states.length} final
            </span>
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setIsFinalsDropdownOpen(!isFinalsDropdownOpen)}
              className="w-full text-left px-3.5 py-2 text-sm font-mono rounded-xl bg-white border border-[#d6c19f] text-[#2b1f16] flex items-center justify-between shadow-inner focus:outline-none focus:ring-2 focus:ring-amber-500/20 transition-all max-h-24 overflow-hidden"
            >
              <div className="flex flex-wrap gap-1 items-center max-h-16 overflow-y-auto pr-1">
                {dfa.finalStates.length === 0 ? (
                  <span className="text-stone-400 font-sans text-xs">Select accepting states...</span>
                ) : (
                  dfa.finalStates.map((st) => (
                    <span
                      key={st}
                      className="px-2 py-0.5 rounded-md text-[11px] font-bold font-mono bg-[#daf1e0] text-[#1c6b39] border border-[#228646]/40"
                    >
                      {st}
                    </span>
                  ))
                )}
              </div>
              <ChevronDown className={`w-4 h-4 text-stone-500 transition-transform duration-200 shrink-0 ml-1 ${isFinalsDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu with Search and Bulk Actions */}
            {isFinalsDropdownOpen && (
              <div className="absolute top-full left-0 right-0 mt-1.5 p-2 bg-white rounded-xl border border-[#d6c19f] shadow-2xl z-30 space-y-2 animate-pop-in">
                {/* Search & Bulk Toolbar */}
                <div className="space-y-1.5 pb-1 border-b border-stone-200">
                  <div className="relative">
                    <input
                      type="text"
                      value={finalsSearch}
                      onChange={(e) => setFinalsSearch(e.target.value)}
                      placeholder="Search state (e.g. q15)..."
                      className="w-full pl-7 pr-3 py-1 text-xs rounded-lg border border-stone-300 font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
                    />
                    <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-stone-600 px-1">
                    <button
                      type="button"
                      onClick={handleSelectAllFinals}
                      className="text-amber-800 font-semibold hover:underline"
                    >
                      Select All
                    </button>
                    <button
                      type="button"
                      onClick={handleClearAllFinals}
                      className="text-stone-500 hover:text-stone-800 hover:underline"
                    >
                      Clear All
                    </button>
                  </div>
                </div>

                {/* State List (Scrollable for 30 states) */}
                <div className="max-h-48 overflow-y-auto space-y-1 pr-1">
                  {filteredFinalsStates.map((st) => {
                    const isChecked = dfa.finalStates.includes(st);
                    return (
                      <div
                        key={st}
                        onClick={() => toggleFinalState(st)}
                        className={`flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs font-mono font-medium cursor-pointer transition ${
                          isChecked ? 'bg-[#edf7ef] text-[#1a5b32]' : 'hover:bg-amber-50 text-stone-700'
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold border ${
                            isChecked ? 'bg-[#daf1e0] border-[#228646] text-[#1c6b39]' : 'bg-[#e9edf5] border-[#cbd5e1] text-stone-600'
                          }`}>
                            {st.length > 3 ? st.slice(0, 3) : st}
                          </span>
                          State {st}
                        </span>
                        {isChecked && <Check className="w-3.5 h-3.5 text-[#228646]" />}
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transition Table Quick Link */}
        <div className="pt-1">
          <button
            type="button"
            onClick={onOpenTransitionEditor}
            className="w-full flex items-center justify-center gap-2 py-2 px-3 text-xs font-semibold text-[#483321] hover:text-[#20140a] bg-[#f2e5d0] hover:bg-[#ebd9bf] border border-[#dbcaa9] rounded-xl transition shadow-sm hover:scale-[1.01] active:scale-[0.98] group"
          >
            <Table className="w-3.5 h-3.5 text-amber-800 group-hover:scale-110 transition-transform" />
            <span>Edit Transition Rules δ(q, a)</span>
          </button>
        </div>

        {/* Action Button: Minimize DFA */}
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
      <div className="mt-5 p-3 rounded-xl bg-[#fff8e7] border border-[#f5dfa8] flex items-start gap-2.5 shadow-sm">
        <div className="p-1 rounded-md bg-amber-200/70 text-amber-900 shrink-0">
          <Lightbulb className="w-4 h-4 text-amber-800" />
        </div>
        <p className="text-xs text-[#5c4323] leading-relaxed">
          <strong className="text-[#3b2713]">Tip:</strong> Supports up to 30 states! Use the quick set chips (e.g. 10, 20, 30) for instant large benchmarking.
        </p>
      </div>
    </div>
  );
};
