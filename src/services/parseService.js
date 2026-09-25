import { Parse } from "./parseClient.js";

/**
 * Helper to convert Parse Object to plain JS object
 */
function toPlainObject(parseObj) {
  if (!parseObj) return null;
  const json = parseObj.toJSON();
  return {
    id: parseObj.id,
    ...json,
  };
}

function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function formatAverageDuration(seconds) {
  if (!seconds) return "0s";
  const rounded = Math.round(seconds);
  return rounded < 60 ? `${rounded}s` : `${Math.floor(rounded / 60)}m ${rounded % 60}s`;
}

export async function parseGetOverviewMetrics() {
  const totalSessions = await new Parse.Query("Session").count();
  const items = [];
  for (let skip = 0; skip < totalSessions; skip += 1000) {
    const query = new Parse.Query("Session");
    query.ascending("startedAt");
    query.skip(skip);
    query.limit(1000);
    items.push(...(await query.find()).map(toPlainObject));
  }
  const withErrors = items.filter((s) => (s.errorCount || 0) > 0 || s.status === "error");
  const avgDuration = items.length ? items.reduce((sum, s) => sum + (Number(s.duration) || 0), 0) / items.length : 0;
  return {
    totalSessions,
    errorRate: items.length ? `${((withErrors.length / items.length) * 100).toFixed(1)}%` : "0.0%",
    avgDuration: formatAverageDuration(avgDuration),
    avgEvents: items.length ? Math.round(items.reduce((sum, s) => sum + (Number(s.eventCount) || 0), 0) / items.length) : 0,
    sessionsWithErrors: withErrors.length,
  };
}

export async function parseGetRecentSessions(limit = 5) {
  const query = new Parse.Query("Session");
  query.descending("startedAt");
  query.limit(limit);
  return (await query.find()).map(toPlainObject);
}

export async function parseGetSessionsNeedingAttention(limit = 5) {
  const errorQuery = new Parse.Query("Session").greaterThan("errorCount", 0);
  const statusQuery = Parse.Query.or(
    new Parse.Query("Session").equalTo("status", "error"),
    new Parse.Query("Session").equalTo("status", "warning")
  );
  const query = Parse.Query.or(errorQuery, statusQuery);
  query.descending("startedAt");
  query.limit(limit);
  return (await query.find()).map(toPlainObject);
}

export async function parseGetRecentActivities(limit = 8) {
  const query = new Parse.Query("Event");
  query.descending("timestamp");
  query.limit(limit);
  return (await query.find()).map((obj) => {
    const event = toPlainObject(obj);
    const type = event.severity === "error" || event.eventType?.includes("error") ? "error" : event.severity === "warning" ? "warning" : "info";
    return {
      id: event.eventId || event.id,
      type,
      title: event.title || event.eventType || "Captured event",
      message: event.description || event.technicalDetails?.message || "Event captured",
      timestamp: event.timestamp,
      sessionId: event.sessionId,
      path: event.route,
    };
  }).filter((item) => item.sessionId);
}

export async function parseGetErrorOverviewMetrics() {
  const query = new Parse.Query("ErrorGroup");
  query.limit(1000);
  const groups = (await query.find()).map(toPlainObject);
  const sessions = new Set();
  let jsErrors = 0;
  let networkErrors = 0;
  for (const group of groups) {
    if (group.type === "JavaScript") jsErrors += Number(group.occurrences) || 0;
    if (group.type === "Network") networkErrors += Number(group.occurrences) || 0;
    const q = new Parse.Query("Event");
    q.equalTo("errorId", group.errorId);
    const matches = await q.find();
    matches.forEach((event) => sessions.add(event.get("sessionId")));
  }
  return {
    totalErrors: groups.reduce((sum, group) => sum + (Number(group.occurrences) || 0), 0),
    affectedSessions: sessions.size,
    jsErrors,
    networkErrors,
    groupedCount: groups.length,
  };
}

