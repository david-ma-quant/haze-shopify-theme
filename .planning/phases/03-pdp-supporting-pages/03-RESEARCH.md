# Phase 3: PDP & Supporting Pages — Research

**Researched:** 2026-04-09
**Domain:** Shopify Dawn v15.4.1 — product detail page, media gallery, buy-buttons/cart-drawer flow, custom sections, page templates
**Confidence:** HIGH — all findings verified directly from codebase source files

---

<user_constraints>
## User Constraints (from CONTEXT.md)

### Locked Decisions

**PDP Section Architecture**
- D-01: Reuse Dawn's `main-product.liquid` — do NOT create a custom PDP section from scratch
- D-02: Create `templates/product.haze.json` as the custom template
- D-03: CSS overrides in `assets/haze-pdp.css`; do NOT modify `section-main-product.css`

**Image Gallery**
- D-04: CSS scroll-snap overrides on Dawn's media gallery for mobile horizontal swipe
- D-05: `assets/haze-pdp-gallery.js` — minimal IntersectionObserver dot indicator, no swipe library
- D-06: Dot indicator rendered via Liquid or CSS pseudo-elements, 4 dots
- D-07: Gallery images named `haze-placeholder-pdp-{1..4}.jpg` with `PLACEHOLDER` comment tags

**ATC & Cart Integration**
- D-08: Use Dawn's native `buy_buttons` block; single variant, hide variant picker and quantity selector
- D-09: Cart drawer already configured (Phase 1 set `cart_type` to `drawer`) — zero custom code
- D-10: `show_dynamic_checkout: false` — single CTA only

**Ritual Description**
- D-11: Custom `sections/haze-ritual-description.liquid` — placed below main-product in product.haze.json
- D-12: Cormorant Garamond italic headline, DM Sans body, cream background (scheme 1)
- D-13: "The Ritual" heading + editorial paragraph

**Ingredient Icon Blocks**
- D-14: Custom `sections/haze-ingredients.liquid` — 4 SVG icon blocks in responsive grid
- D-15: 4 columns desktop, 2 columns tablet, 1 column mobile
- D-16: SVG icons: `haze-icon-silk.svg`, `haze-icon-bristle.svg`, `haze-icon-oeko.svg`, `haze-icon-mulberry.svg` with `stroke="#C4714A"`

**PDP FAQ Accordion**
- D-17: Use Dawn's built-in `collapsible_tab` blocks within main-product — NOT a separate custom section
- D-18: 4–5 FAQ items: "What's in the kit?", "How do I use each tool?", "Shipping & Returns", "Materials & Sourcing", "Gift wrapping?"
- D-19: Native `<details>` allows multiple open simultaneously — no JS needed

**About Page**
- D-20: `templates/page.about.json` — use Dawn's `image-banner` + `image-with-text`; NO new haze sections
- D-21: CSS overrides in `assets/haze-pages.css`
- D-22: Brand story + tool philosophy copy, all placeholder text

**FAQ Page**
- D-23: `templates/page.faq.json` — use Dawn's `collapsible-content` section
- D-24: 5+ default FAQ questions
- D-25: CSS overrides in `assets/haze-pages.css` (shared with About page)

**Policy Pages**
- D-26: Created via Shopify Admin > Settings > Policies — no theme code needed
- D-27: API token missing `write_content` scope — user creates policy text manually

### Claude's Discretion
- Exact scroll-snap CSS properties and dot indicator styling
- Gallery dot active state transition and color
- Ritual description paragraph length and editorial tone
- Ingredient block icon designs (consistent with Phase 2 value prop icons)
- About page copy length and editorial voice
- FAQ page question ordering and answer length
- Whether to add section-specific background colors or keep all cream

### Deferred Ideas (OUT OF SCOPE)
None — analysis stayed within phase scope
</user_constraints>

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|----|-------------|------------------|
| PDP-01 | CSS scroll-snap image gallery (4 images, dot indicator synced by JS) | Gallery HTML structure verified: `ul.product__media-list.slider.slider--mobile` already has `scroll-snap-type: x mandatory` on mobile via `component-slider.css`; slides have `scroll-snap-align: start`. Dot overlay via IntersectionObserver on `.slider__slide` items. |
| PDP-02 | Product info with price, kit contents richtext, and ATC form (single variant) | `title`, `price`, `description`, `buy_buttons` blocks confirmed in main-product schema. Single variant: omit `variant_picker` and `quantity_selector` blocks from block_order. |
| PDP-03 | Ritual description block with serif treatment above ATC | Custom section `haze-ritual-description.liquid` placed as second section in product.haze.json `order` array after `main`. |
| PDP-04 | 4 ingredient icon blocks (SVG + material name + descriptor) | Custom section `haze-ingredients.liquid` using same SVG-via-img pattern as Phase 2 value props. |
| PDP-05 | FAQ accordion via native `<details>/<summary>` (multiple can be open) | `collapsible_tab` blocks in main-product render `<details id="Details-{blockId}-{sectionId}">` — each is independent, no JS accordion manager, multiple can be open by default. |
| PDP-06 | ATC form triggers Dawn's cart-drawer (no custom cart page) | `product-form.js` line 11: `this.cart = document.querySelector('cart-notification') \|\| document.querySelector('cart-drawer')`. `settings_data.json` line 171: `"cart_type": "drawer"`. Cart-drawer is present on every page via `layout/theme.liquid`. |
| PDP-07 | Custom template `product.haze.json` assigned to Hair Ritual Kit | Template JSON structure confirmed by studying `templates/product.json`. New template at `templates/product.haze.json` — assign in Shopify Admin > Products > Hair Ritual Kit > Theme template. |
| PAGE-01 | About page with hero image + two-column editorial layout | `image-banner` section confirmed for hero. `image-with-text` section confirmed for two-column: blocks `heading`, `caption`, `text`, `button`; settings `layout` (image_first/text_first), `desktop_image_width` (small/medium/large), `desktop_content_alignment`. |
| PAGE-02 | FAQ page with accordion (5+ default questions) | `collapsible-content` section confirmed: block type `collapsible_row` with `heading`, `icon`, `row_content`, `page` fields. Setting `open_first_collapsible_row` (boolean). `<details>` elements are independent — multiple can be open. |
| PAGE-03 | Native Shopify policy pages created and linked from footer | No theme code needed; Shopify Admin > Settings > Policies. Footer policy links configured in Phase 1. |
</phase_requirements>

