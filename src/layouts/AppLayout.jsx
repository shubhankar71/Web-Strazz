import { useEffect, useRef, useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/layout/Sidebar";
import Header from "../components/layout/Header";
import "./AppLayout.css";

export default function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const mobileMenuButtonRef = useRef(null);

  const closeMobileNav = () => {
    setMobileNavOpen(false);
    requestAnimationFrame(() => mobileMenuButtonRef.current?.focus());
  };

  useEffect(() => {
    if (mobileNavOpen) {
      document.querySelector(".ws-sidebar__nav a")?.focus();
    }
  }, [mobileNavOpen]);

  return (
    <div className="ws-app-shell">
      <Sidebar
        collapsed={collapsed && !mobileNavOpen}
        onToggle={() => setCollapsed((v) => !v)}
        mobileOpen={mobileNavOpen}
        onCloseMobile={closeMobileNav}
      />
      <div className="ws-app-shell__main">
        <Header
          mobileMenuButtonRef={mobileMenuButtonRef}
          mobileNavOpen={mobileNavOpen}
          onOpenMobileNav={() => setMobileNavOpen(true)}
        />
        <main className="ws-app-shell__content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
