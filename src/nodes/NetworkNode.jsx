import { Handle, Position } from '@xyflow/react';
import { useMemo } from 'react';
import { useDashboard } from '../store/DashboardStore';

const W = 270, H = 60;

export default function NetworkNode() {
  const { state } = useDashboard();
  const { networkData, networkBaseline, networkAnomalies } = state;

  const bars = useMemo(() => {
    const d = networkData.slice(-60);
    if (!d.length) return [];
    const maxVal = Math.max(...d, 1);
    const bw = W / d.length;
    return d.map((val, i) => {
      const bh = (val / maxVal) * (H - 4);
      const color = val >= maxVal * 0.9 ? '#ff3355' : val >= maxVal * 0.7 ? '#ff8800' : '#00f0ff';
      return { x: i * bw, y: H - bh, w: Math.max(bw - 1, 1), h: bh, color };
    });
  }, [networkData]);

  return (
    <div className="node-wrapper glow-green network-node">
      <Handle type="source" position={Position.Right} id="net-out" />
      <div className="node-header">
        <span className="node-title green"><span className="icon">📊</span> NETWORK ACTIVITY</span>
        <span className="node-badge live">LIVE</span>
      </div>
      <div className="node-body">
        <div className="network-chart">
          <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" preserveAspectRatio="none">
            <line x1={0} y1={H - 1} x2={W} y2={H - 1} stroke="#1a2a3a" strokeWidth={0.5} />
            {bars.map((b, i) => (
              <rect key={i} x={b.x} y={b.y} width={b.w} height={b.h} fill={b.color} />
            ))}
          </svg>
        </div>
        <div className="network-meta">
          <span>EMA Baseline: {networkBaseline.toFixed(1)}</span>
          {networkAnomalies > 0 && (
            <span className="network-anomaly-badge">⚠ {networkAnomalies} anomalies</span>
          )}
        </div>
      </div>
    </div>
  );
}
