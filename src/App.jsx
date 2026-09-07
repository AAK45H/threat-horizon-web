import {
  ReactFlow, Controls, Background, BackgroundVariant,
  useNodesState, useEdgesState,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { DashboardProvider, useDashboard } from './store/DashboardStore';
import { THEME, THREAT_LEVELS } from './data/threatData';

import EmailInputNode  from './nodes/EmailInputNode';
import ScanThreatsNode from './nodes/ScanThreatsNode';
import BreachCheckNode from './nodes/BreachCheckNode';
import DarkWebNode     from './nodes/DarkWebNode';
import ThreatMapNode   from './nodes/ThreatMapNode';
import StatsNode       from './nodes/StatsNode';
import NetworkNode     from './nodes/NetworkNode';
import SystemLogNode   from './nodes/SystemLogNode';
import ThreatFeedNode  from './nodes/ThreatFeedNode';
import ReportNode      from './nodes/ReportNode';

// ── Node type registry ──────────────────────────────────────────────────────
const nodeTypes = {
  emailInput:  EmailInputNode,
  scanThreats: ScanThreatsNode,
  breachCheck: BreachCheckNode,
  darkWeb:     DarkWebNode,
  threatMap:   ThreatMapNode,
  stats:       StatsNode,
  network:     NetworkNode,
  systemLog:   SystemLogNode,
  threatFeed:  ThreatFeedNode,
  report:      ReportNode,
};

// ── Initial nodes ──────────────────────────────────────────────────────────
const INIT_NODES = [
  { id: 'email',   type: 'emailInput',  position: { x: 30,   y: 60  }, data: {} },
  { id: 'scan',    type: 'scanThreats', position: { x: 400,  y: 10  }, data: {} },
  { id: 'breach',  type: 'breachCheck', position: { x: 400,  y: 280 }, data: {} },
  { id: 'darkweb', type: 'darkWeb',     position: { x: 400,  y: 580 }, data: {} },
  { id: 'map',     type: 'threatMap',   position: { x: 750,  y: 10  }, data: {} },
  { id: 'stats',   type: 'stats',       position: { x: 1320, y: 10  }, data: {} },
  { id: 'network', type: 'network',     position: { x: 750,  y: 430 }, data: {} },
  { id: 'log',     type: 'systemLog',   position: { x: 750,  y: 610 }, data: {} },
  { id: 'feed',    type: 'threatFeed',  position: { x: 1090, y: 410 }, data: {} },
  { id: 'report',  type: 'report',      position: { x: 1320, y: 490 }, data: {} },
];

const INIT_EDGES = [
  { id: 'e1', source: 'email',   target: 'scan',    animated: true, style: { stroke: THEME.accent_cyan } },
  { id: 'e2', source: 'email',   target: 'breach',  animated: true, style: { stroke: THEME.accent_red } },
  { id: 'e3', source: 'email',   target: 'darkweb', animated: true, style: { stroke: THEME.accent_orange } },
  { id: 'e4', source: 'map',     target: 'feed',    animated: true, style: { stroke: THEME.accent_orange } },
  { id: 'e5', source: 'network', target: 'log',     animated: true, style: { stroke: THEME.accent_green } },
  { id: 'e6', source: 'scan',    target: 'stats',   animated: true, style: { stroke: THEME.accent_cyan } },
  { id: 'e7', source: 'breach',  target: 'report',  animated: true, style: { stroke: THEME.accent_purple } },
];

// ── Inner canvas (must be inside DashboardProvider) ────────────────────────
function FlowCanvas() {
  const { state, closeReport } = useDashboard();
  const { clock, threatLevel, showReport, reportContent } = state;
  const [nodes, , onNodesChange] = useNodesState(INIT_NODES);
  const [edges, , onEdgesChange] = useEdgesState(INIT_EDGES);

  const levelConfig = THREAT_LEVELS[threatLevel] || THREAT_LEVELS.SAFE;

  return (
    <div className="app-container">
      {/* Header */}
      <header className="header">
        <div className="header-left">
          <span className="header-logo">
            <span className="shield-icon">⬡</span> THREATHORIZON
          </span>
          <span className="header-subtitle">THREAT INTELLIGENCE</span>
        </div>
        <div className="header-right">
          <div className={`threat-badge ${threatLevel.toLowerCase()}`}>● {threatLevel}</div>
          <div className="risk-meter">
            <span className="risk-meter-label">Risk</span>
            <div className="risk-bar-track">
              <div className="risk-bar-fill"
                style={{ width: `${levelConfig.risk}%`, background: levelConfig.color }} />
            </div>
            <span className="risk-pct" style={{ color: levelConfig.color }}>{levelConfig.risk}%</span>
          </div>
          <div className="header-clock">{clock}</div>
        </div>
      </header>

      {/* React Flow canvas */}
      <div style={{ flex: 1 }}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          nodeTypes={nodeTypes}
          fitView
          fitViewOptions={{ padding: 0.08, maxZoom: 0.9 }}
          minZoom={0.2}
          maxZoom={2}
          proOptions={{ hideAttribution: true }}
          defaultEdgeOptions={{ type: 'smoothstep' }}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={THEME.grid_line} />
          <Controls showInteractive={false} position="bottom-left" />
        </ReactFlow>
      </div>

      {/* Footer */}
      <footer className="footer">
        <span>⬡ ThreatHorizon v2.0 | Threat Intelligence Platform</span>
        <div className="footer-status">
          <span className="status-dot" />Connected
        </div>
      </footer>

      {/* Report modal (outside flow so z-index works) */}
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
    </div>
  );
}

// ── Root export ─────────────────────────────────────────────────────────────
export default function App() {
  return (
    <DashboardProvider>
      <FlowCanvas />
    </DashboardProvider>
  );
}
