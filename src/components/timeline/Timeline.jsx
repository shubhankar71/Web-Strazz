import { Activity } from "lucide-react";
import TimelineEventItem from "./TimelineEventItem";
import EmptyState from "../ui/EmptyState";
import "./Timeline.css";

export default function Timeline({ events = [], targetEventId = null }) {
  if (!events.length) {
    return (
      <EmptyState
        icon={Activity}
        title="No timeline events match filter"
        description="Try selecting another category filter or view all events for this session."
      />
    );
  }

  const orderedEvents = [...events].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );

  return (
    <div className="ws-timeline-container">
      {orderedEvents.map((event) => (
        <TimelineEventItem
          key={event.eventId}
          event={event}
          isTarget={Boolean(targetEventId && event.eventId === targetEventId)}
        />
      ))}
    </div>
  );
}
