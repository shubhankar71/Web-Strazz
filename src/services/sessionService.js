/**
 * Centralized Session & Application Service Abstraction Layer
 * 
 * Decouples React UI components from data providers.
 * Supports dual-mode operation:
 *  - DEMO MODE (VITE_DATA_SOURCE=demo): In-memory mock store
 *  - PARSE MODE (VITE_DATA_SOURCE=parse): Parse Server JS SDK queries
 */

import { mockSessions, mockActivities } from "./demoData.js";
import { mockSessionEvents, generateDefaultSessionEvents } from "./sessionEvents.js";
import { mockInvestigations } from "./investigationData.js";
import { isParseModeRequested, assertDataSourceReady } from "./parseClient.js";
import * as parseService from "./parseService.js";
import {
  calculateTotalSessions,
  calculateErrorRate,
  calculateAvgDuration,
  calculateAvgEvents,
  countSessionsWithErrors,
  getSessionsNeedingAttention as getAttentionUtils,
  getRecentSessions as getRecentUtils
} from "../utils/sessionMetrics.js";

// In-memory editable investigations for Demo Mode
let inMemoryInvestigations = [...mockInvestigations];

/**
 * Check active data source mode.
 */
export function isParseModeActive() {
  return isParseModeRequested();
}

/* ==========================================================================
   OVERVIEW METRICS
   ========================================================================== */

export async function getOverviewMetrics() {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetOverviewMetrics();
  return {
    totalSessions: calculateTotalSessions(mockSessions),
    errorRate: calculateErrorRate(mockSessions),
    avgDuration: calculateAvgDuration(mockSessions),
    avgEvents: calculateAvgEvents(mockSessions),
    sessionsWithErrors: countSessionsWithErrors(mockSessions),
  };
}

export async function getRecentSessions(limit = 5) {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetRecentSessions(limit);
  return getRecentUtils(mockSessions, limit);
}

export async function getSessionsNeedingAttention(limit = 5) {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetSessionsNeedingAttention(limit);
  return getAttentionUtils(mockSessions, limit);
}

export async function getRecentActivities() {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetRecentActivities();
  return mockActivities;
}

/* ==========================================================================
   SESSIONS QUERIES
   ========================================================================== */

export async function getSessionById(sessionId) {
  assertDataSourceReady();
  if (!sessionId) return null;
  if (isParseModeRequested()) {
    return parseService.parseGetSessionById(sessionId);
  }
  return mockSessions.find((s) => s.sessionId.toLowerCase() === sessionId.toLowerCase()) || null;
}

export async function getSessions({
  search = "",
  statusFilter = "all",
  errorFilter = "all",
  sortBy = "newest",
  page = 1,
  pageSize = 8,
} = {}) {
  assertDataSourceReady();
  if (isParseModeRequested()) {
    return parseService.parseGetSessions({ search, statusFilter, errorFilter, sortBy, page, pageSize });
  }

  let result = [...mockSessions];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(
      (s) =>
        s.sessionId.toLowerCase().includes(term) ||
        s.lastPage.toLowerCase().includes(term) ||
        s.browser.toLowerCase().includes(term) ||
        s.device.toLowerCase().includes(term) ||
        s.operatingSystem.toLowerCase().includes(term)
    );
  }

  if (statusFilter !== "all") {
    result = result.filter((s) => s.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (errorFilter === "has_errors") {
    result = result.filter((s) => s.errorCount > 0 || s.status === "error");
  } else if (errorFilter === "error_free") {
    result = result.filter((s) => s.errorCount === 0 && s.status !== "error");
  }

  switch (sortBy) {
    case "oldest":
      result.sort((a, b) => new Date(a.startedAt) - new Date(b.startedAt));
      break;
    case "duration_desc":
      result.sort((a, b) => b.duration - a.duration);
      break;
    case "duration_asc":
      result.sort((a, b) => a.duration - b.duration);
      break;
    case "events_desc":
      result.sort((a, b) => b.eventCount - a.eventCount);
      break;
    case "errors_desc":
      result.sort((a, b) => b.errorCount - a.errorCount);
      break;
    case "newest":
    default:
      result.sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt));
      break;
  }

  const totalCount = result.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const currentPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedSessions = result.slice(startIndex, startIndex + pageSize);

  return {
    sessions: paginatedSessions,
    totalCount,
    page: currentPage,
    totalPages,
    pageSize,
  };
}

