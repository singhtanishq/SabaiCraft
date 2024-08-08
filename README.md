# SabaiCraft — Handcrafted Sabai Grass E-Commerce Platform

SabaiCraft is a full-stack e-commerce storefront for handcrafted products made from **Sabai grass** (Eulaliopsis binata) — a sustainable, biodegradable fiber woven by artisan communities in India. It is a real, working shop: browse a live catalog, filter and search it, manage a cart and wishlist, create an account, place a cash-on-delivery order, and track it through an order history.

The repository contains two applications:

- **`frontend/`** — a React 19 single-page storefront (Vite, TypeScript, Tailwind CSS, Zustand, Framer Motion)
- **`backend/`** — an Express 5 REST API (TypeScript, Prisma ORM, SQLite in development, JWT auth)

![SabaiCraft home page — desktop](docs/screenshots/01-overview/home-desktop.png)

Documentation produced by the recent frontend audit lives in [`docs/`](docs): a [screenshot index](docs/screenshot-index.md), the [test coverage report](docs/test-coverage.md), and the [UI audit](docs/ui-audit.md) with every issue found and fixed.

---

## Highlights

- **Live catalog with rich discovery** — search with debounced suggestions, category filtering with live product counts, dual-handle price slider, in-stock toggle, five sort orders, grid/list views, and pagination (Shop, Categories, and per-category pages).
- **Product pages that convert** — image gallery with zoom modal, variant selection with per-variant pricing, inventory-aware quantity stepper, Add to Cart / Buy Now / Wishlist, tabbed details, and related products.
- **A cart that behaves** — persistent across reloads, survives sign-in (guest items merge into the account cart), slide-in drawer with free-shipping progress, 18% GST and free-shipping-over-₹2,000 math that matches the order record.
- **Complete checkout** — three steps (shipping address → payment method → review), COD and online-method UI, and a confirmation page showing the real order number, totals, and timeline.
- **Order tracking & reorder** — paginated order history with status badges, a five-step progress timeline per order, and one-click Reorder that puts a delivered order back into the cart.
- **Account management** — profile editing, password change, address book with default-address support and delete confirmation, wishlist sync.
- **Content & trust pages** — About, Contact (FAQ accordion), and eight policy/info pages (privacy, terms, shipping, returns, FAQ, sustainability, cookies, accessibility).

---

## Features in Detail

### Catalog & discovery
The catalog is fetched from the API (with a bundled sample dataset as automatic fallback when the backend is offline). Shop, category, and search views filter, sort, and paginate client-side over the full catalog, so results stay instant; the loader pages through the API so nothing beyond the first 50 products is ever hidden.

### Product detail
Each product supports multiple images (zoom modal with keyboard-close and accessible naming) and multiple variants. Variants carry their own price, compare-at price, inventory, and attributes; the page defaults to the first in-stock variant and disables quantity beyond available inventory.

