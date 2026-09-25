import {
  LayoutDashboard,
  ListVideo,
  AlertTriangle,
  Gauge,
  SearchCode,
  Settings,
} from "lucide-react";

// Single source of truth for the primary and secondary nav.
// Sidebar and any breadcrumb/command-palette logic added later
// should read from here rather than duplicating routes.
export const primaryNavItems = [
  { label: "Overview", path: "/", icon: LayoutDashboard },
  { label: "Sessions", path: "/sessions", icon: ListVideo },
  { label: "Errors", path: "/errors", icon: AlertTriangle },
  { label: "Performance", path: "/performance", icon: Gauge },
  { label: "Investigations", path: "/investigations", icon: SearchCode },
];

export const secondaryNavItems = [
  { label: "Settings", path: "/settings", icon: Settings },
];
