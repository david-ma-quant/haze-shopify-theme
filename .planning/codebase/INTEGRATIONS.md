# External Integrations

**Analysis Date:** 2026-04-05

## APIs & External Services

**Shopify Platform (Built-in):**
- Admin API - Theme management and deployment
- Storefront API - Product, cart, and customer queries
- Shop API - Customer context and data (via Liquid)
- XR/3D Model Viewer - Product model 3D rendering

**Payment Processing:**
- Built into Shopify's standard cart flow
- Payment terms support (`--payment-terms-background-color` CSS variable)
- No direct payment gateway integration in theme code

**Localization:**
- Google Fonts API via `https://fonts.shopifycdn.com` - Font loading
- Locale/language detection via `request.locale.iso_code`

## Data Storage

**Databases:**
- Shopify datastore (merchant database)
  - Connection: Implicit via Shopify platform
  - Client: Shopify Liquid (server-side template access to `shop`, `product`, `customer` objects)

**File Storage:**
- Shopify CDN (all theme assets)
  - Connection: `asset_url` Liquid filter
  - Storage location: `assets/` directory

**Caching:**
- Browser localStorage (via JavaScript)
  - Used for client-side state
  - Location: `assets/pubsub.js` (pub-sub pattern)

## Authentication & Identity

**Auth Provider:**
- Shopify built-in authentication
  - Implementation: Customer login via Shopify admin
  - Routes:
    - `routes.account_login_url` - Customer login endpoint
    - `routes.account_url` - Customer account pages
  - Detection: `if customer` variable in Liquid
  - Session management: Shopify cookies (implicit)

**Shops & API Access:**
- Admin API tokens for deployment (`.env` and GitHub Secrets)
- No public API keys exposed in frontend code

## Monitoring & Observability

**Error Tracking:**
- None detected in codebase
- Built-in Shopify admin error logs available

**Logs:**
- Browser console logging via JavaScript (minimal in production)
- Shopify analytics tracking via `{{ content_for_header }}` injection
- Performance metrics via cart timing (debounce tracking in `assets/cart.js`)

**Analytics:**
- Google Lighthouse via CI/CD (`lighthouse-ci-action`)
- Shopify Analytics (injected via `content_for_header`)

## CI/CD & Deployment

**Hosting:**
- Shopify Cloud hosting (Online Store 2.0)
- Theme deployment via GitHub Actions + Shopify CLI

**CI Pipeline:**
- GitHub Actions (`ci.yml`)
  - Lighthouse performance audits (runs on push)
  - Theme Check linting (runs on push)
- Automated on: all branches

**Deployment:**
- Manual via Shopify CLI `theme push` (during local development)
- CI/CD ready but currently not auto-deploying on branch push

## Environment Configuration

**Required env vars (for development/CI):**
- `SHOP_STORE_OS2` - Shopify store domain (e.g., mystore.myshopify.com)
- `SHOP_PASSWORD_OS2` - Admin password
- `SHOP_ACCESS_TOKEN` - Shopify API access token
- `SHOP_PULL_THEME` - Theme ID to test against (for Lighthouse)
- `LHCI_GITHUB_TOKEN` - GitHub token for Lighthouse CI

**Secrets location:**
- GitHub Secrets repository settings
- Local `.env` file (not committed)

## Webhooks & Callbacks

**Incoming:**
- None implemented in theme code
- Shopify events are server-side (handled by Shopify admin)

**Outgoing:**
- No explicit webhook calls from theme
- Form submissions to Shopify endpoints:
  - `routes.cart_add_url` - Add to cart (fetch-based)
  - `routes.cart_change_url` - Quantity change
  - `routes.cart_update_url` - Cart notes/properties
  - `routes.cart_url` - Cart page fetch (for drawer updates)
  - `routes.search_url` - Search form submission
  - `routes.account_login_url` - Customer login

## Third-Party Scripts & Tags

**Content for Header Injection:**
- `{{ content_for_header }}` in `layout/theme.liquid:42`
- Automatically injects Shopify analytics, pixels, and tracking tags
- Merchant-added pixels/scripts via Shopify admin

**Font Loading:**
- Preconnect to `fonts.shopifycdn.com` (`layout/theme.liquid:15`)
- Font face declarations via Liquid filters (system or custom fonts)

## Client-Side Network Requests

**Fetch-based API calls:**

1. **Cart operations** (`assets/cart.js`):
   - Fetch cart drawer HTML: `GET routes.cart_url?section_id=cart-drawer`
   - Fetch cart items: `GET routes.cart_url?section_id=main-cart-items`
   - Change quantities: `POST routes.cart_change_url`
   - Update notes: `POST routes.cart_update_url` (debounced)

2. **Product operations** (`assets/product-form.js`):
   - Add to cart: `POST routes.cart_add_url`
   - Headers: `X-Requested-With: XMLHttpRequest`

3. **Predictive search** (`assets/predictive-search.js`):
   - Search suggestions (implementation details not fully visible)

4. **Pickup availability** (`assets/pickup-availability.js`):
   - Store location and inventory checks

## Translation & Localization

**Framework:**
- Shopify's native translation system

**Configuration:**
- `translation.yml` defines:
  - Source language: English
  - Target languages: 30 languages (bg, cs, da, de, el, es, fi, fr, hr, hu, id, it, ja, ko, lt, nb, nl, pl, pt-BR, pt-PT, ro, ru, sk, sl, sv, th, tr, vi, zh-CN, zh-TW)
  - Paths: `locales/{{language}}.json` and `locales/{{language}}.schema.json`

**Implementation:**
- Liquid `t` filter for translations: `{{ 'key.path' | t }}`
- Example: `{{ 'sections.cart.login.paragraph_html' | t: link: routes.account_login_url }}`

---

*Integration audit: 2026-04-05*
