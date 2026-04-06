# Codebase Structure

**Analysis Date:** 2026-04-05

## Directory Layout

```
haze-shopify-theme/
├── assets/                 # CSS, JavaScript, images, fonts
│   ├── base.css           # Global styles and utilities
│   ├── component-*.css    # Component-scoped styles
│   ├── section-*.css      # Section-specific styles
│   ├── *.js               # JavaScript modules and behaviors
│   └── images/            # Theme images and icons
├── config/                # Theme configuration
│   ├── settings_schema.json      # Theme editor schema (40KB)
│   └── settings_data.json        # Current settings values
├── layout/                # Master layout templates
│   ├── theme.liquid       # Main document wrapper
│   └── password.liquid    # Password-protected store layout
├── locales/               # Translations (50+ languages)
│   ├── en.default.json    # English strings (reference)
│   ├── en.default.schema.json  # Schema for translations
│   └── [language].json    # Language translations
├── sections/              # Composable section blocks (56 files)
│   ├── featured-product.liquid
│   ├── featured-collection.liquid
│   ├── collage.liquid
│   ├── image-banner.liquid
│   └── ...
├── snippets/              # Reusable partial components (39 files)
│   ├── card-product.liquid
│   ├── cart-drawer.liquid
│   ├── facets.liquid
│   └── ...
├── templates/             # Page templates and layouts
│   ├── index.json         # Homepage
│   ├── product.json       # Product page
│   ├── collection.json    # Collection page
│   ├── cart.json          # Cart page
│   ├── article.json       # Blog article
│   ├── blog.json          # Blog listing
│   ├── page.json          # Generic page
│   ├── page.contact.json  # Contact form page
│   ├── search.json        # Search results
│   ├── gift_card.liquid   # Gift card page (Liquid, not JSON)
│   ├── password.json      # Password-protected store
│   ├── 404.json           # Not found page
│   └── customers/         # Customer account pages
│       ├── account.json
│       ├── login.json
│       ├── register.json
│       ├── addresses.json
│       ├── orders.json
│       └── ...
├── .github/               # CI/CD and workflows
├── .planning/             # Planning documentation
├── .vscode/               # Editor configuration
└── translation.yml        # Translation configuration
```

## Directory Purposes

**assets/:**
- Purpose: All static resources (CSS, JavaScript, images)
- Contains: ~186 files of styling and behavior
- Key files:
  - `base.css` - Foundation styles, layout grid, typography, utilities
  - `global.js` - Global utilities (focus trapping, HTML updates, SectionId parser)
  - `pubsub.js` - Event pub/sub for cross-component communication
  - `constants.js` - Global constants and event names
  - `product-info.js` - Product page interactivity
  - `cart-drawer.js`, `cart-notification.js`, `cart.js` - Cart functionality
  - Component CSS files match component names in snippets (e.g., `component-card.css` for card rendering)

**config/:**
- Purpose: Theme configuration and editor settings
- Contains:
  - `settings_schema.json` - Defines all theme settings available in Shopify theme editor (colors, typography, layout options)
  - `settings_data.json` - Current values for those settings (applied to store)
- Key structure: Color schemes, typography families, logo/favicon, page width, card styles
- Used by: Layout and sections to apply user-configured values

**layout/:**
- Purpose: Master template that wraps all pages
- Contains: 2 files
  - `theme.liquid` - Primary document structure, head tag, global scripts, color CSS generation
  - `password.liquid` - Alternative layout for password-protected stores
- Key responsibility: Injects Shopify's `content_for_header`, loads global scripts/styles

**locales/:**
- Purpose: Multi-language support
- Contains: 50+ JSON files, each language has two files:
  - `[lang].json` - Translated strings
  - `[lang].schema.json` - Schema/structure (for theme editor)
- Key structure: Nested objects by module (general, newsletter, accessibility, cart, etc.)
- Pattern: In Liquid, strings referenced as `{{ 'path.to.string' | t }}`

**sections/:**
- Purpose: Composable content blocks for homepage and template pages
- Contains: 56 section files, each is a self-contained Liquid template
- Key patterns:
  - Sections load their own CSS and JavaScript
  - Define blocks (configurable sub-elements within a section)
  - Accept settings from template configuration
  - Example: `featured-product.liquid` accepts 10+ settings (media size, color scheme, padding, etc.)
- Categories:
  - Product sections: featured-product, product-recommendations, complementary-products
  - Collection sections: featured-collection, collection-list
  - Content sections: image-banner, text, rich-text, collage, video
  - Commerce sections: cart-drawer, cart-icon-bubble, cart-notification
  - Header/Navigation: header-group, footer-group
  - Specialty: announcement-bar, contact-form, email-signup-banner

**snippets/:**
- Purpose: Reusable components rendered via `{% render 'snippet-name' %}`
- Contains: 39 files, each is a parameterized Liquid template
- Pattern: Header comment documents accepted parameters
- Examples:
  - `card-product.liquid` - Renders a product card (used in collections, featured collections)
  - `cart-drawer.liquid` - Renders cart sidebar UI
  - `facets.liquid` - Renders search/filter UI
  - `product-media-gallery.liquid` - Product image gallery with zoom
  - `icon-*.liquid` - SVG icons (icon-accordion, icon-with-text, etc.)
  - `price.liquid` - Price display with currency formatting
- Difference from sections: Snippets cannot have settings in theme editor; simpler, reusable

