# Roadmap: Haze DTC Shopify Store

**Milestone:** v1 Launch
**Granularity:** Coarse
**Created:** 2026-04-05
**Coverage:** 30/30 v1 requirements

---

## Phases

- [ ] **Phase 1: Foundation** — Dev environment, design system tokens, and site chrome (nav/footer)
- [ ] **Phase 2: Core Pages** — Homepage sections and hover video framework
- [ ] **Phase 3: PDP & Supporting Pages** — Product detail page (the conversion page) and About/FAQ

---

## Phase Details

### Phase 1: Foundation
**Goal**: The build environment is running and every page on the site shares a consistent visual identity
**Depends on**: Nothing (first phase)
**Requirements**: DEV-01, DEV-02, DEV-03, DESIGN-01, DESIGN-02, DESIGN-03, DESIGN-04, NAV-01, NAV-02, NAV-03
**Success Criteria** (what must be TRUE):
  1. `shopify theme dev` serves a local preview and changes hot-reload in the browser
  2. Pushing a commit to GitHub automatically syncs the unpublished theme to the Shopify store
  3. Any page on the store renders Cormorant Garamond headings and DM Sans body copy with correct fallbacks
  4. The terracotta/cream/blush color scheme is visible sitewide via the Customize panel — no hardcoded hex in any file
  5. Every page shows the branded header (logo, 3 nav links, cart icon, hamburger on mobile) and footer ("Stay tender." tagline, policy links, social icons) with zero broken links
**Plans:** 3 plans
Plans:
- [ ] 01-01-PLAN.md — Dev environment setup, admin content creation, and CLAUDE.md brand identity
- [ ] 01-02-PLAN.md — Design system tokens (haze-tokens.css) and Google Fonts loading
- [ ] 01-03-PLAN.md — Navigation chrome (header CSS overrides, footer config, brand colors via Customize)
**UI hint**: yes

### Phase 2: Core Pages
**Goal**: The homepage delivers the full brand experience — hero, product showcase, value props, social proof, and call to action — with the hover video framework wired and ready for real video assets
**Depends on**: Phase 1
**Requirements**: HOME-01, HOME-02, HOME-03, HOME-04, HOME-05, VIDEO-01, VIDEO-02, VIDEO-03, VIDEO-04, VIDEO-05
**Success Criteria** (what must be TRUE):
  1. The homepage hero occupies the full viewport with a placeholder image, "Stay tender." headline, and a CTA button that navigates to the PDP
  2. Five product grid cards (4 kit components + gift box) render with placeholder images; hovering a card on desktop triggers the video playback state (even if no video is loaded yet)
  3. Three value prop blocks and the bottom CTA section are visible on mobile at 375px with correct spacing
  4. The social proof section exists in markup and is hidden by default; toggling a Customize panel setting makes it visible
  5. Scrolling a card off-screen pauses its video; `prefers-reduced-motion` users see only static images throughout
**Plans:** 2/3 plans executed
Plans:
- [x] 02-01-PLAN.md — Full-viewport hero section (haze-hero.liquid + CSS)
- [x] 02-02-PLAN.md — Product grid with video hover framework (haze-product-grid + card snippet + JS)
- [ ] 02-03-PLAN.md — Value props, social proof, bottom CTA sections + homepage template wiring
**UI hint**: yes

### Phase 3: PDP & Supporting Pages
**Goal**: A visitor arriving from TikTok can read about the Hair Ritual Kit and add it to cart; About and FAQ pages give the brand depth and satisfy footer link requirements
**Depends on**: Phase 1
**Requirements**: PDP-01, PDP-02, PDP-03, PDP-04, PDP-05, PDP-06, PDP-07, PAGE-01, PAGE-02, PAGE-03
**Success Criteria** (what must be TRUE):
  1. Swiping through the PDP image gallery on mobile advances the dot indicator in sync with no JavaScript swipe library
  2. The "Add to Cart" button opens Dawn's native cart drawer with the Hair Ritual Kit in it — no page navigation, no custom cart
  3. The ritual description, 4 ingredient icon blocks, and FAQ accordion are all visible above the fold on a 390px viewport without horizontal scroll
  4. Opening one FAQ item does not close another; clicking the same item again closes it
  5. The About page, FAQ page, and three policy pages all load without 404 and are reachable via footer links
**Plans**: TBD
**UI hint**: yes

---

## Progress

| Phase | Plans Complete | Status | Completed |
|-------|----------------|--------|-----------|
| 1. Foundation | 0/3 | Planning complete | - |
| 2. Core Pages | 2/3 | In Progress|  |
| 3. PDP & Supporting Pages | 0/? | Not started | - |

---

*Roadmap created: 2026-04-05*
*Last updated: 2026-04-08 after Phase 2 planning complete (3 plans in 2 waves)*
