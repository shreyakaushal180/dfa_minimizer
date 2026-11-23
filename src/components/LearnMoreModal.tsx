import React from 'react';
import { BookOpen, X, Sparkles, CheckCircle2, Split, ArrowRight, Lightbulb } from 'lucide-react';
import { Mascot } from './Mascot';

interface LearnMoreModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const LearnMoreModal: React.FC<LearnMoreModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
      <div 
        className="relative w-full max-w-2xl bg-[#fdf8ee] text-[#36271c] rounded-2xl border-2 border-[#dfcba8] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        style={{
          boxShadow: '0 25px 50px -12px rgba(18, 13, 28, 0.6), 0 0 0 1px rgba(255, 255, 255, 0.4) inset',
        }}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-[#f4ebd9] border-b border-[#e2d0b2] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Mascot size="sm" expression="reading" />
            <div>
              <h3 className="font-serif text-xl font-bold text-[#2d1e13] flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-amber-700" />
                The Guide to DFA Minimization
              </h3>
              <p className="text-xs text-[#6e5540]">Automata Theory made simple, intuitive & visual</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-stone-500 hover:text-stone-800 hover:bg-[#e8dac1] transition"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-sm leading-relaxed text-[#433124]">
          {/* Section 1: What is a DFA? */}
          <div className="bg-[#fffefb] p-4 rounded-xl border border-[#ebdcc4] shadow-sm space-y-2">
            <h4 className="font-semibold text-base text-[#291b10] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">1</span>
              What is a Deterministic Finite Automaton (DFA)?
            </h4>
            <p className="text-xs sm:text-sm text-[#543f30]">
              A DFA is a mathematical model of computation consisting of a set of <strong>states</strong>, an <strong>alphabet of input symbols</strong>, a <strong>start state</strong>, a set of <strong>accepting (final) states</strong>, and deterministic <strong>transition rules</strong>. For every state and input symbol, there is exactly one next state.
            </p>
          </div>

          {/* Section 2: Why Minimize? */}
          <div className="bg-[#fffefb] p-4 rounded-xl border border-[#ebdcc4] shadow-sm space-y-2">
            <h4 className="font-semibold text-base text-[#291b10] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">2</span>
              Why do we minimize a DFA?
            </h4>
            <p className="text-xs sm:text-sm text-[#543f30]">
              Often, different states perform identical future jobs. Minimization merges <strong>equivalent states</strong> to produce the DFA with the absolute minimum number of states that recognizes the same language.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1.5">
              <div className="p-2.5 rounded-lg bg-[#f6f2e9] border border-[#e3d5be] text-xs">
                <span className="font-semibold text-[#2f2015] block mb-0.5">🚀 Speed & Memory</span>
                Smaller state transition tables reduce memory in hardware and embedded chips.
              </div>
              <div className="p-2.5 rounded-lg bg-[#f6f2e9] border border-[#e3d5be] text-xs">
                <span className="font-semibold text-[#2f2015] block mb-0.5">⚙️ Compilers</span>
                Lexical analyzers (like Lex/Flex) minimize regular expression DFAs for instant tokenization.
              </div>
              <div className="p-2.5 rounded-lg bg-[#f6f2e9] border border-[#e3d5be] text-xs">
                <span className="font-semibold text-[#2f2015] block mb-0.5">🎯 Canonical Form</span>
                By the Myhill–Nerode theorem, every regular language has a unique minimal DFA up to renaming!
              </div>
            </div>
          </div>

          {/* Section 3: The 3 Simple Steps of Hopcroft's Algorithm */}
          <div className="bg-[#fffefb] p-4 rounded-xl border border-[#ebdcc4] shadow-sm space-y-3">
            <h4 className="font-semibold text-base text-[#291b10] flex items-center gap-2">
              <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">3</span>
              How Hopcroft's Algorithm Works
            </h4>

            <div className="space-y-3 text-xs sm:text-sm">
              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#f2f7ec] border border-[#cfe6c3]">
                <Split className="w-5 h-5 text-emerald-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1c4d1c] block">Step A: Initial Partition (Accepting vs Non-Accepting)</strong>
                  Since an accepting state can never be equivalent to a non-accepting state, we divide all states into two initial sets: P₀ = &#123; F, Q \ F &#125; (Accepting vs Non-Accepting).
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#eef3fb] border border-[#cbd9f5]">
                <Sparkles className="w-5 h-5 text-indigo-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#1e3466] block">Step B: Refine by Transitions</strong>
                  For each group and for each input symbol (e.g. 0 and 1), check where the states go. If state p and state q transition into different partition groups, they are distinguishable and must be split!
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 rounded-lg bg-[#fff9ea] border border-[#f7e0a8]">
                <CheckCircle2 className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#684107] block">Step C: Repeat until Stable</strong>
                  Repeat refining until an entire pass makes no new splits. Each resulting group becomes one consolidated state in your minimized DFA!
                </div>
              </div>
            </div>
          </div>

          {/* Mascot Scholar Tip */}
          <div className="flex items-center gap-3 p-3.5 rounded-xl bg-amber-50 border border-amber-200">
            <Lightbulb className="w-5 h-5 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-900">
              <strong>Tip:</strong> Try our built-in presets (like <em>Ends with 01</em> or <em>Divisible by 3</em>) and use the <strong>Next Step</strong> button to see each partition split in live action!
            </p>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-3.5 bg-[#f4ebd9] border-t border-[#e2d0b2] flex items-center justify-between">
          <span className="text-xs text-[#7d634e]">Happy learning! ✨</span>
          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-semibold text-white bg-[#263152] hover:bg-[#1a233d] rounded-lg shadow transition flex items-center gap-1.5"
          >
            <span>Got it, let's explore!</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
