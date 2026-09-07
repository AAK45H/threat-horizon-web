import { Handle, Position } from '@xyflow/react';
import { useEffect, useRef } from 'react';
import { useDashboard } from '../store/DashboardStore';

export default function ThreatFeedNode() {
  const { state } = useDashboard();
  const { feedEntries } = state;
  const endRef = useRef(null);

  useEffect(() => { endRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [feedEntries.length]);

  return (
    <div className="node-wrapper glow-orange feed-node">
      <Handle type="target" position={Position.Left} id="feed-in" />
      <div className="node-header">
        <span className="node-title orange"><span className="icon">📡</span> THREAT FEED</span>
        <span className="node-badge live">LIVE</span>
      </div>
      <div className="node-body">
        <div className="feed-entries">
          {feedEntries.length > 0 ? feedEntries.slice(-50).map((e, i) => (
            <div key={i} className="feed-entry">
              <span className="feed-time">{e.time}</span>
              <span className={`feed-severity ${e.severity.toLowerCase()}`}>{e.severity}</span>
              <span className="feed-detail">{e.country} │ {e.attack}</span>
              <span className="feed-tag">{e.tid}</span>
              <span className="feed-tag">{e.killChain}</span>
            </div>
          )) : (
            <div className="node-placeholder">Awaiting threat data…</div>
          )}
          <div ref={endRef} />
        </div>
      </div>
    </div>
  );
}
