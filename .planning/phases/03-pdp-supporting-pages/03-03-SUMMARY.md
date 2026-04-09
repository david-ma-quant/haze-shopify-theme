---
phase: 03-pdp-supporting-pages
plan: "03"
subsystem: templates, assets
tags: [liquid, css, javascript, pdp, gallery, atc, faq, scroll-snap, intersection-observer]
dependency_graph:
  requires:
    - sections/haze-ritual-description.liquid (Plan 03-01)
    - sections/haze-ingredients.liquid (Plan 03-01)
  provides:
    - templates/product.haze.json
    - assets/haze-pdp.css
    - assets/haze-pdp-gallery.js
  affects:
    - layout/theme.liquid (conditional haze-pdp.css load added)
tech_stack:
  added: []
  patterns:
    - Shopify template JSON wiring Dawn section with custom Haze sections
    - CSS overrides on Dawn's main-product without modifying Dawn source
    - IntersectionObserver-based dot indicator (IIFE, no global namespace)
    - Conditional stylesheet loading in theme.liquid via template.suffix
key_files:
  created:
    - templates/product.haze.json
    - assets/haze-pdp.css
    - assets/haze-pdp-gallery.js
  modified:
    - layout/theme.liquid
decisions:
  - "haze-pdp.css loads via theme.liquid conditional (request.page_type == 'product' and template.suffix == 'haze') — consistent with Plan 02's haze-pages.css pattern using template.suffix"
  - "haze-pdp-gallery.js already loaded by haze-ritual-description.liquid (Plan 01 decision) — no duplicate script tag needed in theme.liquid"
  - "IntersectionObserver threshold 0.6 (not 0.5) prevents active-dot flicker during fast swipe — per RESEARCH Pitfall 2"
  - "Dot count is dynamic from slide querySelectorAll — not hardcoded to 4 — works correctly if gallery image count changes"
metrics:
  duration: "~8 minutes"
  completed: "2026-04-09T02:59:56Z"
  tasks_completed: 2
  files_created: 3
  files_modified: 1
---

# Phase 03 Plan 03: PDP Template, CSS Overrides, and Gallery Dot Indicator Summary

**One-liner:** Custom PDP template wiring Dawn's main-product (gallery, title, price, ATC, 5 FAQ collapsible tabs) with Haze ritual and ingredients sections, backed by scroll-snap CSS overrides and an IntersectionObserver dot indicator.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create PDP template and CSS overrides | `4e2c9186` | `templates/product.haze.json`, `assets/haze-pdp.css`, `layout/theme.liquid` |
| 2 | Create gallery dot indicator JS | `de5d625e` | `assets/haze-pdp-gallery.js` |
| 3 | Human verify PDP, About, FAQ pages | (checkpoint — see below) | n/a |

---

## What Was Built

### templates/product.haze.json

Custom Shopify product template referencing:
- `main-product` (Dawn section) — gallery, product title, price, kit-contents text block, description richtext, buy_buttons (show_dynamic_checkout: false), and 5 collapsible_tab FAQ blocks
- `haze-ritual-description` (Plan 01 custom section) — editorial ritual copy below ATC
- `haze-ingredients` (Plan 01 custom section) — 4 ingredient icon blocks in responsive grid

Block order in main-product: title → price → kit-contents → description → buy_buttons → faq-1 through faq-5. `variant_picker` and `quantity_selector` are intentionally omitted (single-variant product, D-08).

Settings: `gallery_layout: "stacked"`, `mobile_thumbnails: "hide"`, `media_size: "large"`, `image_zoom: "none"`, `hide_variants: true`, `enable_sticky_info: true`, `color_scheme: "scheme-1"`.

FAQ content: 5 items with full placeholder copy covering kit contents, usage guide, shipping/returns, materials sourcing, and gift readiness — all editable via Shopify Customize panel.

### assets/haze-pdp.css

PDP brand overrides, loaded conditionally on product.haze pages via theme.liquid:

