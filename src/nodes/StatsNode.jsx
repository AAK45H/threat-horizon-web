import { Handle, Position } from '@xyflow/react';
import { useDashboard } from '../store/DashboardStore';

export default function StatsNode() {
  const { state } = useDashboard();
  const { totalScans, breachesFound, darkwebAlerts, safeEmails, uptime, activeThreats } = state;

  const cards = [
    { label: 'TOTAL SCANS',    color: 'cyan',   value: totalScans },
    { label: 'BREACHES FOUND', color: 'red',    value: breachesFound },
    { label: 'DARK WEB ALERTS',color: 'orange', value: darkwebAlerts },
    { label: 'SAFE EMAILS',    color: 'green',  value: safeEmails },
    { label: 'UPTIME',         color: 'purple', value: uptime },
    { label: 'THREATS TODAY',  color: 'yellow', value: activeThreats.length },
  ];

  return (
    <div className="node-wrapper glow-cyan stats-node">
      <Handle type="target" position={Position.Left} id="stats-in" />
      <div className="node-header">
        <span className="node-title cyan"><span className="icon">◉</span> STATISTICS</span>
      </div>
      <div className="node-body">
        {cards.map((c, i) => (
          <div key={i} className="stat-card">
            <span className="stat-label">{c.label}</span>
            <span className={`stat-value ${c.color}`}>{c.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
