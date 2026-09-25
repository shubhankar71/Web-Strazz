/**
 * Centralized Demo Session Events Data Layer
 * 
 * Provides detailed, realistic chronological timeline events for session investigations.
 * Events contain deterministic errorId and perfId tags for cross-session error grouping
 * and performance signal aggregation.
 */

export const mockSessionEvents = {
  // Scenario 1: Problematic Checkout Session (Payment Timeout + JS Error)
  "sess_9f83a12b": [
    {
      eventId: "evt_1001",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:45:12Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /home",
      description: "Initial page render completed. DOMContentLoaded in 240ms.",
      route: "/home",
      duration: 240,
      severity: "info",
      metadata: { referrer: "https://google.com", userAgent: "Chrome 128.0" },
      technicalDetails: {
        performanceMetrics: { FCP: "180ms", LCP: "420ms", CLS: "0.01", TTFB: "85ms" },
        resourcesLoaded: 24
      }
    },
    {
      eventId: "evt_1002",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:45:28Z",
      relativeTime: "+00:16.000",
      eventType: "user_action",
      title: "Click: Product Card 'App Gateway'",
      description: "User selected 'App Gateway' product from catalog grid.",
      route: "/home",
      severity: "info",
      technicalDetails: {
        action: "Click",
        target: "div.product-card[data-id='app-gateway']",
        coordinates: { x: 412, y: 280 }
      }
    },
    {
      eventId: "evt_1003",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:45:29Z",
      relativeTime: "+00:17.000",
      eventType: "navigation",
      title: "Navigate to /products/app-gateway",
      description: "Single Page Application route change.",
      route: "/products/app-gateway",
      severity: "info",
      technicalDetails: { from: "/home", to: "/products/app-gateway", trigger: "pushState" }
    },
    {
      eventId: "evt_1004",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:45:45Z",
      relativeTime: "+00:33.000",
      eventType: "user_action",
      title: "Click: 'Add to Cart'",
      description: "User clicked primary action button 'Add to Cart'.",
      route: "/products/app-gateway",
      severity: "info",
      technicalDetails: { action: "Click", target: "button#btn-add-cart", page: "/products/app-gateway" }
    },
    {
      eventId: "evt_1005",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:45:46Z",
      relativeTime: "+00:34.000",
      eventType: "api_request",
      title: "POST /api/v1/cart/items",
      description: "Add item payload dispatched to cart microservice.",
      route: "/products/app-gateway",
      duration: 110,
      severity: "info",
      technicalDetails: {
        method: "POST",
        url: "https://api.starzz.io/v1/cart/items",
        status: 200,
        duration: 110,
        requestId: "req_cart_881a",
        requestPayload: { itemId: "item_app_gw", quantity: 1, tier: "pro" }
      }
    },
    {
      eventId: "evt_1006",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:10Z",
      relativeTime: "+00:58.000",
      eventType: "navigation",
      title: "Navigate to /checkout/payment",
      description: "User navigated to payment confirmation stage.",
      route: "/checkout/payment",
      severity: "info",
      technicalDetails: { from: "/checkout/shipping", to: "/checkout/payment" }
    },
    {
      eventId: "evt_1007",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:30Z",
      relativeTime: "+01:18.000",
      eventType: "user_action",
      title: "Click: 'Pay & Subscribe'",
      description: "User submitted payment form.",
      route: "/checkout/payment",
      severity: "info",
      technicalDetails: { action: "Click", target: "button#submit-payment", page: "/checkout/payment" }
    },
    {
      eventId: "evt_1008",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:31Z",
      relativeTime: "+01:19.000",
      eventType: "api_request",
      title: "POST /api/v2/payment/charge",
      description: "Payment charge payload sent to upstream gateway.",
      route: "/checkout/payment",
      severity: "warning",
      perfId: "perf_slow_payment_charge",
      technicalDetails: {
        method: "POST",
        url: "https://api.starzz.io/v2/payment/charge",
        requestId: "req_pay_9021",
        headers: { "Content-Type": "application/json", "X-Idempotency-Key": "idem_8f391a" }
      }
    },
    {
      eventId: "evt_1009",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:36Z",
      relativeTime: "+01:24.210",
      eventType: "performance",
      title: "Slow API Response: 5.21s",
      description: "API request /api/v2/payment/charge exceeded latency threshold of 2.0s.",
      route: "/checkout/payment",
      duration: 5210,
      severity: "warning",
      perfId: "perf_slow_payment_charge",
      technicalDetails: {
        metric: "API Response Latency",
        value: "5210ms",
        threshold: "2000ms",
        status: "Warning",
        route: "/checkout/payment"
      }
    },
    {
      eventId: "evt_1010",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:36Z",
      relativeTime: "+01:24.250",
      eventType: "api_response",
      title: "HTTP 504 Gateway Timeout",
      description: "Payment gateway upstream service failed to respond within 5000ms limit.",
      route: "/checkout/payment",
      duration: 5210,
      severity: "error",
      errorId: "err_payment_timeout_504",
      technicalDetails: {
        method: "POST",
        url: "https://api.starzz.io/v2/payment/charge",
        status: 504,
        statusText: "Gateway Timeout",
        duration: 5210,
        requestId: "req_pay_9021",
        responseBody: { error: "GatewayTimeout", message: "Upstream processor timed out" }
      }
    },
    {
      eventId: "evt_1011",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:36Z",
      relativeTime: "+01:24.280",
      eventType: "javascript_error",
      title: "TypeError: PaymentWidget is undefined",
      description: "Unhandled Exception trying to call `.renderError()` on null PaymentWidget reference.",
      route: "/checkout/payment",
      severity: "error",
      errorId: "err_payment_widget_typeerror",
      technicalDetails: {
        errorName: "TypeError",
        message: "Cannot read properties of undefined (reading 'renderError')",
        source: "https://static.starzz.io/assets/checkout-v2.js",
        line: 142,
        column: 28,
        stackTrace: `TypeError: Cannot read properties of undefined (reading 'renderError')
    at handlePaymentFailure (checkout-v2.js:142:28)
    at async processPayment (payment-handler.js:89:12)
    at HTMLButtonElement.onClick (checkout-v2.js:45:5)`
      }
    },
    {
      eventId: "evt_1012",
      sessionId: "sess_9f83a12b",
      timestamp: "2026-09-22T22:46:37Z",
      relativeTime: "+01:25.000",
      eventType: "console_error",
      title: "Console Error: Payment Flow Terminated",
      description: "[CheckoutError] Unhandled rejection during payment confirmation callback.",
      route: "/checkout/payment",
      severity: "error",
      errorId: "err_payment_widget_typeerror",
      technicalDetails: {
        level: "error",
        args: ["[CheckoutError]", "Unhandled rejection in processPayment()", { code: 504 }]
      }
    }
  ],

  // Scenario 2: Second Problematic Session sharing TypeError: PaymentWidget is undefined
  "sess_3e51c890": [
    {
      eventId: "evt_3501",
      sessionId: "sess_3e51c890",
      timestamp: "2026-09-22T21:42:10Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /settings/api-keys",
      description: "API key permissions table view loaded.",
      route: "/settings/api-keys",
      severity: "info",
      technicalDetails: { performanceMetrics: { FCP: "150ms" } }
    },
    {
      eventId: "evt_3502",
      sessionId: "sess_3e51c890",
      timestamp: "2026-09-22T21:42:30Z",
      relativeTime: "+00:20.000",
      eventType: "user_action",
      title: "Click: 'Create New Key'",
      description: "User initiated key creation modal.",
      route: "/settings/api-keys",
      severity: "info",
      technicalDetails: { action: "Click", target: "button#create-key" }
    },
    {
      eventId: "evt_3503",
      sessionId: "sess_3e51c890",
      timestamp: "2026-09-22T21:42:32Z",
      relativeTime: "+00:22.000",
      eventType: "javascript_error",
      title: "TypeError: Cannot read property 'permissions' of undefined",
      description: "Unhandled TypeError reading permissions object during API key rendering.",
      route: "/settings/api-keys",
      severity: "error",
      errorId: "err_payment_widget_typeerror",
      technicalDetails: {
        errorName: "TypeError",
        message: "Cannot read property 'permissions' of undefined",
        source: "https://static.starzz.io/assets/settings-bundle.js",
        line: 204,
        column: 12,
        stackTrace: `TypeError: Cannot read property 'permissions' of undefined
    at renderKeyPermissions (settings-bundle.js:204:12)
    at HTMLButtonElement.onClick (settings-bundle.js:88:4)`
      }
    }
  ],

  // Scenario 3: Normal Session (Smooth Purchase/Analytics Flow)
  "sess_4k72m9p1": [
    {
      eventId: "evt_2001",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:30:00Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /login",
      description: "Login view rendered successfully in 120ms.",
      route: "/login",
      duration: 120,
      severity: "info",
      technicalDetails: { performanceMetrics: { FCP: "90ms", LCP: "180ms" } }
    },
    {
      eventId: "evt_2002",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:30:15Z",
      relativeTime: "+00:15.000",
      eventType: "user_action",
      title: "Submit: Login Form",
      description: "User submitted authentication credentials.",
      route: "/login",
      severity: "info",
      technicalDetails: { action: "Submit", target: "form#login-form" }
    },
    {
      eventId: "evt_2003",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:30:16Z",
      relativeTime: "+00:16.000",
      eventType: "api_request",
      title: "POST /api/v1/auth/login",
      description: "Authentication token requested.",
      route: "/login",
      duration: 145,
      severity: "info",
      technicalDetails: { method: "POST", url: "/api/v1/auth/login", status: 200, duration: 145 }
    },
    {
      eventId: "evt_2004",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:30:17Z",
      relativeTime: "+00:17.000",
      eventType: "navigation",
      title: "Navigate to /dashboard",
      description: "Redirected to primary application dashboard.",
      route: "/dashboard",
      severity: "info",
      technicalDetails: { from: "/login", to: "/dashboard" }
    },
    {
      eventId: "evt_2005",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:31:05Z",
      relativeTime: "+01:05.000",
      eventType: "navigation",
      title: "Navigate to /dashboard/analytics",
      description: "User clicked Analytics sidebar item.",
      route: "/dashboard/analytics",
      severity: "info",
      technicalDetails: { from: "/dashboard", to: "/dashboard/analytics" }
    },
    {
      eventId: "evt_2006",
      sessionId: "sess_4k72m9p1",
      timestamp: "2026-09-22T22:31:06Z",
      relativeTime: "+01:06.000",
      eventType: "api_request",
      title: "GET /api/v1/analytics/metrics",
      description: "Fetch dashboard metrics overview.",
      route: "/dashboard/analytics",
      duration: 98,
      severity: "info",
      technicalDetails: { method: "GET", url: "/api/v1/analytics/metrics", status: 200, duration: 98 }
    }
  ],

  // Scenario 4: Upload Warning Session (Large Asset Warning)
  "sess_1c84f6e3": [
    {
      eventId: "evt_3001",
      sessionId: "sess_1c84f6e3",
      timestamp: "2026-09-22T22:15:45Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /upload",
      description: "Asset uploader view mounted.",
      route: "/upload",
      severity: "info",
      technicalDetails: { performanceMetrics: { FCP: "140ms" } }
    },
    {
      eventId: "evt_3002",
      sessionId: "sess_1c84f6e3",
      timestamp: "2026-09-22T22:16:10Z",
      relativeTime: "+00:25.000",
      eventType: "user_action",
      title: "Drop File: 'bundle-archive.tar.gz'",
      description: "User dropped file asset into upload zone (4.2 MB).",
      route: "/upload",
      severity: "info",
      technicalDetails: { action: "FileDrop", fileName: "bundle-archive.tar.gz", sizeBytes: 4404019 }
    },
    {
      eventId: "evt_3003",
      sessionId: "sess_1c84f6e3",
      timestamp: "2026-09-22T22:16:11Z",
      relativeTime: "+00:26.000",
      eventType: "performance",
      title: "Chunk Size Exceeds Recommended Limit",
      description: "Asset payload size 4.2MB exceeds recommended threshold of 2.0MB.",
      route: "/upload",
      severity: "warning",
      perfId: "perf_asset_chunk_size",
      technicalDetails: { metric: "Asset Payload Size", value: "4.2 MB", threshold: "2.0 MB", status: "Warning" }
    },
    {
      eventId: "evt_3004",
      sessionId: "sess_1c84f6e3",
      timestamp: "2026-09-22T22:16:12Z",
      relativeTime: "+00:27.000",
      eventType: "api_request",
      title: "POST /api/v1/assets/upload",
      description: "Multipart upload payload dispatched.",
      route: "/upload/assets",
      duration: 1850,
      severity: "info",
      technicalDetails: { method: "POST", url: "/api/v1/assets/upload", status: 200, duration: 1850 }
    }
  ],

  // Scenario 5: WebSocket Failure Session
  "sess_8c34e71f": [
    {
      eventId: "evt_4001",
      sessionId: "sess_8c34e71f",
      timestamp: "2026-09-22T21:05:30Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /projects/build-logs",
      description: "Build streaming dashboard initialized.",
      route: "/projects/build-logs",
      severity: "info"
    },
    {
      eventId: "evt_4002",
      sessionId: "sess_8c34e71f",
      timestamp: "2026-09-22T21:05:32Z",
      relativeTime: "+00:02.000",
      eventType: "api_request",
      title: "WSS Connect: wss://stream.starzz.io/logs",
      description: "Attempting WebSocket connection to build stream.",
      route: "/projects/build-logs",
      severity: "info",
      technicalDetails: { protocol: "wss", endpoint: "wss://stream.starzz.io/logs" }
    },
    {
      eventId: "evt_4003",
      sessionId: "sess_8c34e71f",
      timestamp: "2026-09-22T21:05:34Z",
      relativeTime: "+00:04.000",
      eventType: "network_error",
      title: "WebSocket Connection Failed (502 Bad Gateway)",
      description: "WebSocket connection dropped during initial handshake.",
      route: "/projects/build-logs",
      severity: "error",
      errorId: "err_websocket_502",
      technicalDetails: {
        errorName: "WebSocketError",
        url: "wss://stream.starzz.io/logs",
        status: 502,
        statusText: "Bad Gateway",
        message: "WebSocket handshake failed with status code 502"
      }
    }
  ],

  // Scenario 6: Deployment Chunk Load Failure Session
  "sess_4a53b87e": [
    {
      eventId: "evt_5001",
      sessionId: "sess_4a53b87e",
      timestamp: "2026-09-22T19:40:22Z",
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: "Page Loaded: /deployments/production",
      description: "Production deployments view mounted.",
      route: "/deployments/production",
      severity: "info"
    },
    {
      eventId: "evt_5002",
      sessionId: "sess_4a53b87e",
      timestamp: "2026-09-22T19:40:40Z",
      relativeTime: "+00:18.000",
      eventType: "javascript_error",
      title: "Failed to load asset chunk 404",
      description: "Dynamic import failed for module chunk 404 on deployment view.",
      route: "/deployments/production",
      severity: "error",
      errorId: "err_chunk_load_404",
      technicalDetails: {
        errorName: "ChunkLoadError",
        message: "Loading chunk 404 failed. (missing: https://static.starzz.io/js/chunk.404.js)",
        source: "https://static.starzz.io/js/app.main.js",
        line: 52,
        column: 18,
        stackTrace: `ChunkLoadError: Loading chunk 404 failed.
    at HTMLScriptElement.onScriptComplete (app.main.js:52:18)`
      }
    }
  ]
};

