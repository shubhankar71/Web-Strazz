import { NavLink } from "react-router-dom";
import "./NavigationItem.css";

export default function NavigationItem({ item, collapsed, onNavigate }) {
  const Icon = item.icon;
  const abbreviation = { Overview: "OV", Sessions: "SE", Errors: "ER", Performance: "PE", Investigations: "IN", Settings: "ST" }[item.label];

  return (
    <NavLink
      to={item.path}
      end={item.path === "/"}
      onClick={onNavigate}
      className={({ isActive }) =>
        `ws-nav-item${isActive ? " ws-nav-item--active" : ""}`
      }
      title={collapsed ? item.label : undefined}
    >
      <Icon size={17} strokeWidth={2} aria-hidden="true" />
      <span className="ws-nav-item__abbr" aria-hidden="true">{abbreviation}</span>
      {!collapsed && <span className="ws-nav-item__label">{item.label}</span>}
    </NavLink>
  );
}
