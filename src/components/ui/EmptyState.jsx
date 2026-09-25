import "./StateBlock.css";

export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="ws-state-block">
      {Icon && (
        <div className="ws-state-block__icon ws-state-block__icon--neutral">
          <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
        </div>
      )}
      <h2 className="ws-state-block__title">{title}</h2>
      {description && <p className="ws-state-block__description">{description}</p>}
      {action && <div className="ws-state-block__action">{action}</div>}
    </div>
  );
}
