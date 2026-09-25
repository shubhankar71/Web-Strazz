import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  AlertTriangle,
  ChevronRight,
  Clock,
  Layers,
  Globe,
  Plus,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import useAsyncData from "../hooks/useAsyncData";
import Button from "../components/ui/Button";
import { getErrorById, getSessionsAffectedByError } from "../services/sessionService";
import { formatSessionTime } from "../utils/sessionMetrics";
import "./ErrorDetail.css";

export default function ErrorDetail() {
  const { errorId } = useParams();
  const result = useAsyncData(async () => Promise.all([
    getErrorById(errorId), getSessionsAffectedByError(errorId),
  ]).then(([errorItem, affectedOccurrences]) => ({ errorItem, affectedOccurrences })), [errorId]);
  if (result.loading) return <LoadingState label="Loading error details…" />;
  if (result.error) return <ErrorState title="Error details unavailable" description={result.error.message} onRetry={result.reload} />;
  const { errorItem, affectedOccurrences } = result.data;

  if (!errorItem) {
    return (
      <div className="ws-error-detail-page">
        <Link to="/errors" className="ws-back-link">
          <ArrowLeft size={14} />
          Back to errors
        </Link>
        <ErrorState
          title="Error Group Not Found"
          description={`No recorded error group matched the ID "${errorId}".`}
        />
      </div>
    );
  }

  return (
    <div className="ws-error-detail-page">
      <Link to="/errors" className="ws-back-link">
        <ArrowLeft size={14} />
        Back to errors
      </Link>

      <PageHeader
        title={`Error Group: ${errorItem.errorName}`}
        description="Detailed metadata, error payload, and affected user sessions."
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusBadge status={errorItem.severity} />
            <Button
              as={Link}
              to={`/investigations?create=true&errorId=${errorItem.errorId}`}
              variant="primary"
              size="sm"
              icon={Plus}
            >
              Create Investigation
            </Button>
          </div>
        }
      />

      {/* Metadata Card */}
      <div className="ws-error-meta-card">
        <div className="ws-error-meta-card__header">
          <span className="ws-error-meta-card__title">{errorItem.title}</span>
          <StatusBadge status={errorItem.severity} />
        </div>

        <div className="ws-session-meta-grid">
          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Layers size={12} /> Category / Type
            </span>
            <span className="ws-meta-item__value">{errorItem.type} Error</span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <AlertTriangle size={12} /> Total Occurrences
            </span>
            <span className="ws-meta-item__value ws-mono ws-text-danger">
              {errorItem.occurrences} {errorItem.occurrences === 1 ? "time" : "times"}
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Globe size={12} /> Primary Route
            </span>
            <span className="ws-meta-item__value">
              <code className="ws-page-path">{errorItem.route}</code>
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Clock size={12} /> First / Last Seen
            </span>
            <span className="ws-meta-item__value">
              {formatSessionTime(errorItem.firstSeen)} to {formatSessionTime(errorItem.lastSeen)}
            </span>
          </div>
        </div>

        {errorItem.message && (
          <div className="ws-detail-field ws-detail-field--full">
            <span className="ws-detail-label">Exception Message</span>
            <div className="ws-detail-error-box">{errorItem.message}</div>
          </div>
        )}

        {errorItem.sampleEvent?.technicalDetails?.stackTrace && (
          <div className="ws-detail-field ws-detail-field--full">
            <span className="ws-detail-label">Sample Stack Trace</span>
            <pre className="ws-detail-pre ws-detail-stack">
              {errorItem.sampleEvent.technicalDetails.stackTrace}
            </pre>
          </div>
        )}
      </div>

      {/* Affected Sessions Table */}
      <div className="ws-occurrences-section">
        <h2 className="ws-occurrences-section__title">
          <AlertTriangle size={16} />
          Affected Sessions & Occurrences ({affectedOccurrences.length})
        </h2>

        {!affectedOccurrences.length ? <EmptyState icon={AlertTriangle} title="No linked sessions" description="No event records are currently linked to this error group." /> : <div className="ws-session-table-wrapper" role="region" tabIndex={0} aria-label="Affected sessions table">
          <table className="ws-session-table">
            <thead>
              <tr>
                <th scope="col">Session ID</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Route</th>
                <th scope="col">Client Environment</th>
                <th scope="col">Status</th>
                <th scope="col" className="ws-text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {affectedOccurrences.map((occ) => (
                <tr key={`${occ.sessionId}_${occ.eventId}`}>
                  <td>
                    <Link
                      to={`/sessions/${occ.sessionId}?event=${occ.eventId}`}
                      className="ws-session-table__id-link"
                    >
                      {occ.sessionId}
                    </Link>
                  </td>
                  <td className="ws-session-table__time-col">
                    {formatSessionTime(occ.timestamp)}
                  </td>
                  <td>
                    <code className="ws-page-path">{occ.route}</code>
                  </td>
                  <td>
                    <span className="ws-session-table__subtext">
                      {occ.browser} ({occ.operatingSystem} / {occ.device})
                    </span>
                  </td>
                  <td>
                    <StatusBadge status={occ.sessionStatus} />
                  </td>
                  <td className="ws-text-right">
                    <Link
                      to={`/sessions/${occ.sessionId}?event=${occ.eventId}`}
                      className="ws-action-link"
                    >
                      <span>Inspect in Session</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>}
      </div>
    </div>
  );
}
