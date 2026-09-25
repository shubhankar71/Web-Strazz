import { useState } from "react";
import { Link } from "react-router-dom";
import {
  Gauge,
  ChevronRight,
  Search,
  Filter,
  Activity,
  Clock,
  Zap,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import useAsyncData from "../hooks/useAsyncData";
import { getGroupedPerformanceEvents, getPerformanceOverviewMetrics } from "../services/sessionService";
import { formatDuration } from "../utils/sessionMetrics";
import "./Performance.css";

export default function Performance() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [sortBy, setSortBy] = useState("duration_desc");

  const result = useAsyncData(async () => Promise.all([
    getPerformanceOverviewMetrics(), getGroupedPerformanceEvents({ search, typeFilter, sortBy }),
  ]).then(([metrics, perfEvents]) => ({ metrics, perfEvents })), [search, typeFilter, sortBy]);
  if (result.loading) return <LoadingState label="Loading performance signals…" />;
  if (result.error) return <ErrorState title="Performance data unavailable" description={result.error.message} onRetry={result.reload} />;
  const { metrics, perfEvents } = result.data;

  return (
    <div className="ws-perf-page">
      <PageHeader
        title="Performance"
        description="Investigate slow requests and performance signals captured across recorded sessions."
      />

      {/* Summary Bar */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Performance Signals"
            value={metrics.perfSignalsCount}
            icon={Gauge}
            subtitle="Total signals captured"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Slow Requests (>2s)"
            value={metrics.slowRequestsCount}
            icon={Zap}
            subtitle="Exceeded latency threshold"
            variant={metrics.slowRequestsCount > 0 ? "warning" : "default"}
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Avg Request Duration"
            value={metrics.avgDurationStr}
            icon={Clock}
            subtitle="Mean wall-clock response"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Affected Sessions"
            value={metrics.affectedSessions}
            icon={Activity}
            subtitle="User sessions with latency signals"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ws-perf-page__filters">
        <div className="ws-session-filters__search">
          <Search size={15} className="ws-session-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by operation, resource URL, or route..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search performance signals"
          />
        </div>

        <div className="ws-session-filters__controls">
          <div className="ws-filter-group">
            <label htmlFor="perf-type-filter" className="ws-filter-label">
              <Filter size={13} aria-hidden="true" /> Type:
            </label>
            <select
              id="perf-type-filter"
              className="ws-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Signals</option>
              <option value="slow_requests">Slow Requests (&gt;2s)</option>
              <option value="api">API Requests</option>
              <option value="page_load">Page Load</option>
              <option value="other">Other Performance</option>
            </select>
          </div>

          <div className="ws-filter-group">
            <label htmlFor="perf-sort-filter" className="ws-filter-label">
              Sort by:
            </label>
            <select
              id="perf-sort-filter"
              className="ws-filter-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="duration_desc">Longest Duration</option>
              <option value="occurrences">Most Occurrences</option>
              <option value="recent">Most Recent</option>
            </select>
          </div>
        </div>
      </div>

      {/* Performance Table */}
      {!perfEvents.length ? (
        <EmptyState
          icon={Gauge}
          title="No matching performance signals found"
          description="Try clearing your search query or adjusting your filters."
        />
      ) : (
        <div className="ws-session-table-wrapper" role="region" tabIndex={0} aria-label="Performance signals table">
          <table className="ws-session-table">
            <thead>
              <tr>
                <th scope="col">Resource / Operation</th>
                <th scope="col">Type</th>
                <th scope="col">Duration</th>
                <th scope="col">Status</th>
                <th scope="col">Occurrences</th>
                <th scope="col">Affected Sessions</th>
                <th scope="col">Route</th>
                <th scope="col" className="ws-text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {perfEvents.map((perf) => (
                <tr key={perf.perfId}>
                  <td>
                    <Link
                      to={`/performance/${perf.perfId}`}
                      className="ws-session-table__id-link"
                      title={perf.title}
                    >
                      {perf.title}
                    </Link>
                  </td>

                  <td>
                    <span className="ws-session-table__subtext">{perf.type}</span>
                  </td>

                  <td className="ws-mono ws-text-warning">
                    {formatDuration(Math.round(perf.duration / 1000))} ({(perf.duration / 1000).toFixed(2)}s)
                  </td>

                  <td>
                    <StatusBadge
                      status={
                        typeof perf.status === "number" && perf.status >= 400
                          ? "error"
                          : perf.duration >= 2000
                          ? "warning"
                          : "info"
                      }
                      label={String(perf.status)}
                    />
                  </td>

                  <td className="ws-mono">{perf.occurrences}</td>

                  <td className="ws-mono">{perf.affectedSessionsCount}</td>

                  <td>
                    <code className="ws-page-path">{perf.route}</code>
                  </td>

                  <td className="ws-text-right">
                    <Link to={`/performance/${perf.perfId}`} className="ws-action-link">
                      <span>Inspect</span>
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
