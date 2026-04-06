# Testing Patterns

**Analysis Date:** 2026-04-05

## Test Framework

**Status:**
- No automated testing framework configured
- No test files (*.test.js, *.spec.js) present in codebase
- No Jest, Vitest, Mocha, or other test runner configuration

**Quality Assurance:**
- Testing handled via GitHub Actions CI/CD pipeline
- Theme Check linting: `shopify theme check`
- Lighthouse CI for performance metrics
- Manual testing on development stores

**Recommended Tools (not currently used):**
- Jest or Vitest would be appropriate for Web Component testing
- Testing Library Web Components for DOM interaction testing

## CI/CD Pipeline

**Location:** `.github/workflows/ci.yml`

**Test Runners:**
- Shopify/theme-check-action: Validates Liquid and theme structure
- Shopify/lighthouse-ci-action: Measures performance (performance, accessibility, SEO)

**Run Commands:**
```bash
shopify theme check                    # Lint theme locally
```

## Testing Strategy

**No Unit Tests** - This is a Shopify theme, not a library. Testing philosophy:
1. Manual testing on development store via `shopify theme serve`
2. Linting via Theme Check (Liquid/theme validation)
3. Performance monitoring via Lighthouse CI
4. Code review process for quality gates

**Development Workflow:**
```bash
# Start local server
shopify theme serve

# Run linting
shopify theme check

# Push to GitHub - triggers CI checks
# GitHub Actions runs Theme Check + Lighthouse on PRs
```

## Code Quality Tools

**Prettier:**
- Formatting enforced via VS Code on-save
- Config: `.prettierrc.json`
- Applied to: JavaScript files and Liquid templates

**Theme Check:**
- VS Code extension: `Shopify.theme-check-vscode`
- Disables: `MatchingTranslations`, `TemplateLength` (too strict)
- Config: `.theme-check.yml`

**VS Code Settings:**
- `editor.formatOnSave: true` for JavaScript and Liquid
- `themeCheck.checkOnSave: true` for real-time validation
- Recommended extensions in `.vscode/extensions.json`

## Testing Principles from CONTRIBUTING.md

**No TDD approach** - Testing focused on validation, not unit coverage

**Quality Assurance via Code Review:**
- Self-review checklist before PR submission
- Theme code principles verification: web-native, lean, fast, reliable, server-rendered
- Shopify team review of all PRs
- Performance requirements enforced:
  - Zero Cumulative Layout Shift
  - No DOM manipulation before user input
  - No render-blocking JavaScript
  - No long tasks (>50ms)

## Performance Testing

**Lighthouse CI:**
- Tests on home, product, and collections pages
- Ensures code changes don't degrade performance
- Metrics tracked: performance score, CLS, LCP, FID

**Manual Performance Testing:**
- Developers test locally with DevTools
- Network throttling: simulate real user conditions
- Monitor for long tasks and paint events

## Manual Test Patterns

**Web Component Testing:**
- Create test store with test products/collections
- Use browser DevTools to inspect element state
- Test interactive elements: click, form submission, keyboard navigation
- Monitor console for errors

**Accessibility Testing:**
- Test keyboard navigation (Tab, Enter, Escape)
- Screen reader testing recommended but not formalized
- Semantic HTML validated via Theme Check

**Browser Compatibility:**
- Evergreen browsers (Chrome, Firefox, Safari Edge) - full support
- Legacy browsers - fail-open progressive enhancement
- No polyfills, rely on browser graceful degradation

## Error Handling Validation

**No specific test patterns** - errors handled in code via:
- Promise `.catch()` blocks with error logging
- DOM-based error state management
- User-facing error messages via inline DOM updates

**Validation Testing:**
- HTML5 form validation: `setCustomValidity()`, `reportValidity()`
- Custom validation in event handlers (min, max, step constraints)
- Server response error handling in product-form and cart operations

## Development Store Testing

**Recommended Test Scenarios:**
1. **Product Page:**
   - Add to cart with variant selection
   - Verify cart notification appears
   - Check error handling for sold-out variants

2. **Cart:**
   - Update quantity with debounce working (no duplicate requests)
   - Remove items
   - Verify live region announcements for accessibility

3. **Search:**
   - Predictive search with debounce
   - Form submission handling
   - Keyboard navigation in results

4. **Localization:**
   - Country/locale selector interaction
   - Drawer opening/closing
   - Filter functionality

5. **Animations:**
   - Scroll-triggered animations on intersection
   - Zoom animations on scroll
   - Reduced motion preference respected

## Code Review Checklist

**From CONTRIBUTING.md, developers must verify:**
- Changes meet theme code principles (web-native, lean, fast, reliable, server-rendered)
- Liquid usage is current (no deprecated filters/tags)
- Theme Check passes
- No performance regressions in Lighthouse
- Accessibility best practices followed
- Progressive enhancement maintained

## Known Limitations

**No Test Framework** - No plans documented for test framework adoption. This aligns with:
- Shopify's web-native philosophy (no abstraction layers)
- Theme simplicity and size constraints
- Focus on manual validation and CI/CD checks

**No Mocking Library** - Manual mocking patterns used when needed:
- Mock cart state by updating localStorage
- Mock fetch responses in browser console
- Mock Shopify objects in development store

---

*Testing analysis: 2026-04-05*
