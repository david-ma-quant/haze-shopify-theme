---
phase: 02-core-pages
plan: "03"
subsystem: homepage-sections
tags: [homepage, value-props, social-proof, bottom-cta, svg-icons, template-wiring]
dependency_graph:
  requires: [02-01, 02-02]
  provides: [complete-homepage-layout]
  affects: [templates/index.json, sections/haze-value-props.liquid, sections/haze-social-proof.liquid, sections/haze-bottom-cta.liquid]
tech_stack:
  added: []
  patterns: [conditional-section-rendering, svg-img-hardcoded-color, schema-presets, responsive-css-grid]
key_files:
  created:
    - sections/haze-value-props.liquid
    - assets/haze-value-props.css
    - assets/haze-icon-ritual.svg
    - assets/haze-icon-leaf.svg
    - assets/haze-icon-gift.svg
    - sections/haze-social-proof.liquid
    - assets/haze-social-proof.css
    - sections/haze-bottom-cta.liquid
    - assets/haze-bottom-cta.css
  modified:
    - templates/index.json
decisions:
  - "SVG icons use hardcoded stroke='#C4714A' instead of currentColor — img tags do not pass CSS context to SVGs, so CSS color tokens cannot colorize them"
  - "Social proof stylesheet_tag placed inside show_section guard — no CSS loaded when section is hidden"
  - "Bottom CTA uses padding var(--haze-space-lg) not xl — intentionally compact per D-22"
metrics:
  duration: "~15 minutes"
  completed: "2026-04-09T02:20:00Z"
  tasks_completed: 3
  tasks_total: 3
  files_created: 9
  files_modified: 1
---

# Phase 02 Plan 03: Value Props, Social Proof, Bottom CTA, and Homepage Wiring Summary

**One-liner:** Three homepage sections (value props 3-col grid, hidden testimonials, blush CTA) plus full templates/index.json replacement wiring all 5 Haze sections in order.

## Tasks Completed

| # | Task | Commit | Files |
|---|------|--------|-------|
| 1 | Create value props section with SVG icons | `6f038ffc` | sections/haze-value-props.liquid, assets/haze-value-props.css, assets/haze-icon-ritual.svg, assets/haze-icon-leaf.svg, assets/haze-icon-gift.svg |
| 2 | Create social proof and bottom CTA sections | `f0da918e` | sections/haze-social-proof.liquid, assets/haze-social-proof.css, sections/haze-bottom-cta.liquid, assets/haze-bottom-cta.css |
| 3 | Wire all sections into homepage template | `f8d7ebcb` | templates/index.json |

## What Was Built

**Value Props Section** (`haze-value-props.liquid`): A 3-block section with schema-configurable icon, heading, and body per block. Responsive grid: single column on mobile, 3 columns at 750px+. Pre-populated with "A Complete Ritual", "Thoughtfully Sourced", "Gift-Ready Always". Each block renders a 40x40 SVG icon from assets.

**SVG Icons** (3 files): Line-art icons at 40x40px — ritual/sunburst, leaf with veins, gift box with ribbon. All use `stroke="#C4714A"` (terracotta hex hardcoded) since they render as `<img>` tags which do not inherit CSS `currentColor`.

**Social Proof Section** (`haze-social-proof.liquid`): Hidden by default via `{%- if section.settings.show_section -%}` guard wrapping all content including the stylesheet tag. Outputs zero HTML when disabled. When enabled: 3 testimonial cards with 5-star SVG ratings (terracotta via `fill="currentColor"` in inline SVG), blockquote/cite semantic markup, typographic curly quotes. Pre-populated with SARAH K., MAYA R., JESSICA T.

**Bottom CTA Section** (`haze-bottom-cta.liquid`): Blush background (`var(--haze-color-blush)`), compact 32px vertical padding (not 64px like hero). Terracotta "Shop the Kit" button with 44px min-height (WCAG 2.5.5), letter-spacing 0.12em uppercase label. Links to `/products/hair-ritual-kit`.

**Homepage Template** (`templates/index.json`): Dawn's 6 default sections fully replaced. All 5 Haze sections wired in order: haze_hero → haze_product_grid → haze_value_props → haze_social_proof → haze_bottom_cta. All blocks and settings pre-populated including 5 product grid cards and 3 value prop blocks.

## Deviations from Plan

None — plan executed exactly as written.

The plan itself anticipated and documented the SVG `currentColor` limitation (plan action notes explicitly called for option (b): hardcode `stroke="#C4714A"`). This was followed precisely.

## Known Stubs

The social proof section is intentionally hidden (`show_section: false`) with placeholder reviewer names (SARAH K., MAYA R., JESSICA T.). These are fictional stand-ins per the plan's copywriting contract and threat model (T-02-07). This is by design — the section activates in a future phase when real reviews are available. The homepage CTA and hero sections link to `/products/hair-ritual-kit` which must exist in the Shopify store for links to resolve.

## Threat Surface

No new threat surface beyond what is in the plan's threat model. All text output uses `| escape` filter. The `type: url` setting on CTA link fields uses Shopify's built-in URL validation.

## Self-Check: PASSED

All 10 files verified present on disk. All 3 task commits confirmed in git log (6f038ffc, f0da918e, f8d7ebcb).