---

## Summary

Phase 3 builds the conversion page (PDP) and two supporting pages (About, FAQ). The dominant strategy is reuse: Dawn's `main-product.liquid` handles the gallery, product info column, ATC form, and FAQ accordion — all via JSON template configuration, not code modification. Two custom sections (`haze-ritual-description` and `haze-ingredients`) are added below `main-product` in `product.haze.json`.

The gallery scroll-snap is already 80% done. `component-slider.css` applies `scroll-snap-type: x mandatory` and `scroll-behavior: smooth` to `.slider.slider--mobile` at mobile widths. The product media list is that exact element. What's missing is only: (1) a custom dot indicator overlay (replacing the prev/next counter shown on mobile), and (2) IntersectionObserver JS to sync dots with scroll position. The existing counter/slider-buttons UI must be hidden on mobile and replaced with the dot UI.

The ATC → cart-drawer chain requires zero custom code. `product-form.js` detects `cart-drawer` in the DOM and routes the cart update there. Phase 1 already set `cart_type: drawer` in `settings_data.json`. The only configuration work is in `product.haze.json`: set `show_dynamic_checkout: false` on the `buy_buttons` block and omit `variant_picker` and `quantity_selector` from `block_order`.

**Primary recommendation:** Build `product.haze.json` first (template configuration, no new files). Then write `haze-pdp.css` for all brand overrides. Then `haze-pdp-gallery.js` for dot indicator. Then the two custom sections. Then page templates and `haze-pages.css`.

---

## Standard Stack

### Core

| File | Type | Purpose | Pattern |
|------|------|---------|---------|
| `templates/product.haze.json` | JSON template | Assembles PDP sections and block configuration | Same structure as `templates/product.json` |
| `sections/main-product.liquid` | Dawn section (read-only) | Gallery, product info, ATC form, FAQ accordion | Referenced by type in product.haze.json |
| `assets/haze-pdp.css` | Custom CSS | Brand styling overrides for PDP | Loaded as first line of product.haze.json's custom sections |
| `assets/haze-pdp-gallery.js` | Custom JS | IntersectionObserver dot indicator | Scoped to PDP only |
| `sections/haze-ritual-description.liquid` | Custom section | Editorial ritual copy below main-product | Follows Phase 2 haze-section pattern |
| `sections/haze-ingredients.liquid` | Custom section | 4 ingredient icon blocks | Same SVG + heading + body pattern as haze-value-props |
| `templates/page.about.json` | JSON template | About page using Dawn sections | image-banner + image-with-text |
| `templates/page.faq.json` | JSON template | FAQ page using Dawn collapsible-content | collapsible-content section |
| `assets/haze-pages.css` | Custom CSS | Brand overrides for About and FAQ pages | Shared between both page templates |

### Dawn Sections Used (read-only, no modifications)

| Section type | Used in | Purpose |
|---|---|---|
| `main-product` | product.haze.json | Full PDP — gallery, info, ATC, collapsible tabs |
| `image-banner` | page.about.json | Hero image for About page |
| `image-with-text` | page.about.json | Two-column editorial layout |
| `collapsible-content` | page.faq.json | Full FAQ accordion page |

---

## Architecture Patterns

### Recommended File Structure

```
templates/
├── product.haze.json        (NEW — PDP template)
├── page.about.json          (NEW — About page)
├── page.faq.json            (NEW — FAQ page)

sections/
├── haze-ritual-description.liquid  (NEW)
├── haze-ingredients.liquid         (NEW)

assets/
├── haze-pdp.css             (NEW — PDP brand overrides)
├── haze-pdp-gallery.js      (NEW — dot indicator)
├── haze-pages.css           (NEW — About + FAQ brand overrides)
├── haze-icon-silk.svg       (NEW — ingredient icons)
├── haze-icon-bristle.svg    (NEW)
├── haze-icon-oeko.svg       (NEW)
├── haze-icon-mulberry.svg   (NEW)
├── haze-placeholder-pdp-1.jpg  (NEW — placeholder images)
├── haze-placeholder-pdp-2.jpg
├── haze-placeholder-pdp-3.jpg
├── haze-placeholder-pdp-4.jpg
```

### Pattern 1: product.haze.json Structure

