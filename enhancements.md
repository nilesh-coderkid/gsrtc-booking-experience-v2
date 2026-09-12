## 1. Current Site Analysis

### Site Age & Tech Stack

| Indicator            | Finding                                                               |
| -------------------- | --------------------------------------------------------------------- |
| Organization Founded | 1 May 1960 (66 years)                                                 |
| Website Built        | ~2018-2020 (Bootstrap 4-era patterns)                                 |
| Last Updated         | August 17, 2026 (per footer)                                          |
| Analytics            | Google Analytics UA (deprecated since July 2023, not migrated to GA4) |
| Frontend             | Bootstrap 5 + jQuery 3.6.4 + jQuery UI 1.13.2 + OWL Carousel          |
| Architecture         | Server-rendered, no SPA, inline JS (~800+ lines on homepage)          |

### Current Problems

#### Design Issues

Outdated visual language (Bootstrap template look)
No mobile-first booking experience
Tab overload (6 booking tabs on homepage)
Popup-heavy UX (30s popup + multi-tab alert)
Stats numbers are hardcoded, not live

#### Technical Issues

jQuery dependency (no modularity)
Inline JS (~800+ lines in homepage)
Duplicate code (trim() defined 3x, jQuery UI loaded twice from local + CDN)
No component-based architecture
Broken accessibility panel trigger (uw-widget-custom-trigger2 doesn't exist)
Console errors: counterUp is not a function

#### UX Issues

Booking form complex (autofill + hidden fields + validation spread across JS)
No progress indicator during booking
No seat selection preview
No fare comparison
No filter by bus type/amenities
Multi-tab restriction blocks legitimate use
Label/for mismatches on checkboxes
Preloader references Kerala_Logo.png (wrong state)

---

## 2. Recommended Tech Stack

| Layer                | Technology               | Why                                                |
| -------------------- | ------------------------ | -------------------------------------------------- |
| **Framework**        | Next.js 14+ (App Router) | SSR for SEO, React ecosystem, government-grade     |
| **Styling**          | Tailwind CSS             | Utility-first, fast prototyping, consistent design |
| **UI Components**    | shadcn/ui                | Accessible, customizable, no vendor lock-in        |
| **State Management** | Zustand (lightweight)    | Simple global state for booking flow               |
| **Forms**            | React Hook Form + Zod    | Type-safe validation, performance                  |
| **i18n**             | next-intl                | Gujarati/Hindi/English support                     |
| **Icons**            | Lucide React             | Consistent, tree-shakeable                         |
| **Animations**       | Framer Motion            | Smooth transitions, accessible                     |
| **Analytics**        | GA4 via gtag             | Replace deprecated UA                              |
| **Deployment**       | Vercel (or self-hosted)  | Government cloud if required                       |

---

## 3. Team Structure

### Roles (5-7 people)

┌─────────────────────────────────────────────┐
│ Project Lead / PM │
│ (Architecture + Coordination) │
└─────────────┬───────────────────┬───────────┘
│ │
┌─────────▼─────────┐ ┌──────▼──────────┐
│ Design Lead (1) │ │ Tech Lead (1) │
│ UI/UX + Design │ │ Architecture │
│ System │ │ + Code Review │
└─────────┬─────────┘ └──────┬──────────┘
│ │
┌─────────▼───────────────────▼──────────┐
│ Development Team (3-4) │
│ │
│ Dev A: Homepage + Booking Widget │
│ Dev B: Booking Flow (Search→Payment) │
│ Dev C: Account + Post-Booking Pages │
│ Dev D: Info Pages + CMS (if needed) │
└─────────────────────────────────────────┘
