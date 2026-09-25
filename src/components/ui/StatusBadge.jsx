import "./StatusBadge.css";

/**
 * StatusBadge component
 * status: "normal" | "warning" | "error" | "info" | "success" | "danger"
 */
export default function StatusBadge({ status = "normal", label, className = "" }) {
  const normalizedStatus = status.toLowerCase();
  
  let variant = "normal";
  if (normalizedStatus === "normal" || normalizedStatus === "success" || normalizedStatus === "ok") {
    variant = "success";
  } else if (normalizedStatus === "warning" || normalizedStatus === "warn") {
    variant = "warning";
  } else if (normalizedStatus === "error" || normalizedStatus === "danger") {
    variant = "danger";
  } else if (normalizedStatus === "info") {
    variant = "info";
  }

  const displayText = label || (normalizedStatus.charAt(0).toUpperCase() + normalizedStatus.slice(1));

  return (
    <span className={`ws-status-badge ws-status-badge--${variant} ${className}`.trim()}>
      <span className="ws-status-badge__dot" aria-hidden="true" />
      <span className="ws-status-badge__text">{displayText}</span>
    </span>
  );
}
