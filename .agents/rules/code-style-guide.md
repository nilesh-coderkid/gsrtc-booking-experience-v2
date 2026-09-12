---
trigger: model_decision
description: Apply when editing components, types, services, seed data, or styles to ensure GSRTC architecture compliance, ripple-effect synchronization, and concurrency safety.
---

# GSRTC Code Style & Architecture Guide

## 1. Stack & Architecture

- **Core Stack:** React 19, TypeScript (`strict: true`), Vite, Tailwind CSS (transit design system tokens), Lucide React (`lucide-react`), Framer Motion.
- **Monorepo & Layout:**
  - Clean monorepo structure: `apps/web` (One-Page React Application), `packages/types` (shared transit contracts), `packages/ui` (reusable transit UI primitives).
  - Unified **One-Page Experience**: Seamless in-page active tab switching without disruptive page reloads (`Book Bus`, `Live Tracker`, `Bus Pass`, `Cancel & Refund`, `My Bookings`).
- **Data & Concurrency Layer:**
  - **Storage Engine (`GSRTCStorageEngine`):** Reactive LocalStorage-backed persistence pre-seeded with 30+ Gujarat stations (Ahmedabad Geeta Mandir, Vadodara, Surat, Rajkot, Bhavnagar, Statue of Unity, Somnath, Dwarka, Bhuj), bus fleets, and daily schedules.
  - **Atomic Seat Concurrency Lock (`SeatLockService`):** Multi-tab atomic locking via `BroadcastChannel('gsrtc_seat_channel')` with an active 10-minute hold countdown timer.
  - **Voice & Accessibility:** Web Speech API integration for bilingual audio readouts (Gujarati & English) and WCAG 2.1 AA accessible UI.

## 2. Ripple-Effect Elimination Mapping

Any schema, service, or component update requires updating the full dependency chain:

- **Contracts & Data Layer:**
  - `packages/types/` (or `@/src/types/index.ts`) ➔ `@/src/services/seedData.ts` ➔ `@/src/services/storageEngine.ts` ➔ downstream services.
- **Seat Concurrency & Booking Chain:**
  - `SeatLockService.ts` ➔ `useSeatLocks.ts` ➔ `SeatPicker.tsx` (`LowerDeck.tsx`, `UpperDeck.tsx`, `SeatLegend.tsx`) ➔ `FareSummary.tsx` ➔ `bookingService.ts`.
  - Updating seat status definitions requires updating the visual lock state, hold timer, multi-tab broadcast listener, and seat status legend.
- **Quota & Bus Search Flow:**
  - `QuotaTabs.tsx` / `HeroOmnibox.tsx` ➔ `busService.ts` ➔ `BusList.tsx` / `BusCard.tsx` ➔ `SeatPicker.tsx`.
  - Quotas (General, Single Lady, Divyang, MP/MLA, AWT, Electric, SOU) enforce downstream booking rules:
    - *Single Lady Rule:* Solo male passengers cannot book adjacent to an occupied Single Lady seat.
    - *Divyang Quota:* Max 2 seats, preferred lower-deck front access, automatic speech synthesis trigger.
- **Checkout & Ticketing Chain:**
  - `BoardingSelector.tsx` ➔ `PassengerForm.tsx` ➔ `FareSummary.tsx` (Base + Toll + GST breakdown) ➔ `PaymentModal.tsx` (UPI QR / GSRTC Wallet) ➔ `bookingService.ts` ➔ `DynamicQrTicket.tsx` ➔ `PrintTicketView.tsx`.
- **Live Bus Tracking:**
  - `trackingService.ts` (simulated GPS checkpoints, speed, ETA) ➔ `LiveBusTrackerSection.tsx` ➔ `RouteTimelineMap.tsx` ➔ `SpeedBadge.tsx`.
- **Navigation & Global Shell:**
  - `App.tsx` ➔ `Navbar.tsx`, `MyBookingsDrawer.tsx`, `LanguageToggle.tsx` (`useLanguage.ts`), `VoiceAssist.tsx`.

## 3. Design Tokens & Styling Conventions (per GSRTC-WIREFRAMES.md)

- **Color Palette:**
  - `Primary Navy`: `#002B49` (Header, authority accents)
  - `Transit Blue`: `#2563EB` (Primary buttons, active states, links)
  - `Kesari Saffron / Amber`: `#E8590C` / `#D97706` (Hero highlights, quotas, hold warnings)
  - `Emerald Green`: `#059669` (Available seats, confirmed tickets, success alerts)
  - `Danger Red`: `#DC2626` (Booked seats, cancellations, errors)
  - `Quota Purple`: `#7C3AED` (Ladies quota seats)
  - `Neutral Gray`: `#6B7280` / `#9CA3AF` (Borders, subtle labels)
  - `Background`: `#F9FAFB` (Page background) | `Surface`: `#FFFFFF` (Cards, drawers, modals)
- **Seat Map Visual States:**
  - **Available:** `bg-emerald-600` or `border-emerald-600 text-emerald-700 hover:bg-emerald-50`
  - **Selected:** `bg-blue-600 text-white shadow-md ring-2 ring-blue-400`
  - **Held by Another User:** Amber diagonal stripe pattern (`bg-amber-100 text-amber-800 border-amber-400 cursor-not-allowed`) with 🔒 lock icon and tooltip *"Held by another passenger"*
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
  - Mobile bottom navigation bar (`Home`, `Search`, `Bookings`, `Passes`, `More`) with fixed viewport pinning.
  - Interactive touch targets: Minimum **44x44px**.
  - High visual contrast complying with **WCAG 2.1 AA**.
  - All form controls must have matching `id` and `<label htmlFor="...">`.

## 4. Code & Naming Conventions

- **File Naming:**
  - UI Components: `PascalCase.tsx` (`@/src/components/<domain>/<Component>.tsx`)
  - Domain Services: `camelCase.ts` (`@/src/services/<domain>Service.ts`)
  - Custom Hooks: `camelCase.ts` (`@/src/hooks/use<Feature>.ts`)
  - Types & Contracts: `camelCase.ts` (`@/src/types/<domain>.ts`)
- **TypeScript Guidelines:**
  - Strict typing enabled (`strict: true`). Absolutely no `any`.
  - Always export typed models for `Station`, `BusService`, `Seat`, `Passenger`, `Booking`, `Pass`, and `CancellationRecord`.
  - Handle optional/nullable fields defensively with optional chaining (`?.`) and explicit fallbacks.

## 5. Anti-Patterns & Prohibited Practices (enhancements.md Compliance)

- **NO jQuery or Legacy Inline Scripts:** Everything must be written in modular React hooks and components.
- **NO Duplicate Functions:** Never duplicate normalization, trimming, date parsing, or currency formatting. Use `@/src/utils/`.
- **NO Browser-Tab Blocking or External Redirects:** Never intercept navigation with intrusive popups or window redirects to search engines.
- **NO Hardcoded Transit Data:** Never hardcode stations, depot names, fare rates, or amenities directly inside UI templates. All data must flow from `seedData.ts` through `GSRTCStorageEngine`.
- **NO Unclosed Concurrency Channels:** Always close `BroadcastChannel` instances and clear countdown intervals in `useEffect` cleanup routines.
