import { Link } from "react-router-dom";
import { Zap } from "lucide-react";
import "./PublicInfoPage.css";

export default function PublicInfoPage({ title, children }) {
  return (
    <main className="ws-public-info">
      <div className="ws-public-info__panel">
        <Link className="ws-public-info__brand" to="/login">
          <span className="ws-public-info__brand-mark" aria-hidden="true"><Zap size={15} /></span>
          Web Starzz
        </Link>
        <h1>{title}</h1>
        <div className="ws-public-info__content">{children}</div>
        <nav className="ws-public-info__links" aria-label="Information pages">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
          <Link to="/login">Sign in</Link>
        </nav>
      </div>
    </main>
  );
}
