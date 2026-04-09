<!-- GSD:project-start source:PROJECT.md -->
## Project

**Haze DTC Shopify Store**

A complete Shopify DTC store for Haze, a hair care brand selling the Hair Ritual Kit ($55–65) to US women aged 21–35. Built on a Dawn v15.4.1 fork, the store converts TikTok traffic to purchases with a "that girl" / wellness ritual aesthetic at Gisou-level visual quality. AI-generated placeholder images allow the build to complete before product samples arrive.

**Core Value:** TikTok visitors land on haze.hair and can purchase the Hair Ritual Kit in under 60 seconds — mobile-first, single-SKU, zero friction.

### Constraints

- **Tech stack:** Dawn v15.4.1 + Liquid only — no React, no build tools, no third-party apps
- **File convention:** Custom files prefixed `haze-` in `assets/`, `sections/`, `snippets/`; never modify Dawn's own section files — **exception:** CSS-only `{%- stylesheet -%}` blocks may be appended to Dawn sections when no alternative exists (e.g., `header.liquid` nav overrides per D-12)
- **Color system:** Colors set via Shopify Customize panel → `settings_data.json`; never hardcode hex in CSS — **exception:** `haze-tokens.css` defines brand color aliases as CSS custom properties for use in custom Haze sections; `settings_data.json` remains the authoritative source
- **Image strategy:** All placeholders named `haze-placeholder-<slot>.jpg` with `{%- comment -%} PLACEHOLDER` tag for grep-findability
- **No-touch zones:** `layout/checkout.liquid`, Dawn's `cart.js`, `global.js`, and all Dawn JS modules
<!-- GSD:project-end -->

<!-- GSD:stack-start source:codebase/STACK.md -->
## Technology Stack

## Languages
- Liquid v1 - Shopify templating language for theme markup
- JavaScript (ES6+) - Client-side interactivity and dynamic features
- CSS3 - Styling and animations
- YAML - Configuration and translation management
- JSON - Configuration schemas and settings data
## Runtime
- Shopify Theme Platform (cloud-hosted)
- Browser-based (no server-side Node.js)
- Evergreen web browsers with progressive enhancement for older browsers
- npm (for development tooling)
- Shopify CLI (primary development interface)
## Frameworks
- Shopify Dawn v15.4.1 (base theme framework)
- Web Components (custom elements via `customElements.define()`)
- Web APIs (Fetch, DOM APIs, local storage)
- Shopify CLI - Theme development server and deployment
- Theme Check - Linting and validation (`shopify/theme-check-action@v2`)
- Prettier - Code formatting (configured in `.prettierrc.json`)
- GitHub Actions
## Key Dependencies
- Shopify Liquid API - Server-side templating for rendering
- Shopify.js objects - Client-side API (e.g., `Shopify.designMode`)
- Shopify Web Components (built-in)
- Google Fonts via `fonts.shopifycdn.com` - Custom font loading
- Shopify CDN - Asset serving (`asset_url` filter)
- Shopify Shop API (implicit) - Product, cart, customer data
## Configuration
- `.env` file present (contains Shopify store credentials)
- GitHub Secrets used for CI/CD:
- `.prettierrc.json` - Print width 120, single quotes with Liquid override
- `.theme-check.yml` - Theme validation config (MatchingTranslations, TemplateLength disabled)
- `translation.yml` - i18n configuration (30+ language targets)
## Platform Requirements
- Shopify CLI (required)
- Git (version control)
- VS Code (recommended, with Theme Check extension)
- Node.js (for build tools)
- Shopify Online Store 2.0 compatible store
- Latest browser support via progressive enhancement
<!-- GSD:stack-end -->

<!-- GSD:conventions-start source:CONVENTIONS.md -->
## Conventions

