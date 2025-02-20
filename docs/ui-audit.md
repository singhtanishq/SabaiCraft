# SabaiCraft UI Audit

Findings from the frontend audit and the corrections applied. Everything here was reproduced against the running application (evidence via DOM inspection, network monitoring, screenshots, or direct code inspection with file/line references) before being fixed. Corrections were then regression-tested — see [`test-coverage.md`](test-coverage.md); before/after visuals are indexed in [`screenshot-index.md`](screenshot-index.md).

Severity legend: **Critical** = feature broken for users · **High** = visibly wrong or misleading · **Medium** = defect affecting quality/usability · **Low** = polish.

---

## 1. Critical

### C-1 · Registration always failed with 404
- **Where:** `frontend/src/services/api.ts:71`
- **Observed:** The register endpoint was written as `` `'/auth/register'` `` — a template literal containing quote characters. Every sign-up POSTed to `/api'/auth/register'` and failed with "Registration failed · Route not found" (confirmed live: `404 /api'/auth/register'`).
- **Fix:** Removed the stray quotes; endpoint is now `'/auth/register'`.
- **Verified:** Created a fresh account end-to-end in the browser; redirected to `/account` with an authenticated session.

### C-2 · Unknown URLs rendered a completely blank page (404 unreachable)
- **Where:** `frontend/src/pages/InfoPage.tsx` + route ranking in `App.tsx`
- **Observed:** Unknown paths (and `/404` itself) matched the `/:slug` info route, which redirected to `/404` — which matched `/:slug` again. Result: an empty `<main>` and an infinite redirect loop; the NotFoundPage component was effectively dead code. Confirmed live: `main.innerHTML.length === 0` on hard load.
- **Fix:** `InfoPage` renders `<NotFoundPage />` directly for unknown slugs (with a comment explaining why redirecting cannot work), and `NotFoundPage` now sets `document.title = 'Page Not Found | SabaiCraft'`.
- **Verified:** `/does-not-exist` and any unknown slug render the full 404 page with recovery links (screenshot `06-content/not-found.png`).

## 2. High

### H-1 · Guest cart silently wiped on sign-in
- **Where:** `frontend/src/store/cartStore.ts` (`enableBackendSync`), callers in `authStore`
- **Observed:** On login, `enableBackendSync()` fetched the (empty) backend cart and overwrote the local persisted cart. A guest's items vanished at sign-in, even though the checkout gate promises "Your cart will be waiting for you." Reproduced: guest cart 1 item → login → 0 items.
- **Fix:** `enableBackendSync({ merge: true })` now POSTs each local item to the backend cart before fetching the merged result. Merging runs **only** on fresh login/register; session restores call it without the flag. (An intermediate version of this fix merged on every session restore and duplicated items on each reload — caught during regression testing (cart ballooned to 16 identical items) and corrected.)
- **Verified:** Guest adds 1 item → login → 1 item in backend cart; two reloads → still exactly 1 item.

### H-2 · Guest wishlist had the same wipe-on-login flaw
- **Where:** `frontend/src/store/wishlistStore.ts`
- **Observed:** Same pattern as H-1: `fetchWishlist()` replaced local items with the (empty) backend list on sign-in.
- **Fix:** Same merge-on-fresh-login pattern (`enableBackendSync({ merge: true })`), no merge on session restore.
- **Verified:** Guest wishlist item survives login exactly once; reloads do not duplicate it.

### H-3 · Order detail rendered variant attributes as garbage characters
- **Where:** `frontend/src/pages/OrderDetailPage.tsx:243`
- **Observed:** `Object.entries(item.variantAttributes)` was called on a **JSON string** (the backend stores `{"color":"Natural"}` as a string), enumerating it character-by-character. The order page displayed `0: { • 1: " • 2: c • 3: o …` instead of the variant.
- **Fix:** Parsed with the existing `parseVariantAttributes()` util (`@utils/normalize`) before enumerating.
- **Verified:** Order detail now shows `color: Natural` (screenshot `05-account/order-detail.png`).

### H-4 · Product detail page overflowed horizontally on mobile by ~82px
- **Where:** `frontend/src/pages/ProductDetailPage.tsx` (image/info grid)
- **Observed:** The two-column grid's track sized itself to the product image's intrinsic width (grid items default to `min-width: auto`), pushing the page to 472px wide on a 390px viewport.
- **Fix:** Added `min-w-0` to both grid items (canonical grid-blowout fix).
- **Verified:** `scrollWidth` 384 ≤ 390 on `/product/sabai-tote-bag` at 390px.

