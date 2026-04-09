# Phase 2: Core Pages - Context

**Gathered:** 2026-04-08 (auto mode)
**Status:** Ready for planning

<domain>
## Phase Boundary

The homepage delivers the full brand experience — hero, product showcase, value props, social proof, and call to action — with the hover video framework wired and ready for real video assets. After this phase, the homepage is complete with all five sections rendered and the video interaction pattern working (with placeholder images, no real videos yet).

</domain>

<decisions>
## Implementation Decisions

### Hero Section
- **D-01:** Create custom `sections/haze-hero.liquid` — do NOT reuse Dawn's `image-banner.liquid` (its schema has overlay opacity, content positioning, and text box settings that fight the clean full-viewport design)
- **D-02:** Hero is full-viewport height (`100vh` or `100dvh`), centered content: "Stay tender." headline in Cormorant Garamond, subtext, and single CTA button linking to PDP (`/products/hair-ritual-kit`)
- **D-03:** Background: placeholder image (`haze-placeholder-hero.jpg`) with `{%- comment -%} PLACEHOLDER` tag; image fills viewport via `object-fit: cover`
- **D-04:** CTA button uses terracotta color scheme (scheme 1), minimal border-radius per `--haze-radius-button: 2px`

### Product Grid
- **D-05:** Create custom `sections/haze-product-grid.liquid` for the 5-card layout — NOT collection-driven; cards are hardcoded in the section schema as blocks (each block = one kit component)
- **D-06:** Create `snippets/haze-card-video.liquid` — the reusable card snippet that renders either a static image or a `<video>` element depending on whether a video URL metafield/setting is present
- **D-07:** Grid layout: 5 cards — CSS Grid, 3 columns desktop (990px+), 2 columns tablet (750px–989px), 1 column mobile (<750px). Fifth card spans or centers on its row.
- **D-08:** Each card has: placeholder image, kit component name, optional short description. No price, no ATC — these are showcase cards, not product cards.
- **D-09:** Card images use `haze-placeholder-{component}.jpg` naming (e.g., `haze-placeholder-silk-comb.jpg`, `haze-placeholder-brush.jpg`, `haze-placeholder-towel.jpg`, `haze-placeholder-scrunchie.jpg`, `haze-placeholder-gift-box.jpg`)

### Video Hover Framework
- **D-10:** Video playback trigger: `mouseenter` starts, `mouseleave` pauses on desktop; IntersectionObserver-based viewport autoplay on touch devices (VIDEO-02, VIDEO-03)
- **D-11:** Transition: 0.3s opacity crossfade between static image and video — editorial feel, not jarring
- **D-12:** `prefers-reduced-motion`: video entirely disabled, static images only (VIDEO-04)
- **D-13:** JavaScript in `assets/haze-video-card.js`, loaded only on homepage via `request.page_type == 'index'` check in the section (VIDEO-05)
- **D-14:** When no video URL is set (placeholder state), card shows static image only — no video element rendered in DOM (VIDEO-01)

### Value Props
- **D-15:** Create custom `sections/haze-value-props.liquid` — 3 blocks, each with icon (SVG inline or image), heading, and body text
- **D-16:** Layout: 3 columns on desktop, stacked on mobile. Centered text alignment. Cream background (scheme 1).
- **D-17:** Content is configurable via section schema blocks (icon image, heading text, body text per block)

### Social Proof
- **D-18:** Create custom `sections/haze-social-proof.liquid` — hidden by default via a section schema checkbox setting (`show_section: false`)
- **D-19:** Section renders placeholder testimonial cards (3 testimonials with name, quote, star rating)
- **D-20:** Toggle visibility: Shopify Customize panel checkbox. When unchecked, section outputs no HTML (Liquid `{% if section.settings.show_section %}` guard).

### Bottom CTA
- **D-21:** Create custom `sections/haze-bottom-cta.liquid` — compact hero variant using blush color scheme (scheme 2)
- **D-22:** Content: short headline, CTA button linking to PDP. Smaller vertical padding than hero. Background color from scheme 2 (blush).

### Homepage Template
- **D-23:** Replace Dawn's default `templates/index.json` sections with Haze sections in order: haze-hero → haze-product-grid → haze-value-props → haze-social-proof → haze-bottom-cta
- **D-24:** Each section loads its own CSS via `{{ 'haze-{section}.css' | asset_url | stylesheet_tag }}`

### Claude's Discretion
- Exact CSS grid gap values and card aspect ratios
- Whether value prop icons are inline SVG or uploaded images
- Social proof card layout (side-by-side vs stacked)
- Exact font sizes and weights for card labels and value prop headings
- Video `<source>` format preferences (mp4 primary)

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Phase 1 Foundation (established patterns)
- `.planning/phases/01-foundation/01-CONTEXT.md` — Brand color system, font stack, token conventions, nav overrides pattern
- `assets/haze-tokens.css` — Design tokens (spacing scale, color aliases, border radius, font overrides)

### Dawn Theme Patterns
- `sections/image-banner.liquid` — Reference for full-viewport section pattern (DO NOT reuse, but study for schema conventions)
- `snippets/card-product.liquid` — Reference for Dawn's card pattern (DO NOT reuse for grid, but study for accessibility patterns)
- `assets/global.js` — IntersectionObserver utility patterns, HTMLUpdateUtility
- `templates/index.json` — Current homepage template to be replaced

### Codebase Maps
- `.planning/codebase/CONVENTIONS.md` — Dawn code style, naming patterns
- `.planning/codebase/STRUCTURE.md` — Directory layout, where to add new code
- `.planning/codebase/ARCHITECTURE.md` — Layers, data flow, Web Components pattern

### Requirements
- `.planning/REQUIREMENTS.md` — HOME-01 through HOME-05, VIDEO-01 through VIDEO-05

</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `assets/haze-tokens.css` — Brand tokens (colors, spacing, radius, fonts) ready to use in all new sections
- `assets/global.js` — IntersectionObserver scroll animation pattern; can inform video observer implementation
- `assets/animations.js` — Scroll-triggered animation utilities
- Dawn's `{{ 'file.css' | asset_url | stylesheet_tag }}` — Standard CSS loading pattern

### Established Patterns
- Sections are self-contained: own CSS loaded via stylesheet_tag, own JS via `<script defer>`
- Web Components via `customElements.define()` for interactive behavior
- Dawn color schemes referenced via `color-{{ section.settings.color_scheme }}` class
- Placeholder images: `haze-placeholder-<slot>.jpg` with `{%- comment -%} PLACEHOLDER` tag
- `haze-` prefix for all custom files (assets, sections, snippets)

### Integration Points
- `templates/index.json` — Must be updated with new section references and order
- `config/settings_data.json` — Sections may need preset entries (via Customize panel)
- `layout/theme.liquid` — Already loads `haze-tokens.css`; no additional layout changes needed
- Phase 1 nav chrome (header/footer) wraps all content — homepage sections render between them

</code_context>

<specifics>
## Specific Ideas

- "That girl" / wellness ritual aesthetic — warm, editorial, not clinical (Gisou is benchmark)
- Hero headline: "Stay tender." — the brand tagline, displayed in Cormorant Garamond
- Product grid shows the ritual experience: silk comb, boar-bristle brush, OEKO-TEX towel, silk scrunchie, gift box
- Video hover creates a "living catalog" feel — products come alive on hover
- Social proof section is a future activation point — hidden until real reviews exist (V2-04)

</specifics>

<deferred>
## Deferred Ideas

None — analysis stayed within phase scope

</deferred>

---

*Phase: 02-core-pages*
*Context gathered: 2026-04-08*
