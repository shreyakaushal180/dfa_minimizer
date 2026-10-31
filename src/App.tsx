import React, { useState, useMemo } from 'react';
import { DFA, PresetTestCase } from './types/dfa';
import { validateDFA, minimizeDFA, PRESET_DFAS } from './utils/dfaUtils';
import { Header } from './components/Header';
import { DFAForm } from './components/DFAForm';
import { StepByStepView } from './components/StepByStepView';
import { DFAVisualizer } from './components/DFAVisualizer';
import { StringSimulator } from './components/StringSimulator';
import { TestPresets } from './components/TestPresets';
import { Layers, Network, Terminal, Sparkles } from 'lucide-react';

export const App: React.FC = () => {
  // Default to project example DFA
  const defaultPreset = PRESET_DFAS[0];
  const [dfa, setDfa] = useState<DFA>(defaultPreset.dfa);
  const [currentPresetId, setCurrentPresetId] = useState<string>(defaultPreset.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [sampleStrings, setSampleStrings] = useState<string[]>(defaultPreset.sampleStrings);

  const [activeTab, setActiveTab] = useState<'all' | 'input' | 'visualizer' | 'stepper' | 'simulator'>('all');

  // Compute live validation
  const validation = useMemo(() => validateDFA(dfa), [dfa]);

  // Compute live minimization result dynamically
  const minimizationResult = useMemo(() => {
    if (!validation.isValid) return null;
    return minimizeDFA(dfa);
  }, [dfa, validation.isValid]);

  // Handler for loading presets
  const handleSelectPreset = (preset: PresetTestCase) => {
    setDfa(preset.dfa);
    setCurrentPresetId(preset.id);
    setCurrentStepIndex(0);
    setSampleStrings(preset.sampleStrings);
  };

  // Handler for reset to standard example
  const handleResetToExample = () => {
    handleSelectPreset(PRESET_DFAS[0]);
  };

  // Handler to jump to end of minimization steps
  const handleAutoRunAll = () => {
    if (minimizationResult) {
      setCurrentStepIndex(minimizationResult.steps.length - 1);
      setActiveTab('all');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Navbar Header */}
      <Header
        onResetToExample={handleResetToExample}
        onAutoRunAll={handleAutoRunAll}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
        {/* Navigation Tabs Bar for easy switching */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-3">
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs font-medium">
            <button
              onClick={() => setActiveTab('all')}
              className={`px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'all'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Full Workspace
            </button>
            <button
              onClick={() => setActiveTab('input')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'input'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              1. Input DFA
            </button>
            <button
              onClick={() => setActiveTab('stepper')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'stepper'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              2. Step-by-Step
            </button>
            <button
              onClick={() => setActiveTab('visualizer')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'visualizer'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Network className="w-3.5 h-3.5" />
              3. Graph Visualizer
            </button>
            <button
              onClick={() => setActiveTab('simulator')}
              className={`px-3.5 py-1.5 rounded-lg transition flex items-center gap-1.5 ${
                activeTab === 'simulator'
                  ? 'bg-indigo-600 text-white shadow'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              4. String Simulator
            </button>
          </div>

          <div className="text-xs text-slate-400 font-mono">
            Current Preset: <span className="text-indigo-400 font-semibold">{PRESET_DFAS.find(p => p.id === currentPresetId)?.name || 'Custom'}</span>
          </div>
        </div>

        {/* SECTION 1: DFA Form & Preset Suite */}
        {(activeTab === 'all' || activeTab === 'input') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <div className="lg:col-span-2">
              <DFAForm
                dfa={dfa}
                validation={validation}
                onChange={(updated) => {
                  setDfa(updated);
                  setCurrentPresetId('custom');
                  setCurrentStepIndex(0);
                }}
                onSelectPreset={handleSelectPreset}
              />
            </div>

            <div className="lg:col-span-1">
              <TestPresets
                currentPresetId={currentPresetId}
                onSelectPreset={handleSelectPreset}
              />
            </div>
          </div>
        )}

        {/* SECTION 2: Step-by-Step Refinement View */}
        {(activeTab === 'all' || activeTab === 'stepper') && minimizationResult && (
          <StepByStepView
            minimizationResult={minimizationResult}
            currentStepIndex={currentStepIndex}
            onStepChange={setCurrentStepIndex}
          />
        )}

        {/* SECTION 3: DFA Directed Graph SVG Visualizer */}
        {(activeTab === 'all' || activeTab === 'visualizer') && minimizationResult && (
          <DFAVisualizer
            originalDFA={minimizationResult.originalDFA}
            minimizedDFA={minimizationResult.minimizedDFA}
          />
        )}

        {/* SECTION 4: String Simulator & Equivalence Matrix */}
        {(activeTab === 'all' || activeTab === 'simulator') && minimizationResult && (
          <StringSimulator
            originalDFA={minimizationResult.originalDFA}
            minimizedDFA={minimizationResult.minimizedDFA}
            initialStrings={sampleStrings}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500 mt-12">
        <p>
          DFA Minimization Simulator • Built for Automata Theory & Formal Languages Academic Project
        </p>
      </footer>
    </div>
  );
};

export default App;