### H-5 · Product page strikethrough price ignored variant pricing
- **Where:** `frontend/src/pages/ProductDetailPage.tsx:149-150, 322-331`
- **Obspected:** The displayed price used the selected variant but the strikethrough/"Save N%" badge used the product-level `compareAtPrice`, so e.g. the Beige variant (₹1,500 / compare ₹1,800) showed a strike-through of ₹1,700 — a price not actually shown anywhere.
- **Fix:** Introduced `activePrice` / `activeCompareAtPrice` (variant values with product-level fallback) used by the discount calculation and display.
- **Verified:** Variant switch updates price, strike-through, and savings badge consistently.

### H-6 · Decorative mascot background never rendered anywhere
- **Where:** `CategoryPage.tsx:120`, `CategoriesPage.tsx:35`, `AboutPage.tsx:57+255`, `ContactPage.tsx:95`, `Newsletter.tsx:35`, `Hero.tsx:13`
- **Observed:** `bg-[url('/Images/sabai mascot.png')]` contains an unescaped space, splitting the class into two tokens; Tailwind never generated the rule (`getComputedStyle(...).backgroundImage === 'none'`).
- **Fix:** Copied the asset to `public/Images/sabai-mascot.png` (no spaces) and updated all six references. The original file was left in place.
- **Verified:** Computed `background-image` now resolves to the new asset; the watermark is visible in the hero (screenshot `01-overview/home-desktop.png`).

## 3. Medium

### M-1 · Shop/catalog silently truncated to 50 products
- **Where:** `frontend/src/hooks/useCatalog.ts`
- **Observed:** The catalog was fetched once with `limit: 50` and all shop/category/search/sort/pagination happened client-side, so products beyond the first 50 would silently disappear from every listing.
- **Fix:** The catalog loader now pages through the API (50 per page, capped at 20 pages) before handing the full list to the client-side pipeline.
- **Verified:** Shop still shows all 11 products; logic covers growth beyond the first page.

### M-2 · "Reorder" button did not reorder
- **Where:** `frontend/src/pages/OrdersPage.tsx:184-189`
- **Observed:** The Reorder button on delivered orders linked to the order detail page — identical to the adjacent "View" button.
- **Fix:** Implemented real reordering: each order item is added back to the cart (optimistic add with the data available on the order; the backend revalidates prices/inventory on sync), with a success toast, loading state, and the cart drawer opening.
- **Verified:** Clicked Reorder on a delivered order → cart gained the items, drawer opened (screenshot evidence in test log).

### M-3 · Contact form faked a successful submission
- **Where:** `frontend/src/pages/ContactPage.tsx:70-85`
- **Observed:** Submitting waited 1 second on a `setTimeout` and then showed "Message Sent!" — no message was ever stored or sent.
- **Fix:** The form now composes a prefilled `mailto:contact@sabaicraft.com` draft (subject + body from the form) and toasts "Opening your email app…". The dead success spinner/state machinery was removed.
- **Verified:** Submitting opens a real email draft with the entered content.

### M-4 · Order success page showed fabricated data
- **Where:** `frontend/src/pages/OrderSuccessPage.tsx:48, 101-120`
- **Observed:** Always claimed "Confirmation Email: Sent" (no email service exists), "Paid online" for any non-COD method regardless of `paymentStatus`, and computed "Estimated Delivery" from render time instead of the order.
- **Fix:** Payment line derives from `paymentStatus`; the email row was replaced with the real "Order Placed" timestamp; delivery estimate is anchored to `placedAt`; the "Thank You" headline swaps to "Order Not Found" when the order cannot be loaded.
- **Verified:** COD order shows "Cash on Delivery", real placed time, honest headline on failure (screenshot `04-checkout/order-success.png`).

### M-5 · Account "Member since —" could never display a date
- **Where:** `frontend/src/pages/AccountPage.tsx:410-415`
- **Observed:** The backend never returns `createdAt` for the user, so the UI permanently rendered "Member since —" (looks broken).
- **Fix:** The line renders only when a signup date exists. (Backend change required to actually surface the date — see Limitations.)

