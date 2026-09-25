import { useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  ChevronRight,
  Search,
  Filter,
  Activity,
  Layers,
  ShieldAlert,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatCard from "../components/ui/StatCard";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import useAsyncData from "../hooks/useAsyncData";
import { getGroupedErrors, getErrorOverviewMetrics } from "../services/sessionService";
import { formatSessionTime } from "../utils/sessionMetrics";
import "./Errors.css";

export default function Errors() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [severityFilter, setSeverityFilter] = useState("all");

  const result = useAsyncData(async () => Promise.all([
    getErrorOverviewMetrics(), getGroupedErrors({ search, typeFilter, severityFilter }),
  ]).then(([metrics, groupedErrors]) => ({ metrics, groupedErrors })), [search, typeFilter, severityFilter]);
  if (result.loading) return <LoadingState label="Loading errors…" />;
  if (result.error) return <ErrorState title="Errors unavailable" description={result.error.message} onRetry={result.reload} />;
  const { metrics, groupedErrors } = result.data;

  return (
    <div className="ws-errors-page">
      <PageHeader
        title="Errors"
        description="Investigate application errors captured across recorded sessions."
      />

      {/* Summary Bar */}
      <div className="row g-3 mb-2">
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Total Errors"
            value={metrics.totalErrors}
            icon={AlertTriangle}
            subtitle={`${metrics.groupedCount} unique error groups`}
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Affected Sessions"
            value={metrics.affectedSessions}
            icon={Activity}
            subtitle="User sessions containing errors"
            variant="danger"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="JavaScript Errors"
            value={metrics.jsErrors}
            icon={Layers}
            subtitle="Unhandled client exceptions"
          />
        </div>
        <div className="col-12 col-sm-6 col-lg-3">
          <StatCard
            title="Network Errors"
            value={metrics.networkErrors}
            icon={ShieldAlert}
            subtitle="API 5xx, timeouts, CORS"
          />
        </div>
      </div>

      {/* Filter Bar */}
      <div className="ws-errors-page__filters">
        <div className="ws-session-filters__search">
          <Search size={15} className="ws-session-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search by error message, route, or type..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search errors"
          />
        </div>

        <div className="ws-session-filters__controls">
          <div className="ws-filter-group">
            <label htmlFor="err-type-filter" className="ws-filter-label">
              <Filter size={13} aria-hidden="true" /> Type:
            </label>
            <select
              id="err-type-filter"
              className="ws-filter-select"
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
            >
              <option value="all">All Types</option>
              <option value="javascript">JavaScript</option>
              <option value="network">Network</option>
              <option value="console">Console</option>
            </select>
          </div>

          <div className="ws-filter-group">
            <label htmlFor="err-sev-filter" className="ws-filter-label">
              Severity:
            </label>
            <select
              id="err-sev-filter"
              className="ws-filter-select"
              value={severityFilter}
              onChange={(e) => setSeverityFilter(e.target.value)}
            >
              <option value="all">All Severities</option>
              <option value="error">Error</option>
              <option value="warning">Warning</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grouped Error Table */}
      {!groupedErrors.length ? (
        <EmptyState
          icon={AlertTriangle}
          title="No matching errors found"
          description="Try clearing your search query or adjusting your filters."
        />
      ) : (
        <div className="ws-session-table-wrapper" role="region" tabIndex={0} aria-label="Grouped errors table">
          <table className="ws-session-table">
            <thead>
              <tr>
                <th scope="col">Error</th>
                <th scope="col">Type</th>
                <th scope="col">Occurrences</th>
                <th scope="col">Affected Sessions</th>
                <th scope="col">First Seen</th>
                <th scope="col">Last Seen</th>
                <th scope="col">Route</th>
                <th scope="col">Severity</th>
                <th scope="col" className="ws-text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {groupedErrors.map((err) => (
                <tr key={err.errorId}>
                  <td>
                    <div className="ws-error-title-cell">
                      <Link
                        to={`/errors/${err.errorId}`}
                        className="ws-error-title-cell__title"
                        title={err.title}
                      >
                        {err.title}
                      </Link>
                      <span className="ws-error-title-cell__msg" title={err.message}>
                        {err.message}
                      </span>
                    </div>
                  </td>

                  <td>
                    <span className="ws-session-table__subtext">{err.type}</span>
                  </td>

                  <td className="ws-mono ws-text-danger">{err.occurrences}</td>

                  <td className="ws-mono">{err.affectedSessionsCount}</td>

                  <td className="ws-session-table__time-col">
                    {formatSessionTime(err.firstSeen)}
                  </td>

                  <td className="ws-session-table__time-col">
                    {formatSessionTime(err.lastSeen)}
                  </td>

                  <td>
                    <code className="ws-page-path">{err.route}</code>
                  </td>

                  <td>
                    <StatusBadge status={err.severity} />
                  </td>

                  <td className="ws-text-right">
                    <Link to={`/errors/${err.errorId}`} className="ws-action-link">
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
