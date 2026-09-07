import { Handle, Position } from '@xyflow/react';
import { useDashboard } from '../store/DashboardStore';

export default function BreachCheckNode() {
  const { state } = useDashboard();
  const { checking, breachResult } = state;

  return (
    <div className="node-wrapper glow-red breach-node">
      <Handle type="target" position={Position.Left} id="breach-in" />
      <div className="node-header">
        <span className="node-title red"><span className="icon">🛡️</span> BREACH CHECK</span>
        {checking && <span className="node-badge live">CHECKING</span>}
      </div>
      <div className="node-body">
        {checking && (
          <div className="scan-phase"><span className="spinner" />Checking breach databases…</div>
        )}
        {breachResult && !checking && breachResult.found && (
          <div className="breach-result found">
            <div className="breach-company">⚠ {breachResult.company}</div>
            <div className="breach-meta">
              <strong>Year:</strong> {breachResult.year}<br />
              <strong>Severity:</strong> {breachResult.severity}<br />
              <strong>Records:</strong> {breachResult.records}
            </div>
            <div className="breach-section-title">Exposed Data</div>
            <div>{breachResult.dataTypes.map((dt, i) => <span key={i} className="breach-tag">{dt}</span>)}</div>
            <div className="breach-section-title">Remediation</div>
            {breachResult.mitigations.map((m, i) => (
              <div key={i} className="breach-mitigation">
                <span className="num">{i + 1}.</span>{m}
              </div>
            ))}
          </div>
        )}
        {breachResult && !checking && !breachResult.found && (
          <div className="breach-result clean">
            <div style={{ color: 'var(--accent-green)', fontWeight: 700, marginBottom: 4 }}>✓ All Clear</div>
            <div className="breach-meta">No known breaches found for this domain.<br />Credentials appear safe.</div>
          </div>
        )}
        {!breachResult && !checking && (
          <div className="node-placeholder">Awaiting email input…</div>
        )}
      </div>
    </div>
  );
}
