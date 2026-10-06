import { useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import Button from "../components/ui/Button";
import LoadingState from "../components/ui/LoadingState";
import { useAuth } from "../context/AuthContext.jsx";
import { getAuthMode } from "../services/authService.js";
import "./Login.css";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, loading, login, authError, clearAuthError } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  if (loading) return <LoadingState label="Checking sign-in…" />;
  if (user) return <Navigate to={location.state?.from || "/"} replace />;

  async function handleSubmit(event) {
    event.preventDefault();
    const errors = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) errors.email = "Enter your email address.";
    else if (cleanEmail.includes("@") && !EMAIL_PATTERN.test(cleanEmail)) errors.email = "Enter a valid email address.";
    if (!password) errors.password = "Enter your password.";
    setFieldErrors(errors);
    setSubmitError("");
    clearAuthError();
    if (Object.keys(errors).length) return;

    setSubmitting(true);
    try {
      await login(cleanEmail, password);
      navigate(location.state?.from || "/", { replace: true });
    } catch (error) {
      setSubmitError(error.message);
    } finally {
      setSubmitting(false);
    }
  }

  const visibleError = submitError || authError;
  const demoMode = getAuthMode() === "demo";

  return (
    <div className="ws-login">
      <div className="ws-login__panel">
        <div className="ws-login__brand">
          <span className="ws-login__brand-mark" aria-hidden="true">
            <Zap size={16} strokeWidth={2.5} />
          </span>
          Web Starzz
        </div>

        <div className="ws-login__intro">
          <h1>Sign in</h1>
          <p>Investigate application sessions and identify errors, slow requests, and user-flow failures.</p>
        </div>

        {demoMode && (
          <div className="ws-login__demo-note" role="note">
            <strong>Demo environment</strong>
            <span>Sign-in uses local demonstration authentication.</span>
          </div>
        )}

        <form className="ws-login__form" onSubmit={handleSubmit} noValidate>
          <label className="ws-field" htmlFor="login-email">
            <span className="ws-field__label">Email or username</span>
            <input
              id="login-email"
              type="text"
              name="email"
              autoComplete="username"
              placeholder="you@company.com"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setFieldErrors((current) => ({ ...current, email: "" }));
                setSubmitError("");
                clearAuthError();
              }}
              aria-invalid={Boolean(fieldErrors.email)}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
              required
            />
            {fieldErrors.email && <span className="ws-login__field-error" id="login-email-error">{fieldErrors.email}</span>}
          </label>

          <label className="ws-field" htmlFor="login-password">
            <span className="ws-field__label">Password</span>
            <input
              id="login-password"
              type="password"
              name="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              value={password}
              onChange={(event) => {
                setPassword(event.target.value);
                setFieldErrors((current) => ({ ...current, password: "" }));
                setSubmitError("");
                clearAuthError();
              }}
              aria-invalid={Boolean(fieldErrors.password)}
              aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
              required
            />
            {fieldErrors.password && <span className="ws-login__field-error" id="login-password-error">{fieldErrors.password}</span>}
          </label>

          {visibleError && <p className="ws-login__error" role="alert">{visibleError}</p>}

          <Button type="submit" variant="primary" className="ws-login__submit" disabled={submitting} aria-busy={submitting}>
            {submitting ? "Signing in…" : "Continue"}
          </Button>
        </form>
        <nav className="ws-login__info-links" aria-label="Legal information">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </nav>
      </div>
    </div>
  );
}
