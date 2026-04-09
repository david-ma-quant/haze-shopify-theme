# Phase 3: PDP & Supporting Pages - Context

**Gathered:** 2026-04-09 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

A visitor arriving from TikTok can read about the Hair Ritual Kit and add it to cart; About and FAQ pages give the brand depth and satisfy footer link requirements. After this phase, the conversion page (PDP) is fully functional with scroll-snap gallery, ritual description, ingredient blocks, and FAQ accordion. The About and FAQ standalone pages are live and reachable via footer links.

</domain>

<decisions>
## Implementation Decisions

### PDP Section Architecture
- **D-01:** Reuse Dawn's `main-product.liquid` section — do NOT create a custom PDP section from scratch. Dawn's main-product already handles ATC form, product-info.js, product-form.js, and cart-drawer integration (PDP-06). Building custom would be 500+ lines and lose Dawn's JS stack.
- **D-02:** Create `templates/product.haze.json` as the custom template (PDP-07). This template references Dawn's `main-product` type but configures blocks and settings specifically for the Hair Ritual Kit.
- **D-03:** Add CSS overrides in `assets/haze-pdp.css` loaded via `product.haze.json` to style the PDP with Haze brand identity (typography, colors, spacing). Do NOT modify Dawn's `section-main-product.css`.

### Image Gallery (PDP-01)
- **D-04:** CSS scroll-snap overrides on Dawn's media gallery for mobile horizontal swipe. Dawn's product-media-gallery snippet handles the gallery HTML — we just override CSS to enable `scroll-snap-type: x mandatory` on mobile.
- **D-05:** Create `assets/haze-pdp-gallery.js` — minimal JS for dot indicator. Uses `IntersectionObserver` on gallery slides to sync active dot with scroll position. No swipe library.
- **D-06:** Dot indicator rendered via Liquid in product.haze.json's main section configuration or via CSS pseudo-elements. 4 dots matching 4 placeholder images.
- **D-07:** Gallery images use `haze-placeholder-pdp-{1..4}.jpg` naming with `{%- comment -%} PLACEHOLDER` tags for grep-findability.

### ATC & Cart Integration (PDP-02, PDP-06)
- **D-08:** Use Dawn's native `buy_buttons` block in main-product — no custom ATC form. Single variant (default), hide variant picker and quantity selector via template settings.
- **D-09:** Cart drawer is already configured (Phase 1 set cart type to drawer). ATC triggers Dawn's cart-drawer flow natively — zero custom code needed.
- **D-10:** Hide dynamic checkout buttons (`show_dynamic_checkout: false`) — single CTA only ("Add to Cart") for clean conversion path.

### Ritual Description (PDP-03)
- **D-11:** Create custom `sections/haze-ritual-description.liquid` — placed below main-product in product.haze.json. This is a standalone section, NOT a block within main-product, because it needs full-width serif treatment that Dawn's text blocks can't achieve.
- **D-12:** Ritual description uses Cormorant Garamond italic for the headline, DM Sans for body copy. Background cream (scheme 1). Content is editable via section schema settings.
- **D-13:** Content: "The Ritual" heading + editorial paragraph describing the daily hair ritual experience.

### Ingredient Icon Blocks (PDP-04)
- **D-14:** Create custom `sections/haze-ingredients.liquid` — 4 icon blocks (SVG + material name + descriptor) in a responsive grid. Placed below ritual description in product.haze.json.
- **D-15:** Each icon block: 40x40 SVG icon (terracotta stroke like value props), material name (Heading role), and short descriptor (Body role). Layout: 4 columns desktop, 2 columns tablet, 1 column mobile.
- **D-16:** Icon SVGs: `haze-icon-silk.svg`, `haze-icon-bristle.svg`, `haze-icon-oeko.svg`, `haze-icon-mulberry.svg` — representing the 4 key materials (silk, boar bristle, OEKO-TEX cotton, mulberry silk). Use `stroke="#C4714A"` (same pattern as Phase 2 value prop icons).

### PDP FAQ Accordion (PDP-05)
- **D-17:** Use Dawn's built-in `collapsible_tab` blocks within main-product section — NOT a separate custom section. Dawn's main-product schema already supports collapsible_tab blocks with `<details>/<summary>` elements.
- **D-18:** Configure 4-5 FAQ items in product.haze.json: "What's in the kit?", "How do I use each tool?", "Shipping & Returns", "Materials & Sourcing", "Gift wrapping?". Content is placeholder text.
- **D-19:** Dawn's `<details>` elements natively allow multiple items to be open simultaneously — no JS customization needed (PDP-05 requirement satisfied by default).

### About Page (PAGE-01)
- **D-20:** Create `templates/page.about.json` using Dawn's existing sections — do NOT create custom haze sections. Use `image-banner` for hero + `image-with-text` section for two-column editorial layout (brand story + tool philosophy).
- **D-21:** CSS overrides in `assets/haze-pages.css` for Cormorant Garamond headings, proper spacing, and brand feel on the editorial layout.
- **D-22:** About page content: brand story ("Haze was born from...") and tool philosophy ("Every tool in the kit was chosen for..."). All placeholder text, editable via Customize panel.

