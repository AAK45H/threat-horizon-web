import { Handle, Position } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { useDashboard } from '../store/DashboardStore';

const PREFIX = { info: '[INFO]', warn: '[WARN]', error: '[ERR!]', success: '[ OK ]', default: '[LOG] ' };

export default function SystemLogNode() {
  const { state, clearLog } = useDashboard();
  const { logs } = state;
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [logs.length]);

  return (
    <div className="node-wrapper glow-cyan log-node">
      <Handle type="target" position={Position.Left} id="log-in" />
      <div className="node-header">
        <span className="node-title cyan"><span className="icon">◉</span> SYSTEM LOG</span>
        <button className="log-clear-btn" onClick={clearLog}>CLEAR</button>
      </div>
      <div className="node-body">
        <div className="log-entries">
          {logs.slice(-80).map((e, i) => (
            <div key={i} className="log-entry">
              <span className="log-time">{e.time}</span>
              <span className={`log-level ${e.level}`}>{PREFIX[e.level] || '[LOG] '}</span>
              <span className="log-message">{e.message}</span>
            </div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