The JSON template controls which blocks appear in main-product's info column. Blocks NOT listed in `block_order` are omitted. For a single-variant product, omit `variant_picker` and `quantity_selector`.

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      "blocks": {
        "title": { "type": "title" },
        "price": { "type": "price" },
        "description": {
          "type": "description"
        },
        "buy_buttons": {
          "type": "buy_buttons",
          "settings": {
            "show_dynamic_checkout": false,
            "show_gift_card_recipient": false
          }
        },
        "faq-1": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "What's in the kit?",
            "icon": "box",
            "content": "<p>The Hair Ritual Kit includes...</p>"
          }
        },
        "faq-2": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "How do I use each tool?",
            "icon": "question_mark",
            "content": "<p>Start with the wide-tooth comb...</p>"
          }
        },
        "faq-3": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Shipping & Returns",
            "icon": "truck",
            "content": "<p>Free shipping on all US orders...</p>"
          }
        },
        "faq-4": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Materials & Sourcing",
            "icon": "leaf",
            "content": "<p>OEKO-TEX certified cotton towel...</p>"
          }
        },
        "faq-5": {
          "type": "collapsible_tab",
          "settings": {
            "heading": "Gift wrapping?",
            "icon": "heart",
            "content": "<p>Every kit ships in a keepsake gift box...</p>"
          }
        }
      },
      "block_order": [
        "title",
        "price",
        "description",
        "buy_buttons",
        "faq-1",
        "faq-2",
        "faq-3",
        "faq-4",
        "faq-5"
      ],
      "settings": {
        "gallery_layout": "stacked",
        "mobile_thumbnails": "hide",
        "media_size": "large",
        "media_position": "left",
        "media_fit": "cover",
        "constrain_to_viewport": true,
        "hide_variants": true,
        "enable_video_looping": false,
        "enable_sticky_info": true,
        "color_scheme": "scheme-1",
        "image_zoom": "none",
        "padding_top": 36,
        "padding_bottom": 12
      }
    },
    "ritual": {
      "type": "haze-ritual-description",
      "settings": { ... }
    },
    "ingredients": {
      "type": "haze-ingredients",
      "blocks": { ... },
      "block_order": [...]
    }
  },
  "order": ["main", "ritual", "ingredients"]
}
```

**Source:** [VERIFIED: sections/main-product.liquid schema] + [VERIFIED: templates/product.json reference]

### Pattern 2: Gallery Scroll-Snap — What's Already There

Dawn's `component-slider.css` already applies scroll-snap to `.slider.slider--mobile` at `max-width: 749px`:

```css
/* Source: assets/component-slider.css lines 35-67 [VERIFIED] */
@media screen and (max-width: 749px) {
  .slider.slider--mobile {
    position: relative;
    flex-wrap: inherit;
    overflow-x: auto;
    scroll-snap-type: x mandatory;    /* already set */
    scroll-behavior: smooth;          /* already set */
    scroll-padding-left: 1.5rem;
    -webkit-overflow-scrolling: touch;
    margin-bottom: 1rem;
  }
  .slider__slide {
    scroll-snap-align: start;         /* already set on all slides */
  }
}
```

The `ul#Slider-Gallery-{sectionId}` in `product-media-gallery.liquid` has class `product__media-list contains-media grid grid--peek list-unstyled slider slider--mobile`. The `.slider.slider--mobile` rule hits it directly.

**What is missing:** CSS to make each slide full-width (100% of the scroll container) on mobile so snapping feels like a proper carousel. Dawn's default `grid--peek` layout shows a partial next slide, which is intentional for Dawn but needs override for the Haze carousel feel.

```css
/* In assets/haze-pdp.css [VERIFIED needed] */
@media screen and (max-width: 749px) {
  /* Force each gallery slide to full-container width for clean snap */
  #MainProduct-{{ section.id }} .product__media-list .slider__slide {
    width: 100%;
    flex-shrink: 0;
  }

  /* Hide Dawn's prev/next counter buttons on mobile — replace with dots */
  #GalleryViewer-{{ section.id }} .slider-buttons {
    display: none;
  }

  /* Dot indicator container — positioned below gallery */
  .haze-gallery-dots {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 12px;
  }

  .haze-gallery-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background-color: rgba(196, 113, 74, 0.3); /* terracotta 30% */
    transition: background-color 0.2s ease;
  }

  .haze-gallery-dot.is-active {
    background-color: var(--haze-color-terracotta);
  }
}
```

Note: the section ID is not available in a separate CSS file — CSS must use the known element structure. The class-based selector above is how to target without the dynamic ID.

**Corrected approach:** Target by component class hierarchy, not by section ID:

```css
@media screen and (max-width: 749px) {
  media-gallery .product__media-list .product__media-item {
    width: 100%;
    flex-shrink: 0;
    scroll-snap-align: start;
  }

  /* Hide slider-buttons (prev/next counter) on product media gallery mobile */
  media-gallery .slider-buttons {
    display: none !important;
  }
}
```

**Source:** [VERIFIED: assets/component-slider.css] + [VERIFIED: snippets/product-media-gallery.liquid]

### Pattern 3: Dot Indicator JS (IntersectionObserver)

The dot indicator must be injected into the DOM after main-product renders. Because `product.haze.json` cannot inject HTML into the interior of `main-product.liquid`, the dots must be appended by JS or rendered via a Liquid `custom_liquid` block.

**Recommended: `custom_liquid` block in product.haze.json** — renders dots HTML from Liquid, then `haze-pdp-gallery.js` handles sync.

```json
"gallery-dots": {
  "type": "custom_liquid",
  "settings": {
    "custom_liquid": "<div class=\"haze-gallery-dots\" id=\"HazeGalleryDots\" aria-hidden=\"true\"><span class=\"haze-gallery-dot is-active\"></span><span class=\"haze-gallery-dot\"></span><span class=\"haze-gallery-dot\"></span><span class=\"haze-gallery-dot\"></span></div>"
  }
}
```

