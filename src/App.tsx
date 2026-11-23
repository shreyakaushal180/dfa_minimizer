import React, { useState, useMemo } from 'react';
import { DFA, PresetTestCase } from './types/dfa';
import { validateDFA, minimizeDFA, PRESET_DFAS } from './utils/dfaUtils';
import { Header } from './components/Header';
import { DFAForm } from './components/DFAForm';
import { MainStage } from './components/MainStage';
import { SideBySideSimulator } from './components/SideBySideSimulator';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { ToastProvider, useToast } from './components/Toast';
import { LearnMoreModal } from './components/LearnMoreModal';
import { PresetsModal } from './components/PresetsModal';
import { TransitionEditorModal } from './components/TransitionEditorModal';
import { StringSimulatorModal } from './components/StringSimulatorModal';
import { Layers, Terminal } from 'lucide-react';

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Default to standard project example DFA (A,B,C,D,E with D,E final)
  const defaultPreset = PRESET_DFAS[0];
  const [dfa, setDfa] = useState<DFA>(defaultPreset.dfa);
  const [currentPresetId, setCurrentPresetId] = useState<string>(defaultPreset.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [sampleStrings, setSampleStrings] = useState<string[]>(defaultPreset.sampleStrings);

  // Active view tab: 'minimizer' or 'simulator'
  const [activeTab, setActiveTab] = useState<'minimizer' | 'simulator'>('minimizer');

  // Modals state
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isTransitionEditorOpen, setIsTransitionEditorOpen] = useState(false);
  const [isSimulatorModalOpen, setIsSimulatorModalOpen] = useState(false);

  // Live validation
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

    showToast({
      title: `Loaded Preset: "${preset.name}"`,
      description: `${preset.dfa.states.length} states loaded (${preset.description})`,
      type: 'success',
    });
  };

  // Handler for reset to standard example
  const handleResetToExample = () => {
    handleSelectPreset(PRESET_DFAS[0]);
    showToast({
      title: 'Reset to Example Automaton',
      description: 'Loaded default 5-state DFA (A, B, C, D, E)',
      type: 'info',
    });
  };

  // Handler for clicking "Minimize DFA"
  const handleMinimizeClick = () => {
    if (!validation.isValid) {
      showToast({
        title: 'Validation Notice',
        description: validation.errors[0] || 'Please fix automaton definition errors first.',
        type: 'warning',
      });
      return;
    }

    if (minimizationResult) {
      setCurrentStepIndex(1);
      setActiveTab('minimizer');
      const reducedCount = minimizationResult.minimizedDFA.states.length;
      const originalCount = minimizationResult.originalDFA.states.length;
      const reduction = Math.round((1 - reducedCount / originalCount) * 100);

      showToast({
        title: 'Minimization Begun',
        description: `Refining partitions: ${originalCount} states can reduce to ${reducedCount} (${reduction}% reduction)`,
        type: 'magic',
      });
    }
  };

  return (
    <div className="relative min-h-screen text-[#3b2b1f] flex flex-col font-sans selection:bg-amber-200 selection:text-amber-950 overflow-x-hidden">
      {/* Cozy Library & Lanterns Background Decorations */}
      <BackgroundDecorations />

      {/* Header Bar */}
      <Header
        onOpenLearnMore={() => setIsLearnMoreOpen(true)}
        onOpenPresets={() => setIsPresetsOpen(true)}
        onResetToExample={handleResetToExample}
      />

      {/* Main Container Area */}
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4">
        {/* Navigation Tabs Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-amber-950/20 pb-2.5">
          <div className="flex bg-[#231a30]/80 p-1 rounded-xl border border-[#4a395c]/60 shadow-md">
            <button
              onClick={() => setActiveTab('minimizer')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'minimizer'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-[#d6c4a8] hover:text-white'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>1. DFA Minimizer Workflow</span>
            </button>

            <button
              onClick={() => setActiveTab('simulator')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition ${
                activeTab === 'simulator'
                  ? 'bg-amber-400 text-stone-950 shadow'
                  : 'text-[#d6c4a8] hover:text-white'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>2. Side-by-Side String Simulator</span>
            </button>
          </div>

          <div className="text-xs text-[#c5b59f] font-mono">
            Preset:{' '}
            <span className="text-amber-300 font-bold">
              {PRESET_DFAS.find((p) => p.id === currentPresetId)?.name || 'Custom Automaton'}
            </span>
          </div>
        </div>

        {/* Content Body */}
        {activeTab === 'minimizer' ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Side: "Your DFA" Parchment Input Card */}
            <div className="lg:col-span-4 xl:col-span-3">
              <DFAForm
                dfa={dfa}
                validation={validation}
                onChange={(updated) => {
                  setDfa(updated);
                  setCurrentPresetId('custom');
                  setCurrentStepIndex(0);
                }}
                onOpenTransitionEditor={() => setIsTransitionEditorOpen(true)}
                onMinimizeClick={handleMinimizeClick}
              />
            </div>

            {/* Right Side: Main Stage */}
            <div className="lg:col-span-8 xl:col-span-9">
              <MainStage
                minimizationResult={minimizationResult}
                currentStepIndex={currentStepIndex}
                onStepChange={setCurrentStepIndex}
                onOpenSimulator={() => setActiveTab('simulator')}
              />
            </div>
          </div>
        ) : (
          /* Side-by-Side Simulator Tab */
          <div className="space-y-4">
            {minimizationResult ? (
              <SideBySideSimulator
                originalDFA={minimizationResult.originalDFA}
                minimizedDFA={minimizationResult.minimizedDFA}
                initialStrings={sampleStrings}
              />
            ) : (
              <div className="parchment-card p-12 text-center text-stone-600">
                <p className="font-serif font-bold text-base text-stone-800">
                  Please configure a valid DFA in the Minimizer tab first.
                </p>
                <button
                  onClick={() => setActiveTab('minimizer')}
                  className="mt-3 px-4 py-2 text-xs font-semibold bg-[#252d4a] text-white rounded-lg"
                >
                  Return to Minimizer
                </button>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Cozy Footer */}
      <footer className="relative z-10 py-5 text-center text-xs text-[#a3927d] bg-[#140e1f]/70 border-t border-amber-950/30">
        <p className="flex items-center justify-center gap-2">
          <span>✨ DFA Minimization Simulator • Hopcroft's Partition Algorithm</span>
          <span>•</span>
          <button
            onClick={() => setIsLearnMoreOpen(true)}
            className="hover:text-amber-300 underline transition"
          >
            How it works
          </button>
        </p>
      </footer>

      {/* Modals & Popups */}
      <LearnMoreModal
        isOpen={isLearnMoreOpen}
        onClose={() => setIsLearnMoreOpen(false)}
      />

      <PresetsModal
        isOpen={isPresetsOpen}
        onClose={() => setIsPresetsOpen(false)}
        currentPresetId={currentPresetId}
        onSelectPreset={handleSelectPreset}
      />

      <TransitionEditorModal
        isOpen={isTransitionEditorOpen}
        onClose={() => setIsTransitionEditorOpen(false)}
        dfa={dfa}
        onSave={(updated) => {
          setDfa(updated);
          showToast({
            title: 'Transitions Saved',
            description: 'Transition matrix updated successfully!',
            type: 'success',
          });
        }}
      />

      {minimizationResult && (
        <StringSimulatorModal
          isOpen={isSimulatorModalOpen}
          onClose={() => setIsSimulatorModalOpen(false)}
          originalDFA={minimizationResult.originalDFA}
          minimizedDFA={minimizationResult.minimizedDFA}
          initialStrings={sampleStrings}
        />
      )}
    </div>
  );
};

export const App: React.FC = () => {
  return (
    <ToastProvider>
      <AppContent />
    </ToastProvider>
  );
};

export default App;
