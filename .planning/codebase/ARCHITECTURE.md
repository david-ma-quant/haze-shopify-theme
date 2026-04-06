# Architecture

**Analysis Date:** 2026-04-05

## Pattern Overview

**Overall:** Server-Rendered Component Architecture with Progressive Enhancement

**Key Characteristics:**
- HTML-first approach: Server renders all page markup using Liquid templating language
- JavaScript as progressive enhancement: No JavaScript required for core functionality
- Evergreen web standards: Leverages modern browser capabilities with graceful degradation
- Client-side interactivity via custom elements: Web Components pattern for dynamic behavior
- Pub/Sub event system for cross-module communication and state coordination
- Lazy-loaded assets: Scripts and stylesheets load on-demand per section
- CSS Grid and Flexbox: Modern layout primitives, no framework dependencies

## Layers

**Presentation Layer (Templates):**
- Purpose: Define page layouts and composition for different page types
- Location: `templates/` (page templates), `templates/customers/` (customer account pages)
- Contains: JSON configuration defining section order and initial settings
- Depends on: Sections (for content) and Liquid filters/tags (for rendering)
- Used by: Shopify storefront engine to render server-side HTML
- Examples: `templates/index.json` (homepage), `templates/product.json` (product page), `templates/collection.json` (collection page)

**Section Layer (Composable Sections):**
- Purpose: Reusable, themeable content blocks with configurable settings
- Location: `sections/` (56 section files)
- Contains: Liquid markup, CSS styling (inline and linked), JavaScript orchestration
- Depends on: Snippets (for partial rendering), assets (CSS/JS)
- Used by: Templates to compose page layouts dynamically
- Examples: `sections/featured-product.liquid`, `sections/featured-collection.liquid`, `sections/collage.liquid`
- Key pattern: Each section is self-contained with its own styles and scripts loaded via `{{ 'file.css' | asset_url | stylesheet_tag }}`

**Snippet Layer (Reusable Components):**
- Purpose: DRY content blocks rendered within sections or other snippets
- Location: `snippets/` (39 snippet files)
- Contains: Parameterized Liquid markup with inline documentation
- Depends on: Assets (CSS/JS), other snippets via `{% render 'snippet-name' %}`
- Used by: Sections and other snippets
- Examples: `snippets/card-product.liquid`, `snippets/cart-drawer.liquid`, `snippets/facets.liquid`
- Pattern: Parameters documented in comment block (accepts array, object, or scalar values)

**Layout Layer (Master Template):**
- Purpose: Define HTML document structure, head tags, global scripts, and color schemes
- Location: `layout/theme.liquid` (main), `layout/password.liquid` (password-protected stores)
- Contains: Document structure, font loading, CSS variable generation, global script injection
- Depends on: Settings from `config/settings_schema.json`
- Used by: Shopify rendering engine wraps all page content
- Key responsibility: Dynamic color scheme CSS generation based on `settings.color_schemes`

**Asset Layer (Styling & Interactivity):**
- Purpose: CSS styling and JavaScript behavior
- Location: `assets/` (186 files: CSS, JS)
- Contains:
  - **Base styles**: `base.css` (global utilities, layout primitives, typography)
  - **Component styles**: `component-*.css` (scoped styling for sections/snippets)
  - **Section styles**: `section-*.css` (section-specific layout and spacing)
  - **JavaScript**: Utility modules, custom element classes, event handlers
- Depends on: Nothing (independent layer)
- Used by: Sections and snippets via `{{ 'file.css' | asset_url | stylesheet_tag }}` or `<script src="{{ 'file.js' | asset_url }}" defer></script>`

**Configuration Layer:**
- Purpose: Define global theme settings, color schemes, typography, and localization
- Location: `config/settings_schema.json` (40KB schema), `config/settings_data.json` (current values)
- Contains: Color schemes, typography choices, logo/favicon, theme metadata
- Depends on: Nothing
- Used by: Layout layer, sections, and Shopify theme editor
- Pattern: Settings accessed via `settings.property_name` in Liquid; schemas define editor UI

**Localization Layer:**
- Purpose: Translate content and UI strings to 50+ languages
- Location: `locales/` (50+ JSON files)
- Contains: Language-specific translations organized by module (general, accessibility, newsletter, etc.)
- Depends on: Nothing
- Used by: All layers via Liquid `t` filter: `{{ 'key.path' | t }}`
- Pattern: `en.default.json` defines schema structure; locales like `es.json` contain translations

## Data Flow

**Page Render (Server-Side):**

1. HTTP request arrives at Shopify server
2. Shopify determines template file (index.json, product.json, etc.)
3. Template file references sections to compose
4. Each section references snippets for sub-components
5. Liquid engine renders all markup with data from:
   - Global settings (`settings.*`)
   - Page context (product, collection, article, customer, etc.)
   - Localization strings (`t:key.path` filters)
