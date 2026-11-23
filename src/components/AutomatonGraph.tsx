import React, { useState } from 'react';
import { DFA } from '../types/dfa';

interface AutomatonGraphProps {
  dfa: DFA;
  highlightedStates?: string[];
  activeState?: string;
  width?: number;
  height?: number;
  className?: string;
}

interface NodePosition {
  x: number;
  y: number;
}

export const AutomatonGraph: React.FC<AutomatonGraphProps> = ({
  dfa,
  highlightedStates = [],
  activeState: propActiveState,
  width = 380,
  height = 250,
  className = '',
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);

  const states = dfa.states;
  const startState = dfa.startState;
  const finalStates = dfa.finalStates;

  const currentFocus = selectedState || hoveredState || propActiveState;

  // Compute nice positions for states
  const positions: Record<string, NodePosition> = React.useMemo(() => {
    const pos: Record<string, NodePosition> = {};
    const n = states.length;

    if (n === 0) return pos;

    // Diamond/fork layout for 5-state DFA (A on left, B top, C bottom, D top-right, E bottom-right)
    if (n === 5 && states[0] === 'A' && states[1] === 'B' && states[2] === 'C') {
      pos[states[0]] = { x: 70, y: height / 2 };
      pos[states[1]] = { x: 175, y: height / 2 - 55 };
      pos[states[2]] = { x: 175, y: height / 2 + 55 };
      pos[states[3]] = { x: 295, y: height / 2 - 55 };
      pos[states[4]] = { x: 295, y: height / 2 + 55 };
      return pos;
    }

    if (n === 1) {
      pos[states[0]] = { x: width / 2, y: height / 2 };
      return pos;
    }

    if (n === 2) {
      pos[states[0]] = { x: width / 3, y: height / 2 };
      pos[states[1]] = { x: (2 * width) / 3, y: height / 2 };
      return pos;
    }

    if (n === 3) {
      pos[states[0]] = { x: 75, y: height / 2 };
      pos[states[1]] = { x: width / 2 + 20, y: height / 2 - 50 };
      pos[states[2]] = { x: width / 2 + 20, y: height / 2 + 50 };
      return pos;
    }

    if (n === 4) {
      pos[states[0]] = { x: 70, y: height / 2 };
      pos[states[1]] = { x: 180, y: height / 2 - 50 };
      pos[states[2]] = { x: 180, y: height / 2 + 50 };
      pos[states[3]] = { x: 290, y: height / 2 };
      return pos;
    }

    // Default elliptical arrangement
    const centerX = width / 2 + 10;
    const centerY = height / 2;
    const radiusX = Math.min(width / 2 - 55, 140);
    const radiusY = Math.min(height / 2 - 45, 80);

    states.forEach((st, idx) => {
      const angle = Math.PI + (idx * 2 * Math.PI) / n;
      pos[st] = {
        x: centerX + radiusX * Math.cos(angle),
        y: centerY + radiusY * Math.sin(angle),
      };
    });

    return pos;
  }, [states, width, height]);

  // Aggregate transitions between pairs of states to combine symbols e.g. "0, 1"
  const edgeGroups = React.useMemo(() => {
    const map = new Map<string, { from: string; to: string; symbols: string[]; isSelfLoop: boolean }>();

    for (const fromState of states) {
      const fromTransitions = dfa.transitions[fromState] || {};
      for (const symbol of dfa.alphabet) {
        const toState = fromTransitions[symbol];
        if (!toState || !positions[toState] || !positions[fromState]) continue;

        const key = `${fromState}->${toState}`;
        if (!map.has(key)) {
          map.set(key, {
            from: fromState,
            to: toState,
            symbols: [symbol],
            isSelfLoop: fromState === toState,
          });
        } else {
          map.get(key)!.symbols.push(symbol);
        }
      }
    }

    return Array.from(map.values());
  }, [dfa, states, positions]);

  const nodeRadius = 22;

  return (
    <div className={`relative flex items-center justify-center select-none ${className}`}>
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="w-full h-auto max-h-[290px] drop-shadow-sm overflow-visible"
      >
        <defs>
          {/* Arrowhead marker default */}
          <marker
            id="arrowhead-study"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2d3748" />
          </marker>

          {/* Animated Glowing Arrowhead Marker */}
          <marker
            id="arrowhead-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Start State Indicator Arrow */}
        {startState && positions[startState] && (
          <g>
            <line
              x1={positions[startState].x - 46}
              y1={positions[startState].y}
              x2={positions[startState].x - nodeRadius - 3}
              y2={positions[startState].y}
              stroke="#2d3748"
              strokeWidth="2.5"
              markerEnd="url(#arrowhead-study)"
            />
            <circle
              cx={positions[startState].x - 46}
              cy={positions[startState].y}
              r="2.5"
              fill="#d97706"
            />
          </g>
        )}

        {/* --- EDGES / TRANSITION ARROWS (WITH ANIMATED FLOW) --- */}
        {edgeGroups.map((edge) => {
          const fromPos = positions[edge.from];
          const toPos = positions[edge.to];
          if (!fromPos || !toPos) return null;

          const label = edge.symbols.join(',');
          const isEdgeActive = currentFocus === edge.from;

          // 1. Self Loop
          if (edge.isSelfLoop) {
            return (
              <g key={`${edge.from}-self`} className="group cursor-pointer">
                {/* Loop path */}
                <path
                  d={`M ${fromPos.x - 10} ${fromPos.y - nodeRadius + 3} C ${fromPos.x - 24} ${fromPos.y - nodeRadius - 34}, ${fromPos.x + 24} ${fromPos.y - nodeRadius - 34}, ${fromPos.x + 10} ${fromPos.y - nodeRadius + 3}`}
                  fill="none"
                  stroke={isEdgeActive ? '#2563eb' : '#334155'}
                  strokeWidth={isEdgeActive ? '2.5' : '2'}
                  markerEnd={isEdgeActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-study)'}
                  className="transition-colors duration-150"
                />

                <rect
                  x={fromPos.x - 12}
                  y={fromPos.y - nodeRadius - 36}
                  width="24"
                  height="16"
                  rx="4"
                  fill="#fffef9"
                  stroke={isEdgeActive ? '#93c5fd' : '#cbd5e1'}
                  strokeWidth="1"
                  className="transition-colors shadow-sm"
                />
                <text
                  x={fromPos.x}
                  y={fromPos.y - nodeRadius - 24}
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold ${
                    isEdgeActive ? 'fill-blue-700' : 'fill-slate-800'
                  }`}
                >
                  {label}
                </text>
              </g>
            );
          }

          // 2. Directed edge between two distinct nodes
          const dx = toPos.x - fromPos.x;
          const dy = toPos.y - fromPos.y;
          const dist = Math.hypot(dx, dy);
          if (dist === 0) return null;

          const ux = dx / dist;
          const uy = dy / dist;

          const hasReverseEdge = edgeGroups.some(
            (e) => e.from === edge.to && e.to === edge.from
          );

          let curveOffset = hasReverseEdge ? 24 : 12;
          const perpX = -uy * curveOffset;
          const perpY = ux * curveOffset;

          const midX = (fromPos.x + toPos.x) / 2 + perpX;
          const midY = (fromPos.y + toPos.y) / 2 + perpY;

          const startX = fromPos.x + ux * nodeRadius;
          const startY = fromPos.y + uy * nodeRadius;

          const endX = toPos.x - ux * (nodeRadius + 4);
          const endY = toPos.y - uy * (nodeRadius + 4);

          const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

          return (
            <g key={`${edge.from}->${edge.to}`} className="group cursor-pointer">
              {/* Base arrow line */}
              <path
                d={pathD}
                fill="none"
                stroke={isEdgeActive ? '#2563eb' : '#334155'}
                strokeWidth={isEdgeActive ? '2.5' : '2'}
                strokeLinecap="round"
                markerEnd={isEdgeActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-study)'}
                className="transition-colors duration-150"
              />

              {/* Edge Label Badge with clean styling */}
              <g
                transform={`translate(${midX}, ${midY})`}
                className="transition-transform duration-150 hover:scale-110"
              >
                <rect
                  x="-13"
                  y="-10"
                  width="26"
                  height="20"
                  rx="5"
                  fill="#fffef9"
                  stroke={isEdgeActive ? '#3b82f6' : '#dfcca8'}
                  strokeWidth={isEdgeActive ? '1.5' : '1'}
                  className="shadow-sm"
                />
                <text
                  x="0"
                  y="4"
                  textAnchor="middle"
                  className={`font-mono text-[11px] font-bold ${
                    isEdgeActive ? 'fill-blue-700' : 'fill-[#1e293b]'
                  }`}
                >
                  {label}
                </text>
              </g>
            </g>
          );
        })}

        {/* --- NODES / STATES --- */}
        {states.map((st) => {
          const pos = positions[st];
          if (!pos) return null;

          const isFinal = finalStates.includes(st);
          const isHighlighted =
            highlightedStates.includes(st) || propActiveState === st || currentFocus === st;

          return (
            <g
              key={st}
              onMouseEnter={() => setHoveredState(st)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(selectedState === st ? null : st)}
              className="cursor-pointer"
            >
              {/* Accepting State Radiant Sparkle Rays (Clean & Static like reference image) */}
              {isFinal && (
                <g opacity="0.9">
                  <line
                    x1={pos.x + nodeRadius + 3}
                    y1={pos.y - 10}
                    x2={pos.x + nodeRadius + 9}
                    y2={pos.y - 16}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={pos.x + nodeRadius + 5}
                    y1={pos.y}
                    x2={pos.x + nodeRadius + 13}
                    y2={pos.y}
                    stroke="#f59e0b"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={pos.x + nodeRadius + 3}
                    y1={pos.y + 10}
                    x2={pos.x + nodeRadius + 9}
                    y2={pos.y + 16}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Active State Outer Glowing Ring */}
              {isHighlighted && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 5}
                  fill="none"
                  stroke="#3b82f6"
                  strokeWidth="2"
                  opacity="0.8"
                />
              )}

              {/* Main State Circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={isFinal ? '#daf1e0' : '#dce4f7'}
                stroke={isFinal ? '#228646' : '#2e3b5e'}
                strokeWidth={isHighlighted ? '3' : '2.5'}
                className="transition-transform duration-150 hover:scale-105"
                style={{
                  transformOrigin: `${pos.x}px ${pos.y}px`,
                  filter: isHighlighted
                    ? 'drop-shadow(0 3px 8px rgba(59, 130, 246, 0.3))'
                    : 'drop-shadow(0 2px 4px rgba(0,0,0,0.08))',
                }}
              />

              {/* Inner Circle for Accepting / Final States */}
              {isFinal && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius - 5}
                  fill="none"
                  stroke="#228646"
                  strokeWidth="2"
                  className="transition-all duration-200"
                  style={{
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                  }}
                />
              )}

              {/* State Label Text */}
              <text
                x={pos.x}
                y={pos.y + 5}
                textAnchor="middle"
                className={`font-mono font-bold text-sm pointer-events-none ${
                  isFinal ? 'fill-[#166534]' : 'fill-[#1e293b]'
                }`}
              >
                {st}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
};
