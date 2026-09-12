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
| **Framework** | Next.js 14+ (App Router) | SSR for SEO, React ecosystem, government-grade |
| **Styling** | Tailwind CSS | Utility-first, fast prototyping, consistent design |
| **UI Components** | shadcn/ui | Accessible, customizable, no vendor lock-in |
| **State Management** | Zustand (lightweight) | Simple global state for booking flow |
| **Forms** | React Hook Form + Zod | Type-safe validation, performance |
| **i18n** | next-intl | Gujarati/Hindi/English support |
| **Icons** | Lucide React | Consistent, tree-shakeable |
| **Animations** | Framer Motion | Smooth transitions, accessible |
| **Analytics** | GA4 via gtag | Replace deprecated UA |
| **Deployment** | Vercel (or self-hosted) | Government cloud if required |

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
| Color palette, typography, spacing tokens | Design Lead | `tailwind.config.ts` |
| Component library (Button, Input, Select, Card, Modal, etc.) | Design Lead + Dev A | `components/ui/` |
| Project setup (Next.js, folder structure, linting, CI) | Tech Lead | Repo + dev environment |
| Figma wireframes for all key pages | Design Lead | Figma file |
| i18n setup (en/gu/hi) | Dev C | `messages/` folder + config |

### Phase 2: Homepage + Booking Widget (Week 2-3)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Homepage layout (hero, stats, destinations) | Dev A | `/page.tsx` |
| Booking widget (single smart form, not 6 tabs) | Dev A | `components/booking/` |
| Autocomplete for source/destination | Dev A | API integration |
| Date picker component | Dev A | `components/ui/date-picker.tsx` |
| Mobile-responsive navbar + footer | Dev A | `components/layout/` |

### Phase 3: Booking Flow (Week 3-5)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Search results page (bus list, filters) | Dev B | `/search/page.tsx` |
| Seat selection component | Dev B | `components/seat-selection/` |
| Passenger details form | Dev B | `/booking/passenger-details` |
| Payment integration page | Dev B | `/booking/payment` |
| Booking confirmation + ticket | Dev B | `/booking/confirmation` |
| Progress stepper component | Dev B | `components/ui/stepper.tsx` |

### Phase 4: Account + Post-Booking (Week 4-6)

| Task | Owner | Deliverable |
|------|-------|-------------|
| Login/Register pages | Dev C | `/auth/` |
| Dashboard (booking history, wallet) | Dev C | `/dashboard/` |
| Ticket cancellation flow | Dev C | `/booking/cancel` |
| Reschedule flow | Dev C | `/booking/reschedule` |
| Bus pass pages | Dev C | `/bus-pass/` |

### Phase 5: Info Pages + Polish (Week 5-7)

| Task | Owner | Deliverable |
|------|-------|-------------|
| About, Leadership, Contact pages | Dev D | `/about/`, `/contact/` |
| FAQ, Policies, RTI pages | Dev D | `/info/` |
| Tenders, Recruitment pages | Dev D | `/info/` |
| Accessibility audit + fixes | Tech Lead | WCAG 2.1 AA compliance |
| Performance optimization | Tech Lead | Lighthouse 90+ score |
| QA + bug fixes | All | Test reports |

---

## 5. Folder Structure

```
gsrtc-redesign/
├── app/
│   ├── [locale]/                    # i18n routing
│   │   ├── page.tsx                 # Homepage
│   │   ├── layout.tsx               # Root layout
│   │   ├── search/
│   │   │   └── page.tsx             # Search results
│   │   ├── booking/
│   │   │   ├── seats/page.tsx       # Seat selection
│   │   │   ├── details/page.tsx     # Passenger details
│   │   │   ├── payment/page.tsx     # Payment
│   │   │   └── confirmation/page.tsx
│   │   ├── dashboard/
│   │   │   ├── page.tsx             # User dashboard
│   │   │   ├── history/page.tsx     # Booking history
│   │   │   └── wallet/page.tsx      # Wallet
│   │   ├── auth/
│   │   │   ├── login/page.tsx
│   │   │   └── register/page.tsx
│   │   ├── about/page.tsx
│   │   ├── contact/page.tsx
│   │   └── info/
│   │       ├── faq/page.tsx
│   │       ├── policies/page.tsx
│   │       └── ...
│   └── api/                         # API routes (if needed)
├── components/
│   ├── ui/                          # Base UI components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── select.tsx
│   │   ├── card.tsx
│   │   ├── modal.tsx
│   │   ├── stepper.tsx
│   │   └── ...
│   ├── booking/                     # Booking-specific
│   │   ├── search-form.tsx
│   │   ├── bus-card.tsx
│   │   ├── seat-map.tsx
│   │   └── passenger-form.tsx
│   ├── layout/                      # Layout components
│   │   ├── header.tsx
│   │   ├── footer.tsx
│   │   ├── mobile-nav.tsx
│   │   └── sidebar.tsx
│   └── shared/                      # Shared widgets
│       ├── stats-counter.tsx
│       ├── destination-carousel.tsx
│       └── accessibility-panel.tsx
├── lib/
│   ├── api.ts                       # API client
│   ├── utils.ts                     # Helpers
│   └── validations.ts               # Zod schemas
├── hooks/                           # Custom React hooks
├── stores/                          # Zustand stores
│   ├── booking-store.ts
│   └── auth-store.ts
├── messages/                        # i18n translations
│   ├── en.json
│   ├── gu.json
│   └── hi.json
├── public/                          # Static assets
├── tailwind.config.ts
├── next.config.ts
└── package.json
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
- Flag any blockers for next standup

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
