import { ChevronLeft, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import "./Pagination.css";

export default function Pagination({
  page = 1,
  totalPages = 1,
  totalCount = 0,
  pageSize = 8,
  onPageChange,
}) {
  if (totalCount === 0) return null;

  const startItem = (page - 1) * pageSize + 1;
  const endItem = Math.min(page * pageSize, totalCount);

  return (
    <div className="ws-pagination">
      <div className="ws-pagination__info">
        Showing <span className="ws-pagination__count">{startItem}</span> to{" "}
        <span className="ws-pagination__count">{endItem}</span> of{" "}
        <span className="ws-pagination__count">{totalCount}</span> sessions
      </div>

      <div className="ws-pagination__controls">
        <Button
          variant="secondary"
          size="sm"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          aria-label="Previous page"
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </Button>

        <span className="ws-pagination__page-indicator">
          Page {page} of {totalPages}
        </span>

        <Button
          variant="secondary"
          size="sm"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          aria-label="Next page"
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
}
