---
trigger: model_decision
description: Apply when editing components, types, services, seed data, or styles to ensure GSRTC architecture compliance, ripple-effect synchronization, and concurrency safety.
---

# GSRTC Code Style & Architecture Guide

## 1. Stack & Architecture

- **Core Stack:** React 19, TypeScript (`strict: true`), Vite 6, Tailwind CSS v4 (`@tailwindcss/vite`), Lucide React (`lucide-react`), Canvas Confetti (`canvas-confetti`), clsx, tailwind-merge.
- **Modern React.js Architecture:**
  - Pure client-side Single Page Application (SPA) powered by standard React 19 functional components, hooks, and clean composition.
  - Unified **One-Page State & Stepper Architecture** orchestrated in `apps/web/src/App.tsx`:
    - Top-level view tabs: `activeTab` (`'BOOKING' | 'TRACKING' | 'PASS' | 'CANCEL'`).
    - Multi-step booking stepper: `bookingStep` (`1` = Bus Search & Results, `2` = Interactive Seat Picker, `3` = Passenger Info & Checkout, `4` = Digital E-Ticket).
    - Drawers & modals: `MyBookingsDrawer`, `EmergencyHelplineModal`.
  - Strict Client-Side Rendering (CSR) with standard Vite 6 build pipeline (`index.html` entry, `createRoot` mounting in `apps/web/src/main.tsx`).
- **Monorepo & Package Layout:**
  - Clean pnpm workspace:
    - Root: `package.json` (`gsrtc-transit-platform`), `pnpm-workspace.yaml` (`apps/*`, `packages/*`).
    - Web Application: `apps/web` (`@gsrtc/web`).
    - Shared Contracts: `packages/types` (`@gsrtc/types`).
- **Data & Concurrency Layer:**
  - **Storage Engine (`GSRTCStorageEngine`):** Reactive LocalStorage-backed persistence pre-seeded with 30+ Gujarat stations (Ahmedabad Geeta Mandir, Vadodara, Surat, Rajkot, Bhavnagar, Statue of Unity, Somnath, Dwarka, Bhuj), bus fleets, and daily schedules in `apps/web/src/services/seedData.ts`.
  - **Atomic Seat Concurrency Lock (`SeatLockService`):** Multi-tab atomic locking via `BroadcastChannel('gsrtc_seat_channel')` with an active 10-minute hold countdown timer (`apps/web/src/services/seatLockService.ts`, `apps/web/src/hooks/useSeatLocks.ts`).
  - **Trilingual Localization:** Built-in dictionary and custom hook in `apps/web/src/hooks/useLanguage.ts` supporting English (`en`), Gujarati (`gu`), and Hindi (`hi`).
  - **Voice & Accessibility:** Web Speech API integration in `apps/web/src/speech/speechEngine.ts` for bilingual audio readouts (Gujarati & English) and WCAG 2.1 AA accessible UI.

## 2. Ripple-Effect Elimination Mapping

Any schema, service, or component update requires updating the full dependency chain:

- **Contracts & Data Layer:**
  - `packages/types/src/index.ts` (`@gsrtc/types`) ➔ `apps/web/src/services/seedData.ts` ➔ `apps/web/src/services/storageEngine.ts` ➔ downstream services (`busService.ts`, `seatLockService.ts`, `bookingService.ts`, `passService.ts`, `trackingService.ts`).
- **Seat Concurrency & Booking Chain:**
  - `seatLockService.ts` ➔ `useSeatLocks.ts` ➔ `SeatPicker.tsx` ➔ `PassengerCheckout.tsx` ➔ `bookingService.ts` ➔ `ETicketView.tsx`.
  - Updating seat status definitions requires updating the visual lock state, hold timer, multi-tab broadcast listener, and seat status legend.
- **Quota & Bus Search Flow:**
  - `HeroOmnibox.tsx` ➔ `busService.ts` ➔ `BusList.tsx` / `BusCard.tsx` ➔ `SeatPicker.tsx`.
  - Quotas (`GENERAL`, `SINGLE_LADY`, `DIVYANG`, `MP_MLA`, `AWT`, `ELECTRIC_BUS`, `STATUE_OF_UNITY`) enforce downstream booking rules:
    - *Single Lady Rule:* Solo male passengers cannot book adjacent to an occupied Single Lady seat.
    - *Divyang Quota:* Max 2 seats, preferred lower-deck front access, automatic speech synthesis trigger.
- **Checkout & Ticketing Chain:**
  - `PassengerCheckout.tsx` (Boarding/dropping stop selection, passenger details, fare summary) ➔ `bookingService.ts` ➔ `ETicketView.tsx` (Dynamic QR, print/PDF layout, WhatsApp share).
- **Live Bus Tracking:**
  - `trackingService.ts` (simulated GPS checkpoints, speed, ETA) ➔ `LiveBusTracker.tsx`.
- **Navigation & Global Shell:**
  - `App.tsx` ➔ `Navbar.tsx`, `LiveCounterTicker.tsx`, `MyBookingsDrawer.tsx`, `EmergencyHelplineModal.tsx`, `Footer.tsx`.

