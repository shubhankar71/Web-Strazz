import PublicInfoPage from "../components/PublicInfoPage";

export default function Privacy() {
  return (
    <PublicInfoPage title="Privacy">
      <p>This page describes data handling in the Web Starzz portfolio demonstration. It is informational and is not legal advice.</p>
      <section>
        <h2>Demo Mode</h2>
        <p>Demo records are bundled with the application and displayed locally. Demo authentication stores a non-sensitive demo user marker in this browser. The application does not send demo records to a telemetry service.</p>
      </section>
      <section>
        <h2>Parse Mode</h2>
        <p>When Parse Mode is configured, sign-in, queries, and investigation changes are sent to the Parse Server URL supplied by the operator. That server may receive account credentials during sign-in and the application records requested by the interface. Its own configuration controls storage and retention.</p>
      </section>
      <section>
        <h2>Information handled by the app</h2>
        <p>Web Starzz contains no separate analytics or tracking integration. Parse authentication session data is managed by the Parse JavaScript SDK in Parse Mode. The app loads Inter and IBM Plex Mono fonts from Google Fonts, which receives standard browser requests for those assets. Do not enter sensitive information into the demo or into a Parse Server you do not control.</p>
      </section>
    </PublicInfoPage>
  );
}
