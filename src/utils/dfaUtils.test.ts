import { validateDFA, minimizeDFA, compareDFAs, PRESET_DFAS } from './dfaUtils';

console.log('----------------------------------------------------');
console.log('RUNNING AUTOMATED DFA MINIMIZATION TEST SUITE');
console.log('----------------------------------------------------\n');

let passedTests = 0;
let totalTests = 0;

function assert(condition: boolean, testName: string, detail?: string) {
  totalTests++;
  if (condition) {
    console.log(`[PASS] Test ${totalTests}: ${testName}`);
    passedTests++;
  } else {
    console.error(`[FAIL] Test ${totalTests}: ${testName}`);
    if (detail) console.error(`       Detail: ${detail}`);
  }
}

// 1. Test Project Example DFA (A, B, C, D, E)
const examplePreset = PRESET_DFAS.find(p => p.id === 'example-prompt')!;
const exampleVal = validateDFA(examplePreset.dfa);
assert(exampleVal.isValid, 'Example DFA Validation', exampleVal.errors.join(', '));

const exampleMinResult = minimizeDFA(examplePreset.dfa);
assert(
  exampleMinResult.minimizedDFA.states.length === 4,
  'Example DFA Minimization State Count (Expected 4)',
  `Got ${exampleMinResult.minimizedDFA.states.length} states`
);

console.log('   Minimized States:', exampleMinResult.minimizedDFA.states);

// Test simulation equivalence on example DFA
const sampleStrings = ["01", "101", "00", "110", "011"];
const comparisonRes = compareDFAs(examplePreset.dfa, exampleMinResult.minimizedDFA, sampleStrings);
const allEquiv = comparisonRes.every(c => c.match);
assert(allEquiv, 'Example DFA Simulation Equivalence Across Sample Strings');

// 2. Test Unreachable States DFA
const unreachPreset = PRESET_DFAS.find(p => p.id === 'unreachable-states')!;
const unreachMinResult = minimizeDFA(unreachPreset.dfa);
assert(
  unreachMinResult.unreachableStates.includes('F') && unreachMinResult.unreachableStates.includes('G'),
  'Unreachable States Identification (F and G detected as unreachable)'
);
assert(
  unreachMinResult.minimizedDFA.states.length === 3,
  'Unreachable DFA State Reduction (Expected 3 states remaining)',
  `Got ${unreachMinResult.minimizedDFA.states.length}`
);

// 3. Test Already Minimal DFA
const minimalPreset = PRESET_DFAS.find(p => p.id === 'already-minimal')!;
const minimalResult = minimizeDFA(minimalPreset.dfa);
assert(
  minimalResult.minimizedDFA.states.length === 3,
  'Already-Minimal DFA (Expected 3 states)',
  `Got ${minimalResult.minimizedDFA.states.length}`
);

// 4. Test One State DFA
const oneStatePreset = PRESET_DFAS.find(p => p.id === 'one-state')!;
const oneStateResult = minimizeDFA(oneStatePreset.dfa);
assert(
  oneStateResult.minimizedDFA.states.length === 1,
  'One-State DFA (Expected 1 state)',
  `Got ${oneStateResult.minimizedDFA.states.length}`
);

// 5. Test No Final States (F = Ø)
const noFinalPreset = PRESET_DFAS.find(p => p.id === 'no-final-states')!;
const noFinalResult = minimizeDFA(noFinalPreset.dfa);
assert(
  noFinalResult.minimizedDFA.states.length === 1,
  'No Final States DFA Minimization to 1 State',
  `Got ${noFinalResult.minimizedDFA.states.length}`
);

// 6. Test All Final States (F = Q)
const allFinalPreset = PRESET_DFAS.find(p => p.id === 'all-final-states')!;
const allFinalResult = minimizeDFA(allFinalPreset.dfa);
assert(
  allFinalResult.minimizedDFA.states.length === 1,
  'All Final States DFA Minimization to 1 State',
  `Got ${allFinalResult.minimizedDFA.states.length}`
);

// 7. Test Input Validation for Broken DFAs
const invalidDFA = {
  states: ['A', 'B'],
  alphabet: ['0', '1'],
  startState: 'X', // invalid
  finalStates: ['B'],
  transitions: {
    A: { '0': 'B', '1': 'A' }
    // missing transitions for B
  }
};
const invalidVal = validateDFA(invalidDFA as any);
assert(!invalidVal.isValid, 'Invalid DFA Detection (Catches bad start state & missing transitions)');

console.log('\n----------------------------------------------------');
console.log(`TEST SUMMARY: ${passedTests} / ${totalTests} TESTS PASSED`);
console.log('----------------------------------------------------');
