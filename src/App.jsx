import { Routes, Route } from "react-router-dom";
import AppLayout from "./layouts/AppLayout";
import Login from "./pages/Login";
import Overview from "./pages/Overview";
import Sessions from "./pages/Sessions";
import SessionDetail from "./pages/SessionDetail";
import Errors from "./pages/Errors";
import ErrorDetail from "./pages/ErrorDetail";
import Performance from "./pages/Performance";
import PerformanceDetail from "./pages/PerformanceDetail";
import Investigations from "./pages/Investigations";
import Settings from "./pages/Settings";
import RequireAuth from "./components/auth/RequireAuth";
import RouteDocumentTitle from "./components/RouteDocumentTitle";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import NotFound from "./pages/NotFound";

export default function App() {
  return (
    <>
      <RouteDocumentTitle />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />

        <Route element={<RequireAuth><AppLayout /></RequireAuth>}>
          <Route path="/" element={<Overview />} />
          <Route path="/sessions" element={<Sessions />} />
          <Route path="/sessions/:sessionId" element={<SessionDetail />} />
          <Route path="/errors" element={<Errors />} />
          <Route path="/errors/:errorId" element={<ErrorDetail />} />
          <Route path="/performance" element={<Performance />} />
          <Route path="/performance/:perfId" element={<PerformanceDetail />} />
          <Route path="/investigations" element={<Investigations />} />
          <Route path="/settings" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
}
