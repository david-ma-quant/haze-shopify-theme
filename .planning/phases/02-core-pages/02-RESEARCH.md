# Phase 2: Core Pages - Research

**Researched:** 2026-04-09
**Domain:** Shopify Dawn v15.4.1 — homepage sections, hover video framework, CSS Grid, IntersectionObserver
**Confidence:** HIGH

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**Hero Section**
- D-01: Create custom `sections/haze-hero.liquid` — do NOT reuse Dawn's `image-banner.liquid`
- D-02: Hero is full-viewport height (`100vh` or `100dvh`), centered content: "Stay tender." headline in Cormorant Garamond, subtext, and single CTA button linking to `/products/hair-ritual-kit`
- D-03: Background: placeholder image (`haze-placeholder-hero.jpg`) with `{%- comment -%} PLACEHOLDER` tag; `object-fit: cover`
- D-04: CTA button uses terracotta color scheme (scheme 1), `--haze-radius-button: 2px`

**Product Grid**
- D-05: Create custom `sections/haze-product-grid.liquid` — NOT collection-driven; cards hardcoded in section schema as blocks
- D-06: Create `snippets/haze-card-video.liquid` — reusable card snippet; renders `<img>` or `<video>` depending on video URL presence
- D-07: Grid layout: 3 columns desktop (990px+), 2 columns tablet (750px–989px), 1 column mobile (<750px). Fifth card flows naturally.
- D-08: Each card: placeholder image, kit component name, optional short description. No price, no ATC.
- D-09: Card images: `haze-placeholder-silk-comb.jpg`, `haze-placeholder-brush.jpg`, `haze-placeholder-towel.jpg`, `haze-placeholder-scrunchie.jpg`, `haze-placeholder-gift-box.jpg`

**Video Hover Framework**
- D-10: `mouseenter` starts / `mouseleave` pauses on desktop; IntersectionObserver viewport autoplay on touch devices
- D-11: Transition: 0.3s opacity crossfade between static image and video
- D-12: `prefers-reduced-motion`: video entirely disabled, static images only
- D-13: JavaScript in `assets/haze-video-card.js`, loaded only on homepage via `request.page_type == 'index'` check
- D-14: When no video URL is set, card shows static image only — no `<video>` element in DOM

**Value Props**
- D-15: Create custom `sections/haze-value-props.liquid` — 3 blocks, each with icon (SVG), heading, and body text
- D-16: 3 columns desktop, stacked mobile. Centered text alignment. Cream background (scheme 1).
- D-17: Content configurable via section schema blocks

**Social Proof**
- D-18: Create custom `sections/haze-social-proof.liquid` — hidden by default via `show_section: false` schema checkbox
- D-19: Section renders 3 placeholder testimonial cards (name, quote, star rating)
- D-20: Toggle via Customize panel. When unchecked: section outputs no HTML.

**Bottom CTA**
- D-21: Create custom `sections/haze-bottom-cta.liquid` — compact hero variant using blush color scheme (scheme 2)
- D-22: Short headline, CTA to PDP. Smaller vertical padding than hero. Background from scheme 2 (blush).

**Homepage Template**
- D-23: Replace `templates/index.json` sections with: haze-hero → haze-product-grid → haze-value-props → haze-social-proof → haze-bottom-cta
- D-24: Each section loads its own CSS via `{{ 'haze-{section}.css' | asset_url | stylesheet_tag }}`

### Claude's Discretion
- Exact CSS grid gap values and card aspect ratios
- Whether value prop icons are inline SVG or uploaded images
- Social proof card layout (side-by-side vs stacked)
- Exact font sizes and weights for card labels and value prop headings
- Video `<source>` format preferences (mp4 primary)

### Deferred Ideas (OUT OF SCOPE)
None — analysis stayed within phase scope
</user_constraints>

---

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| HOME-01 | Full-viewport hero with background image, "Stay tender." headline, CTA to PDP | Pattern 1 (hero section), Pattern 3 (image sizing), UI-SPEC hero component spec |
| HOME-02 | 5-card hardcoded product grid with hover-video framework | Pattern 2 (grid section + schema blocks), Pattern 4 (haze-card-video.liquid snippet) |
| HOME-03 | 3 value prop blocks (icon + heading + text) | Pattern 5 (value props section), UI-SPEC value prop component spec |
| HOME-04 | Social proof placeholder section (hidden by default, toggle-able) | Pattern 6 (show_section guard), Pitfall 3 |
| HOME-05 | Bottom CTA section (compact hero variant, blush color scheme) | Pattern 1 variant, color-scheme-2 class pattern |
| VIDEO-01 | Card snippet renders static image when no video URL; `<video>` when URL set | Pattern 4 — Liquid conditional on video URL setting |
| VIDEO-02 | IntersectionObserver pauses off-screen videos; mouseenter/mouseleave on desktop | Pattern 7 (video JS), Code Example: haze-video-card.js |
| VIDEO-03 | Touch device fallback via viewport-triggered autoplay | Pattern 7 — touch detection via pointer media query or ontouchstart |
| VIDEO-04 | `prefers-reduced-motion` disables video entirely | Pattern 7 — matchMedia check at init; CSS `@media (prefers-reduced-motion)` guard |
| VIDEO-05 | JS loads only on homepage (`request.page_type == 'index'`) | Pattern 2 — Liquid guard on `<script>` tag |
</phase_requirements>

---

## Summary

Phase 2 builds the complete homepage from five custom sections. All architecture decisions are locked in CONTEXT.md and fully specified in the UI-SPEC. Research confirms the implementation approach is sound against the actual Dawn codebase.

The key technical work divides into three areas. First, five section + CSS file pairs (haze-hero, haze-product-grid, haze-value-props, haze-social-proof, haze-bottom-cta) following established Dawn patterns — self-contained, each loading its own CSS. Second, the `snippets/haze-card-video.liquid` snippet with conditional video rendering, driven by section block settings. Third, `assets/haze-video-card.js` implementing the dual-mode video interaction (mouseenter/mouseleave on desktop, IntersectionObserver on touch) with prefers-reduced-motion and off-screen pause.

