# Codebase Concerns

**Analysis Date:** 2026-04-05

## Tech Debt

### Liquid Template Checker Disabled

**Issue:** Theme Check disabled for non-standard Liquid filters in critical product pages.

**Files:**
- `./snippets/quick-order-list-row.liquid` (453 lines)
- `./snippets/quick-order-list.liquid`
- `./sections/featured-product.liquid` (1507 lines)
- `./sections/main-product.liquid` (2268 lines)

**Impact:** False positives in theme linting prevent proper validation. Alternative filters like `line_items_for` and `item_count_for_variant` are valid but marked as invalid, requiring workarounds. This creates code complexity and hides actual linting issues.

**Fix approach:** Submit Shopify theme checker updates to support these filters natively, or add custom rule configuration to `.theme-check.yml` once supported.

---

### Monolithic Global.js File (1332 lines)

**Issue:** `./assets/global.js` contains 75+ classes/functions mixed with global scope initialization, making it difficult to maintain and test.

**Files:** `./assets/global.js`

**Impact:** Hard to isolate concerns. Changes to one feature risk breaking others. Testing individual utilities requires loading entire file. Memory footprint is larger than necessary.

**Fix approach:** Split into modules:
- `cart-utilities.js` - Cart-related helpers
- `dom-utilities.js` - DOM manipulation (SectionId, HTMLUpdateUtility)
- `focus-utilities.js` - Focus trap, accessibility
- `detail-handlers.js` - Details/disclosure setup

---

### Insufficient Error Handling in API Calls

**Issue:** Fetch errors in cart operations only log to console without user-facing recovery.

**Files:**
- `./assets/product-form.js` (lines 88-89)
- `./assets/cart.js` (multiple locations)
- `./assets/product-info.js` (line 90)
- `./assets/quick-add-bulk.js`

**Impact:** Network failures silently degrade UX. Users don't know if cart add failed. No retry mechanism. Error states not propagated to UI.

**Fix approach:** Implement error boundary pattern:
1. Emit error events via PUB_SUB for centralized handling
2. Add user-facing error messages in cart-notification/cart-drawer
3. Implement exponential backoff retry for transient failures
4. Add request timeout handling (current: infinite wait)

**Example safe pattern:**
```javascript
.catch((e) => {
  publish(PUB_SUB_EVENTS.cartError, {
    source: 'product-form',
    error: e.message,
    isNetwork: e instanceof TypeError
  });
})
```

---

## Security Considerations

### Direct innerHTML Assignment in Product Title Update

**Issue:** Page title updated via `innerHTML` from DOMParser-parsed response without sanitization.

**Files:** `./assets/product-info.js` (line 97)

**Code:**
```javascript
document.querySelector('head title').innerHTML = html.querySelector('head title').innerHTML;
```

**Risk:** XSS vulnerability if product name/page title contains script tags. DOMParser protects against script execution BUT innerHTML could expose DOM-based XSS if combined with DOM manipulation elsewhere.

**Current mitigation:** DOMParser prevents script execution on parse, but assignment is unnecessary complexity. Should use `textContent` instead.

**Recommendations:**
1. Use `textContent` for title updates: `.textContent = html.querySelector('head title').textContent`
2. Audit all `innerHTML` assignments in `./assets/` for untrusted data
3. Add CSP headers to prevent inline script execution as defense-in-depth

---

### innerHTML Used for Dynamic Content Without Validation

**Issue:** Multiple files use `innerHTML` to inject HTML from server responses without strict validation.

**Files:**
- `./assets/facets.js` (product grid updates)
- `./assets/cart-drawer.js` (cart content)
- `./assets/quick-order-list.js` (table updates)
- `./assets/predictive-search.js` (search results)

**Impact:** If server is compromised or response is intercepted, attacker can inject scripts. Safe against XSS from user-submitted content only because responses come from Shopify API, but zero defense against supply chain attack.

**Recommendations:**
1. Use `textContent` for text-only updates
2. Use `replaceChild` + `createElement` for DOM structure changes
3. Implement Content Security Policy (CSP) header
4. Add Subresource Integrity (SRI) for remote assets

---

## Performance Bottlenecks

### Large Product Page Liquid Template (2268 lines)

**Issue:** `./sections/main-product.liquid` is 2268 lines with 53+ conditional branches.

**Files:** `./sections/main-product.liquid`

**Cause:** Single section handles:
- Product media gallery
- Variant selection
- Pricing (including volume pricing)
- Quantity picker
- Form submission
- Inventory status
- Product reviews integration
- 3D model rendering
- Multiple block types (title, price, inventory, etc.)

**Improvement path:**
1. Break into smaller section snippets: `product-media.liquid`, `product-form.liquid`, `product-info.liquid`
2. Lazy-load non-critical blocks (reviews, 3D models)
3. Consider section-wide memoization of variant calculations

---

### Unoptimized Event Listener Cleanup in Quick Order List

**Issue:** Quick order list manages multiple event listeners but potential memory leaks on pagination/reload.

**Files:** `./assets/quick-order-list.js`

