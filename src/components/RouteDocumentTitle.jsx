import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function RouteDocumentTitle() {
  const { pathname } = useLocation();

  useEffect(() => {
    if (pathname === "/") document.title = "Web Starzz";
    else if (pathname === "/login") document.title = "Web Starzz | Sign in";
    else if (pathname === "/sessions") document.title = "Web Starzz | Sessions";
    else if (pathname.startsWith("/sessions/")) document.title = "Web Starzz | Session";
    else if (pathname === "/errors") document.title = "Web Starzz | Errors";
    else if (pathname.startsWith("/errors/")) document.title = "Web Starzz | Error";
    else if (pathname === "/performance") document.title = "Web Starzz | Performance";
    else if (pathname.startsWith("/performance/")) document.title = "Web Starzz | Performance Signal";
    else if (pathname === "/investigations") document.title = "Web Starzz | Investigations";
    else if (pathname === "/settings") document.title = "Web Starzz | Settings";
    else if (pathname === "/privacy") document.title = "Web Starzz | Privacy";
    else if (pathname === "/terms") document.title = "Web Starzz | Terms";
    else document.title = "Web Starzz | Page not found";
  }, [pathname]);

  return null;
}
