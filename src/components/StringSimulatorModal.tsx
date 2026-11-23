import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { compareDFAs } from '../utils/dfaUtils';
import { Sparkles, CheckCircle2, XCircle, X } from 'lucide-react';
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
  const [testStringsInput, setTestStringsInput] = useState(initialStrings.join(', '));
  const [activeTestString, setActiveTestString] = useState<string>(initialStrings[0] || "01");

  if (!isOpen) return null;

  const parsedStrings = testStringsInput
    .split(/[, space\s]+/)
    .map((s) => s.trim())
    .filter((s) => s !== '');

  const stringsToTest = parsedStrings.length > 0 ? parsedStrings : [""];
  const comparisonResults = compareDFAs(originalDFA, minimizedDFA, stringsToTest);
  const allMatch = comparisonResults.every((r) => r.match);

  const selectedResult =
    comparisonResults.find((r) => r.inputString === activeTestString) ||
    comparisonResults[0];

  const handleGenerateRandom = () => {
    const alphabet = originalDFA.alphabet.length > 0 ? originalDFA.alphabet : ["0", "1"];
    const randomList: string[] = [""];

    for (let i = 0; i < 5; i++) {
      const len = Math.floor(Math.random() * 4) + 1;
      let str = "";
      for (let j = 0; j < len; j++) {
        str += alphabet[Math.floor(Math.random() * alphabet.length)];
      }
      randomList.push(str);
    }

    const unique = Array.from(new Set(randomList));
    setTestStringsInput(unique.join(', '));
    setActiveTestString(unique[0] || "");
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-4xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcba8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot size="sm" expression="reading" />
            <div>
              <h3 className="font-serif text-lg sm:text-xl font-bold text-[#2d1e13] flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-700" />
                String Simulator & Equivalence Prover
              </h3>
              <p className="text-xs text-[#6e5540]">
                Verify that Original DFA and Minimized DFA produce 100% identical accept/reject results
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

        {/* Body */}
        <div className="p-6 overflow-y-auto space-y-5 text-xs sm:text-sm">
          {/* Test Strings Input and Random Generator */}
          <div className="p-4 rounded-xl bg-white border border-[#dfcca8] shadow-sm space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <label className="font-semibold text-xs text-[#4d3725]">
                Input Strings to Test <span className="font-normal text-stone-500">(comma-separated)</span>
              </label>
              <button
                type="button"
                onClick={handleGenerateRandom}
                className="px-3 py-1 rounded-lg text-xs font-semibold text-amber-900 bg-amber-100/80 hover:bg-amber-200/80 border border-amber-300 transition w-fit"
              >
                🎲 Generate Random Samples
              </button>
            </div>
            <input
              type="text"
              value={testStringsInput}
              onChange={(e) => setTestStringsInput(e.target.value)}
              placeholder="01, 101, 00, 110"
              className="w-full px-3.5 py-2 font-mono text-xs sm:text-sm rounded-xl bg-[#fffefb] border border-[#d6be9a] text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          {/* Equivalence Status Banner */}
          <div className={`p-4 rounded-xl border flex items-center justify-between gap-3 ${
            allMatch
              ? 'bg-[#edf7ef] border-[#a1d9af] text-[#14532d]'
              : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
          }`}>
            <div className="flex items-center gap-2.5">
              {allMatch ? (
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-red-600 shrink-0" />
              )}
              <div>
                <h4 className="font-semibold text-sm">
                  {allMatch
                    ? 'Equivalence Formally Proven on All Inputs!'
                    : 'Discrepancy Detected between Original and Minimized DFA'}
                </h4>
                <p className="text-xs opacity-90 mt-0.5">
                  {allMatch
                    ? 'Both automata accept and reject the exact same strings in 100% of tested cases.'
                    : 'Check your transition function or state configurations.'}
                </p>
              </div>
            </div>
            <span className="font-mono font-bold text-xs px-2.5 py-1 rounded-full bg-white/80 border border-current">
              {comparisonResults.filter((r) => r.match).length}/{comparisonResults.length} Matches
            </span>
          </div>

          {/* Results Comparison Table */}
          <div className="bg-white rounded-xl border border-[#dfcca8] overflow-hidden shadow-sm">
            <div className="px-4 py-2.5 bg-[#f7efe0] border-b border-[#dfcca8] font-serif font-bold text-xs text-[#3a281a]">
              Comparative Execution Results
            </div>
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 text-stone-600 bg-stone-50/50">
                  <th className="py-2 px-3.5 font-semibold">Test String w</th>
                  <th className="py-2 px-3.5 font-semibold">Original DFA (M)</th>
                  <th className="py-2 px-3.5 font-semibold">Minimized DFA (M')</th>
                  <th className="py-2 px-3.5 font-semibold text-center">Language Match</th>
                  <th className="py-2 px-3.5 font-semibold text-right">Trace</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100 font-mono">
                {comparisonResults.map((item, idx) => (
                  <tr
                    key={idx}
                    onClick={() => setActiveTestString(item.inputString)}
                    className={`cursor-pointer transition ${
                      activeTestString === item.inputString ? 'bg-amber-50' : 'hover:bg-stone-50'
                    }`}
                  >
                    <td className="py-2.5 px-3.5 font-bold text-stone-900">
                      "{item.inputString === '' ? 'ε' : item.inputString}"
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.originalResult.isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {item.originalResult.isAccepted ? 'ACCEPT' : 'REJECT'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        item.minimizedResult.isAccepted
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-stone-100 text-stone-600'
                      }`}>
                        {item.minimizedResult.isAccepted ? 'ACCEPT' : 'REJECT'}
                      </span>
                    </td>
                    <td className="py-2.5 px-3.5 text-center">
                      {item.match ? (
                        <span className="text-emerald-600 font-bold">✓ Equivalent</span>
                      ) : (
                        <span className="text-red-600 font-bold">✗ Mismatch</span>
                      )}
                    </td>
                    <td className="py-2.5 px-3.5 text-right font-sans text-xs text-amber-900 font-semibold">
                      Inspect Trace →
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Detailed Step-by-Step Path Trace for Selected String */}
          {selectedResult && (
            <div className="p-4 rounded-xl bg-white border border-[#dfcca8] shadow-sm space-y-3">
              <h4 className="font-serif font-bold text-xs sm:text-sm text-[#3b2b1e] flex items-center justify-between">
                <span>
                  Trace for Input: <strong className="font-mono text-amber-900">"{selectedResult.inputString === '' ? 'ε' : selectedResult.inputString}"</strong>
                </span>
                <span className="text-stone-500 font-sans text-xs">
                  Original: {selectedResult.originalResult.isAccepted ? 'Accepted' : 'Rejected'} | Minimized: {selectedResult.minimizedResult.isAccepted ? 'Accepted' : 'Rejected'}
                </span>
              </h4>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {/* Original Path */}
                <div className="p-3 rounded-lg bg-[#f9fbfd] border border-blue-200">
                  <span className="font-semibold text-blue-900 block mb-1">
                    Original DFA Path ({selectedResult.originalResult.path.length} states traversed)
                  </span>
                  <div className="font-mono flex flex-wrap items-center gap-1.5 text-stone-700">
                    {selectedResult.originalResult.path.map((st, i) => (
                      <React.Fragment key={i}>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          i === selectedResult.originalResult.path.length - 1
                            ? selectedResult.originalResult.isAccepted
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                              : 'bg-stone-200 border-stone-300 text-stone-800'
                            : 'bg-blue-50 border-blue-200 text-blue-900'
                        }`}>
                          {st}
                        </span>
                        {i < selectedResult.originalResult.path.length - 1 && (
                          <span className="text-stone-400 text-xs">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>

                {/* Minimized Path */}
                <div className="p-3 rounded-lg bg-[#f9fcf9] border border-emerald-200">
                  <span className="font-semibold text-emerald-900 block mb-1">
                    Minimized DFA Path ({selectedResult.minimizedResult.path.length} states traversed)
                  </span>
                  <div className="font-mono flex flex-wrap items-center gap-1.5 text-stone-700">
                    {selectedResult.minimizedResult.path.map((st, i) => (
                      <React.Fragment key={i}>
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                          i === selectedResult.minimizedResult.path.length - 1
                            ? selectedResult.minimizedResult.isAccepted
                              ? 'bg-emerald-100 border-emerald-400 text-emerald-900'
                              : 'bg-stone-200 border-stone-300 text-stone-800'
                            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                        }`}>
                          {st}
                        </span>
                        {i < selectedResult.minimizedResult.path.length - 1 && (
                          <span className="text-stone-400 text-xs">→</span>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3.5 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-end">
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
