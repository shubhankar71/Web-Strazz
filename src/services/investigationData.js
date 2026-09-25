/**
 * Centralized Demo Data Layer for Investigations
 */

export const mockInvestigations = [
  {
    investigationId: "inv_101",
    title: "Payment Gateway 504 Timeout & Null Pointer",
    description: "Investigating high latency spikes during payment authorization callback leading to TypeError on /checkout/payment.",
    status: "investigating", // "open" | "investigating" | "resolved"
    priority: "high", // "high" | "medium" | "low"
    createdAt: "2026-09-22T22:50:00Z",
    updatedAt: "2026-09-22T22:55:00Z",
    relatedSessionIds: ["sess_9f83a12b", "sess_3e51c890"],
    relatedErrorIds: ["err_payment_timeout_504", "err_payment_widget_typeerror"],
    relatedPerformanceIds: ["perf_slow_payment_charge"]
  },
  {
    investigationId: "inv_102",
    title: "WebSocket Connection Bad Gateway (502)",
    description: "Investigating stream connection failure on wss://stream.starzz.io/logs during build log streaming.",
    status: "open",
    priority: "high",
    createdAt: "2026-09-22T21:10:00Z",
    updatedAt: "2026-09-22T21:10:00Z",
    relatedSessionIds: ["sess_8c34e71f"],
    relatedErrorIds: ["err_websocket_502"],
    relatedPerformanceIds: []
  },
  {
    investigationId: "inv_103",
    title: "Asset Chunk Size Warning on Upload",
    description: "Tracking large bundle archive uploads exceeding recommended 2.0MB payload threshold.",
    status: "resolved",
    priority: "medium",
    createdAt: "2026-09-22T20:40:00Z",
    updatedAt: "2026-09-22T22:00:00Z",
    relatedSessionIds: ["sess_1c84f6e3"],
    relatedErrorIds: [],
    relatedPerformanceIds: ["perf_asset_chunk_size"]
  }
];
