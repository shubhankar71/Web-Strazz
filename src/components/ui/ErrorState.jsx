import { AlertCircle } from "lucide-react";
import Button from "./Button";
import "./StateBlock.css";

export default function ErrorState({
  title = "Something went wrong",
  description,
  onRetry,
}) {
  return (
    <div className="ws-state-block" role="alert">
      <div className="ws-state-block__icon ws-state-block__icon--danger">
        <AlertCircle size={20} strokeWidth={1.75} aria-hidden="true" />
      </div>
      <h2 className="ws-state-block__title">{title}</h2>
      {description && <p className="ws-state-block__description">{description}</p>}
      {onRetry && (
        <div className="ws-state-block__action">
          <Button variant="secondary" size="sm" onClick={onRetry}>
            Try again
          </Button>
        </div>
      )}
    </div>
  );
}
