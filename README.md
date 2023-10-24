# SabaiCraft - Handcrafted Sabai Grass E-Commerce Platform

> A full-stack, production-ready e-commerce platform for sustainable, artisan-made Sabai grass products. Built with modern technologies and crafted with attention to detail, performance, and accessibility.

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg)](https://react.dev/)
[![Node.js](https://img.shields.io/badge/Node.js-22+-339933.svg)](https://nodejs.org/)
[![Prisma](https://img.shields.io/badge/Prisma-5.22-2D3748.svg)](https://prisma.io/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-06B6D4.svg)](https://tailwindcss.com/)

---

## 🌿 About SabaiCraft

SabaiCraft is an e-commerce platform dedicated to showcasing and selling handcrafted products made from **Sabai grass** (Eulaliopsis binata) - a sustainable, biodegradable natural fiber that grows abundantly in the wild grasslands of India. Every product is handwoven by skilled artisans using traditional techniques passed down through generations.

### Mission
- **Empower Artisans**: Direct-to-consumer model eliminating middlemen, ensuring fair wages and sustainable livelihoods
- **Promote Sustainability**: 100% natural, plastic-free, biodegradable products with eco-friendly packaging
- **Preserve Heritage**: Keep traditional weaving techniques alive while blending with contemporary design

---

## ✨ Features

### 🛍️ Customer-Facing Features

#### **Home Page**
- Hero section with animated content and call-to-action
- Featured products carousel with quick-add to cart/wishlist
- Category browsing with product counts and featured previews
- Brand story section with values and impact statistics
- Testimonials carousel with customer reviews
- Newsletter subscription with email capture

#### **Shop & Product Discovery**
- **Shop All Products** (`/shop`) - Full catalog with advanced filtering:
  - Search with real-time suggestions
  - Category filtering (radio buttons)
  - Price range slider (dual-handle)
  - In-stock only toggle
  - Sort by: Newest, Price (Low-High/High-Low), Rating, Popularity
  - Grid/List view toggle
  - Pagination
- **Category Pages** (`/category/:slug`) - Filtered product views per category
- **Categories Listing** (`/categories`) - Visual category browser with product previews
- **Product Detail Pages** (`/product/:slug`) with:
  - Image gallery with zoom modal and thumbnail navigation
  - Variant selection (size, color, etc.) with dynamic pricing
  - Quantity selector with inventory validation
  - Add to Cart / Buy Now actions
  - Wishlist toggle
  - Tabbed sections: Description, Specifications, Shipping & Returns, Reviews
  - Related products carousel

#### **Shopping Cart & Checkout**
- Persistent cart (localStorage + backend sync for authenticated users)
- Cart drawer accessible from any page
- Quantity adjustment with inventory limits
- Real-time price calculations (subtotal, shipping, tax, total)
- Free shipping threshold (₹2,000)
- Guest checkout support
- Multi-step checkout:
  1. Shipping address selection/creation
  2. Payment method selection (COD, Card, UPI, NetBanking, Wallet)
  3. Order review and confirmation
- Order success page with tracking info and next steps

#### **User Account & Authentication**
- **JWT-based authentication** with HttpOnly cookies
- Registration with validation (email, password strength)
- Login/logout with remember-me
- Protected routes with automatic redirect
- **Account Dashboard** (`/account`):
  - Profile management (name, phone, avatar)
  - Password change with current password verification
  - Address book (CRUD with default shipping/billing)
- **Order History** (`/orders`) with:
  - Paginated order list with status badges
  - Order detail view (`/orders/:orderId`) with timeline
  - Reorder functionality for delivered orders
  - Tracking integration
- **Wishlist** (`/wishlist`) with variant-level selection

#### **Informational Pages**
- **About Us** - Brand story, values, impact stats, team, process
- **Contact Us** - Contact form, business hours, FAQ accordion
- **404 Not Found** - Friendly error page with navigation

### 🔧 Admin Features (`/api/admin/*`)

#### **Dashboard** (`/api/admin/dashboard`)
- Total users, products, orders, revenue
- Recent orders with customer info
- Low stock alerts

#### **User Management** (`/api/admin/users`)
- Paginated user list with search and role filter
- Role promotion/demotion (Customer ↔ Admin)

#### **Product Management** (via `/api/products` with admin middleware)
- Create/Update/Delete products with images and variants
- Featured product toggle
- Inventory management per variant

#### **Category Management** (via `/api/categories` with admin middleware)
- Hierarchical categories (parent/child)
- CRUD operations with slug generation

#### **Order Management** (via `/api/orders/admin/*`)
- Admin order list with search, status, payment filters
- Status updates with automatic timestamps (confirmedAt, shippedAt, etc.)
- Inventory restoration on cancellation

#### **Inventory Management** (`/api/admin/inventory`)
- Paginated variant list with low-stock filter
- Direct inventory quantity updates

#### **Coupon Management** (`/api/admin/coupons`)
- Percentage and fixed-amount coupons
- Usage limits, user limits, date ranges
- Category/product applicability

#### **Review Moderation** (`/api/admin/reviews`)
- Pending/approved filter
- Approve/reject actions

---

## 🏗️ Architecture & Tech Stack

### **Frontend** (React 19 + TypeScript + Vite)

| Technology | Version | Purpose |
|------------|---------|---------|
| React | 19.2.8 | UI library with concurrent features |
| TypeScript | 6.0.2 | Type-safe development |
| Vite | 8.3.0 | Fast build tool & dev server |
| React Router DOM | 7.18.3 | Client-side routing |
| Tailwind CSS | 3.4.19 | Utility-first styling |
| Framer Motion | 13.2.0 | Animations & transitions |
| Zustand | 5.0.15 | Lightweight state management |
| React Hook Form | 7.87.0 | Form handling & validation |
| Zod | 4.6.2 | Schema validation |
| Lucide React | 1.45.0 | Icon system |
| clsx + tailwind-merge | 2.1.1 / 3.6.0 | Conditional classNames |

**Key Frontend Patterns:**
- Component-driven architecture with colocation
- Custom hooks for data fetching and UI logic
- Zustand stores with persistence (auth, cart, wishlist)
- Optimistic UI updates with backend sync
- Framer Motion for page transitions and micro-interactions
- Tailwind CSS with custom design system (colors, spacing, typography)
- Accessibility-first (ARIA, semantic HTML, focus management)

### **Backend** (Node.js + Express 5 + TypeScript)

| Technology | Version | Purpose |
|------------|---------|---------|
| Express | 5.2.1 | Web framework (modern router) |
| TypeScript | 5.9.3 | Type-safe server development |
| Prisma ORM | 5.22.0 | Type-safe database access |
| SQLite | - | Development database |
| JWT (jsonwebtoken) | 9.0.3 | Stateless authentication |
| bcryptjs | 3.0.3 | Password hashing |
| Zod | 4.6.2 | Request validation |
| Helmet | 8.3.0 | Security headers |
| CORS | 2.8.6 | Cross-origin resource sharing |
| Morgan | 1.12.1 | HTTP request logging |
| Cookie Parser | 1.4.7 | Cookie handling |

**API Design:**
- RESTful endpoints with consistent response format
- Middleware-based authentication & authorization
- Centralized error handling with custom `AppError` class
- Request validation with Zod schemas
- Prisma transaction support for data integrity

### **Database Schema** (Prisma + SQLite)

```
User ◄──► Session (auth tokens)
User ◄──► Cart ◄──► CartItem ◄──► ProductVariant
User ◄──► WishlistItem ◄──► ProductVariant
User ◄──► Address (shipping/billing)
User ◄──► Order ◄──► OrderItem ◄──► ProductVariant
Product ◄──► ProductImage
Product ◄──► ProductVariant
Product ◄──► Category (self-referential hierarchy)
Product ◄──► Review
Coupon
AdminAuditLog
```

**Key Models:**
- **User**: email (unique), name, passwordHash, phone, avatar, role (CUSTOMER/ADMIN)
- **Product**: slug (unique), basePrice, compareAtPrice, tags, isActive, isFeatured
- **ProductVariant**: sku (unique), price, inventory, attributes (JSON), image
- **Order**: orderNumber (unique), status, paymentStatus, paymentMethod, totals, addresses
- **Category**: slug (unique), parentId (self-ref), image

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** 22+ (recommended: use [fnm](https://github.com/Schniz/fnm) or [nvm](https://github.com/nvm-sh/nvm))
- **npm** 10+ (comes with Node.js)
- **Git** for version control

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/SabaiCraft.git
cd SabaiCraft

# Install backend dependencies
cd backend
npm install

# Generate Prisma client & push database schema
npm run db:generate
npm run db:push

# Seed database with sample data (admin user, products, categories, coupons)
npm run db:seed

# Install frontend dependencies
cd ../frontend
npm install

# Return to root
cd ..
```

### Environment Configuration

#### Backend (`backend/.env`)
```env
# Database
DATABASE_URL="file:./dev.db"

# JWT Authentication
JWT_SECRET="your-super-secret-jwt-key-change-in-production"
JWT_EXPIRES_IN="7d"

# Server
PORT=3001
NODE_ENV=development

# Frontend URL (for CORS)
FRONTEND_URL="http://localhost:5173"
```

#### Frontend (`frontend/.env`)
```env
# API Base URL
VITE_API_URL="http://localhost:3001/api"
```

### Running the Application

#### Development Mode (with hot reload)

```bash
# Terminal 1 - Start Backend
cd backend
npm run dev

# Terminal 2 - Start Frontend
cd frontend
npm run dev
```

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001/api
- **API Health Check**: http://localhost:3001/api/health
- **Prisma Studio** (DB GUI): `cd backend && npm run db:studio`

#### Production Build

```bash
# Build backend
cd backend
npm run build
npm start

# Build frontend
cd frontend
npm run build
# Serve dist/ with any static server (nginx, Vercel, Netlify, etc.)
```

---

## 🔐 Default Credentials (After Seeding)

| Role | Email | Password |
|------|-------|----------|
| **Admin** | `admin@sabaicraft.com` | `admin123` |
| **Customer** | `customer@sabaicraft.com` | `customer123` |

> ⚠️ **Change these immediately in production!**

---

## 📁 Project Structure

```
SabaiCraft/
├── backend/                    # Express API Server
│   ├── prisma/
│   │   ├── schema.prisma       # Database schema
│   │   └── seed.ts             # Database seeding script
│   ├── src/
│   │   ├── index.ts            # App entry point
│   │   ├── prisma/client.ts    # Prisma client singleton
│   │   ├── middleware/
│   │   │   ├── auth.ts         # JWT auth & admin middleware
│   │   │   └── errorHandler.ts # Centralized error handling
│   │   ├── routes/
│   │   │   ├── auth.ts         # /api/auth/*
│   │   │   ├── products.ts     # /api/products/*
│   │   │   ├── categories.ts   # /api/categories/*
│   │   │   ├── cart.ts         # /api/cart/*
│   │   │   ├── orders.ts       # /api/orders/*
│   │   │   ├── wishlist.ts     # /api/wishlist/*
│   │   │   ├── user.ts         # /api/user/*
│   │   │   └── admin.ts        # /api/admin/*
│   │   ├── utils/              # Helper functions
│   │   └── services/           # Business logic (extensible)
│   ├── package.json
│   ├── tsconfig.json
│   └── .env
│
├── frontend/                   # React + Vite Application
│   ├── public/                 # Static assets
│   │   └── Images/             # Product & category images
│   ├── src/
│   │   ├── main.tsx            # App entry point
│   │   ├── App.tsx             # Routes & providers
│   │   ├── index.css           # Tailwind + custom styles
│   │   ├── components/
│   │   │   ├── layout/         # Header, Footer, MainLayout, MobileDrawer
│   │   │   ├── home/           # Home page sections
│   │   │   ├── product/        # ProductCard, etc.
│   │   │   ├── cart/           # CartDrawer
│   │   │   ├── ui/             # Reusable UI primitives (Button, Input, Card, Modal, etc.)
│   │   │   ├── auth/           # ProtectedRoute, AuthLayout
│   │   │   └── common/         # SearchModal, MicroInteractions
│   │   ├── pages/              # Route-level components
│   │   │   ├── HomePage.tsx
│   │   │   ├── ShopPage.tsx
│   │   │   ├── CategoryPage.tsx
│   │   │   ├── CategoriesPage.tsx
│   │   │   ├── ProductDetailPage.tsx
│   │   │   ├── CartPage.tsx
│   │   │   ├── CheckoutPage.tsx
│   │   │   ├── OrderSuccessPage.tsx
│   │   │   ├── LoginPage.tsx
│   │   │   ├── RegisterPage.tsx
│   │   │   ├── AccountPage.tsx
│   │   │   ├── OrdersPage.tsx
│   │   │   ├── OrderDetailPage.tsx
│   │   │   ├── WishlistPage.tsx
│   │   │   ├── AboutPage.tsx
│   │   │   ├── ContactPage.tsx
│   │   │   └── NotFoundPage.tsx
│   │   ├── store/              # Zustand stores
│   │   │   ├── authStore.ts
│   │   │   ├── cartStore.ts
│   │   │   └── wishlistStore.ts
│   │   ├── services/           # API client
│   │   │   └── api.ts
│   │   ├── hooks/              # Custom React hooks
│   │   ├── utils/              # Helpers (format, cn, etc.)
│   │   ├── types/              # TypeScript interfaces
│   │   └── data/               # Mock data (fallback)
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   └── tailwind.config.js
│
├── Images/                     # Shared product images (symlinked to frontend/public/Images)
├── README.md                   # This file
├── .gitignore
└── auto-push.sh               # Helper script
```

---

## 🛠️ Available Scripts

### Backend (`cd backend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start dev server with ts-node (hot reload) |
| `npm run build` | Compile TypeScript to `dist/` |
| `npm start` | Run compiled production server |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:push` | Push schema to database (dev) |
| `npm run db:migrate` | Run migrations (production) |
| `npm run db:seed` | Seed database with sample data |
| `npm run db:studio` | Open Prisma Studio (DB GUI) |

### Frontend (`cd frontend`)

| Script | Description |
|--------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check + production build to `dist/` |
| `npm run preview` | Preview production build locally |
| `npm run lint` | Run Oxlint |

---

## 🔌 API Reference

### Authentication
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| POST | `/api/auth/logout` | Logout user | Yes |
| GET | `/api/auth/me` | Get current user | Yes |

### Products
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/products` | List products (filters, pagination) | No |
| GET | `/api/products/featured` | Get featured products | No |
| GET | `/api/products/:slug` | Get product by slug | No |
| GET | `/api/products/search/suggestions` | Search autocomplete | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |

### Categories
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/categories` | List top-level categories | No |
| GET | `/api/categories/:slug` | Get category with products | No |
| POST | `/api/categories` | Create category | Admin |
| PUT | `/api/categories/:id` | Update category | Admin |
| DELETE | `/api/categories/:id` | Delete category | Admin |

### Cart
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/cart` | Get cart | Optional |
| POST | `/api/cart/items` | Add item to cart | Optional |
| PATCH | `/api/cart/items/:itemId` | Update quantity | Optional |
| DELETE | `/api/cart/items/:itemId` | Remove item | Optional |
| DELETE | `/api/cart` | Clear cart | Optional |

### Orders
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/orders` | List user orders | Yes |
| GET | `/api/orders/:id` | Get order details | Yes |
| POST | `/api/orders` | Create order from cart | Yes |
| GET | `/api/orders/admin/all` | List all orders (admin) | Admin |
| PATCH | `/api/orders/admin/:id/status` | Update order status | Admin |

### Wishlist
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/wishlist` | Get wishlist | Yes |
| POST | `/api/wishlist` | Add to wishlist | Yes |
| DELETE | `/api/wishlist/:itemId` | Remove from wishlist | Yes |
| DELETE | `/api/wishlist` | Clear wishlist | Yes |

### User Profile
| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/user/profile` | Get profile | Yes |
| PUT | `/api/user/profile` | Update profile | Yes |
| PUT | `/api/user/password` | Change password | Yes |
| GET | `/api/user/addresses` | List addresses | Yes |
| POST | `/api/user/addresses` | Create address | Yes |
| PUT | `/api/user/addresses/:id` | Update address | Yes |
| DELETE | `/api/user/addresses/:id` | Delete address | Yes |

### Admin
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/admin/dashboard` | Dashboard stats |
| GET | `/api/admin/users` | List users |
| PATCH | `/api/admin/users/:id/role` | Update user role |
| GET | `/api/admin/inventory` | Inventory list |
| PATCH | `/api/admin/inventory/:variantId` | Update inventory |
| GET | `/api/admin/coupons` | List coupons |
| POST | `/api/admin/coupons` | Create coupon |
| PUT | `/api/admin/coupons/:id` | Update coupon |
| DELETE | `/api/admin/coupons/:id` | Delete coupon |
| GET | `/api/admin/reviews` | List reviews |
| PATCH | `/api/admin/reviews/:id/approve` | Approve review |
| PATCH | `/api/admin/reviews/:id/reject` | Reject review |

---

## 🎨 Design System

### Colors (Tailwind Config)

```js
// Primary - Dark Olive
olive: {
  950: '#283618',  // Primary text, headers
  900: '#424133',
  800: '#4d4b3c',
  700: '#5a5845',
  600: '#6d6b54',  // Secondary text
  500: '#858267',
  400: '#9e9b83',
  300: '#bdb9a8',
  200: '#d7d5c9',
  100: '#ebeae2',
  50: '#f6f8f3',   // Light backgrounds
}

// Secondary - Sage Green
sage: {
  600: '#606c38',  // Primary actions, links
  500: '#78895c',
  400: '#94a37a',
  100: '#e9ece4',
  50: '#f5f7f3',
}

// Accent - Gold/Yellow
sabai: {
  500: '#d8a53f',  // CTAs, highlights
  400: '#f0c83a',
  300: '#f5d86b',
}

// Background - Cream
cream: {
  50: '#fefdfa',   // Page background
  100: '#fdfaf3',
}
```

### Typography

| Style | Font | Usage |
|-------|------|-------|
| Display | Playfair Display | Hero headlines, major sections |
| Heading | Playfair Display | Section titles, product names |
| Body | Inter | All body text, UI labels |
| Caption | Inter | Meta info, timestamps, helper text |

### Spacing Scale
Based on 4px base unit: `space-4xs` (2px) → `space-5xl` (128px)

### Shadows
- `shadow-xs` to `shadow-elevated` for depth hierarchy

### Border Radius
- `radius-sm` (4px) → `radius-2xl` (24px) + `radius-full`

---

## ♿ Accessibility

- **WCAG 2.1 AA** compliant contrast ratios
- Semantic HTML5 elements (`<main>`, `<nav>`, `<section>`, `<article>`)
- ARIA labels, roles, and live regions
- Focus-visible outlines on all interactive elements
- Keyboard navigation support (Tab, Enter, Escape, Arrow keys)
- Screen reader optimized (alt text, heading hierarchy)
- Reduced motion support (`prefers-reduced-motion`)
- Form validation with `aria-invalid` and `aria-describedby`

---

## 🔒 Security

- **Helmet.js** for security headers (CSP, HSTS, X-Frame-Options, etc.)
- **HttpOnly, Secure, SameSite=Lax** cookies for JWT
- **bcryptjs** with 12 rounds for password hashing
- **Zod** validation on all API inputs
- **CORS** restricted to frontend origin
- **Parameterized queries** via Prisma (SQL injection prevention)
- **Role-based access control** (middleware)
- **Audit logging** for admin actions

---

## 📦 Deployment

### Backend (Node.js)

```bash
# Build
cd backend
npm run build

# Environment variables for production
NODE_ENV=production
DATABASE_URL="postgresql://user:pass@host:5432/db"  # Use PostgreSQL in production
JWT_SECRET="generate-strong-random-secret"
FRONTEND_URL="https://yourdomain.com"

# Run with process manager (PM2, systemd, Docker)
pm2 start dist/index.js --name sabaicraft-api
```

### Frontend (Static)

```bash
cd frontend
npm run build
# Deploy dist/ to:
# - Vercel/Netlify (auto-detects Vite)
# - AWS S3 + CloudFront
# - Nginx/Apache
# - Docker + Nginx
```

### Database (Production)

```bash
# Use PostgreSQL for production
# Update DATABASE_URL in .env
# Run migrations
cd backend
npm run db:migrate
```

### Docker (Optional)

```dockerfile
# backend/Dockerfile
FROM node:22-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY dist ./dist
COPY prisma ./prisma
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

---

## 🧪 Testing

### Backend
```bash
cd backend
# Add test scripts to package.json
npm test  # Jest/Vitest
```

### Frontend
```bash
cd frontend
# Add test scripts to package.json
npm test  # Vitest + React Testing Library
npm run test:e2e  # Playwright/Cypress
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** changes: `git commit -m 'Add amazing feature'`
4. **Push** to branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Code Style
- **TypeScript** strict mode enabled
- **ESLint** + **Prettier** (configure in IDE)
- **Conventional Commits** for commit messages
- **Component-first** architecture

---

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- **Artisan Communities** - For preserving the craft of Sabai grass weaving
- **Open Source Libraries** - React, Express, Prisma, Tailwind, Framer Motion, and countless others
- **Design Inspiration** - Modern e-commerce patterns with an earthy, artisanal aesthetic

---

## 📞 Support & Contact

- **Email**: contact@sabaicraft.com
- **Phone**: +91 88811 55518
- **Address**: Varanasi, Uttar Pradesh, India
- **Issues**: [GitHub Issues](https://github.com/yourusername/SabaiCraft/issues)

---

## 🗺️ Roadmap

- [ ] **Payment Gateway Integration** (Razorpay, Stripe)
- [ ] **Email Notifications** (Order confirmations, shipping updates)
- [ ] **Product Reviews & Ratings** (Customer submissions)
- [ ] **Multi-language Support** (Hindi, regional languages)
- [ ] **PWA Support** (Offline browsing, install prompt)
- [ ] **Advanced Analytics** (Dashboard charts, sales reports)
- [ ] **Subscription/Recurring Orders**
- [ ] **Gift Cards & Referral Program**
- [ ] **International Shipping**
- [ ] **Admin Panel UI** (React-based admin dashboard)

---

<div align="center">

**Made with 💚 for artisans, sustainability, and beautiful homes**

[⬆ Back to Top](#sabaicraft---handcrafted-sabai-grass-e-commerce-platform)

</div>