import { useState } from "react";
import PageHeader from "../components/ui/PageHeader";
import SessionFilters from "../components/sessions/SessionFilters";
import SessionTable from "../components/sessions/SessionTable";
import Pagination from "../components/sessions/Pagination";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import useAsyncData from "../hooks/useAsyncData";
import { getSessions } from "../services/sessionService";
import "./Sessions.css";

export default function Sessions() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [errorFilter, setErrorFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const pageSize = 8;

  // Handlers that reset page to 1 on filter/search change
  const handleSearchChange = (val) => {
    setSearch(val);
    setPage(1);
  };

  const handleStatusFilterChange = (val) => {
    setStatusFilter(val);
    setPage(1);
  };

  const handleErrorFilterChange = (val) => {
    setErrorFilter(val);
    setPage(1);
  };

  const handleSortByChange = (val) => {
    setSortBy(val);
    setPage(1);
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setErrorFilter("all");
    setSortBy("newest");
    setPage(1);
  };

  // Fetch paginated sessions from data service layer
  const query = useAsyncData(
    () => getSessions({
        search,
        statusFilter,
        errorFilter,
        sortBy,
        page,
        pageSize,
      }),
    [search, statusFilter, errorFilter, sortBy, page]
  );
  if (query.loading) return <LoadingState label="Loading sessions…" />;
  if (query.error) return <ErrorState title="Sessions unavailable" description={query.error.message} onRetry={query.reload} />;
  const { sessions, totalCount, totalPages, page: currentPage } = query.data;

  return (
    <div className="ws-sessions-page">
      <PageHeader
        title="Sessions Explorer"
        description="Inspect recorded application sessions, filter by device or status, and analyze errors."
        actions={
          <div className="ws-sessions-page__header-badge">
            Total: {totalCount} {totalCount === 1 ? "session" : "sessions"}
          </div>
        }
      />

      <SessionFilters
        search={search}
        onSearchChange={handleSearchChange}
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        errorFilter={errorFilter}
        onErrorFilterChange={handleErrorFilterChange}
        sortBy={sortBy}
        onSortByChange={handleSortByChange}
        onReset={handleResetFilters}
      />

      <SessionTable sessions={sessions} compact={false} />

      <Pagination
        page={currentPage}
        totalPages={totalPages}
        totalCount={totalCount}
        pageSize={pageSize}
        onPageChange={setPage}
      />
    </div>
  );
}
