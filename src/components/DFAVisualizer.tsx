import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { Network } from 'lucide-react';

interface DFAVisualizerProps {
  originalDFA: DFA;
  minimizedDFA: DFA;
  activeOriginalState?: string;
  activeMinimizedState?: string;
}

interface NodePos {
  x: number;
  y: number;
}

export const DFAVisualizer: React.FC<DFAVisualizerProps> = ({
  originalDFA,
  minimizedDFA,
  activeOriginalState,
  activeMinimizedState,
}) => {
  const [viewMode, setViewMode] = useState<'both' | 'original' | 'minimized'>('both');

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-lg space-y-4">
      {/* Top Header & View Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
        <div>
          <h2 className="text-lg font-semibold text-white flex items-center gap-2">
            <Network className="w-5 h-5 text-indigo-400" />
            DFA Directed Graph Visualizer
          </h2>
          <p className="text-xs text-slate-400">Dynamic SVG layout showing states, transitions, start arrow, and double final rings.</p>
        </div>

        {/* View mode toggle */}
        <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          <button
            onClick={() => setViewMode('both')}
            className={`px-3 py-1 rounded-md transition font-medium ${
              viewMode === 'both' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Side-by-Side
          </button>
          <button
            onClick={() => setViewMode('original')}
            className={`px-3 py-1 rounded-md transition font-medium ${
              viewMode === 'original' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Original Only
          </button>
          <button
            onClick={() => setViewMode('minimized')}
            className={`px-3 py-1 rounded-md transition font-medium ${
              viewMode === 'minimized' ? 'bg-indigo-600 text-white shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            Minimized Only
          </button>
        </div>
      </div>

      {/* Graph Cards */}
      <div className={`grid gap-4 ${viewMode === 'both' ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
        {(viewMode === 'both' || viewMode === 'original') && (
          <SingleDFAGraphCard
            dfa={originalDFA}
            title="Original DFA"
            subtitle={`${originalDFA.states.length} states, ${originalDFA.alphabet.length} symbols`}
            badgeColor="bg-slate-800 text-slate-300"
            activeState={activeOriginalState}
            markerId="arrow-orig"
          />
        )}

        {(viewMode === 'both' || viewMode === 'minimized') && (
          <SingleDFAGraphCard
            dfa={minimizedDFA}
            title="Minimized DFA"
            subtitle={`${minimizedDFA.states.length} states (Equivalence Classes)`}
            badgeColor="bg-emerald-950 text-emerald-300 border border-emerald-700/60"
            activeState={activeMinimizedState}
            markerId="arrow-min"
          />
        )}
      </div>
    </div>
  );
};

interface SingleDFAGraphCardProps {
  dfa: DFA;
  title: string;
  subtitle: string;
  badgeColor: string;
  activeState?: string;
  markerId: string;
}

const SingleDFAGraphCard: React.FC<SingleDFAGraphCardProps> = ({
  dfa,
  title,
  subtitle,
  badgeColor,
  activeState,
  markerId,
}) => {
  const width = 460;
  const height = 360;
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * 0.35;
  const nodeRadius = 26;

  // Compute circular layout for nodes
  const nodes: Record<string, NodePos> = {};
  const numStates = dfa.states.length;

  dfa.states.forEach((state, index) => {
    if (numStates === 1) {
      nodes[state] = { x: centerX, y: centerY };
    } else {
      // Start top-most (angle -pi/2)
      const angle = (2 * Math.PI * index) / numStates - Math.PI / 2;
      nodes[state] = {
        x: centerX + radius * Math.cos(angle),
        y: centerY + radius * Math.sin(angle),
      };
    }
  });

  // Group transitions between state pairs for combined labels (e.g., A -> B on "0, 1")
  const transitionPairs = new Map<string, string[]>();

  dfa.states.forEach(from => {
    dfa.alphabet.forEach(sym => {
      const to = dfa.transitions[from]?.[sym];
      if (to && nodes[from] && nodes[to]) {
        const key = `${from}--->${to}`;
        if (!transitionPairs.has(key)) {
          transitionPairs.set(key, []);
        }
        transitionPairs.get(key)!.push(sym);
      }
    });
  });

  return (
    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col items-center justify-between space-y-3 relative overflow-hidden">
      <div className="w-full flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          <span className="text-[11px] text-slate-400">{subtitle}</span>
        </div>
        <span className={`px-2 py-0.5 text-xs font-mono rounded-md ${badgeColor}`}>
          |Q| = {dfa.states.length}
        </span>
      </div>

      {/* SVG Canvas */}
      <div className="w-full flex items-center justify-center bg-slate-900/50 rounded-xl border border-slate-800/80 p-2">
        <svg
          viewBox={`0 0 ${width} ${height}`}
          className="w-full h-auto max-h-[340px] select-none"
        >
          <defs>
            <marker
              id={markerId}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="6"
              markerHeight="6"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#818cf8" />
            </marker>
            <marker
              id={`${markerId}-active`}
              viewBox="0 0 10 10"
              refX="8"
              refY="5"
              markerWidth="7"
              markerHeight="7"
              orient="auto-start-reverse"
            >
              <path d="M 0 1 L 10 5 L 0 9 z" fill="#34d399" />
            </marker>
          </defs>

          {/* Render Transitions (Edges) */}
          {Array.from(transitionPairs.entries()).map(([key, symbols]) => {
            const [from, to] = key.split('--->');
            const p1 = nodes[from];
            const p2 = nodes[to];
            if (!p1 || !p2) return null;

            const labelText = symbols.join(', ');
            const isSelfLoop = from === to;
            const reverseKey = `${to}--->${from}`;
            const hasReverse = from !== to && transitionPairs.has(reverseKey);

            if (isSelfLoop) {
              // Self loop curve above node
              const loopX = p1.x;
              const loopY = p1.y - nodeRadius - 8;
              return (
                <g key={key}>
                  <path
                    d={`M ${p1.x - 12} ${p1.y - nodeRadius + 4} C ${p1.x - 35} ${p1.y - nodeRadius - 40}, ${p1.x + 35} ${p1.y - nodeRadius - 40}, ${p1.x + 12} ${p1.y - nodeRadius + 4}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.75"
                    markerEnd={`url(#${markerId})`}
                  />
                  <rect
                    x={loopX - 14}
                    y={loopY - 24}
                    width={28}
                    height={16}
                    rx={4}
                    fill="#0f172a"
                    stroke="#4338ca"
                    strokeWidth="1"
                  />
                  <text
                    x={loopX}
                    y={loopY - 12}
                    textAnchor="middle"
                    fill="#c7d2fe"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {labelText}
                  </text>
                </g>
              );
            }

            // Normal or Curved edge
            const dx = p2.x - p1.x;
            const dy = p2.y - p1.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist === 0) return null;

            const unitX = dx / dist;
            const unitY = dy / dist;

            // Offset start & end points to circle edge
            const startX = p1.x + unitX * nodeRadius;
            const startY = p1.y + unitY * nodeRadius;
            const endX = p2.x - unitX * nodeRadius;
            const endY = p2.y - unitY * nodeRadius;

            if (hasReverse) {
              // Curved arc to prevent collision with reverse edge
              const midX = (p1.x + p2.x) / 2;
              const midY = (p1.y + p2.y) / 2;
              const perpX = -unitY * 25;
              const perpY = unitX * 25;
              const ctrlX = midX + perpX;
              const ctrlY = midY + perpY;

              return (
                <g key={key}>
                  <path
                    d={`M ${startX} ${startY} Q ${ctrlX} ${ctrlY} ${endX} ${endY}`}
                    fill="none"
                    stroke="#6366f1"
                    strokeWidth="1.75"
                    markerEnd={`url(#${markerId})`}
                  />
                  <rect
                    x={ctrlX - 14}
                    y={ctrlY - 9}
                    width={28}
                    height={16}
                    rx={4}
                    fill="#0f172a"
                    stroke="#4338ca"
                    strokeWidth="1"
                  />
                  <text
                    x={ctrlX}
                    y={ctrlY + 3}
                    textAnchor="middle"
                    fill="#c7d2fe"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {labelText}
                  </text>
                </g>
              );
            } else {
              // Straight line edge
              const midX = (startX + endX) / 2;
              const midY = (startY + endY) / 2;

              return (
                <g key={key}>
                  <line
                    x1={startX}
                    y1={startY}
                    x2={endX}
                    y2={endY}
                    stroke="#6366f1"
                    strokeWidth="1.75"
                    markerEnd={`url(#${markerId})`}
                  />
                  <rect
                    x={midX - 14}
                    y={midY - 10}
                    width={28}
                    height={16}
                    rx={4}
                    fill="#0f172a"
                    stroke="#4338ca"
                    strokeWidth="1"
                  />
                  <text
                    x={midX}
                    y={midY + 2}
                    textAnchor="middle"
                    fill="#c7d2fe"
                    fontSize="10"
                    fontFamily="monospace"
                    fontWeight="bold"
                  >
                    {labelText}
                  </text>
                </g>
              );
            }
          })}

          {/* Render Nodes */}
          {dfa.states.map(state => {
            const pos = nodes[state];
            if (!pos) return null;

            const isStart = state === dfa.startState;
            const isFinal = dfa.finalStates.includes(state);
            const isActive = activeState === state;

            return (
              <g key={state} className="cursor-pointer">
                {/* Start State Arrow */}
                {isStart && (
                  <g>
                    <path
                      d={`M ${pos.x - nodeRadius - 28} ${pos.y} L ${pos.x - nodeRadius - 2} ${pos.y}`}
                      stroke="#10b981"
                      strokeWidth="2.5"
                      markerEnd={`url(#${markerId}-active)`}
                    />
                    <text
                      x={pos.x - nodeRadius - 32}
                      y={pos.y + 4}
                      fill="#34d399"
                      fontSize="10"
                      fontWeight="bold"
                      textAnchor="end"
                    >
                      Start
                    </text>
                  </g>
                )}

                {/* Outer Ring for Final States (Double Circle) */}
                {isFinal && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={nodeRadius + 4}
                    fill="none"
                    stroke={isActive ? '#34d399' : '#10b981'}
                    strokeWidth="2"
                    strokeDasharray={isActive ? '4,2' : 'none'}
                  />
                )}

                {/* Main Node Circle */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius}
                  fill={isActive ? '#065f46' : isFinal ? '#022c22' : '#1e1b4b'}
                  stroke={isActive ? '#34d399' : isFinal ? '#10b981' : '#6366f1'}
                  strokeWidth={isActive ? '3' : '2'}
                  className="transition-colors duration-200"
                />

                {/* Node Label Text */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill={isActive ? '#a7f3d0' : '#ffffff'}
                  fontSize={state.length > 5 ? '9' : state.length > 3 ? '10' : '12'}
                  fontFamily="monospace"
                  fontWeight="bold"
                >
                  {state}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};