export async function parseGetPerformanceOverviewMetrics() {
  const query = new Parse.Query("PerformanceSignal");
  query.limit(1000);
  const signals = (await query.find()).map(toPlainObject);
  const count = signals.reduce((sum, item) => sum + (Number(item.occurrences) || 0), 0);
  const slow = signals.filter((item) => Number(item.duration) >= 2000);
  const avg = count ? Math.round(signals.reduce((sum, item) => sum + (Number(item.duration) || 0) * (Number(item.occurrences) || 0), 0) / count) : 0;
  const sessionIds = new Set();
  for (const signal of signals) {
    const events = new Parse.Query("Event").equalTo("perfId", signal.perfId);
    (await events.find()).forEach((event) => sessionIds.add(event.get("sessionId")));
  }
  return {
    perfSignalsCount: count,
    slowRequestsCount: slow.reduce((sum, item) => sum + (Number(item.occurrences) || 0), 0),
    avgDurationStr: avg >= 1000 ? `${(avg / 1000).toFixed(2)}s` : `${avg}ms`,
    affectedSessions: sessionIds.size,
  };
}

/* ==========================================================================
   SESSION PARSE QUERIES
   ========================================================================== */

export async function parseGetSessions({
  search = "",
  statusFilter = "all",
  errorFilter = "all",
  sortBy = "newest",
  page = 1,
  pageSize = 8,
} = {}) {
  let query = new Parse.Query("Session");

  if (search.trim()) {
    const term = escapeRegex(search.trim());
    const q1 = new Parse.Query("Session").matches("sessionId", term, "i");
    const q2 = new Parse.Query("Session").matches("lastPage", term, "i");
    const q3 = new Parse.Query("Session").matches("browser", term, "i");
    const q4 = new Parse.Query("Session").matches("device", term, "i");
    const q5 = new Parse.Query("Session").matches("operatingSystem", term, "i");
    const mainQuery = Parse.Query.or(q1, q2, q3, q4, q5);
    query = mainQuery;
  }

  if (statusFilter !== "all") {
    query.equalTo("status", statusFilter);
  }

  if (errorFilter === "has_errors") {
    query.greaterThan("errorCount", 0);
  } else if (errorFilter === "error_free") {
    query.equalTo("errorCount", 0);
  }

  switch (sortBy) {
    case "oldest":
      query.ascending("startedAt");
      break;
    case "duration_desc":
      query.descending("duration");
      break;
    case "duration_asc":
      query.ascending("duration");
      break;
    case "events_desc":
      query.descending("eventCount");
      break;
    case "errors_desc":
      query.descending("errorCount");
      break;
    case "newest":
    default:
      query.descending("startedAt");
      break;
  }

  query.skip((page - 1) * pageSize);
  query.limit(pageSize);

  const [results, totalCount] = await Promise.all([
    query.find(),
    query.count(),
  ]);

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));

  return {
    sessions: results.map(toPlainObject),
    totalCount,
    page,
    totalPages,
    pageSize,
  };
}

export async function parseGetSessionById(sessionId) {
  if (!sessionId) return null;
  const query = new Parse.Query("Session");
  query.equalTo("sessionId", sessionId);
  const result = await query.first();
  return toPlainObject(result);
}

/* ==========================================================================
   EVENT PARSE QUERIES
   ========================================================================== */

export async function parseGetSessionEvents(sessionId, category = "all") {
  if (!sessionId) return [];
  let query = new Parse.Query("Event");
  query.equalTo("sessionId", sessionId);

  if (category !== "all") {
    if (category === "errors") {
      query = Parse.Query.or(
        new Parse.Query("Event").equalTo("sessionId", sessionId).containedIn("eventType", ["javascript_error", "console_error", "network_error"]),
        new Parse.Query("Event").equalTo("sessionId", sessionId).equalTo("severity", "error")
      );
    } else if (category === "performance") {
      query = Parse.Query.or(
        new Parse.Query("Event").equalTo("sessionId", sessionId).equalTo("eventType", "performance"),
        new Parse.Query("Event").equalTo("sessionId", sessionId).greaterThan("duration", 2000)
      );
    } else if (category === "user_actions") {
      query.equalTo("eventType", "user_action");
    } else if (category === "network_api") {
      query.containedIn("eventType", ["api_request", "api_response", "network_error"]);
    } else if (category === "navigation") {
      query.containedIn("eventType", ["navigation", "page_load"]);
    }
  }

  query.ascending("timestamp");
  query.limit(1000);
  const results = await query.find();
  return results.map(toPlainObject);
}

/* ==========================================================================
   ERROR GROUP PARSE QUERIES
   ========================================================================== */

