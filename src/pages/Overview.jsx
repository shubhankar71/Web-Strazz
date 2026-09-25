import { Link } from "react-router-dom";
import useAsyncData from "../hooks/useAsyncData";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import EmptyState from "../components/ui/EmptyState";
import {
  ListVideo,
  AlertOctagon,
  Clock,
  Activity,
  ChevronRight,
  ShieldAlert,
  Terminal,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import SessionTable from "../components/sessions/SessionTable";
import ActivityList from "../components/overview/ActivityList";
import StatusBadge from "../components/ui/StatusBadge";
import {
  getOverviewMetrics,
  getRecentSessions,
  getSessionsNeedingAttention,
  getRecentActivities,
} from "../services/sessionService";
import "./Overview.css";

export default function Overview() {
  const overview = useAsyncData(async () => Promise.all([
    getOverviewMetrics(), getRecentSessions(5), getSessionsNeedingAttention(4), getRecentActivities(),
  ]).then(([metrics, recentSessions, attentionSessions, activities]) => ({ metrics, recentSessions, attentionSessions, activities })), []);
  if (overview.loading) return <LoadingState label="Loading overview…" />;
  if (overview.error) return <ErrorState title="Overview unavailable" description={overview.error.message} onRetry={overview.reload} />;
  const { metrics, recentSessions, attentionSessions, activities } = overview.data;

  return (
    <div className="ws-overview-grid">
      <PageHeader
        title="Overview"
        description="Review session data and investigate errors, slow requests, and user-flow failures."
      />

      {/* A. Summary Metrics */}
      <div className="ws-overview-metrics">
        <div className="row g-3">
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Total Sessions"
              value={metrics.totalSessions}
              icon={ListVideo}
              subtitle="Based on available session records"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Error Rate"
              value={metrics.errorRate}
              icon={AlertOctagon}
              subtitle={`${metrics.sessionsWithErrors} sessions affected`}
              variant={metrics.sessionsWithErrors > 0 ? "danger" : "default"}
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Avg Session Duration"
              value={metrics.avgDuration}
              icon={Clock}
              subtitle="Mean wall-clock time"
            />
          </div>
          <div className="col-12 col-sm-6 col-lg-3">
            <StatCard
              title="Sessions w/ Errors"
              value={metrics.sessionsWithErrors}
              icon={Activity}
              subtitle="Failed runtime events"
              variant={metrics.sessionsWithErrors > 0 ? "danger" : "default"}
            />
          </div>
        </div>
      </div>

      <div className="row g-4">
        {/* Left Column: Recent Sessions & Attention Required */}
        <div className="col-12 col-lg-8">
          {/* B. Recent Sessions */}
          <section className="mb-4">
            <div className="ws-section-header">
              <h2 className="ws-section-title">
                <ListVideo size={16} />
                Recent Sessions
              </h2>
              <Link to="/sessions" className="ws-section-link">
                <span>View all sessions</span>
                <ChevronRight size={14} />
              </Link>
            </div>
            <SessionTable sessions={recentSessions} compact={true} />
          </section>

          {/* C. Sessions Requiring Attention */}
          <section>
            <div className="ws-section-header">
              <h2 className="ws-section-title">
                <ShieldAlert size={16} />
                Sessions Requiring Attention
              </h2>
              <span className="ws-session-table__subtext">
                {attentionSessions.length} sessions flagged
              </span>
            </div>
            {attentionSessions.length === 0 ? (
              <EmptyState
                icon={ShieldAlert}
                title="No sessions need attention"
                description="Sessions with errors or warnings will appear here."
              />
            ) : attentionSessions.map((session) => (
              <div
                key={session.sessionId}
                className={`ws-attention-card ${
                  session.status === "warning" ? "ws-attention-card--warning" : ""
                }`}
              >
                <div className="ws-attention-card__main">
                  <div className="ws-attention-card__title-row">
                    <span className="ws-attention-card__id">{session.sessionId}</span>
                    <StatusBadge status={session.status} />
                  </div>
                  {session.errorMessage ? (
                    <span className="ws-attention-card__error-msg">{session.errorMessage}</span>
                  ) : (
                    <span className="ws-attention-card__meta">
                      Last active on <code className="ws-page-path">{session.lastPage}</code> with {session.errorCount} error(s)
                    </span>
                  )}
                </div>
                <Link to={`/sessions/${session.sessionId}`} className="ws-action-link">
                  <span>Inspect</span>
                  <ChevronRight size={14} />
                </Link>
              </div>
            ))}
          </section>
        </div>

        {/* Right Column: Developer Activity */}
        <div className="col-12 col-lg-4">
          {/* D. Recent Developer Activity */}
          <section>
            <div className="ws-section-header">
              <h2 className="ws-section-title">
                <Terminal size={16} />
                Recent Activity
              </h2>
            </div>
            <ActivityList activities={activities} />
          </section>
        </div>
      </div>
    </div>
  );
}
