import { useState } from "react";
import { useParams, useSearchParams, Link } from "react-router-dom";
import {
  ArrowLeft,
  Activity,
  Clock,
  Globe,
  Laptop,
  AlertTriangle,
  ChevronRight,
  User,
  ShieldAlert,
  Search,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import ErrorState from "../components/ui/ErrorState";
import TimelineSummary from "../components/timeline/TimelineSummary";
import TimelineFilters from "../components/timeline/TimelineFilters";
import Timeline from "../components/timeline/Timeline";
import LoadingState from "../components/ui/LoadingState";
import useAsyncData from "../hooks/useAsyncData";
import {
  getSessionById,
  getSessionEvents,
  getSessionTimelineSummary,
  generateInvestigationSignal,
} from "../services/sessionService";
import { formatDuration, formatSessionTime } from "../utils/sessionMetrics";
import "./SessionDetail.css";

export default function SessionDetail() {
  const { sessionId } = useParams();
  const [searchParams] = useSearchParams();
  const targetEventId = searchParams.get("event");

  const [activeCategory, setActiveCategory] = useState("all");

  const detail = useAsyncData(async () => Promise.all([
    getSessionById(sessionId), getSessionTimelineSummary(sessionId),
    getSessionEvents(sessionId, activeCategory), generateInvestigationSignal(sessionId),
  ]).then(([session, summary, events, investigationSignal]) => ({ session, summary, events, investigationSignal })), [sessionId, activeCategory]);
  if (detail.loading) return <LoadingState label="Loading session timeline…" />;
  if (detail.error) return <ErrorState title="Session data unavailable" description={detail.error.message} onRetry={detail.reload} />;
  const { session, summary, events, investigationSignal } = detail.data;

  if (!session) {
    return (
      <div className="ws-session-detail">
        <Link to="/sessions" className="ws-back-link">
          <ArrowLeft size={14} />
          Back to sessions
        </Link>
        <ErrorState
          title="Session Not Found"
          description={`No recorded session matched the ID "${sessionId}". Please check the session ID or return to the sessions explorer.`}
        />
      </div>
    );
  }

  const isErrorSession = session.status === "error" || session.errorCount > 0;
  const isWarningSession = session.status === "warning";
  const missingTargetEvent = targetEventId && activeCategory === "all"
    && !events.some((event) => event.eventId === targetEventId);

  return (
    <div className="ws-session-detail">
      {/* A. Back Navigation */}
      <Link to="/sessions" className="ws-back-link">
        <ArrowLeft size={14} />
        Back to sessions
      </Link>

      {/* B. Session Header */}
      <PageHeader
        title={`Session Investigation: ${session.sessionId}`}
        description="Chronological record of user actions, application events, network activity, and errors captured during this session."
        actions={<StatusBadge status={session.status} />}
      />

      {/* Metadata Overview Card */}
      <div className="ws-session-meta-card">
        <div className="ws-session-meta-card__header">
          <div className="ws-session-meta-card__id-group">
            <span className="ws-session-meta-card__id">{session.sessionId}</span>
            <StatusBadge status={session.status} />
          </div>
          <span className="ws-session-table__subtext">
            Started {formatSessionTime(session.startedAt)} ({new Date(session.startedAt).toLocaleString()})
          </span>
        </div>

        <div className="ws-session-meta-grid">
          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Clock size={12} /> Duration
            </span>
            <span className="ws-meta-item__value ws-mono">
              {formatDuration(session.duration)}
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Activity size={12} /> Total Events
            </span>
            <span className="ws-meta-item__value ws-mono">{session.eventCount}</span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <AlertTriangle size={12} /> Errors Captured
            </span>
            <span className="ws-meta-item__value">
              {session.errorCount > 0 ? (
                <span className="ws-error-tag">{session.errorCount} error(s)</span>
              ) : (
                <span className="ws-error-none">0</span>
              )}
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Globe size={12} /> Browser
            </span>
            <span className="ws-meta-item__value">
              {session.browser} {session.browserVersion}
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <Laptop size={12} /> Environment
            </span>
            <span className="ws-meta-item__value">
              {session.device} / {session.operatingSystem}
            </span>
          </div>

          <div className="ws-meta-item">
            <span className="ws-meta-item__label">
              <User size={12} /> Last Page
            </span>
            <span className="ws-meta-item__value">
              <code className="ws-page-path">{session.lastPage}</code>
            </span>
          </div>
        </div>

        {session.userFlow && session.userFlow.length > 0 && (
          <div className="ws-user-flow">
            <span className="ws-user-flow__title">Recorded User Navigation Path:</span>
            <div className="ws-user-flow__steps">
              {session.userFlow.map((step, idx) => (
                <div key={idx} style={{ display: "inline-flex", alignItems: "center", gap: 6 }}>
                  <code className="ws-user-flow__step">{step}</code>
                  {idx < session.userFlow.length - 1 && (
                    <ChevronRight size={12} className="ws-user-flow__arrow" />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* C. Investigation Summary Signal Card */}
      <div
        className={`ws-investigation-signal ${
          isErrorSession
            ? "ws-investigation-signal--danger"
            : isWarningSession
            ? "ws-investigation-signal--warning"
            : ""
        }`}
      >
        <ShieldAlert size={20} className="ws-investigation-signal__icon" />
        <div className="ws-investigation-signal__content">
          <span className="ws-investigation-signal__title">Investigation Summary Signal</span>
          <p className="ws-investigation-signal__text">{investigationSignal}</p>
        </div>
      </div>

      {/* D. Timeline Section */}
      <div className="ws-timeline-section">
        <div className="ws-timeline-section__header">
          <h2 className="ws-timeline-section__title">
            <Search size={16} />
            Chronological Event Timeline
          </h2>
          <span className="ws-session-table__subtext">
            Showing {events.length} of {summary.totalEvents} events
          </span>
        </div>

        {missingTargetEvent && (
          <p className="ws-session-detail__query-note" role="status">
            The linked event was not found in this session. Showing the available timeline events.
          </p>
        )}

        {/* Dynamic Summary Bar */}
        <TimelineSummary summary={summary} />

        {/* Category Filters */}
        <TimelineFilters
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Interactive Event Timeline */}
        <Timeline events={events} targetEventId={targetEventId} />
      </div>
    </div>
  );
}