### M-6 · Account order statistics wrong beyond 50 orders
- **Where:** `frontend/src/pages/AccountPage.tsx:83-86, 244`
- **Observed:** "Total Orders" counted the fetched slice (capped at 50).
- **Fix:** Uses the API's `pagination.total` for the count. ("Total Spent" still sums the fetched slice — a summary endpoint would be needed for exactness; noted in Limitations.)

### M-7 · Product zoom modal had no accessible name
- **Where:** `frontend/src/pages/ProductDetailPage.tsx:622` + `components/ui/Modal.tsx`
- **Observed:** The PDP passed `aria-label` to `Modal`, whose props don't include it; the zoom dialog opened with `role="dialog"` and no accessible name.
- **Fix:** Added an `ariaLabel` prop to `Modal` (applied when no visible title exists); PDP passes `ariaLabel="Product image zoom"`.

### M-8 · Mobile drawer account links split icon and label to opposite edges
- **Where:** `frontend/src/components/layout/MobileDrawer.tsx:54-60, 148-161`
- **Observed:** Account links reused the main-nav link classes (`justify-between`, designed for links with trailing chevrons), rendering the icon hard-left and the label hard-right with empty space between.
- **Fix:** `linkClasses` takes a `justified` flag; account links keep icon + label together. Verified in the re-captured mobile drawer screenshot.

### M-9 · Horizontal overflow on Home/About (mobile) from scroll-reveal offsets
- **Where:** `frontend/src/components/layout/MainLayout.tsx` + `ScrollReveal` usage with `x` offsets
- **Observed:** Sections animating in from `x: ±30` sat outside the viewport until revealed, creating 8px of horizontal scrollability at 390px before the user scrolled.
- **Fix:** `overflow-x-clip` on the layout root (clips decorative/reveal offsets without breaking the fixed header). Hero's absolutely-positioned decorative blob is clipped by the same rule.
- **Verified:** `scrollWidth` equals viewport on `/`, `/about`, `/product/…` at 390px.

### M-10 · Sort change kept the user on their current page
- **Where:** `frontend/src/pages/ShopPage.tsx`, `frontend/src/pages/CategoryPage.tsx`
- **Observed:** Changing the sort re-sorted all products but preserved the page number, dropping users into the middle of the re-sorted list.
- **Fix:** Both pages reset to page 1 on sort change.
- **Verified:** Sort select applies and paging resets (cheapest product shown first for price-ascending).

### M-11 · Cart copy contradicted the totals
- **Where:** `CartPage.tsx:196`, `OrderDetailPage.tsx:381`, `InfoPage.tsx:72` (terms), PDP
- **Observed:** Summaries said "18% GST included" while the totals **added** GST on top of the subtotal.
- **Fix:** Copy now reads "18% GST added at checkout" everywhere; the terms page was aligned to match.

### M-12 · Cart counts line items instead of units
- **Where:** `frontend/src/pages/CartPage.tsx:41, 145`
- **Observed:** "1 item in your cart" / "Subtotal (1 items)" for a quantity-2 line.
- **Fix:** Header and subtotal now use the summed unit count (matching the orders pages).

### M-13 · Mock fallback advertised wrong category counts
- **Where:** `frontend/src/data/products.ts`
- **Observed:** Hardcoded `productCount`s (12/8/6/…) didn't match the mock products actually present, so API-less fallback mode showed wrong counts and empty categories.
- **Fix:** Counts are derived from the mock product list at module load.

### M-14 · Address deletion was a single irreversible click
- **Where:** `frontend/src/pages/AccountPage.tsx:523-531`
- **Fix:** Delete now opens a confirmation dialog ("Delete address?") with Cancel/Delete actions (uses the existing `Modal`).

### M-15 · Broken-image icons when a product/cart item has no image
- **Where:** `CartPage.tsx:67`, `CheckoutPage.tsx:564`, `CartDrawer.tsx:61`, order item thumbnails in `OrdersPage`/`OrderDetailPage`
- **Fix:** Conditional placeholder (ImageOff/Package icon) renders when no image URL exists.

## 4. Low

