import PublicInfoPage from "../components/PublicInfoPage";

export default function Terms() {
  return (
    <PublicInfoPage title="Terms of use">
      <p>This portfolio demonstration is provided to explore session investigation workflows. This page is informational and is not legal advice.</p>
      <section>
        <h2>Demo use</h2>
        <p>Use the bundled sample records for evaluation. They are illustrative data and must not be treated as real telemetry or used to make operational decisions.</p>
      </section>
      <section>
        <h2>Parse Mode</h2>
        <p>Only connect to a Parse Server that you are authorized to use. You are responsible for its schema, access controls, and the records sent to it. Never put privileged server keys in frontend environment variables.</p>
      </section>
      <section>
        <h2>Production use</h2>
        <p>This application is a portfolio demonstration. Review and configure authentication, server permissions, privacy requirements, and operational safeguards before using it with real application data.</p>
      </section>
    </PublicInfoPage>
  );
}
