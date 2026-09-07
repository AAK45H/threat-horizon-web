import { Handle, Position } from '@xyflow/react';
import { useDashboard } from '../store/DashboardStore';
import { THREAT_LEVELS } from '../data/threatData';

export default function ScanThreatsNode() {
  const { state } = useDashboard();
  const { scanning, scanPhase, scanProgress, scanResult } = state;
  const levelConfig = scanResult ? THREAT_LEVELS[scanResult] : null;

  return (
    <div className="node-wrapper glow-cyan scan-node">
      <Handle type="target" position={Position.Left} id="scan-in" />
      <div className="node-header">
        <span className="node-title cyan"><span className="icon">🔍</span> SCAN THREATS</span>
        {scanning && <span className="node-badge live">SCANNING</span>}
      </div>
      <div className="node-body">
        {scanning && (
          <>
            <div className="scan-phase"><span className="spinner" />{scanPhase}</div>
            <div className="scan-progress">
              <div className="scan-progress-fill" style={{ width: `${scanProgress}%` }} />
            </div>
          </>
        )}
        {scanResult && !scanning && (
          <div className="scan-result">
            <div className="scan-result-level" style={{ color: levelConfig?.color }}>
              ● {scanResult}
            </div>
            <div className="scan-result-detail">
              Risk Score: {levelConfig?.risk ?? 0}%<br />
              Assessment based on email domain analysis,<br />
              breach history &amp; threat intelligence feeds.
            </div>
          </div>
        )}
        {!scanResult && !scanning && (
          <div className="node-placeholder">Awaiting scan input…</div>
        )}
      </div>
    </div>
  );
}
