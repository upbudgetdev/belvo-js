# @upbudget/belvo-js

## 1.1.0

### Minor Changes

- [#3](https://github.com/upbudgetdev/belvo-js/pull/3) [`0ce63fe`](https://github.com/upbudgetdev/belvo-js/commit/0ce63fe7f5bf1fcdd8b46c7e7dd2d39d5621d58f) Thanks [@pdrolima](https://github.com/pdrolima)! - Add analytics adapter and SWR integration

  - Add `AnalyticsAdapter` interface for tracking widget events (PostHog, Segment, etc.)
  - Add `BelvoEvents` constants for consistent event naming
  - Replace useState with SWR for token fetching (request deduplication)
  - Add type-safe global declaration for `window.belvoSDK`
  - Fix script loading race condition
  - Refactor Next.js provider to use `next/script` with proper lifecycle callbacks
  - Add `useBelvoNext` and `useBelvoNextWidget` hooks for Next.js
