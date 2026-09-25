import { useState, useRef, useEffect } from "react";
import {
  Globe,
  ArrowRightLeft,
  MousePointerClick,
  Send,
  Server,
  Gauge,
  Bug,
  AlertCircle,
  WifiOff,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import TimelineEventDetail from "./TimelineEventDetail";
import "./TimelineEventItem.css";

export default function TimelineEventItem({ event, isTarget = false }) {
  const [expanded, setExpanded] = useState(() => Boolean(isTarget));
  const itemRef = useRef(null);
  const detailId = `event-details-${String(event.eventId).replace(/[^a-zA-Z0-9_-]/g, "-")}`;

  useEffect(() => {
    if (isTarget && itemRef.current) {
      const timer = setTimeout(() => {
        itemRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 150);
      return () => clearTimeout(timer);
    }
  }, [isTarget]);

  const getEventIcon = (type) => {
    switch (type) {
      case "page_load":
        return <Globe size={14} />;
      case "navigation":
        return <ArrowRightLeft size={14} />;
      case "user_action":
        return <MousePointerClick size={14} />;
      case "api_request":
        return <Send size={14} />;
      case "api_response":
        return <Server size={14} />;
      case "performance":
        return <Gauge size={14} />;
      case "javascript_error":
        return <Bug size={14} />;
      case "console_error":
        return <AlertCircle size={14} />;
      case "network_error":
        return <WifiOff size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  const isSlow = event.duration && event.duration >= 2000;
  const isError = event.severity === "error" || event.eventType.includes("error");
  const isWarning = event.severity === "warning" || isSlow;

  let nodeVariant = "neutral";
  if (isError) nodeVariant = "danger";
  else if (isWarning) nodeVariant = "warning";
  else if (event.eventType === "api_request" || event.eventType === "api_response") nodeVariant = "info";

  return (
    <div
      ref={itemRef}
      className={`ws-timeline-item ws-timeline-item--${nodeVariant} ${
        isTarget ? "ws-timeline-item--target-highlight" : ""
      }`}
    >
      <div className="ws-timeline-item__axis">
        <div className={`ws-timeline-item__node ws-timeline-item__node--${nodeVariant}`}>
          {getEventIcon(event.eventType)}
        </div>
        <div className="ws-timeline-item__line" />
      </div>

      <div className="ws-timeline-item__body">
        <div className="ws-timeline-item__card">
          <div className="ws-timeline-item__header">
            <div className="ws-timeline-item__title-group">
              <span className="ws-timeline-item__time ws-mono">{event.relativeTime || event.timestamp}</span>
              <span className="ws-timeline-item__title">{event.title}</span>
              {event.route && <code className="ws-page-path">{event.route}</code>}
            </div>

            <div className="ws-timeline-item__badge-group">
              {isTarget && <span className="ws-target-event-badge">Deep Linked</span>}
              {isSlow && (
                <span className="ws-highlight-badge ws-highlight-badge--warning">
                  {(event.duration / 1000).toFixed(2)}s
                </span>
              )}
              {isWarning && !isSlow && (
                <span className="ws-highlight-badge ws-highlight-badge--warning">Warning</span>
              )}
              {isError && (
                <span className="ws-highlight-badge ws-highlight-badge--danger">
                  Error
                </span>
              )}
              <button
                type="button"
                className="ws-timeline-item__toggle-btn"
                aria-label={`${expanded ? "Collapse" : "Expand"} details for ${event.title}`}
                aria-expanded={expanded}
                aria-controls={detailId}
                onClick={() => setExpanded((value) => !value)}
              >
                {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            </div>
          </div>

          <p className="ws-timeline-item__description">{event.description}</p>
        </div>

        <div id={detailId} hidden={!expanded}>
          {expanded && <TimelineEventDetail event={event} />}
        </div>
      </div>
    </div>
  );
}