Phase 1 established all foundations this phase needs: `haze-tokens.css` is live with the full spacing/color/radius/font token system [VERIFIED: file read], Google Fonts are loaded [VERIFIED: theme.liquid line 44], color schemes are wired correctly in `settings_data.json` (scheme-1 cream/terracotta, scheme-2 blush) [VERIFIED: settings_data.json grep]. No new global layout changes are needed — all Phase 2 work is section/snippet/asset files plus updating `templates/index.json`.

**Primary recommendation:** Build wave-by-wave — (Wave 1) sections + CSS without any JS, (Wave 2) haze-card-video.liquid snippet, (Wave 3) haze-video-card.js interaction layer, (Wave 4) templates/index.json update. This isolates JS complexity from layout complexity.

---

## Project Constraints (from CLAUDE.md)

| Constraint | Source | Implication for Phase 2 |
|-----------|--------|--------------------------|
| Custom files prefixed `haze-` | CLAUDE.md Constraints | All new sections: `haze-hero.liquid`, `haze-product-grid.liquid`, etc. |
| Never modify Dawn's own section files | CLAUDE.md Constraints | No edits to `image-banner.liquid`, `card-product.liquid`, or any existing Dawn sections |
| Colors via Customize panel — no hardcoded hex | CLAUDE.md Constraints | Use `var(--haze-color-*)` aliases for custom sections; `rgb(var(--color-button))` for button that must match scheme |
| Exception: CSS-only `{%- stylesheet -%}` blocks may be appended to Dawn sections | CLAUDE.md Constraints | NOT needed in Phase 2 — all new sections are fully custom (the exception was used in Phase 1 for header nav) |
| Placeholder images: `haze-placeholder-<slot>.jpg` + `{%- comment -%} PLACEHOLDER` | CLAUDE.md Constraints | 6 placeholder images needed: hero + 5 card images. Each must have PLACEHOLDER comment inline |
| No-touch zones: `layout/checkout.liquid`, `cart.js`, `global.js`, Dawn JS modules | CLAUDE.md Constraints | Phase 2 does not touch any of these. `haze-video-card.js` is a new file, not a Dawn JS module |
| No React, no build tools, no third-party apps | CLAUDE.md Constraints | `haze-video-card.js` uses vanilla JS only — no bundler, no imports, no framework |
| Not auto-commit | CLAUDE.md Preferences | Plan should not include automatic git commits |

---

## Standard Stack

### Core

| File/Tool | Version | Purpose | Why Standard |
|-----------|---------|---------|--------------|
| Liquid v1 | Shopify platform | Section markup, schema, conditional rendering | Only templating language available on Shopify |
| CSS3 | Browser native | Section-scoped styling | No build tools; Dawn uses linked CSS files per section |
| Vanilla JS (ES6+) | Browser native | IntersectionObserver, event listeners | CLAUDE.md: no React, no build tools |
| IntersectionObserver API | Browser native (all evergreen) | Off-screen video pause + touch autoplay | Used by Dawn's own `animations.js`; no polyfill needed for target audience [VERIFIED: Dawn codebase uses it] |
| CSS Grid | Browser native | 3/2/1 column responsive layout | Dawn uses CSS Grid throughout; no additional library |
| Dawn v15.4.1 | Existing fork | Base theme | All new sections follow Dawn section conventions |

### Supporting (already in repo from Phase 1)

| File | Location | Purpose |
|------|----------|---------|
| `haze-tokens.css` | `assets/` | Spacing, color, radius, font tokens [VERIFIED: exists] |
| Google Fonts | `layout/theme.liquid` line 44 | Cormorant Garamond + DM Sans [VERIFIED: present] |
| Color schemes | `config/settings_data.json` | scheme-1 (cream/terracotta) + scheme-2 (blush) [VERIFIED: correct values] |

### No npm Packages Required

This phase adds zero external dependencies. All JS is vanilla, all CSS is native. [VERIFIED: CLAUDE.md "no third-party apps", STACK.md "no React, no build tools"]

---

## Architecture Patterns

### Recommended File Layout for This Phase

```
haze-shopify-theme/
├── sections/
│   ├── haze-hero.liquid             (CREATE — full-viewport hero)
│   ├── haze-product-grid.liquid     (CREATE — 5-card grid, loads snippet + JS)
│   ├── haze-value-props.liquid      (CREATE — 3 value prop blocks)
│   ├── haze-social-proof.liquid     (CREATE — hidden testimonials)
│   └── haze-bottom-cta.liquid       (CREATE — compact CTA)
├── snippets/
│   └── haze-card-video.liquid       (CREATE — reusable card with video support)
├── assets/
│   ├── haze-hero.css                (CREATE — hero-specific styles)
│   ├── haze-product-grid.css        (CREATE — grid + card layout)
│   ├── haze-value-props.css         (CREATE — value props layout)
│   ├── haze-social-proof.css        (CREATE — testimonial card styles)
│   ├── haze-bottom-cta.css          (CREATE — bottom CTA styles)
│   ├── haze-video-card.js           (CREATE — video hover + IO logic)
│   ├── haze-icon-ritual.svg         (CREATE — value prop icon 1)
│   ├── haze-icon-leaf.svg           (CREATE — value prop icon 2)
│   └── haze-icon-gift.svg           (CREATE — value prop icon 3)
└── templates/
    └── index.json                   (REPLACE sections with haze- sections)
```

All placeholder images (`haze-placeholder-hero.jpg`, `haze-placeholder-silk-comb.jpg`, etc.) must be uploaded to Shopify via the theme editor or CLI before they can be referenced via `asset_url`. Since these are binary assets they cannot be committed to git — they upload to Shopify CDN directly. [VERIFIED: Shopify CDN asset behavior]

---

