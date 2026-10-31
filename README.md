# DFA Minimization Simulator

A complete, academic-grade **web-based DFA Minimization Simulator** built with **React, Vite, TypeScript, and Tailwind CSS** for Automata Theory & Formal Languages projects.

![DFA Minimization Simulator](https://img.shields.io/badge/Automata_Theory-Academic_Project-indigo)
![React](https://img.shields.io/badge/React-18-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7-blue)
![Vite](https://img.shields.io/badge/Vite-6.0-purple)

---

## 📌 Problem Statement

In Automata Theory, a **Deterministic Finite Automaton (DFA)** may contain redundant states or states that are unreachable from the start state. Minimizing a DFA produces an equivalent automaton with the **minimum number of states** accepting the exact same language $L(M)$.

This application provides:
1. **Dynamic DFA Definition & Matrix Editing** for arbitrary user-defined DFAs.
2. **Complete Input Validation** (completeness, target validity, state uniqueness).
3. **Step-by-Step Partition Refinement Visualization** with transition signature tables.
4. **Dynamic SVG Directed Graph Visualizer** for both Original and Minimized DFAs.
5. **String Simulation & Language Equivalence Proof** verifying $L(M_1) = L(M_2)$.

---

## 🎯 Objectives

* **Generic Execution**: Support arbitrary user-defined DFAs without hard-coding minimization results.
* **Academic Transparency**: Show every intermediate step (reachability, initial partition $P_0$, signature calculation, group splitting, final stable partition).
* **Interactive Visualization**: Render vector directed graphs showing state circles, entry arrow for start state, double ring for final states, self-loops, and curved transition arcs.
* **Rigorous Verification**: Provide string simulation comparison tables and preset test cases for edge conditions.

---

## 🧠 Algorithm & Pseudocode

The simulator implements **Hopcroft's Partition Refinement Algorithm**:

### Minimization Pseudocode

```text
ALGORITHM DFA_Minimization(M = (Q, Σ, δ, q0, F))
INPUT: DFA M
OUTPUT: Minimized DFA M' = (Q', Σ, δ', q0', F')

1. [Reachability Analysis]
   Q_reachable = BFS_Traverse(q0, Q, Σ, δ)
   Q_unreachable = Q \ Q_reachable
   Discard Q_unreachable from consideration.

2. [Initial Partition P0]
   F_reach = F ∩ Q_reachable
   N_reach = Q_reachable \ F_reach
   P_0 = { N_reach, F_reach } (omit empty sets)

3. [Iterative Refinement Loop]
   k = 0
   REPEAT
      P_{k+1} = Empty List
      FOR EACH group G IN P_k DO
         FOR EACH state s IN G DO
            signature(s) = [ (a, IndexOfGroup(δ(s, a), P_k)) for each a in Σ ]
         END FOR
         Split G into subgroups G1, G2... based on identical signatures.
         Add subgroups to P_{k+1}.
      END FOR
      k = k + 1
   UNTIL P_k == P_{k-1}  (No groups split -> Stable Partition)

4. [Construct Minimized DFA]
   Q' = P_final
   q0' = Group containing q0
   F' = Groups containing states from F
   δ'(Group_i, symbol) = Group_j containing δ(representative_state, symbol)
```

---

## 🏗️ System Architecture & Code Structure

The project strictly separates core automata algorithm logic from UI components:

```text
automata sim/
├── src/
│   ├── types/
│   │   └── dfa.ts            # TypeScript interfaces for DFA, Partitions, Steps & Results
│   ├── utils/
│   │   ├── dfaUtils.ts       # Core Automata Algorithms & Presets
│   │   └── dfaUtils.test.ts  # Automated test suite
│   ├── components/
│   │   ├── Header.tsx        # Top navbar & Viva guide trigger
│   │   ├── DFAForm.tsx       # Dynamic input form & transition table matrix
│   │   ├── StepByStepView.tsx # Stepper & signature refinement tables
│   │   ├── DFAVisualizer.tsx # Dynamic SVG directed graph visualizer
│   │   ├── StringSimulator.tsx# String trace execution & equivalence table
│   │   ├── TestPresets.tsx   # Edge case test suite selector
│   │   └── VivaGuideModal.tsx# Academic Viva quick reference modal
│   ├── App.tsx               # Main dashboard component
│   └── main.tsx              # Application entry
├── README.md                 # Project documentation
├── vite.config.ts            # Vite bundler configuration
└── package.json
```

### Key Core Functions (`src/utils/dfaUtils.ts`)

| Function | Purpose |
| :--- | :--- |
| `validateDFA(dfa)` | Checks state uniqueness, start/final state validity, and transition completeness. |
| `getReachableStates(dfa)` | BFS search returning array of states reachable from $q_0$. |
| `minimizeDFA(dfa)` | Full minimization engine returning step-by-step history records, signatures, and minimized DFA. |
| `simulateDFA(dfa, inputString)` | Simulates string execution returning path trajectory and acceptance status. |
| `compareDFAs(orig, min, strings)` | Executes string suite on both DFAs and proves language equivalence $L(M_1) = L(M_2)$. |

---

## 🚀 How to Run

### Prerequisites
* **Node.js**: v18.0.0 or higher
* **npm**: v9.0.0 or higher

### Commands

```bash
# 1. Install dependencies
npm install

# 2. Run local development server
npm run dev

# 3. Build for production deployment
npm run build

# 4. Preview production build
npm run preview
```

Open `http://localhost:5173` in your browser.

---

## 🧪 Testing & Preset Test Suite

The application includes built-in preset test cases covering standard and edge case scenarios:

1. **Project Example DFA (Redundant States)**:
   * States: `A, B, C, D, E` | Alphabet: `0, 1` | Start: `A` | Final: `D, E`
   * Transitions: `A:(B,C)`, `B:(A,D)`, `C:(E,C)`, `D:(E,D)`, `E:(E,D)`
   * Result: States `D` and `E` merge $\rightarrow$ Final partition `{{A}, {B}, {C}, {D, E}}` (4 states).
2. **Unreachable States DFA**:
   * States `F, G` cannot be reached from `A`. Automatically detected and removed.
3. **Already-Minimal DFA**:
   * 3-state minimal DFA. Refinement terminates with 0 splits.
4. **Single-State DFA**:
   * 1-state DFA with self loops.
5. **No Final States ($F = \emptyset$)**:
   * Minimizes to a single non-accepting state.
6. **All Final States ($F = Q$)**:
   * Minimizes to a single accepting state.

---

## ⚠️ Limitations & Future Work

* **Determinism**: The simulator currently processes Deterministic Finite Automata (DFAs). Non-deterministic finite automata (NFAs) must be converted to DFAs via subset construction first.
* **Alphabet Size**: Optimized for standard academic alphabets (e.g., $\{0, 1\}$ or $\{a, b\}$).

---

## 🎓 Viva Examination Quick Reference

* **Myhill-Nerode Theorem**: States $p$ and $q$ are equivalent if for all strings $w \in \Sigma^*$, $\delta(p, w) \in F \iff \delta(q, w) \in F$.
* **Time Complexity**: $O(k \cdot |Q| \cdot |\Sigma|)$ where $k$ is the number of refinement rounds (or $O(|\Sigma| \cdot |Q| \log |Q|)$ using Hopcroft's worklist queue).
* **Space Complexity**: $O(|Q| \cdot |\Sigma|)$ to store transition tables and partition indices.