**Cause:** Multiple `addEventListener` calls (11 total) with limited cleanup on `disconnectedCallback`. Pagination triggers re-renders that add new listeners without removing old ones if elements aren't properly replaced.

**Improvement path:**
1. Use event delegation on single parent listener instead of individual quantity inputs
2. Store listener references for cleanup: `this.listeners = { click: [], change: [] }`
3. Test memory leak in Chrome DevTools (heap snapshots) before/after pagination

---

### Cart Performance Monitoring Overhead

**Issue:** `CartPerformance` marks/measures on every cart operation may impact performance on high-frequency updates.

**Files:** `./assets/global.js` (CartPerformance class)

**Cause:** `performance.mark()` and `performance.measure()` called on every:
- Cart add (product-form.js)
- Variant change (product-info.js)
- Quantity update (cart.js)

**Impact:** On stores with high cart modification rate (quick-add bulk operations), performance API calls may accumulate.

**Improvement path:**
1. Sample marks at 5-10% rate instead of 100%
2. Use `PerformanceObserver` to batch reporting
3. Only mark critical paths (not every state change)

---

### No Pagination Limit on Product Collections

**Issue:** `featured-collection.liquid` paginates by `settings.products_to_show` with no upper limit.

**Files:** `./sections/featured-collection.liquid`

**Cause:** If merchant sets `products_to_show: 100+`, Liquid will render 100+ product cards on single page load.

**Impact:** Large DOM tree, slow initial render, high memory usage on mobile.

**Improvement path:**
1. Add hard cap in settings schema: `max: 50`
2. Consider "Load More" button instead of paginated links
3. Lazy-load images with native `loading="lazy"`

---

## Fragile Areas

### Product Variant Selection State Management

**Issue:** Variant state relies on multiple interconnected pub-sub events with implicit ordering assumptions.

**Files:**
- `./assets/product-info.js` (subscribes to `optionValueSelectionChange`)
- `./assets/product-form.js` (reads from variant-selects)
- Various section includes

**Why fragile:** Event handlers depend on execution order:
1. Variant selector updates DOM
2. Product info reads new selected variant
3. Product form uses variant data

If any step is async or delayed, state becomes inconsistent. No explicit state machine or queue.

**Safe modification:**
1. Before changing event flow, trace full call chain:
   ```bash
   grep -r "optionValueSelectionChange\|publish.*variant" ./assets
   ```
2. Add debug logging: `console.log('Variant state:', { variantId, availability })`
3. Test across: simple product, multi-option product, out-of-stock variant

**Test coverage gaps:**
- No tests for race conditions between variant change + add to cart
- No tests for quick successive variant changes
- No tests for network delays during variant fetch

---

### HTMLUpdateUtility.viewTransition Double-Buffer Approach

**Issue:** `HTMLUpdateUtility.viewTransition()` uses timeout-based DOM swap that may cause layout thrashing.

**Files:** `./assets/global.js` (lines 33-54)

**Code:**
```javascript
setTimeout(() => oldNode.remove(), 500);
```

**Why fragile:**
1. 500ms timeout is arbitrary - may be too short on slow devices
2. Old and new DOM coexist for 500ms, causing CSS specificity conflicts
3. ID deduplication uses `Date.now()` which isn't guaranteed unique in rapid updates

**Safe modification:**
1. Use `requestAnimationFrame` instead of fixed timeout
2. Listen for CSS transition end event
3. Store ID deduplication strategy separately

---

### Focus Trap Dependency on Element Selectors

**Issue:** `trapFocus()` function assumes specific focusable element structure.

**Files:** `./assets/global.js` (lines 94-139)

**Cause:** Hardcoded `getFocusableElements()` selector query:
```javascript
"summary, a[href], button:enabled, [tabindex]:not([tabindex^='-']), ..."
```

**Why fragile:** Custom elements not in this list won't be trapped. If section adds new interactive component type, focus escapes.

**Safe modification:**
1. Make selector configurable per container: `container.dataset.focusableSelector`
2. Add custom element support detection
3. Test with all custom elements in theme: `quick-order-list`, `product-form`, etc.

---

## Scaling Limits

### Product Image Gallery Memory Usage

**Issue:** Product media array stored in memory without lazy loading.

**Files:** `./sections/main-product.liquid` (includes product-media-gallery)

**Current capacity:** Works fine for products with < 20 images

**Limit:** ~50 images on mobile. Each image loads (or attempts to) full resolution before mobile optimization.

**Scaling path:**
1. Implement intersection observer for off-screen thumbnails
2. Load only visible 5-10 image tiles initially
3. Progressive load as user scrolls

---

### Cart Drawer Content Rendering

**Issue:** Cart drawer renders entire cart HTML on every update.

**Files:** `./assets/cart-drawer.js`

**Current capacity:** Handles ~50 line items smoothly

**Limit:** 200+ items = noticeable 1-2s render delay

**Scaling path:**
1. Implement virtual scrolling for line item list
2. Only render visible items + 5 above/below viewport
3. Debounce renders to 200ms minimum interval

---

### Quick Order List Pagination

**Issue:** `./assets/quick-order-list.js` re-renders entire table on page change.

**Files:** `./assets/quick-order-list.js`

