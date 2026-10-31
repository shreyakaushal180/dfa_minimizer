import {
  DFA,
  ValidationResult,
  MinimizationResult,
  MinimizationStep,
  StateSignature,
  GroupSplitDetail,
  SimulationResult,
  SimulationStep,
  ComparisonItem,
  PresetTestCase
} from '../types/dfa';

/**
 * Validates a DFA input definition.
 */
export function validateDFA(dfa: DFA): ValidationResult {
  const errors: string[] = [];
  const warnings: string[] = [];

  // 1. States validation
  if (!dfa.states || dfa.states.length === 0) {
    errors.push("DFA must have at least one state.");
  } else {
    const uniqueStates = new Set(dfa.states);
    if (uniqueStates.size !== dfa.states.length) {
      errors.push("State names must be unique.");
    }
    for (const state of dfa.states) {
      if (!state.trim()) {
        errors.push("State names cannot be empty or blank.");
        break;
      }
    }
  }

  // 2. Alphabet validation
  if (!dfa.alphabet || dfa.alphabet.length === 0) {
    errors.push("Alphabet must contain at least one input symbol.");
  } else {
    const uniqueAlphabet = new Set(dfa.alphabet);
    if (uniqueAlphabet.size !== dfa.alphabet.length) {
      errors.push("Alphabet symbols must be unique.");
    }
    for (const symbol of dfa.alphabet) {
      if (!symbol.trim()) {
        errors.push("Alphabet symbols cannot be empty or blank.");
        break;
      }
    }
  }

  // If basic elements missing, return early
  if (errors.length > 0) {
    return { isValid: false, errors, warnings };
  }

  // 3. Start State validation
  if (!dfa.startState || !dfa.states.includes(dfa.startState)) {
    errors.push(`Start state "${dfa.startState}" is invalid or not in the set of states.`);
  }

  // 4. Final States validation
  if (dfa.finalStates) {
    for (const finalState of dfa.finalStates) {
      if (!dfa.states.includes(finalState)) {
        errors.push(`Final state "${finalState}" is not in the set of states.`);
      }
    }
    if (dfa.finalStates.length === 0) {
      warnings.push("No final states specified. The DFA will reject all input strings.");
    } else if (dfa.finalStates.length === dfa.states.length) {
      warnings.push("All states are final. The DFA will accept all valid input strings.");
    }
  }

  // 5. Transition Completeness and Target Validation
  if (!dfa.transitions) {
    errors.push("Transition table is missing.");
  } else {
    for (const state of dfa.states) {
      const stateTransitions = dfa.transitions[state];
      if (!stateTransitions) {
        errors.push(`Missing transitions for state "${state}".`);
        continue;
      }

      for (const symbol of dfa.alphabet) {
        const target = stateTransitions[symbol];
        if (target === undefined || target === null || target.trim() === '') {
          errors.push(`Missing transition for state "${state}" on input symbol "${symbol}".`);
        } else if (!dfa.states.includes(target)) {
          errors.push(`Invalid transition: state "${state}" on symbol "${symbol}" goes to unknown state "${target}".`);
        }
      }
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings
  };
}

/**
 * Computes all reachable states from the start state using Breadth-First Search (BFS).
 */
export function getReachableStates(dfa: DFA): string[] {
  if (!dfa.startState || !dfa.states.includes(dfa.startState)) {
    return [];
  }

  const visited = new Set<string>();
  const queue: string[] = [dfa.startState];
  visited.add(dfa.startState);

  while (queue.length > 0) {
    const current = queue.shift()!;
    const transitions = dfa.transitions[current] || {};

    for (const symbol of dfa.alphabet) {
      const target = transitions[symbol];
      if (target && dfa.states.includes(target) && !visited.has(target)) {
        visited.add(target);
        queue.push(target);
      }
    }
  }

  // Keep original state ordering for visited states
  return dfa.states.filter(s => visited.has(s));
}

/**
 * Helper to find which partition group index a state belongs to.
 */
function getGroupIndex(state: string, partitions: string[][]): number {
  for (let i = 0; i < partitions.length; i++) {
    if (partitions[i].includes(state)) {
      return i;
    }
  }
  return -1;
}

/**
 * Formats a list of states as a clean label for minimized state (e.g. {A, B} or {C})
 */
export function formatGroupLabel(group: string[]): string {
  if (group.length === 1) return group[0];
  return `{${group.join(', ')}}`;
}

/**
 * Performs full DFA Minimization using step-by-step Partition Refinement.
 */
export function minimizeDFA(dfa: DFA): MinimizationResult {
  const steps: MinimizationStep[] = [];

  // Step 0: Reachability Analysis
  const reachable = getReachableStates(dfa);
  const unreachable = dfa.states.filter(s => !reachable.includes(s));

  steps.push({
    stepNumber: 0,
    title: "1. Reachability Analysis",
    description: unreachable.length > 0
      ? `Found ${unreachable.length} unreachable state(s): [${unreachable.join(', ')}]. These will be removed before partition refinement.`
      : "All states are reachable from the start state.",
    type: "reachability",
    reachableStates: reachable,
    unreachableStates: unreachable,
    partitions: []
  });

  // If no reachable states, return empty minimized DFA
  if (reachable.length === 0) {
    return {
      originalDFA: dfa,
      minimizedDFA: {
        states: [],
        alphabet: dfa.alphabet,
        startState: '',
        finalStates: [],
        transitions: {}
      },
      reachableStates: [],
      unreachableStates: dfa.states,
      steps,
      stateMapping: {}
    };
  }

  // Step 1: Initial Partition (P0)
  // Split reachable states into Final states (F) and Non-Final states (Q \ F)
  const reachableFinal = reachable.filter(s => dfa.finalStates.includes(s));
  const reachableNonFinal = reachable.filter(s => !dfa.finalStates.includes(s));

  let currentPartitions: string[][] = [];
  if (reachableFinal.length > 0 && reachableNonFinal.length > 0) {
    currentPartitions = [reachableNonFinal, reachableFinal];
  } else if (reachableFinal.length > 0) {
    currentPartitions = [reachableFinal];
  } else {
    currentPartitions = [reachableNonFinal];
  }

  steps.push({
    stepNumber: 1,
    title: "2. Initial Partition (P0)",
    description: `Initial partition created by separating non-final states and final states into distinct equivalence classes.`,
    type: "initial_partition",
    reachableStates: reachable,
    unreachableStates: unreachable,
    partitions: currentPartitions.map(g => [...g])
  });

  // Step 2: Partition Refinement Loop
  let stepCounter = 2;
  let isStable = false;

  while (!isStable) {
    const nextPartitions: string[][] = [];
    const allSignatures: StateSignature[] = [];
    const splitDetails: GroupSplitDetail[] = [];
    let partitionChanged = false;

    // Analyze each group in current partition
    for (let gIdx = 0; gIdx < currentPartitions.length; gIdx++) {
      const group = currentPartitions[gIdx];

      // Map each state in group to its transition signature under currentPartitions
      const signatureGroups = new Map<string, string[]>();

      for (const state of group) {
        const targetStates: Record<string, string> = {};
        const targetGroupIndices: Record<string, number> = {};
        const sigParts: string[] = [];

        for (const symbol of dfa.alphabet) {
          const target = dfa.transitions[state][symbol];
          targetStates[symbol] = target;
          const targetGrp = getGroupIndex(target, currentPartitions);
          targetGroupIndices[symbol] = targetGrp;
          sigParts.push(`${symbol}→P${targetGrp}`);
        }

        const signatureKey = sigParts.join(', ');
        const sig: StateSignature = {
          state,
          targetStates,
          targetGroupIndices,
          signatureKey
        };

        allSignatures.push(sig);

        if (!signatureGroups.has(signatureKey)) {
          signatureGroups.set(signatureKey, []);
        }
        signatureGroups.get(signatureKey)!.push(state);
      }

      // Collect subgroups created from this group
      const subgroups = Array.from(signatureGroups.values());
      if (subgroups.length > 1) {
        partitionChanged = true;
      }

      splitDetails.push({
        groupIndex: gIdx,
        originalGroup: [...group],
        subgroups,
        signatures: group.map(st => allSignatures.find(s => s.state === st)!)
      });

      for (const sg of subgroups) {
        nextPartitions.push(sg);
      }
    }

    if (!partitionChanged) {
      isStable = true;
      steps.push({
        stepNumber: stepCounter,
        title: `Partition Refinement Round (Stable Result)`,
        description: `No groups were split during this round. The partition has reached a stable equilibrium!`,
        type: "completed",
        reachableStates: reachable,
        unreachableStates: unreachable,
        partitions: currentPartitions.map(g => [...g]),
        signatures: allSignatures,
        splitDetails,
        isStable: true
      });
    } else {
      currentPartitions = nextPartitions;
      steps.push({
        stepNumber: stepCounter,
        title: `Refinement Round ${stepCounter - 1} (P${stepCounter - 1})`,
        description: `Refined partition based on transition target group signatures. New total equivalence classes: ${currentPartitions.length}.`,
        type: "refinement",
        reachableStates: reachable,
        unreachableStates: unreachable,
        partitions: currentPartitions.map(g => [...g]),
        signatures: allSignatures,
        splitDetails,
        isStable: false
      });
      stepCounter++;
    }
  }

  // Construct Minimized DFA from final stable partition
  const finalPartitions = currentPartitions;
  const stateMapping: Record<string, string> = {};
  const minStates: string[] = [];

  finalPartitions.forEach((group) => {
    const label = formatGroupLabel(group);
    minStates.push(label);
    group.forEach(st => {
      stateMapping[st] = label;
    });
  });

  // Minimized Start State
  const minStartState = stateMapping[dfa.startState] || minStates[0];

  // Minimized Final States
  const minFinalStates = minStates.filter(minSt => {
    // Find representative original state in this group
    const origGroup = finalPartitions.find(g => formatGroupLabel(g) === minSt);
    if (!origGroup) return false;
    return origGroup.some(st => dfa.finalStates.includes(st));
  });

  // Minimized Transitions
  const minTransitions: Record<string, Record<string, string>> = {};

  finalPartitions.forEach(group => {
    const minStLabel = formatGroupLabel(group);
    const repState = group[0]; // Any state in equivalence class gives same transition behavior
    minTransitions[minStLabel] = {};

    for (const symbol of dfa.alphabet) {
      const origTarget = dfa.transitions[repState][symbol];
      const minTarget = stateMapping[origTarget];
      minTransitions[minStLabel][symbol] = minTarget;
    }
  });

  const minimizedDFA: DFA = {
    states: minStates,
    alphabet: [...dfa.alphabet],
    startState: minStartState,
    finalStates: minFinalStates,
    transitions: minTransitions
  };

  return {
    originalDFA: dfa,
    minimizedDFA,
    reachableStates: reachable,
    unreachableStates: unreachable,
    steps,
    stateMapping
  };
}

/**
 * Simulates a string on a DFA step-by-step.
 */
export function simulateDFA(dfa: DFA, inputString: string): SimulationResult {
  const cleanedInput = inputString.trim();
  const symbols = cleanedInput === '' || cleanedInput === 'ε' || cleanedInput === 'lambda' ? [] : cleanedInput.split('');

  // Validate symbols against alphabet
  for (const sym of symbols) {
    if (!dfa.alphabet.includes(sym)) {
      return {
        inputString: cleanedInput,
        path: [dfa.startState],
        isAccepted: false,
        trace: [],
        executionMessage: `Invalid symbol "${sym}" not present in alphabet [${dfa.alphabet.join(', ')}].`,
        isValidAlphabet: false,
        invalidSymbol: sym
      };
    }
  }

  let currentState = dfa.startState;
  const path: string[] = [currentState];
  const trace: SimulationStep[] = [];

  for (let i = 0; i < symbols.length; i++) {
    const sym = symbols[i];
    const nextState = dfa.transitions[currentState]?.[sym];

    if (!nextState) {
      return {
        inputString: cleanedInput,
        path,
        isAccepted: false,
        trace,
        executionMessage: `Halted: No valid transition from state "${currentState}" on symbol "${sym}".`,
        isValidAlphabet: true
      };
    }

    trace.push({
      stepIndex: i + 1,
      symbol: sym,
      currentState,
      nextState
    });

    currentState = nextState;
    path.push(currentState);
  }

  const isAccepted = dfa.finalStates.includes(currentState);
  const executionMessage = isAccepted
    ? `Accepted: Ended at final state "${currentState}".`
    : `Rejected: Ended at non-final state "${currentState}".`;

  return {
    inputString: cleanedInput === '' ? 'ε (empty string)' : cleanedInput,
    path,
    isAccepted,
    trace,
    executionMessage,
    isValidAlphabet: true
  };
}

/**
 * Runs a list of strings on both Original and Minimized DFA to prove equivalence.
 */
export function compareDFAs(originalDFA: DFA, minimizedDFA: DFA, inputStrings: string[]): ComparisonItem[] {
  return inputStrings.map(str => {
    const origRes = simulateDFA(originalDFA, str);
    const minRes = simulateDFA(minimizedDFA, str);
    const match = origRes.isAccepted === minRes.isAccepted;

    return {
      inputString: str,
      originalResult: origRes,
      minimizedResult: minRes,
      match
    };
  });
}

/**
 * Preset Test Cases as requested in problem prompt and edge case requirements.
 */
export const PRESET_DFAS: PresetTestCase[] = [
  {
    id: "example-prompt",
    name: "Example DFA (Redundant States)",
    description: "Standard project example with states A,B,C,D,E. D and E are equivalent, minimizing from 5 to 4 states.",
    expectedStateCount: 4,
    sampleStrings: ["01", "101", "00", "110", "011"],
    dfa: {
      states: ["A", "B", "C", "D", "E"],
      alphabet: ["0", "1"],
      startState: "A",
      finalStates: ["D", "E"],
      transitions: {
        A: { "0": "B", "1": "C" },
        B: { "0": "A", "1": "D" },
        C: { "0": "E", "1": "C" },
        D: { "0": "E", "1": "D" },
        E: { "0": "E", "1": "D" }
      }
    }
  },
  {
    id: "unreachable-states",
    name: "DFA with Unreachable States",
    description: "States F and G cannot be reached from start state A. They are removed prior to partition refinement.",
    expectedStateCount: 3,
    sampleStrings: ["0", "1", "01", "11"],
    dfa: {
      states: ["A", "B", "C", "F", "G"],
      alphabet: ["0", "1"],
      startState: "A",
      finalStates: ["C", "G"],
      transitions: {
        A: { "0": "B", "1": "A" },
        B: { "0": "C", "1": "A" },
        C: { "0": "C", "1": "C" },
        F: { "0": "G", "1": "F" },
        G: { "0": "F", "1": "G" }
      }
    }
  },
  {
    id: "already-minimal",
    name: "Already-Minimal DFA",
    description: "A 3-state DFA accepting strings ending with '1'. Cannot be minimized further.",
    expectedStateCount: 3,
    sampleStrings: ["0", "1", "01", "10", "101"],
    dfa: {
      states: ["q0", "q1", "q2"],
      alphabet: ["0", "1"],
      startState: "q0",
      finalStates: ["q2"],
      transitions: {
        q0: { "0": "q0", "1": "q1" },
        q1: { "0": "q0", "1": "q2" },
        q2: { "0": "q0", "1": "q2" }
      }
    }
  },
  {
    id: "one-state",
    name: "One-State DFA",
    description: "Single state DFA with self-loops accepting all strings.",
    expectedStateCount: 1,
    sampleStrings: ["", "0", "1", "0011"],
    dfa: {
      states: ["A"],
      alphabet: ["0", "1"],
      startState: "A",
      finalStates: ["A"],
      transitions: {
        A: { "0": "A", "1": "A" }
      }
    }
  },
  {
    id: "no-final-states",
    name: "No Final States (F = Ø)",
    description: "DFA with no final states. Minimizes to 1 non-accepting state.",
    expectedStateCount: 1,
    sampleStrings: ["0", "1", "01"],
    dfa: {
      states: ["A", "B", "C"],
      alphabet: ["0", "1"],
      startState: "A",
      finalStates: [],
      transitions: {
        A: { "0": "B", "1": "C" },
        B: { "0": "C", "1": "A" },
        C: { "0": "A", "1": "B" }
      }
    }
  },
  {
    id: "all-final-states",
    name: "All States Final (F = Q)",
    description: "All states are final. Minimizes to 1 single accepting state.",
    expectedStateCount: 1,
    sampleStrings: ["0", "1", "110"],
    dfa: {
      states: ["A", "B", "C"],
      alphabet: ["0", "1"],
      startState: "A",
      finalStates: ["A", "B", "C"],
      transitions: {
        A: { "0": "B", "1": "C" },
        B: { "0": "C", "1": "A" },
        C: { "0": "A", "1": "B" }
      }
    }
  },
  {
    id: "complex-equivalence",
    name: "Complex Equivalent States (6 States → 3)",
    description: "Classic textbook DFA with 6 states (q0 to q5) reducing to 3 equivalent state groups.",
    expectedStateCount: 3,
    sampleStrings: ["a", "b", "ab", "ba", "aab", "bba"],
    dfa: {
      states: ["q0", "q1", "q2", "q3", "q4", "q5"],
      alphabet: ["a", "b"],
      startState: "q0",
      finalStates: ["q1", "q2", "q5"],
      transitions: {
        q0: { "a": "q1", "b": "q3" },
        q1: { "a": "q2", "b": "q4" },
        q2: { "a": "q1", "b": "q4" },
        q3: { "a": "q4", "b": "q5" },
        q4: { "a": "q4", "b": "q4" },
        q5: { "a": "q5", "b": "q4" }
      }
    }
  }
];
