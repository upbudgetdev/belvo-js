---
"@upbudget/belvo-js": minor
---

Add analytics adapter and SWR integration

- Add `AnalyticsAdapter` interface for tracking widget events (PostHog, Segment, etc.)
- Add `BelvoEvents` constants for consistent event naming
- Replace useState with SWR for token fetching (request deduplication)
- Add type-safe global declaration for `window.belvoSDK`
- Fix script loading race condition
- Refactor Next.js provider to use `next/script` with proper lifecycle callbacks
- Add `useBelvoNext` and `useBelvoNextWidget` hooks for Next.js