## Naming Patterns
- JavaScript files: `kebab-case.js` - Examples: `product-form.js`, `cart-notification.js`, `quick-order-list.js`
- CSS files: `component-` or `section-` prefix with `kebab-case.css` - Examples: `component-accordion.css`, `section-main-product.css`
- Liquid files: `kebab-case.liquid` - Examples: `multirow.liquid`, `predictive-search.liquid`
- camelCase for regular functions - Example: `onSubmitHandler()`, `initializeScrollAnimationTrigger()`
- PascalCase for class constructors and Web Components - Examples: `ProductForm`, `CartItems`, `QuickOrderList`
- Private class methods use `#` prefix - Example: `static #separator`
- camelCase for local variables and properties - Examples: `formData`, `submitButton`, `cartUpdateUnsubscriber`
- UPPER_SNAKE_CASE for constants - Examples: `ON_CHANGE_DEBOUNCE_TIMER`, `SCROLL_ANIMATION_TRIGGER_CLASSNAME`
- Event names in camelCase with object format - Example: `PUB_SUB_EVENTS = { cartUpdate: 'cart-update' }`
- Not TypeScript - Plain JavaScript
- HTML Element subclasses follow PascalCase - Examples: `ModalDialog`, `QuantityInput`, `HeaderDrawer`
## Code Style
- Prettier configured with printWidth: 120 characters
- Single quotes for JavaScript (`'string'`)
- Double quotes for Liquid and HTML attributes
- Format on save: enabled for JavaScript and Liquid
- Prettier VSCode extension: `esbenp.prettier-vscode`
- Theme Check via Shopify extension: `Shopify.theme-check-vscode`
- Prettier config: `/.prettierrc.json`
## Import Organization
- None used - paths are relative or use document global references
- Constants defined globally: `const ON_CHANGE_DEBOUNCE_TIMER = 300;`
- Pub/Sub system accessed globally: `publish()`, `subscribe()`
- Utility functions globally available: `debounce()`, `throttle()`, `fetchConfig()`
## Error Handling
- Promise `.catch()` with console.error logging - Example in `product-form.js`:
- Error messages displayed to users via DOM updates, not alerts
- Error state tracked with instance property: `this.error = true/false`
- Validation errors shown inline via `setCustomValidity()` and `reportValidity()`
- Elements shown/hidden with `.toggleAttribute('hidden')`
- Message content set via `.textContent`
- Accessibility alerts via live regions: `#shopping-cart-line-item-status`
## Logging
- `console.error(e)` for exception logging
- No info/debug/warn logging in theme code
- Errors logged when promises reject during async operations
## Comments
- Complex algorithms explained before implementation - Example: "double buffer approach" comment in `HTMLUpdateUtility.viewTransition()`
- Business logic notes about future improvements - Example: "should be replaced by view transition once more widely supported"
- Disable rules for specific files - Example: `{% comment %}theme-check-disable ImgLazyLoading{% endcomment %}`
- Used sparingly (only one JSDoc example found in codebase)
- Format when present: standard JSDoc block with description
- Example from `global.js`:
## Function Design
- Small, focused functions (most utility functions 10-40 lines)
- Larger components may reach 400+ lines when necessary (e.g., `global.js` 1332 lines for multiple classes)
- Default parameters used: `preProcessCallbacks = []`
- Spread operators for variable arguments: `function (...args)`
- Array and object destructuring in parameters
- Promise-based returns for async operations
- Unsubscriber functions returned from `subscribe()` pattern
- HTML elements returned from DOM queries
- Void returns for event handlers and UI updates
## Module Design
- Web Components define globally via `customElements.define()` - Example:
- Utility functions defined at module scope, called as globals
- Classes exported implicitly by definition at module scope
- Not used - utilities in `global.js` and `constants.js`
- Single responsibility: `constants.js` for constants, `pubsub.js` for pub/sub system
- All components extend `HTMLElement`
- Constructor runs once, binds event handlers with `.bind(this)`
- `connectedCallback()` for initialization when added to DOM
- `disconnectedCallback()` for cleanup when removed from DOM
- Event listeners attached in constructor or `connectedCallback()`
- Unsubscribers stored as instance properties and cleaned up in `disconnectedCallback()`
## Pub/Sub Pattern
- Cart updates: `PUB_SUB_EVENTS.cartUpdate`
- Variant changes: `PUB_SUB_EVENTS.variantChange`
- Quantity updates: `PUB_SUB_EVENTS.quantityUpdate`
- Error propagation: `PUB_SUB_EVENTS.cartError`
## Utility Functions
- Debounce used for form input changes: `const debouncedOnChange = debounce((event) => { ... }, ON_CHANGE_DEBOUNCE_TIMER)`
- Throttle used for scroll events: `window.addEventListener('scroll', throttle(() => { ... }))`
- Debounce implementation: clears timeout, sets new one
- Throttle implementation: checks elapsed time since last call
- `getFocusableElements(container)` returns Array from NodeList of selectable elements
- `HTMLUpdateUtility.viewTransition()` for animated HTML swaps
- IntersectionObserver for scroll-triggered animations
## Progressive Enhancement
- HTML rendered server-side with Liquid
- JavaScript as progressive enhancement, not required
- Custom elements work with or without JavaScript
- CSS defaults to functional styling, JavaScript adds polish
- `data-hideErrors`: boolean for error display control
- `data-cascade`: marks elements for staggered animation
- `data-index`: references form field indices
- `data-sticky-type`: configuration for sticky headers
<!-- GSD:conventions-end -->

