import React, { useState } from 'react';
import { DFA } from '../types/dfa';
import { Eye, EyeOff } from 'lucide-react';

interface AutomatonGraphProps {
  dfa: DFA;
  highlightedStates?: string[];
  activeState?: string;
  activeTransition?: { from: string; to: string } | null;
  isAcceptedEnd?: boolean;
  isRejectedEnd?: boolean;
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
  activeTransition,
  isAcceptedEnd = false,
  isRejectedEnd = false,
  width = 380,
  height = 250,
  className = '',
}) => {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [selectedState, setSelectedState] = useState<string | null>(null);
  const [filterEdgesToFocus, setFilterEdgesToFocus] = useState<boolean>(dfa.states.length > 12);

  const states = dfa.states;
  const startState = dfa.startState;
  const finalStates = dfa.finalStates;

  const currentFocus = selectedState || hoveredState || propActiveState;

  // Adapt dimensions for large state counts (up to 30 states)
  const isLargeSet = states.length > 12;
  const effectiveWidth = isLargeSet ? Math.max(width, 420) : width;
  const effectiveHeight = isLargeSet ? Math.max(height, 280) : height;

  // Compute nice positions for states up to 30 states
  const positions: Record<string, NodePosition> = React.useMemo(() => {
    const pos: Record<string, NodePosition> = {};
    const n = states.length;

    if (n === 0) return pos;

    // 5-state diamond/fork layout
    if (n === 5 && states[0] === 'A' && states[1] === 'B' && states[2] === 'C') {
      pos[states[0]] = { x: 70, y: effectiveHeight / 2 };
      pos[states[1]] = { x: 175, y: effectiveHeight / 2 - 55 };
      pos[states[2]] = { x: 175, y: effectiveHeight / 2 + 55 };
      pos[states[3]] = { x: 295, y: effectiveHeight / 2 - 55 };
      pos[states[4]] = { x: 295, y: effectiveHeight / 2 + 55 };
      return pos;
    }

    if (n === 1) {
      pos[states[0]] = { x: effectiveWidth / 2, y: effectiveHeight / 2 };
      return pos;
    }

    if (n === 2) {
      pos[states[0]] = { x: effectiveWidth / 3, y: effectiveHeight / 2 };
      pos[states[1]] = { x: (2 * effectiveWidth) / 3, y: effectiveHeight / 2 };
      return pos;
    }

    if (n === 3) {
      pos[states[0]] = { x: 75, y: effectiveHeight / 2 };
      pos[states[1]] = { x: effectiveWidth / 2 + 20, y: effectiveHeight / 2 - 50 };
      pos[states[2]] = { x: effectiveWidth / 2 + 20, y: effectiveHeight / 2 + 50 };
      return pos;
    }

    if (n === 4) {
      pos[states[0]] = { x: 70, y: effectiveHeight / 2 };
      pos[states[1]] = { x: 180, y: effectiveHeight / 2 - 50 };
      pos[states[2]] = { x: 180, y: effectiveHeight / 2 + 50 };
      pos[states[3]] = { x: 290, y: effectiveHeight / 2 };
      return pos;
    }

    // Concentric dual-ring layout for 11 to 30 states
    if (n > 10) {
      const centerX = effectiveWidth / 2;
      const centerY = effectiveHeight / 2;
      const innerCount = Math.floor(n / 3);
      const outerCount = n - innerCount;

      const innerRadiusX = Math.min(effectiveWidth * 0.22, 75);
      const innerRadiusY = Math.min(effectiveHeight * 0.24, 55);

      const outerRadiusX = Math.min(effectiveWidth / 2 - 45, 175);
      const outerRadiusY = Math.min(effectiveHeight / 2 - 38, 105);

      // Outer ring (starts at PI so start state is on left)
      for (let i = 0; i < outerCount; i++) {
        const angle = Math.PI + (i * 2 * Math.PI) / outerCount;
        pos[states[i]] = {
          x: centerX + outerRadiusX * Math.cos(angle),
          y: centerY + outerRadiusY * Math.sin(angle),
        };
      }

      // Inner ring
      for (let j = 0; j < innerCount; j++) {
        const angle = Math.PI + (j * 2 * Math.PI) / innerCount;
        pos[states[outerCount + j]] = {
          x: centerX + innerRadiusX * Math.cos(angle),
          y: centerY + innerRadiusY * Math.sin(angle),
        };
      }

      return pos;
    }

    // Default single elliptical ring for 5 to 10 states
    const centerX = effectiveWidth / 2 + 10;
    const centerY = effectiveHeight / 2;
    const radiusX = Math.min(effectiveWidth / 2 - 55, 140);
    const radiusY = Math.min(effectiveHeight / 2 - 45, 80);

    states.forEach((st, idx) => {
      const angle = Math.PI + (idx * 2 * Math.PI) / n;
      pos[st] = {
        x: centerX + radiusX * Math.cos(angle),
        y: centerY + radiusY * Math.sin(angle),
      };
    });

    return pos;
  }, [states, effectiveWidth, effectiveHeight]);

  // Scaled node radius
  const hasLongLabels = states.some((s) => s.length > 3);
  const nodeRadius = states.length > 15 ? 14 : hasLongLabels ? 25 : 22;

  // Aggregate transitions
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

  return (
    <div className={`relative flex flex-col items-center justify-center select-none ${className}`}>
      {/* Large Graph Density Controls (>12 states) */}
      {isLargeSet && (
        <div className="absolute top-1 right-1 z-10 flex items-center gap-1.5 bg-white/90 backdrop-blur-sm px-2 py-0.5 rounded-lg border border-stone-200 text-[10px] text-stone-600 shadow-sm">
          <span>{states.length} states</span>
          <span className="text-stone-300">|</span>
          <button
            type="button"
            onClick={() => setFilterEdgesToFocus(!filterEdgesToFocus)}
            className="flex items-center gap-1 text-amber-900 font-semibold hover:underline"
          >
            {filterEdgesToFocus ? (
              <>
                <Eye className="w-3 h-3 text-amber-700" />
                <span>Focused Edges</span>
              </>
            ) : (
              <>
                <EyeOff className="w-3 h-3 text-stone-400" />
                <span>All Edges</span>
              </>
            )}
          </button>
        </div>
      )}

      <svg
        viewBox={`0 0 ${effectiveWidth} ${effectiveHeight}`}
        className="w-full h-auto max-h-[310px] drop-shadow-sm overflow-visible"
      >
        <defs>
          <marker
            id="arrowhead-study"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="5.5"
            markerHeight="5.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2d3748" />
          </marker>

          <marker
            id="arrowhead-active"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="6.5"
            markerHeight="6.5"
            orient="auto-start-reverse"
          >
            <path d="M 0 1.5 L 9 5 L 0 8.5 z" fill="#2563eb" />
          </marker>
        </defs>

        {/* Start State Indicator Arrow */}
        {startState && positions[startState] && (
          <g>
            <line
              x1={positions[startState].x - 38}
              y1={positions[startState].y}
              x2={positions[startState].x - nodeRadius - 3}
              y2={positions[startState].y}
              stroke="#2d3748"
              strokeWidth="2.2"
              markerEnd="url(#arrowhead-study)"
            />
            <circle
              cx={positions[startState].x - 38}
              cy={positions[startState].y}
              r="2.5"
              fill="#d97706"
            />
          </g>
        )}

        {/* --- EDGES / TRANSITION ARROWS --- */}
        {edgeGroups.map((edge) => {
          const fromPos = positions[edge.from];
          const toPos = positions[edge.to];
          if (!fromPos || !toPos) return null;

          const label = edge.symbols.join(',');
          const isTraversed =
            activeTransition &&
            activeTransition.from === edge.from &&
            activeTransition.to === edge.to;
          const isEdgeActive = isTraversed || currentFocus === edge.from;

          // In dense graph mode (>=15 states), filter out edges if focus filter is enabled and edge is inactive
          if (isLargeSet && filterEdgesToFocus && currentFocus && !isEdgeActive) {
            return null;
          }

          // Inactive edge opacity for dense graphs
          const edgeOpacity = isLargeSet && !isEdgeActive ? 0.35 : 1;

          // 1. Self Loop
          if (edge.isSelfLoop) {
            return (
              <g key={`${edge.from}-self`} className="group cursor-pointer" opacity={edgeOpacity}>
                <path
                  d={`M ${fromPos.x - 8} ${fromPos.y - nodeRadius + 2} C ${fromPos.x - 20} ${fromPos.y - nodeRadius - 28}, ${fromPos.x + 20} ${fromPos.y - nodeRadius - 28}, ${fromPos.x + 8} ${fromPos.y - nodeRadius + 2}`}
                  fill="none"
                  stroke={isTraversed ? '#2563eb' : isEdgeActive ? '#3b82f6' : '#334155'}
                  strokeWidth={isTraversed ? '2.8' : isEdgeActive ? '2.2' : '1.6'}
                  markerEnd={isEdgeActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-study)'}
                  className="transition-colors duration-150"
                />

                <rect
                  x={fromPos.x - 11}
                  y={fromPos.y - nodeRadius - 28}
                  width="22"
                  height="14"
                  rx="3.5"
                  fill="#fffef9"
                  stroke={isTraversed ? '#2563eb' : isEdgeActive ? '#93c5fd' : '#cbd5e1'}
                  strokeWidth="1"
                  className="shadow-sm"
                />
                <text
                  x={fromPos.x}
                  y={fromPos.y - nodeRadius - 18}
                  textAnchor="middle"
                  className={`font-mono text-[9.5px] font-bold ${
                    isTraversed ? 'fill-blue-700' : isEdgeActive ? 'fill-blue-600' : 'fill-slate-800'
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

          let curveOffset = hasReverseEdge ? (isLargeSet ? 18 : 24) : (isLargeSet ? 8 : 12);
          const perpX = -uy * curveOffset;
          const perpY = ux * curveOffset;

          const midX = (fromPos.x + toPos.x) / 2 + perpX;
          const midY = (fromPos.y + toPos.y) / 2 + perpY;

          const startX = fromPos.x + ux * nodeRadius;
          const startY = fromPos.y + uy * nodeRadius;

          const endX = toPos.x - ux * (nodeRadius + 3.5);
          const endY = toPos.y - uy * (nodeRadius + 3.5);

          const pathD = `M ${startX} ${startY} Q ${midX} ${midY} ${endX} ${endY}`;

          return (
            <g key={`${edge.from}->${edge.to}`} className="group cursor-pointer" opacity={edgeOpacity}>
              <path
                d={pathD}
                fill="none"
                stroke={isTraversed ? '#2563eb' : isEdgeActive ? '#3b82f6' : '#334155'}
                strokeWidth={isTraversed ? '3' : isEdgeActive ? '2.2' : '1.6'}
                strokeLinecap="round"
                markerEnd={isEdgeActive ? 'url(#arrowhead-active)' : 'url(#arrowhead-study)'}
                className="transition-colors duration-150"
              />

              {/* Edge Label Badge (Hide if dense unless active to keep clean) */}
              {(!isLargeSet || isEdgeActive || !filterEdgesToFocus) && (
                <g
                  transform={`translate(${midX}, ${midY})`}
                  className="transition-transform duration-150 hover:scale-110"
                >
                  <rect
                    x="-10"
                    y="-8"
                    width="20"
                    height="16"
                    rx="4"
                    fill="#fffef9"
                    stroke={isTraversed ? '#2563eb' : isEdgeActive ? '#3b82f6' : '#dfcca8'}
                    strokeWidth={isTraversed ? '1.5' : '1'}
                    className="shadow-sm"
                  />
                  <text
                    x="0"
                    y="3"
                    textAnchor="middle"
                    className={`font-mono text-[9.5px] font-bold ${
                      isTraversed ? 'fill-blue-700 font-extrabold' : isEdgeActive ? 'fill-blue-600' : 'fill-[#1e293b]'
                    }`}
                  >
                    {label}
                  </text>
                </g>
              )}
            </g>
          );
        })}

        {/* --- NODES / STATES --- */}
        {states.map((st) => {
          const pos = positions[st];
          if (!pos) return null;

          const isFinal = finalStates.includes(st);
          const isActiveSimState = propActiveState === st;
          const isHighlighted =
            highlightedStates.includes(st) || isActiveSimState || currentFocus === st;

          let stateFill = isFinal ? '#daf1e0' : '#dce4f7';
          let stateBorder = isFinal ? '#228646' : '#2e3b5e';
          let ringColor = '#3b82f6';

          if (isActiveSimState) {
            if (isAcceptedEnd) {
              stateFill = '#bbf7d0';
              stateBorder = '#16a34a';
              ringColor = '#16a34a';
            } else if (isRejectedEnd) {
              stateFill = '#fecaca';
              stateBorder = '#dc2626';
              ringColor = '#dc2626';
            } else {
              stateFill = '#bfdbfe';
              stateBorder = '#2563eb';
              ringColor = '#3b82f6';
            }
          }

          return (
            <g
              key={st}
              onMouseEnter={() => setHoveredState(st)}
              onMouseLeave={() => setHoveredState(null)}
              onClick={() => setSelectedState(selectedState === st ? null : st)}
              className="cursor-pointer"
            >
              {/* Accepting State Radiant Sparkle Rays */}
              {isFinal && (
                <g opacity="0.9">
                  <line
                    x1={pos.x + nodeRadius + 2}
                    y1={pos.y - 8}
                    x2={pos.x + nodeRadius + 7}
                    y2={pos.y - 13}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                  <line
                    x1={pos.x + nodeRadius + 4}
                    y1={pos.y}
                    x2={pos.x + nodeRadius + 10}
                    y2={pos.y}
                    stroke="#f59e0b"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <line
                    x1={pos.x + nodeRadius + 2}
                    y1={pos.y + 8}
                    x2={pos.x + nodeRadius + 7}
                    y2={pos.y + 13}
                    stroke="#f59e0b"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                  />
                </g>
              )}

              {/* Active Outer Ring */}
              {isHighlighted && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={nodeRadius + 4}
                  fill="none"
                  stroke={ringColor}
                  strokeWidth="2"
                  opacity="0.9"
                />
              )}

              {/* Main State Circle */}
              <circle
                cx={pos.x}
                cy={pos.y}
                r={nodeRadius}
                fill={stateFill}
                stroke={stateBorder}
                strokeWidth={isHighlighted ? '2.5' : '2'}
                className="transition-transform duration-150 hover:scale-105"
                style={{
                  transformOrigin: `${pos.x}px ${pos.y}px`,
                  filter: isHighlighted
                    ? `drop-shadow(0 2px 6px ${ringColor}44)`
                    : 'drop-shadow(0 1px 3px rgba(0,0,0,0.08))',
                }}
              />

              {/* Inner Circle for Accepting / Final States */}
              {isFinal && (
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={Math.max(nodeRadius - 4, 8)}
                  fill="none"
                  stroke={stateBorder}
                  strokeWidth="1.5"
                  className="transition-all duration-150"
                  style={{
                    transformOrigin: `${pos.x}px ${pos.y}px`,
                  }}
                />
              )}

              {/* State Label Text */}
              <text
                x={pos.x}
                y={pos.y + (st.length > 3 ? 3 : isLargeSet ? 3.5 : 4.5)}
                textAnchor="middle"
                className={`font-mono font-bold select-none pointer-events-none ${
                  isLargeSet ? 'text-[9px]' : st.length > 3 ? 'text-[10px]' : 'text-xs'
                } ${
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
