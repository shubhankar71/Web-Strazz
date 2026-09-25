import { Link } from "react-router-dom";
import { AlertCircle, AlertTriangle, Info } from "lucide-react";
import { formatSessionTime } from "../../utils/sessionMetrics";
import "./ActivityList.css";

export default function ActivityList({ activities = [] }) {
  if (!activities.length) {
    return <div className="ws-activity-empty">No recent developer activity recorded</div>;
  }

  const getIcon = (type) => {
    switch (type) {
      case "error":
        return <AlertCircle size={15} className="ws-activity-icon--error" />;
      case "warning":
        return <AlertTriangle size={15} className="ws-activity-icon--warning" />;
      case "info":
      default:
        return <Info size={15} className="ws-activity-icon--info" />;
    }
  };

  return (
    <div className="ws-activity-list">
      {activities.map((item) => (
        <div key={item.id} className="ws-activity-item">
          <div className="ws-activity-item__icon-wrapper">{getIcon(item.type)}</div>

          <div className="ws-activity-item__content">
            <div className="ws-activity-item__header">
              <span className="ws-activity-item__title">{item.title}</span>
              <span className="ws-activity-item__time">{formatSessionTime(item.timestamp)}</span>
            </div>

            <p className="ws-activity-item__message">{item.message}</p>

            <div className="ws-activity-item__meta">
              <Link to={`/sessions/${item.sessionId}`} className="ws-activity-item__session-link">
                {item.sessionId}
              </Link>
              {item.path && <code className="ws-activity-item__path">{item.path}</code>}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
