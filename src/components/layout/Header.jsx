import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Menu } from "lucide-react";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext.jsx";
import { getConfiguredDataSource } from "../../services/parseClient.js";
import "./Header.css";

export default function Header({ onOpenMobileNav, mobileMenuButtonRef, mobileNavOpen }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [logoutError, setLogoutError] = useState("");
  const dataSource = getConfiguredDataSource();

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

      <div className="ws-header__spacer" />

      <div className={`ws-header__workspace${dataSource === "demo" ? " ws-header__workspace--demo" : ""}`}>
        <span className="ws-header__workspace-dot" aria-hidden="true" />
        {dataSource === "demo" ? "Demo Environment" : dataSource === "parse" ? "Parse Mode" : "Invalid data source"}
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
