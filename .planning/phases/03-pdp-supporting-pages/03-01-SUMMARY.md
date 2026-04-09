---
phase: 03-pdp-supporting-pages
plan: "01"
subsystem: sections
tags: [liquid, css, svg, pdp, ingredients, ritual-description]
dependency_graph:
  requires: []
  provides:
    - sections/haze-ritual-description.liquid
    - assets/haze-ritual-description.css
    - sections/haze-ingredients.liquid
    - assets/haze-ingredients.css
    - assets/haze-icon-silk.svg
    - assets/haze-icon-bristle.svg
    - assets/haze-icon-oeko.svg
    - assets/haze-icon-mulberry.svg
  affects:
    - templates/product.haze.json (Plan 03 will reference both sections)
tech_stack:
  added: []
  patterns:
    - Shopify section with schema and block-based settings
    - CSS token-only custom properties (no hardcoded hex)
    - 40x40 SVG stroke-art icons matching Phase 2 value prop icon pattern
    - Deferred script loading for gallery JS from ritual description section
key_files:
  created:
    - sections/haze-ritual-description.liquid
    - assets/haze-ritual-description.css
    - sections/haze-ingredients.liquid
    - assets/haze-ingredients.css
    - assets/haze-icon-silk.svg
    - assets/haze-icon-bristle.svg
    - assets/haze-icon-oeko.svg
    - assets/haze-icon-mulberry.svg
  modified: []
decisions:
  - "Ritual description section loads haze-pdp-gallery.js via deferred script tag — first guaranteed section below main-product on PDP"
  - "Ingredients grid uses 2-col on mobile (not 1-col) for better visual rhythm across 4 icon blocks"
  - "Icon SVGs use hardcoded stroke color (#C4714A) not currentColor — SVG files are static assets served from CDN, not inline Liquid; currentColor would have no effect"
metrics:
  duration: "~10 minutes"
  completed: "2026-04-09T02:54:53Z"
  tasks_completed: 2
  files_created: 8
  files_modified: 0
---

# Phase 03 Plan 01: Ritual Description + Ingredients Sections Summary

**One-liner:** Two custom PDP sections — editorial ritual description with Cormorant italic pull-quote, and a 4-block responsive ingredient grid with terracotta-stroke SVG icons — ready for product.haze.json assembly.

---

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create ritual description section (Liquid + CSS) | `2fdd7224` | `sections/haze-ritual-description.liquid`, `assets/haze-ritual-description.css` |
| 2 | Create ingredients section with SVG icons (Liquid + CSS + 4 SVGs) | `2ee904ac` | `sections/haze-ingredients.liquid`, `assets/haze-ingredients.css`, `assets/haze-icon-silk.svg`, `assets/haze-icon-bristle.svg`, `assets/haze-icon-oeko.svg`, `assets/haze-icon-mulberry.svg` |

---

## What Was Built

### sections/haze-ritual-description.liquid
Full-width editorial section for the PDP. Renders a centered 680px column with:
- Optional "The Ritual" overline (Label role: 13px DM Sans, uppercase, terracotta, 0.12em letter-spacing)
- "A morning ritual worth doing." heading (Heading role: 24px Cormorant Garamond, weight 400)
- "Your best hair days start before the mirror." pull-quote (Heading role: 24px Cormorant Garamond, italic — differentiated by style not size)
- Editorial body copy richtext (Body role: 16px DM Sans, 85% opacity)
- Loads `haze-pdp-gallery.js` via deferred script tag (guaranteed PDP load point)
- Schema: `show_overline` checkbox, `overline` text, `heading` text, `quote` text, `body` richtext

### assets/haze-ritual-description.css
- Section: `padding: var(--haze-space-xl) 0`, `background-color: var(--haze-color-cream)`, `text-align: center`
- Inner: `max-width: 680px`, `margin: 0 auto`
- Horizontal padding: `var(--haze-space-md)` mobile → `var(--haze-space-lg)` at 750px+
- All colors via `var(--haze-color-*)` tokens — no hardcoded hex

### sections/haze-ingredients.liquid
4-block responsive grid section with:
- Optional section heading (Heading role)
- Block loop rendering icon + material name + descriptor
- Icons loaded via `{{ block.settings.icon | asset_url }}` (same pattern as haze-value-props.liquid)
- `block.shopify_attributes` on every block element (required for Customize panel drag-to-reorder)
- `| escape` on all text-type settings (injection mitigation T-03-02)
- Schema: `heading` text setting + `ingredient` block type with `icon`, `name`, `descriptor` text settings
- Preset includes all 4 default ingredient blocks with correct icon filenames

### assets/haze-ingredients.css
- Grid: 2-column mobile with `var(--haze-space-md)` gap → 4-column at 990px+ with `var(--haze-space-lg)` gap
- Section: `padding: var(--haze-space-xl) 0`, `background-color: var(--haze-color-cream)`
- Block: centered text, icon 40x40px
- Material name: Heading role (24px Cormorant Garamond, weight 400)
- Descriptor: Body role (16px DM Sans, 75% opacity)
- All colors via `var(--haze-color-*)` tokens — no hardcoded hex

### SVG Icons (all 4)
All match Phase 2 value prop icon pattern: 40x40 viewBox, `fill="none"`, `stroke="#C4714A"`, `stroke-width="1.5"`, `stroke-linecap="round"`.
- `haze-icon-silk.svg` — 3 wavy horizontal lines representing smooth silk strands
- `haze-icon-bristle.svg` — fan-shaped brush with 6 diverging bristle paths and handle
- `haze-icon-oeko.svg` — organic leaf shape with checkmark inside (certification badge)
- `haze-icon-mulberry.svg` — ribbon scrunchie loop with figure-eight accent paths

---

## Security / Threat Model Compliance

| Threat ID | Mitigation Applied |
|-----------|-------------------|
| T-03-01 (Injection via ritual-description text settings) | `| escape` on all `type: text` fields; richtext body uses Shopify's server-side sanitization (no `| escape` on richtext per Shopify convention) |
| T-03-02 (Injection via ingredients text settings + icon path traversal) | `| escape` on all text settings; `asset_url` filter on icon filename prevents path traversal |

---

## Deviations from Plan

None — plan executed exactly as written.

---

## Known Stubs

None. All content is editable via Customize panel schema settings with meaningful default copy. No placeholder text that blocks the plan's goal.

---

## Threat Flags

None. No new network endpoints, auth paths, or trust boundary surface introduced. Both sections are read-only Liquid templates that render schema settings.

---

## Self-Check: PASSED

Files verified to exist:
- FOUND: sections/haze-ritual-description.liquid
- FOUND: assets/haze-ritual-description.css
- FOUND: sections/haze-ingredients.liquid
- FOUND: assets/haze-ingredients.css
- FOUND: assets/haze-icon-silk.svg
- FOUND: assets/haze-icon-bristle.svg
- FOUND: assets/haze-icon-oeko.svg
- FOUND: assets/haze-icon-mulberry.svg

Commits verified:
- FOUND: 2fdd7224 — feat(03-01): add ritual description section and CSS
- FOUND: 2ee904ac — feat(03-01): add ingredients section, CSS, and 4 SVG icons
