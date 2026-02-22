'use client';

import { useEffect } from "react";
import posthog from "posthog-js";
import EventCard from "@/components/EventCard";
import type { EventItem } from "@/lib/constants";

interface Props {
  events: EventItem[];
}

const FeaturedEventsSection = ({ events }: Props) => {
  useEffect(() => {
    posthog.capture("featured_events_viewed", {
      event_count: events.length,
    });
    // Only fire once on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="mt-20 space-y-7">
      <h3>Featured Events</h3>

      <ul className="events">
        {events.map((event) => (
          <li key={event.title}>
            <EventCard {...event} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FeaturedEventsSection;