<!-- GSD:architecture-start source:ARCHITECTURE.md -->
## Architecture

## Pattern Overview
- HTML-first approach: Server renders all page markup using Liquid templating language
- JavaScript as progressive enhancement: No JavaScript required for core functionality
- Evergreen web standards: Leverages modern browser capabilities with graceful degradation
- Client-side interactivity via custom elements: Web Components pattern for dynamic behavior
- Pub/Sub event system for cross-module communication and state coordination
- Lazy-loaded assets: Scripts and stylesheets load on-demand per section
- CSS Grid and Flexbox: Modern layout primitives, no framework dependencies
## Layers
- Purpose: Define page layouts and composition for different page types
- Location: `templates/` (page templates), `templates/customers/` (customer account pages)
- Contains: JSON configuration defining section order and initial settings
- Depends on: Sections (for content) and Liquid filters/tags (for rendering)
- Used by: Shopify storefront engine to render server-side HTML
- Examples: `templates/index.json` (homepage), `templates/product.json` (product page), `templates/collection.json` (collection page)
- Purpose: Reusable, themeable content blocks with configurable settings
- Location: `sections/` (56 section files)
- Contains: Liquid markup, CSS styling (inline and linked), JavaScript orchestration
- Depends on: Snippets (for partial rendering), assets (CSS/JS)
- Used by: Templates to compose page layouts dynamically
- Examples: `sections/featured-product.liquid`, `sections/featured-collection.liquid`, `sections/collage.liquid`
- Key pattern: Each section is self-contained with its own styles and scripts loaded via `{{ 'file.css' | asset_url | stylesheet_tag }}`
- Purpose: DRY content blocks rendered within sections or other snippets
- Location: `snippets/` (39 snippet files)
- Contains: Parameterized Liquid markup with inline documentation
- Depends on: Assets (CSS/JS), other snippets via `{% render 'snippet-name' %}`
- Used by: Sections and other snippets
- Examples: `snippets/card-product.liquid`, `snippets/cart-drawer.liquid`, `snippets/facets.liquid`
- Pattern: Parameters documented in comment block (accepts array, object, or scalar values)
- Purpose: Define HTML document structure, head tags, global scripts, and color schemes
- Location: `layout/theme.liquid` (main), `layout/password.liquid` (password-protected stores)
- Contains: Document structure, font loading, CSS variable generation, global script injection
- Depends on: Settings from `config/settings_schema.json`
- Used by: Shopify rendering engine wraps all page content
- Key responsibility: Dynamic color scheme CSS generation based on `settings.color_schemes`
- Purpose: CSS styling and JavaScript behavior
- Location: `assets/` (186 files: CSS, JS)
- Contains:
- Depends on: Nothing (independent layer)
- Used by: Sections and snippets via `{{ 'file.css' | asset_url | stylesheet_tag }}` or `<script src="{{ 'file.js' | asset_url }}" defer></script>`
- Purpose: Define global theme settings, color schemes, typography, and localization
- Location: `config/settings_schema.json` (40KB schema), `config/settings_data.json` (current values)
- Contains: Color schemes, typography choices, logo/favicon, theme metadata
- Depends on: Nothing
- Used by: Layout layer, sections, and Shopify theme editor
- Pattern: Settings accessed via `settings.property_name` in Liquid; schemas define editor UI
- Purpose: Translate content and UI strings to 50+ languages
- Location: `locales/` (50+ JSON files)
- Contains: Language-specific translations organized by module (general, accessibility, newsletter, etc.)
- Depends on: Nothing
- Used by: All layers via Liquid `t` filter: `{{ 'key.path' | t }}`
- Pattern: `en.default.json` defines schema structure; locales like `es.json` contain translations
## Data Flow
- **Server State**: Product data, collection data, customer info - all rendered into HTML by Liquid
- **Client State**: DOM state, form state, cart state maintained by custom elements
- **Cross-Component Communication**: Pub/Sub pattern via `pubsub.js` module
- Cart operations: JavaScript collects form data, POSTs to `/cart/add.js`, receives JSON, updates cart drawer via DOM manipulation
- Faceted search: Click on filter → JavaScript fetches filtered collection → `HTMLUpdateUtility.viewTransition()` swaps HTML with animation
- Quick add: Click button → fetch product → render via snippet → insert into page
## Key Abstractions
- Purpose: Encapsulate interactive behaviors and state management
- Examples: `<product-info>`, `<cart-drawer>`, `<header-drawer>`, `<details-modal>`, `<menu-drawer>`
- Pattern: Extend HTMLElement, implement connectedCallback() for initialization, use data attributes for configuration
- Location: Either inline in sections (simple) or as separate JS files in assets (complex)
- Purpose: Manage qualified section IDs generated by Shopify editor
- Location: `assets/global.js`
- Pattern: Parse IDs like `template--12345__main` into template ID and section name for event scoping
- Used by: Theme editor integration and style scoping
- Purpose: Swap page content with animation/transition
- Location: `assets/global.js`
- Methods:
- Used by: Faceted search, pagination, any page update
- Purpose: Manage keyboard navigation within modals and drawers
- Location: `assets/global.js`
- Pattern: Capture Tab/Shift+Tab, loop focus between first and last focusable elements
- Used by: Modal and drawer components for accessibility
## Entry Points
- Location: `layout/theme.liquid`
- Triggers: Any HTTP request to store
- Responsibilities:
- Location: `assets/global.js`
- Triggers: Page load
- Responsibilities:
- Pattern: Each section loads its own JavaScript via `<script>` tag
- Example: `sections/featured-product.liquid` loads `{{ 'product-info.js' | asset_url }}`
- Responsibility: Sections initialize their custom elements and bind events
## Error Handling
- **JavaScript failures**: Core functionality (add to cart, checkout) works without JS; JS adds enhancements (live cart drawer, quick add)
- **CSS failures**: Mobile-first responsive design means missing CSS still produces functional layout
- **Image failures**: Lazy loading with fallback to static image; images have alt text for accessibility
- **Network failures**: Graceful degradation; forms still submit, no live preview without AJAX
- **Variant selection**: If variant API fails, page refresh fallback ensures product can still be added
## Cross-Cutting Concerns
- Server-side: Liquid performs quantity/availability validation before rendering "add to cart" button
- Client-side: JavaScript validates form data before AJAX submission (e.g., quantity > 0)
- Pattern: Never trust client input; always validate on server
- Pattern: Shopify handles customer authentication (login/register pages via template)
- Customer pages rendered server-side with customer context: `templates/customers/*`
- Page content checks `customer` Liquid variable to show personalized data
- Defer non-critical scripts: `<script src="..." defer></script>`
- Lazy load images: `loading="lazy"` attribute on img tags
- Lazy load CSS: `media="print" onload="this.media='all'"` pattern (seen in model-viewer stylesheet loading)
- Code splitting: Assets loaded per-section, not monolithic bundle
- Minification: Shopify CDN minifies assets automatically
<!-- GSD:architecture-end -->

