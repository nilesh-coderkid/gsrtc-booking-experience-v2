---
name: generate-code
description: Generates or updates GSRTC transit platform components, services, hooks, and types conforming strictly to architecture guidelines, wireframes, and concurrency requirements.
---

# Skill: Generate Code

## Objective

Generate clean, type-safe, performance-optimized code for the **GSRTC Redesign Platform** while guaranteeing complete compliance with the wireframe specifications (`docs/GSRTC-WIREFRAMES.md`), the single-page architecture plan (`docs/implementation_plan.md`), and the transit design system (`code-style-guide.md`).

## Workflow & Execution Rules

### 1. Type-First Contract Definition
- Before creating or modifying UI components or services, always verify or define contracts in `packages/types/src/index.ts` exported via `@gsrtc/types`:
  - `Station`: ID, English name, Gujarati name (`nameGu`), code, division, coordinates.
  - `BusService`: ID, bus number, route, category (`Gurjarnagari`, `Express`, `Sleeper`, `Volvo AC`, `Electric Express`), amenities, departure/arrival times, fare.
  - `BusSchedule`: Complete daily schedule metadata, route stops, meal stops, pricing.
  - `Seat`: Seat number, deck (`LOWER` | `UPPER`), quota (`GENERAL` | `LADIES` | `DIVYANG`), status (`AVAILABLE` | `SELECTED_BY_ME` | `LOCKED_BY_OTHER` | `BOOKED`), row, column.
  - `SeatLock`: Schedule ID, seat number, lockedBySessionId, lockedUntil (timestamp).
  - `PassengerDetails`: Name, age, gender, quota, ID proof number.
  - `FareBreakdown`: Base fare, reservation fee, toll charges, passenger amenities, GST, total fare.
  - `Booking`: PNR (`GSRTC-XXXXXX`), schedule ID, seats, passenger list, fare summary, QR payload, status (`CONFIRMED` | `CANCELLED`).
  - `BusPassApplication`: Commuter/Student pass records.
- Maintain `strict: true` TypeScript without `any`.

### 2. Service & Data Engine Implementation
- When generating data-handling logic:
  - Integrate with `GSRTCStorageEngine` (`apps/web/src/services/storageEngine.ts`) for resilient LocalStorage persistence.
  - Populate and query pre-seeded Gujarat transit data from `apps/web/src/services/seedData.ts`.
  - For real-time seat locking, implement or utilize `SeatLockService` (`apps/web/src/services/seatLockService.ts`):
    - Manage atomic 10-minute hold countdowns (`Date.now() + 600000`).
    - Broadcast events across tabs via `BroadcastChannel('gsrtc_seat_channel')`.
    - Provide automatic lock expiration and release on unmount/deselect.

### 3. Wireframe-Accurate UI Component Generation
- Generate components matching `docs/GSRTC-WIREFRAMES.md`:
  - **Hero Omnibox & Quotas (`apps/web/src/components/hero/HeroOmnibox.tsx`):**
    - Autocomplete inputs with English & Gujarati station search.
    - 1-click station swap button (`<->`).
    - Smart date picker and passenger quota selector.
    - Quota pills: General, Single Lady, Divyang (♿), MP/MLA, AWT, Electric Bus, Statue of Unity.
  - **Bus Search Results (`apps/web/src/components/buses/`):**
    - Filter bar (bus classes, departure time slots, AC/Non-AC, amenities).
    - Responsive bus cards (`BusCard.tsx`) with route summary, live seat availability counter, amenities badges, and seat picker toggle.
  - **SeatPicker 2.0 (`apps/web/src/components/seatmap/SeatPicker.tsx`):**
    - Dual deck tabs (Lower Deck / Upper Deck) for sleeper buses; 2+1 / 2+2 / 3+2 layouts for seaters.
    - Prominent driver steering cabin demarcated at the front.
    - Visual states: Emerald Green (Available), Transit Blue (Selected by Me), Amber Striped hazard pattern + 🔒 Lock (Held by other passenger), Red (Booked), Purple (Ladies Quota).
    - Enforce the **Single Lady safety rule**: solo male passengers cannot reserve seats adjacent to an occupied single lady seat.
    - Display the active 10-minute hold countdown timer when seats are selected.
  - **Passenger Details & Checkout (`apps/web/src/components/checkout/PassengerCheckout.tsx`):**
    - Boarding point dropdown with reporting time and platform number.
    - Passenger entry forms with quota validation and accessible labels.
    - Itemized transparent fare breakdown (Base fare + Toll + Passenger amenities + GST).
    - Simulated checkout with dynamic UPI QR Code, GPay/PhonePe buttons, and GSRTC Wallet payment.
  - **Digital E-Ticket & Dynamic QR (`apps/web/src/components/ticket/ETicketView.tsx`):**
    - Prominent PNR badge and booking status.
    - Dynamic SVG QR code holding encrypted ticket validation string.
    - Print-ready CSS layout, PDF download trigger, and WhatsApp sharing.
  - **Live Bus Tracker (`apps/web/src/components/tracking/LiveBusTracker.tsx`):**
    - Route timeline with past, current, and upcoming station checkpoints.
    - Real-time simulated GPS speed badge and ETA calculation.
  - **Digital Bus Pass & Refund Calculator (`apps/web/src/components/pass/`, `apps/web/src/components/cancel/`):**
    - Student/Commuter bus pass generator (`BusPassSection.tsx`) with live digital ID card preview.
    - Self-service cancellation flow (`CancellationSection.tsx`) with automated refund tier calculation.

### 4. Styling & Transit Design Tokens
- Utilize the official transit color palette:
  - Primary Navy: `#002B49`
  - Transit Blue: `#2563EB`
  - Kesari Saffron: `#E8590C` / `#D97706`
  - Emerald Green: `#059669`
  - Danger Red: `#DC2626`
- Button variants must adhere to `docs/GSRTC-WIREFRAMES.md §11` (Primary, Secondary, Ghost, Danger, Success).
- Ensure interactive elements have a minimum **44x44px** touch target.
- Include mobile bottom navigation support on small viewports (`docs/GSRTC-WIREFRAMES.md §10`).

### 5. Ripple-Effect Verification
- After generating any component or service, immediately verify and update its downstream consumers per `.agents/rules/code-style-guide.md`.
- Ensure new sections or modal triggers are registered in `apps/web/src/App.tsx`.

### 6. Modern React.js Standards Compliance
- Build exclusively with modern client-side React 19 functional components with strict TypeScript prop contracts and custom hooks (`useState`, `useReducer`, `useMemo`, `useCallback`, `useRef`, `useEffect`).
- Never emit server component directives (`'use client'`, `'use server'`), SSR patterns (`getServerSideProps`, `getStaticProps`), or server framework imports.
- Maintain the unified One-Page React state machine in `apps/web/src/App.tsx` (`activeTab`, `bookingStep`), avoiding uninstalled third-party routing or state management libraries.
- Manage global transit state via `GSRTCStorageEngine` and encapsulate browser APIs (`BroadcastChannel`, `localStorage`, Web Speech API) into reactive custom hooks with rigorous cleanup (`useSeatLocks`, `useLanguage`).
