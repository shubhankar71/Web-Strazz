/**
 * Utility functions for calculating metrics from session data.
 * Keeps logic separate from React presentation code.
 */

/**
 * Calculate total number of sessions.
 */
export function calculateTotalSessions(sessions = []) {
  return sessions.length;
}

/**
 * Calculate percentage of sessions with errors.
 * Returns formatted string e.g., "22.7%".
 */
export function calculateErrorRate(sessions = []) {
  if (!sessions.length) return "0.0%";
  const errorSessions = sessions.filter(
    (s) => s.errorCount > 0 || s.status === "error"
  );
  const percentage = (errorSessions.length / sessions.length) * 100;
  return `${percentage.toFixed(1)}%`;
}

/**
 * Calculate average session duration in seconds and format nicely.
 * Returns string e.g. "4m 52s" or "52s".
 */
export function calculateAvgDuration(sessions = []) {
  if (!sessions.length) return "0s";
  const totalSeconds = sessions.reduce((sum, s) => sum + (s.duration || 0), 0);
  const avgSeconds = Math.round(totalSeconds / sessions.length);

  if (avgSeconds < 60) {
    return `${avgSeconds}s`;
  }
  const minutes = Math.floor(avgSeconds / 60);
  const remainingSeconds = avgSeconds % 60;
  return `${minutes}m ${remainingSeconds}s`;
}

/**
 * Calculate average events per session.
 */
export function calculateAvgEvents(sessions = []) {
  if (!sessions.length) return 0;
  const totalEvents = sessions.reduce((sum, s) => sum + (s.eventCount || 0), 0);
  return Math.round(totalEvents / sessions.length);
}

/**
 * Get count of sessions with errors.
 */
export function countSessionsWithErrors(sessions = []) {
  return sessions.filter((s) => s.errorCount > 0 || s.status === "error").length;
}

/**
 * Get array of sessions requiring attention (status === 'error' or 'warning' or errorCount > 0).
 */
export function getSessionsNeedingAttention(sessions = [], limit = 5) {
  return sessions
    .filter((s) => s.status === "error" || s.status === "warning" || s.errorCount > 0)
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, limit);
}

/**
 * Get recent sessions sorted by startedAt descending.
 */
export function getRecentSessions(sessions = [], limit = 5) {
  return [...sessions]
    .sort((a, b) => new Date(b.startedAt) - new Date(a.startedAt))
    .slice(0, limit);
}

/**
 * Format timestamp to a relative or readable format e.g. "12 mins ago" or "Today, 10:45 PM".
 */
export function formatSessionTime(isoString) {
  if (!isoString) return "";
  const date = new Date(isoString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / (1000 * 60));

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/**
 * Format seconds to mm:ss or s
 */
export function formatDuration(seconds = 0) {
  if (seconds < 60) return `${seconds}s`;
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
}