| # | Where | Issue | Fix |
|---|---|---|---|
| L-1 | `NotFoundPage.tsx:32` | JSX text contained literal backslash escapes (`couldn\'t`) and rendered them | Plain apostrophes |
| L-2 | `CategoryPage` | No document title (stale title from previous page) | Title effect: `"Baskets | SabaiCraft"` etc. |
| L-3 | `ProductDetailPage.tsx:108-112` | Default variant could be out-of-stock, opening the page with a disabled Add-to-Cart | Defaults to the first in-stock variant |
| L-4 | `ProductDetailPage.tsx:154` | Dead `category` variable | Removed |
| L-5 | `AboutPage.tsx` | Misplaced duplicate `ChevronRight` import after the component; CTA used a full-reload `<a href="/shop">` | Merged into the top import; CTA is now a `<Link>`; decorative icon got `aria-hidden` |
| L-6 | `OrdersPage.tsx:109` | Empty-state button did `window.location.href = '/shop'` (full reload) | `useNavigate` |
| L-7 | `EmptyState.tsx` (`EmptySearch`) | "Clear Search" did a full page reload | SPA navigate |
| L-8 | `ShopPage/CategoryPage/WishlistPage/ContactPage/home` grids | `role="list"` on divs whose children are `<article>`s (invalid ARIA) | Removed the role |
| L-9 | `EmptyState.tsx` | Title always `<h3>`, so page-level empty states skipped heading order | Optional `headingLevel` prop; PDP not-found uses `<h1>` |
| L-10 | `OrdersPage/OrderDetailPage` | Empty bordered squares for items without images | Conditional placeholders (see M-15) |
| L-11 | `OrderDetailPage` timeline | Fixed-width 5-step timeline overflowed at ≤360px | Scrollable wrapper (`overflow-x-auto`, `min-w-[30rem]`) |
| L-12 | `ProductCard.tsx:124` | List-variant title hover never applied (missing `group` class) | Added `group` |
| L-13 | `AccountPage` address form | Phone validated only for emptiness (checkout used a format regex) | Same `[\d+\-\s()]{10,15}` rule reused |
| L-14 | `RegisterPage` newsletter checkbox | Uncontrolled and never read | Bound to state; preference persisted locally (no newsletter backend exists) |
| L-15 | `InfoPage.tsx:298` | Unknown slugs navigated to a `/404` URL that matched `/:slug` again | Covered by C-2 (renders NotFoundPage directly) |

## 5. Working well (verified, no changes needed)

- **State stores**: optimistic cart updates with revert-on-failure, per-variant wishlist identity, persisted auth with session-expiry handling (`sabaicraft:session-expired` event → logout + toast).
- **Checkout math**: subtotal, free-shipping threshold (₹2,000), 18% GST, and total all reconcile across drawer, cart page, checkout, and order records (₹3,000 + ₹0 shipping + ₹540 GST = ₹3,540 verified end-to-end).
- **API client**: consistent error envelope handling, non-JSON body guards, 401 session-expiry broadcast.
- **Accessibility fundamentals**: semantic landmarks, labelled icon buttons, `aria-current` nav state, drawer/modal focus traps with Escape handling, `aria-live` quantity readouts, reduced-motion CSS.
- **Forms**: react-hook-form + zod on auth forms with inline field errors and server-error toasts.
- **Backend contract**: orders, addresses, wishlist, and cart sync all behave per the API; zero failed network requests in the final sweep.

## 6. Known limitations after the audit

1. **Newsletter opt-in has no backend.** The checkbox is now wired to state and persisted locally, but subscribing still shows a simulated success message. A newsletter service/endpoint is required to make it real.
2. **"Member since" needs a backend field.** The auth endpoints select only `id/email/name/role`; adding `createdAt` to the response would let the (now conditional) account line display.
3. **"Total Spent" is exact only up to the 50-order fetch window** unless a summary endpoint is added.
4. **Coaster Set product image is a UI icon** (`public/Images/l1.png`, 81×81 "return box" icon) — the backend seed points the product at it. Fixing requires a seed/data change (out of frontend scope).
5. **No retry for deferred backend sync.** If `/auth/me` fails transiently (e.g. the 20-requests/15-min auth rate limiter), the session is kept but cart/wishlist sync is deferred until the next successful init; an automatic retry would harden this.
6. **Contact form relies on the visitor's email client** (honest `mailto:` hand-off) until a messages endpoint exists.
7. **Guest checkout does not exist.** Browsing/cart work signed-out, but `/checkout` gates on sign-in because the orders API requires authentication (the old README claimed guest checkout; the claim was removed).
