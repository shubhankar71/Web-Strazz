import { Link } from "react-router-dom";
import { Activity, ArrowDown, ArrowRight, Bug, Clock3, Gauge, MousePointer2, Send, Zap } from "lucide-react";
import "./Landing.css";

const features = [
  { icon: Activity, title: "Session investigation", text: "Inspect an individual session and follow the sequence of user activity." },
  { icon: Clock3, title: "Event timeline", text: "Read page loads, navigation, actions, requests, errors, and performance events in order." },
  { icon: Bug, title: "Grouped errors", text: "Find recurring errors and the sessions affected by them." },
  { icon: Gauge, title: "Performance signals", text: "Identify slow requests and inspect the events around them." },
  { icon: ArrowRight, title: "Linked records", text: "Move between sessions, errors, performance records, and related events." },
  { icon: Activity, title: "Investigations", text: "Create an investigation around a problem and update its status as you work." },
];

const steps = ["Find the affected session", "Inspect its timeline", "Locate the error or slow request", "Open the related record", "Create an investigation"];

function ProductPreview() {
  return (
    <div className="ws-preview" aria-label="Illustrative sample session timeline">
      <div className="ws-preview__top"><span className="ws-preview__brand"><Zap size={13} /> WEB STARZZ</span><span className="ws-preview__crumb">Sessions&nbsp; / &nbsp;<b>ses_8f2c1a</b></span><span className="ws-preview__sample">SAMPLE DATA</span></div>
      <div className="ws-preview__body">
        <aside className="ws-preview__rail" aria-hidden="true"><span>OV</span><span className="is-active">SE</span><span>ER</span><span>PE</span><span>IN</span></aside>
        <div className="ws-preview__content">
          <div className="ws-preview__heading"><div><small>SESSION DETAIL</small><h2>Checkout session</h2><p>Chrome · macOS · /checkout</p></div><span className="ws-preview__status">Error detected</span></div>
          <div className="ws-preview__stats"><div><small>Duration</small><b>02:41</b></div><div><small>Events</small><b>18</b></div><div><small>Errors</small><b className="is-error">1</b></div><div><small>Slow requests</small><b className="is-warn">2</b></div></div>
          <div className="ws-preview__timeline"><div className="ws-preview__timeline-head"><b>Session timeline</b><span>5 events shown</span></div>
            <div className="ws-preview__event"><span className="ws-preview__node is-blue"><MousePointer2 size={12} /></span><time>00:12</time><div><b>Clicked “Place order”</b><small>/checkout</small></div></div>
            <div className="ws-preview__event"><span className="ws-preview__node is-blue"><Send size={12} /></span><time>00:13</time><div><b>POST /api/orders</b><small>Request started</small></div></div>
            <div className="ws-preview__event"><span className="ws-preview__node is-warn"><Clock3 size={12} /></span><time>00:16</time><div><b>Request completed slowly</b><small>/api/orders · 3.2 s</small></div></div>
            <div className="ws-preview__event"><span className="ws-preview__node is-error"><Bug size={12} /></span><time>00:17</time><div><b>OrderConfirmation error</b><small>Cannot read property “id”</small></div></div>
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
        <Link className="ws-landing-brand" to="/" aria-label="Web Starzz home"><span><Zap size={17} fill="currentColor" /></span>Web Starzz</Link>
        <nav aria-label="Public navigation"><a href="#product">Product</a><a href="#workflow">How it works</a><a href="#features">Features</a></nav>
        <Link className="ws-landing-login" to="/login">Login <ArrowRight size={15} /></Link>
      </header>

      <main>
        <section className="ws-landing-hero" id="product">
          <div className="ws-landing-hero__copy">
            <p className="ws-eyebrow"><span /> SESSION INVESTIGATION FOR DEVELOPERS</p>
            <h1>Trace the problem<br />through the session.</h1>
            <p className="ws-landing-hero__lead">Web Starzz connects user actions, page navigation, API requests, JavaScript errors, and performance events so you can understand what happened.</p>
            <div className="ws-landing-actions"><a className="ws-button ws-button--light" href="#workflow">Explore the workflow <ArrowDown size={15} /></a><Link className="ws-button ws-button--outline" to="/login">Login <ArrowRight size={15} /></Link></div>
            <p className="ws-landing-hero__note">Explore the investigation workflow using sample session data.</p>
          </div>
          <div className="ws-landing-hero__preview"><ProductPreview /></div>
        </section>

        <section className="ws-problem ws-section-wrap" aria-labelledby="problem-title">
          <div className="ws-problem__intro"><p className="ws-eyebrow ws-eyebrow--ink">THE INVESTIGATION GAP</p><h2 id="problem-title">An error message rarely tells the whole story.</h2><p>A report like “checkout is slow” leaves the important questions unanswered.</p></div>
          <div className="ws-problem__case"><div className="ws-problem__report"><small>USER REPORT</small><p>“Checkout is slow.”</p></div><div className="ws-problem__questions"><small>WHAT YOU NEED TO KNOW</small><ul><li>What did the user do?</li><li>Which page were they on?</li><li>Which request was slow?</li><li>Did an error happen afterward?</li></ul></div><div className="ws-problem__answer"><span><Activity size={17} /></span><p>Web Starzz brings the session’s events together so you can follow the sequence and find the related issue.</p></div></div>
        </section>

        <section className="ws-workflow" id="workflow">
          <div className="ws-section-wrap"><div className="ws-section-heading"><div><p className="ws-eyebrow ws-eyebrow--ink">A CLEAR PATH FROM REPORT TO ROOT CAUSE</p><h2>How an investigation works</h2></div><p>Follow the evidence from a session to the event that needs attention.</p></div>
            <ol className="ws-steps">{steps.map((step, i) => <li key={step}><span className="ws-steps__number">0{i + 1}</span><span>{step}</span>{i < steps.length - 1 && <ArrowRight className="ws-steps__arrow" size={16} aria-hidden="true" />}</li>)}</ol>
          </div>
        </section>

        <section className="ws-features ws-section-wrap" id="features">
          <div className="ws-section-heading"><div><p className="ws-eyebrow ws-eyebrow--ink">BUILT AROUND THE SESSION</p><h2>Move from signal to context</h2></div><p>Inspect the records that help explain a user-facing problem.</p></div>
          <div className="ws-feature-grid">{features.map(({ icon: Icon, title, text }) => <article className="ws-feature" key={title}><span className="ws-feature__icon"><Icon size={17} /></span><h3>{title}</h3><p>{text}</p></article>)}</div>
        </section>

        <section className="ws-final-cta"><div><p className="ws-eyebrow">WEB STARZZ</p><h2>Investigate the problem,<br />not just the error.</h2><p>Open the sample environment and follow a session from user action to technical issue.</p><Link className="ws-button ws-button--light" to="/login">Open Web Starzz <ArrowRight size={15} /></Link></div></section>
      </main>
      <footer className="ws-landing-footer"><Link className="ws-landing-brand" to="/"><span><Zap size={15} fill="currentColor" /></span>Web Starzz</Link><p>Sample session data for exploring the investigation workflow.</p><div><Link to="/privacy">Privacy</Link><Link to="/terms">Terms</Link><Link to="/login">Login</Link></div></footer>
    </div>
  );
}