### Cart, wishlist, and auth sync
Cart and wishlist are Zustand stores persisted to `localStorage`. Guests can add items freely; when they sign in, those items are **merged into the backend cart/wishlist** (once — session restores never re-merge, so reloads don't duplicate). Authenticated changes sync to the API; the API client also carries the JWT as a bearer token and clears the session app-wide on a 401.

### Checkout and orders
Checkout requires sign-in (the orders API is authenticated). It walks through shipping address (choose saved or create new), payment method (COD, Card, UPI, Net Banking, Wallet — COD is fully functional; the others record a method but no gateway is integrated), and a review step. Placing the order creates it server-side with inventory updates and shows the confirmation page with the real placed timestamp and estimated delivery.

### Admin (API only)
The backend exposes admin endpoints (dashboard stats, users, inventory, coupons, review moderation, order status transitions with automatic timestamps and inventory restoration on cancellation). There is **no admin UI** in the frontend yet — admin actions are performed via the API (see [Known limitations](#known-limitations)).

---

## Visual Showcase — Every Screenshot

Every screenshot in `docs/screenshots/` (36 images) is embedded below, captured from the running application at desktop 1440×900, tablet 768×1024, and mobile 390×844. Some frames were taken during the interface's sub-second entrance transitions, so a few appear partially faded — the UI they show is the final rendered interface.

### 1. Home Page — Hero (Desktop)

The landing view: brand header with navigation, search, wishlist and cart indicators, the hero headline with primary calls-to-action, trust markers, and the subtle Sabai mascot watermark behind the content.

![Home page hero — desktop](docs/screenshots/01-overview/home-desktop.png)

### 2. Home Page — Featured Collection (Desktop, Tall Viewport)

Captured with an extended viewport to show the hero plus the full Featured Collection in one frame: eight featured products with discount badges, wishlist quick-actions, add-to-cart buttons, and the "View All Products" link.

![Home featured collection](docs/screenshots/01-overview/home-featured-section.png)

### 3. Home Page — Shop by Category (Desktop)

The category browsing grid with live product counts per category — Bags, Baskets, Coasters, Garments, Hats, Mats, and Toys — each linking to its own listing page.

![Home categories section](docs/screenshots/01-overview/home-categories-section.png)

### 4. Home Page — Brand Story (Desktop)

The brand story block ("Rooted in Tradition, Crafted for Tomorrow") with its value cards: Sustainable Materials, Artisan Empowerment, Timeless Craftsmanship, and Fair Trade Practices.

![Home story section](docs/screenshots/01-overview/home-story-section.png)

### 5. Home Page (Mobile)

The landing page at 390px: compact dark header with search, cart badge, and hamburger menu, and the single-column hero with the mascot watermark.

![Home page — mobile](docs/screenshots/01-overview/home-mobile.png)

### 6. Home Page — Navigation Drawer Open (Mobile)

The slide-in mobile menu with a search shortcut, Cart and Wishlist quick-access buttons showing live item counts, primary navigation, and the authenticated account section with icon-and-label links.

![Mobile navigation drawer open](docs/screenshots/01-overview/home-mobile-menu-open.png)

### 7. Sign In (Desktop)

The sign-in page on the shared auth layout: email and password fields with inline icons, a show/hide password toggle, the Sign In action, and a link to create an account. Submitting the empty form triggers inline client-side validation before any request is made.

![Login page — desktop](docs/screenshots/02-authentication/login-desktop.png)

### 8. Sign In — Form Card (Desktop)

The sign-in card fully rendered on the auth layout, with the store's trust badges (free shipping, secure payment, easy returns) in the footer band beneath it.

![Login form card](docs/screenshots/02-authentication/login-validation.png)

### 9. Create Account (Desktop)

Registration with first/last name, email, password and confirm-password fields, acceptance links to the Terms of Service and Privacy Policy, the newsletter opt-in checkbox, and the Create Account action.

![Register page — desktop](docs/screenshots/02-authentication/register-desktop.png)

### 10. Shop — All Products (Desktop)

The full catalog with the filter sidebar (search, category radios with live counts, dual price slider, in-stock toggle), "11 products found" result count, sort selector, and grid/list view toggles over the product grid.

![Shop page — desktop](docs/screenshots/03-shopping/shop-desktop.png)

### 11. Categories Overview (Desktop)

The curated category browser: dark hero band with the "Explore Our Collections" badge and headline, above the category card grid with product counts and featured previews.

![Categories page — desktop](docs/screenshots/03-shopping/categories-desktop.png)

### 12. Category — Baskets (Desktop)

A category listing with its own dark banner ("Baskets — Handwoven storage and decorative baskets — 6 products in this collection"), category-scoped search and price filters, and the six basket products with sorting and view toggles.

![Baskets category page](docs/screenshots/03-shopping/category-baskets-desktop.png)

### 13. Category — Empty State (Desktop)

A category with no products (Toys) renders "0 products in this collection" and "0 products found" with the filters intact — the friendly "No results found" guidance sits just below, instead of a broken-looking blank grid.

![Empty category state](docs/screenshots/03-shopping/category-empty-toys.png)

### 14. Product Detail (Desktop)

The product page for the Sabai Tote Bag: breadcrumbs, image gallery with thumbnail navigation and prev/next arrows, variant selector (Natural/Beige), quantity stepper, Add to Cart / Buy Now / Wishlist actions, and the tabbed description section.

![Product detail page — desktop](docs/screenshots/03-shopping/product-detail-desktop.png)

### 15. Product Detail — Image Zoom Modal (Desktop)

Clicking the main image opens a full-size zoom dialog with a close button, dimming the page behind it — an accessible, named dialog for inspecting product artwork up close.

![Product zoom modal](docs/screenshots/03-shopping/product-zoom-modal.png)

### 16. Global Search Modal (Desktop)

The ⌘K search overlay with the query "basket": debounced backend suggestions listing matching products with thumbnails and prices, clear/close controls, and a "View All Results" button that deep-links into the shop.

![Search modal with suggestions](docs/screenshots/03-shopping/search-modal.png)

### 17. Cart Drawer (Desktop)

The slide-in cart over the product page: line-item thumbnail and variant, quantity stepper, remove action, subtotal, free-shipping status, 18% GST line, total, and View Cart / Checkout actions.

![Cart drawer](docs/screenshots/03-shopping/cart-drawer.png)

### 18. Cart Page (Desktop)

The full cart page with the editable line item ("2 items in your cart") and the Order Summary panel — subtotal, free shipping, "Tax (18% GST)", total, and the corrected "18% GST added at checkout" note.

![Cart page — desktop](docs/screenshots/03-shopping/cart-page.png)

### 19. Checkout — Shipping Step (Desktop)

Step 1 of 3: the checkout progress indicator (Shipping → Payment → Review), the saved address card ("Demo Customer · Default" in Mumbai) with a "+ New address" option, "Continue to Payment", and the Order Summary with the ₹3,540 total.

![Checkout shipping step](docs/screenshots/04-checkout/checkout-shipping.png)

### 20. Checkout — Payment Step (Desktop)

Step 2: payment method selection with Cash on Delivery preselected ("Pay in cash when your order arrives"), plus Credit/Debit Card, UPI, and Net Banking options, with Back and Review Order actions.

![Checkout payment step](docs/screenshots/04-checkout/checkout-payment.png)

### 21. Checkout — Review Step (Desktop)

Step 3: the complete order recap — shipping address and payment method (each with an Edit shortcut), order items ("Sabai Tote Bag × 2 — ₹3,000"), and the final Place Order button.

![Checkout review step](docs/screenshots/04-checkout/checkout-review.png)

### 22. Order Success (Desktop)

The confirmation screen after placing the order: real order number, total, item count, payment method, placed timestamp, estimated delivery, and the "What Happens Next" timeline from confirmation through delivery.

![Order success page](docs/screenshots/04-checkout/order-success.png)

### 23. My Orders (Desktop)

Paginated order history: four orders with status badges (three Pending, one Delivered), placed dates, unit counts, payment method, totals, View buttons — and Reorder on the delivered order.

![Orders list](docs/screenshots/05-account/orders-list.png)

### 24. Order Detail (Desktop)

A delivered order with the five-step progress timeline fully complete (Placed → Confirmed → Processing → Shipped → Delivered), line items showing parsed variant attributes ("color: Natural"), shipping address, payment summary, and totals.

![Order detail page](docs/screenshots/05-account/order-detail.png)

### 25. Wishlist with Item (Desktop)

The wishlist page with one saved product (Sabai Sun Hat, −21%) — thumbnail, price with compare-at strikethrough, rating, and remove/quick-add actions in the card.

![Wishlist with item](docs/screenshots/05-account/wishlist-with-item.png)

### 26. My Account — Profile & Security (Desktop)

The account dashboard: sidebar navigation, live statistics (4 Total Orders, ₹27,475 Total Spent, 1 Wishlist Item, 1 Saved Address), the profile form with a locked email field, and the Change Password section below.

![Account profile](docs/screenshots/05-account/account-profile.png)

### 27. My Account — Saved Addresses (Desktop)

The address book tab: the default Mumbai address card with its "Default" badge and Edit action, plus the "Add Address" button. Deleting an address asks for confirmation before removal.

![Account addresses](docs/screenshots/05-account/account-addresses.png)

### 28. About Us (Desktop)

The brand story page: dark hero band with the "Our Story" badge and "Rooted in Tradition, Crafted for Tomorrow" headline, above the narrative and values content.

![About page](docs/screenshots/06-content/about-desktop.png)

### 29. Contact Us (Desktop)

The contact page: "We'd Love to Hear from You" hero, Contact Information card (email with 24-hour response note, phone with business hours), and the "Send Us a Message" form — which hands the composed message to the visitor's email client.

![Contact page](docs/screenshots/06-content/contact-desktop.png)

### 30. Info Page — Privacy Policy (Desktop)

Representative policy page: breadcrumb, dark header with title, intro, and "Last updated" date, followed by the section cards ("Information We Collect", "How We Use Your Information"). Seven more slugs (terms, shipping, returns, FAQ, sustainability, cookies, accessibility) share this layout.

![Privacy policy page](docs/screenshots/06-content/info-privacy.png)

### 31. 404 — Page Not Found (Desktop)

The not-found page shown for any unknown URL or info slug: search illustration, apology message, Go Home / Browse Products recovery actions, and popular-destination links.

![404 page](docs/screenshots/06-content/not-found.png)

### 32. Home Page (Tablet, 768px)

The tablet layout: the compact mobile-style header appears below the desktop breakpoint, with the hero scaling to the narrower width and the featured grid dropping to two columns.

![Home page — tablet](docs/screenshots/07-responsive/home-tablet.png)

### 33. Shop (Mobile, 390px)

The shop page on mobile: filters collapse behind a "Filters" toggle, the result count and sort/view controls sit in one row, and products stack in a single column.

![Shop page — mobile](docs/screenshots/07-responsive/shop-mobile.png)

### 34. Product Detail (Mobile, 390px)

The product page stacked for mobile — breadcrumbs, full-width gallery with swipe-style arrows and thumbnails, and the trust badges in a two-column grid — with no horizontal overflow after the grid fix.

![Product detail — mobile](docs/screenshots/07-responsive/product-detail-mobile.png)

### 35. Cart with Item (Mobile, 390px)

The mobile cart: header cart badge showing 2, the editable line item (quantity stepper, remove), and the Order Summary with GST and the Proceed to Checkout action stacked below.

![Cart — mobile](docs/screenshots/07-responsive/cart-mobile.png)

### 36. Cart — Empty State (Mobile, 390px)

The empty-cart state at mobile width: friendly guidance ("Looks like you haven't added any treasures yet") with a Continue Shopping action instead of a blank page.

![Cart empty state — mobile](docs/screenshots/07-responsive/cart-empty-mobile.png)

---

## Application Routes

All routes are client-side routes served by React Router. Verified against the running app.

| Route | Page | Access |
|---|---|---|
| `/` | Home (hero, featured, categories, story, testimonials, newsletter) | Public |
| `/shop` | Shop (search `?q=`, sort `?sort=`, filters, pagination) | Public |
| `/categories` | Category overview | Public |
| `/category/:slug` | Category listing (`baskets`, `bags`, `coasters`, `hats`, `toys`, `mats`, `garments`) | Public |
| `/product/:slug` | Product detail | Public |
| `/cart` | Cart page | Public |
| `/checkout` | 3-step checkout | Sign-in required (guests see a sign-in gate) |
| `/order-success/:orderId` | Order confirmation | Sign-in required |
| `/about` | Our story | Public |
| `/contact` | Contact + FAQ | Public |
| `/wishlist` | Wishlist (syncs when signed in) | Public |
| `/login`, `/register` | Auth pages (support `?redirect=`) | Public |
| `/account` | Account dashboard (profile, password, addresses) | Protected |
| `/orders` | Order history | Protected |
| `/orders/:orderId` | Order detail with timeline | Protected |
| `/privacy`, `/terms`, `/shipping`, `/returns`, `/faq`, `/sustainability`, `/cookies`, `/accessibility` | Info pages | Public |
| `*` | 404 | Public |

---

## Technology Stack

### Frontend

| Technology | Role |
|---|---|
| React 19 + TypeScript | UI (strict mode) |
| Vite 8 (rolldown) | Dev server and build |
| React Router 7 | Client-side routing |
| Tailwind CSS 3.4 | Design system (olive/sage/sabai/cream palette, custom type & spacing scales) |
| Zustand 5 (+persist) | Auth, cart, wishlist, UI state |
| Framer Motion | Page transitions, reveals, drawers/modals |
| React Hook Form + Zod | Auth forms and validation |
| Lucide | Icons |
| Oxlint | Linting |

### Backend

| Technology | Role |
|---|---|
| Express 5 + TypeScript | REST API |
| Prisma ORM + SQLite | Data layer (dev); `DATABASE_URL` accepts Postgres for production |
| JSON Web Tokens | Auth (bearer token; HttpOnly cookie also set) |
| bcryptjs | Password hashing (12 rounds) |
| Zod | Request validation on every write endpoint |
| Helmet / CORS / express-rate-limit | Security headers, origin allow-list, brute-force protection |

---

## Architecture

```mermaid
flowchart TD
    A[index.html + main.tsx] --> B[React Router routes]
    B --> C[MainLayout: Header / Footer / drawers / toasts]
    C --> D[Pages: Home, Shop, Category, Product, Cart, Checkout, Orders, Account, Content, 404]
    D --> E[Shared components: ProductCard, EmptyState, Modal, Drawer, Toast, SearchModal]
    D --> F[Zustand stores: auth, cart, wishlist, ui]
    F --> G[API client - services/api.ts]
    G -->|same-origin /api via Vite dev proxy| H[Express 5 API - port 3001]
    H --> I[Prisma ORM]
    I --> J[(SQLite dev.db)]
    H --> K[JWT auth + Zod validation + rate limiting]
```

Data flow highlights:

- **Catalog** pages fetch through a shared `useCatalog` hook (all pages, client-side filtering) with an automatic fallback to `src/data/products.ts` when the API is unreachable.
- **Cart/wishlist** stores apply optimistic updates and reconcile with the backend when authenticated; guest carts merge on sign-in.
- **Auth** keeps the JWT in `localStorage` (bearer header) with a persisted user snapshot; `/auth/me` revalidates on load.

### Project structure

```
SabaiCraft/
├── frontend/                      # React 19 + Vite storefront
│   ├── public/Images/             # Product, category, and payment artwork
│   └── src/
│       ├── App.tsx                # Routes, scroll/title manager, global modals
│       ├── components/
│       │   ├── layout/            # Header, Footer, MobileDrawer, AuthLayout
│       │   ├── home/              # Hero, FeaturedProducts, Categories, Story, Testimonials, Newsletter
│       │   ├── product/           # ProductCard
│       │   ├── cart/              # CartDrawer
│       │   ├── auth/              # ProtectedRoute
│       │   ├── common/            # ErrorBoundary, SearchModal, ScrollReveal
│       │   └── ui/                # Button, Input, Modal, Drawer, Tabs, Toast, EmptyState, …
│       ├── pages/                 # 18 route-level pages (incl. InfoPage for 8 policy slugs)
│       ├── store/                 # Zustand stores (auth, cart, wishlist, ui)
│       ├── services/api.ts        # Typed API client
│       ├── hooks/                 # useCatalog, useIntersectionObserver
│       ├── data/products.ts       # Offline fallback dataset
│       ├── types/  utils/         # Shared types and helpers (format, normalize, cn)
│       └── index.css              # Tailwind layers + design tokens
├── backend/                       # Express 5 API
│   ├── prisma/                    # schema.prisma, seed.ts, dev.db (generated)
│   └── src/
│       ├── index.ts               # App setup, CORS, rate limits, route mounting
│       ├── middleware/            # auth (JWT), errorHandler
│       ├── routes/                # auth, products, categories, cart, orders, wishlist, user, admin
│       └── prisma/client.ts       # Prisma singleton
├── Images/                        # Source artwork (public copies live in frontend/public/Images)
└── docs/                          # Screenshots, screenshot index, test coverage, UI audit
```

The database schema (Prisma) covers `User`, `Product`, `ProductImage`, `ProductVariant`, `Category` (self-referential), `Cart`/`CartItem`, `WishlistItem`, `Address`, `Order`/`OrderItem`, `Coupon`, `Session`, and `AdminAuditLog`.

---

## Prerequisites

- **Node.js 22+** and **npm 10+**
- No external services required — the dev database is a seeded SQLite file.

---

## Installation and Setup

The project directory is already local; no cloning step is required.

1. **Install backend dependencies and prepare the database**

   ```bash
   cd backend
   npm install        # also generates the Prisma client (postinstall)
   npm run db:push    # create/sync SQLite database from schema.prisma
   npm run db:seed    # seed categories, products, users, a sample order
   ```

2. **Install frontend dependencies**

   ```bash
   cd ../frontend
   npm install
   ```

3. **Environment files** (see [Configuration](#configuration-and-environment-variables) below): `backend/.env` is required; `frontend/.env` is optional (the Vite proxy makes it work without one).

---

## Running the Application

```bash
# Terminal 1 — API on http://localhost:3001
cd backend
npm run dev

# Terminal 2 — storefront on http://localhost:5173
cd frontend
npm run dev
```

- Storefront: **http://localhost:5173**
- API: **http://localhost:3001/api** (health check at `/api/health`)

In development the frontend calls the API **same-origin** through a Vite proxy (`/api` → `http://localhost:3001`, defined in `vite.config.ts`), so the app works on any dev port — including when 5173 is occupied by another project. Direct cross-origin calls to `FRONTEND_URL` remain supported for production-style setups.

### Seeded demo accounts

| Role | Email | Password |
|---|---|---|
| Admin | `admin@sabaicraft.com` | `admin123` |
| Customer | `customer@sabaicraft.com` | `customer123` |

Use the customer account to exercise checkout, orders, and account management. Change these credentials before any real deployment.

---

## Available Scripts

### Backend (`cd backend`)

| Script | Purpose |
|---|---|
| `npm run dev` | Start the API with ts-node |
| `npm run build` / `npm start` | Compile to `dist/` and run it |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:push` | Push the schema to SQLite (dev) |
| `npm run db:migrate` | Create/apply migrations |
| `npm run db:seed` | Seed demo data |
| `npm run db:studio` | Open Prisma Studio |

### Frontend (`cd frontend`)

| Script | Purpose |
|---|---|
| `npm run dev` | Vite dev server (with `/api` proxy) |
| `npm run build` | Type-check + production build |
| `npm run preview` | Preview the production build |
| `npm run lint` | Oxlint |

---

## Configuration and Environment Variables

### `backend/.env` (required)

| Variable | Example | Notes |
|---|---|---|
| `DATABASE_URL` | `file:./dev.db` | SQLite file (dev) or Postgres URL (production) |
| `JWT_SECRET` | long random string | **Required**; must be 32+ chars in production or the server refuses to start |
| `JWT_EXPIRES_IN` | `7d` | Token lifetime |
| `PORT` | `3001` | API port |
| `NODE_ENV` | `development` | `production` enables stricter checks |
| `FRONTEND_URL` | `http://localhost:5173` | CORS allow-list origin |

### `frontend/.env` (optional)

| Variable | Example | Notes |
|---|---|---|
| `VITE_API_URL` | `/api` | Base URL for the API client. `/api` uses the Vite dev proxy (works on any port); omit the file to call `http://localhost:3001/api` directly |

Never commit real secrets. The repo's `.gitignore` excludes `.env` files.

---

## User Workflows

### Browse and buy (verified end-to-end)

1. Open the shop from the header or home page; filter by category, price, or availability and sort results.
2. Open a product, pick a variant, set a quantity, and **Add to Cart** (or **Buy Now**).
3. Open the cart drawer or `/cart`, adjust quantities (inventory-capped), and review the totals (free shipping over ₹2,000, 18% GST).
4. **Proceed to Checkout** → sign in (or register — your cart follows you) → choose a shipping address → choose **Cash on Delivery** → review → **Place Order**.
5. The confirmation page shows your order number and timeline; the order appears under **My Orders** with live status.

### Save and reorder

1. Tap the heart on any product (or "Add to Wishlist" on the product page).
2. Find saved items under **Wishlist**; they persist for guests and sync to the account on sign-in.
3. On a delivered order, **Reorder** re-adds every item to the cart in one click.

### Account management

Sign in → **My Account** to edit your profile, change your password, and manage addresses (default shipping address is preselected at checkout).

---

## Responsive Design

Tested at desktop 1440×900, laptop 1280×800, tablet 768×1024, and mobile 390×844 (plus a 360px check on the order timeline):

- The header swaps to a compact dark bar below `lg` with a slide-in navigation drawer (cart and wishlist quick-access included) — see screenshot 6.
- The shop page collapses filters behind a toggle on mobile; product grids collapse to a single column — see screenshot 33.
- The product page stacks gallery over purchase controls (with the grid min-width fix preventing image-driven overflow) — see screenshot 34.
- Modals, drawers, and the order timeline adapt or scroll rather than overflow.

Tablet, mobile, and empty-state captures live in the [Responsive Views gallery](#7-responsive-views-36-total) above.

---

## Testing and Quality Checks

- **Static checks**: `npm run lint` (oxlint — currently 39 advisory warnings, 0 errors), `tsc -b` (clean), `npm run build` (passes).
- **Manual verification**: all 26 routes plus every meaningful interaction (auth, cart, wishlist, checkout, reorder, filters, modals, responsive layouts) were exercised in a real browser; the full report with pass/fail/blocked breakdowns is in [`docs/test-coverage.md`](docs/test-coverage.md).
- **Issues found and fixed** during the audit (36 defects, from a registration-breaking URL typo to cart-merge and overflow bugs) are documented in [`docs/ui-audit.md`](docs/ui-audit.md).
- **No automated test suite is configured** (no unit/E2E framework in the repo yet); the only automated gates are lint, type-check, and build.

---

## Known Limitations

- **Payments are not integrated.** Cash on Delivery completes a real order; card/UPI/net-banking/wallet selections record the method but no gateway is called.
- **No emails are sent.** There is no email service; the order-success page shows only real data (the earlier "Confirmation Email: Sent" line was removed).
- **No admin UI.** Admin endpoints exist and work (e.g. order status transitions), but management is API-only for now.
- **Newsletter signup is not backed by a service** yet; the registration checkbox stores the preference locally.
- **The contact form hands off to the visitor's email client** (`mailto:`) rather than posting to an API that doesn't exist.
- **Seed data quirk:** the Sabai Coaster Set's image points at a small UI icon (`public/Images/l1.png`), not a product photo — a backend seed-data fix.
- **Cart/wishlist backend sync waits for the next successful session validation** if `/auth/me` fails transiently (e.g. after tripping the 20-requests/15-minute auth rate limit); no automatic retry yet.
- Verified in Chromium only; no cross-browser or real-device testing has been performed.

See [`docs/ui-audit.md §6`](docs/ui-audit.md) for the full list with context.

---

## Contributing and Development Guidelines

- Follow the existing patterns: colocated page components in `src/pages/`, shared primitives in `src/components/ui/`, all server access through `src/services/api.ts`, all state in Zustand stores.
- Prices are integers in **paise** (₹1,400.00 = `140000`); use `formatPrice()` for display and never float math for totals.
- Variant attributes come from the API as JSON strings — run them through `parseVariantAttributes()` (`src/utils/normalize.ts`).
- Run `npm run lint && npx tsc -b && npm run build` before finishing a change.
- Keep styling on the existing design tokens (olive/sage/sabai palette, `btn-*`/`card`/`heading-*` utility classes in `index.css`).

---

## License

No license file is present in this repository as of this writing; all rights are reserved by the author until one is added. (The backend `package.json` declares `license: "ISC"`.)

---

## Additional Documentation

- [`docs/screenshot-index.md`](docs/screenshot-index.md) — every captured screenshot, organized by area with commentary
- [`docs/test-coverage.md`](docs/test-coverage.md) — environment, route-by-route results, interaction and responsive test records, limitations
- [`docs/ui-audit.md`](docs/ui-audit.md) — all 36 frontend defects found during the audit, their fixes, and verification