## 3. Design Tokens & Styling Conventions (per docs/GSRTC-WIREFRAMES.md)

- **Tailwind CSS v4 Configuration:**
  - Configured via `@import "tailwindcss";` in `apps/web/src/index.css` and `@tailwindcss/vite` in `apps/web/vite.config.ts`.
  - CSS design tokens:
    - `--gsrtc-navy`: `#002B49` (Header, authority accents)
    - `--gsrtc-navy-light`: `#003e6b`
    - `--gsrtc-saffron`: `#E8590C` (Hero highlights, quotas, hold warnings)
    - `--gsrtc-saffron-light`: `#ff772e`
    - `--gsrtc-green`: `#059669` (Available seats, confirmed tickets, success alerts)
    - `--gsrtc-emerald`: `#10b981`
- **Seat Map Visual States:**
  - **Available:** `bg-emerald-600` or `border-emerald-600 text-emerald-700 hover:bg-emerald-50`
  - **Selected (You):** `bg-blue-600 text-white shadow-md ring-2 ring-blue-400`
  - **Held by Another User:** Amber diagonal hazard stripes (`.seat-locked-stripes`, `border-amber-400 cursor-not-allowed`) with 🔒 lock icon and tooltip *"Held by another passenger"*
  - **Booked:** `bg-red-600 text-white cursor-not-allowed opacity-80`
  - **Ladies Quota:** `bg-purple-100 text-purple-700 border-purple-400`
  - **Divyang Quota:** `bg-amber-100 text-amber-700 border-amber-400`
- **Button Variants (Wireframes §11):**
  - Primary: `bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow-sm`
  - Secondary: `bg-white border-2 border-blue-600 text-blue-600 hover:bg-blue-50 font-medium rounded-lg`
  - Ghost: `bg-transparent hover:bg-gray-100 text-gray-700 font-medium rounded-lg`
  - Danger: `bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg`
  - Success: `bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg`
- **Mobile-First & Accessibility Standards:**
  - Mobile-responsive navigation and drawers (`MyBookingsDrawer`, `EmergencyHelplineModal`).
  - Interactive touch targets: Minimum **44x44px**.
  - High visual contrast complying with **WCAG 2.1 AA**.
  - All form controls must have matching `id` and `<label htmlFor="...">`.

## 4. Code & Naming Conventions

- **File Naming:**
  - UI Components: `PascalCase.tsx` (`apps/web/src/components/<domain>/<Component>.tsx`)
  - Domain Services: `camelCase.ts` (`apps/web/src/services/<domain>Service.ts`)
  - Custom Hooks: `camelCase.ts` (`apps/web/src/hooks/use<Feature>.ts`)
  - Shared Contracts: `packages/types/src/index.ts` exported via `@gsrtc/types`
- **TypeScript Guidelines:**
  - Strict typing enabled (`strict: true`). Absolutely no `any`.
  - Always export typed models from `packages/types/src/index.ts`: `Station`, `BusService`, `BusSchedule`, `Seat`, `SeatLock`, `PassengerDetails`, `FareBreakdown`, `Booking`, `BusPassApplication`, `CancellationRecord`.
  - Handle optional/nullable fields defensively with optional chaining (`?.`) and explicit fallbacks.

## 5. Anti-Patterns & Prohibited Practices (Modern React Standards Compliance)

- **NO Server Components or Server Directives:** Absolutely no `'use client'` or `'use server'` directives. All components are standard client-side React 19 functional components.
- **NO Server-Side Rendering (SSR) or File-System Routing:** All UI state is coordinated client-side via React 19 state in `App.tsx` (`activeTab`, `bookingStep`). Never introduce server-side lifecycle hooks (`getServerSideProps`, `getStaticProps`) or file-system routing conventions.
- **NO Uninstalled External Frameworks or Libraries:** Do NOT introduce uninstalled packages (such as external routing packages, third-party state managers, or uninstalled animation libraries) that conflict with the unified One-Page architecture and monorepo build. Use the existing `@gsrtc/types`, React 19 hooks, and domain services.
- **NO Server-Side API Handlers:** No API route handlers or server actions. All persistence and business logic run through client-side domain services (`storageEngine.ts`, `busService.ts`, `seatLockService.ts`) and browser APIs (`fetch`, `BroadcastChannel`, `localStorage`).
- **NO jQuery or Legacy Inline Scripts:** Everything must be written in modular React hooks and components.
- **NO Duplicate Functions:** Never duplicate normalization, trimming, date parsing, or currency formatting. Use existing helpers in services.
- **NO Browser-Tab Blocking or External Redirects:** Never intercept navigation with intrusive popups or window redirects to search engines.
- **NO Hardcoded Transit Data:** Never hardcode stations, depot names, fare rates, or amenities directly inside UI templates. All data must flow from `seedData.ts` through `GSRTCStorageEngine`.
- **NO Unclosed Concurrency Channels:** Always close `BroadcastChannel` instances and clear countdown intervals in `useEffect` cleanup routines.
