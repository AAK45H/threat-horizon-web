import { Handle, Position } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { useDashboard } from '../store/DashboardStore';

export default function DarkWebNode() {
  const { state } = useDashboard();
  const { darkWebLog } = state;
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [darkWebLog.length]);

  return (
    <div className="node-wrapper glow-orange darkweb-node">
      <Handle type="target" position={Position.Left} id="darkweb-in" />
      <div className="node-header">
        <span className="node-title orange"><span className="icon">🕸️</span> DARK WEB MONITOR</span>
      </div>
      <div className="node-body">
        <div className="darkweb-log">
          {darkWebLog.map((e, i) => (
            <div key={i} className={e.tag}>{e.text}</div>
          ))}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
