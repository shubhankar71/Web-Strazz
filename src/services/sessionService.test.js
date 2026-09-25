import { describe, expect, it } from "vitest";
import {
  createInvestigation,
  getOverviewMetrics,
  getSessionById,
  getSessionEvents,
  validateInvestigationReferences,
} from "./sessionService.js";

describe("session service demo mode", () => {
  it("serves overview metrics and session records from demo data", async () => {
    const metrics = await getOverviewMetrics();
    const session = await getSessionById("sess_9f83a12b");

    expect(metrics.totalSessions).toBeGreaterThan(0);
    expect(metrics.errorRate).toMatch(/^\d+\.\d%$/);
    expect(session).toMatchObject({ sessionId: "sess_9f83a12b" });
  });

  it("returns timeline events and validates linked records", async () => {
    const events = await getSessionEvents("sess_9f83a12b");
    expect(events.length).toBeGreaterThan(0);

    const invalid = await validateInvestigationReferences({
      relatedSessionIds: ["missing-session"],
      relatedErrorIds: ["missing-error"],
      relatedPerformanceIds: ["missing-performance"],
    });
    expect(Object.keys(invalid)).toEqual(["sessionId", "errorId", "perfId"]);
  });

  it("rejects investigations with invalid references", async () => {
    await expect(createInvestigation({
      title: "Broken relation",
      relatedSessionIds: ["missing-session"],
    })).rejects.toMatchObject({ fields: { sessionId: expect.any(String) } });
  });
});
