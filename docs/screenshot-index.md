# SabaiCraft Screenshot Index

All screenshots were captured from the actual, running local application (React 19 + Vite dev server on `http://localhost:5173`, backed by the Express API on `http://localhost:3001`) after the frontend fixes described in [`ui-audit.md`](ui-audit.md) were applied and regression-tested.

- Viewports: desktop 1440×900, tablet 768×1024, mobile 390×844.
- Every image below exists in this repository; paths are relative to the repository root.
- A few shots show an authenticated customer session (seeded demo account) because those screens require sign-in.

## 1. Overview

### Home — hero (desktop)

![Home page hero — desktop](screenshots/01-overview/home-desktop.png)

The landing view: brand header with navigation, search, wishlist and cart indicators, the hero headline with primary calls-to-action, trust markers, and the subtle Sabai mascot watermark behind the content.

### Home — featured collection (desktop, tall viewport)

![Home featured collection](screenshots/01-overview/home-featured-section.png)

Captured with an extended viewport to show the hero plus the full Featured Collection carousel in one frame: eight featured products with discount badges, wishlist quick-actions, and the "View All Products" link.

### Home — shop by category (desktop)

![Home categories section](screenshots/01-overview/home-categories-section.png)

The category browsing grid with live product counts per category (Bags, Baskets, Coasters, Garments, Hats, Mats, Toys).

### Home — brand story (desktop)

![Home story section](screenshots/01-overview/home-story-section.png)

The brand story block ("Rooted in Tradition, Crafted for Tomorrow") with its sustainability and fair-trade value cards.

### Home (mobile)

![Home page — mobile](screenshots/01-overview/home-mobile.png)

Mobile presentation of the landing page with the compact dark header, hamburger menu, and single-column hero.

### Home — navigation drawer open (mobile)

![Mobile navigation drawer open](screenshots/01-overview/home-mobile-menu-open.png)

The slide-in mobile menu with search shortcut, cart/wishlist quick access, primary navigation, and the authenticated account section (icon and label rendered together after the mobile-drawer layout fix).

## 2. Authentication

### Sign in (desktop)

![Login page — desktop](screenshots/02-authentication/login-desktop.png)

The sign-in screen on the shared auth layout: email/password fields, remember-me, links to registration, and a route-aware redirect parameter (`?redirect=…`).

### Sign in — validation errors (desktop)

![Login validation errors](screenshots/02-authentication/login-validation.png)

Submitting the empty form surfaces inline, per-field validation messages ("Email is required", "Password is required").

### Create account (desktop)

![Register page — desktop](screenshots/02-authentication/register-desktop.png)

Registration with first/last name, email, password strength rules, confirm-password matching, and the newsletter opt-in checkbox. (Registration itself was broken before the endpoint-URL fix documented in the UI audit.)

## 3. Shopping

### Shop — all products (desktop)

![Shop page — desktop](screenshots/03-shopping/shop-desktop.png)

The full catalog with the filter sidebar (search, category radios with live counts, dual price slider, in-stock toggle), result count, sort selector, and grid/list view toggles.

### Categories overview (desktop)

![Categories page — desktop](screenshots/03-shopping/categories-desktop.png)

The curated category browser: dark hero band with the category card grid beneath it (product counts and featured previews per category).

### Category — Baskets (desktop)

![Baskets category page](screenshots/03-shopping/category-baskets-desktop.png)

A category listing with its own breadcrumbs, banner, filters, and product grid — six basket products in this case.

### Category — empty state (desktop)

![Empty category state](screenshots/03-shopping/category-empty-toys.png)

A category with no products renders a friendly "No results found" empty state with a clear-search action instead of a blank grid.

### Product detail (desktop)

![Product detail page — desktop](screenshots/03-shopping/product-detail-desktop.png)

The product page: breadcrumbs, image gallery with thumbnail navigation and prev/next arrows, variant selector (Natural/Beige), quantity stepper, Add to Cart / Buy Now / Wishlist actions, and tabbed description content.

### Product image zoom modal (desktop)

![Product zoom modal](screenshots/03-shopping/product-zoom-modal.png)

Clicking the main image opens an accessible full-size zoom dialog (named via `aria-label` after the Modal component fix).

### Search modal (desktop)

![Search modal with suggestions](screenshots/03-shopping/search-modal.png)

