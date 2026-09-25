import { Parse } from "./parseClient.js";
import { mockSessions } from "./demoData.js";
import { mockSessionEvents, generateDefaultSessionEvents } from "./sessionEvents.js";
import { mockInvestigations } from "./investigationData.js";

/**
 * Idempotent Parse Database Seeder Utility
 * 
 * Populates Parse Server with initial Session, Event, ErrorGroup, PerformanceSignal,
 * and Investigation classes.
 */
export async function seedParseDatabase() {
  console.info("[Web Starzz Seeder] Starting idempotent database seed...");

  // 1. Seed Sessions
  const sessionObjectsMap = new Map();
  for (const s of mockSessions) {
    const SessionClass = Parse.Object.extend("Session");
    const q = new Parse.Query("Session");
    q.equalTo("sessionId", s.sessionId);
    let sessionObj = await q.first();

    if (!sessionObj) {
      sessionObj = new SessionClass();
    }

    sessionObj.set("sessionId", s.sessionId);
    sessionObj.set("startedAt", s.startedAt);
    sessionObj.set("duration", s.duration);
    sessionObj.set("eventCount", s.eventCount);
    sessionObj.set("errorCount", s.errorCount);
    sessionObj.set("browser", s.browser);
    sessionObj.set("browserVersion", s.browserVersion);
    sessionObj.set("operatingSystem", s.operatingSystem);
    sessionObj.set("device", s.device);
    sessionObj.set("lastPage", s.lastPage);
    sessionObj.set("status", s.status);
    sessionObj.set("userFlow", s.userFlow || []);
    if (s.errorMessage) sessionObj.set("errorMessage", s.errorMessage);
    if (s.userId) sessionObj.set("userId", s.userId);

    const savedSession = await sessionObj.save();
    sessionObjectsMap.set(s.sessionId, savedSession);
  }
  console.info(`[Web Starzz Seeder] Seeded ${sessionObjectsMap.size} Session records.`);

  // 2. Seed Events
  let eventCount = 0;
  for (const s of mockSessions) {
    const events = mockSessionEvents[s.sessionId] || generateDefaultSessionEvents(s);
    const parentSession = sessionObjectsMap.get(s.sessionId);

    for (const evt of events) {
      const EventClass = Parse.Object.extend("Event");
      const q = new Parse.Query("Event");
      q.equalTo("eventId", evt.eventId);
      let eventObj = await q.first();

      if (!eventObj) {
        eventObj = new EventClass();
      }

      eventObj.set("eventId", evt.eventId);
      eventObj.set("sessionId", evt.sessionId);
      eventObj.set("timestamp", evt.timestamp);
      eventObj.set("relativeTime", evt.relativeTime || "");
      eventObj.set("eventType", evt.eventType);
      eventObj.set("title", evt.title);
      eventObj.set("description", evt.description || "");
      eventObj.set("route", evt.route || "/");
      eventObj.set("severity", evt.severity || "info");
      if (evt.duration !== undefined) eventObj.set("duration", evt.duration);
      if (evt.errorId) eventObj.set("errorId", evt.errorId);
      if (evt.perfId) eventObj.set("perfId", evt.perfId);
      if (evt.metadata) eventObj.set("metadata", evt.metadata);
      if (evt.technicalDetails) eventObj.set("technicalDetails", evt.technicalDetails);

      if (parentSession) {
        eventObj.set("session", parentSession);
      }

      await eventObj.save();
      eventCount += 1;
    }
  }
  console.info(`[Web Starzz Seeder] Seeded ${eventCount} Event records.`);

  // 3. Seed Error Groups
  const errorGroups = [
    { errorId: "err_payment_widget_typeerror", title: "TypeError: PaymentWidget is undefined", message: "Cannot read properties of undefined (reading 'renderError')", type: "JavaScript", severity: "error", route: "/checkout/payment", occurrences: 3 },
    { errorId: "err_payment_timeout_504", title: "HTTP 504 Gateway Timeout", message: "Upstream processor timed out", type: "Network", severity: "error", route: "/checkout/payment", occurrences: 1 },
    { errorId: "err_websocket_502", title: "WebSocket Connection Failed (502 Bad Gateway)", message: "WebSocket handshake failed with status code 502", type: "Network", severity: "error", route: "/projects/build-logs", occurrences: 1 },
    { errorId: "err_chunk_load_404", title: "Failed to load asset chunk 404", message: "Loading chunk 404 failed", type: "JavaScript", severity: "error", route: "/deployments/production", occurrences: 1 },
    { errorId: "err_cors_header_missing", title: "NetworkError: CORS header missing", message: "CORS header 'Access-Control-Allow-Origin' missing", type: "Network", severity: "error", route: "/database/clusters", occurrences: 1 }
  ];

  for (const errGroup of errorGroups) {
    const ErrClass = Parse.Object.extend("ErrorGroup");
    const q = new Parse.Query("ErrorGroup");
    q.equalTo("errorId", errGroup.errorId);
    let errObj = await q.first();

    if (!errObj) {
      errObj = new ErrClass();
    }

    errObj.set("errorId", errGroup.errorId);
    errObj.set("title", errGroup.title);
    errObj.set("message", errGroup.message);
    errObj.set("type", errGroup.type);
    errObj.set("severity", errGroup.severity);
    errObj.set("route", errGroup.route);
    errObj.set("occurrences", errGroup.occurrences);
    await errObj.save();
  }
  console.info(`[Web Starzz Seeder] Seeded ${errorGroups.length} ErrorGroup records.`);

  // 4. Seed Performance Signals
  const perfSignals = [
    { perfId: "perf_slow_payment_charge", title: "POST /api/v2/payment/charge", description: "Payment charge payload latency threshold 2.0s exceeded.", type: "API Request", duration: 5210, threshold: "2000ms", route: "/checkout/payment", occurrences: 2 },
    { perfId: "perf_asset_chunk_size", title: "Chunk Size Exceeds Recommended Limit", description: "Asset payload size 4.2MB exceeds recommended threshold 2.0MB.", type: "Performance Signal", duration: 1850, threshold: "2.0 MB", route: "/upload", occurrences: 1 }
  ];

  for (const perfSig of perfSignals) {
    const PerfClass = Parse.Object.extend("PerformanceSignal");
    const q = new Parse.Query("PerformanceSignal");
    q.equalTo("perfId", perfSig.perfId);
    let perfObj = await q.first();

    if (!perfObj) {
      perfObj = new PerfClass();
    }

    perfObj.set("perfId", perfSig.perfId);
    perfObj.set("title", perfSig.title);
    perfObj.set("description", perfSig.description);
    perfObj.set("type", perfSig.type);
    perfObj.set("duration", perfSig.duration);
    perfObj.set("threshold", perfSig.threshold);
    perfObj.set("route", perfSig.route);
    perfObj.set("occurrences", perfSig.occurrences);
    await perfObj.save();
  }
  console.info(`[Web Starzz Seeder] Seeded ${perfSignals.length} PerformanceSignal records.`);

  // 5. Seed Investigations
  for (const inv of mockInvestigations) {
    const InvClass = Parse.Object.extend("Investigation");
    const q = new Parse.Query("Investigation");
    q.equalTo("investigationId", inv.investigationId);
    let invObj = await q.first();

    if (!invObj) {
      invObj = new InvClass();
    }

    invObj.set("investigationId", inv.investigationId);
    invObj.set("title", inv.title);
    invObj.set("description", inv.description);
    invObj.set("status", inv.status);
    invObj.set("priority", inv.priority);
    invObj.set("createdAt", inv.createdAt);
    invObj.set("updatedAt", inv.updatedAt);
    invObj.set("relatedSessionIds", inv.relatedSessionIds || []);
    invObj.set("relatedErrorIds", inv.relatedErrorIds || []);
    invObj.set("relatedPerformanceIds", inv.relatedPerformanceIds || []);
    await invObj.save();
  }
  console.info(`[Web Starzz Seeder] Seeded ${mockInvestigations.length} Investigation records.`);

  console.info("[Web Starzz Seeder] Database seeding completed cleanly.");
  return true;
}
