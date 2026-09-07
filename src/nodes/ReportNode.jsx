import { Handle, Position } from '@xyflow/react';
import { useDashboard } from '../store/DashboardStore';
import { REMEDIATION_PLAYBOOKS } from '../data/threatData';

export default function ReportNode() {
  const { state, handleReport, closeReport } = useDashboard();
  const {
    email, threatLevel, totalScans, breachesFound, darkwebAlerts,
    safeEmails, iocHits, activeThreats, showReport, reportContent,
  } = state;

  const playbook = REMEDIATION_PLAYBOOKS[threatLevel] || REMEDIATION_PLAYBOOKS.SAFE;

  return (
    <>
      <div className="node-wrapper glow-purple report-node">
        <Handle type="target" position={Position.Left} id="report-in" />
        <div className="node-header">
          <span className="node-title purple"><span className="icon">📋</span> SOC REPORT</span>
        </div>
        <div className="node-body">
          <button className="cyber-btn purple" style={{ width: '100%' }}
            onClick={() => handleReport(email, state)}>
            Generate Report
          </button>
          <div className="report-preview">
            {[
              ['Threat Level', threatLevel],
              ['Total Scans',  totalScans],
              ['Breaches',     breachesFound],
              ['DW Alerts',    darkwebAlerts],
              ['Safe Emails',  safeEmails],
              ['IOC Hits',     iocHits],
              ['Active Threats', activeThreats.length],
            ].map(([label, value]) => (
              <div key={label} className="report-preview-row">
                <span className="label">{label}</span>
                <span className="value">{value}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 8 }}>
            <div style={{ fontSize: '9px', color: 'var(--accent-purple)', letterSpacing: '1px', marginBottom: 4 }}>
              IR PLAYBOOK — {threatLevel}
            </div>
            {playbook.map((step, i) => (
              <div key={i} style={{ fontSize: '9px', color: 'var(--text-secondary)', padding: '2px 0' }}>
                {i + 1}. {step}
              </div>
            ))}
          </div>
        </div>
      </div>

      {showReport && (
        <div className="report-modal-overlay" onClick={closeReport}>
          <div className="report-modal" onClick={e => e.stopPropagation()}>
            <h2>⬡ SOC INTELLIGENCE REPORT</h2>
            <pre>{reportContent}</pre>
            <button className="cyber-btn cyan report-modal-close" onClick={closeReport}>
              Close Report
            </button>
          </div>
        </div>
      )}
    </>
  );
}