export async function parseGetGroupedErrors({ search = "", typeFilter = "all", severityFilter = "all" } = {}) {
  let query = new Parse.Query("ErrorGroup");

  if (search.trim()) {
    const term = escapeRegex(search.trim());
    const q1 = new Parse.Query("ErrorGroup").matches("title", term, "i");
    const q2 = new Parse.Query("ErrorGroup").matches("message", term, "i");
    const q3 = new Parse.Query("ErrorGroup").matches("route", term, "i");
    const mainQuery = Parse.Query.or(q1, q2, q3);
    query = mainQuery;
  }

  if (typeFilter !== "all") {
    const normalizedType = { javascript: "JavaScript", network: "Network", console: "Console" }[typeFilter.toLowerCase()] || typeFilter;
    query.equalTo("type", normalizedType);
  }

  if (severityFilter !== "all") {
    query.equalTo("severity", severityFilter);
  }

  query.descending("occurrences");
  query.limit(1000);
  const results = (await query.find()).map(toPlainObject);
  return Promise.all(results.map(async (group) => {
    const eventsQuery = new Parse.Query("Event");
    eventsQuery.equalTo("errorId", group.errorId);
    const events = (await eventsQuery.find()).map(toPlainObject);
    const sessions = new Set(events.map((event) => event.sessionId));
    const timestamps = events.map((event) => event.timestamp).filter(Boolean).sort();
    return {
      ...group,
      occurrences: group.occurrences ?? events.length,
      affectedSessionsCount: group.affectedSessionsCount ?? sessions.size,
      firstSeen: group.firstSeen || timestamps[0] || "",
      lastSeen: group.lastSeen || timestamps[timestamps.length - 1] || "",
      sampleEvent: group.sampleEvent || events[0] || null,
      errorName: group.errorName || group.title?.split(":")[0] || "Error",
    };
  }));
}

export async function parseGetErrorById(errorId) {
  if (!errorId) return null;
  const query = new Parse.Query("ErrorGroup");
  query.equalTo("errorId", errorId);
  const result = await query.first();
  if (!result) return null;
  const group = toPlainObject(result);
  const eventsQuery = new Parse.Query("Event");
  eventsQuery.equalTo("errorId", errorId);
  const events = (await eventsQuery.find()).map(toPlainObject);
  const timestamps = events.map((event) => event.timestamp).filter(Boolean).sort();
  return {
    ...group,
    occurrences: group.occurrences ?? events.length,
    affectedSessionsCount: new Set(events.map((event) => event.sessionId)).size,
    firstSeen: group.firstSeen || timestamps[0] || "",
    lastSeen: group.lastSeen || timestamps[timestamps.length - 1] || "",
    sampleEvent: group.sampleEvent || events[0] || null,
    errorName: group.errorName || group.title?.split(":")[0] || "Error",
  };
}

export async function parseGetSessionsAffectedByError(errorId) {
  if (!errorId) return [];
  const query = new Parse.Query("Event");
  query.equalTo("errorId", errorId);
  query.include("session");
  const results = await query.find();
  return results.map((evt) => {
    const plainEvt = toPlainObject(evt);
    const sessionObj = evt.get("session") ? toPlainObject(evt.get("session")) : {};
    return {
      eventId: plainEvt.eventId,
      sessionId: plainEvt.sessionId,
      timestamp: plainEvt.timestamp,
      route: plainEvt.route,
      browser: sessionObj.browser || "Unknown",
      operatingSystem: sessionObj.operatingSystem || "Unknown",
      device: sessionObj.device || "Desktop",
      sessionStatus: sessionObj.status || "error",
    };
  });
}

/* ==========================================================================
   PERFORMANCE SIGNAL PARSE QUERIES
   ========================================================================== */

export async function parseGetGroupedPerformanceEvents({ search = "", typeFilter = "all", sortBy = "duration_desc" } = {}) {
  let query = new Parse.Query("PerformanceSignal");

  if (search.trim()) {
    const term = escapeRegex(search.trim());
    const q1 = new Parse.Query("PerformanceSignal").matches("title", term, "i");
    const q2 = new Parse.Query("PerformanceSignal").matches("route", term, "i");
    const mainQuery = Parse.Query.or(q1, q2);
    query = mainQuery;
  }

  if (typeFilter !== "all") {
    if (typeFilter === "slow_requests") {
      query.greaterThanOrEqualTo("duration", 2000);
    } else if (typeFilter === "api") {
      query.equalTo("type", "API Request");
    } else if (typeFilter === "page_load") {
      query.equalTo("type", "Page Load");
    } else if (typeFilter === "other") {
      query.equalTo("type", "Performance Signal");
    }
  }

  if (sortBy === "occurrences") {
    query.descending("occurrences");
  } else {
  query.descending("duration");
  query.limit(1000);
  }

  const results = (await query.find()).map(toPlainObject);
  return Promise.all(results.map(async (signal) => {
    const eventsQuery = new Parse.Query("Event");
    eventsQuery.equalTo("perfId", signal.perfId);
    const events = (await eventsQuery.find()).map(toPlainObject);
    return {
      ...signal,
      occurrences: signal.occurrences ?? events.length,
      affectedSessionsCount: signal.affectedSessionsCount ?? new Set(events.map((event) => event.sessionId)).size,
      timestamp: signal.timestamp || events.map((event) => event.timestamp).filter(Boolean).sort().at(-1) || "",
      sampleEvent: signal.sampleEvent || events[0] || null,
    };
  }));
}