**templates/:**
- Purpose: Define page composition (sections in order) for each page type
- Contains: 13 JSON files + 1 Liquid file (gift_card.liquid)
- Format: JSON (not Liquid) with structure:
  ```json
  {
    "sections": {
      "section_id": { "type": "section-name", "settings": {...}, "blocks": {...} }
    },
    "order": ["section_id_1", "section_id_2"]
  }
  ```
- Key files:
  - `index.json` - Homepage (image banner, featured collection, multicolumn, etc.)
  - `product.json` - Product page (main product, recommendations, reviews)
  - `collection.json` - Collection page (hero, products grid, filters)
  - `cart.json` - Shopping cart page
  - `page.json` - Generic page (allows custom sections)
  - `search.json` - Search results page

**templates/customers/:**
- Purpose: Customer account pages (login, account, orders)
- Contains: 7 JSON files for customer workflows
- Files: account, activate_account, addresses, login, order, register, reset_password

## Key File Locations

**Entry Points:**
- `layout/theme.liquid` - Primary document wrapper; all pages render through this
- `templates/index.json` - Homepage layout
- `templates/product.json` - Product page layout
- `assets/global.js` - Global JavaScript initialization

**Configuration:**
- `config/settings_schema.json` - Theme settings definition (what's editable in theme editor)
- `.theme-check.yml` - Theme linting rules
- `.prettierrc.json` - Code formatting configuration

**Core Logic:**
- `assets/pubsub.js` - Event publishing/subscribing (cross-module communication)
- `assets/constants.js` - Shared constants (event names, debounce timers)
- `assets/product-info.js` - Product page state and variant selection logic
- `assets/cart.js`, `cart-drawer.js`, `cart-notification.js` - Cart functionality

**Styling:**
- `assets/base.css` - Foundation: typography, layout grid, utilities (80KB)
- `assets/component-*.css` - Component styles (accordion, card, cart, price, etc.)
- `assets/section-*.css` - Section-specific styles

**Testing (Theme Check):**
- `.theme-check.yml` - Linting configuration

## Naming Conventions

**Files:**
- **Sections**: kebab-case (featured-product.liquid, image-banner.liquid)
- **Snippets**: kebab-case (card-product.liquid, header-drawer.liquid)
- **JavaScript**: kebab-case (product-info.js, cart-drawer.js)
- **CSS**: kebab-case (component-card.css, section-featured-product.css)
- **Locales**: ISO 639-1 language codes (en.default.json, es.json, fr.json)

**Directories:**
- All lowercase, plural for collections (assets, sections, snippets, templates, locales)
- Except: config, layout (singular, function-specific)

**Identifiers (in HTML/Liquid):**
- **Section IDs**: Generated by Shopify, format `template--{number}__{section-name}`
- **Block IDs**: Developer-defined, kebab-case (e.g., `button-1`, `text-block`)
- **CSS classes**: kebab-case (product-card, cart-drawer, button--secondary)
- **Data attributes**: kebab-case (data-section, data-product-id, data-zoom-on-hover)

## Where to Add New Code

**New Feature (major functionality):**
- Primary code: Create new section in `sections/feature-name.liquid`
- Reusable component: Create snippet in `snippets/feature-component.liquid`
- Styling: Add `assets/component-feature-name.css` or `assets/section-feature-name.css`
- JavaScript: Add `assets/feature-name.js` or extend existing `assets/global.js`
- Translations: Add keys to `locales/en.default.json` and all other `locales/*.json` files
- Use Liquid render tag: `{% render 'feature-component' %}`

**New Component/Module (supporting functionality):**
- As snippet: Create `snippets/component-name.liquid` with documented parameters
- Styling: Link via `{{ 'component-component-name.css' | asset_url | stylesheet_tag }}`
- Documentation: Add JSDoc comment at top of snippet

**Utilities/Helpers:**
- Shared Liquid filters: Add logic to related section/snippet
- JavaScript utilities: Add to `assets/global.js` or create new `assets/utility-name.js`
- If creating new JS file, load it in `layout/theme.liquid` with `<script src="{{ 'utility-name.js' | asset_url }}" defer></script>`

**Styling Only (no structure change):**
- Component style adjustments: Modify `assets/component-*.css`
- Global style: Modify `assets/base.css`
- Section overrides: Create/modify `assets/section-[section-name].css`

**Translations:**
- Add new key to `locales/en.default.json` in appropriate section
- Copy key structure to all other `locales/*.json` files with translations
- Reference in Liquid: `{{ 'section.key_name' | t }}`

**New Page Type:**
- Create template: `templates/new-page-type.json`
- Define sections to compose page
- Add customer page: `templates/customers/new-customer-page.json`

## Special Directories

**.planning/:**
- Purpose: Project planning and documentation
- Generated: During `/gsd-map-codebase` command
- Committed: Yes, tracked in git
- Contents: ARCHITECTURE.md, STRUCTURE.md, CONVENTIONS.md, TESTING.md, CONCERNS.md, etc.

**.github/:**
- Purpose: GitHub Actions CI/CD workflows
- Contains: Theme Check linting, Lighthouse performance testing
- Not theme code, but quality gates

**.vscode/:**
- Purpose: VS Code editor configuration
- Contains: Recommended extensions (Theme Check), settings
- Developer convenience only

**.git/:**
- Purpose: Git version control
- Contains: Repository history, branches
- Standard git directory

**locales/ (special structure):**
- Each language has two files:
  - `[language].json` - Actual translations
  - `[language].schema.json` - Schema definition for theme editor
- `en.default.json` is the reference schema
- Adding new language: Copy `en.default.json` structure, translate all values, rename to `[lang].json`

---

*Structure analysis: 2026-04-05*