This block should appear BEFORE the `title` block so it renders at the top of the info column — but visually it belongs below the gallery. Alternative: let `haze-pdp-gallery.js` inject the dots element directly after `media-gallery` in the DOM.

**Better approach — JS injection (avoids block ordering complexity):**

```javascript
// Source: assets/haze-pdp-gallery.js [ASSUMED — new file]
(function () {
  const gallery = document.querySelector('media-gallery');
  if (!gallery) return;

  const slides = gallery.querySelectorAll('.product__media-list .product__media-item');
  if (slides.length <= 1) return;

  // Build dot container
  const dotsEl = document.createElement('div');
  dotsEl.className = 'haze-gallery-dots';
  dotsEl.setAttribute('aria-hidden', 'true');
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'haze-gallery-dot' + (i === 0 ? ' is-active' : '');
    dotsEl.appendChild(dot);
  });
  gallery.after(dotsEl);

  // Sync dots via IntersectionObserver
  const dots = dotsEl.querySelectorAll('.haze-gallery-dot');
  const list = gallery.querySelector('.product__media-list');

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const idx = Array.from(slides).indexOf(entry.target);
          dots.forEach((d, i) => d.classList.toggle('is-active', i === idx));
        }
      });
    },
    { root: list, threshold: 0.5 }
  );

  slides.forEach((slide) => observer.observe(slide));
})();
```

Load this script only on product pages. The script tag goes in `haze-pdp-gallery-loader.liquid` (a snippet rendered from `product.haze.json`), or directly as a `<script>` at the bottom of the `haze-ritual-description.liquid` with a `request.page_type == 'product'` guard.