/**
 * Fallback event generator for sessions without explicit custom events.
 * Guarantees every mock session has deterministic errorId / perfId attributes when applicable.
 */
export function generateDefaultSessionEvents(session) {
  const isError = session.status === "error" || session.errorCount > 0;
  const isWarning = session.status === "warning";

  const events = [
    {
      eventId: `evt_${session.sessionId}_1`,
      sessionId: session.sessionId,
      timestamp: session.startedAt,
      relativeTime: "+00:00.000",
      eventType: "page_load",
      title: `Page Loaded: ${session.userFlow?.[0] || "/home"}`,
      description: `Session initiated on ${session.browser} (${session.operatingSystem}).`,
      route: session.userFlow?.[0] || "/home",
      duration: 180,
      severity: "info",
      technicalDetails: {
        performanceMetrics: { FCP: "120ms", LCP: "280ms" },
        browser: session.browser,
        os: session.operatingSystem
      }
    }
  ];

  if (session.userFlow && session.userFlow.length > 1) {
    session.userFlow.slice(1).forEach((page, idx) => {
      const offsetSeconds = (idx + 1) * 20;
      const mins = Math.floor(offsetSeconds / 60);
      const secs = offsetSeconds % 60;
      const relTime = `+${mins < 10 ? '0' : ''}${mins}:${secs < 10 ? '0' : ''}${secs}.000`;

      events.push({
        eventId: `evt_${session.sessionId}_nav_${idx}`,
        sessionId: session.sessionId,
        timestamp: new Date(new Date(session.startedAt).getTime() + offsetSeconds * 1000).toISOString(),
        relativeTime: relTime,
        eventType: "navigation",
        title: `Navigate to ${page}`,
        description: `User navigated to ${page}`,
        route: page,
        severity: "info",
        technicalDetails: { from: session.userFlow[idx], to: page }
      });
    });
  }

  // Add API Request
  const isSlowApi = isError || session.duration > 300;
  const perfId = isSlowApi ? `perf_slow_api_${session.lastPage.replace(/[^a-z0-9]/gi, '_')}` : undefined;

  events.push({
    eventId: `evt_${session.sessionId}_api`,
    sessionId: session.sessionId,
    timestamp: new Date(new Date(session.startedAt).getTime() + 45000).toISOString(),
    relativeTime: "+00:45.000",
    eventType: "api_request",
    title: `GET /api/v1${session.lastPage}`,
    description: `Resource request for page content on ${session.lastPage}.`,
    route: session.lastPage,
    duration: isError ? 3400 : isSlowApi ? 2100 : 120,
    severity: isError ? "warning" : "info",
    perfId,
    technicalDetails: {
      method: "GET",
      url: `https://api.starzz.io/v1${session.lastPage}`,
      status: isError ? 500 : 200,
      duration: isError ? 3400 : isSlowApi ? 2100 : 120,
      requestId: `req_${session.sessionId.slice(5, 10)}`
    }
  });

  if (isError) {
    let errorId = "err_unhandled_exception";
    if (session.errorMessage?.includes("CORS")) errorId = "err_cors_header_missing";
    else if (session.errorMessage?.includes("GraphQL")) errorId = "err_graphql_syntax";
    else if (session.errorMessage?.includes("WebSocket")) errorId = "err_websocket_502";
    else if (session.errorMessage?.includes("Chunk")) errorId = "err_chunk_load_404";
    else if (session.errorMessage?.includes("504")) errorId = "err_payment_timeout_504";

    events.push({
      eventId: `evt_${session.sessionId}_err`,
      sessionId: session.sessionId,
      timestamp: new Date(new Date(session.startedAt).getTime() + (session.duration - 5) * 1000).toISOString(),
      relativeTime: `+${Math.floor(session.duration / 60)}m ${session.duration % 60}s`,
      eventType: "javascript_error",
      title: session.errorMessage || "Unhandled Exception Captured",
      description: session.errorMessage || "Uncaught Error during event processing on page.",
      route: session.lastPage,
      severity: "error",
      errorId,
      technicalDetails: {
        errorName: session.errorMessage?.split(":")[0] || "RuntimeError",
        message: session.errorMessage || "Unhandled Exception Captured",
        source: `https://static.starzz.io/assets${session.lastPage}.js`,
        line: 88,
        column: 14,
        stackTrace: `${session.errorMessage || "RuntimeError: Unhandled Exception Captured"}
    at processEvent (${session.lastPage}.js:88:14)
    at dispatch (${session.lastPage}.js:102:4)`
      }
    });
  } else if (isWarning) {
    let errorId = session.errorMessage?.includes("Rate") ? "err_auth_ratelimit_429" : undefined;
    let perfIdWarn = session.errorMessage?.includes("Slow") ? "perf_slow_team_api" : "perf_asset_chunk_size";

    events.push({
      eventId: `evt_${session.sessionId}_warn`,
      sessionId: session.sessionId,
      timestamp: new Date(new Date(session.startedAt).getTime() + 30000).toISOString(),
      relativeTime: "+00:30.000",
      eventType: errorId ? "console_error" : "performance",
      title: session.errorMessage || "Performance Threshold Exceeded",
      description: session.errorMessage || "Response time degraded on current view.",
      route: session.lastPage,
      severity: "warning",
      errorId,
      perfId: perfIdWarn,
      technicalDetails: {
        metric: "Response Time",
        value: "1420ms",
        threshold: "500ms",
        status: "Warning"
      }
    });
  }

  return events;
}
