# Phase 2: Core Pages - Discussion Log

> **Audit trail only.** Do not use as input to planning, research, or execution agents.
> Decisions are captured in CONTEXT.md — this log preserves the alternatives considered.

**Date:** 2026-04-08
**Phase:** 02-core-pages
**Mode:** Auto (all recommended defaults selected)
**Areas discussed:** Hero approach, Product grid architecture, Video hover behavior, Section composition

---

## Hero Section Approach

| Option | Description | Selected |
|--------|-------------|----------|
| Reuse Dawn's `image-banner` | CSS overrides on existing section; less work but fights schema | |
| Custom `haze-hero.liquid` | Full control; clean schema matching exact design needs | ✓ |

**User's choice:** Custom `haze-hero.liquid` (auto-selected: recommended)
**Notes:** Dawn's image-banner has overlay opacity, content positioning, text box toggle settings that conflict with the simple full-viewport hero design. Custom section avoids fighting Dawn's schema.

---

## Product Grid Architecture

| Option | Description | Selected |
|--------|-------------|----------|
| Dawn's `featured-collection` + `card-product` | Collection-driven, uses existing card snippet | |
| Custom section + snippet (`haze-product-grid` + `haze-card-video`) | Hardcoded cards with video hover support | ✓ |
| Hybrid (Dawn section, custom snippet) | Mix of both approaches | |

**User's choice:** Custom section + snippet (auto-selected: recommended)
**Notes:** The 5-card grid is not collection-driven — each card represents a kit component with its own video. Dawn's `card-product.liquid` expects Shopify product objects. Custom snippet handles the image/video dual-state.

---

## Video Hover Behavior

| Option | Description | Selected |
|--------|-------------|----------|
| Instant swap (no transition) | Image immediately replaced by video on hover | |
| Fade crossfade (0.3s opacity) | Smooth editorial transition between image and video | ✓ |
| Slide/wipe transition | Directional reveal effect | |

**User's choice:** Fade crossfade 0.3s (auto-selected: recommended)
**Notes:** Fade is smoother for editorial aesthetic. Touch devices get viewport-triggered autoplay via IntersectionObserver. `prefers-reduced-motion` disables all video.

---

## Section Composition

| Option | Description | Selected |
|--------|-------------|----------|
| Extend Dawn defaults | Add Haze sections alongside existing Dawn sections | |
| Replace with Haze sections | Clean slate: haze-hero → haze-product-grid → haze-value-props → haze-social-proof → haze-bottom-cta | ✓ |

**User's choice:** Replace with Haze sections (auto-selected: recommended)
**Notes:** Clean separation. Each section is self-contained with its own CSS. Social proof has a Customize panel checkbox for show/hide.

---

## Claude's Discretion

- Exact CSS grid gap values and card aspect ratios
- Value prop icon format (inline SVG vs uploaded images)
- Social proof card layout
- Font sizes and weights for card labels
- Video source format preferences

## Deferred Ideas

None — discussion stayed within phase scope