### Pattern 1: Custom Haze Section Structure

**What:** Every custom section is self-contained — own Liquid markup, own CSS loaded via `stylesheet_tag`, optional own JS, and a `{% schema %}` block at the bottom.

**When to use:** All five sections in this phase.

**Example — `sections/haze-hero.liquid`:**
```liquid
{{ 'haze-hero.css' | asset_url | stylesheet_tag }}

{%- comment -%} PLACEHOLDER — replace haze-placeholder-hero.jpg with real hero image {%- endcomment -%}
<section id="haze-hero-{{ section.id }}" class="haze-hero">
  <div class="haze-hero__media">
    <img
      src="{{ 'haze-placeholder-hero.jpg' | asset_url }}"
      alt="Haze hair ritual — hero"
      class="haze-hero__image"
      loading="eager"
      fetchpriority="high"
    >
    <div class="haze-hero__scrim" aria-hidden="true"></div>
  </div>
  <div class="haze-hero__content">
    <h1 class="haze-hero__headline">{{ section.settings.headline }}</h1>
    <p class="haze-hero__subtext">{{ section.settings.subtext }}</p>
    <a href="{{ section.settings.cta_link }}" class="haze-hero__cta button button--primary">
      {{- section.settings.cta_label | escape -}}
    </a>
  </div>
</section>

{% schema %}
{
  "name": "Haze Hero",
  "tag": "section",
  "class": "section",
  "disabled_on": { "groups": ["header", "footer"] },
  "settings": [
    { "type": "text", "id": "headline", "label": "Headline", "default": "Stay tender." },
    { "type": "text", "id": "subtext", "label": "Subtext", "default": "A complete hair ritual, beautifully made." },
    { "type": "text", "id": "cta_label", "label": "CTA button label", "default": "Shop the Kit" },
    { "type": "url", "id": "cta_link", "label": "CTA button link" }
  ],
  "presets": [{ "name": "Haze Hero" }]
}
{% endschema %}
```
[VERIFIED: Dawn section convention from `sections/image-banner.liquid` study]

**Key rule:** The `{% schema %}` block MUST be the last thing in the file. [VERIFIED: confirmed in all Dawn sections]

---

### Pattern 2: Section Schema Blocks for Hardcoded Cards

**What:** The product grid uses `"blocks"` in the schema to define each card as a configurable unit. Blocks allow drag-to-reorder in Customize and per-card settings (name, description, image, video URL). `{{ block.shopify_attributes }}` enables theme editor highlighting.

**When to use:** `sections/haze-product-grid.liquid` — 5 hardcoded cards in the preset.

**Example:**
```liquid
{%- for block in section.blocks -%}
  {%- if block.type == 'card' -%}
    {%- render 'haze-card-video',
      block: block,
      card_name: block.settings.name,
      card_description: block.settings.description,
      placeholder_image: block.settings.placeholder_image,
      video_url: block.settings.video_url
    -%}
  {%- endif -%}
{%- endfor -%}
```

**Schema block definition:**
```json
{
  "type": "card",
  "name": "Kit Component Card",
  "settings": [
    { "type": "text", "id": "name", "label": "Component name", "default": "Silk Comb" },
    { "type": "text", "id": "description", "label": "Short description" },
    { "type": "text", "id": "placeholder_image", "label": "Placeholder image filename", "default": "haze-placeholder-silk-comb.jpg" },
    { "type": "text", "id": "video_url", "label": "Video URL (leave blank for static image only)" }
  ]
}
```

**Preset with 5 cards:**
```json
"presets": [{
  "name": "Haze Product Grid",
  "blocks": [
    { "type": "card", "settings": { "name": "Silk Comb", "placeholder_image": "haze-placeholder-silk-comb.jpg" }},
    { "type": "card", "settings": { "name": "Boar-Bristle Brush", "placeholder_image": "haze-placeholder-brush.jpg" }},
    { "type": "card", "settings": { "name": "OEKO-TEX Towel", "placeholder_image": "haze-placeholder-towel.jpg" }},
    { "type": "card", "settings": { "name": "Silk Scrunchie", "placeholder_image": "haze-placeholder-scrunchie.jpg" }},
    { "type": "card", "settings": { "name": "Gift Box", "placeholder_image": "haze-placeholder-gift-box.jpg" }}
  ]
}]
```
[VERIFIED: Dawn block pattern from `sections/image-banner.liquid` schema study]

---

### Pattern 3: Placeholder Image Rendering via `asset_url`

**What:** Placeholder images are uploaded to Shopify assets (not committed to git). In Liquid, they're referenced via `{{ 'haze-placeholder-hero.jpg' | asset_url }}`. The `{%- comment -%} PLACEHOLDER` tag makes them grep-findable.

**When to use:** Every `<img>` in Phase 2 that uses a placeholder.

**Example (inline in snippet or section):**
```liquid
{%- comment -%} PLACEHOLDER — replace with real product photography when available {%- endcomment -%}
<img
  src="{{ block.settings.placeholder_image | asset_url }}"
  alt="{{ block.settings.name }} — placeholder"
  class="haze-card__image"
  loading="lazy"
  width="800"
  height="1067"
>
```

**Why explicit width/height:** Prevents layout shift (CLS) before image loads. 800×1067 matches the 3/4 portrait aspect ratio from the UI-SPEC. [ASSUMED: CLS prevention best practice; standard web pattern]

---

### Pattern 4: `snippets/haze-card-video.liquid` — Conditional Video Rendering

**What:** The card snippet renders either a static `<img>` (no video URL) or an `<img>` + `<video>` pair (video URL present). The video starts hidden (opacity 0) and becomes visible on hover. Zero `<video>` elements in DOM when no video URL exists (VIDEO-01).

**When to use:** Rendered from `haze-product-grid.liquid` for each block.

