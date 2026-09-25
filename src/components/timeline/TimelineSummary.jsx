import { List, AlertTriangle, Send, Gauge } from "lucide-react";
import "./TimelineSummary.css";

export default function TimelineSummary({ summary }) {
  const { totalEvents = 0, errorCount = 0, apiCount = 0, perfCount = 0 } = summary || {};

  return (
    <div className="ws-timeline-summary">
      <div className="ws-timeline-summary__item">
        <List size={14} className="ws-timeline-summary__icon" aria-hidden="true" />
        <span className="ws-timeline-summary__label">Events</span>
        <span className="ws-timeline-summary__value ws-mono">{totalEvents}</span>
      </div>

      <div className="ws-timeline-summary__divider" />

      <div className={`ws-timeline-summary__item ${errorCount > 0 ? "ws-timeline-summary__item--danger" : ""}`}>
        <AlertTriangle size={14} className="ws-timeline-summary__icon" aria-hidden="true" />
        <span className="ws-timeline-summary__label">Errors</span>
        <span className="ws-timeline-summary__value ws-mono">{errorCount}</span>
      </div>

      <div className="ws-timeline-summary__divider" />

      <div className="ws-timeline-summary__item">
        <Send size={14} className="ws-timeline-summary__icon" aria-hidden="true" />
        <span className="ws-timeline-summary__label">API Requests</span>
        <span className="ws-timeline-summary__value ws-mono">{apiCount}</span>
      </div>

      <div className="ws-timeline-summary__divider" />

      <div className={`ws-timeline-summary__item ${perfCount > 0 ? "ws-timeline-summary__item--warning" : ""}`}>
        <Gauge size={14} className="ws-timeline-summary__icon" aria-hidden="true" />
        <span className="ws-timeline-summary__label">Performance Signals</span>
        <span className="ws-timeline-summary__value ws-mono">{perfCount}</span>
      </div>
    </div>
  );
}