- **Gallery scroll-snap (mobile):** Force 100% slide width on `.product__media-item`, remove `scroll-padding-left` and `gap` on `.product__media-list`, hide Dawn's `.slider-buttons` and `.slider-counter`
- **Dot indicator:** 8px visual circle, `rgba(44, 36, 32, 0.3)` inactive, `--haze-color-terracotta` active, 44px tap target via `::before` pseudo-element (WCAG 2.5.5), 200ms background-color transition, hidden on desktop ≥750px via display:none
- **Product title:** Cormorant Garamond, 24px (1.5rem), weight 400, line-height 1.2
- **Price:** DM Sans, 16px (1rem), weight 400
- **ATC button:** terracotta fill, cream text, 2px radius, 44px min-height, 13px (0.8125rem) DM Sans uppercase 0.12em letter-spacing, opacity 0.85 on hover/focus-visible
- **FAQ accordion:** Heading role questions (Cormorant Garamond 24px), Body role answers (DM Sans 16px, 85% opacity), subtle border at 15% opacity, `var(--haze-space-sm)` padding

No hardcoded hex values in CSS except `rgba(44, 36, 32, ...)` for opacity variants (CSS custom properties cannot be used with alpha channels in rgba).

### assets/haze-pdp-gallery.js

IIFE-scoped IntersectionObserver gallery dot indicator:
- Queries `media-gallery`, `.product__media-list`, `.product__media-item` — exits early if any are absent or slide count ≤ 1
- Injects `<div role="tablist" aria-label="Product images">` after the `<media-gallery>` element
- Each dot is a `<button role="tab" aria-label="Image N of M" aria-selected="...">` with dynamic `is-active` class
- Observer `root` is the `.product__media-list` scroll container (not window) — threshold 0.6
- Click handler: `slides[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'start' })`
- No ES6+ except `Array.from()` (supported by all evergreen browsers) — uses `var`, function expressions

### layout/theme.liquid (modified)

Added conditional block alongside existing Plan 02 pattern:

```liquid
{%- if request.page_type == 'product' and template.suffix == 'haze' -%}
  {{ 'haze-pdp.css' | asset_url | stylesheet_tag }}
{%- endif -%}
```

Note: `haze-pdp-gallery.js` is NOT loaded from theme.liquid — it is already loaded by `sections/haze-ritual-description.liquid` via a deferred script tag (Plan 01 decision — first guaranteed section below main-product on the PDP).

---

## Checkpoint: Task 3 (Human Verify)

Task 3 is a `checkpoint:human-verify` — not auto-executed. Before testing, the following manual admin steps are required:

1. **Assign product template:** Shopify Admin > Products > Hair Ritual Kit > Theme template: `product.haze`
2. **Create About page:** Admin > Online Store > Pages — handle `about`, template `page.about`
3. **Create FAQ page:** Admin > Online Store > Pages — handle `faq`, template `page.faq`
4. **Add policy pages:** Admin > Settings > Policies (Privacy, Terms, Refund)

**Test with:** `shopify theme dev --store haze-903935.myshopify.com`

**PDP verification URL:** `/products/hair-ritual-kit`

Checkpoints to verify:
- Mobile 375px: full-width gallery swipe with 4 dots syncing to scroll
- Dot click scrolls to matching slide (smooth)
- ATC button terracotta, cream text — click opens cart drawer
- 5 FAQ items below ATC, multiple expandable simultaneously
- "The Ritual" editorial section and ingredient icon grid below main product info

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

The `product.haze.json` template references `haze-placeholder-pdp-{1..4}.jpg` images via Shopify Admin media upload — these must be uploaded manually in Admin > Products > Hair Ritual Kit > Media. The template JSON itself contains no placeholder text that blocks functionality; all FAQ copy is real placeholder content editable via Customize panel. The gallery dot count is dynamic, so it will correctly show 0 dots until images are uploaded (script exits early if slide count ≤ 1).

---

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary surface introduced. The dot indicator JS creates only button elements with hardcoded class names and aria attributes — no user input rendered as HTML, no innerHTML usage (T-03-06 mitigated as planned).

---

## Self-Check: PASSED

Files verified to exist:
- FOUND: templates/product.haze.json
- FOUND: assets/haze-pdp.css
- FOUND: assets/haze-pdp-gallery.js

Commits verified:
- FOUND: 4e2c9186 — feat(03-03): add PDP template, CSS overrides, and theme.liquid conditional load
- FOUND: de5d625e — feat(03-03): add gallery dot indicator JS with IntersectionObserver
