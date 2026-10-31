import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { compareDFAs } from '../utils/dfaUtils';
import { Sparkles, CheckCircle2, XCircle, ArrowRight, Table, Terminal } from 'lucide-react';

interface StringSimulatorProps {
  originalDFA: DFA;
  minimizedDFA: DFA;
  initialStrings?: string[];
  onActiveStateChange?: (origState?: string, minState?: string) => void;
}

export const StringSimulator: React.FC<StringSimulatorProps> = ({
  originalDFA,
  minimizedDFA,
  initialStrings = ["01", "101", "00", "110", "011"],
  onActiveStateChange,
}) => {
  const [testStringsInput, setTestStringsInput] = useState(initialStrings.join(', '));
  const [activeTestString, setActiveTestString] = useState<string>(initialStrings[0] || "01");

  const parsedStrings = testStringsInput
    .split(/[, space\s]+/)
    .map(s => s.trim())
    .filter(s => s !== '');

  // Default to testing empty string ε if input is empty
  const stringsToTest = parsedStrings.length > 0 ? parsedStrings : [""];

  const comparisonResults = compareDFAs(originalDFA, minimizedDFA, stringsToTest);
  const allMatch = comparisonResults.every(r => r.match);

  // Active string detailed trace simulation
  const selectedResult = comparisonResults.find(r => r.inputString === activeTestString) || comparisonResults[0];

  // Helper to generate random test strings from alphabet
  const handleGenerateRandomStrings = () => {
    const alphabet = originalDFA.alphabet.length > 0 ? originalDFA.alphabet : ["0", "1"];
    const randomList: string[] = [""]; // include empty string

    for (let i = 0; i < 6; i++) {
      const len = Math.floor(Math.random() * 5) + 1; // len 1 to 5
      let str = "";
      for (let j = 0; j < len; j++) {
        const char = alphabet[Math.floor(Math.random() * alphabet.length)];
        str += char;
      }
      randomList.push(str);
    }

    const uniqueRandom = Array.from(new Set(randomList));
    setTestStringsInput(uniqueRandom.join(', '));
    setActiveTestString(uniqueRandom[0] || "");
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Terminal className="w-5 h-5 text-indigo-400" />
            String Simulation & Language Equivalence Proof
          </h2>
          <p className="text-xs text-slate-400">
            Simulate strings simultaneously on both original and minimized DFAs to confirm identity.
          </p>
        </div>

        <button
          onClick={handleGenerateRandomStrings}
          className="flex items-center space-x-1.5 px-3 py-1.5 text-xs font-medium text-indigo-300 bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-700/60 rounded-lg transition"
        >
          <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
          <span>Generate Random Tests</span>
        </button>
      </div>

      {/* String Input Box */}
      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Test Strings <span className="text-slate-500 font-normal">(Comma / Space separated)</span>
        </label>
        <input
          type="text"
          value={testStringsInput}
          onChange={(e) => setTestStringsInput(e.target.value)}
          placeholder="01, 101, 00, 110, 011"
          className="w-full bg-slate-950 border border-slate-700 text-slate-100 text-sm font-mono rounded-lg px-3 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
        />
      </div>

      {/* Equivalence Status Banner */}
      {allMatch ? (
        <div className="bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-xs p-3.5 rounded-lg flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
            <div>
              <span className="font-bold text-emerald-400 block text-sm">Language Equivalence Confirmed!</span>
              <span className="text-slate-300">
                All {comparisonResults.length} test string(s) yielded 100% identical accept/reject responses across both DFAs.
              </span>
            </div>
          </div>
          <span className="px-2.5 py-1 bg-emerald-900/60 text-emerald-200 border border-emerald-700 rounded text-xs font-mono font-bold">
            L(M₁) = L(M₂)
          </span>
        </div>
      ) : (
        <div className="bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs p-3.5 rounded-lg flex items-center space-x-2">
          <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <div>
            <span className="font-bold text-rose-400 block text-sm">Discrepancy Detected</span>
            <span>One or more strings produced conflicting results. Check invalid transitions or non-deterministic state inputs.</span>
          </div>
        </div>
      )}

      {/* Required Comparison Matrix Table */}
      <div className="space-y-2">
        <h3 className="text-xs font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
          <Table className="w-4 h-4 text-indigo-400" />
          Equivalence Comparison Matrix
        </h3>

        <div className="overflow-x-auto border border-slate-800 rounded-lg">
          <table className="w-full text-xs text-left text-slate-300">
            <thead className="bg-slate-950 text-slate-400 font-semibold border-b border-slate-800">
              <tr>
                <th className="px-4 py-2.5">Input String</th>
                <th className="px-4 py-2.5">Original DFA Result</th>
                <th className="px-4 py-2.5">Minimized DFA Result</th>
                <th className="px-4 py-2.5 text-center">Match (Equivalence)</th>
                <th className="px-4 py-2.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/80 bg-slate-900/60">
              {comparisonResults.map((item, idx) => {
                const isSelected = selectedResult && selectedResult.inputString === item.inputString;
                return (
                  <tr
                    key={idx}
                    className={`hover:bg-slate-800/40 transition ${isSelected ? 'bg-indigo-950/30' : ''}`}
                  >
                    <td className="px-4 py-2.5 font-mono font-bold text-white">
                      {item.inputString === '' ? 'ε (empty)' : item.inputString}
                    </td>

                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                          item.originalResult.isAccepted
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                        }`}
                      >
                        {item.originalResult.isAccepted ? 'ACCEPTED' : 'REJECTED'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        [{item.originalResult.path.join(' → ')}]
                      </span>
                    </td>

                    <td className="px-4 py-2.5">
                      <span
                        className={`px-2 py-0.5 rounded text-[11px] font-mono font-semibold ${
                          item.minimizedResult.isAccepted
                            ? 'bg-emerald-950/80 text-emerald-300 border border-emerald-700/60'
                            : 'bg-rose-950/80 text-rose-300 border border-rose-700/60'
                        }`}
                      >
                        {item.minimizedResult.isAccepted ? 'ACCEPTED' : 'REJECTED'}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono ml-2">
                        [{item.minimizedResult.path.join(' → ')}]
                      </span>
                    </td>

                    <td className="px-4 py-2.5 text-center">
                      {item.match ? (
                        <span className="inline-flex items-center text-emerald-400 font-semibold gap-1 text-xs">
                          <CheckCircle2 className="w-4 h-4" />
                          MATCH
                        </span>
                      ) : (
                        <span className="inline-flex items-center text-rose-400 font-semibold gap-1 text-xs">
                          <XCircle className="w-4 h-4" />
                          MISMATCH
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => {
                          setActiveTestString(item.inputString);
                          if (onActiveStateChange) {
                            onActiveStateChange(
                              item.originalResult.path[0],
                              item.minimizedResult.path[0]
                            );
                          }
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-indigo-300 rounded border border-slate-700 transition"
                      >
                        Inspect Trace
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detailed Trace Visualizer for selected string */}
      {selectedResult && (
        <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
            <h4 className="text-xs font-semibold text-indigo-300">
              Detailed Execution Trace for String: <span className="font-mono text-white text-sm">"{selectedResult.inputString === '' ? 'ε' : selectedResult.inputString}"</span>
            </h4>
            <span className="text-[11px] text-slate-400">
              Original: <strong className="text-slate-200">{selectedResult.originalResult.path[selectedResult.originalResult.path.length - 1]}</strong> | Minimized: <strong className="text-emerald-300">{selectedResult.minimizedResult.path[selectedResult.minimizedResult.path.length - 1]}</strong>
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Original DFA Path */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-slate-300">Original DFA Traversal:</span>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs flex flex-wrap items-center gap-1.5">
                {selectedResult.originalResult.path.map((st, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 bg-indigo-950 text-indigo-200 border border-indigo-800 rounded">
                      {st}
                    </span>
                    {idx < selectedResult.originalResult.trace.length && (
                      <span className="text-slate-500 text-[11px]">
                        {' '}
                        <ArrowRight className="w-3 h-3 inline text-amber-400" /> ({selectedResult.originalResult.trace[idx].symbol}){' '}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>

            {/* Minimized DFA Path */}
            <div className="space-y-1.5">
              <span className="text-xs font-semibold text-emerald-400">Minimized DFA Traversal:</span>
              <div className="bg-slate-900 p-3 rounded-lg border border-slate-800 font-mono text-xs flex flex-wrap items-center gap-1.5">
                {selectedResult.minimizedResult.path.map((st, idx) => (
                  <React.Fragment key={idx}>
                    <span className="px-2 py-0.5 bg-emerald-950 text-emerald-200 border border-emerald-800 rounded">
                      {st}
                    </span>
                    {idx < selectedResult.minimizedResult.trace.length && (
                      <span className="text-slate-500 text-[11px]">
                        {' '}
                        <ArrowRight className="w-3 h-3 inline text-amber-400" /> ({selectedResult.minimizedResult.trace[idx].symbol}){' '}
                      </span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
