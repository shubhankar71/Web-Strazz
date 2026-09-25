import { describe, expect, it } from "vitest";
import {
  calculateAvgDuration,
  calculateAvgEvents,
  calculateErrorRate,
  calculateTotalSessions,
  countSessionsWithErrors,
  getRecentSessions,
  getSessionsNeedingAttention,
} from "./sessionMetrics.js";

const sessions = [
  { sessionId: "a", startedAt: "2026-01-01T00:00:00Z", duration: 30, eventCount: 5, errorCount: 1, status: "error" },
  { sessionId: "b", startedAt: "2026-01-03T00:00:00Z", duration: 90, eventCount: 10, errorCount: 0, status: "warning" },
  { sessionId: "c", startedAt: "2026-01-02T00:00:00Z", duration: 60, eventCount: 6, errorCount: 0, status: "normal" },
];

describe("session metrics", () => {
  it("calculates totals, error rate, average duration and events", () => {
    expect(calculateTotalSessions(sessions)).toBe(3);
    expect(calculateErrorRate(sessions)).toBe("33.3%");
    expect(calculateAvgDuration(sessions)).toBe("1m 0s");
    expect(calculateAvgEvents(sessions)).toBe(7);
    expect(countSessionsWithErrors(sessions)).toBe(1);
  });

  it("handles empty input", () => {
    expect(calculateTotalSessions()).toBe(0);
    expect(calculateErrorRate()).toBe("0.0%");
    expect(calculateAvgDuration()).toBe("0s");
    expect(calculateAvgEvents()).toBe(0);
    expect(countSessionsWithErrors()).toBe(0);
  });

  it("selects recent sessions and sessions needing attention in newest-first order", () => {
    expect(getRecentSessions(sessions, 2).map((session) => session.sessionId)).toEqual(["b", "c"]);
    expect(getSessionsNeedingAttention(sessions).map((session) => session.sessionId)).toEqual(["b", "a"]);
  });
});