/* ==========================================================================
   EVENT & TIMELINE QUERIES
   ========================================================================== */

export async function getSessionEvents(sessionId, category = "all") {
  assertDataSourceReady();
  if (!sessionId) return [];
  if (isParseModeRequested()) {
    return parseService.parseGetSessionEvents(sessionId, category);
  }

  const session = await getSessionById(sessionId);
  if (!session) return [];

  let events = mockSessionEvents[sessionId] || generateDefaultSessionEvents(session);

  if (category !== "all") {
    events = events.filter((evt) => {
      switch (category) {
        case "errors":
          return (
            evt.eventType === "javascript_error" ||
            evt.eventType === "console_error" ||
            evt.eventType === "network_error" ||
            evt.severity === "error"
          );
        case "performance":
          return evt.eventType === "performance" || (evt.duration && evt.duration > 2000);
        case "user_actions":
          return evt.eventType === "user_action";
        case "network_api":
          return (
            evt.eventType === "api_request" ||
            evt.eventType === "api_response" ||
            evt.eventType === "network_error"
          );
        case "navigation":
          return evt.eventType === "navigation" || evt.eventType === "page_load";
        default:
          return true;
      }
    });
  }

  return events;
}

export async function getSessionTimelineSummary(sessionId) {
  const allEvents = await getSessionEvents(sessionId, "all");
  const errors = allEvents.filter(
    (e) => e.severity === "error" || e.eventType.includes("error")
  );
  const apiRequests = allEvents.filter(
    (e) => e.eventType === "api_request" || e.eventType === "network_error"
  );
  const perfSignals = allEvents.filter(
    (e) => e.eventType === "performance" || (e.duration && e.duration > 2000)
  );

  return {
    totalEvents: allEvents.length,
    errorCount: errors.length,
    apiCount: apiRequests.length,
    perfCount: perfSignals.length,
  };
}

export async function generateInvestigationSignal(sessionId) {
  const session = await getSessionById(sessionId);
  if (!session) return "Session not found.";

  const events = await getSessionEvents(sessionId, "all");
  const jsErrors = events.filter((e) => e.eventType === "javascript_error");
  const netErrors = events.filter((e) => e.eventType === "network_error" || (e.eventType === "api_response" && e.severity === "error"));
  const slowPerf = events.filter((e) => e.eventType === "performance" || (e.duration && e.duration > 2000));
  const warnings = events.filter((e) => e.severity === "warning");

  if (jsErrors.length > 0 && netErrors.length > 0) {
    const netErr = netErrors[0];
    const jsErr = jsErrors[0];
    return `Investigation signal detected: ${netErr.title} (${netErr.description}) was followed by JavaScript exception "${jsErr.technicalDetails?.errorName || jsErr.title}: ${jsErr.technicalDetails?.message || ""}" on ${jsErr.route}.`;
  }

  if (jsErrors.length > 0) {
    const jsErr = jsErrors[0];
    return `Investigation signal detected: Unhandled Exception "${jsErr.title}" captured on ${jsErr.route} (${jsErr.technicalDetails?.source || "script"}:${jsErr.technicalDetails?.line || 0}).`;
  }

  if (netErrors.length > 0) {
    const netErr = netErrors[0];
    return `Investigation signal detected: Network failure "${netErr.title}" recorded on ${netErr.route}.`;
  }

  if (slowPerf.length > 0) {
    const perf = slowPerf[0];
    return `Performance signal detected: ${perf.title}: ${perf.description} on ${perf.route}.`;
  }

  if (warnings.length > 0) {
    const warn = warnings[0];
    return `Warning signal detected: ${warn.title} on ${warn.route}.`;
  }

  return `Session completed normally. All ${events.length} captured events (including page load, navigation, and API requests) executed within expected parameters with 0 errors.`;
}

/* ==========================================================================
   ERRORS QUERIES & METRICS
   ========================================================================== */

async function getAllRawErrorEvents() {
  const rawEvents = [];
  for (const session of mockSessions) {
    const events = await getSessionEvents(session.sessionId, "all");
    events.forEach((evt) => {
      if (evt.errorId || evt.severity === "error" || evt.eventType.includes("error")) {
        rawEvents.push({ ...evt, session });
      }
    });
  }
  return rawEvents;
}

