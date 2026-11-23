import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { Table, Check, X, AlertCircle, Search, Shuffle, RotateCcw, ArrowRight } from 'lucide-react';

interface TransitionEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  dfa: DFA;
  onSave: (updatedDFA: DFA) => void;
}

export const TransitionEditorModal: React.FC<TransitionEditorModalProps> = ({
  isOpen,
  onClose,
  dfa,
  onSave,
}) => {
  const [localTransitions, setLocalTransitions] = useState<Record<string, Record<string, string>>>(
    JSON.parse(JSON.stringify(dfa.transitions))
  );
  const [searchQuery, setSearchQuery] = useState('');

  // Keep synced if opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalTransitions(JSON.parse(JSON.stringify(dfa.transitions)));
      setSearchQuery('');
    }
  }, [isOpen, dfa]);

  if (!isOpen) return null;

  const handleCellChange = (state: string, symbol: string, targetState: string) => {
    setLocalTransitions((prev) => ({
      ...prev,
      [state]: {
        ...(prev[state] || {}),
        [symbol]: targetState,
      },
    }));
  };

  // Quick Action 1: Cycle Shift (q_i on sym0 -> q_{(i+1)%N}, on sym1 -> q_{(i+2)%N})
  const handleApplyCycle = () => {
    const states = dfa.states;
    const n = states.length;
    const newTrans: Record<string, Record<string, string>> = {};

    states.forEach((st, idx) => {
      newTrans[st] = {};
      dfa.alphabet.forEach((sym, sIdx) => {
        newTrans[st][sym] = states[(idx + sIdx + 1) % n];
      });
    });
    setLocalTransitions(newTrans);
  };

  // Quick Action 2: Self Loops (q_i -> q_i)
  const handleApplySelfLoops = () => {
    const newTrans: Record<string, Record<string, string>> = {};
    dfa.states.forEach((st) => {
      newTrans[st] = {};
      dfa.alphabet.forEach((sym) => {
        newTrans[st][sym] = st;
      });
    });
    setLocalTransitions(newTrans);
  };

  // Quick Action 3: Set all to Start State
  const handleApplyToStart = () => {
    const newTrans: Record<string, Record<string, string>> = {};
    dfa.states.forEach((st) => {
      newTrans[st] = {};
      dfa.alphabet.forEach((sym) => {
        newTrans[st][sym] = dfa.startState;
      });
    });
    setLocalTransitions(newTrans);
  };

  // Quick Action 4: Randomize
  const handleRandomize = () => {
    const states = dfa.states;
    const newTrans: Record<string, Record<string, string>> = {};
    states.forEach((st) => {
      newTrans[st] = {};
      dfa.alphabet.forEach((sym) => {
        newTrans[st][sym] = states[Math.floor(Math.random() * states.length)];
      });
    });
    setLocalTransitions(newTrans);
  };

  const handleSave = () => {
    onSave({
      ...dfa,
      transitions: localTransitions,
    });
    onClose();
  };

  // Filtered rows for large state sets (up to 30)
  const displayedStates = dfa.states.filter((st) =>
    st.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-sm animate-pop-in">
      <div className="relative w-full max-w-3xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcca8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2d1e13] flex items-center gap-2">
                <span>Transition Table Editor δ(q, a)</span>
                <span className="text-xs font-mono text-amber-900 bg-amber-200/80 px-2 py-0.5 rounded-full border border-amber-300">
                  {dfa.states.length} States
                </span>
              </h3>
              <p className="text-xs text-[#6e5540]">
                Configure where each state transitions for each alphabet symbol (up to 30 states)
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

        {/* Quick Bulk Actions & Search Toolbar */}
        <div className="px-6 py-3 bg-[#f8f1e2] border-b border-[#dfcca8] flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* Search bar */}
          <div className="relative w-full sm:w-56">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search state (e.g. q12)..."
              className="w-full pl-8 pr-3 py-1.5 rounded-lg bg-white border border-[#d6be9a] font-mono text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
            <Search className="w-4 h-4 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Bulk Tools */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[11px] text-stone-500 font-semibold mr-1">Quick Tools:</span>
            <button
              type="button"
              onClick={handleApplyCycle}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-[#d6be9a] font-medium text-stone-800 flex items-center gap-1 transition"
              title="State i -> State (i+1)"
            >
              <ArrowRight className="w-3 h-3 text-blue-600" />
              <span>Shift Cycle</span>
            </button>
            <button
              type="button"
              onClick={handleApplySelfLoops}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-[#d6be9a] font-medium text-stone-800 flex items-center gap-1 transition"
            >
              <RotateCcw className="w-3 h-3 text-amber-700" />
              <span>Self Loops</span>
            </button>
            <button
              type="button"
              onClick={handleApplyToStart}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-[#d6be9a] font-medium text-stone-800 transition"
            >
              To Start State
            </button>
            <button
              type="button"
              onClick={handleRandomize}
              className="px-2.5 py-1 rounded-lg bg-white hover:bg-amber-100 border border-[#d6be9a] font-medium text-stone-800 flex items-center gap-1 transition"
            >
              <Shuffle className="w-3 h-3 text-purple-600" />
              <span>Randomize</span>
            </button>
          </div>
        </div>

        {/* Content Table (Scrollable with sticky header for 30 states) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-3">
          <div className="overflow-x-auto rounded-xl border border-[#dfcca8] bg-[#fffefb] max-h-[50vh] overflow-y-auto shadow-inner">
            <table className="w-full text-left border-collapse">
              <thead className="sticky top-0 z-10">
                <tr className="bg-[#f7efe0] border-b border-[#dfcca8] text-xs font-serif text-[#4a3627] shadow-sm">
                  <th className="py-2.5 px-4 font-semibold">State q</th>
                  <th className="py-2.5 px-4 font-semibold text-center">Type</th>
                  {dfa.alphabet.map((sym) => (
                    <th key={sym} className="py-2.5 px-4 font-semibold text-center bg-[#f0e4d0]">
                      Input <span className="font-mono font-bold text-amber-900">'{sym}'</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-[#ebdcc4] text-xs sm:text-sm">
                {displayedStates.length === 0 ? (
                  <tr>
                    <td colSpan={2 + dfa.alphabet.length} className="py-8 text-center text-stone-500 italic">
                      No states match "{searchQuery}"
                    </td>
                  </tr>
                ) : (
                  displayedStates.map((st) => {
                    const isStart = st === dfa.startState;
                    const isFinal = dfa.finalStates.includes(st);

                    return (
                      <tr key={st} className="hover:bg-[#fbf4e8] transition">
                        {/* State Name */}
                        <td className="py-2.5 px-4 font-mono font-semibold text-[#2b1f16] flex items-center gap-2">
                          <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] border ${
                            isFinal 
                              ? 'bg-[#daf1e0] text-[#1c6b39] border-[#228646]' 
                              : 'bg-[#dce4f7] text-[#253359] border-[#374872]'
                          }`}>
                            {st.length > 3 ? st.slice(0, 3) : st}
                          </span>
                          <span>{st}</span>
                        </td>

                        {/* State Type */}
                        <td className="py-2 px-3 text-center">
                          <div className="flex items-center justify-center gap-1">
                            {isStart && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-100 text-amber-800 border border-amber-300">
                                Start
                              </span>
                            )}
                            {isFinal && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
                                Final
                              </span>
                            )}
                            {!isStart && !isFinal && (
                              <span className="text-[11px] text-stone-400">—</span>
                            )}
                          </div>
                        </td>

                        {/* Transitions per Symbol */}
                        {dfa.alphabet.map((sym) => {
                          const currentTarget = localTransitions[st]?.[sym] || dfa.states[0] || '';

                          return (
                            <td key={sym} className="py-2 px-3 text-center">
                              <select
                                value={currentTarget}
                                onChange={(e) => handleCellChange(st, sym, e.target.value)}
                                className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-[#d6be9a] rounded-lg text-[#322317] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition w-28"
                              >
                                {dfa.states.map((opt) => (
                                  <option key={opt} value={opt}>
                                    → {opt}
                                  </option>
                                ))}
                              </select>
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between text-xs text-[#705641]">
            <span className="flex items-center gap-1.5 italic">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
              Showing {displayedStates.length} of {dfa.states.length} states. Every state requires a deterministic target.
            </span>
            <span className="font-mono text-stone-500 font-semibold">
              Total transitions: {dfa.states.length * dfa.alphabet.length}
            </span>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-[#e7d8c0] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#252d4a] hover:bg-[#1a233d] rounded-lg shadow transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save All Transitions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
