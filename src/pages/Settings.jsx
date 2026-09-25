import { Database, KeyRound, Settings as SettingsIcon } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import StatusBadge from "../components/ui/StatusBadge";
import { useAuth } from "../context/AuthContext.jsx";
import { getConfiguredDataSource, isParseConfigured } from "../services/parseClient.js";
import "./Settings.css";

export default function Settings() {
  const { user } = useAuth();
  const dataSource = getConfiguredDataSource();
  const isDemo = dataSource === "demo";
  const isParse = dataSource === "parse";
  const parseReady = isParseConfigured();

  return (
    <div className="ws-settings-page">
      <PageHeader
        title="Settings"
        description="Review the data source and sign-in mode used by this Web Starzz instance."
      />

      <section className="ws-settings-card" aria-labelledby="settings-data-source">
        <div className="ws-settings-card__icon" aria-hidden="true"><Database size={17} /></div>
        <div className="ws-settings-card__body">
          <h2 id="settings-data-source">Data source</h2>
          <p>
            {isDemo
              ? "Demo Mode uses the sample records bundled with this app. Investigation changes stay in memory and reset when the app reloads."
              : isParse
              ? "Parse Mode sends supported queries and investigation changes to the configured Parse Server. Live server behavior has not been verified here."
              : "The configured data source is not supported. Set VITE_DATA_SOURCE to demo or parse and restart the app."}
          </p>
          <div className="ws-settings-card__status">
            <span>Configured mode</span>
            <StatusBadge
              status={isDemo ? "info" : isParse ? (parseReady ? "success" : "warning") : "error"}
              label={isDemo ? "Demo Mode" : isParse ? "Parse Mode" : "Invalid configuration"}
            />
          </div>
          {isParse && (
            <div className="ws-settings-card__status">
              <span>Parse application configuration</span>
              <strong>{parseReady ? "Application ID and server URL configured" : "Required values are missing"}</strong>
            </div>
          )}
          <p className="ws-settings-card__note">
            Configuration values are read from build-time environment variables. This page never displays keys or server credentials.
          </p>
        </div>
      </section>

      <section className="ws-settings-card" aria-labelledby="settings-authentication">
        <div className="ws-settings-card__icon" aria-hidden="true"><KeyRound size={17} /></div>
        <div className="ws-settings-card__body">
          <h2 id="settings-authentication">Authentication</h2>
          <p>
            {user?.isDemo
              ? "Signed in with the local demonstration account. This does not provide production identity or access control."
              : user
              ? `Signed in as ${user.email || user.username}. Parse manages the authentication session.`
              : "No authenticated user is available."}
          </p>
        </div>
      </section>

      <section className="ws-settings-note" aria-label="Settings availability">
        <SettingsIcon size={16} aria-hidden="true" />
        <p>Workspace, tracking client, and team administration settings are not implemented in this portfolio demo.</p>
      </section>
    </div>
  );
}