export async function getGroupedErrors({ search = "", typeFilter = "all", severityFilter = "all" } = {}) {
  assertDataSourceReady();
  if (isParseModeRequested()) {
    return parseService.parseGetGroupedErrors({ search, typeFilter, severityFilter });
  }

  const rawErrors = await getAllRawErrorEvents();
  const map = new Map();

  rawErrors.forEach((item) => {
    const key = item.errorId || `${item.eventType}_${item.title.replace(/[^a-z0-9]/gi, '_')}`;
    
    if (!map.has(key)) {
      map.set(key, {
        errorId: key,
        title: item.title,
        message: item.technicalDetails?.message || item.description,
        errorName: item.technicalDetails?.errorName || item.title.split(":")[0],
        type: item.eventType === "javascript_error" ? "JavaScript" : item.eventType === "network_error" ? "Network" : "Console",
        eventType: item.eventType,
        severity: item.severity || "error",
        route: item.route,
        firstSeen: item.timestamp,
        lastSeen: item.timestamp,
        occurrences: 0,
        affectedSessionIds: new Set(),
        sampleEvent: item,
      });
    }

    const group = map.get(key);
    group.occurrences += 1;
    group.affectedSessionIds.add(item.sessionId);

    if (new Date(item.timestamp) < new Date(group.firstSeen)) group.firstSeen = item.timestamp;
    if (new Date(item.timestamp) > new Date(group.lastSeen)) group.lastSeen = item.timestamp;
  });

  let result = Array.from(map.values()).map((g) => ({
    ...g,
    affectedSessionsCount: g.affectedSessionIds.size,
  }));

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(
      (e) =>
        e.title.toLowerCase().includes(term) ||
        e.message.toLowerCase().includes(term) ||
        e.route.toLowerCase().includes(term) ||
        e.type.toLowerCase().includes(term)
    );
  }

  if (typeFilter !== "all") {
    result = result.filter((e) => e.type.toLowerCase() === typeFilter.toLowerCase());
  }

  if (severityFilter !== "all") {
    result = result.filter((e) => e.severity.toLowerCase() === severityFilter.toLowerCase());
  }

  result.sort((a, b) => b.occurrences - a.occurrences);
  return result;
}

export async function getErrorById(errorId) {
  assertDataSourceReady();
  if (!errorId) return null;
  if (isParseModeRequested()) {
    return parseService.parseGetErrorById(errorId);
  }
  const allErrors = await getGroupedErrors();
  return allErrors.find((e) => e.errorId.toLowerCase() === errorId.toLowerCase()) || null;
}

export async function getSessionsAffectedByError(errorId) {
  assertDataSourceReady();
  if (!errorId) return [];
  if (isParseModeRequested()) {
    return parseService.parseGetSessionsAffectedByError(errorId);
  }
  const rawErrors = await getAllRawErrorEvents();
  const occurrences = rawErrors.filter((item) => {
    const key = item.errorId || `${item.eventType}_${item.title.replace(/[^a-z0-9]/gi, '_')}`;
    return key.toLowerCase() === errorId.toLowerCase();
  });

  return occurrences.map((occ) => ({
    eventId: occ.eventId,
    sessionId: occ.sessionId,
    timestamp: occ.timestamp,
    route: occ.route,
    browser: occ.session.browser,
    operatingSystem: occ.session.operatingSystem,
    device: occ.session.device,
    sessionStatus: occ.session.status,
  }));
}

export async function getErrorOverviewMetrics() {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetErrorOverviewMetrics();
  const grouped = await getGroupedErrors();
  const raw = await getAllRawErrorEvents();
  const totalErrors = raw.length;
  const affectedSessions = new Set(raw.map((r) => r.sessionId)).size;
  const jsErrors = raw.filter((r) => r.eventType === "javascript_error").length;
  const networkErrors = raw.filter((r) => r.eventType === "network_error" || (r.eventType === "api_response" && r.severity === "error")).length;

  return {
    totalErrors,
    affectedSessions,
    jsErrors,
    networkErrors,
    groupedCount: grouped.length,
  };
}

/* ==========================================================================
   PERFORMANCE QUERIES & METRICS
   ========================================================================== */

