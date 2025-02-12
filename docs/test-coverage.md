# SabaiCraft Test Coverage

This document records the testing actually performed during the frontend audit: how the app was run, what was tested, what passed, what failed, and what remains blocked or unverified. Corrections made as a result of this testing are described in [`ui-audit.md`](ui-audit.md); visual evidence is indexed in [`screenshot-index.md`](screenshot-index.md).

## 1. Environment and startup

| Item | Value |
|---|---|
| Machine | macOS (Apple Silicon), Node.js 22+ |
| Backend | `cd backend && npm run dev` (Express 5 + ts-node on port 3001, SQLite via Prisma, seeded `dev.db`) |
| Frontend | `cd frontend && npm run dev` (Vite 8 + React 19) |
| Dev ports used | Backend `3001`; frontend ran on `5174` for most of the session (the canonical `5173` was occupied by an unrelated project) and on `5173` after that project was closed |
| API access | Added a Vite dev proxy (`/api` → `localhost:3001`) plus `frontend/.env` with `VITE_API_URL=/api`, so the storefront talks to the API same-origin and works on any dev port (gitignored `.env`; documented in the README) |
| Browser automation | ZCode in-app browser (Chromium), driven via DOM-level Playwright locators, `evaluate`-based clicks, and DOM event dispatch |

**Automation limitations (honest disclosure):**

- OS-level mouse clicks through the automation surface did not reach the page (repeated `target closed`/timeout errors); interactions were driven through real DOM events (`el.click()`, native setters + `input`/`change` events), which exercise the same React handlers and routing.
- The embedded browser occasionally froze framer-motion entrance animations mid-flight. Screenshots that caught a frozen animation were re-captured after fast-forwarding inline animation styles to their final values — i.e. what a user sees once the (sub-second) entrance animation completes.
- The backend's auth rate limiter (20 requests / 15 min) was hit several times during testing; when that happened, `GET /api/auth/me` returned 429 and the app intentionally kept the local session while deferring backend sync (no retry mechanism exists — see Known Limitations). The dev server was restarted between phases to reset the limiter.

## 2. Baseline checks

| Check | Command | Baseline result |
|---|---|---|
| Lint | `npm run lint` (oxlint) | 39 warnings, **0 errors** (react-compiler advisories, unused vars) |
| Type check | `npx tsc -b` | Clean |
| Production build | `npm run build` (`tsc -b && vite build`) | Success (~1.0 s, 2339 modules) |
| API health | `GET /api/health` | `{"status":"ok"}` |
| Seeded data | API queries | 2 users (admin + demo customer), 7 categories, 11 products, 1 seeded order |

After fixes: lint **39 warnings / 0 errors** (unchanged — no new warnings introduced), type check clean, build success (992 ms).

## 3. Route inventory and direct-navigation tests

26 URLs were opened directly (hard load + refresh behavior) and assessed. Every route rendered its intended content with **zero console errors and zero failed network requests** in the final sweep.

| # | Route | Page | Access | Result |
|---|---|---|---|---|
| 1 | `/` | Home | Public | ✅ Pass |
| 2 | `/shop` | Shop (search/filter/sort/pagination) | Public | ✅ Pass |
| 3 | `/categories` | Categories overview | Public | ✅ Pass |
| 4 | `/category/:slug` (7 slugs) | Category listing | Public | ✅ Pass (incl. empty `toys`, `garments`) |
| 5 | `/product/:slug` | Product detail | Public | ✅ Pass |
| 6 | `/product/nonexistent-product` | Product not-found state | Public | ✅ Pass (graceful empty state) |
| 7 | `/cart` | Cart page | Public | ✅ Pass (empty + filled states) |
| 8 | `/checkout` | Checkout (gated) | Auth required | ✅ Pass (guest sees sign-in gate; authed sees 3-step flow) |
| 9 | `/order-success/:orderId` | Order confirmation | Auth required | ✅ Pass (incl. unknown-id error card) |
| 10 | `/about` | About | Public | ✅ Pass |
| 11 | `/contact` | Contact + FAQ accordion | Public | ✅ Pass |
| 12–19 | `/privacy`, `/terms`, `/shipping`, `/returns`, `/faq`, `/sustainability`, `/cookies`, `/accessibility` | Info pages | Public | ✅ Pass (8/8 slugs, correct titles) |
| 20 | `/login` | Sign in | Public | ✅ Pass (incl. `?redirect=` round-trip) |
| 21 | `/register` | Create account | Public | ✅ Pass (after critical fix; was 404 before) |
| 22 | `/account` | Account dashboard | Protected | ✅ Pass (profile/addresses tabs) |
| 23 | `/orders` | Order history | Protected | ✅ Pass (3 orders incl. delivered) |
| 24 | `/orders/:orderId` | Order detail | Protected | ✅ Pass (5-step timeline, variant attributes) |
| 25 | `/wishlist` | Wishlist | Public (sync when authed) | ✅ Pass (empty + filled states) |
| 26 | unknown URL | 404 | Public | ✅ Pass (after fix; rendered blank before) |

