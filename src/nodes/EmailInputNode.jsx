import { Handle, Position } from '@xyflow/react';
import { useCallback } from 'react';
import { useDashboard } from '../store/DashboardStore';

export default function EmailInputNode() {
  const { state, setEmail, handleScan, handleBreach, handleDarkWeb, handleReport } = useDashboard();
  const { email } = state;

  const onScan    = useCallback(() => handleScan(email),    [email, handleScan]);
  const onBreach  = useCallback(() => handleBreach(email),  [email, handleBreach]);
  const onDarkWeb = useCallback(() => handleDarkWeb(email), [email, handleDarkWeb]);
  const onReport  = useCallback(() => handleReport(email, state), [email, state, handleReport]);

  return (
    <div className="node-wrapper glow-cyan email-input-node">
      <div className="node-header">
        <span className="node-title cyan"><span className="icon">🎯</span> TARGET INPUT</span>
      </div>
      <div className="node-body">
        <div className="email-input-label">Target Email Address</div>
        <input
          type="email"
          className="email-input-field"
          placeholder="user@example.com"
          value={email}
          onChange={e => setEmail(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && onScan()}
        />
        <div className="email-buttons">
          <button className="cyber-btn cyan"   onClick={onScan}>Scan Threats</button>
          <button className="cyber-btn red"    onClick={onBreach}>Breach Check</button>
          <button className="cyber-btn orange" onClick={onDarkWeb}>Dark Web</button>
          <button className="cyber-btn purple" onClick={onReport}>Report</button>
        </div>
      </div>
      <Handle type="source" position={Position.Right} id="email-out" />
    </div>
  );
}