async function getAllRawPerformanceEvents() {
  const rawEvents = [];
  for (const session of mockSessions) {
    const events = await getSessionEvents(session.sessionId, "all");
    events.forEach((evt) => {
      if (
        evt.perfId ||
        evt.eventType === "performance" ||
        (evt.duration && evt.duration >= 1000)
      ) {
        rawEvents.push({ ...evt, session });
      }
    });
  }
  return rawEvents;
}

export async function getGroupedPerformanceEvents({ search = "", typeFilter = "all", sortBy = "duration_desc" } = {}) {
  assertDataSourceReady();
  if (isParseModeRequested()) {
    return parseService.parseGetGroupedPerformanceEvents({ search, typeFilter, sortBy });
  }

  const rawPerf = await getAllRawPerformanceEvents();
  const map = new Map();

  rawPerf.forEach((item) => {
    const key = item.perfId || `${item.eventType}_${item.route.replace(/[^a-z0-9]/gi, '_')}`;

    if (!map.has(key)) {
      map.set(key, {
        perfId: key,
        title: item.title,
        description: item.description,
        type: item.eventType === "api_request" || item.eventType === "api_response" ? "API Request" : item.eventType === "page_load" ? "Page Load" : "Performance Signal",
        eventType: item.eventType,
        route: item.route,
        duration: item.duration || 0,
        status: item.technicalDetails?.status || (item.duration > 2000 ? "Slow" : "Warning"),
        threshold: item.technicalDetails?.threshold || "2000ms",
        occurrences: 0,
        affectedSessionIds: new Set(),
        sampleEvent: item,
        timestamp: item.timestamp,
      });
    }

    const group = map.get(key);
    group.occurrences += 1;
    group.affectedSessionIds.add(item.sessionId);
    if ((item.duration || 0) > group.duration) {
      group.duration = item.duration;
    }
  });

  let result = Array.from(map.values()).map((g) => ({
    ...g,
    affectedSessionsCount: g.affectedSessionIds.size,
  }));

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(
      (p) =>
        p.title.toLowerCase().includes(term) ||
        p.route.toLowerCase().includes(term) ||
        p.type.toLowerCase().includes(term)
    );
  }

  if (typeFilter !== "all") {
    if (typeFilter === "slow_requests") {
      result = result.filter((p) => p.duration >= 2000);
    } else if (typeFilter === "api") {
      result = result.filter((p) => p.type === "API Request");
    } else if (typeFilter === "page_load") {
      result = result.filter((p) => p.type === "Page Load");
    } else if (typeFilter === "other") {
      result = result.filter((p) => p.type === "Performance Signal");
    }
  }

  if (sortBy === "occurrences") {
    result.sort((a, b) => b.occurrences - a.occurrences);
  } else if (sortBy === "recent") {
    result.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  } else {
    result.sort((a, b) => b.duration - a.duration);
  }

  return result;
}

export async function getPerformanceEventById(perfId) {
  assertDataSourceReady();
  if (!perfId) return null;
  if (isParseModeRequested()) {
    return parseService.parseGetPerformanceEventById(perfId);
  }
  const allPerf = await getGroupedPerformanceEvents();
  return allPerf.find((p) => p.perfId.toLowerCase() === perfId.toLowerCase()) || null;
}

export async function getSessionsAffectedByPerformanceEvent(perfId) {
  assertDataSourceReady();
  if (!perfId) return [];
  if (isParseModeRequested()) {
    return parseService.parseGetSessionsAffectedByPerformanceEvent(perfId);
  }
  const rawPerf = await getAllRawPerformanceEvents();
  const occurrences = rawPerf.filter((item) => {
    const key = item.perfId || `${item.eventType}_${item.route.replace(/[^a-z0-9]/gi, '_')}`;
    return key.toLowerCase() === perfId.toLowerCase();
  });

  return occurrences.map((occ) => ({
    eventId: occ.eventId,
    sessionId: occ.sessionId,
    timestamp: occ.timestamp,
    route: occ.route,
    duration: occ.duration,
    browser: occ.session.browser,
    operatingSystem: occ.session.operatingSystem,
    device: occ.session.device,
  }));
}

