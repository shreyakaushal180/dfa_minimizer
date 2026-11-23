import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { Table, Check, X, AlertCircle } from 'lucide-react';

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

  // Keep synced if opened
  React.useEffect(() => {
    if (isOpen) {
      setLocalTransitions(JSON.parse(JSON.stringify(dfa.transitions)));
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

  const handleSave = () => {
    onSave({
      ...dfa,
      transitions: localTransitions,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcba8] shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-100/70 border border-amber-300 text-amber-900">
              <Table className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2d1e13]">
                Transition Table Editor δ(q, a)
              </h3>
              <p className="text-xs text-[#6e5540]">
                Configure where each state transitions for each alphabet symbol
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

        {/* Content */}
        <div className="p-6 overflow-y-auto space-y-4">
          <div className="overflow-x-auto rounded-xl border border-[#dfcca8] bg-[#fffefb]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-[#f7efe0] border-b border-[#dfcca8] text-xs font-serif text-[#4a3627]">
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
                {dfa.states.map((st) => {
                  const isStart = st === dfa.startState;
                  const isFinal = dfa.finalStates.includes(st);

                  return (
                    <tr key={st} className="hover:bg-[#fbf4e8] transition">
                      {/* State Name */}
                      <td className="py-3 px-4 font-mono font-semibold text-[#2b1f16] flex items-center gap-1.5">
                        <span className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs border ${
                          isFinal 
                            ? 'bg-[#daf1e0] text-[#1c6b39] border-[#228646]' 
                            : 'bg-[#dce4f7] text-[#253359] border-[#374872]'
                        }`}>
                          {st}
                        </span>
                      </td>

                      {/* State Type */}
                      <td className="py-3 px-4 text-center">
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
                          <td key={sym} className="py-2.5 px-3 text-center">
                            <select
                              value={currentTarget}
                              onChange={(e) => handleCellChange(st, sym, e.target.value)}
                              className="px-2.5 py-1.5 text-xs font-mono font-semibold bg-white border border-[#d6be9a] rounded-lg text-[#322317] focus:ring-2 focus:ring-amber-500/20 focus:border-amber-600 outline-none transition"
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
                })}
              </tbody>
            </table>
          </div>

          <p className="text-xs text-[#705641] italic flex items-center gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            Every cell must specify a deterministic next state for each alphabet symbol.
          </p>
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-end gap-2.5">
          <button
            onClick={onClose}
            className="px-3.5 py-1.5 text-xs font-medium text-stone-600 hover:text-stone-900 rounded-lg hover:bg-[#e7d8c0] transition"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-1.5 text-xs font-semibold text-white bg-[#263152] hover:bg-[#1a233d] rounded-lg shadow transition flex items-center gap-1.5"
          >
            <Check className="w-4 h-4" />
            <span>Save Transitions</span>
          </button>
        </div>
      </div>
    </div>
  );
};