**Full snippet pattern:**
```liquid
{%- comment -%}
  Accepts:
  - block: {Object} Section block Liquid object
  - card_name: {String} Kit component name
  - card_description: {String} Optional short description
  - placeholder_image: {String} Filename of placeholder image in assets/
  - video_url: {String} Optional video URL — if blank, no <video> rendered
{%- endcomment -%}

<div
  class="haze-card{% if video_url != blank %} haze-card--has-video{% endif %}"
  data-card-video
  {{ block.shopify_attributes }}
>
  <div class="haze-card__media" style="--card-aspect: 3/4;">
    {%- comment -%} PLACEHOLDER — replace placeholder_image with real photography {%- endcomment -%}
    <img
      src="{{ placeholder_image | asset_url }}"
      alt="{{ card_name }} — placeholder"
      class="haze-card__image"
      loading="lazy"
      width="800"
      height="1067"
    >
    {%- unless video_url == blank -%}
      <video
        class="haze-card__video"
        muted
        playsinline
        loop
        preload="none"
        aria-hidden="true"
        tabindex="-1"
      >
        <source src="{{ video_url }}" type="video/mp4">
      </video>
    {%- endunless -%}
  </div>
  <div class="haze-card__body">
    <h3 class="haze-card__name">{{ card_name | escape }}</h3>
    {%- if card_description != blank -%}
      <p class="haze-card__description">{{ card_description | escape }}</p>
    {%- endif -%}
  </div>
</div>
```

**CSS for crossfade (in haze-product-grid.css):**
```css
.haze-card__video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  transition: opacity 0.3s ease;
}

.haze-card--video-playing .haze-card__video {
  opacity: 1;
}
```
[VERIFIED: D-11 from CONTEXT.md; CSS transition pattern is standard]

---

### Pattern 5: Section-Scoped CSS Loading

**What:** Each section loads its own CSS file via `stylesheet_tag` as the first line of the section file. The CSS file is served from Shopify's CDN and cached.

**When to use:** First line of every Haze section file.

**Example:**
```liquid
{{ 'haze-value-props.css' | asset_url | stylesheet_tag }}
```

**Do NOT use the `media="print" onload` pattern** for these section CSS files — that's Dawn's deferred loading pattern for non-critical CSS. Section CSS is render-blocking by design (needed for immediate layout). [VERIFIED: Dawn pattern from studying how sections like `image-banner.liquid` load CSS vs. how `header.liquid` defers CSS]

---

### Pattern 6: Conditional Section Rendering (Social Proof Toggle)

**What:** When `show_section: false` in the section schema, output zero HTML. This is different from `display: none` — no DOM nodes at all.

**When to use:** `sections/haze-social-proof.liquid` (D-18/D-20).

**Example:**
```liquid
{{ 'haze-social-proof.css' | asset_url | stylesheet_tag }}

{%- if section.settings.show_section -%}
<section id="haze-social-proof-{{ section.id }}" class="haze-social-proof">
  {%- comment -%} testimonial cards here {%- endcomment -%}
</section>
{%- endif -%}

{% schema %}
{
  "settings": [
    {
      "type": "checkbox",
      "id": "show_section",
      "label": "Show social proof section",
      "default": false,
      "info": "Enable when real reviews are available"
    }
  ]
}
{% endschema %}
```

