import { Link } from "react-router-dom";
import { AlertTriangle, Gauge } from "lucide-react";
import "./TimelineEventDetail.css";

export default function TimelineEventDetail({ event }) {
  const { eventType, technicalDetails = {}, metadata = {}, errorId, perfId } = event;

  return (
    <div className="ws-event-detail-panel">
      {/* Cross-linking action bar */}
      {(errorId || perfId) && (
        <div className="ws-detail-crosslink-bar">
          {errorId && (
            <Link to={`/errors/${errorId}`} className="ws-detail-crosslink-btn ws-detail-crosslink-btn--danger">
              <AlertTriangle size={13} />
              <span>View Global Error Group ({errorId})</span>
            </Link>
          )}
          {perfId && (
            <Link to={`/performance/${perfId}`} className="ws-detail-crosslink-btn ws-detail-crosslink-btn--warning">
              <Gauge size={13} />
              <span>View Global Performance Signal ({perfId})</span>
            </Link>
          )}
        </div>
      )}

      {/* 1. API Request / Response / Network Error */}
      {(eventType === "api_request" || eventType === "api_response" || eventType === "network_error") && (
        <div className="ws-detail-group">
          <div className="ws-detail-grid">
            {technicalDetails.method && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">HTTP Method</span>
                <span className="ws-detail-value ws-mono">{technicalDetails.method}</span>
              </div>
            )}
            {technicalDetails.status && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Status Code</span>
                <span className={`ws-detail-value ws-mono ${technicalDetails.status >= 400 ? "ws-text-danger" : "ws-text-success"}`}>
                  {technicalDetails.status} {technicalDetails.statusText || ""}
                </span>
              </div>
            )}
            {technicalDetails.duration !== undefined && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Duration</span>
                <span className="ws-detail-value ws-mono">{technicalDetails.duration}ms</span>
              </div>
            )}
            {technicalDetails.requestId && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Request ID</span>
                <span className="ws-detail-value ws-mono">{technicalDetails.requestId}</span>
              </div>
            )}
          </div>

          {technicalDetails.url && (
            <div className="ws-detail-field ws-detail-field--full">
              <span className="ws-detail-label">Endpoint URL</span>
              <code className="ws-detail-code">{technicalDetails.url}</code>
            </div>
          )}

          {technicalDetails.headers && (
            <div className="ws-detail-field ws-detail-field--full">
              <span className="ws-detail-label">Request Headers</span>
              <pre className="ws-detail-pre">{JSON.stringify(technicalDetails.headers, null, 2)}</pre>
            </div>
          )}

          {technicalDetails.responseBody && (
            <div className="ws-detail-field ws-detail-field--full">
              <span className="ws-detail-label">Response Payload</span>
              <pre className="ws-detail-pre">{JSON.stringify(technicalDetails.responseBody, null, 2)}</pre>
            </div>
          )}
        </div>
      )}

      {/* 2. JavaScript Error / Console Error */}
      {(eventType === "javascript_error" || eventType === "console_error") && (
        <div className="ws-detail-group">
          <div className="ws-detail-grid">
            {technicalDetails.errorName && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Error Type</span>
                <span className="ws-detail-value ws-mono ws-text-danger">{technicalDetails.errorName}</span>
              </div>
            )}
            {technicalDetails.source && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Source File</span>
                <code className="ws-detail-code">{technicalDetails.source}</code>
              </div>
            )}
            {technicalDetails.line && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Location</span>
                <span className="ws-detail-value ws-mono">
                  Line {technicalDetails.line}:{technicalDetails.column}
                </span>
              </div>
            )}
          </div>

          {technicalDetails.message && (
            <div className="ws-detail-field ws-detail-field--full">
              <span className="ws-detail-label">Message</span>
              <div className="ws-detail-error-box">{technicalDetails.message}</div>
            </div>
          )}

          {technicalDetails.stackTrace && (
            <div className="ws-detail-field ws-detail-field--full">
              <span className="ws-detail-label">Stack Trace</span>
              <pre className="ws-detail-pre ws-detail-stack">{technicalDetails.stackTrace}</pre>
            </div>
          )}
        </div>
      )}

      {/* 3. Performance Metric */}
      {eventType === "performance" && (
        <div className="ws-detail-group">
          <div className="ws-detail-grid">
            {technicalDetails.metric && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Metric</span>
                <span className="ws-detail-value">{technicalDetails.metric}</span>
              </div>
            )}
            {technicalDetails.value && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Captured Value</span>
                <span className="ws-detail-value ws-mono ws-text-warning">{technicalDetails.value}</span>
              </div>
            )}
            {technicalDetails.threshold && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Recommended Threshold</span>
                <span className="ws-detail-value ws-mono">{technicalDetails.threshold}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 4. Navigation */}
      {eventType === "navigation" && (
        <div className="ws-detail-group">
          <div className="ws-detail-grid">
            {technicalDetails.from && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">From Path</span>
                <code className="ws-detail-code">{technicalDetails.from}</code>
              </div>
            )}
            {technicalDetails.to && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">To Path</span>
                <code className="ws-detail-code">{technicalDetails.to}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. User Action */}
      {eventType === "user_action" && (
        <div className="ws-detail-group">
          <div className="ws-detail-grid">
            {technicalDetails.action && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">Action</span>
                <span className="ws-detail-value">{technicalDetails.action}</span>
              </div>
            )}
            {technicalDetails.target && (
              <div className="ws-detail-field">
                <span className="ws-detail-label">DOM Target</span>
                <code className="ws-detail-code">{technicalDetails.target}</code>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 6. Metadata Footer */}
      {Object.keys(metadata).length > 0 && (
        <div className="ws-detail-meta-footer">
          <span className="ws-detail-label">Client Context Metadata:</span>
          <div className="ws-detail-meta-tags">
            {Object.entries(metadata).map(([key, val]) => (
              <span key={key} className="ws-detail-meta-tag">
                {key}: <strong>{String(val)}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
