# Coding Conventions

**Analysis Date:** 2026-04-05

## Naming Patterns

**Files:**
- JavaScript files: `kebab-case.js` - Examples: `product-form.js`, `cart-notification.js`, `quick-order-list.js`
- CSS files: `component-` or `section-` prefix with `kebab-case.css` - Examples: `component-accordion.css`, `section-main-product.css`
- Liquid files: `kebab-case.liquid` - Examples: `multirow.liquid`, `predictive-search.liquid`

**Functions:**
- camelCase for regular functions - Example: `onSubmitHandler()`, `initializeScrollAnimationTrigger()`
- PascalCase for class constructors and Web Components - Examples: `ProductForm`, `CartItems`, `QuickOrderList`
- Private class methods use `#` prefix - Example: `static #separator`

**Variables:**
- camelCase for local variables and properties - Examples: `formData`, `submitButton`, `cartUpdateUnsubscriber`
- UPPER_SNAKE_CASE for constants - Examples: `ON_CHANGE_DEBOUNCE_TIMER`, `SCROLL_ANIMATION_TRIGGER_CLASSNAME`
- Event names in camelCase with object format - Example: `PUB_SUB_EVENTS = { cartUpdate: 'cart-update' }`

**Types:**
- Not TypeScript - Plain JavaScript
- HTML Element subclasses follow PascalCase - Examples: `ModalDialog`, `QuantityInput`, `HeaderDrawer`

## Code Style

**Formatting:**
- Prettier configured with printWidth: 120 characters
- Single quotes for JavaScript (`'string'`)
- Double quotes for Liquid and HTML attributes
- Format on save: enabled for JavaScript and Liquid

**Linting:**
- Prettier VSCode extension: `esbenp.prettier-vscode`
- Theme Check via Shopify extension: `Shopify.theme-check-vscode`
- Prettier config: `/.prettierrc.json`

**Key Settings:**
```json
{
  "printWidth": 120,
  "singleQuote": true,
  "overrides": [
    { "files": "*.liquid", "options": { "singleQuote": false } }
  ]
}
```

## Import Organization

**Order:**
1. Relative imports from other project files
2. Utility functions from constants or globals
3. No external dependencies (framework-free philosophy)

**Path Aliases:**
- None used - paths are relative or use document global references

**Global Scope Usage:**
- Constants defined globally: `const ON_CHANGE_DEBOUNCE_TIMER = 300;`
- Pub/Sub system accessed globally: `publish()`, `subscribe()`
- Utility functions globally available: `debounce()`, `throttle()`, `fetchConfig()`

## Error Handling

**Patterns:**
- Promise `.catch()` with console.error logging - Example in `product-form.js`:
  ```javascript
  fetch(url, config)
    .then((response) => response.json())
    .then((response) => { /* handle response */ })
    .catch((e) => {
      console.error(e);
      // Handle error UI state
    });
  ```

- Error messages displayed to users via DOM updates, not alerts
- Error state tracked with instance property: `this.error = true/false`
- Validation errors shown inline via `setCustomValidity()` and `reportValidity()`

**No explicit try/catch blocks** - Promise-based error handling preferred

**Error UI patterns:**
- Elements shown/hidden with `.toggleAttribute('hidden')`
- Message content set via `.textContent`
- Accessibility alerts via live regions: `#shopping-cart-line-item-status`

## Logging

**Framework:** Native `console` object only

**Patterns:**
- `console.error(e)` for exception logging
- No info/debug/warn logging in theme code
- Errors logged when promises reject during async operations

## Comments

**When to Comment:**
- Complex algorithms explained before implementation - Example: "double buffer approach" comment in `HTMLUpdateUtility.viewTransition()`
- Business logic notes about future improvements - Example: "should be replaced by view transition once more widely supported"
- Disable rules for specific files - Example: `{% comment %}theme-check-disable ImgLazyLoading{% endcomment %}`

**JSDoc/TSDoc:**
- Used sparingly (only one JSDoc example found in codebase)
- Format when present: standard JSDoc block with description
- Example from `global.js`:
  ```javascript
  /**
   * Used to swap an HTML node with a new node.
   * The new node is inserted as a previous sibling to the old node, the old node is hidden, and then the old node is removed.
   *
   * The function currently uses a double buffer approach, but this should be replaced by a view transition once it is more widely supported
   */
  static viewTransition(oldNode, newContent, preProcessCallbacks = [], postProcessCallbacks = []) {
  ```

## Function Design

**Size:**
- Small, focused functions (most utility functions 10-40 lines)
- Larger components may reach 400+ lines when necessary (e.g., `global.js` 1332 lines for multiple classes)

**Parameters:**
- Default parameters used: `preProcessCallbacks = []`
- Spread operators for variable arguments: `function (...args)`
- Array and object destructuring in parameters

**Return Values:**
- Promise-based returns for async operations
- Unsubscriber functions returned from `subscribe()` pattern
- HTML elements returned from DOM queries
- Void returns for event handlers and UI updates

## Module Design

**Exports:**
- Web Components define globally via `customElements.define()` - Example:
  ```javascript
  if (!customElements.get('product-form')) {
    customElements.define('product-form', class ProductForm extends HTMLElement { ... });
  }
  ```

- Utility functions defined at module scope, called as globals
- Classes exported implicitly by definition at module scope

**Barrel Files:**
- Not used - utilities in `global.js` and `constants.js`
- Single responsibility: `constants.js` for constants, `pubsub.js` for pub/sub system

**Web Component Pattern:**
- All components extend `HTMLElement`
- Constructor runs once, binds event handlers with `.bind(this)`
- `connectedCallback()` for initialization when added to DOM
- `disconnectedCallback()` for cleanup when removed from DOM
- Event listeners attached in constructor or `connectedCallback()`
- Unsubscribers stored as instance properties and cleaned up in `disconnectedCallback()`

## Pub/Sub Pattern

**Used extensively for:**
- Cart updates: `PUB_SUB_EVENTS.cartUpdate`
- Variant changes: `PUB_SUB_EVENTS.variantChange`
- Quantity updates: `PUB_SUB_EVENTS.quantityUpdate`
- Error propagation: `PUB_SUB_EVENTS.cartError`

**Implementation:**
```javascript
function subscribe(eventName, callback) { /* returns unsubscriber */ }
function publish(eventName, data) { /* returns Promise */ }
```

## Utility Functions

**Debounce/Throttle Pattern:**
- Debounce used for form input changes: `const debouncedOnChange = debounce((event) => { ... }, ON_CHANGE_DEBOUNCE_TIMER)`
- Throttle used for scroll events: `window.addEventListener('scroll', throttle(() => { ... }))`
- Debounce implementation: clears timeout, sets new one
- Throttle implementation: checks elapsed time since last call

**DOM Utilities:**
- `getFocusableElements(container)` returns Array from NodeList of selectable elements
- `HTMLUpdateUtility.viewTransition()` for animated HTML swaps
- IntersectionObserver for scroll-triggered animations

## Progressive Enhancement

**Philosophy:**
- HTML rendered server-side with Liquid
- JavaScript as progressive enhancement, not required
- Custom elements work with or without JavaScript
- CSS defaults to functional styling, JavaScript adds polish

**Data Attributes:**
- `data-hideErrors`: boolean for error display control
- `data-cascade`: marks elements for staggered animation
- `data-index`: references form field indices
- `data-sticky-type`: configuration for sticky headers

---

*Convention analysis: 2026-04-05*
