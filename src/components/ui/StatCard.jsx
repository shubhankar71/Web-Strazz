import "./StatCard.css";

export default function StatCard({
  title,
  value,
  icon: Icon,
  subtitle,
  variant = "default", // "default" | "danger" | "warning" | "success"
  className = "",
}) {
  return (
    <div className={`ws-stat-card ws-stat-card--${variant} ${className}`.trim()}>
      <div className="ws-stat-card__header">
        <span className="ws-stat-card__title">{title}</span>
        {Icon && (
          <div className="ws-stat-card__icon-wrapper" aria-hidden="true">
            <Icon size={16} />
          </div>
        )}
      </div>

      <div className="ws-stat-card__value">{value}</div>

      {subtitle && <div className="ws-stat-card__subtitle">{subtitle}</div>}
    </div>
  );
}