### FAQ Page (PAGE-02)
- **D-23:** Create `templates/page.faq.json` using Dawn's `collapsible-content` section — NOT a custom section. Dawn's collapsible-content already handles accordion with `<details>/<summary>` and supports multiple open items.
- **D-24:** Configure 5+ default FAQ questions: shipping, returns, materials, routine guide, gift info. All placeholder text.
- **D-25:** CSS overrides in `assets/haze-pages.css` (shared with About page) for brand typography.

### Policy Pages (PAGE-03)
- **D-26:** Policy pages (Privacy, Terms, Refund) are created via Shopify Admin > Settings > Policies — no theme code needed. They already link from the footer (Phase 1 configured policy links).
- **D-27:** Note: API token missing `write_content` scope — user must create policy page text manually in admin. Placeholder text sufficient for v1.

### Claude's Discretion
- Exact scroll-snap CSS properties and dot indicator styling
- Gallery dot active state transition and color
- Ritual description paragraph length and editorial tone
- Ingredient block icon designs (simple line art, consistent with Phase 2 value prop icons)
- About page copy length and editorial voice
- FAQ page question ordering and answer length
- Whether to add section-specific background colors or keep all cream

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 & 2 Foundation (established patterns)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Brand color system, font stack, token conventions, nav overrides pattern
- `.planning/phases/02-core-pages/02-CONTEXT.md` — Hero/grid/video patterns, D-01 through D-24
- `assets/haze-tokens.css` — Design tokens (spacing scale, color aliases, border radius, font overrides)

### Dawn PDP Patterns (study, don't modify)
- `sections/main-product.liquid` — Dawn's PDP section with media gallery, blocks, and JS integration
- `snippets/product-media-gallery.liquid` — Dawn's gallery implementation (CSS override target for scroll-snap)
- `templates/product.json` — Dawn's default product template (reference for structure of product.haze.json)
- `sections/collapsible-content.liquid` — Dawn's accordion section (used for FAQ page)
- `assets/product-info.js` — Dawn's product info JS (must remain intact for ATC functionality)
- `assets/product-form.js` — Dawn's product form JS (handles ATC + cart-drawer integration)

### Dawn Page Patterns
- `sections/image-banner.liquid` — For About page hero
- `sections/image-with-text.liquid` — For About page two-column editorial
- `templates/page.json` — Default page template (reference structure)

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — Dawn code style, naming patterns
- `.planning/codebase/ARCHITECTURE.md` — Layers, data flow, entry points

### Requirements
- `.planning/REQUIREMENTS.md` — PDP-01 through PDP-07, PAGE-01 through PAGE-03

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/haze-tokens.css` — Brand tokens (colors, spacing, radius, fonts) ready for PDP styling
- Phase 2 SVG icon pattern — 40x40, `stroke="#C4714A"`, same approach for ingredient icons
- Phase 2 CTA button pattern — terracotta fill, cream text, 2px radius, 44px min-height (reuse for ATC styling)
- Dawn's `component-accordion.css` — Already loaded by main-product for collapsible tabs

### Established Patterns from Phase 2
- Section CSS: `{{ 'haze-{section}.css' | asset_url | stylesheet_tag }}` as first line
- `haze-` prefix for all custom files
- `{%- comment -%} PLACEHOLDER` tag on all placeholder images
- `| escape` filter on all user-editable text output
- `{{ block.shopify_attributes }}` on block elements for Customize panel highlighting
- Schema presets with default content for all editable fields

### Integration Points
- `templates/product.haze.json` — New custom template referencing main-product + custom sections
- Shopify Admin — Assign `product.haze` template to Hair Ritual Kit product
- `templates/page.about.json` — New page template for About page
- `templates/page.faq.json` — New page template for FAQ page
- Footer links already point to `/pages/about` and `/pages/faq` (Phase 1)

### Constraints
- Dawn's main-product.liquid: DO NOT modify HTML. CSS overrides only.
- Dawn's product JS files (product-info.js, product-form.js): DO NOT touch.
- API token can't create pages — user must create About and FAQ pages in admin and assign templates.

</code_context>

<specifics>
## Specific Ideas

- PDP is THE conversion page — every element serves the "add to cart in 60 seconds" goal
- Gallery scroll-snap should feel native (iOS-like smooth snapping)
- Ritual description sets the emotional tone — "this isn't just a comb, it's a morning ritual"
- Ingredient icons show material quality (silk, OEKO-TEX, boar bristle, mulberry silk)
- About page tells the brand story — warm, personal, aspirational (not corporate)
- FAQ answers common objections pre-purchase (shipping time, returns, what's included)

</specifics>

<deferred>
## Deferred Ideas

None — analysis stayed within phase scope

</deferred>

---

*Phase: 03-pdp-supporting-pages*
*Context gathered: 2026-04-09*