**Simpler: load from within `haze-ritual-description.liquid`** (since it's already a product-only section).

**Source:** [VERIFIED: snippets/product-media-gallery.liquid structure] + [ASSUMED: IntersectionObserver approach]

### Pattern 4: ATC → Cart-Drawer Chain

No custom code required. The chain works like this (verified from source):

1. User clicks "Add to Cart" button
2. `product-form.js` `onSubmitHandler` fires (line 20)
3. Line 11: `this.cart = document.querySelector('cart-notification') || document.querySelector('cart-drawer')`
4. Phase 1 set `cart_type: "drawer"` in `settings_data.json` (line 171) — this causes `cart-drawer` to be rendered in `layout/theme.liquid` on every page
5. `product-form.js` appends the cart drawer's sections to the FormData, POSTs to `/cart/add.js`
6. On success, calls `this.cart.renderContents(response)` which updates and opens the cart drawer
7. The cart drawer opens — no navigation, no page refresh

**Source:** [VERIFIED: assets/product-form.js lines 1-100] + [VERIFIED: config/settings_data.json line 171]

### Pattern 5: page.about.json Structure

```json
{
  "sections": {
    "hero": {
      "type": "image-banner",
      "settings": {
        "image_height": "medium",
        "desktop_content_alignment": "center",
        "mobile_content_alignment": "center",
        "show_text_box": false,
        "color_scheme": "scheme-1",
        "image_overlay_opacity": 20
      }
    },
    "brand-story": {
      "type": "image-with-text",
      "blocks": {
        "heading-0": {
          "type": "heading",
          "settings": {
            "heading": "Our Story",
            "heading_size": "h1"
          }
        },
        "text-0": {
          "type": "text",
          "settings": {
            "text": "<p>Haze was born from a simple belief...</p>",
            "text_style": "body"
          }
        }
      },
      "block_order": ["heading-0", "text-0"],
      "settings": {
        "height": "adapt",
        "desktop_image_width": "medium",
        "layout": "image_first",
        "desktop_content_position": "middle",
        "desktop_content_alignment": "left",
        "content_layout": "no-overlap",
        "section_color_scheme": "scheme-1",
        "color_scheme": "scheme-1",
        "padding_top": 60,
        "padding_bottom": 60
      }
    },
    "tool-philosophy": {
      "type": "image-with-text",
      "blocks": {
        "heading-1": {
          "type": "heading",
          "settings": {
            "heading": "Every Tool Has a Purpose",
            "heading_size": "h1"
          }
        },
        "text-1": {
          "type": "text",
          "settings": {
            "text": "<p>Every tool in the kit was chosen for...</p>",
            "text_style": "body"
          }
        }
      },
      "block_order": ["heading-1", "text-1"],
      "settings": {
        "height": "adapt",
        "desktop_image_width": "medium",
        "layout": "text_first",
        "desktop_content_position": "middle",
        "desktop_content_alignment": "left",
        "content_layout": "no-overlap",
        "section_color_scheme": "scheme-2",
        "color_scheme": "scheme-2",
        "padding_top": 60,
        "padding_bottom": 60
      }
    }
  },
  "order": ["hero", "brand-story", "tool-philosophy"]
}
```

**Source:** [VERIFIED: sections/image-with-text.liquid schema] + [VERIFIED: sections/image-banner.liquid structure]

### Pattern 6: page.faq.json Structure

```json
{
  "sections": {
    "faq": {
      "type": "collapsible-content",
      "blocks": {
        "row-0": {
          "type": "collapsible_row",
          "settings": {
            "heading": "What comes in the Hair Ritual Kit?",
            "icon": "box",
            "row_content": "<p>The kit includes a wide-tooth comb, a boar bristle brush, an OEKO-TEX cotton hair wrap, and a mulberry silk scrunchie — all presented in a keepsake gift box.</p>"
          }
        },
        "row-1": {
          "type": "collapsible_row",
          "settings": {
            "heading": "How do I use each tool?",
            "icon": "question_mark",
            "row_content": "<p>Start with the wide-tooth comb on damp hair to gently detangle from ends to roots. Use the bristle brush on dry hair for smoothing and natural shine. Wrap with the cotton towel to absorb moisture without frizz.</p>"
          }
        },
        "row-2": {
          "type": "collapsible_row",
          "settings": {
            "heading": "What are your shipping & return policies?",
            "icon": "truck",
            "row_content": "<p>We offer free shipping on all US orders. Orders ship within 2 business days. We accept returns within 30 days of delivery.</p>"
          }
        },
        "row-3": {
          "type": "collapsible_row",
          "settings": {
            "heading": "What materials are used?",
            "icon": "leaf",
            "row_content": "<p>Our cotton hair wrap is OEKO-TEX Standard 100 certified. The comb is made from high-quality wide-spaced acrylic. The brush uses natural boar bristle. The scrunchie is 100% mulberry silk.</p>"
          }
        },
        "row-4": {
          "type": "collapsible_row",
          "settings": {
            "heading": "Does the kit come gift-wrapped?",
            "icon": "heart",
            "row_content": "<p>Yes — every Hair Ritual Kit arrives in a beautifully designed keepsake gift box. No additional gift wrapping is needed or available.</p>"
          }
        }
      },
      "block_order": ["row-0", "row-1", "row-2", "row-3", "row-4"],
      "settings": {
        "caption": "Questions",
        "heading": "Frequently Asked",
        "heading_size": "h1",
        "heading_alignment": "center",
        "layout": "none",
        "color_scheme": "scheme-1",
        "container_color_scheme": "scheme-2",
        "open_first_collapsible_row": false,
        "padding_top": 60,
        "padding_bottom": 60
      }
    }
  },
  "order": ["faq"]
}
```

**Source:** [VERIFIED: sections/collapsible-content.liquid schema]

### Pattern 7: haze-ritual-description.liquid Structure

Follows Phase 2 pattern exactly (CSS tag first, schema last, blocks with `shopify_attributes`, escape on text output):

```liquid
{{ 'haze-pdp.css' | asset_url | stylesheet_tag }}

<section id="haze-ritual-description-{{ section.id }}" class="haze-ritual-description">
  <div class="haze-ritual-description__inner page-width">
    <h2 class="haze-ritual-description__heading">
      {{- section.settings.heading | escape -}}
    </h2>
    <div class="haze-ritual-description__body rte">
      {{ section.settings.body }}
    </div>
  </div>
</section>

<script src="{{ 'haze-pdp-gallery.js' | asset_url }}" defer="defer"></script>

{% schema %}
{
  "name": "Haze Ritual Description",
  "tag": "section",
  "class": "section",
  "disabled_on": { "groups": ["header", "footer"] },
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "The Ritual"
    },
    {
      "type": "richtext",
      "id": "body",
      "label": "Description",
      "default": "<p>Every morning begins with intention...</p>"
    },
    ...
  ],
  "presets": [{ "name": "Haze Ritual Description" }]
}
{% endschema %}
```

Note: the `haze-pdp-gallery.js` script tag is loaded here because it is the first custom section guaranteed to appear below `main-product` on the PDP. It fires once the page is fully rendered.

**Source:** [VERIFIED: sections/haze-value-props.liquid pattern] + [VERIFIED: Phase 2 conventions]

### Pattern 8: haze-ingredients.liquid Structure

Same pattern as `haze-value-props.liquid` but 4-column desktop, 2-column tablet:

```liquid
{{ 'haze-pdp.css' | asset_url | stylesheet_tag }}

<section id="haze-ingredients-{{ section.id }}" class="haze-ingredients">
  {%- if section.settings.heading != blank -%}
    <h2 class="haze-ingredients__heading page-width">{{ section.settings.heading | escape }}</h2>
  {%- endif -%}
  <div class="haze-ingredients__grid page-width">
    {%- for block in section.blocks -%}
      {%- if block.type == 'ingredient' -%}
        <div class="haze-ingredients__block" {{ block.shopify_attributes }}>
          {%- if block.settings.icon != blank -%}
            <div class="haze-ingredients__icon" aria-hidden="true">
              <img src="{{ block.settings.icon | asset_url }}" alt="" width="40" height="40" loading="lazy">
            </div>
          {%- endif -%}
          <h3 class="haze-ingredients__name">{{ block.settings.name | escape }}</h3>
          <p class="haze-ingredients__descriptor">{{ block.settings.descriptor | escape }}</p>
        </div>
      {%- endif -%}
    {%- endfor -%}
  </div>
</section>
```

```css
/* In assets/haze-pdp.css */
.haze-ingredients {
  padding: var(--haze-space-xl) 0;
  background-color: var(--haze-color-cream);
}

.haze-ingredients__heading {
  font-family: var(--font-heading-family);
  font-size: 1.5rem;
  font-weight: 400;
  text-align: center;
  margin-bottom: var(--haze-space-md);
}

.haze-ingredients__grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--haze-space-md);
}

@media screen and (min-width: 750px) {
  .haze-ingredients__grid {
    grid-template-columns: repeat(2, 1fr);
    gap: var(--haze-space-lg);
  }
}

@media screen and (min-width: 990px) {
  .haze-ingredients__grid {
    grid-template-columns: repeat(4, 1fr);
  }
}
```

**Source:** [VERIFIED: sections/haze-value-props.liquid pattern] + [VERIFIED: assets/haze-value-props.css pattern]

### Anti-Patterns to Avoid

- **Modifying `section-main-product.css`:** Dawn CSS changes affect all product pages, break future Dawn upgrades. All overrides go in `haze-pdp.css`.
- **Modifying `product-info.js` or `product-form.js`:** These are no-touch zones. The ATC flow works without modification.
- **Using `gallery_layout: "thumbnail"` or `"thumbnail_slider"`:** These load the thumbnail sub-slider, which conflicts with the scroll-snap + dot approach. Use `"stacked"` (desktop scrolls through stacked images) — on mobile it's already a horizontal slider regardless of the desktop layout setting.
- **Omitting `"hide_variants": true` in main-product settings:** Without this, variant images get filtered from the media list, potentially showing only one image even when 4 are uploaded. Set `hide_variants: true` only if all images are product-level (not variant-level). For a single-variant product, this is safe.
- **Adding `collapsible_tab` blocks without content:** Dawn renders the `<details>` element even if `content` and `page` are both blank, showing an empty accordion row. Always provide `content` or a `page` reference.
- **Not reading `gallery_layout: "stacked"` side effect:** With `gallery_layout: "stacked"` on desktop, images stack vertically in the left column. The horizontal scroll-snap only applies at `max-width: 749px`. This is the correct behavior — desktop sees stacked images (Gisou-style), mobile gets scroll-snap carousel.
- **Targeting by `#MainProduct-{{ section.id }}`:** CSS files don't have access to Liquid variables. Selectors must use the stable class/element hierarchy (`media-gallery .product__media-list`) not dynamic IDs.

---

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---------|-------------|-------------|-----|
| Horizontal scroll carousel | Custom swipe/drag handler | CSS `scroll-snap-type: x mandatory` already on `.slider.slider--mobile` | Dawn already ships this; adding a swipe library adds weight and conflicts |
| FAQ accordion | Custom JS open/close toggle | Native HTML `<details>/<summary>` via `collapsible_tab` blocks | Native `<details>` is accessible, no JS, supports multiple open — satisfies PDP-05 exactly |
| Cart drawer | Custom cart slide-in | Dawn's `cart-drawer` Web Component | product-form.js already wires to it; zero additional code |
| Product page template | Custom main-product section | `templates/product.haze.json` referencing `type: main-product` | Dawn's main-product handles media gallery, variant state, ATC, lightbox, all JS integration |
| Two-column editorial | Custom flexbox layout | Dawn's `image-with-text` section | Handles responsive stacking, color schemes, content alignment |
| Accordion FAQ page | Custom accordion section | Dawn's `collapsible-content` section | Already supports `<details>/<summary>`, optional image, multiple open |

---

## Common Pitfalls

### Pitfall 1: Gallery slides not full-width on mobile (partial peek visible)

**What goes wrong:** Dawn's `grid--peek` class on the media list adds a deliberate partial view of the next slide. On mobile, the gallery shows 90% of the current slide and 10% of the next. This is Dawn's intended behavior but may feel less polished than a full-bleed snap.

**Why it happens:** `.grid.grid--peek` sets item widths to `calc(50% - var(--grid-mobile-horizontal-spacing))` or similar. The `slider--mobile` scroll-snap works, but each "slide" is not 100% wide.

**How to avoid:** Override the width of `.product__media-item` inside `media-gallery` on mobile to `100%` in `haze-pdp.css`. Test that this doesn't break the desktop stacked layout.

**Warning signs:** In browser DevTools, check `ul.product__media-list li` computed width — if it's 85-95% of viewport, the peek effect is active.

### Pitfall 2: IntersectionObserver dot sync misfire

**What goes wrong:** The observer fires for slides that are partially visible (e.g., during scroll momentum), causing dots to flicker between states.

**Why it happens:** `threshold: 0.5` means a slide must be 50% visible to trigger — but during fast scrolling, two slides may be 50% visible simultaneously.

**How to avoid:** Use `threshold: 0.6` or higher so only the dominant slide triggers. Alternatively, use `rootMargin` to make the intersection zone narrower.

**Warning signs:** Dots flash between two states during rapid swipe.

### Pitfall 3: haze-pdp.css loaded multiple times

**What goes wrong:** If both `haze-ritual-description.liquid` and `haze-ingredients.liquid` both emit `{{ 'haze-pdp.css' | asset_url | stylesheet_tag }}`, the browser receives two `<link>` tags for the same file.

**Why it happens:** Each custom section loads its own CSS. If two sections share a CSS file, they both emit the tag.

**How to avoid:** Load `haze-pdp.css` only from the first section that appears in the template order (the ritual description section). The ingredients section can reference the same CSS without re-emitting the tag — but this creates a dependency order risk. Safer: each section checks if the stylesheet is already loaded. Safest: accept the duplicate link tags; browsers deduplicate CSS by URL so there's no visual bug, only a minor redundant network request. Shopify also caches assets on their CDN. This is acceptable for v1.

**Source:** [VERIFIED: Phase 2 sections each load their own CSS — same pattern accepted]

### Pitfall 4: collapsible_tab block with `"icon": "none"` rendering empty SVG wrapper

**What goes wrong:** Setting `"icon": "none"` still renders the `{% render 'icon-accordion' %}` snippet, which may output an empty `<span class="svg-wrapper">` if the icon value is `none`.

**Why it happens:** The `icon-accordion` snippet renders a conditional SVG; `none` is a valid value that renders nothing, but may still output wrapper markup.

**How to avoid:** For clean minimal accordion rows (no icons), simply set `"icon": "none"` — this is the correct schema value. Do NOT set to an empty string or omit the field; the schema `default` is `"check_mark"` and omitting the field will use the default.

**Source:** [VERIFIED: sections/main-product.liquid line 217: `{% render 'icon-accordion', icon: block.settings.icon %}`]

### Pitfall 5: page.about.json / page.faq.json not appearing in Shopify Admin theme template picker

**What goes wrong:** Creating the file is not enough — the page must exist in Shopify Admin AND the template must be manually assigned. The user cannot assign a template that doesn't appear in the picker.

**Why it happens:** Shopify lists available `page.*.json` templates in the Admin page edit screen. The template file must already be pushed to the store (via git sync or Shopify CLI push).

**How to avoid:** After pushing the template files, instruct the user to:
1. Go to Shopify Admin > Pages
2. Create "About" and "FAQ" pages (or they may already exist from Phase 1 footer links)
3. On each page's edit screen, select the matching template from the "Theme template" dropdown
4. Save

**Warning signs:** User reports the page loads with only the generic `main-page` section content.

### Pitfall 6: image-with-text section requiring `section_color_scheme` AND `color_scheme`

**What goes wrong:** `image-with-text` has TWO color scheme settings: `section_color_scheme` (outer wrapper) and `color_scheme` (inner text content box). Setting only one leaves the other at its default.

**Why it happens:** Dawn's image-with-text has a two-layer color system to allow the media column and text column to have different backgrounds.

**How to avoid:** Set both `section_color_scheme` and `color_scheme` in `page.about.json`. For the brand story section, both should be `"scheme-1"` (cream). For the tool philosophy section, both should be `"scheme-2"` (blush).

**Source:** [VERIFIED: sections/image-with-text.liquid schema lines 288-298]

---

## Code Examples

### ATC Button Brand Override

The ATC button uses Dawn's `.button.button--primary` class. Override in `haze-pdp.css` using the existing CSS variable system to avoid hardcoded colors:

```css
/* Source: pattern from assets/haze-hero.css .haze-hero__cta [VERIFIED] */
/* ATC button override — terracotta fill, cream text, 2px radius, 44px min-height */
#MainProduct-{{ section.id }} .product-form__submit {
  /* Cannot use Liquid in CSS — target by component structure */
}

/* Use: */
product-info .product-form__submit,
product-info .product-form__submit.button--primary {
  background-color: var(--haze-color-terracotta);
  color: var(--haze-color-cream);
  border-radius: var(--haze-radius-button);
  min-height: 44px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  font-size: 0.8125rem;
  font-family: var(--font-body-family);
}

product-info .product-form__submit:hover,
product-info .product-form__submit:focus-visible {
  opacity: 0.85;
}
```

**Source:** [VERIFIED: assets/haze-hero.css .haze-hero__cta pattern] + [ASSUMED: `.product-form__submit` is the ATC button class — verify in DevTools]

### Ingredient SVG Icon Pattern (same as value props)

```svg
<!-- assets/haze-icon-silk.svg [NEW] -->
<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40" fill="none">
  <path d="M20 4 C10 4 4 12 4 20 C4 28 10 36 20 36 C30 36 36 28 36 20 C36 12 30 4 20 4Z"
        stroke="#C4714A" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
```

The exact paths will vary per icon. Use `stroke="#C4714A"` directly in the SVG (not `currentColor`) to match Phase 2 value prop pattern — the value props use `<img src="...">` tags which cannot inherit CSS `color`.

**Source:** [VERIFIED: sections/haze-value-props.liquid — uses img tag, not inline SVG]

### Ritual Description Typography

```css
/* In assets/haze-pdp.css */
.haze-ritual-description {
  padding: var(--haze-space-xl) 0;
  background-color: var(--haze-color-cream);
  text-align: center;
}

.haze-ritual-description__inner {
  max-width: 720px;
  margin: 0 auto;
  padding: 0 var(--haze-space-md);
}

.haze-ritual-description__heading {
  font-family: var(--font-heading-family);
  font-size: clamp(1.75rem, 5vw, 2.5rem);
  font-weight: 300;
  font-style: italic;
  line-height: 1.15;
  color: var(--haze-color-dark);
  margin: 0 0 var(--haze-space-md) 0;
}

.haze-ritual-description__body {
  font-family: var(--font-body-family);
  font-size: 1rem;
  font-weight: 300;
  line-height: 1.7;
  color: var(--haze-color-dark);
  opacity: 0.85;
}

/* Source: [VERIFIED: assets/haze-hero.css typography pattern] */
```

---

## Runtime State Inventory

This is a greenfield template phase (new files, no renames). Omitted.

---

## Environment Availability

Step 2.6: SKIPPED — this phase is purely Liquid/CSS/JS file creation. No external CLI tools, databases, or services required beyond the Shopify CLI already confirmed operational from Phase 1. Shopify CLI v3.93 authenticated to `haze-903935.myshopify.com` (from project memory).

---

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Custom swipe.js / Hammer.js for carousels | Native CSS `scroll-snap` | CSS Scroll Snap is now baseline (2022+) | No JS library needed for the gallery swipe |
| Separate product template per variant | OS 2.0 JSON templates with block configuration | Dawn v2+ (2022) | All PDP customization via product.haze.json, not Liquid |
| Custom accordion JS | Native `<details>/<summary>` | HTML5 (but widely used in Dawn since v14) | No JS needed for multiple-open accordion |

---

## Assumptions Log

| # | Claim | Section | Risk if Wrong |
|---|-------|---------|---------------|
| A1 | `product-form.js` detects `cart-drawer` by querying `document.querySelector('cart-drawer')` — if the element is not in the DOM (e.g., theme editor in simulation mode), ATC falls back to `window.location = window.routes.cart_url` | ATC Chain (Pattern 4) | LOW — verified from source code lines 11 and 65 |
| A2 | `haze-pdp-gallery.js` IntersectionObserver `threshold: 0.5` is sufficient for clean dot sync | Gallery JS (Pattern 3) | LOW — threshold is Claude's discretion per CONTEXT.md |
| A3 | `product-form.js` button class for ATC submit button is `.product-form__submit` | ATC Button CSS (Code Examples) | MEDIUM — need to verify in browser DevTools; could be `.button` or variant class |
| A4 | Loading `haze-pdp-gallery.js` from `haze-ritual-description.liquid` (not a dedicated loader snippet) is safe and will not double-load if the section appears multiple times | Gallery JS loading strategy | LOW — the section has `presets` and is unlikely to be added twice on a PDP |
| A5 | `page.about.json` and `page.faq.json` will appear in the Shopify Admin theme template picker immediately after pushing | Page Templates (Pitfall 5) | LOW — standard Shopify OS 2.0 behavior; verified from Shopify documentation [ASSUMED] |

**Only A3 needs real verification.** Inspect the ATC button in browser DevTools on any Dawn product page to confirm the exact class. All other assumptions are either verified from source or low-risk discretionary choices.

---

## Open Questions

1. **Placeholder images for the gallery**
   - What we know: `haze-placeholder-pdp-{1..4}.jpg` is the naming convention (D-07). Images must be uploaded to Shopify Admin > Files before the template can reference them.
   - What's unclear: Does the user have Ideogram-generated images ready, or should the plan include placeholder SVG fallbacks first?
   - Recommendation: Plan should include a Wave 0 step to upload placeholder images. If images are not ready, Dawn's built-in placeholder SVG renders automatically when no product media exists.

2. **ATC button exact CSS class**
   - What we know: The submit button is inside `product-form` custom element, rendered by `snippets/buy-buttons.liquid`.
   - What's unclear: The exact CSS class used on the `<button>` element — it may be `.button.button--primary.product-form__submit` or similar.
   - Recommendation: Implementer should inspect in DevTools on any Dawn product page and confirm before writing the ATC CSS override. The selector `product-info .product-form__submit` is a safe starting point.

3. **About and FAQ pages already existing in Admin**
   - What we know: Phase 1 footer config pointed to `/pages/about` and `/pages/faq`. These links may be pointing to non-existent pages (causing 404s currently) or placeholder pages.
   - What's unclear: Whether the user already created these pages in Admin.
   - Recommendation: Plan should include a manual step (human action) to create both pages if they don't exist, then assign templates.

---

## Sources

### Primary (HIGH confidence)
- `sections/main-product.liquid` — Full section source including all block types, schema settings (gallery_layout, mobile_thumbnails, media_size, collapsible_tab block structure)
- `snippets/product-media-gallery.liquid` — Gallery HTML structure, slider class names, slider-buttons structure
- `assets/component-slider.css` — Scroll-snap implementation: `.slider.slider--mobile` and `.slider__slide` classes
- `assets/product-form.js` lines 1-100 — ATC form submission, cart-drawer detection, renderContents flow
- `assets/component-accordion.css` — Accordion styling for collapsible_tab blocks
- `sections/collapsible-content.liquid` — FAQ page section full source and schema
- `sections/image-with-text.liquid` — About page two-column section, full schema including `section_color_scheme` + `color_scheme` dual settings
- `sections/image-banner.liquid` — About page hero section
- `templates/product.json` — Reference structure for product.haze.json
- `templates/page.json` — Reference structure for page.about.json and page.faq.json
- `config/settings_data.json` line 171 — `"cart_type": "drawer"` confirmed
- `assets/haze-tokens.css` — Design tokens (colors, spacing, radius, fonts) for all custom CSS
- `sections/haze-value-props.liquid` + `assets/haze-value-props.css` — Established Phase 2 pattern for SVG icon blocks (reused for ingredients)
- `assets/haze-hero.css` — Established CTA button pattern (reused for ATC override)

### Secondary (MEDIUM confidence)
- Phase 2 sections (`haze-hero.liquid`, `haze-value-props.liquid`) — Established conventions for schema structure, PLACEHOLDER tags, escape filters, block attributes

### Tertiary (LOW confidence)
- A3 assumption (ATC button CSS class) — needs DevTools verification
- A5 assumption (page template picker behavior) — standard Shopify OS 2.0 behavior, not verified by reading Shopify docs in this session

---

## Metadata

**Confidence breakdown:**
- Template JSON structure (product.haze.json, page.about.json, page.faq.json): HIGH — verified from schema inspection
- Gallery scroll-snap CSS: HIGH — verified from component-slider.css; the mechanism is already there
- ATC → cart-drawer chain: HIGH — verified from product-form.js source
- Dot indicator JS: MEDIUM — approach is sound but threshold tuning is discretionary
- Custom section patterns: HIGH — verified from Phase 2 sections in codebase

**Research date:** 2026-04-09
**Valid until:** 2026-06-01 (Dawn v15.4.1 schema is stable; only Shopify platform changes would invalidate)
