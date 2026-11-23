import React, { useState, useMemo } from 'react';
import { DFA, PresetTestCase } from './types/dfa';
import { validateDFA, minimizeDFA, PRESET_DFAS } from './utils/dfaUtils';
import { Header } from './components/Header';
import { DFAForm } from './components/DFAForm';
import { MainStage } from './components/MainStage';
import { BackgroundDecorations } from './components/BackgroundDecorations';
import { ToastProvider, useToast } from './components/Toast';
import { LearnMoreModal } from './components/LearnMoreModal';
import { PresetsModal } from './components/PresetsModal';
import { TransitionEditorModal } from './components/TransitionEditorModal';
import { StringSimulatorModal } from './components/StringSimulatorModal';

const AppContent: React.FC = () => {
  const { showToast } = useToast();

  // Default to standard project example DFA (matching the reference image: A,B,C,D,E with D,E final)
  const defaultPreset = PRESET_DFAS[0];
  const [dfa, setDfa] = useState<DFA>(defaultPreset.dfa);
  const [currentPresetId, setCurrentPresetId] = useState<string>(defaultPreset.id);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [sampleStrings, setSampleStrings] = useState<string[]>(defaultPreset.sampleStrings);

  // Modals state
  const [isLearnMoreOpen, setIsLearnMoreOpen] = useState(false);
  const [isPresetsOpen, setIsPresetsOpen] = useState(false);
  const [isTransitionEditorOpen, setIsTransitionEditorOpen] = useState(false);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);

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
      // Advance to step 1 (or next step)
      setCurrentStepIndex(1);
      const reducedCount = minimizationResult.minimizedDFA.states.length;
      const originalCount = minimizationResult.originalDFA.states.length;
      const reduction = Math.round((1 - reducedCount / originalCount) * 100);

      showToast({
        title: '✨ Minimization Begun!',
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
      <main className="relative z-10 flex-1 max-w-[1440px] w-full mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Side: "Your DFA" Parchment Input Card (approx 3.8 / 12 cols) */}
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

          {/* Right Side: Main Stage (approx 8.2 / 12 cols) */}
          <div className="lg:col-span-8 xl:col-span-9">
            <MainStage
              minimizationResult={minimizationResult}
              currentStepIndex={currentStepIndex}
              onStepChange={setCurrentStepIndex}
              onOpenSimulator={() => setIsSimulatorOpen(true)}
            />
          </div>
        </div>
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
          isOpen={isSimulatorOpen}
          onClose={() => setIsSimulatorOpen(false)}
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