<!-- GSD:skills-start source:skills/ -->
## Project Skills

No project skills found. Add skills to any of: `.claude/skills/`, `.agents/skills/`, `.cursor/skills/`, or `.github/skills/` with a `SKILL.md` index file.
<!-- GSD:skills-end -->

<!-- GSD:workflow-start source:GSD defaults -->
## GSD Workflow Enforcement

Before using Edit, Write, or other file-changing tools, start work through a GSD command so planning artifacts and execution context stay in sync.

Use these entry points:
- `/gsd-quick` for small fixes, doc updates, and ad-hoc tasks
- `/gsd-debug` for investigation and bug fixing
- `/gsd-execute-phase` for planned phase work

Do not make direct repo edits outside a GSD workflow unless the user explicitly asks to bypass it.
<!-- GSD:workflow-end -->



<!-- GSD:profile-start -->
## Developer Profile

> Profile not yet configured. Run `/gsd-profile-user` to generate your developer profile.
> This section is managed by `generate-claude-profile` -- do not edit manually.
<!-- GSD:profile-end -->

## Haze Brand Identity

### Store URL
- Development: haze-903935.myshopify.com
- Production domain: haze.hair (not connected yet — V2)

### Brand Colors
- Scheme 1: background `#F7F3EE` (cream), buttons/accent `#C4714A` (terracotta)
- Scheme 2: background `#E8D5CE` (blush)
- Text: `#2C2420` (dark)
- Rule: Colors set via Shopify Customize panel only — never hardcode hex in CSS files.

