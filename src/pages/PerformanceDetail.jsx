import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Gauge,
  ChevronRight,
  Clock,
  Globe,
  Activity,
  Plus,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import ErrorState from "../components/ui/ErrorState";
import LoadingState from "../components/ui/LoadingState";
import EmptyState from "../components/ui/EmptyState";
import useAsyncData from "../hooks/useAsyncData";
import Button from "../components/ui/Button";
import {
  getPerformanceEventById,
  getSessionsAffectedByPerformanceEvent,
} from "../services/sessionService";
import { formatSessionTime, formatDuration } from "../utils/sessionMetrics";
import "./PerformanceDetail.css";

export default function PerformanceDetail() {
  const { perfId } = useParams();
  const result = useAsyncData(async () => Promise.all([
    getPerformanceEventById(perfId), getSessionsAffectedByPerformanceEvent(perfId),
  ]).then(([perfItem, affectedOccurrences]) => ({ perfItem, affectedOccurrences })), [perfId]);
  if (result.loading) return <LoadingState label="Loading performance details…" />;
  if (result.error) return <ErrorState title="Performance details unavailable" description={result.error.message} onRetry={result.reload} />;
  const { perfItem, affectedOccurrences } = result.data;

  if (!perfItem) {
    return (
      <div className="ws-perf-detail-page">
        <Link to="/performance" className="ws-back-link">
          <ArrowLeft size={14} />
          Back to performance
        </Link>
        <ErrorState
          title="Performance Signal Not Found"
          description={`No recorded performance signal matched the ID "${perfId}".`}
        />
      </div>
    );
  }

  return (
    <div className="ws-perf-detail-page">
      <Link to="/performance" className="ws-back-link">
        <ArrowLeft size={14} />
        Back to performance
      </Link>

      <PageHeader
        title={`Performance Signal: ${perfItem.title}`}
        description="Detailed latency metrics, threshold comparison, and affected user sessions."
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <StatusBadge status={perfItem.duration >= 2000 ? "warning" : "info"} />
            <Button
              as={Link}
              to={`/investigations?create=true&perfId=${perfItem.perfId}`}
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
      <div className="ws-perf-meta-card">
        <div className="ws-perf-meta-card__header">
          <span className="ws-perf-meta-card__title">{perfItem.title}</span>
          <StatusBadge status={perfItem.duration >= 2000 ? "warning" : "info"} />
        </div>

        <div className="ws-session-meta-grid">
          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Activity size={12} /> Operation Type
            </span>
            <span className="ws-meta-item__value">{perfItem.type}</span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Clock size={12} /> Max Duration
            </span>
            <span className="ws-meta-item__value ws-mono ws-text-warning">
              {formatDuration(Math.round(perfItem.duration / 1000))} ({(perfItem.duration / 1000).toFixed(2)}s)
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Gauge size={12} /> Threshold
            </span>
            <span className="ws-meta-item__value ws-mono">{perfItem.threshold}</span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Globe size={12} /> Route
            </span>
            <span className="ws-meta-item__value">
              <code className="ws-page-path">{perfItem.route}</code>
            </span>
          </div>
        </div>

        {perfItem.description && (
          <div className="ws-detail-field ws-detail-field--full">
            <span className="ws-detail-label">Signal Description</span>
            <div className="ws-detail-code">{perfItem.description}</div>
          </div>
        )}
      </div>

      {/* Affected Sessions Table */}
      <div className="ws-occurrences-section">
        <h2 className="ws-occurrences-section__title">
          <Gauge size={16} />
          Affected Sessions & Occurrences ({affectedOccurrences.length})
        </h2>

        {!affectedOccurrences.length ? <EmptyState icon={Gauge} title="No linked sessions" description="No event records are currently linked to this performance signal." /> : <div className="ws-session-table-wrapper" role="region" tabIndex={0} aria-label="Affected sessions table">
          <table className="ws-session-table">
            <thead>
              <tr>
                <th scope="col">Session ID</th>
                <th scope="col">Timestamp</th>
                <th scope="col">Route</th>
                <th scope="col">Captured Duration</th>
                <th scope="col">Client Environment</th>
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
                  <td className="ws-mono ws-text-warning">
                    {occ.duration ? `${(occ.duration / 1000).toFixed(2)}s` : "N/A"}
                  </td>
                  <td>
                    <span className="ws-session-table__subtext">
                      {occ.browser} ({occ.operatingSystem} / {occ.device})
                    </span>
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
