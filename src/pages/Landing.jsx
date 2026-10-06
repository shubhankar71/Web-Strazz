import { Link } from "react-router-dom";
import { Activity, ArrowDown, ArrowRight, Bug, Clock3, Gauge, MousePointer2, Send, Zap } from "lucide-react";
import "./Landing.css";

const features = [
  { icon: Activity, title: "Session investigation", text: "Inspect an individual session and follow the sequence of recorded activity." },
  { icon: Clock3, title: "Event timeline", text: "Read navigation, user actions, requests, errors, and performance events in order." },
  { icon: Bug, title: "Error investigation", text: "Review recurring errors and the sessions associated with them." },
  { icon: Gauge, title: "Performance signals", text: "Find slow requests and inspect the surrounding session events." },
  { icon: ArrowRight, title: "Cross-linked records", text: "Move between sessions, errors, performance signals, and related timeline events." },
  { icon: Activity, title: "Investigation workflow", text: "Create and update an investigation around a problem you are tracing." },
];

const steps = [
  "Find the affected session",
  "Inspect the activity",
  "Trace the timeline",
  "Identify the error or slow request",
  "Create an investigation",
];

function ProductPreview() {
  return (
    <div className="ws-preview" aria-label="Sample session detail and event timeline from the demo data">
      <div className="ws-preview__top">
        <span className="ws-preview__brand"><Zap size={13} /> WEB STARZZ</span>
        <span className="ws-preview__crumb">Sessions&nbsp; / &nbsp;<b>sess_9f83a12b</b></span>
        <span className="ws-preview__sample">DEMO SAMPLE</span>
      </div>
      <div className="ws-preview__body">
        <aside className="ws-preview__rail" aria-hidden="true">
          <span>OV</span><span className="is-active">SE</span><span>ER</span><span>PE</span><span>IN</span>
        </aside>
        <div className="ws-preview__content">
          <div className="ws-preview__heading">
            <div>
              <small>SESSION DETAIL</small>
              <h2>Checkout session</h2>
              <p>Session <code>sess_9f83a12b</code> · /checkout/payment</p>
            </div>
            <span className="ws-preview__status">Error</span>
          </div>
          <div className="ws-preview__timeline">
            <div className="ws-preview__timeline-head"><b>Chronological event timeline</b><span>From demo records</span></div>
            <div className="ws-preview__event">
              <span className="ws-preview__node is-blue"><MousePointer2 size={12} /></span><time>+01:18</time>
              <div><b>Click: “Pay &amp; Subscribe”</b><small>/checkout/payment · User action</small></div>
            </div>
            <div className="ws-preview__event">
              <span className="ws-preview__node is-blue"><Send size={12} /></span><time>+01:19</time>
              <div><b>POST /api/v2/payment/charge</b><small>Request · Related performance signal</small></div>
            </div>
            <div className="ws-preview__event">
              <span className="ws-preview__node is-warn"><Clock3 size={12} /></span><time>+01:24</time>
              <div><b>Slow API Response: 5.21s</b><small>Latency threshold: 2.0s</small></div>
            </div>
            <div className="ws-preview__event">
              <span className="ws-preview__node is-error"><Bug size={12} /></span><time>+01:25</time>
              <div><b>Console Error: Payment Flow Terminated</b><small>Related to the same checkout session</small></div>
            </div>
          </div>
          <div className="ws-preview__foot"><span><i /> User action</span><span><i className="is-request" /> Request</span><span><i className="is-slow" /> Performance</span><span><i className="is-failure" /> Error</span></div>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  return (
    <div className="ws-landing">
      <header className="ws-landing-nav">
        <Link className="ws-landing-brand" to="/" aria-label="Web Starzz home">
          <span><Zap size={17} fill="currentColor" /></span>Web Starzz
        </Link>
        <nav aria-label="Public navigation">
          <a href="#product">Product</a><a href="#workflow">How it works</a><a href="#features">Features</a>
        </nav>
        <Link className="ws-landing-login" to="/login">Login <ArrowRight size={15} /></Link>
      </header>

      <main>
        <section className="ws-landing-hero" id="product">
          <div className="ws-landing-hero__copy">
            <p className="ws-eyebrow"><span /> SESSION INVESTIGATION FOR DEVELOPERS</p>
            <h1>Investigate what went wrong in a web session.</h1>
            <p className="ws-landing-hero__lead">Trace user activity, API requests, JavaScript errors, and performance issues in one chronological view. Follow related records to see how the problem unfolded.</p>
            <div className="ws-landing-actions">
              <a className="ws-button ws-button--light" href="#workflow">Explore the workflow <ArrowDown size={15} /></a>
              <Link className="ws-button ws-button--outline" to="/login">Login <ArrowRight size={15} /></Link>
            </div>
            <p className="ws-landing-hero__note">Product preview uses a labeled sample from the bundled demo data.</p>
          </div>
          <div className="ws-landing-hero__preview"><ProductPreview /></div>
        </section>

        <section className="ws-problem ws-section-wrap" aria-labelledby="problem-title">
          <div className="ws-problem__intro">
            <p className="ws-eyebrow ws-eyebrow--ink">THE INVESTIGATION GAP</p>
            <h2 id="problem-title">An error message rarely tells the whole story.</h2>
            <p>A report like “checkout is slow” leaves the important questions unanswered.</p>
          </div>
          <div className="ws-problem__case">
            <div className="ws-problem__report"><small>USER REPORT</small><p>“Checkout is slow.”</p></div>
            <div className="ws-problem__questions">
              <small>WHAT DO YOU NEED TO KNOW?</small>
              <ul><li>What did the user do?</li><li>Which page were they on?</li><li>Which request was slow?</li><li>Did an error happen afterward?</li></ul>
            </div>
            <div className="ws-problem__answer"><span><Activity size={17} /></span><p><b>Web Starzz connects the evidence.</b> Follow the session timeline to see the activity, request, and related error in context.</p></div>
          </div>
        </section>

        <section className="ws-workflow" id="workflow">
          <div className="ws-section-wrap">
            <div className="ws-section-heading">
              <div><p className="ws-eyebrow ws-eyebrow--ink">HOW IT WORKS</p><h2>Follow the evidence through a session.</h2></div>
              <p>Move from a reported issue to the records that help explain it.</p>
            </div>
            <ol className="ws-steps">
              {steps.map((step, i) => <li key={step}><span className="ws-steps__number">0{i + 1}</span><span>{step}</span>{i < steps.length - 1 && <ArrowRight className="ws-steps__arrow" size={16} aria-hidden="true" />}</li>)}
            </ol>
          </div>
        </section>

        <section className="ws-features ws-section-wrap" id="features">
          <div className="ws-section-heading">
            <div><p className="ws-eyebrow ws-eyebrow--ink">FEATURES</p><h2>Session context, connected.</h2></div>
            <p>Tools for examining recorded activity and keeping related findings together.</p>
          </div>
          <div className="ws-feature-grid">
            {features.map(({ icon: Icon, title, text }) => <article className="ws-feature" key={title}><span className="ws-feature__icon"><Icon size={17} /></span><h3>{title}</h3><p>{text}</p></article>)}
          </div>
        </section>

        <section className="ws-final-cta">
          <div><p className="ws-eyebrow">WEB STARZZ</p><h2>Ready to investigate a session?</h2><p>Trace application issues from user activity to the related technical evidence.</p><Link className="ws-button ws-button--light" to="/login">Login to Web Starzz <ArrowRight size={15} /></Link></div>
        </section>
      </main>
      <footer className="ws-landing-footer">
        <Link className="ws-landing-brand" to="/"><span><Zap size={15} fill="currentColor" /></span>Web Starzz</Link>
        <p>Demo records are illustrative and do not represent live customer telemetry.</p>
        <div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/login">Login</Link></div>
      </footer>
    </div>
  );
}
