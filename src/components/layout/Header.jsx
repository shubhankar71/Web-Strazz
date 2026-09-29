import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Menu, Zap, ChevronRight } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext.jsx";
import { getConfiguredDataSource } from "../../services/parseClient.js";
import "./Header.css";

export default function Header({ onOpenMobileNav, mobileMenuButtonRef, mobileNavOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [logoutError, setLogoutError] = useState("");
  const dataSource = getConfiguredDataSource();
  const segments = pathname.split("/").filter(Boolean);
  const sectionLabels = { sessions: "Sessions", errors: "Errors", performance: "Performance", investigations: "Investigations", settings: "Settings" };
  const sectionLabel = sectionLabels[segments[0]] || "Overview";
  const detailId = segments.length > 1 && ["sessions", "errors", "performance"].includes(segments[0]) ? segments[1] : "";

  async function handleLogout() {
    setLogoutError("");
    try {
      await logout();
      navigate("/login", { replace: true });
    } catch (error) {
      setLogoutError(error.message);
    }
  }

  return (
    <header className="ws-header">
      <button
        ref={mobileMenuButtonRef}
        type="button"
        className="ws-header__menu-btn"
        onClick={onOpenMobileNav}
        aria-label="Open navigation"
        aria-expanded={mobileNavOpen}
        aria-controls="ws-primary-navigation"
      >
        <Menu size={18} />
      </button>

      <Link className="ws-header__brand" to="/" aria-label="Web Starzz Overview">
        <span className="ws-header__brand-mark" aria-hidden="true"><Zap size={14} fill="currentColor" /></span>
        <span>WEB STARZZ</span>
      </Link>
      <span className="ws-header__divider" aria-hidden="true" />
      <nav className="ws-header__breadcrumbs" aria-label="Breadcrumb">
        {detailId ? <><Link to={`/${segments[0]}`}>{sectionLabel}</Link><ChevronRight size={13} aria-hidden="true" /><span className="ws-header__breadcrumb-current ws-mono">{detailId}</span></> : <span className="ws-header__breadcrumb-current">{sectionLabel}</span>}
      </nav>
      <div className="ws-header__spacer" />

      <div className={`ws-header__workspace${dataSource === "demo" ? " ws-header__workspace--demo" : ""}`}>
        <span className="ws-header__workspace-dot" aria-hidden="true" />
        {dataSource === "demo" ? "SAMPLE DATA" : dataSource === "parse" ? "PARSE MODE" : "CONFIGURATION ERROR"}
      </div>

      <details className="ws-header__account">
        <summary className="ws-header__avatar" aria-label="Account menu">
          {(user?.username || user?.email || "User").slice(0, 2).toUpperCase()}
        </summary>
        <div className="ws-header__account-menu">
          <span className="ws-header__account-email">{user?.email || user?.username}</span>
          {logoutError && <span className="ws-header__account-error" role="alert">{logoutError}</span>}
          <Button type="button" variant="secondary" size="sm" onClick={handleLogout}>Log out</Button>
        </div>
      </details>
    </header>
  );
}
