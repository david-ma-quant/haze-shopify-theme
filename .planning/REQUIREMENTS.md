# Requirements: Haze DTC Shopify Store

**Defined:** 2026-04-05
**Core Value:** TikTok visitors land on haze.hair and can purchase the Hair Ritual Kit in under 60 seconds

## v1 Requirements

### Dev Environment

- [ ] **DEV-01**: Shopify CLI v3 authenticated and serving local preview
- [ ] **DEV-02**: GitHub → Shopify auto-sync connected (unpublished theme)
- [ ] **DEV-03**: Project CLAUDE.md committed with brand tokens, design rules, no-touch zones

### Design System

- [ ] **DESIGN-01**: Brand colors wired via Customize panel (terracotta CTA, cream background, blush accent)
- [ ] **DESIGN-02**: Google Fonts loaded (Cormorant Garamond headings, DM Sans body) with fallbacks
- [ ] **DESIGN-03**: Static CSS tokens in `haze-tokens.css` (spacing scale, border radius, font overrides)
- [ ] **DESIGN-04**: Mobile-first responsive (375px base, Dawn breakpoints 750px/990px)

### Navigation

- [ ] **NAV-01**: Header with logo, 3 nav links (Shop/About/FAQ), cart icon; hamburger on mobile
- [ ] **NAV-02**: Footer with "Stay tender." tagline, social icons, 3 policy links
- [ ] **NAV-03**: All nav links resolve without 404 (pages/product must exist in admin)

### Homepage

- [x] **HOME-01**: Full-viewport hero with background image, "Stay tender." headline, CTA to PDP
- [x] **HOME-02**: 5-card hardcoded product grid (4 kit components + gift box) with hover-video framework
- [ ] **HOME-03**: 3 value prop blocks (icon + heading + text)
- [ ] **HOME-04**: Social proof placeholder section (hidden by default, toggle-able)
- [ ] **HOME-05**: Bottom CTA section (compact hero variant, blush color scheme)

### PDP

- [ ] **PDP-01**: CSS scroll-snap image gallery (4 images, dot indicator synced by JS)
- [ ] **PDP-02**: Product info with price, kit contents richtext, and ATC form (single variant)
- [ ] **PDP-03**: Ritual description block with serif treatment above ATC
- [ ] **PDP-04**: 4 ingredient icon blocks (SVG + material name + descriptor)
- [ ] **PDP-05**: FAQ accordion via native `<details>/<summary>` (multiple can be open)
- [ ] **PDP-06**: ATC form triggers Dawn's cart-drawer (no custom cart page)
- [ ] **PDP-07**: Custom template `product.haze.json` assigned to Hair Ritual Kit

### About & FAQ

- [ ] **PAGE-01**: About page with hero image + two-column editorial layout (brand story + tool philosophy)
- [ ] **PAGE-02**: FAQ page with accordion (5+ default questions)
- [ ] **PAGE-03**: Native Shopify policy pages created and linked from footer

### Hover Video

- [x] **VIDEO-01**: Card snippet renders static image when no video URL; `<video>` tag when URL set
- [x] **VIDEO-02**: Intersection Observer JS pauses off-screen videos; mouseenter/mouseleave on desktop
- [x] **VIDEO-03**: Touch device fallback via viewport-triggered autoplay
- [x] **VIDEO-04**: `prefers-reduced-motion` disables video entirely
- [x] **VIDEO-05**: JS loads only on homepage (`request.page_type == 'index'`)

## v2 Requirements

### Post-Launch

- **V2-01**: Replace all placeholder images with real product photography
- **V2-02**: Add real hover video assets to product grid cards
- **V2-03**: Connect custom domain haze.hair
- **V2-04**: Enable social proof section with real reviews
- **V2-05**: TikTok bio link optimization (homepage vs PDP direct)

## Out of Scope

| Feature | Reason |
|---------|--------|
| Multi-product catalog / variant picker | Single SKU only — Hair Ritual Kit |
| Third-party Shopify apps | Native services sufficient for v1 |
| Subscription/membership | Not v1 scope |
| Multi-language | US market only |
| Custom checkout modifications | Native Shopify checkout is fine |
| Real product photography | Placeholders until samples arrive |
| API-generated images | Manual Ideogram web UI for ~6 images |

## Traceability

| Requirement | Phase | Status |
|-------------|-------|--------|
| DEV-01 | Phase 1 | Pending |
| DEV-02 | Phase 1 | Pending |
| DEV-03 | Phase 1 | Pending |
| DESIGN-01 | Phase 1 | Pending |
| DESIGN-02 | Phase 1 | Pending |
| DESIGN-03 | Phase 1 | Pending |
| DESIGN-04 | Phase 1 | Pending |
| NAV-01 | Phase 1 | Pending |
| NAV-02 | Phase 1 | Pending |
| NAV-03 | Phase 1 | Pending |
| HOME-01 | Phase 2 | Complete |
| HOME-02 | Phase 2 | Complete |
| HOME-03 | Phase 2 | Pending |
| HOME-04 | Phase 2 | Pending |
| HOME-05 | Phase 2 | Pending |
| VIDEO-01 | Phase 2 | Complete |
| VIDEO-02 | Phase 2 | Complete |
| VIDEO-03 | Phase 2 | Complete |
| VIDEO-04 | Phase 2 | Complete |
| VIDEO-05 | Phase 2 | Complete |
| PDP-01 | Phase 3 | Pending |
| PDP-02 | Phase 3 | Pending |
| PDP-03 | Phase 3 | Pending |
| PDP-04 | Phase 3 | Pending |
| PDP-05 | Phase 3 | Pending |
| PDP-06 | Phase 3 | Pending |
| PDP-07 | Phase 3 | Pending |
| PAGE-01 | Phase 3 | Pending |
| PAGE-02 | Phase 3 | Pending |
| PAGE-03 | Phase 3 | Pending |

**Coverage:**
- v1 requirements: 30 total
- Mapped to phases: 30
- Unmapped: 0 ✓

---
*Requirements defined: 2026-04-05*
*Last updated: 2026-04-05 — NAV-01/02/03 moved to Phase 1 (site chrome is Foundation work)*