The global search overlay (⌘K) with debounced backend suggestions, product thumbnails, prices, and a "View All Results" link.

### Cart drawer (desktop)

![Cart drawer](screenshots/03-shopping/cart-drawer.png)

The slide-in cart with line-item quantity controls, remove action, subtotal, shipping, 18% GST line, total, and View Cart / Checkout actions.

### Cart page (desktop)

![Cart page — desktop](screenshots/03-shopping/cart-page.png)

The full cart page with editable line items and the order summary panel (unit-based item counts and the corrected "18% GST added at checkout" copy).

## 4. Checkout

### Checkout — shipping step (desktop)

![Checkout shipping step](screenshots/04-checkout/checkout-shipping.png)

The three-step checkout progress indicator with saved-address selection and an inline "+ New address" form.

### Checkout — payment step (desktop)

![Checkout payment step](screenshots/04-checkout/checkout-payment.png)

Payment method selection: Cash on Delivery, Card, UPI, Net Banking, and Wallet, each with a short descriptor.

### Checkout — review step (desktop)

![Checkout review step](screenshots/04-checkout/checkout-review.png)

Order review with editable shipping address and payment method, line items, and the final total before placing the order.

### Order success (desktop)

![Order success page](screenshots/04-checkout/order-success.png)

The confirmation screen with the real order number, total, item count, payment method, placed timestamp, estimated delivery, and the "What Happens Next" timeline. (The fabricated "Confirmation Email: Sent" row was removed — see the UI audit.)

## 5. Account & orders

### My orders (desktop)

![Orders list](screenshots/05-account/orders-list.png)

Paginated order history with status badges, placed dates, unit counts, payment method, totals, and View / Reorder actions (Reorder appears for delivered orders and re-adds the items to the cart).

### Order detail (desktop)

![Order detail page](screenshots/05-account/order-detail.png)

A delivered order with the five-step progress timeline, line items (variant attributes displayed correctly, e.g. "color: Natural"), shipping address, payment summary, and totals.

### Wishlist with item (desktop)

![Wishlist with item](screenshots/05-account/wishlist-with-item.png)

The wishlist page with a saved product card and remove action; wishlist items sync to the backend for signed-in users.

### My account — profile & security (desktop)

![Account profile](screenshots/05-account/account-profile.png)

The account dashboard: profile form, order/spending statistics, wishlist and address counters, and the change-password form.

### My account — addresses (desktop)

![Account addresses](screenshots/05-account/account-addresses.png)

The address book tab with add/edit/delete (delete asks for confirmation) and default-address marking.

## 6. Content pages

### About us (desktop)

![About page](screenshots/06-content/about-desktop.png)

The brand story page with the mascot-textured hero band, values grid, and calls-to-action.

### Contact us (desktop)

![Contact page](screenshots/06-content/contact-desktop.png)

Contact details, business info, the contact form (hands the message to the visitor's email client via `mailto:`), and the FAQ accordion.

### Info page — Privacy Policy (desktop)

![Privacy policy page](screenshots/06-content/info-privacy.png)

Representative slug-based info page (privacy, terms, shipping, returns, FAQ, sustainability, cookies, accessibility all follow this layout).

### 404 — page not found (desktop)

![404 page](screenshots/06-content/not-found.png)

The not-found page (also shown for unknown info-page slugs) with recovery links to popular destinations.

## 7. Responsive views

### Home (tablet, 768px)

![Home page — tablet](screenshots/07-responsive/home-tablet.png)

Tablet layout with the compact mobile-style header and scaled hero.

### Shop (mobile, 390px)

![Shop page — mobile](screenshots/07-responsive/shop-mobile.png)

The shop page collapses filters behind a toggle and stacks the product grid in a single column.

### Product detail (mobile, 390px)

![Product detail — mobile](screenshots/07-responsive/product-detail-mobile.png)

The product page after the grid-overflow fix: gallery, variant selector, and actions stack vertically with no horizontal scrolling.

### Cart with item (mobile, 390px)

![Cart — mobile](screenshots/07-responsive/cart-mobile.png)

The cart page on mobile with the editable line item and the order summary stacked below.

### Cart empty state (mobile, 390px)

![Cart empty state — mobile](screenshots/07-responsive/cart-empty-mobile.png)

The empty-cart state with guidance and a "Continue Shopping" action.
