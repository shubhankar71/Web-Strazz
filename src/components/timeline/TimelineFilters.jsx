import "./TimelineFilters.css";

export default function TimelineFilters({ activeCategory = "all", onCategoryChange }) {
  const categories = [
    { id: "all", label: "All Events" },
    { id: "errors", label: "Errors" },
    { id: "performance", label: "Performance" },
    { id: "user_actions", label: "User Actions" },
    { id: "network_api", label: "Network / API" },
    { id: "navigation", label: "Navigation" },
  ];

  return (
    <div className="ws-timeline-filters" role="group" aria-label="Event category filters">
      {categories.map((cat) => (
        <button
          key={cat.id}
          type="button"
          aria-pressed={activeCategory === cat.id}
          className={`ws-timeline-filter-btn ${
            activeCategory === cat.id ? "ws-timeline-filter-btn--active" : ""
          }`}
          onClick={() => onCategoryChange(cat.id)}
        >
          {cat.label}
        </button>
      ))}
    </div>
  );
}
