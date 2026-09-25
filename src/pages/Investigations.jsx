import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  SearchCode,
  Plus,
  Search,
  Filter,
  AlertTriangle,
  Gauge,
  ListVideo,
  X,
  Database,
} from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import StatusBadge from "../components/ui/StatusBadge";
import EmptyState from "../components/ui/EmptyState";
import LoadingState from "../components/ui/LoadingState";
import ErrorState from "../components/ui/ErrorState";
import useAsyncData from "../hooks/useAsyncData";
import {
  getInvestigations,
  createInvestigation,
  updateInvestigation,
  isParseModeActive,
} from "../services/sessionService";
import { formatSessionTime } from "../utils/sessionMetrics";
import "./Investigations.css";

export default function Investigations() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [version, setVersion] = useState(0);
  const [mutationError, setMutationError] = useState(null);
  const [mutationSuccess, setMutationSuccess] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [savingStatusId, setSavingStatusId] = useState(null);
  const modalRef = useRef(null);
  const titleInputRef = useRef(null);
  const modalTriggerRef = useRef(null);

  const shouldCreate = searchParams.get("create") === "true";
  const paramErrorId = searchParams.get("errorId") || "";
  const paramSessionId = searchParams.get("sessionId") || "";
  const paramPerfId = searchParams.get("perfId") || "";

  const [isModalOpen, setIsModalOpen] = useState(() => shouldCreate);
  const [formData, setFormData] = useState(() => ({
    title: paramErrorId
      ? `Investigate Error ${paramErrorId}`
      : paramPerfId
      ? `Investigate Performance ${paramPerfId}`
      : "New Session Investigation",
    description: paramSessionId ? `Investigation initialized for session ${paramSessionId}.` : "",
    status: "open",
    priority: "high",
    sessionId: paramSessionId,
    errorId: paramErrorId,
    perfId: paramPerfId,
  }));

  const isParse = isParseModeActive();

  useEffect(() => {
    if (isModalOpen) titleInputRef.current?.focus();
    else if (modalTriggerRef.current) modalTriggerRef.current.focus();
  }, [isModalOpen]);

  const result = useAsyncData(
    () => getInvestigations({ search, statusFilter, priorityFilter }),
    [search, statusFilter, priorityFilter, version]
  );
  const investigations = result.data || [];

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const nextFieldErrors = {};
    if (formData.title.trim().length < 3) nextFieldErrors.title = "Enter a title with at least 3 characters.";
    if (formData.description.trim().length > 1000) nextFieldErrors.description = "Use 1,000 characters or fewer.";
    setFieldErrors(nextFieldErrors);
    if (Object.keys(nextFieldErrors).length) return;

    setSaving(true);
    setMutationSuccess("");
    try {
      await createInvestigation({
      title: formData.title,
      description: formData.description,
      status: formData.status,
      priority: formData.priority,
      relatedSessionIds: formData.sessionId ? [formData.sessionId] : [],
      relatedErrorIds: formData.errorId ? [formData.errorId] : [],
      relatedPerformanceIds: formData.perfId ? [formData.perfId] : [],
      });
    } catch (error) {
      if (error.fields) setFieldErrors((current) => ({ ...current, ...error.fields }));
      else setMutationError(new Error("Could not save the investigation. Check the data source and try again."));
      setSaving(false);
      return;
    }

    setSaving(false);
    setMutationError(null);
    setMutationSuccess("Investigation created.");
    setVersion((v) => v + 1);
    setIsModalOpen(false);
    setSearchParams({});
    setFormData({
      title: "",
      description: "",
      status: "open",
      priority: "high",
      sessionId: "",
      errorId: "",
      perfId: "",
    });
  };

  const handleStatusChange = async (invId, newStatus) => {
    if (savingStatusId) return;
    setSavingStatusId(invId);
    setMutationSuccess("");
    try {
      await updateInvestigation(invId, { status: newStatus });
      setMutationError(null);
      setMutationSuccess("Investigation status updated.");
      setVersion((v) => v + 1);
    } catch {
      setMutationError(new Error("Could not update the investigation. Check the data source and try again."));
    } finally {
      setSavingStatusId(null);
    }
  };

  return (
    <div className="ws-investigations-page">
      {result.loading && <LoadingState label="Loading investigations…" />}
      {(result.error || mutationError) && <ErrorState title="Investigation data unavailable" description={(mutationError || result.error).message} onRetry={() => { setMutationError(null); result.reload(); }} />}
      {mutationSuccess && <p className="ws-inv__success" role="status">{mutationSuccess}</p>}
      <PageHeader
        title="Investigations"
        description="Connect related sessions, errors, and performance signals while investigating an issue."
        actions={
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <span className="ws-sessions-page__header-badge">
              <Database size={12} /> Data Source: {isParse ? "Parse Mode" : "Demo Mode"}
            </span>
            <Button
              ref={modalTriggerRef}
              variant="primary"
              size="sm"
              icon={Plus}
              onClick={() => setIsModalOpen(true)}
            >
              New investigation
            </Button>
          </div>
        }
      />

      {/* Filter Toolbar */}
      <div className="ws-session-filters">
        <div className="ws-session-filters__search">
          <Search size={15} className="ws-session-filters__search-icon" aria-hidden="true" />
          <input
            type="search"
            placeholder="Search investigations by title or description..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            aria-label="Search investigations"
          />
        </div>

        <div className="ws-session-filters__controls">
          <div className="ws-filter-group">
            <label htmlFor="inv-status" className="ws-filter-label">
              <Filter size={13} aria-hidden="true" /> Status:
            </label>
            <select
              id="inv-status"
              className="ws-filter-select"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Statuses</option>
              <option value="open">Open</option>
              <option value="investigating">Investigating</option>
              <option value="resolved">Resolved</option>
            </select>
          </div>

          <div className="ws-filter-group">
            <label htmlFor="inv-priority" className="ws-filter-label">
              Priority:
            </label>
            <select
              id="inv-priority"
              className="ws-filter-select"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
            >
              <option value="all">All Priorities</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Investigation Cards */}
      {result.loading ? null : result.error ? null : !investigations.length ? (
        <EmptyState
          icon={SearchCode}
          title="No investigations found"
          description="Start an investigation from a session, error, or performance signal to keep your findings organized."
        />
      ) : (
        <div className="d-flex flex-column gap-3">
          {investigations.map((inv) => (
            <div key={inv.investigationId} className={`ws-inv-card ws-inv-card--${inv.priority}`}>
              <div className="ws-inv-card__header">
                <div className="ws-inv-card__title-group">
                  <span className="ws-inv-card__id">{inv.investigationId}</span>
                  <h3 className="ws-inv-card__title">{inv.title}</h3>
                </div>

                <div className="ws-inv-card__badges">
                  <StatusBadge status={inv.priority} label={`Priority: ${inv.priority}`} />
                  
                  {/* Status Dropdown */}
                  <select
                    className="ws-filter-select"
                    style={{ background: "var(--ws-surface-sunken)", padding: "2px 8px", borderRadius: 4 }}
                    value={inv.status}
                    aria-label={`Update status for ${inv.title}`}
                    aria-busy={savingStatusId === inv.investigationId}
                    disabled={savingStatusId === inv.investigationId}
                    onChange={(e) => handleStatusChange(inv.investigationId, e.target.value)}
                  >
                    <option value="open">Status: Open</option>
                    <option value="investigating">Status: Investigating</option>
                    <option value="resolved">Status: Resolved</option>
                  </select>
                </div>
              </div>

              <p className="ws-inv-card__description">{inv.description}</p>

              <div className="ws-inv-card__links">
                <span className="ws-session-table__subtext">
                  Created {formatSessionTime(inv.createdAt)}
                </span>

                {inv.relatedSessionIds?.length > 0 && (
                  <div className="ws-inv-card__link-group">
                    <ListVideo size={13} className="ws-text-tertiary" />
                    <span>Sessions:</span>
                    {inv.relatedSessionIds.map((sid) => (
                      <Link key={sid} to={`/sessions/${sid}`} className="ws-session-table__id-link ms-1">
                        {sid}
                      </Link>
                    ))}
                  </div>
                )}

                {inv.relatedErrorIds?.length > 0 && (
                  <div className="ws-inv-card__link-group">
                    <AlertTriangle size={13} className="ws-text-danger" />
                    <span>Errors:</span>
                    {inv.relatedErrorIds.map((eid) => (
                      <Link key={eid} to={`/errors/${eid}`} className="ws-action-link ms-1">
                        {eid}
                      </Link>
                    ))}
                  </div>
                )}

                {inv.relatedPerformanceIds?.length > 0 && (
                  <div className="ws-inv-card__link-group">
                    <Gauge size={13} className="ws-text-warning" />
                    <span>Performance:</span>
                    {inv.relatedPerformanceIds.map((pid) => (
                      <Link key={pid} to={`/performance/${pid}`} className="ws-action-link ms-1">
                        {pid}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* New Investigation Modal */}
      {isModalOpen && (
        <div className="ws-inv-modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div
            className="ws-inv-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="ws-create-investigation-title"
            ref={modalRef}
            tabIndex={-1}
            onClick={(e) => e.stopPropagation()}
            onKeyDown={(event) => {
              if (event.key === "Escape") {
                event.stopPropagation();
                setIsModalOpen(false);
              } else if (event.key === "Tab") {
                const focusable = modalRef.current?.querySelectorAll('button:not(:disabled), input:not(:disabled), textarea:not(:disabled), select:not(:disabled), [tabindex]:not([tabindex="-1"])');
                if (!focusable?.length) return;
                const first = focusable[0];
                const last = focusable[focusable.length - 1];
                if (event.shiftKey && document.activeElement === first) {
                  event.preventDefault();
                  last.focus();
                } else if (!event.shiftKey && document.activeElement === last) {
                  event.preventDefault();
                  first.focus();
                }
              }
            }}
          >
            <div className="ws-inv-modal__header">
              <h3 className="ws-inv-modal__title" id="ws-create-investigation-title">Create Investigation</h3>
              <button
                type="button"
                className="ws-timeline-item__toggle-btn"
                aria-label="Close create investigation dialog"
                onClick={() => setIsModalOpen(false)}
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateSubmit} className="d-flex flex-column gap-3">
              <div className="ws-form-group">
                <label className="ws-form-label" htmlFor="title">Title</label>
                <input
                  ref={titleInputRef}
                  id="title"
                  type="text"
                  className="ws-form-input"
                  placeholder="e.g. Payment Gateway 504 Timeout"
                  value={formData.title}
                  minLength={3}
                  maxLength={120}
                  aria-invalid={Boolean(fieldErrors.title)}
                  aria-describedby={fieldErrors.title ? "inv-title-error" : undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, title: e.target.value });
                    setFieldErrors((current) => ({ ...current, title: "" }));
                  }}
                  required
                />
                {fieldErrors.title && <span className="ws-inv__field-error" id="inv-title-error">{fieldErrors.title}</span>}
              </div>

              <div className="ws-form-group">
                <label className="ws-form-label" htmlFor="description">Description</label>
                <textarea
                  id="description"
                  rows={3}
                  className="ws-form-textarea"
                  placeholder="Describe the issue, hypothesis, or triage steps..."
                  value={formData.description}
                  maxLength={1000}
                  aria-invalid={Boolean(fieldErrors.description)}
                  aria-describedby={fieldErrors.description ? "inv-description-error" : undefined}
                  onChange={(e) => {
                    setFormData({ ...formData, description: e.target.value });
                    setFieldErrors((current) => ({ ...current, description: "" }));
                  }}
                />
                {fieldErrors.description && <span className="ws-inv__field-error" id="inv-description-error">{fieldErrors.description}</span>}
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="ws-form-group">
                    <label className="ws-form-label" htmlFor="priority">Priority</label>
                    <select
                      id="priority"
                      className="ws-form-select"
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    >
                      <option value="high">High</option>
                      <option value="medium">Medium</option>
                      <option value="low">Low</option>
                    </select>
                  </div>
                </div>

                <div className="col-6">
                  <div className="ws-form-group">
                    <label className="ws-form-label" htmlFor="status">Status</label>
                    <select
                      id="status"
                      className="ws-form-select"
                      value={formData.status}
                      onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    >
                      <option value="open">Open</option>
                      <option value="investigating">Investigating</option>
                      <option value="resolved">Resolved</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="ws-form-group">
                <label className="ws-form-label" htmlFor="sessionId">Associated Session ID (optional)</label>
                <input
                  id="sessionId"
                  type="text"
                  className="ws-form-input"
                  placeholder="e.g. sess_9f83a12b"
                  value={formData.sessionId}
                  aria-invalid={Boolean(fieldErrors.sessionId)}
                  aria-describedby={fieldErrors.sessionId ? "inv-session-error" : undefined}
                  onChange={(e) => setFormData({ ...formData, sessionId: e.target.value })}
                />
                {fieldErrors.sessionId && <span className="ws-inv__field-error" id="inv-session-error">{fieldErrors.sessionId}</span>}
              </div>

              <div className="row g-3">
                <div className="col-6">
                  <div className="ws-form-group">
                    <label className="ws-form-label" htmlFor="errorId">Error ID (optional)</label>
                    <input
                      id="errorId"
                      type="text"
                      className="ws-form-input"
                      placeholder="e.g. err_payment_timeout_504"
                      value={formData.errorId}
                      aria-invalid={Boolean(fieldErrors.errorId)}
                      aria-describedby={fieldErrors.errorId ? "inv-error-error" : undefined}
                      onChange={(e) => setFormData({ ...formData, errorId: e.target.value })}
                    />
                    {fieldErrors.errorId && <span className="ws-inv__field-error" id="inv-error-error">{fieldErrors.errorId}</span>}
                  </div>
                </div>

                <div className="col-6">
                  <div className="ws-form-group">
                    <label className="ws-form-label" htmlFor="perfId">Performance ID (optional)</label>
                    <input
                      id="perfId"
                      type="text"
                      className="ws-form-input"
                      placeholder="e.g. perf_slow_payment_charge"
                      value={formData.perfId}
                      aria-invalid={Boolean(fieldErrors.perfId)}
                      aria-describedby={fieldErrors.perfId ? "inv-perf-error" : undefined}
                      onChange={(e) => setFormData({ ...formData, perfId: e.target.value })}
                    />
                    {fieldErrors.perfId && <span className="ws-inv__field-error" id="inv-perf-error">{fieldErrors.perfId}</span>}
                  </div>
                </div>
              </div>

              <div className="ws-form-actions">
                <Button type="button" variant="secondary" onClick={() => setIsModalOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" disabled={saving} aria-busy={saving}>
                  {saving ? "Saving…" : "Save Investigation"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
