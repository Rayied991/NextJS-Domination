<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into your **DevEvents** Next.js 16 App Router project. Here's a summary of what was set up:

- **`instrumentation-client.ts`** (new file): PostHog is initialised here using the Next.js 15.3+ `instrumentation-client` pattern — the correct approach for this version. It enables session replay, automatic exception/error tracking, and routes all analytics through a reverse proxy (`/ingest`) to avoid ad blockers.
- **`next.config.ts`** (updated): Added reverse-proxy rewrites so PostHog ingestion traffic routes through your own domain (`/ingest/*` → `us.i.posthog.com`), plus `skipTrailingSlashRedirect: true` required by PostHog.
- **`components/ExploreBtn.tsx`** (updated): Added `posthog.capture('explore_events_clicked')` to the click handler alongside the existing `console.log`.
- **`components/EventCard.tsx`** (updated): Added `'use client'` directive and `posthog.capture('event_card_clicked')` with rich properties (event title, slug, location, date) so you can see which events attract the most interest.
- **`components/FeaturedEventsSection.tsx`** (new file): A thin client component wrapping the events list that fires `posthog.capture('featured_events_viewed')` on mount, capturing the top of the event discovery funnel.
- **`app/page.tsx`** (updated): Swapped the inline events list for the new `FeaturedEventsSection` component, keeping the page itself as a Server Component.
- **`.env.local`** (updated): `NEXT_PUBLIC_POSTHOG_KEY` and `NEXT_PUBLIC_POSTHOG_HOST` written securely — never hardcoded in source files.

## Events instrumented

| Event name | Description | File |
|---|---|---|
| `featured_events_viewed` | User views the Featured Events section on the homepage. Represents the top of the event discovery funnel. | `components/FeaturedEventsSection.tsx` |
| `explore_events_clicked` | User clicks the "Explore Events" CTA button — the primary call-to-action on the hero section. | `components/ExploreBtn.tsx` |
| `event_card_clicked` | User clicks on an event card to view event details. Properties: `event_title`, `event_slug`, `event_location`, `event_date`. | `components/EventCard.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behaviour, based on the events we just instrumented:

### Dashboard
- [Analytics basics](https://us.posthog.com/project/320350/dashboard/1298654)

### Insights
- [Event Discovery Funnel](https://us.posthog.com/project/320350/insights/tYoieFlu) — Conversion funnel: Homepage View → Explore Events Click → Event Card Click
- [Event Card Clicks by Event](https://us.posthog.com/project/320350/insights/nwZm1hKK) — Which developer events attract the most clicks (bar chart breakdown)
- [Unique Users Exploring Events](https://us.posthog.com/project/320350/insights/dpxm9ESH) — Daily unique users clicking event cards
- [Featured Events Page Views](https://us.posthog.com/project/320350/insights/LyLSB8cN) — Daily homepage/featured events section views
- [Explore Events Button Clicks](https://us.posthog.com/project/320350/insights/iJvCPuZ5) — Daily CTA button click trend

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/posthog-integration-nextjs-app-router/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
