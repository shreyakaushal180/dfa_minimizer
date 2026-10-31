export interface Transitions {
  [state: string]: {
    [symbol: string]: string;
  };
}

export interface DFA {
  states: string[];
  alphabet: string[];
  startState: string;
  finalStates: string[];
  transitions: Transitions;
}

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
}

export interface StateSignature {
  state: string;
  targetStates: Record<string, string>;       // symbol -> destination state name
  targetGroupIndices: Record<string, number>; // symbol -> group index in current partition
  signatureKey: string;                       // e.g. "0:0, 1:1"
}

export interface GroupSplitDetail {
  groupIndex: number;
  originalGroup: string[];
  subgroups: string[][];
  signatures: StateSignature[];
}

export interface MinimizationStep {
  stepNumber: number;
  title: string;
  description: string;
  type: 'reachability' | 'initial_partition' | 'refinement' | 'completed';
  reachableStates: string[];
  unreachableStates: string[];
  partitions: string[][]; // Each sub-array represents an equivalence class (group of states)
  signatures?: StateSignature[];
  splitDetails?: GroupSplitDetail[];
  isStable?: boolean;
}

export interface MinimizationResult {
  originalDFA: DFA;
  minimizedDFA: DFA;
  reachableStates: string[];
  unreachableStates: string[];
  steps: MinimizationStep[];
  stateMapping: Record<string, string>; // Maps original state to its corresponding minimized state label
}

export interface SimulationStep {
  stepIndex: number;
  symbol: string;
  currentState: string;
  nextState: string;
}

export interface SimulationResult {
  inputString: string;
  path: string[];
  isAccepted: boolean;
  trace: SimulationStep[];
  executionMessage: string;
  isValidAlphabet: boolean;
  invalidSymbol?: string;
}

export interface ComparisonItem {
  inputString: string;
  originalResult: SimulationResult;
  minimizedResult: SimulationResult;
  match: boolean;
}

export interface PresetTestCase {
  id: string;
  name: string;
  description: string;
  dfa: DFA;
  sampleStrings: string[];
  expectedStateCount: number;
}
