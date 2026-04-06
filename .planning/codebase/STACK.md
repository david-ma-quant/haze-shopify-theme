# Technology Stack

**Analysis Date:** 2026-04-05

## Languages

**Primary:**
- Liquid v1 - Shopify templating language for theme markup
- JavaScript (ES6+) - Client-side interactivity and dynamic features
- CSS3 - Styling and animations

**Secondary:**
- YAML - Configuration and translation management
- JSON - Configuration schemas and settings data

## Runtime

**Environment:**
- Shopify Theme Platform (cloud-hosted)
- Browser-based (no server-side Node.js)
- Evergreen web browsers with progressive enhancement for older browsers

**Package Manager:**
- npm (for development tooling)
- Shopify CLI (primary development interface)

## Frameworks

**Core:**
- Shopify Dawn v15.4.1 (base theme framework)
- Web Components (custom elements via `customElements.define()`)
- Web APIs (Fetch, DOM APIs, local storage)

**Build/Dev:**
- Shopify CLI - Theme development server and deployment
- Theme Check - Linting and validation (`shopify/theme-check-action@v2`)
- Prettier - Code formatting (configured in `.prettierrc.json`)

**CI/CD:**
- GitHub Actions
  - `shopify/lighthouse-ci-action@v1` - Performance auditing
  - `shopify/theme-check-action@v2` - Theme validation

## Key Dependencies

**Critical:**
- Shopify Liquid API - Server-side templating for rendering
- Shopify.js objects - Client-side API (e.g., `Shopify.designMode`)
- Shopify Web Components (built-in)
  - `shopify-xr-button` - 3D model viewer
  - Model 3D viewer integration

**Infrastructure:**
- Google Fonts via `fonts.shopifycdn.com` - Custom font loading
- Shopify CDN - Asset serving (`asset_url` filter)
- Shopify Shop API (implicit) - Product, cart, customer data

## Configuration

**Environment:**
- `.env` file present (contains Shopify store credentials)
- GitHub Secrets used for CI/CD:
  - `SHOP_STORE_OS2` - Test store domain
  - `SHOP_PASSWORD_OS2` - Admin password
  - `SHOP_ACCESS_TOKEN` - Shopify API access
  - `LHCI_GITHUB_TOKEN` - Lighthouse CI token
  - `SHOP_PULL_THEME` - Theme ID for testing

**Build:**
- `.prettierrc.json` - Print width 120, single quotes with Liquid override
- `.theme-check.yml` - Theme validation config (MatchingTranslations, TemplateLength disabled)
- `translation.yml` - i18n configuration (30+ language targets)

## Platform Requirements

**Development:**
- Shopify CLI (required)
- Git (version control)
- VS Code (recommended, with Theme Check extension)
- Node.js (for build tools)

**Production:**
- Shopify Online Store 2.0 compatible store
- Latest browser support via progressive enhancement

---

*Stack analysis: 2026-04-05*
