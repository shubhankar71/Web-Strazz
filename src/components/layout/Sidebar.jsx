import { PanelLeftClose, PanelLeft, Zap } from "lucide-react";
import NavigationItem from "./NavigationItem";
import { primaryNavItems, secondaryNavItems } from "../../utils/navigation";
import "./Sidebar.css";

export default function Sidebar({ collapsed, onToggle, mobileOpen, onCloseMobile }) {
  return (
    <>
      {mobileOpen && (
        <div className="ws-sidebar-scrim" onClick={onCloseMobile} aria-hidden="true" />
      )}
      <aside
        className={`ws-sidebar${collapsed ? " ws-sidebar--collapsed" : ""}${
          mobileOpen ? " ws-sidebar--mobile-open" : ""
        }`}
        aria-label="Primary"
        id="ws-primary-navigation"
        onKeyDown={(event) => {
          if (mobileOpen && event.key === "Escape") onCloseMobile();
        }}
      >
        <div className="ws-sidebar__brand">
          <span className="ws-sidebar__brand-mark" aria-hidden="true">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          {!collapsed && <span className="ws-sidebar__brand-name">Web Starzz</span>}
        </div>

        <nav className="ws-sidebar__nav" aria-label="Main">
          {primaryNavItems.map((item) => (
            <NavigationItem key={item.path} item={item} collapsed={collapsed} onNavigate={mobileOpen ? onCloseMobile : undefined} />
          ))}
        </nav>

        <div className="ws-sidebar__spacer" />

        <nav className="ws-sidebar__nav ws-sidebar__nav--secondary" aria-label="Settings">
          <div className="ws-sidebar__divider" />
          {secondaryNavItems.map((item) => (
            <NavigationItem key={item.path} item={item} collapsed={collapsed} onNavigate={mobileOpen ? onCloseMobile : undefined} />
          ))}
        </nav>

        <button
          type="button"
          className="ws-sidebar__toggle"
          onClick={onToggle}
          aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {collapsed ? <PanelLeft size={16} /> : <PanelLeftClose size={16} />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </aside>
    </>
  );
}
