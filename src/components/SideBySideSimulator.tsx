import React, { useState, useEffect, useMemo } from 'react';
import { DFA, SimulationResult } from '../types/dfa';
import { simulateDFA } from '../utils/dfaUtils';
import { AutomatonGraph } from './AutomatonGraph';
import { Mascot } from './Mascot';
import {
  Play,
  Pause,
  ChevronRight,
  ChevronLeft,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  Info,
  Terminal
} from 'lucide-react';

interface SideBySideSimulatorProps {
  originalDFA: DFA;
  minimizedDFA: DFA;
  initialStrings?: string[];
  className?: string;
}

export const SideBySideSimulator: React.FC<SideBySideSimulatorProps> = ({
  originalDFA,
  minimizedDFA,
  initialStrings = ["01", "101", "00", "110", "011"],
  className = '',
}) => {
  const [inputString, setInputString] = useState<string>(initialStrings[0] || "01");
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [speed, setSpeed] = useState<'slow' | 'normal' | 'fast'>('normal');

  // Pre-calculate full traces for both DFAs on current string
  const origResult: SimulationResult = useMemo(
    () => simulateDFA(originalDFA, inputString),
    [originalDFA, inputString]
  );

  const minResult: SimulationResult = useMemo(
    () => simulateDFA(minimizedDFA, inputString),
    [minimizedDFA, inputString]
  );

  const symbols = useMemo(() => {
    const cleaned = inputString.trim();
    if (cleaned === '' || cleaned === 'ε' || cleaned === 'lambda') return [];
    return cleaned.split('');
  }, [inputString]);

  const totalSteps = symbols.length;
  const isFinished = currentStepIndex >= totalSteps;

  // Active state in original DFA at current step
  const origCurrentState = origResult.path[currentStepIndex] || originalDFA.startState;
  // Active state in minimized DFA at current step
  const minCurrentState = minResult.path[currentStepIndex] || minimizedDFA.startState;

  // Active transition edge if step just occurred
  const origActiveTransition = useMemo(() => {
    if (currentStepIndex === 0 || !origResult.trace[currentStepIndex - 1]) return null;
    const step = origResult.trace[currentStepIndex - 1];
    return { from: step.currentState, to: step.nextState };
  }, [origResult, currentStepIndex]);

  const minActiveTransition = useMemo(() => {
    if (currentStepIndex === 0 || !minResult.trace[currentStepIndex - 1]) return null;
    const step = minResult.trace[currentStepIndex - 1];
    return { from: step.currentState, to: step.nextState };
  }, [minResult, currentStepIndex]);

  // Speed delay in ms
  const speedDelay = {
    slow: 1800,
    normal: 1100,
    fast: 600,
  }[speed];

  // Auto-play timer
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isPlaying) {
      if (currentStepIndex >= totalSteps) {
        setIsPlaying(false);
      } else {
        timer = setTimeout(() => {
          setCurrentStepIndex((prev) => prev + 1);
        }, speedDelay);
      }
    }
    return () => clearTimeout(timer);
  }, [isPlaying, currentStepIndex, totalSteps, speedDelay]);

  // Reset steps when input string changes
  const handleStringChange = (newStr: string) => {
    setInputString(newStr);
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleStepForward = () => {
    if (currentStepIndex < totalSteps) {
      setCurrentStepIndex((prev) => prev + 1);
    }
  };

  const handleStepBack = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  const handleReset = () => {
    setCurrentStepIndex(0);
    setIsPlaying(false);
  };

  const handleGenerateRandom = () => {
    const alphabet = originalDFA.alphabet.length > 0 ? originalDFA.alphabet : ["0", "1"];
    const len = Math.floor(Math.random() * 4) + 1; // 1 to 4 chars
    let str = "";
    for (let i = 0; i < len; i++) {
      str += alphabet[Math.floor(Math.random() * alphabet.length)];
    }
    handleStringChange(str);
  };

  // Both match verdict
  const bothMatch = origResult.isAccepted === minResult.isAccepted;

  return (
    <div className={`w-full space-y-6 ${className}`}>
      {/* ============================================================== */}
      {/* 1. INPUT & CONTROL PANEL (Parchment Card)                       */}
      {/* ============================================================== */}
      <div className="parchment-card p-5 sm:p-6 space-y-4 shadow-xl border-2 border-[#dfcca8]">
        {/* Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#ebdcc4] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-amber-100/80 text-amber-900 border border-amber-300">
              <Terminal className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-[#2d1e13]">
                Side-by-Side String Simulator
              </h3>
              <p className="text-xs text-[#6e5540]">
                Watch the string traverse the Original DFA and Minimized DFA step-by-step
              </p>
            </div>
          </div>

          {/* Speed & Random Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={handleGenerateRandom}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-[#ebe0cb] hover:bg-[#dfd0b6] border border-[#d6c19f] text-[#3b2b1d] transition shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-700" />
              <span>Random String</span>
            </button>

            {/* Speed toggle */}
            <div className="flex items-center bg-[#f0e3cc] p-1 rounded-lg border border-[#d6c19f] text-xs">
              {(['slow', 'normal', 'fast'] as const).map((s) => (
                <button
                  key={s}
                  onClick={() => setSpeed(s)}
                  className={`px-2 py-0.5 rounded capitalize font-medium text-[11px] transition ${
                    speed === s
                      ? 'bg-[#252d4a] text-white shadow'
                      : 'text-stone-700 hover:text-stone-900'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* String Input and Quick Chips */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          <div className="md:col-span-5 space-y-1">
            <label className="block text-xs font-semibold text-[#543d2b]">
              Test String <span className="font-normal text-stone-500">(Type or pick below)</span>
            </label>
            <input
              type="text"
              value={inputString}
              onChange={(e) => handleStringChange(e.target.value)}
              placeholder="e.g. 01, 101, 00, ε"
              className="w-full px-3.5 py-2 font-mono text-sm font-semibold rounded-xl bg-white border border-[#d6c19f] text-stone-900 focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-inner"
            />
          </div>

          <div className="md:col-span-7 space-y-1">
            <span className="block text-xs font-semibold text-[#543d2b]">
              Quick Test Samples:
            </span>
            <div className="flex flex-wrap gap-1.5">
              {["01", "101", "00", "110", "011", ""].map((sample, idx) => (
                <button
                  key={idx}
                  onClick={() => handleStringChange(sample)}
                  className={`px-2.5 py-1 rounded-lg text-xs font-mono font-semibold transition border ${
                    inputString === sample
                      ? 'bg-[#252d4a] text-white border-[#1d233a] shadow-sm'
                      : 'bg-white hover:bg-amber-50 text-stone-800 border-[#d6c19f]'
                  }`}
                >
                  {sample === '' ? 'ε (empty)' : `"${sample}"`}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ============================================================== */}
        {/* CHARACTER-BY-CHARACTER RIBBON WITH CURRENT HIGHLIGHT          */}
        {/* ============================================================== */}
        <div className="p-3.5 rounded-xl bg-[#fffefb] border border-[#dfcca8] shadow-inner space-y-2.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-stone-700 flex items-center gap-1.5">
              <span>String Execution Sequence:</span>
              <span className="font-mono text-stone-500">
                (Step {currentStepIndex} of {totalSteps})
              </span>
            </span>
            <span className="text-stone-500 italic text-[11px]">
              {symbols.length === 0
                ? 'Testing empty string ε (evaluates immediately at start state)'
                : currentStepIndex === 0
                ? 'Ready at start state. Press Play or Step.'
                : isFinished
                ? 'Finished string processing!'
                : `Reading symbol '${symbols[currentStepIndex - 1]}' (Step ${currentStepIndex})`}
            </span>
          </div>

          {/* Symbol Blocks */}
          <div className="flex items-center gap-1.5 overflow-x-auto py-1">
            {/* Start marker */}
            <div className="px-2 py-1.5 rounded-lg bg-stone-100 text-stone-600 font-mono text-xs border border-stone-200 shrink-0 font-medium">
              Start
            </div>
            <span className="text-stone-400">→</span>

            {symbols.length === 0 ? (
              <div className="px-3 py-1.5 rounded-lg font-mono text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                ε (empty string)
              </div>
            ) : (
              symbols.map((sym, idx) => {
                const isCurrent = idx === currentStepIndex - 1;
                const isPassed = idx < currentStepIndex - 1;
                const isNext = idx === currentStepIndex;

                return (
                  <React.Fragment key={idx}>
                    <div
                      className={`min-w-9 h-9 rounded-lg flex items-center justify-center font-mono font-bold text-sm transition-all duration-200 border ${
                        isCurrent
                          ? 'bg-amber-400 text-stone-950 border-amber-500 shadow-md scale-110 ring-2 ring-amber-300'
                          : isPassed
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300 opacity-80'
                          : isNext
                          ? 'bg-blue-50 text-blue-800 border-blue-300'
                          : 'bg-white text-stone-500 border-stone-200'
                      }`}
                    >
                      {sym}
                    </div>
                    {idx < symbols.length - 1 && (
                      <span className="text-stone-300 text-xs">·</span>
                    )}
                  </React.Fragment>
                );
              })
            )}

            <span className="text-stone-400">→</span>
            {/* End marker */}
            <div
              className={`px-2.5 py-1.5 rounded-lg font-mono text-xs font-bold border shrink-0 transition ${
                isFinished
                  ? bothMatch
                    ? origResult.isAccepted
                      ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                      : 'bg-stone-200 text-stone-800 border-stone-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                  : 'bg-stone-100 text-stone-400 border-stone-200'
              }`}
            >
              End
            </div>
          </div>
        </div>

        {/* Stepper & Playback Controls Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          <div className="flex items-center space-x-2">
            {/* Reset */}
            <button
              onClick={handleReset}
              className="p-2 text-stone-700 bg-white hover:bg-stone-100 border border-[#d6c19f] rounded-lg transition shadow-sm"
              title="Reset to beginning"
            >
              <RotateCcw className="w-4 h-4" />
            </button>

            {/* Prev Symbol */}
            <button
              onClick={handleStepBack}
              disabled={currentStepIndex === 0}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-stone-100 border border-[#d6c19f] text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-1"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Prev</span>
            </button>

            {/* Play / Pause Toggle */}
            <button
              onClick={() => {
                if (isFinished) {
                  setCurrentStepIndex(0);
                  setIsPlaying(true);
                } else {
                  setIsPlaying(!isPlaying);
                }
              }}
              className="px-4 py-1.5 text-xs font-semibold rounded-lg text-white bg-[#252d4a] hover:bg-[#1a2138] transition shadow-md flex items-center gap-1.5 active:scale-95"
            >
              {isPlaying ? (
                <>
                  <Pause className="w-4 h-4 text-amber-300" />
                  <span>Pause</span>
                </>
              ) : isFinished ? (
                <>
                  <RotateCcw className="w-4 h-4 text-amber-300" />
                  <span>Replay</span>
                </>
              ) : (
                <>
                  <Play className="w-4 h-4 text-amber-300" />
                  <span>Play</span>
                </>
              )}
            </button>

            {/* Next Symbol */}
            <button
              onClick={handleStepForward}
              disabled={isFinished}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-white hover:bg-stone-100 border border-[#d6c19f] text-stone-800 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-sm flex items-center gap-1"
            >
              <span>Next</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Live Step Tracker Pill */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-600 font-medium">
              Progress:
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-mono font-bold bg-[#f3e7d3] text-stone-800 border border-[#dbcaa9]">
              {Math.min(currentStepIndex, totalSteps)} / {totalSteps} symbols read
            </span>
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 2. SIDE-BY-SIDE SIMULATION STAGE (Original vs Minimized)       */}
      {/* ============================================================== */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* ------------------------------------------------------------ */}
        {/* COLUMN 1: ORIGINAL DFA SIMULATOR                            */}
        {/* ------------------------------------------------------------ */}
        <div className="parchment-card p-5 space-y-3.5 border-2 border-[#dfcca8] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title & Live State Status */}
            <div className="flex items-center justify-between border-b border-[#e6d6bc] pb-2.5">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2d1e13] flex items-center gap-2">
                  <span>Original DFA</span>
                  <span className="text-[11px] font-sans font-medium text-stone-500">
                    ({originalDFA.states.length} states)
                  </span>
                </h4>
              </div>

              {/* Current Active State Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-stone-500 font-sans">Active:</span>
                <span className="px-2.5 py-1 rounded-lg font-bold bg-[#dce4f7] text-[#253359] border border-[#374872] shadow-sm">
                  {origCurrentState}
                </span>
              </div>
            </div>

            {/* Original Automaton Graph */}
            <div className="bg-[#fffefb] rounded-xl border border-[#dfcca8] p-3 shadow-inner flex flex-col items-center justify-center min-h-[250px]">
              <AutomatonGraph
                dfa={originalDFA}
                activeState={origCurrentState}
                activeTransition={origActiveTransition}
                isAcceptedEnd={isFinished && origResult.isAccepted}
                isRejectedEnd={isFinished && !origResult.isAccepted}
                width={350}
                height={220}
              />
            </div>

            {/* Path Traversal Ribbon */}
            <div className="p-2.5 rounded-xl bg-white border border-[#e2d2bb] text-xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-600 block">
                Path History ({origResult.path.slice(0, currentStepIndex + 1).length} visited):
              </span>
              <div className="font-mono flex flex-wrap items-center gap-1">
                {origResult.path.slice(0, currentStepIndex + 1).map((st, i) => (
                  <React.Fragment key={i}>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        i === currentStepIndex
                          ? 'bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                          : 'bg-stone-100 border-stone-200 text-stone-700'
                      }`}
                    >
                      {st}
                    </span>
                    {i < currentStepIndex && (
                      <span className="text-stone-300 text-[10px]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Verdict Banner for Original */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
              !isFinished
                ? 'bg-stone-50 border-stone-200 text-stone-600'
                : origResult.isAccepted
                ? 'bg-[#edf7ef] border-[#a1d9af] text-[#14532d]'
                : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
            }`}
          >
            <div className="flex items-center gap-2 font-sans">
              {!isFinished ? (
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500 animate-pulse" />
              ) : origResult.isAccepted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="font-semibold text-xs sm:text-sm">
                {!isFinished
                  ? `Simulating... (Reading symbol ${currentStepIndex})`
                  : origResult.isAccepted
                  ? `ACCEPTED (Ended in final state "${origCurrentState}")`
                  : `REJECTED (Ended in non-final state "${origCurrentState}")`}
              </span>
            </div>

            {isFinished && (
              <span
                className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] uppercase border ${
                  origResult.isAccepted
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}
              >
                {origResult.isAccepted ? 'ACCEPT' : 'REJECT'}
              </span>
            )}
          </div>
        </div>

        {/* ------------------------------------------------------------ */}
        {/* COLUMN 2: MINIMIZED DFA SIMULATOR                           */}
        {/* ------------------------------------------------------------ */}
        <div className="parchment-card p-5 space-y-3.5 border-2 border-[#dfcca8] flex flex-col justify-between">
          <div className="space-y-3">
            {/* Title & Live State Status */}
            <div className="flex items-center justify-between border-b border-[#e6d6bc] pb-2.5">
              <div>
                <h4 className="font-serif font-bold text-base text-[#2d1e13] flex items-center gap-2">
                  <span>Minimized DFA</span>
                  <span className="text-[11px] font-sans font-medium text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full border border-emerald-300 font-bold">
                    {minimizedDFA.states.length} states
                  </span>
                </h4>
              </div>

              {/* Current Active State Badge */}
              <div className="flex items-center gap-1.5 text-xs font-mono">
                <span className="text-stone-500 font-sans">Active:</span>
                <span className="px-2.5 py-1 rounded-lg font-bold bg-[#daf1e0] text-[#1c6b39] border border-[#228646] shadow-sm">
                  {minCurrentState}
                </span>
              </div>
            </div>

            {/* Minimized Automaton Graph */}
            <div className="bg-[#fffefb] rounded-xl border border-[#dfcca8] p-3 shadow-inner flex flex-col items-center justify-center min-h-[250px]">
              <AutomatonGraph
                dfa={minimizedDFA}
                activeState={minCurrentState}
                activeTransition={minActiveTransition}
                isAcceptedEnd={isFinished && minResult.isAccepted}
                isRejectedEnd={isFinished && !minResult.isAccepted}
                width={350}
                height={220}
              />
            </div>

            {/* Path Traversal Ribbon */}
            <div className="p-2.5 rounded-xl bg-white border border-[#e2d2bb] text-xs space-y-1">
              <span className="text-[11px] font-semibold text-stone-600 block">
                Path History ({minResult.path.slice(0, currentStepIndex + 1).length} visited):
              </span>
              <div className="font-mono flex flex-wrap items-center gap-1">
                {minResult.path.slice(0, currentStepIndex + 1).map((st, i) => (
                  <React.Fragment key={i}>
                    <span
                      className={`px-2 py-0.5 rounded text-[11px] font-bold border ${
                        i === currentStepIndex
                          ? 'bg-amber-100 border-amber-400 text-amber-900 ring-1 ring-amber-300'
                          : 'bg-emerald-50 border-emerald-200 text-emerald-800'
                      }`}
                    >
                      {st}
                    </span>
                    {i < currentStepIndex && (
                      <span className="text-stone-300 text-[10px]">→</span>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>

          {/* Verdict Banner for Minimized */}
          <div
            className={`p-3.5 rounded-xl border flex items-center justify-between text-xs transition-all ${
              !isFinished
                ? 'bg-stone-50 border-stone-200 text-stone-600'
                : minResult.isAccepted
                ? 'bg-[#edf7ef] border-[#a1d9af] text-[#14532d]'
                : 'bg-[#fef2f2] border-[#fecaca] text-[#991b1b]'
            }`}
          >
            <div className="flex items-center gap-2 font-sans">
              {!isFinished ? (
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              ) : minResult.isAccepted ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              ) : (
                <XCircle className="w-4 h-4 text-red-600 shrink-0" />
              )}
              <span className="font-semibold text-xs sm:text-sm">
                {!isFinished
                  ? `Simulating... (Reading symbol ${currentStepIndex})`
                  : minResult.isAccepted
                  ? `ACCEPTED (Ended in final state "${minCurrentState}")`
                  : `REJECTED (Ended in non-final state "${minCurrentState}")`}
              </span>
            </div>

            {isFinished && (
              <span
                className={`px-2 py-0.5 rounded-full font-mono font-bold text-[11px] uppercase border ${
                  minResult.isAccepted
                    ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                    : 'bg-red-100 text-red-900 border-red-300'
                }`}
              >
                {minResult.isAccepted ? 'ACCEPT' : 'REJECT'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ============================================================== */}
      {/* 3. EQUIVALENCE VERIFICATION CARD                               */}
      {/* ============================================================== */}
      <div className="parchment-card p-4 sm:p-5 border-2 border-[#dfcca8] shadow-lg flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Mascot size="md" expression={isFinished && bothMatch ? 'happy' : 'reading'} interactive={true} />
          <div>
            <h4 className="font-serif font-bold text-sm sm:text-base text-[#2d1e13] flex items-center gap-2">
              {isFinished ? (
                bothMatch ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                    <span>Equivalence Verified! Both DFAs Produce Identical Verdict</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Verdict Discrepancy Detected</span>
                  </>
                )
              ) : (
                <>
                  <Info className="w-5 h-5 text-blue-600" />
                  <span>Interactive State Traversal in Progress</span>
                </>
              )}
            </h4>
            <p className="text-xs text-[#5c4634] mt-0.5 leading-relaxed">
              {isFinished ? (
                bothMatch ? (
                  <>
                    For string <strong className="font-mono text-amber-900">"{inputString === '' ? 'ε' : inputString}"</strong>, both Original and Minimized DFAs reached <strong>{origResult.isAccepted ? 'ACCEPT' : 'REJECT'}</strong> status simultaneously.
                  </>
                ) : (
                  'The original and minimized automata disagree on this string. Check state definitions.'
                )
              ) : (
                'Use the Play or Next button above to advance through the string symbol by symbol.'
              )}
            </p>
          </div>
        </div>

        {isFinished && (
          <div className="px-3.5 py-1.5 rounded-xl bg-white border border-[#dfcca8] shadow-sm font-mono text-xs font-bold text-stone-800 whitespace-nowrap">
            Match: <span className="text-emerald-700">100% Identical ✓</span>
          </div>
        )}
      </div>
    </div>
  );
};
