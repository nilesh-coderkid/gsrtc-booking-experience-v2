---
name: generate-code
description: Generates or updates GSRTC transit platform components, services, hooks, and types conforming strictly to architecture guidelines, wireframes, and concurrency requirements.
---

# Skill: Generate Code

## Objective

Generate clean, type-safe, performance-optimized code for the **GSRTC Redesign Platform** while guaranteeing complete compliance with the wireframe specifications (`GSRTC-WIREFRAMES.md`), the single-page architecture plan (`implementation_plan.md`), and the transit design system (`code-style-guide.md`).

## Workflow & Execution Rules

### 1. Type-First Contract Definition
- Before creating or modifying UI components or services, always verify or define contracts in `packages/types` or `@/src/types/`:
  - `Station`: ID, English name, Gujarati name (`નામ`), code, division.
  - `BusService`: ID, bus number, route, category (`Gurjarnagari`, `Express`, `Sleeper`, `Volvo AC`, `Electric`), amenities, departure/arrival times, fare.
  - `Seat`: Seat number, deck (`lower` | `upper`), quota (`general` | `ladies` | `divyang`), status (`available` | `selected` | `locked` | `booked`), row, column.
  - `SeatLock`: Seat number, schedule ID, lockedBy (session ID), lockedUntil (timestamp).
  - `PassengerDetails`: Name, age, gender, quota, ID proof number.
  - `FareBreakdown`: Base fare, reservation fee, toll charges, passenger amenities, GST, total fare.
  - `Booking`: PNR (`GSRTC-XXXXXX`), bus details, seats, passenger list, fare summary, QR code payload, status (`confirmed` | `cancelled`).
- Maintain `strict: true` TypeScript without `any`.

### 2. Service & Data Engine Implementation
- When generating data-handling logic:
  - Integrate with `GSRTCStorageEngine` (`@/src/services/storageEngine.ts`) for resilient LocalStorage persistence.
  - Populate and query pre-seeded Gujarat transit data from `@/src/services/seedData.ts`.
  - For real-time seat locking, implement or utilize `SeatLockService`:
    - Manage atomic 10-minute hold countdowns (`Date.now() + 600000`).
    - Broadcast events across tabs via `BroadcastChannel('gsrtc_seat_channel')`.
    - Provide automatic lock expiration and release on unmount/deselect.

### 3. Wireframe-Accurate UI Component Generation
- Generate components matching `GSRTC-WIREFRAMES.md`:
  - **Hero Omnibox & Quota Tabs (`@/src/components/hero/`):**
    - Autocomplete inputs with English & Gujarati station search.
    - 1-click station swap button (`<->`).
    - Smart date picker and passenger counter.
    - Quota pills: General, Single Lady, Divyang (♿), MP/MLA, AWT, Electric Bus, Statue of Unity.
  - **Bus Search Results (`@/src/components/buses/`):**
    - Filter bar (bus types, departure time slots, AC/Non-AC).
    - Responsive bus cards with route summary, live seat availability counter, amenities badges, and expandable seat picker toggle.
  - **SeatPicker 2.0 (`@/src/components/seatmap/`):**
    - Dual deck tabs (Lower Deck / Upper Deck) for sleeper buses; 2+1 / 2+2 / 3+2 layouts for seaters.
    - Prominent driver steering cabin demarcated at the front.
    - Visual states: Emerald Green (Available), Transit Blue (Selected), Amber Striped + 🔒 Lock (Held by other passenger), Red (Booked), Purple (Ladies Quota).
    - Enforce the **Single Lady safety rule**: solo male passengers cannot reserve seats adjacent to an occupied single lady seat.
    - Display the active 10-minute hold countdown timer when seats are selected.
  - **Passenger Details & Checkout (`@/src/components/checkout/`):**
    - Boarding point dropdown with reporting time and platform number.
    - Passenger entry forms with quota validation and accessible labels.
    - Itemized transparent fare breakdown (Base fare + Toll + Passenger amenities + GST).
    - Instant simulated checkout modal with dynamic UPI QR Code, GPay/PhonePe buttons, and GSRTC Wallet payment.
  - **Digital E-Ticket & Dynamic QR (`@/src/components/ticket/`):**
    - Prominent PNR badge and booking status.
    - Dynamic SVG QR code holding encrypted ticket validation string.
    - Print-ready CSS layout, PDF download trigger, and WhatsApp sharing.
  - **Live Bus Tracker (`@/src/components/tracking/`):**
    - Route timeline with past, current, and upcoming station checkpoints.
    - Real-time simulated GPS speed badge and ETA calculation.
  - **Digital Bus Pass & Refund Calculator (`@/src/components/pass/`, `@/src/components/cancel/`):**
    - Student/Commuter bus pass generator with live digital ID card preview.
    - Self-service cancellation flow with automated refund tier calculation.

### 4. Styling & Transit Design Tokens
- Utilize the official transit color palette:
  - Primary Navy: `#002B49`
  - Transit Blue: `#2563EB`
  - Kesari Saffron: `#E8590C` / `#D97706`
  - Emerald Green: `#059669`
  - Danger Red: `#DC2626`
- Button variants must adhere to `GSRTC-WIREFRAMES.md §11` (Primary, Secondary, Ghost, Danger, Success).
- Ensure interactive elements have a minimum **44x44px** touch target.
- Include mobile bottom navigation support on small viewports (`wireframes.md §10`).

### 5. Ripple-Effect Verification
- After generating any component or service, immediately verify and update its downstream consumers per `@/.agents/rules/code-style-guide.md`.
- Ensure new sections or modal triggers are registered in `@/src/App.tsx`.