### Font Stack
- Headings: Cormorant Garamond (300/400/600 + italic) — Google Fonts
- Body: DM Sans (300/400/500) — Google Fonts
- Fallback heading: Georgia, serif
- Fallback body: -apple-system, BlinkMacSystemFont, sans-serif

### Design Principles
- Warm and editorial, not clinical ("that girl" / wellness ritual aesthetic)
- Gisou is the visual quality benchmark
- Mobile-first (375px base, breakpoints at 750px and 990px)
- Single SKU store — Hair Ritual Kit is the only product

### CSS Token Reference
- Spacing: `--haze-space-{xs|sm|md|lg|xl}` (0.4/0.8/1.6/3.2/6.4 rem)
- Radius: `--haze-radius-button: 2px`, `--haze-radius-card: 4px`
- Color aliases: `--haze-color-{terracotta|cream|blush|dark}`

### No-Touch Zones
- `layout/checkout.liquid` — never touch
- Dawn's `cart.js`, `global.js`, and all Dawn JS modules — never modify
- `config/settings_data.json` — never edit manually (use Customize panel)
- Dawn section HTML structure — CSS overrides only, no restructuring

### Placeholder Replacement Checklist
<!-- When real assets arrive, grep for PLACEHOLDER and replace each item below -->
- [ ] Product images (haze-placeholder-*.jpg)
- [ ] Logo file (haze-logo.svg or haze-logo.png)
- [ ] Social media URLs (Instagram, TikTok)
- [ ] Policy page text (Privacy, Terms, Refund)
