---
phase: 02-core-pages
plan: "02"
subsystem: homepage-product-grid
tags: [product-grid, video-cards, css-grid, intersection-observer, progressive-enhancement]
dependency_graph:
  requires: []
  provides: [sections/haze-product-grid.liquid, snippets/haze-card-video.liquid, assets/haze-product-grid.css, assets/haze-video-card.js]
  affects: [templates/index.json]
tech_stack:
  added: []
  patterns: [CSS Grid responsive breakpoints, IntersectionObserver video playback, IIFE JS module, Liquid render scope isolation, prefers-reduced-motion progressive enhancement]
key_files:
  created:
    - sections/haze-product-grid.liquid
    - snippets/haze-card-video.liquid
    - assets/haze-product-grid.css
    - assets/haze-video-card.js
  modified: []
decisions:
  - "video.play().catch() used on all play calls to prevent DOMException on autoplay-blocked browsers"
  - "Touch detection via window.matchMedia('(hover: none)') instead of UA string sniffing"
  - "var declarations used throughout JS for Shopify's non-transpiled environment compatibility"
  - "Video element omitted from DOM entirely when video_url is blank (Liquid unless guard)"
metrics:
  duration: "8 minutes"
  completed: "2026-04-09"
  tasks_completed: 2
  files_created: 4
  files_modified: 0
---

# Phase 02 Plan 02: Product Grid with Hover Video Framework Summary

5-card responsive product grid section with conditional video-on-hover (desktop) and viewport-autoplay (touch), prefers-reduced-motion bail-out, and schema-configurable cards for kit components.

## Tasks Completed

| Task | Name | Commit | Files |
|------|------|--------|-------|
| 1 | Product grid section, card snippet, grid CSS | 758d8db5 | sections/haze-product-grid.liquid, snippets/haze-card-video.liquid, assets/haze-product-grid.css |
| 2 | Video interaction JavaScript | d9dc547c | assets/haze-video-card.js |

## What Was Built

### `snippets/haze-card-video.liquid`
Reusable card snippet accepting `block`, `card_name`, `card_description`, `placeholder_image`, and `video_url` parameters. Uses `{%- unless video_url == blank -%}` guard so no `<video>` element is rendered when video_url is empty (VIDEO-01). Card name and description use `| escape` filter per T-02-02 threat mitigation. Image has `width="800" height="1067"` for 3:4 CLS prevention. Video element has `muted playsinline loop preload="none" aria-hidden="true" tabindex="-1"`.

### `sections/haze-product-grid.liquid`
Iterates `section.blocks` of type `card`, rendering each via `{%- render 'haze-card-video' -%}` with explicit parameter passing (Liquid render scope isolation). Script tag guarded by `request.page_type == 'index'` (VIDEO-05). Schema defines `"card"` block type with name, description, placeholder_image, video_url settings. Preset pre-populates 5 cards: Silk Comb, Boar-Bristle Brush, OEKO-TEX Towel, Silk Scrunchie, Gift Box.

### `assets/haze-product-grid.css`
CSS Grid: 1 column mobile, 2 columns at 750px, 3 columns at 990px. Card media area uses `aspect-ratio: 3 / 4`. Video overlay positioned absolutely over image with `opacity: 0` default and `transition: opacity 0.3s ease`. `.haze-card--video-playing` class triggers `opacity: 1`. `prefers-reduced-motion: reduce` media query sets `display: none` on video (VIDEO-04). All colors via `var(--haze-color-*)` tokens — no hardcoded hex.

### `assets/haze-video-card.js`
IIFE with `'use strict'`. First check: `window.matchMedia('(prefers-reduced-motion: reduce)').matches` — returns immediately if true (VIDEO-04). Touch detection via `window.matchMedia('(hover: none)')`. Touch path: single IntersectionObserver at `threshold: 0.5` plays/pauses at 50% viewport intersection (VIDEO-03). Desktop path: `mouseenter`/`mouseleave` event listeners plus a separate IntersectionObserver at `threshold: 0` for off-screen pause (VIDEO-02). All `video.play()` calls wrapped in `.catch(function () {})`. Selects via `querySelectorAll('[data-card-video]')`. Uses `var` declarations throughout.

## Deviations from Plan

None — plan executed exactly as written.

## Known Stubs

| File | Line | Stub | Reason |
|------|------|------|--------|
| snippets/haze-card-video.liquid | 17 | `PLACEHOLDER` comment on all 5 placeholder images | Real photography not yet available; placeholder filenames defined in schema presets. Resolved when real product images arrive. |

Stub note: The placeholder images (haze-placeholder-silk-comb.jpg, haze-placeholder-brush.jpg, etc.) do not exist as actual assets yet. Cards will show broken images until either placeholder images are uploaded to Shopify CDN or real photography is provided. This is intentional per the project's AI-generated placeholder image strategy.

## Threat Flags

None — no new security surface introduced. Existing threat mitigations applied:
- T-02-02: `| escape` filter on card_name and card_description
- T-02-03: video_url from admin-only schema settings (accepted risk per plan)

## Self-Check: PASSED

- sections/haze-product-grid.liquid: FOUND
- snippets/haze-card-video.liquid: FOUND
- assets/haze-product-grid.css: FOUND
- assets/haze-video-card.js: FOUND
- Commit 758d8db5: FOUND
- Commit d9dc547c: FOUND