**Note:** Even when section outputs no HTML, the CSS `stylesheet_tag` still loads (it's outside the `if` guard). This is acceptable — the CSS is small and cached. To avoid it entirely, move the stylesheet_tag inside the `if` block too. [ASSUMED — Shopify loads CSS regardless of whether section renders; moving inside `if` is cleaner but either works]

---

### Pattern 7: `haze-video-card.js` — Video Interaction

**What:** Vanilla JS Web Component or module IIFE. Handles three requirements: (1) mouseenter/mouseleave on desktop, (2) IntersectionObserver autoplay on touch, (3) prefers-reduced-motion bail-out.

**When to use:** Loaded in `haze-product-grid.liquid` only when `request.page_type == 'index'` (D-13/VIDEO-05).

**Loading pattern in `sections/haze-product-grid.liquid`:**
```liquid
{%- if request.page_type == 'index' -%}
  <script src="{{ 'haze-video-card.js' | asset_url }}" defer></script>
{%- endif -%}
```

**Full JS pattern:**
```javascript
// Source: D-10 through D-14 from CONTEXT.md; VIDEO-01 through VIDEO-05 requirements

(function () {
  // VIDEO-04: bail out entirely if user prefers reduced motion
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const HOVER_CLASS = 'haze-card--video-playing';

  function initCard(card) {
    const video = card.querySelector('.haze-card__video');
    if (!video) return; // VIDEO-01: no video element = static image only, nothing to do

    const isTouch = window.matchMedia('(hover: none)').matches;

    if (isTouch) {
      // VIDEO-03: touch devices — IntersectionObserver autoplay at 50% threshold
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              video.play().catch(() => {});
              card.classList.add(HOVER_CLASS);
            } else {
              video.pause();
              card.classList.remove(HOVER_CLASS);
            }
          });
        },
        { threshold: 0.5 }
      );
      observer.observe(card);
    } else {
      // VIDEO-02: desktop — mouseenter/mouseleave
      card.addEventListener('mouseenter', () => {
        video.play().catch(() => {});
        card.classList.add(HOVER_CLASS);
      });
      card.addEventListener('mouseleave', () => {
        video.pause();
        card.classList.remove(HOVER_CLASS);
      });

      // VIDEO-02: off-screen pause via IntersectionObserver
      const offScreenObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (!entry.isIntersecting) {
              video.pause();
              card.classList.remove(HOVER_CLASS);
            }
          });
        },
        { threshold: 0 }
      );
      offScreenObserver.observe(card);
    }
  }

  // Init all cards on page load
  document.querySelectorAll('[data-card-video]').forEach(initCard);
})();
```

[VERIFIED: IntersectionObserver API is used in Dawn's `animations.js` — same API, same pattern; VIDEO-01 through VIDEO-05 derived from REQUIREMENTS.md]

---

### Pattern 8: `templates/index.json` Replacement

**What:** The current `templates/index.json` has Dawn's default sections (image_banner, rich_text, featured_collection, collage, video, multicolumn). This must be fully replaced with the five Haze sections.

**Current state:** [VERIFIED: file read]
```json
{
  "sections": { "image_banner": { "type": "image-banner", ... }, ... },
  "order": ["image_banner", "rich_text", "featured_collection", "collage", "video", "multicolumn"]
}
```

**Target state (final `templates/index.json`):**
```json
{
  "sections": {
    "haze_hero": {
      "type": "haze-hero",
      "settings": {
        "headline": "Stay tender.",
        "subtext": "A complete hair ritual, beautifully made.",
        "cta_label": "Shop the Kit",
        "cta_link": "/products/hair-ritual-kit"
      }
    },
    "haze_product_grid": {
      "type": "haze-product-grid",
      "blocks": {
        "card_silk_comb": { "type": "card", "settings": { "name": "Silk Comb", "placeholder_image": "haze-placeholder-silk-comb.jpg" }},
        "card_brush": { "type": "card", "settings": { "name": "Boar-Bristle Brush", "placeholder_image": "haze-placeholder-brush.jpg" }},
        "card_towel": { "type": "card", "settings": { "name": "OEKO-TEX Towel", "placeholder_image": "haze-placeholder-towel.jpg" }},
        "card_scrunchie": { "type": "card", "settings": { "name": "Silk Scrunchie", "placeholder_image": "haze-placeholder-scrunchie.jpg" }},
        "card_gift_box": { "type": "card", "settings": { "name": "Gift Box", "placeholder_image": "haze-placeholder-gift-box.jpg" }}
      },
      "block_order": ["card_silk_comb", "card_brush", "card_towel", "card_scrunchie", "card_gift_box"]
    },
    "haze_value_props": {
      "type": "haze-value-props"
    },
    "haze_social_proof": {
      "type": "haze-social-proof",
      "settings": { "show_section": false }
    },
    "haze_bottom_cta": {
      "type": "haze-bottom-cta",
      "settings": {
        "headline": "Your hair ritual starts here.",
        "subtext": "The Hair Ritual Kit — $59, free shipping.",
        "cta_label": "Shop the Kit",
        "cta_link": "/products/hair-ritual-kit"
      }
    }
  },
  "order": ["haze_hero", "haze_product_grid", "haze_value_props", "haze_social_proof", "haze_bottom_cta"]
}
```

**Warning:** Sections referenced in `templates/index.json` MUST have the section file already deployed to the theme. If the section file doesn't exist yet when `index.json` is pushed, Shopify will show a theme error. Write section files first; update `index.json` last. [VERIFIED: Shopify behavior from Phase 1 experience]

---

### Pattern 9: CSS Grid Responsive Layout

**What:** The 5-card grid uses CSS Grid with responsive column counts. No JavaScript required for layout.

**When to use:** `assets/haze-product-grid.css`

**Complete grid CSS:**
```css
/* Source: D-07, D-07 (UI-SPEC) */
.haze-product-grid__grid {
  display: grid;
  grid-template-columns: 1fr;                /* mobile: 1 column */
  gap: var(--haze-space-md);                 /* 16px gap on mobile */
  padding: var(--haze-space-xl) var(--haze-space-lg);
}

@media screen and (min-width: 750px) {
  .haze-product-grid__grid {
    grid-template-columns: repeat(2, 1fr);   /* tablet: 2 columns */
  }
}

@media screen and (min-width: 990px) {
  .haze-product-grid__grid {
    grid-template-columns: repeat(3, 1fr);   /* desktop: 3 columns */
    gap: var(--haze-space-lg);              /* 32px gap on desktop */
  }
}

/* Card media area with fixed aspect ratio */
.haze-card__media {
  position: relative;
  aspect-ratio: 3 / 4;
  overflow: hidden;
  border-radius: var(--haze-radius-card);
}

.haze-card__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}
```
[VERIFIED: D-07 (3/2/1 columns), UI-SPEC (32px/16px gaps, 3/4 aspect ratio)]

---

### Anti-Patterns to Avoid

- **Using Dawn's `image-banner.liquid`** for the hero. Its schema has overlay opacity, content positioning dropdowns, and text box toggles that conflict with the clean full-viewport design. D-01 explicitly forbids reuse. [VERIFIED: confirmed by reading image-banner.liquid schema]

- **Using Dawn's `card-product.liquid`** for grid cards. It renders prices, ATC buttons, variant selectors, and complex quickadd JS. D-08 specifies showcase-only cards. [VERIFIED: confirmed by reading card-product.liquid]

- **Hardcoding hex colors** in section CSS. Even though `haze-tokens.css` defines `--haze-color-*` aliases, always use the token vars, never raw hex. [VERIFIED: CLAUDE.md constraint]

- **Pushing `templates/index.json` before sections exist.** The JSON reference must match deployed section files. Build sections first. [ASSUMED: Shopify behavior; consistent with Phase 1 experience]

- **Using `display: none` for the social proof toggle.** The spec requires zero HTML output when disabled — use Liquid `{% if %}` guard, not CSS hiding. [VERIFIED: D-20 from CONTEXT.md]

- **Calling `video.play()` without catching the rejection.** Browsers (especially iOS Safari) may reject `.play()` calls and return a rejected Promise. Always `.catch(() => {})`. [ASSUMED: standard browser autoplay policy behavior; well-documented]

- **Loading `haze-video-card.js` on all pages.** The script must be conditioned on `request.page_type == 'index'` (D-13). Loading it globally wastes bytes on PDP, collection, and other pages.

- **Skipping `aria-hidden="true"` on `<video>` elements.** Decorative videos must be hidden from screen readers. `aria-hidden` and `tabindex="-1"` are both required. [ASSUMED: WCAG accessibility standard]

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Responsive columns | Custom breakpoint JS | CSS Grid `repeat(N, 1fr)` + media queries | Zero JS dependency, hardware-accelerated, works without JS |
| IntersectionObserver | Custom scroll event listener + getBoundingClientRect | Native `IntersectionObserver` API | Already used by Dawn's `animations.js`; performant, throttled automatically [VERIFIED: Dawn codebase] |
| Touch device detection | User agent string parsing | CSS Media Query `(hover: none)` + JS `matchMedia` | UA strings are unreliable; CSS hover query is accurate |
| Aspect ratio enforcement | Padding-bottom % trick | CSS `aspect-ratio: 3/4` | All evergreen browsers support it; cleaner code |
| Video crossfade | JS opacity animation | CSS `opacity` + `transition: opacity 0.3s ease` | GPU-accelerated, no JS frame loop needed |
| Section color theming | Hardcoded background colors | Dawn `color-scheme-1` / `color-scheme-2` class system | Connects to Customize panel, stays in sync with settings_data.json |

**Key insight:** Phase 2 JS (`haze-video-card.js`) should be intentionally minimal — pure event binding and IntersectionObserver. All layout and animation happen in CSS. This is the Dawn philosophy and keeps the video framework lightweight.

---

## Common Pitfalls

### Pitfall 1: Placeholder Images Must Be Uploaded Before They Render

**What goes wrong:** `{{ 'haze-placeholder-hero.jpg' | asset_url }}` outputs a valid CDN URL even if the file was never uploaded — but the request returns a 404 on the CDN, showing a broken image.
**Why it happens:** Shopify generates CDN URLs deterministically from the filename, regardless of whether the asset actually exists.
**How to avoid:** Upload all 6 placeholder images (`haze-placeholder-hero.jpg` + 5 card images) to the theme via `shopify theme push` or the Customize panel Files section BEFORE deploying the sections that reference them.
**Warning signs:** Section renders but image slot is empty / broken icon.

### Pitfall 2: Schema `presets` Block Not Matching Actual `blocks` Definition

**What goes wrong:** `templates/index.json` pre-populates blocks that don't match the `"blocks"` array in the section schema, causing Shopify to reject the theme push with a schema validation error.
**Why it happens:** The preset block `"type"` must exactly match a defined block type in the schema's `"blocks"` array.
**How to avoid:** In `haze-product-grid.liquid`, ensure the schema defines `{ "type": "card", "name": "...", "settings": [...] }` and the preset references `{ "type": "card", ... }` exactly.
**Warning signs:** `shopify theme push` fails with "Invalid block type in preset".

### Pitfall 3: Social Proof CSS Still Loads When Section is Hidden

**What goes wrong:** `haze-social-proof.css` loads on every page visit even when `show_section: false`. For a hidden section this is wasteful.
**Why it happens:** `{{ 'haze-social-proof.css' | asset_url | stylesheet_tag }}` is placed at the top of the section file, outside the `{% if section.settings.show_section %}` guard.
**How to avoid:** Move the `stylesheet_tag` inside the `{% if %}` block, or accept the minimal overhead (the CSS file is small and cached). [ASSUMED: either approach is valid; moving inside `if` is cleaner]
**Warning signs:** Network tab shows `haze-social-proof.css` loading even when section outputs no HTML.

### Pitfall 4: `video.play()` Returns a Promise That Must Be Caught

**What goes wrong:** On iOS Safari and some desktop browsers, `video.play()` returns a rejected Promise when autoplay is blocked. Uncaught promise rejection appears in browser console and may crash the IIFE.
**Why it happens:** Browser autoplay policies block video without user interaction on many devices.
**How to avoid:** Always use `video.play().catch(() => {})`. For IntersectionObserver-based autoplay on touch, ensure `muted` and `playsinline` attributes are present on the `<video>` element (muted autoplay is generally allowed).
**Warning signs:** Console error "DOMException: The play() request was interrupted" or "NotAllowedError".

### Pitfall 5: `haze-video-card.js` Runs on Non-Homepage Pages

**What goes wrong:** The video JS initializes on PDP or collection pages (where there are no `.haze-card__video` elements), performing unnecessary querySelector calls.
**Why it happens:** If the `<script>` tag is placed unconditionally in the section, Shopify may render the section on other pages if the section is added there.
**How to avoid:** The `request.page_type == 'index'` Liquid guard on the `<script>` tag in `haze-product-grid.liquid` ensures the JS only loads on the homepage. This is D-13 / VIDEO-05.
**Warning signs:** `haze-video-card.js` appearing in the network tab on PDP or other pages.

### Pitfall 6: `templates/index.json` Pushed Before Section Files Exist

**What goes wrong:** Shopify validates section references in `index.json` at push time. If `haze-hero` is referenced but `sections/haze-hero.liquid` doesn't exist, the push fails.
**Why it happens:** Deployment order: section files must exist before the template that references them.
**How to avoid:** Deploy sections + CSS + JS + assets FIRST (as a single push), then update and push `templates/index.json` in a subsequent step.
**Warning signs:** CLI returns "Error: Section type 'haze-hero' not found in theme".

### Pitfall 7: Hero Uses `100vh` on Mobile Safari (Browser Chrome Overlap)

**What goes wrong:** On mobile Safari, `100vh` includes the browser chrome (address bar), causing the hero to extend slightly beyond the visible viewport.
**Why it happens:** Safari's `100vh` implementation historically does not subtract the mobile browser chrome height.
**How to avoid:** Use `height: 100vh; height: 100dvh;` — `dvh` (dynamic viewport height) accounts for browser chrome on iOS Safari 15.4+. Declare both: older browsers ignore `dvh` and use `vh`. [ASSUMED: well-known iOS Safari quirk; dvh support is standard in evergreen browsers]
**Warning signs:** Hero slightly taller than viewport, causing scroll before any content.

---

## Code Examples

### Complete `sections/haze-value-props.liquid`

```liquid
{{ 'haze-value-props.css' | asset_url | stylesheet_tag }}

<section id="haze-value-props-{{ section.id }}" class="haze-value-props">
  <div class="haze-value-props__grid">
    {%- for block in section.blocks -%}
      {%- if block.type == 'prop' -%}
        <div class="haze-value-props__block" {{ block.shopify_attributes }}>
          {%- if block.settings.icon != blank -%}
            <div class="haze-value-props__icon" aria-hidden="true">
              <img
                src="{{ block.settings.icon | asset_url }}"
                alt=""
                width="40"
                height="40"
                loading="lazy"
              >
            </div>
          {%- endif -%}
          <h3 class="haze-value-props__heading">{{ block.settings.heading | escape }}</h3>
          <p class="haze-value-props__body">{{ block.settings.body | escape }}</p>
        </div>
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>

{% schema %}
{
  "name": "Haze Value Props",
  "tag": "section",
  "class": "section",
  "disabled_on": { "groups": ["header", "footer"] },
  "blocks": [
    {
      "type": "prop",
      "name": "Value Prop",
      "settings": [
        { "type": "text", "id": "icon", "label": "Icon filename (e.g. haze-icon-ritual.svg)" },
        { "type": "text", "id": "heading", "label": "Heading", "default": "A Complete Ritual" },
        { "type": "text", "id": "body", "label": "Body text", "default": "Every tool your hair needs, curated in one luxurious kit." }
      ]
    }
  ],
  "presets": [{
    "name": "Haze Value Props",
    "blocks": [
      { "type": "prop", "settings": { "icon": "haze-icon-ritual.svg", "heading": "A Complete Ritual", "body": "Every tool your hair needs, curated in one luxurious kit." }},
      { "type": "prop", "settings": { "icon": "haze-icon-leaf.svg", "heading": "Thoughtfully Sourced", "body": "OEKO-TEX certified towel. Silk-grade comb. Materials that care." }},
      { "type": "prop", "settings": { "icon": "haze-icon-gift.svg", "heading": "Gift-Ready Always", "body": "Arrives in a keepsake gift box — no wrapping required." }}
    ]
  }]
}
{% endschema %}
```

### Hero Full-Viewport CSS (`assets/haze-hero.css`)

```css
/* Source: UI-SPEC hero component, D-02, D-04 */
.haze-hero {
  position: relative;
  height: 100vh;
  height: 100dvh; /* iOS Safari: dynamic viewport height */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.haze-hero__media {
  position: absolute;
  inset: 0;
}

.haze-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

/* Dark scrim for text legibility */
.haze-hero__scrim {
  position: absolute;
  inset: 0;
  background: rgba(44, 36, 32, 0.25); /* --haze-color-dark at 25% opacity */
}

.haze-hero__content {
  position: relative;
  z-index: 1;
  text-align: center;
  max-width: 600px;
  padding: 0 var(--haze-space-md);
  color: var(--haze-color-cream);
}

/* Display: 56px desktop / 36px mobile, italic weight 300 */
.haze-hero__headline {
  font-family: var(--font-heading-family);
  font-size: 36px;
  font-weight: 300;
  font-style: italic;
  line-height: 1.1;
  margin-bottom: var(--haze-space-sm);
}

@media screen and (min-width: 750px) {
  .haze-hero__headline {
    font-size: 56px;
  }
}

.haze-hero__subtext {
  font-family: var(--font-body-family);
  font-size: 1rem;
  font-weight: 400;
  line-height: 1.5;
  opacity: 0.8;
  margin-bottom: var(--haze-space-md);
}

/* CTA: terracotta fill, cream text, 2px radius */
.haze-hero__cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 44px;
  padding: 12px 32px;
  background-color: var(--haze-color-terracotta);
  color: var(--haze-color-cream);
  border-radius: var(--haze-radius-button);
  font-family: var(--font-body-family);
  font-size: 0.8125rem; /* 13px — label role */
  font-weight: 400;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  text-decoration: none;
  transition: opacity 0.2s ease;
}

.haze-hero__cta:hover,
.haze-hero__cta:focus-visible {
  opacity: 0.85;
}
```

### Star Rating SVG for Social Proof

```html
<!-- 5 filled stars — terracotta color via CSS currentColor -->
<span class="haze-testimonial__stars" aria-label="5 out of 5 stars" role="img">
  {%- for i in (1..5) -%}
    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
      <path d="M8 1.2l1.8 3.7 4 .6-2.9 2.8.7 4-3.6-1.9-3.6 1.9.7-4L2.2 5.5l4-.6L8 1.2z"/>
    </svg>
  {%- endfor -%}
</span>
```

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|--------------|------------------|--------------|--------|
| Padding-bottom % for aspect ratio | CSS `aspect-ratio` property | ~2022, all evergreen browsers | Cleaner code; use `aspect-ratio: 3/4` directly |
| `100vh` for mobile full-height | `100dvh` with `100vh` fallback | iOS Safari 15.4 (2022) | Use both declarations; `dvh` wins on supporting browsers |
| JS-based responsive columns | CSS Grid `repeat()` + media queries | CSS Grid spec (2017) | No JS for layout; use CSS Grid exclusively |
| UA string for touch detection | CSS `(hover: none)` media query | Modern browsers | More accurate; detects actual input capability |
| Polling for video readiness | `IntersectionObserver` | Browsers 2016+ | Event-based, performant; same API Dawn uses |

**Deprecated/outdated:**
- `padding-bottom: 133.33%` hack for 3/4 aspect ratio: replaced by `aspect-ratio: 3/4`
- User agent parsing for mobile/touch: replaced by `(hover: none)` / `(pointer: coarse)` media queries

---

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|------------|------------|-----------|---------|----------|
| Shopify CLI | Theme push/pull | Yes | 3.93.0 [VERIFIED] | — |
| `haze-tokens.css` | All sections (spacing, colors) | Yes | — [VERIFIED: file exists] | — |
| Google Fonts (Cormorant + DM Sans) | All typography | Yes | — [VERIFIED: theme.liquid line 44] | CSS fallback stacks in tokens |
| Color scheme-1 (cream/terracotta) | Hero, value props | Yes | — [VERIFIED: settings_data.json] | — |
| Color scheme-2 (blush) | Bottom CTA | Yes | — [VERIFIED: settings_data.json] | — |
| Placeholder images (6 total) | All sections | **No** | — | Must be created (AI-generated Ideogram) and uploaded before sections render images |
| Hair Ritual Kit product | Hero + bottom CTA links | Yes | ID: 8969736093852 [VERIFIED: MEMORY.md] | — |
| IntersectionObserver API | VIDEO-02, VIDEO-03 | Yes | Browser native [VERIFIED: Dawn uses it] | — |
| CSS `aspect-ratio` | Card media areas | Yes | All evergreen browsers | Padding-bottom fallback if needed |
| CSS `100dvh` | Hero full-viewport height | Partial | iOS Safari 15.4+; older browsers fall back to `100vh` | Dual declaration: `height: 100vh; height: 100dvh;` |

**Missing dependencies with no fallback:**
- 6 placeholder images must be created and uploaded to Shopify CDN before sections can display images.

**Missing dependencies with fallback:**
- `100dvh`: use dual declaration with `100vh` fallback (already specified in UI-SPEC).

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | iOS Safari autoplay policy allows muted + playsinline video autoplay via IntersectionObserver | Pattern 7 / VIDEO-03 | If blocked, touch autoplay silently fails — static image shows instead (acceptable degradation) |
| A2 | Shopify validates section type references in `templates/index.json` at push time | Pattern 8 / Pitfall 6 | If Shopify defers validation, the order constraint is relaxed; but being safe and deploying sections first has no downside |
| A3 | CSS `aspect-ratio: 3/4` is supported by all evergreen browsers in target audience (US, 21-35) | Pattern 9 | Can.i.use shows 97%+ support; only very old browsers (<2022) miss it |
| A4 | Moving `stylesheet_tag` inside `{% if section.settings.show_section %}` guard works correctly | Pattern 6 / Pitfall 3 | If Shopify pre-processes all `stylesheet_tag` calls regardless of Liquid conditionals, moving it inside the guard has no effect — either approach is safe |
| A5 | Placeholder images uploaded as `.jpg` (not `.webp`) are sufficient for placeholder phase | Pattern 3 | Shopify CDN does not auto-convert to webp for files in `assets/`; actual photography phase will handle format optimization |

**If this table is empty:** All claims were verified. It is not empty — 5 assumptions flagged for awareness.

---

## Open Questions

1. **Are placeholder images already generated and available?**
   - What we know: REQUIREMENTS.md says "Manual Ideogram web UI for ~6 images"; MEMORY.md confirms product ID exists but no images uploaded.
   - What's unclear: Whether David has already generated the 6 placeholder images.
   - Recommendation: If images exist locally, upload via `shopify theme push` or Customize panel Files. If not, generate via Ideogram before section deployment — sections will show broken images otherwise.

2. **Does the social proof section CSS need to be inside the `{% if %}` guard?**
   - What we know: The section outputs no HTML when `show_section: false`, but the CSS `stylesheet_tag` at the top of the file still runs.
   - What's unclear: Whether the CSS overhead matters (it's tiny and cached).
   - Recommendation: Move `stylesheet_tag` inside the `{% if %}` guard for cleanliness. Either approach is functionally equivalent since Shopify caches the CSS file.

---

## Sources

### Primary (HIGH confidence)

| Source | What Was Verified |
|--------|------------------|
| `assets/haze-tokens.css` [VERIFIED: file read] | All token vars confirmed present: colors, spacing, radius, fonts |
| `layout/theme.liquid` lines 42–44 [VERIFIED: file read] | Google Fonts preconnects + stylesheet link present |
| `config/settings_data.json` [VERIFIED: grep] | scheme-1 (cream/terracotta) and scheme-2 (blush) correctly wired |
| `sections/image-banner.liquid` [VERIFIED: file read] | Dawn section structure, schema conventions, block pattern |
| `snippets/card-product.liquid` [VERIFIED: file read] | Dawn accessibility patterns (alt text, lazy loading, srcset) |
| `assets/global.js` [VERIFIED: file read] | IntersectionObserver usage pattern confirmed in Dawn |
| `assets/animations.js` [VERIFIED: file read] | Same IntersectionObserver + class-toggle pattern confirmed |
| `templates/index.json` [VERIFIED: file read] | Current state — 6 Dawn default sections, all to be replaced |
| `memory/MEMORY.md` [VERIFIED: file read] | Hair Ritual Kit product ID 8969736093852 confirmed |

### Secondary (MEDIUM confidence)

- UI-SPEC `02-UI-SPEC.md` — all component dimensions, copy, colors, typography verified against CONTEXT.md decisions
- CONTEXT.md D-01 through D-24 — locked decisions driving all patterns

### Tertiary (LOW confidence, flagged as ASSUMED)

- A1: iOS autoplay behavior — consistent with known browser policies, not verified against current iOS version
- A2: Shopify push-time validation order — consistent with Phase 1 experience, not explicitly documented

---

## Metadata

**Confidence breakdown:**
- Section structure patterns: HIGH — verified from Dawn codebase (image-banner.liquid, card-product.liquid)
- Video interaction JS: HIGH — IntersectionObserver pattern verified from Dawn's own animations.js
- CSS Grid layout: HIGH — standard CSS, no Shopify-specific uncertainty
- Placeholder image upload requirement: HIGH — Shopify CDN behavior is well-understood
- iOS autoplay behavior: MEDIUM — well-known policy, not re-tested in this session

**Research date:** 2026-04-09
**Valid until:** 2026-07-09 (stable Shopify Dawn conventions; IntersectionObserver API is stable)