export async function parseGetPerformanceEventById(perfId) {
  if (!perfId) return null;
  const query = new Parse.Query("PerformanceSignal");
  query.equalTo("perfId", perfId);
  const result = await query.first();
  return toPlainObject(result);
}

export async function parseGetSessionsAffectedByPerformanceEvent(perfId) {
  if (!perfId) return [];
  const query = new Parse.Query("Event");
  query.equalTo("perfId", perfId);
  query.include("session");
  const results = await query.find();
  return results.map((evt) => {
    const plainEvt = toPlainObject(evt);
    const sessionObj = evt.get("session") ? toPlainObject(evt.get("session")) : {};
    return {
      eventId: plainEvt.eventId,
      sessionId: plainEvt.sessionId,
      timestamp: plainEvt.timestamp,
      route: plainEvt.route,
      duration: plainEvt.duration,
      browser: sessionObj.browser || "Unknown",
      operatingSystem: sessionObj.operatingSystem || "Unknown",
      device: sessionObj.device || "Desktop",
    };
  });
}

/* ==========================================================================
   INVESTIGATIONS PARSE QUERIES
   ========================================================================== */

export async function parseGetInvestigations({ search = "", statusFilter = "all", priorityFilter = "all" } = {}) {
  let query = new Parse.Query("Investigation");

  if (search.trim()) {
    const term = escapeRegex(search.trim());
    const q1 = new Parse.Query("Investigation").matches("title", term, "i");
    const q2 = new Parse.Query("Investigation").matches("description", term, "i");
    const mainQuery = Parse.Query.or(q1, q2);
    query = mainQuery;
  }

  if (statusFilter !== "all") {
    query.equalTo("status", statusFilter);
  }

  if (priorityFilter !== "all") {
    query.equalTo("priority", priorityFilter);
  }

  query.descending("createdAt");
  query.limit(1000);
  const results = await query.find();
  return results.map(toPlainObject);
}

export async function parseGetInvestigationById(id) {
  if (!id) return null;
  const query = new Parse.Query("Investigation");
  query.equalTo("investigationId", id);
  const result = await query.first();
  return toPlainObject(result);
}

export async function parseCreateInvestigation(data) {
  const ParseObj = Parse.Object.extend("Investigation");
  const inv = new ParseObj();
  const investigationId = `inv_${Date.now().toString(36)}`;
  
  inv.set("investigationId", investigationId);
  inv.set("title", data.title);
  inv.set("description", data.description || "");
  inv.set("status", data.status || "open");
  inv.set("priority", data.priority || "medium");
  inv.set("createdAt", new Date().toISOString());
  inv.set("updatedAt", new Date().toISOString());
  inv.set("relatedSessionIds", data.relatedSessionIds || []);
  inv.set("relatedErrorIds", data.relatedErrorIds || []);
  inv.set("relatedPerformanceIds", data.relatedPerformanceIds || []);

  const saved = await inv.save();
  return toPlainObject(saved);
}

export async function parseUpdateInvestigation(id, updates) {
  const query = new Parse.Query("Investigation");
  query.equalTo("investigationId", id);
  const inv = await query.first();
  if (!inv) throw new Error("Investigation not found");

  if (updates.title) inv.set("title", updates.title);
  if (updates.description !== undefined) inv.set("description", updates.description);
  if (updates.status) inv.set("status", updates.status);
  if (updates.priority) inv.set("priority", updates.priority);
  inv.set("updatedAt", new Date().toISOString());

  const saved = await inv.save();
  return toPlainObject(saved);
}
