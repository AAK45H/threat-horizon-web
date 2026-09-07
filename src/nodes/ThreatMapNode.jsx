import { Handle, Position } from '@xyflow/react';
import { useMemo } from 'react';
import { useDashboard } from '../store/DashboardStore';

const W = 490, H = 250;

// Simplified continent blobs for visual effect
const CONTINENTS = [
  "M55,65 L100,52 L130,50 L138,60 L142,78 L130,92 L108,100 L88,98 L68,90 Z",   // N.America
  "M95,112 L118,108 L124,122 L120,145 L114,162 L106,168 L96,162 L90,148 L92,130 Z", // S.America
  "M200,50 L232,44 L245,54 L248,68 L238,78 L220,80 L208,72 L203,60 Z",            // Europe
  "M208,88 L230,82 L242,90 L245,108 L241,125 L232,138 L218,140 L208,132 L205,114 Z", // Africa
  "M250,42 L300,30 L340,34 L360,46 L365,65 L350,82 L318,88 L285,85 L260,78 L250,60 Z", // Asia
  "M320,128 L348,122 L362,130 L364,144 L354,154 L336,156 L322,148 L318,136 Z",    // Australia
];

function latLon(lat, lon) {
  return { x: ((lon + 180) / 360) * W, y: ((90 - lat) / 180) * H };
}

export default function ThreatMapNode() {
  const { state } = useDashboard();
  const { threatDots, feedEntries } = state;

  const gridLines = useMemo(() => {
    const lines = [];
    for (let x = 0; x <= W; x += 30)
      lines.push(<line key={`v${x}`} x1={x} y1={0} x2={x} y2={H} stroke="#0a1520" strokeWidth={0.5} />);
    for (let y = 0; y <= H; y += 30)
      lines.push(<line key={`h${y}`} x1={0} y1={y} x2={W} y2={y} stroke="#0a1520" strokeWidth={0.5} />);
    return lines;
  }, []);

  return (
    <div className="node-wrapper glow-cyan threat-map-node">
      <Handle type="source" position={Position.Right} id="map-out" />
      <div className="node-header">
        <span className="node-title cyan"><span className="icon">◉</span> GLOBAL THREAT MAP</span>
        <span className="node-badge live">LIVE</span>
      </div>
      <div className="node-body">
        <div className="threat-map-canvas">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%">
            {gridLines}
            <line x1={0} y1={H/2} x2={W} y2={H/2} stroke="#2a3a50" strokeWidth={0.5} strokeDasharray="4 4" />
            <line x1={W/2} y1={0} x2={W/2} y2={H} stroke="#2a3a50" strokeWidth={0.5} strokeDasharray="4 4" />
            {CONTINENTS.map((d, i) => (
              <path key={i} d={d} fill="rgba(0,240,255,0.04)" stroke="rgba(0,240,255,0.15)" strokeWidth={0.8} />
            ))}
            {threatDots.map((dot, i) => {
              const { x, y } = latLon(dot.lat, dot.lon);
              const r = dot.radius || 8;
              return (
                <g key={i}>
                  <circle cx={x} cy={y} r={r} fill="none" stroke={dot.color} strokeWidth={1} opacity={0.5}>
                    <animate attributeName="r" from={r} to={r + 8} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" from="0.5" to="0" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={x} cy={y} r={Math.max(2, r / 3)} fill={dot.color} />
                  <text x={x} y={y - r - 4} textAnchor="middle" fill={dot.color} fontSize={7} fontFamily="JetBrains Mono,monospace">
                    {dot.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
        <div className="threat-feed">
          {feedEntries.length > 0
            ? feedEntries.slice(-8).map((e, i) => (
                <div key={i}>[{e.time}] {e.severity} | {e.country} | {e.attack} | {e.tid} | {e.killChain}</div>
              ))
            : <span style={{ color: 'var(--text-secondary)' }}>Awaiting threat data…</span>
          }
        </div>
      </div>
    </div>
  );
}
