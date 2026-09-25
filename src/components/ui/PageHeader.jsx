import "./PageHeader.css";

export default function PageHeader({ title, description, actions }) {
  return (
    <div className="ws-page-header">
      <div className="ws-page-header__text">
        <h1 className="ws-page-header__title">{title}</h1>
        {description && <p className="ws-page-header__description">{description}</p>}
      </div>
      {actions && <div className="ws-page-header__actions">{actions}</div>}
    </div>
  );
}