Global components tested: header (desktop + mobile bars), account dropdown, mobile drawer, cart drawer, search modal, toasts, footer (all footer links resolve to declared routes).

## 4. Interaction tests (manual, browser-driven)

| Area | Scenario | Result |
|---|---|---|
| Navigation | All header links, footer links, breadcrumbs, back/forward | ✅ Pass |
| Cart | Quick-add from card, drawer qty ±, remove, empty state, "Add ₹500 more for free shipping" threshold at ₹2,000, totals incl. 18% GST | ✅ Pass (math verified against expected values) |
| Cart persistence | Guest cart survives reload (localStorage), survives **login** after fix, does **not** duplicate on reload after fix | ✅ Pass (pre-fix: cart was wiped on login; first fix attempt duplicated on reload — both caught and corrected) |
| Wishlist | Toggle from PDP/card, page list, merge-on-login after fix, no duplication on reload | ✅ Pass |
| Search | Debounced suggestions with product/price display, "View All Results" → `/shop?q=…` | ✅ Pass |
| Shop controls | Search box, category radios (counts from API), price sliders, in-stock toggle, sort select, grid/list toggle, pagination | ✅ Pass (sort now resets to page 1) |
| Product detail | Variant switch (price updates), qty stepper w/ inventory cap, gallery thumbnails/arrows, zoom modal open/close, tabs, related products | ✅ Pass |
| Auth | Empty-submit validation, invalid credentials toast ("Invalid email or password"), valid login → redirect to `/checkout`, logout, registration (after fix) | ✅ Pass |
| Checkout E2E | Address selection → COD payment → review → place order → success page → order visible in history | ✅ Pass (2 full orders placed with the seeded demo account; COD only, no real payment) |
| Reorder | "Reorder" on a delivered order re-adds items and opens the cart drawer | ✅ Pass (order status set to DELIVERED via the admin API to expose the button) |
| Account | Profile save, stats (exact order count from API), addresses tab, delete-confirmation dialog | ✅ Pass |
| Contact form | Validation + submit → opens prefilled `mailto:` draft (no fake success message) | ✅ Pass |
| 404 | Unknown URLs and unknown info slugs render the 404 page | ✅ Pass (was blank before fix) |

## 5. Responsive checks

| Viewport | Pages checked | Result |
|---|---|---|
| Desktop 1440×900 | All 26 routes | ✅ No layout defects found |
| Laptop 1280×800 | Home, Shop, PDP | ✅ No defects (grid holds 3 columns) |
| Tablet 768×1024 | Home, Shop, PDP, Cart, Orders, About | ✅ Pass after fixes |
| Mobile 390×844 | Home, Shop, PDP, Cart, Orders, About + drawers/modals | ✅ Pass after fixes (see audit for the three overflow defects fixed) |
| Narrow 360px | Order detail timeline | ✅ Pass after fix (timeline scrolls instead of overflowing) |

Measured via `document.documentElement.scrollWidth > window.innerWidth` at each viewport before and after fixes.

## 6. Quality checks (final)

| Check | Result |
|---|---|
| `npx tsc -b` | Clean |
| `npm run lint` (oxlint) | 39 warnings / 0 errors (same warnings as baseline; none introduced by this work) |
| `npm run build` | Success (992 ms) |
| Full route sweep (26 routes, hard loads) | 0 console errors, 0 failed requests |
| Screenshot collection | 36 PNGs, all verified valid (PNG header + size) and visually spot-checked |

## 7. Not tested / limitations

- **No automated test suite exists in the repo** (no unit/integration/E2E framework is configured). All functional testing above was manual browser testing; the only automated checks are lint, type-check, and build. The pre-existing README's mention of Jest/Vitest/Playwright was aspirational — no such tooling is installed.
- **Payments**: only the COD path was exercised (no real payment gateway exists; card/UPI/etc. are UI selections only).
- **Email**: no email service is integrated; order confirmation emails are not sent (the success page no longer claims otherwise).
- **Admin panel**: the backend exposes `/api/admin/*` endpoints and the API client has admin methods, but no admin UI pages exist in the frontend. Admin actions during testing (order status update) were performed via direct API calls to arrange test data.
- **Contact form / newsletter**: there is no backend endpoint for either. The contact form now hands off to the visitor's email client; the newsletter box still shows a simulated success message (documented in the UI audit).
- **Rate limiting**: the auth rate limiter (20 req/15 min) can leave a restored session without backend cart/wishlist sync until the next successful `/auth/me` (no retry is implemented — noted in the audit as a robustness improvement opportunity).
- **Seed data quirk**: the Sabai Coaster Set's product image points at `public/Images/l1.png`, which is a small UI icon rather than a product photo. This lives in the backend seed and was deliberately not modified.
- Cross-browser testing (Firefox/Safari) and real-device testing were not performed; only the embedded Chromium was available.
