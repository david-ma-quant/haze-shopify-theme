# Phase 3: PDP & Supporting Pages — Discussion Log

**Mode:** Auto (all gray areas selected, recommended options chosen)
**Date:** 2026-04-09

## Gray Areas Identified

1. PDP Section Architecture
2. Image Gallery Scroll-Snap
3. Custom Content Sections (Ritual/Ingredients)
4. Supporting Pages Approach

## Decisions Made

### 1. PDP Section Architecture
- **Selected:** Reuse Dawn's `main-product.liquid` + `product.haze.json` + CSS overrides
- **Rationale:** Dawn's main-product has deep JS integration (product-info.js, product-form.js, cart-drawer). Custom section would be 500+ lines and lose ATC/cart functionality.
- **Alternative rejected:** Custom `haze-pdp.liquid` — too much work, duplicates Dawn functionality

### 2. Image Gallery Scroll-Snap
- **Selected:** CSS scroll-snap overrides on Dawn's gallery + minimal JS for dot indicator
- **Rationale:** Dawn's media gallery HTML is solid. Just needs CSS `scroll-snap-type: x mandatory` for mobile and a dot indicator JS synced via IntersectionObserver.
- **Alternative rejected:** Custom gallery snippet — would lose Dawn's media type handling (images, video, 3D models)

### 3. Custom Content Sections (Ritual/Ingredients)
- **Selected:** Custom `haze-ritual-description.liquid` and `haze-ingredients.liquid` sections below main-product
- **Rationale:** Dawn's built-in blocks can't do full-width serif treatment or SVG icon grids. Custom sections are small and focused.
- **Alternative rejected:** Blocks within main-product — layout constraints prevent the desired visual treatment

### 4. Supporting Pages Approach
- **Selected:** Dawn's existing sections via custom page templates (`page.about.json`, `page.faq.json`) + CSS overrides
- **Rationale:** Dawn's image-banner + image-with-text sections already handle About page layout. Dawn's collapsible-content handles FAQ accordion. No need for custom sections.
- **Alternative rejected:** Custom haze sections — unnecessary for editorial pages that Dawn handles well

## Prior Decisions Applied
- P1 D-15: Cart type set to drawer → ATC triggers drawer natively (D-09)
- Init: PDP gallery uses CSS scroll-snap → D-04
- Init: product.haze.json custom template → D-02
- P2: haze- prefix for custom files → applied to all new files
- P2: SVG icons use stroke="#C4714A" → D-16

---
*Auto mode: all selections logged for audit trail*
