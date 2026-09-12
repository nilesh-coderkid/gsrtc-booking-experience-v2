# GSRTC Website Redesign — Team Plan

> Gujarat State Road Transport Corporation (https://gsrtc.in/site/)
> Workshop Planning Document

---

## Table of Contents

1. [Current Site Analysis](#1-current-site-analysis)
2. [Recommended Tech Stack](#2-recommended-tech-stack)
3. [Team Structure](#3-team-structure)
4. [Phased Development Plan](#4-phased-development-plan)
5. [Folder Structure](#5-folder-structure)
6. [Key Design Decisions](#6-key-design-decisions)
7. [User Flows](#7-user-flows)
8. [Git Workflow](#8-git-workflow)
9. [Daily Workflow](#9-daily-workflow)
10. [Timeline](#10-timeline)
11. [Checklist](#11-checklist)

---

## 1. Current Site Analysis

### Site Age & Tech Stack

| Indicator | Finding |
|-----------|---------|
| Organization Founded | 1 May 1960 (66 years) |
| Website Built | ~2018-2020 (Bootstrap 4-era patterns) |
| Last Updated | August 17, 2026 (per footer) |
| Analytics | Google Analytics UA (deprecated since July 2023, not migrated to GA4) |
| Frontend | Bootstrap 5 + jQuery 3.6.4 + jQuery UI 1.13.2 + OWL Carousel |
| Architecture | Server-rendered, no SPA, inline JS (~800+ lines on homepage) |

### Current Problems

#### Design Issues
- Outdated visual language (Bootstrap template look)
- No mobile-first booking experience
- Tab overload (6 booking tabs on homepage)
- Popup-heavy UX (30s popup + multi-tab alert)
- Stats numbers are hardcoded, not live

#### Technical Issues
- jQuery dependency (no modularity)
- Inline JS (~800+ lines in homepage)
- Duplicate code (trim() defined 3x, jQuery UI loaded twice from local + CDN)
- No component-based architecture
- Broken accessibility panel trigger (`uw-widget-custom-trigger2` doesn't exist)
- Console errors: `counterUp is not a function`

#### UX Issues
- Booking form complex (autofill + hidden fields + validation spread across JS)
- No progress indicator during booking
- No seat selection preview
- No fare comparison
- No filter by bus type/amenities
- Multi-tab restriction blocks legitimate use
- Label/for mismatches on checkboxes
- Preloader references `Kerala_Logo.png` (wrong state)

---

## 2. Recommended Tech Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Framework** | React 19 (Vite 6 SPA) | Modern component architecture, instant HMR, high performance, modular |
| **Architecture** | Unified One-Page App (`App.tsx` state machine) | Seamless in-page active tab switching, no jarring full-page refreshes |
| **Workspace** | pnpm Monorepo (`apps/web`, `packages/types`) | Shared type safety across frontend and domain contracts |
| **Styling** | Tailwind CSS v4 (`@tailwindcss/vite`) | Zero-config Vite integration, modern CSS tokens, high performance |
| **Icons** | Lucide React (`lucide-react`) | Consistent, clean, tree-shakeable transit iconography |
| **Concurrency** | `BroadcastChannel` + `localStorage` (`SeatLockService`) | Atomic 10-minute hold countdowns with instant cross-tab sync |
| **Data Engine** | LocalStorage Engine (`GSRTCStorageEngine`) | Offline-capable client-side persistence pre-seeded with 30+ stations |
| **i18n** | Trilingual Hook (`useLanguage.ts`) | Native Gujarati, Hindi, and English reactive language dictionary |
| **Voice Assist** | Web Speech API (`speechEngine.ts`) | Bilingual voice readouts for Divyang accessibility |
| **Celebration** | Canvas Confetti (`canvas-confetti`) | Lightweight visual celebration upon successful ticket confirmation |
| **Analytics** | GA4 via gtag | Modern replacement for deprecated UA analytics |
| **Deployment** | Cloudflare Pages / AWS S3 + CloudFront / Nginx | Gujarat Government cloud, edge CDN or self-hosted static hosting |

---

## 3. Team Structure

### Roles (5-7 people)

```
┌─────────────────────────────────────────────┐
│              Project Lead / PM              │
│         (Architecture + Coordination)       │
└─────────────┬───────────────────┬───────────┘
              │                   │
    ┌─────────▼─────────┐ ┌──────▼──────────┐
    │  Design Lead (1)  │ │  Tech Lead (1)  │
    │  UI/UX + Design   │ │  Architecture   │
    │  System           │ │  + Code Review  │
    └─────────┬─────────┘ └──────┬──────────┘
              │                   │
    ┌─────────▼───────────────────▼──────────┐
    │           Development Team (3-4)        │
    │                                         │
    │  Dev A: Homepage + Booking Widget       │
    │  Dev B: Booking Flow (Search→Payment)   │
    │  Dev C: Account + Post-Booking Pages    │
    │  Dev D: Info Pages + CMS (if needed)    │
    └─────────────────────────────────────────┘
```

### Responsibilities

| Role | Responsibilities |
|------|-----------------|
| **Project Lead** | Architecture decisions, sprint planning, stakeholder communication |
| **Design Lead** | Figma wireframes, design system tokens, component specs, accessibility |
| **Tech Lead** | Code reviews, CI/CD, performance, security, mentoring |
| **Dev A** | Homepage, booking widget, layout components, autocomplete |
| **Dev B** | Search results, seat selection, passenger forms, payment integration |
| **Dev C** | Auth pages, dashboard, booking history, wallet, bus pass |
| **Dev D** | Static pages (About, Contact, FAQ, Policies, Tenders) |

---

## 4. Phased Development Plan

### Phase 1: Design System + Foundation (Week 1-2)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Monorepo & pnpm workspace setup | Tech Lead | `pnpm-workspace.yaml`, `package.json` |
| Shared transit contracts (`Station`, `BusSchedule`, `SeatLock`) | Tech Lead | `packages/types/src/index.ts` |
| Tailwind CSS v4 setup & transit design tokens | Design Lead | `apps/web/src/index.css`, `vite.config.ts` |
| LocalStorage engine & seed fleet data (30+ stations) | Dev A | `apps/web/src/services/storageEngine.ts`, `seedData.ts` |
| Trilingual dictionary & hook (en/gu/hi) | Dev C | `apps/web/src/hooks/useLanguage.ts` |

### Phase 2: One-Page Shell + Hero Omnibox (Week 2-3)

| Task | Owner | Deliverable |
|------|-------|-------------|
| One-Page layout container & active view state machine | Tech Lead | `apps/web/src/App.tsx` |
| Hero Omnibox (depot autocomplete, station swap, quota selector) | Dev A | `apps/web/src/components/hero/HeroOmnibox.tsx` |
| Responsive Navbar with view tabs & language toggle | Dev A | `apps/web/src/components/layout/Navbar.tsx` |
| Live Counter Ticker (active fleet, passenger statistics) | Dev A | `apps/web/src/components/layout/LiveCounterTicker.tsx` |
| Footer & accessibility links | Dev A | `apps/web/src/components/layout/Footer.tsx` |

### Phase 3: Booking Flow & Concurrency Engine (Week 3-5)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Booking step progression indicator (Steps 1-4) | Dev B | `apps/web/src/components/stepper/BookingStepper.tsx` |
| Bus search results list & filters (class, AC, amenities) | Dev B | `apps/web/src/components/buses/BusList.tsx`, `BusCard.tsx` |
| Real-time atomic seat concurrency locking service | Dev B | `apps/web/src/services/seatLockService.ts`, `useSeatLocks.ts` |
| Interactive dual-deck SeatPicker (Single Lady safety rule, hold timer) | Dev B | `apps/web/src/components/seatmap/SeatPicker.tsx` |
| Boarding selector, passenger forms & simulated checkout | Dev B | `apps/web/src/components/checkout/PassengerCheckout.tsx` |
| Digital E-Ticket view with dynamic QR code & PDF/print layout | Dev B | `apps/web/src/components/ticket/ETicketView.tsx` |

### Phase 4: Account, Passes & Live Tracking (Week 4-6)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Quick-access booking history drawer | Dev C | `apps/web/src/components/layout/MyBookingsDrawer.tsx` |
| Live GPS Bus Tracker (interactive station route timeline & speed) | Dev C | `apps/web/src/components/tracking/LiveBusTracker.tsx` |
| Commuter & Student bus pass generator with digital pass card | Dev C | `apps/web/src/components/pass/BusPassSection.tsx` |
| Ticket cancellation & automated refund calculator | Dev C | `apps/web/src/components/cancel/CancellationSection.tsx` |
| 24x7 Emergency helpline modal | Dev C | `apps/web/src/components/helpline/EmergencyHelplineModal.tsx` |

### Phase 5: Voice Accessibility & Polish (Week 5-7)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Web Speech API integration (Gujarati/English readouts) | Dev D | `apps/web/src/speech/speechEngine.ts` |
| Accessibility audit (WCAG 2.1 AA compliance) | Tech Lead | Accessibility test reports |
| Performance optimization & Lighthouse 90+ score | Tech Lead | Vite production bundle audit |
| Multi-tab concurrency verification & QA | All | Multi-tab test reports |

---

## 5. Folder Structure

```
gsrtc-booking-experience-v2/
├── apps/
│   └── web/                                # One-Page React Application (@gsrtc/web)
│       ├── src/
│       │   ├── assets/                     # Hero banners & SVG assets
│       │   ├── components/                 # Modular transit components
│       │   │   ├── buses/                  # BusList.tsx, BusCard.tsx
│       │   │   ├── cancel/                 # CancellationSection.tsx
│       │   │   ├── checkout/               # PassengerCheckout.tsx
│       │   │   ├── helpline/               # EmergencyHelplineModal.tsx
│       │   │   ├── hero/                   # HeroOmnibox.tsx
│       │   │   ├── layout/                 # Navbar.tsx, Footer.tsx, LiveCounterTicker.tsx, MyBookingsDrawer.tsx
│       │   │   ├── pass/                   # BusPassSection.tsx
│       │   │   ├── seatmap/                # SeatPicker.tsx (Dual deck, Concurrency lock)
│       │   │   ├── stepper/                # BookingStepper.tsx
│       │   │   ├── ticket/                 # ETicketView.tsx
│       │   │   └── tracking/               # LiveBusTracker.tsx
│       │   ├── hooks/                      # Reactive custom hooks
│       │   │   ├── useLanguage.ts          # Trilingual dictionary & hook (en/gu/hi)
│       │   │   └── useSeatLocks.ts         # BroadcastChannel seat lock countdown hook
│       │   ├── services/                   # Storage engine & transit domain services
│       │   │   ├── bookingService.ts       # Booking persistence & PNR generator
│       │   │   ├── busService.ts           # Station search & schedule query filters
│       │   │   ├── passService.ts          # Bus pass application persistence
│       │   │   ├── seatLockService.ts      # Multi-tab atomic seat concurrency locking
│       │   │   ├── seedData.ts             # 30+ Gujarat stations, bus fleets & schedules
│       │   │   ├── storageEngine.ts        # LocalStorage engine with reactivity
│       │   │   └── trackingService.ts      # GPS tracking simulation
│       │   ├── speech/                     # Web Speech API engine
│       │   │   └── speechEngine.ts         # Voice readouts for Divyang accessibility
│       │   ├── App.css                     # Custom component styles
│       │   ├── App.tsx                     # One-Page layout container & active view state machine
│       │   ├── index.css                   # Tailwind CSS v4 setup & transit design tokens
│       │   └── main.tsx                    # React 19 entry point
│       ├── public/                         # Favicon and static SVGs
│       ├── index.html                      # Single Page Application entry HTML
│       ├── package.json                    # @gsrtc/web dependencies
│       ├── tsconfig.json                   # TypeScript configuration
│       └── vite.config.ts                  # Vite 6 + React + Tailwind v4 plugin config
├── packages/
│   └── types/                              # Shared transit types (@gsrtc/types)
│       ├── src/
│       │   └── index.ts                    # Station, BusSchedule, Seat, Booking, etc.
│       ├── package.json                    # @gsrtc/types manifest
│       └── tsconfig.json                   # Shared TypeScript config
├── docs/                                   # Project documentation & wireframes
│   ├── GSRTC-REDESIGN-PLAN.md              # Project plan & sprint roadmap
│   ├── GSRTC-WIREFRAMES.md                 # UI mockups & component architecture mapping
│   ├── enhancements.md                     # Modernization audit & tech stack
│   └── implementation_plan.md              # Architecture plan & concurrency specs
├── package.json                            # Root workspace scripts (pnpm dev, pnpm build)
├── pnpm-workspace.yaml                     # pnpm monorepo workspace definition
└── pnpm-lock.yaml                          # Lockfile
```

---

## 6. Key Design Decisions

### Homepage — Simplified Booking

**Current (6 tabs):** Advance | AWT | MP/MLA | Divyang | SOU | Electric

**New (1 smart form):**

```
┌─────────────────────────────────────────────────────┐
│  Where are you going?                               │
│  ┌──────────────┐  ┌──────────────┐  ┌───────────┐  │
│  │ From         │  │ To           │  │ Date      │  │
│  └──────────────┘  └──────────────┘  └───────────┘  │
│  ┌──────────────┐  ┌─────────────────────────────┐  │
│  │ Passengers   │  │ Bus Type: [All ▼]           │  │
│  └──────────────┘  └─────────────────────────────┘  │
│  [  🔍 Search Buses  ]                              │
│                                                     │
│  Quick links: Divyang | MP/MLA | SOU | Electric     │
└─────────────────────────────────────────────────────┘
```

- Single form, dropdown to select bus category
- Smart defaults based on user profile
- Quick access buttons for special categories

### Booking Flow — Step Wizard

```
Step 1: Search → Step 2: Select Bus → Step 3: Select Seats → 
Step 4: Passenger Details → Step 5: Payment → Step 6: Confirmation
```

- Progress bar at top
- Can go back to any step
- Auto-save state
- Timer for seat reservation (15 min)

### Mobile-First Approach

- Bottom navigation bar on mobile
- Swipeable bus cards
- Touch-friendly seat selection
- Pull-to-refresh on search results

---

## 7. User Flows

### Primary Flows (Booking)

| # | Flow | Entry Point |
|---|------|-------------|
| 1 | Advance Booking | Homepage → Search → Results → Seats → Details → Payment → Confirmation |
| 2 | AWT (Award Winning Teachers) Booking | Homepage → Bus Type Dropdown → Same as #1 |
| 3 | MP/MLA Booking | Homepage → Bus Type Dropdown → Same as #1 (max 2 seats) |
| 4 | Divyang (Disability) Booking | Homepage → Bus Type Dropdown → Same as #1 (max 2 seats, voice feedback) |
| 5 | Statue of Unity Booking | Homepage → Bus Type Dropdown → Same as #1 (fixed destination) |
| 6 | Electric Bus Booking | Homepage → Bus Type Dropdown → Same as #1 |

### Secondary Flows (Post-Booking)

| # | Flow | Entry Point |
|---|------|-------------|
| 7 | Reschedule Journey | Dashboard → Booking History → Select Ticket → Reschedule |
| 8 | Cancel Ticket | Dashboard → Booking History → Select Ticket → Cancel |
| 9 | Print/SMS Ticket | Dashboard → Booking History → Select Ticket → Print/SMS |
| 10 | View Booking History | Dashboard → Booking History |
| 11 | Waiting List Status | Dashboard → Booking History → Waiting List |
| 12 | Refund Complaint | Dashboard → Support → Refund Complaint |
| 13 | Refund/Transaction Enquiry | Dashboard → Support → Transaction Status |

### Tertiary Flows (Account/Pass)

| # | Flow | Entry Point |
|---|------|-------------|
| 14 | Wallet Passbook/Account | Dashboard → Wallet |
| 15 | Bus Pass (New/Renewal) | Navbar → Bus Pass |
| 16 | Agent Login & Management | Navbar → Agent Login |
| 17 | Sharvan Tirth Darshan Booking | Navbar → External Link |

### Informational Pages

About Us, Leadership, Special Services, Achievements, Tenders, FAQs, Sitemap, Booking Policies, RTI, RTC Act, Divisions, Corporate Office, Performance, Bus Enquiry, Recruitment, Contact Us, Awards, Agent Lists, Grievance, Annual Audit Report, Press Releases, Privacy Policy, Downloads, Citizen's Rights, Service Regulations

---

## 8. Git Workflow

### Branch Strategy

```
main (production)
├── develop (integration branch)
│   ├── feature/homepage
│   ├── feature/booking-flow
│   ├── feature/auth
│   ├── feature/dashboard
│   └── feature/info-pages
```

### Commit Convention

```
feat: add booking search form component
fix: resolve seat selection rendering issue
chore: update dependencies
docs: add API integration guide
style: fix button spacing in booking widget
refactor: extract autocomplete into custom hook
test: add unit tests for validation schemas
```

### PR Process

1. Create feature branch from `develop`
2. Make changes, commit with convention
3. Push and create PR to `develop`
4. Tech lead reviews code
5. Address feedback, get approval
6. Merge to `develop`
7. Periodically merge `develop` → `main` for deployment

---

## 9. Daily Workflow

### Standup (09:00 - 09:15)

- What did you do yesterday?
- What will you do today?
- Any blockers?

### Development Blocks

- **09:15 - 12:30** — Morning development (2-3 hour focused block)
- **12:30 - 13:30** — Lunch
- **13:30 - 17:00** — Afternoon development
- PR reviews happen async throughout the day

### End of Day (17:00, optional)

- Quick progress update in Slack/Discord
- Flag any blockers for the upcoming standup

---

## 10. Timeline

```
Week 1-2:  ████░░░░░░░░  Design System + Setup
Week 2-3:  ░░████░░░░░░  Homepage + Booking Widget
Week 3-5:  ░░░░████░░░░  Booking Flow
Week 4-6:  ░░░░░░████░░  Account + Post-Booking
Week 5-7:  ░░░░░░░░████  Info Pages + Polish
Week 7:    ░░░░░░░░░░██  QA + Launch Prep
```

**Total Duration:** 7 weeks

---

## 11. Checklist

### Before Starting

- [ ] Finalize team roles and responsibilities
- [ ] Set up repository and CI/CD pipeline
- [ ] Create Figma project and share with team
- [ ] Get access to existing GSRTC backend APIs
- [ ] Set up staging environment
- [ ] Agree on coding standards and review process
- [ ] Set up communication channel (Slack/Discord)

### Phase 1 Complete When

- [ ] Design tokens defined (colors, typography, spacing)
- [ ] All base UI components built and documented
- [ ] i18n working with 3 languages
- [ ] Figma wireframes for all key pages
- [ ] Dev environment ready for all team members

### Phase 2 Complete When

- [ ] Homepage fully responsive (mobile + desktop)
- [ ] Booking widget working with autocomplete
- [ ] Stats counter component live
- [ ] Destination carousel working
- [ ] Navbar and footer responsive

### Phase 3 Complete When

- [ ] Search results page with filters
- [ ] Seat selection working (visual seat map)
- [ ] Passenger form with validation
- [ ] Payment flow complete (even if mocked)
- [ ] Booking confirmation with ticket view
- [ ] Progress stepper working

### Phase 4 Complete When

- [ ] Auth flow (login/register) working
- [ ] Dashboard with booking history
- [ ] Cancel and reschedule flows working
- [ ] Wallet functionality
- [ ] Bus pass pages

### Phase 5 Complete When

- [ ] All info pages migrated
- [ ] Accessibility audit passed (WCAG 2.1 AA)
- [ ] Lighthouse score 90+ (performance, accessibility, SEO, best practices)
- [ ] All console errors resolved
- [ ] Cross-browser testing done
- [ ] Mobile testing done (iOS + Android)
- [ ] QA sign-off

---

## Appendix: Current Site Issues to Fix

| Category | Issue | Priority |
|----------|-------|----------|
| HTML | Duplicate meta tags (XSS Protection, Content-Type) | Low |
| HTML | Duplicate trim() function defined 3 times | Medium |
| HTML | SkipContent div inside carousel button | Medium |
| HTML | Label/for mismatches on checkboxes | High |
| JS | `counterUp is not a function` console error | High |
| JS | `uw-widget-custom-trigger2` doesn't exist | High |
| JS | setInterval re-adds event listeners every 500ms | High |
| JS | jQuery UI loaded twice (local + CDN) | Medium |
| UX | Popup auto-closes after 30s, intrusive | Medium |
| UX | Multi-tab restriction redirects to Google | High |
| UX | Preloader shows Kerala_Logo.png | High |
| Tel | Toll-free number has extra digits: 1800 233 666666 | Medium |
| SEO | No Open Graph or Twitter meta tags | Medium |
| Analytics | Google Analytics UA deprecated, not migrated to GA4 | High |
