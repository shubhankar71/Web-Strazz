import { Loader2 } from "lucide-react";
import "./StateBlock.css";

export default function LoadingState({ label = "Loading…" }) {
  return (
    <div className="ws-state-block" role="status" aria-live="polite">
      <Loader2 size={18} className="ws-state-block__spinner" aria-hidden="true" />
      <p className="ws-state-block__title">{label}</p>
    </div>
  );
}