6. HTML is fully rendered server-side, sent to browser
7. Browser parses HTML, loads linked CSS/JS assets
8. JavaScript initializes and attaches event listeners

**State Management:**

- **Server State**: Product data, collection data, customer info - all rendered into HTML by Liquid
- **Client State**: DOM state, form state, cart state maintained by custom elements
- **Cross-Component Communication**: Pub/Sub pattern via `pubsub.js` module
  - Events: `cartUpdate`, `quantityUpdate`, `optionValueSelectionChange`, `variantChange`, `cartError`
  - Subscribers: Different modules listen to events and update UI
  - Example: Product form publishes `variantChange`, media gallery subscribes and updates displayed image

**Dynamic Updates (Fetch → Render):**

- Cart operations: JavaScript collects form data, POSTs to `/cart/add.js`, receives JSON, updates cart drawer via DOM manipulation
- Faceted search: Click on filter → JavaScript fetches filtered collection → `HTMLUpdateUtility.viewTransition()` swaps HTML with animation
- Quick add: Click button → fetch product → render via snippet → insert into page

## Key Abstractions

**Custom Elements (Web Components):**
- Purpose: Encapsulate interactive behaviors and state management
- Examples: `<product-info>`, `<cart-drawer>`, `<header-drawer>`, `<details-modal>`, `<menu-drawer>`
- Pattern: Extend HTMLElement, implement connectedCallback() for initialization, use data attributes for configuration
- Location: Either inline in sections (simple) or as separate JS files in assets (complex)

**Section ID Utilities (SectionId class):**
- Purpose: Manage qualified section IDs generated by Shopify editor
- Location: `assets/global.js`
- Pattern: Parse IDs like `template--12345__main` into template ID and section name for event scoping
- Used by: Theme editor integration and style scoping

**HTML Update Utility (HTMLUpdateUtility class):**
- Purpose: Swap page content with animation/transition
- Location: `assets/global.js`
- Methods:
  - `viewTransition()`: Double-buffer approach to swap old HTML with new
  - `setInnerHTML()`: Re-inject scripts after innerHTML assignment (which normally disables script execution)
- Used by: Faceted search, pagination, any page update

**Focus Management (trapFocus/removeTrapFocus functions):**
- Purpose: Manage keyboard navigation within modals and drawers
- Location: `assets/global.js`
- Pattern: Capture Tab/Shift+Tab, loop focus between first and last focusable elements
- Used by: Modal and drawer components for accessibility

## Entry Points

**Server-Side Entry (for each page type):**
- Location: `layout/theme.liquid`
- Triggers: Any HTTP request to store
- Responsibilities:
  - Load `constants.js` and `pubsub.js` globally
  - Generate dynamic color scheme CSS
  - Load typography (fonts from Shopify CDN)
  - Inject global scripts (details-disclosure.js, search-form.js, animations.js)
  - Render template content (via Shopify engine)

**Client-Side Entry (initialization):**
- Location: `assets/global.js`
- Triggers: Page load
- Responsibilities:
  - Trap focus in details/disclosure elements
  - Manage summary/details accessibility
  - Export utility functions for sections to use
  - Initialize global event listeners

**Section Entry (per section):**
- Pattern: Each section loads its own JavaScript via `<script>` tag
- Example: `sections/featured-product.liquid` loads `{{ 'product-info.js' | asset_url }}`
- Responsibility: Sections initialize their custom elements and bind events

## Error Handling

**Strategy:** Progressive enhancement with fallbacks

**Patterns:**

- **JavaScript failures**: Core functionality (add to cart, checkout) works without JS; JS adds enhancements (live cart drawer, quick add)
- **CSS failures**: Mobile-first responsive design means missing CSS still produces functional layout
- **Image failures**: Lazy loading with fallback to static image; images have alt text for accessibility
- **Network failures**: Graceful degradation; forms still submit, no live preview without AJAX
- **Variant selection**: If variant API fails, page refresh fallback ensures product can still be added

## Cross-Cutting Concerns

**Logging:** No centralized logging in production. Development: Use `console.log()` with descriptive messages.

**Validation:**
- Server-side: Liquid performs quantity/availability validation before rendering "add to cart" button
- Client-side: JavaScript validates form data before AJAX submission (e.g., quantity > 0)
- Pattern: Never trust client input; always validate on server

**Authentication:**
- Pattern: Shopify handles customer authentication (login/register pages via template)
- Customer pages rendered server-side with customer context: `templates/customers/*`
- Page content checks `customer` Liquid variable to show personalized data

**Performance Optimization:**
- Defer non-critical scripts: `<script src="..." defer></script>`
- Lazy load images: `loading="lazy"` attribute on img tags
- Lazy load CSS: `media="print" onload="this.media='all'"` pattern (seen in model-viewer stylesheet loading)
- Code splitting: Assets loaded per-section, not monolithic bundle
- Minification: Shopify CDN minifies assets automatically

---

*Architecture analysis: 2026-04-05*
