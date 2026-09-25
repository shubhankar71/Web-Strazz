import { Search, Filter, RotateCcw } from "lucide-react";
import "./SessionFilters.css";

export default function SessionFilters({
  search,
  onSearchChange,
  statusFilter,
  onStatusFilterChange,
  errorFilter,
  onErrorFilterChange,
  sortBy,
  onSortByChange,
  onReset,
}) {
  const isFiltered =
    search !== "" || statusFilter !== "all" || errorFilter !== "all" || sortBy !== "newest";

  return (
    <div className="ws-session-filters">
      <div className="ws-session-filters__search">
        <Search size={15} className="ws-session-filters__search-icon" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search session ID, page, browser, device..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search sessions"
        />
      </div>

      <div className="ws-session-filters__controls">
        <div className="ws-filter-group">
          <label htmlFor="status-filter" className="ws-filter-label">
            <Filter size={13} aria-hidden="true" />
            Status:
          </label>
          <select
            id="status-filter"
            className="ws-filter-select"
            value={statusFilter}
            onChange={(e) => onStatusFilterChange(e.target.value)}
          >
            <option value="all">All Statuses</option>
            <option value="normal">Normal</option>
            <option value="warning">Warning</option>
            <option value="error">Error</option>
          </select>
        </div>

        <div className="ws-filter-group">
          <label htmlFor="error-filter" className="ws-filter-label">
            Errors:
          </label>
          <select
            id="error-filter"
            className="ws-filter-select"
            value={errorFilter}
            onChange={(e) => onErrorFilterChange(e.target.value)}
          >
            <option value="all">All Sessions</option>
            <option value="has_errors">Has Errors</option>
            <option value="error_free">Error Free</option>
          </select>
        </div>

        <div className="ws-filter-group">
          <label htmlFor="sort-by" className="ws-filter-label">
            Sort by:
          </label>
          <select
            id="sort-by"
            className="ws-filter-select"
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value)}
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
            <option value="duration_desc">Longest Duration</option>
            <option value="duration_asc">Shortest Duration</option>
            <option value="events_desc">Most Events</option>
            <option value="errors_desc">Most Errors</option>
          </select>
        </div>

        {isFiltered && (
          <button
            type="button"
            className="ws-filter-reset-btn"
            onClick={onReset}
            title="Reset filters"
          >
            <RotateCcw size={13} />
            <span>Reset</span>
          </button>
        )}
      </div>
    </div>
  );
}
