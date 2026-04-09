---
phase: 02-core-pages
plan: 01
subsystem: homepage-hero
tags: [hero, section, css, typography, cta]
dependency_graph:
  requires: []
  provides: [sections/haze-hero.liquid, assets/haze-hero.css]
  affects: [templates/index.json (Plan 03 will reference this section)]
tech_stack:
  added: []
  patterns: [Shopify section schema, CSS custom properties, fetchpriority=high LCP optimization]
key_files:
  created:
    - sections/haze-hero.liquid
    - assets/haze-hero.css
  modified: []
decisions:
  - "Used height: 100vh with 100dvh fallback for full-viewport hero (modern browsers get dvh, older get vh)"
  - "PLACEHOLDER comment tag applied per D-03 convention for grep-findability when real photography arrives"
  - "rgba(44, 36, 32, 0.25) scrim hardcoded — CSS custom properties cannot carry alpha channel natively"
metrics:
  duration: "< 1 min"
  completed: "2026-04-09"
  tasks_completed: 1
  files_created: 2
  files_modified: 0
---

# Phase 2 Plan 1: Full-Viewport Hero Section Summary

**One-liner:** Full-viewport hero with Cormorant Garamond italic headline, dark scrim overlay, and terracotta CTA linking to the Hair Ritual Kit product page.

## What Was Built

`sections/haze-hero.liquid` — a self-contained Shopify section with:
- Full-viewport height (`100dvh` / `100vh` fallback) background image layout
- Dark scrim overlay (`rgba(44, 36, 32, 0.25)`) for text legibility over hero photography
- Liquid schema with 4 editable settings: `headline`, `subtext`, `cta_label`, `cta_link`
- Default content: "Stay tender." / "A complete hair ritual, beautifully made." / "Shop the Kit" → `/products/hair-ritual-kit`
- `PLACEHOLDER` comment for grep-based asset tracking
- `loading="eager"` + `fetchpriority="high"` on hero image for LCP optimization

`assets/haze-hero.css` — hero styling with:
- Flexbox centering of content layer over full-viewport media layer
- Display typography: Cormorant Garamond, weight 300, italic, 36px mobile / 56px at 750px breakpoint
- Body typography: DM Sans, 1rem, weight 400, 0.8 opacity for subtext
- CTA label: DM Sans, 0.8125rem, uppercase, letter-spacing 0.12em, min-height 44px touch target
- Terracotta fill CTA with cream text, 2px radius, opacity transition on hover/focus

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Create hero section (Liquid + CSS) | ae9a4382 | sections/haze-hero.liquid, assets/haze-hero.css |

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

- `haze-placeholder-hero.jpg` — hero background image is a placeholder. The section references this file but it does not yet exist in assets. The browser will show the cream background color while loading. Resolve when real product photography arrives (grep `PLACEHOLDER` to find all instances).

## Threat Flags

None — no new security surface introduced. Schema settings use `type: text` and `type: url`, both sanitized server-side by Shopify's Customize panel (T-02-01 accepted per threat register).

## Self-Check: PASSED

- `sections/haze-hero.liquid` exists: FOUND
- `assets/haze-hero.css` exists: FOUND
- Commit `ae9a4382` exists: FOUND
- All 14 acceptance criteria: PASS