export async function getPerformanceOverviewMetrics() {
  assertDataSourceReady();
  if (isParseModeRequested()) return parseService.parseGetPerformanceOverviewMetrics();
  const raw = await getAllRawPerformanceEvents();
  const perfSignalsCount = raw.length;
  const slowRequestsCount = raw.filter((r) => r.duration && r.duration >= 2000).length;
  const affectedSessions = new Set(raw.map((r) => r.sessionId)).size;

  const totalDuration = raw.reduce((sum, r) => sum + (r.duration || 0), 0);
  const avgDurationMs = raw.length ? Math.round(totalDuration / raw.length) : 0;
  const avgDurationStr = avgDurationMs >= 1000 ? `${(avgDurationMs / 1000).toFixed(2)}s` : `${avgDurationMs}ms`;

  return {
    perfSignalsCount,
    slowRequestsCount,
    avgDurationStr,
    affectedSessions,
  };
}

/* ==========================================================================
   INVESTIGATIONS QUERIES & MUTATIONS
   ========================================================================== */

export async function getInvestigations({ search = "", statusFilter = "all", priorityFilter = "all" } = {}) {
  assertDataSourceReady();
  if (isParseModeRequested()) {
    return parseService.parseGetInvestigations({ search, statusFilter, priorityFilter });
  }

  let result = [...inMemoryInvestigations];

  if (search.trim()) {
    const term = search.trim().toLowerCase();
    result = result.filter(
      (inv) =>
        inv.title.toLowerCase().includes(term) ||
        inv.description.toLowerCase().includes(term) ||
        inv.investigationId.toLowerCase().includes(term)
    );
  }

  if (statusFilter !== "all") {
    result = result.filter((inv) => inv.status.toLowerCase() === statusFilter.toLowerCase());
  }

  if (priorityFilter !== "all") {
    result = result.filter((inv) => inv.priority.toLowerCase() === priorityFilter.toLowerCase());
  }

  result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  return result;
}

export async function getInvestigationById(id) {
  assertDataSourceReady();
  if (!id) return null;
  if (isParseModeRequested()) {
    return parseService.parseGetInvestigationById(id);
  }
  return inMemoryInvestigations.find((inv) => inv.investigationId.toLowerCase() === id.toLowerCase()) || null;
}

export async function validateInvestigationReferences({
  relatedSessionIds = [],
  relatedErrorIds = [],
  relatedPerformanceIds = [],
} = {}) {
  assertDataSourceReady();
  const checks = [
    ["sessionId", relatedSessionIds, getSessionById],
    ["errorId", relatedErrorIds, getErrorById],
    ["perfId", relatedPerformanceIds, getPerformanceEventById],
  ];
  const errors = {};
  await Promise.all(checks.map(async ([field, ids, getter]) => {
    for (const id of ids) {
      const normalized = String(id || "").trim();
      if (normalized && !await getter(normalized)) {
        errors[field] = `No matching ${field === "sessionId" ? "session" : field === "errorId" ? "error" : "performance signal"} was found.`;
      }
    }
  }));
  return errors;
}

export async function createInvestigation(data) {
  assertDataSourceReady();
  const referenceErrors = await validateInvestigationReferences(data);
  if (Object.keys(referenceErrors).length) {
    throw Object.assign(new Error("Check the related record IDs and try again."), { fields: referenceErrors });
  }
  if (isParseModeRequested()) {
    return parseService.parseCreateInvestigation(data);
  }

  const investigationId = `inv_${Date.now().toString(36)}`;
  const newInv = {
    investigationId,
    title: data.title.trim(),
    description: data.description?.trim() || "",
    status: data.status || "open",
    priority: data.priority || "medium",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    relatedSessionIds: data.relatedSessionIds || (data.sessionId ? [data.sessionId] : []),
    relatedErrorIds: data.relatedErrorIds || (data.errorId ? [data.errorId] : []),
    relatedPerformanceIds: data.relatedPerformanceIds || (data.perfId ? [data.perfId] : []),
  };

  inMemoryInvestigations.unshift(newInv);
  return newInv;
}

export async function updateInvestigation(id, updates) {
  assertDataSourceReady();
  if (isParseModeRequested()) {
    return parseService.parseUpdateInvestigation(id, updates);
  }

  const index = inMemoryInvestigations.findIndex((inv) => inv.investigationId.toLowerCase() === id.toLowerCase());
  if (index === -1) throw new Error("Investigation not found");

  const existing = inMemoryInvestigations[index];
  const updated = {
    ...existing,
    ...updates,
    updatedAt: new Date().toISOString(),
  };

  inMemoryInvestigations[index] = updated;
  return updated;
}
