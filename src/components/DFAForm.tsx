import React, { useState, useEffect } from 'react';
import { DFA, ValidationResult, PresetTestCase } from '../types/dfa';
import { PRESET_DFAS } from '../utils/dfaUtils';
import { AlertCircle, AlertTriangle, CheckCircle2, Layers, Plus } from 'lucide-react';

interface DFAFormProps {
  dfa: DFA;
  validation: ValidationResult;
  onChange: (updatedDFA: DFA) => void;
  onSelectPreset: (preset: PresetTestCase) => void;
}

export const DFAForm: React.FC<DFAFormProps> = ({
  dfa,
  validation,
  onChange,
  onSelectPreset,
}) => {
  const [statesInput, setStatesInput] = useState(dfa.states.join(', '));
  const [alphabetInput, setAlphabetInput] = useState(dfa.alphabet.join(', '));

  // Sync internal text inputs when parent dfa changes (e.g. on preset load)
  useEffect(() => {
    setStatesInput(dfa.states.join(', '));
    setAlphabetInput(dfa.alphabet.join(', '));
  }, [dfa]);

  // Handle States text input change
  const handleStatesChange = (val: string) => {
    setStatesInput(val);
    const parsedStates = val
      .split(/[, space\s]+/)
      .map(s => s.trim())
      .filter(Boolean);

    // Filter out duplicates preserving order
    const newStates = Array.from(new Set(parsedStates));

    let newStart = dfa.startState;
    if (newStates.length > 0 && !newStates.includes(newStart)) {
      newStart = newStates[0];
    }

    const newFinals = dfa.finalStates.filter(s => newStates.includes(s));

    // Rebuild transitions structure safely
    const newTransitions: Record<string, Record<string, string>> = {};
    newStates.forEach(st => {
      newTransitions[st] = {};
      dfa.alphabet.forEach(sym => {
        // Keep existing target if valid, else default to first state
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

  const addState = () => {
    let newState: string | undefined;

    if (dfa.states.every(state => /^[A-Z]$/.test(state))) {
      newState = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').find(state => !dfa.states.includes(state));
    } else {
      const numberedStates = dfa.states.map(state => state.match(/^(.*?)(\d+)$/));
      const prefix = numberedStates[0]?.[1];
      if (prefix !== undefined && numberedStates.every(match => match && match[1] === prefix)) {
        const nextNumber = Math.max(...numberedStates.map(match => Number(match?.[2] ?? -1))) + 1;
        newState = `${prefix}${nextNumber}`;
      }
    }

    if (!newState) {
      let suffix = 1;
      newState = `State${suffix}`;
      while (dfa.states.includes(newState)) {
        suffix += 1;
        newState = `State${suffix}`;
      }
    }

    handleStatesChange([...dfa.states, newState].join(', '));
  };

  // Handle Alphabet text input change
  const handleAlphabetChange = (val: string) => {
    setAlphabetInput(val);
    const parsedSyms = val
      .split(/[, space\s]+/)
      .map(s => s.trim())
      .filter(Boolean);

    const newAlphabet = Array.from(new Set(parsedSyms));

    const newTransitions: Record<string, Record<string, string>> = {};
    dfa.states.forEach(st => {
      newTransitions[st] = {};
      newAlphabet.forEach(sym => {
        const existing = dfa.transitions[st]?.[sym];
        newTransitions[st][sym] = dfa.states.includes(existing) ? existing : (dfa.states[0] || '');
      });
    });

    onChange({
      ...dfa,
      alphabet: newAlphabet,
      transitions: newTransitions,
    });
  };

  // Handle Transition change
  const handleTransitionChange = (fromState: string, symbol: string, toState: string) => {
    const updatedTransitions = {
      ...dfa.transitions,
      [fromState]: {
        ...(dfa.transitions[fromState] || {}),
        [symbol]: toState,
      },
    };

    onChange({
      ...dfa,
      transitions: updatedTransitions,
    });
  };

  // Handle Final State toggle
  const toggleFinalState = (state: string) => {
    const isFinal = dfa.finalStates.includes(state);
    const updatedFinals = isFinal
      ? dfa.finalStates.filter(s => s !== state)
      : [...dfa.finalStates, state];

    onChange({
      ...dfa,
      finalStates: updatedFinals,
    });
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Top Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Layers className="w-5 h-5 text-indigo-400" />
            DFA Definition & Input
          </h2>
          <p className="text-xs text-slate-400">Configure states, alphabet, start/final states, and transitions dynamically.</p>
        </div>

        {/* Preset Selector */}
        <div className="flex items-center space-x-2">
          <label className="text-xs text-slate-400 whitespace-nowrap">Load Preset:</label>
          <select
            onChange={(e) => {
              const preset = PRESET_DFAS.find(p => p.id === e.target.value);
              if (preset) onSelectPreset(preset);
            }}
            defaultValue="example-prompt"
            className="bg-slate-800 text-slate-200 text-xs rounded-lg border border-slate-700 px-3 py-1.5 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {PRESET_DFAS.map(p => (
              <option key={p.id} value={p.id}>
                {p.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Validation Status Indicator */}
      {validation.isValid ? (
        <div className="flex items-center space-x-2 bg-emerald-950/40 border border-emerald-800/60 text-emerald-400 text-xs px-3.5 py-2 rounded-lg">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>DFA is valid and ready for minimization analysis.</span>
        </div>
      ) : (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-3 rounded-lg space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-rose-400">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Invalid DFA Definition:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 text-slate-300 pl-1">
            {validation.errors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {validation.warnings.length > 0 && (
        <div className="bg-amber-950/40 border border-amber-800/60 text-amber-300 text-xs p-3 rounded-lg space-y-1">
          <div className="flex items-center space-x-2 font-semibold text-amber-400">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>Notice:</span>
          </div>
          <ul className="list-disc list-inside space-y-0.5 pl-1">
            {validation.warnings.map((warn, idx) => (
              <li key={idx}>{warn}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Basic Inputs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* States Input */}
        <div>
          <div className="flex items-center justify-between gap-2 mb-1.5">
            <label htmlFor="dfa-states" className="block text-xs font-semibold text-slate-300">
              States Set (Q) <span className="text-slate-500 font-normal">(Comma/Space separated)</span>
            </label>
            <button
              type="button"
              onClick={addState}
              className="inline-flex items-center gap-1 rounded-md border border-indigo-500/40 bg-indigo-500/10 px-2 py-1 text-xs font-medium text-indigo-300 hover:bg-indigo-500/20 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <Plus className="h-3.5 w-3.5" />
              Add state
            </button>
          </div>
          <input
            id="dfa-states"
            type="text"
            value={statesInput}
            onChange={(e) => handleStatesChange(e.target.value)}
            placeholder="A, B, C, D, E"
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            {dfa.states.length} state(s): [{dfa.states.join(', ')}]
          </span>
        </div>

        {/* Alphabet Input */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Input Alphabet (Σ) <span className="text-slate-500 font-normal">(Comma/Space separated)</span>
          </label>
          <input
            type="text"
            value={alphabetInput}
            onChange={(e) => handleAlphabetChange(e.target.value)}
            placeholder="0, 1"
            className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          />
          <span className="text-[11px] text-slate-500 mt-1 block">
            {dfa.alphabet.length} symbol(s): [{dfa.alphabet.join(', ')}]
          </span>
        </div>
      </div>

      {/* Start State & Final States Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
        {/* Start State Dropdown */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Start State (q₀)
          </label>
          <select
            value={dfa.startState}
            onChange={(e) => onChange({ ...dfa, startState: e.target.value })}
            className="w-full bg-slate-950 border border-slate-700 text-slate-200 text-sm font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
          >
            {dfa.states.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Final States Multi-Select Badges */}
        <div>
          <label className="block text-xs font-semibold text-slate-300 mb-1.5">
            Final / Accept States (F) <span className="text-slate-500 font-normal">(Click to toggle)</span>
          </label>
          <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-slate-950 border border-slate-700 rounded-lg items-center">
            {dfa.states.map(st => {
              const isFinal = dfa.finalStates.includes(st);
              return (
                <button
                  key={st}
                  type="button"
                  onClick={() => toggleFinalState(st)}
                  className={`px-2.5 py-1 rounded-md text-xs font-mono font-medium transition border ${
                    isFinal
                      ? 'bg-emerald-600/30 text-emerald-300 border-emerald-500/50 shadow-sm'
                      : 'bg-slate-800 text-slate-400 border-slate-700 hover:bg-slate-700'
                  }`}
                >
                  {isFinal ? `★ ${st}` : st}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Dynamic Transition Table */}
      <div className="pt-2">
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-slate-300">
            Transition Function Table δ(State, Symbol) → Target State
          </label>
          <span className="text-[11px] text-indigo-400 font-mono">
            {dfa.states.length} × {dfa.alphabet.length} matrix
          </span>
        </div>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5 w-32 border-r border-slate-800">State (q)</th>
                {dfa.alphabet.map(sym => (
                  <th key={sym} className="px-4 py-2.5 font-mono text-center border-r border-slate-800">
                    Symbol '{sym}'
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
              {dfa.states.map(state => {
                const isStart = state === dfa.startState;
                const isFinal = dfa.finalStates.includes(state);

                return (
                  <tr key={state} className="hover:bg-slate-800/40">
                    <td className="px-4 py-2 font-mono font-medium border-r border-slate-800 flex items-center space-x-1.5">
                      <span className="text-indigo-400">{isStart ? '➔ ' : ''}</span>
                      <span className={isFinal ? 'text-emerald-400 font-bold' : 'text-slate-200'}>
                        {state}
                      </span>
                      {isFinal && <span className="text-emerald-400 text-[10px]">★</span>}
                    </td>

                    {dfa.alphabet.map(symbol => {
                      const targetValue = dfa.transitions[state]?.[symbol] || '';
                      return (
                        <td key={symbol} className="px-3 py-1.5 border-r border-slate-800 text-center">
                          <select
                            value={targetValue}
                            onChange={(e) => handleTransitionChange(state, symbol, e.target.value)}
                            className="bg-slate-950 border border-slate-700 text-slate-200 text-xs font-mono rounded px-2 py-1 focus:ring-1 focus:ring-indigo-500 focus:outline-none w-full text-center"
                          >
                            {dfa.states.map(targetState => (
                              <option key={targetState} value={targetState}>
                                {targetState}
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
      </div>
    </div>
  );
};