**Current capacity:** 20-30 items per page + 5 pages = smooth

**Limit:** 100+ items per page = full re-render causes noticeable freeze

**Scaling path:**
1. Server-side filtering/pagination (already done via Shopify API)
2. Only update visible page section, not entire table
3. Use `IntersectionObserver` for virtual row loading

---

## Dependencies at Risk

### Implicit Shopify API Response Format Dependency

**Issue:** Cart operations assume specific Shopify API response JSON structure without validation.

**Files:** Multiple (cart.js, product-form.js, etc.)

**Risk:** Shopify API version changes or new response fields could break parsing.

**Migration plan:**
1. Add response schema validation:
   ```javascript
   const cartSchema = { sections: object, status?: number };
   if (!validateSchema(response, cartSchema)) throw new Error('Invalid cart response');
   ```
2. Add version negotiation header: `Accept-Version: 2024-01`
3. Implement feature detection instead of version checks

---

### External Font Loading (Shopify Fonts)

**Issue:** Theme depends on Shopify CDN for font files (`fonts.shopifycdn.com`).

**Files:** `./layout/theme.liquid` (lines 14-15)

**Risk:** If CDN is slow or unavailable, page render blocked by font loading.

**Current setup:** Uses `font-display: swap` which is good practice.

**Mitigation already in place:** Fallback system fonts via CSS cascade.

**Recommendations:**
1. Consider self-hosting critical fonts (heading font minimum)
2. Add connection timeout to font fetch
3. Monitor font loading performance in production

---

## Test Coverage Gaps

### No Tests for Product Variant Race Conditions

**What's not tested:** Adding to cart while variant selection is updating.

**Files:** `./assets/product-info.js`, `./assets/product-form.js`

**Risk:**
- User clicks variant option
- Before selection completes, user clicks "Add to cart"
- Form submits with stale variant ID
- Wrong product variant added to cart

**Priority:** HIGH - User-impacting bug

**How to test:**
1. Mock slow variant fetch (2+ seconds)
2. Trigger variant change + add-to-cart in rapid succession
3. Verify correct variant ID submitted

---

### No Tests for Cart Drawer Sync

**What's not tested:** Multiple cart operations from different sections simultaneously.

**Files:** `./assets/cart-drawer.js`, `./assets/cart.js`, `./assets/product-form.js`

**Risk:** Pub-sub event race conditions cause cart state mismatch.

**Priority:** MEDIUM - Rare but data-integrity issue

**How to test:**
1. Simulate: user adds product A from product page while quick-add modal adds product B
2. Verify both additions processed and cart reflects both
3. Verify no lost updates

---

### No Tests for Memory Leaks on Repeated Page Navigation

**What's not tested:** Event listeners cleanup on section re-renders.

**Files:** `./assets/quick-order-list.js` (11 listeners), `./assets/product-info.js` (pubsub subscriptions)

**Risk:** Heap grows on repeated page navigation.

**Priority:** MEDIUM - Degrades mobile experience over time

**How to test:**
1. Heap snapshot before/after 50 page navigations
2. Monitor detached DOM nodes
3. Verify all event listeners removed on disconnect

---

### No Tests for Network Failure Scenarios

**What's not tested:** Cart operations when network is slow, offline, or returns errors.

**Files:** All cart-related files

**Risk:** Silent failures, no user feedback.

**Priority:** MEDIUM - Production impact on poor connectivity

**How to test:**
1. Mock fetch to timeout (15s+)
2. Mock 5xx server responses
3. Verify user sees error message and can retry

---

## Missing Critical Features

### No Retry Logic for Failed Cart Operations

**Problem:** If cart add fails due to network, user must refresh and try again.

**Blocks:** Smooth mobile UX, reduces accidental duplicate attempts.

**Implementation:**
1. Add `maxRetries: 3` to `fetchConfig()`
2. Implement exponential backoff
3. Add "Retry" button in error state

---

### No Offline Detection or Fallback

**Problem:** Theme doesn't detect when network is offline; requests just timeout.

**Blocks:** Mobile users benefit from offline-first UX.

**Implementation:**
1. Use `navigator.onLine` API
2. Show "You're offline" message
3. Queue cart operations for sync when online

---

### No Loading State for Async Variant Data Fetch

**Problem:** Product info appears to load instantly, but variant data fetch can take 500ms+.

**Blocks:** Perceived poor performance on slow networks.

**Implementation:**
1. Show skeleton loader during fetch
2. Disable form until variant data loaded
3. Cache variant data per product ID

---

## Summary of Severity

| Area | Severity | Fix Time | Impact |
|------|----------|----------|--------|
| innerHTML XSS in title | Medium | 30m | Security |
| Monolithic global.js | Medium | 4h | Maintainability |
| Missing error handling | High | 3h | UX/Data integrity |
| Large Liquid templates | Low | 8h | Performance/Maintainability |
| Event listener cleanup | Medium | 2h | Memory/Performance |
| Variant race conditions | High | N/A | User-facing bug potential |
| Network failure recovery | Medium | 4h | Reliability |

---

*Concerns audit: 2026-04-05*
