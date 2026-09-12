---
name: code-review
description: Reviews local code changes for GSRTC architectural compliance, TypeScript strictness, seat concurrency locking, ripple-effect completeness, styling fidelity, and accessibility.
---

# Skill: Code Review

## Objective

Perform thorough code reviews on local changes to ensure flawless execution of the **GSRTC Modernization Platform**, preventing regressions, memory leaks, concurrency conflicts, and wireframe styling discrepancies.

## Review Checklist

### 1. Architecture & One-Page Integrity
- Does the application preserve the seamless **One-Page Layout** without triggering jarring full-page refreshes?
- Is all transit data (stations, routes, schedules, fares, fleets) decoupled from UI components and managed via `seedData.ts` and `GSRTCStorageEngine`?
- Are data models cleanly typed in `packages/types/src/index.ts` and imported via `@gsrtc/types` without inline `any`?

### 2. Multi-Tab Concurrency & Seat Locking (`SeatLockService`)
- Are seat lock acquisitions atomic, verifying against both existing bookings and active holds (`lockedUntil > Date.now()`)?
- Does every `BroadcastChannel` listener have a corresponding cleanup function in `useEffect` to prevent channel leaks and duplicate events?
- Are seats held by another session rendered with the proper visual indicators: amber diagonal stripes, 🔒 lock icon, and disabled click handler?
- Does the 10-minute hold timer synchronize across active tabs and release held seats automatically upon expiration?
- Upon payment completion, is the seat atomically transitioned from `locked` to `booked`?

### 3. Transit Business Logic & Quotas
- **Single Lady Quota Rule:** Does the seat allocator prevent solo male passengers from selecting a seat immediately adjacent to an occupied single lady seat?
- **Divyang Accessibility:** Are Divyang quota limits enforced (max 2 seats) and accompanied by Web Speech API bilingual audio cues?
- **Fare Integrity:** Is the transparent fare breakdown accurately computed (`Base Fare + Reservation Fee + Toll Charges + Amenities + GST`)?

### 4. Wireframe & Visual Design Fidelity (`docs/GSRTC-WIREFRAMES.md`)
- Does the UI strictly match the visual mockups and layout structure defined in `docs/GSRTC-WIREFRAMES.md`?
- Are the official color tokens applied consistently:
  - Primary Navy `#002B49`, Transit Blue `#2563EB`, Kesari Saffron `#E8590C`, Emerald Green `#059669`, Danger Red `#DC2626`.
- Do buttons adhere to the defined variants (Primary, Secondary, Ghost, Danger, Success)?
- Is mobile responsiveness preserved, including touch targets >= **44x44px** and the bottom navigation bar?

### 5. Accessibility & Anti-Pattern Prevention (`docs/enhancements.md`)
- Are form controls explicitly bound to labels via matching `id` and `htmlFor` attributes?
- Are there zero legacy code smells: no jQuery dependencies, no inline event handlers, no duplicate helper functions, and no browser-blocking alerts or redirects?
- Are keyboard navigation and screen-reader accessibility supported across modals and drawers?

### 6. Ripple-Effect Completeness
- Did the author update all downstream dependents according to `.agents/rules/code-style-guide.md`?
- If changes were made to `SeatLockService`, `storageEngine`, or `bookingService`, have all consuming components been validated?

### 7. Modern React.js Standards Compliance
- Does the code adhere strictly to modern client-side React 19 standards (functional components, React hooks, pure client-side rendering with Vite 6)?
- Are there **zero** server component directives (`'use client'`, `'use server'`), SSR lifecycle hooks (`getServerSideProps`, `getStaticProps`), or server framework imports?
- Is view navigation orchestrated cleanly via the One-Page state machine in `apps/web/src/App.tsx` (`activeTab`, `bookingStep`), avoiding uninstalled routing or state libraries?
- Is state managed cleanly via `GSRTCStorageEngine`, `SeatLockService`, and custom hooks (`useLanguage`, `useSeatLocks`) without memory leaks or unclosed channel listeners?

## Feedback Format

- **Summary:** Concise high-level evaluation of the PR or local diff.
- **Concurrency & Logic Audit:** Verification of seat locking, quota handling, and storage reactivity.
- **Action Items:** Bulleted list of required fixes organized by file path (`[file.tsx:line]`).
- **Rationale:** Clear technical justification based on GSRTC specifications.
