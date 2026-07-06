# Mini ERP - Inventory Management & POS Dashboard

Mini ERP is a premium, high-fidelity inventory catalog and client-side Point of Sale (POS) checkout terminal dashboard built using **Next.js 16 (App Router)**, **React 19**, and **Redux Toolkit Query (RTK Query)**. It connects to a live backend service to offer real-time synchronization, item catalogs, categories management, and role-based permissions.

- **Live Frontend**: [https://mini-erp-system-frontend.vercel.app](https://mini-erp-system-frontend.vercel.app)
- **Live Backend API**: `https://mini-erp-system-backend.vercel.app/api/v1`

---

## 🎨 Design System & Aesthetics

Mini ERP is designed with a premium, state-of-the-art visual style featuring:
- **Responsive Layout**: Adapts seamlessly to all screen sizes, including a collapsible mobile navigation drawer.
- **Glassmorphism & Micro-animations**: Soft shadows, responsive layouts, hover state highlights, and smooth state transitions.
- **Visual Status Badges**: Custom indicators representing product inventory stock alerts (e.g. `Low Stock`, `Out of Stock`, `In Stock`).
- **Standardized Dropdowns**: Reusable search-enabled `<CustomSelect>` component replacing standard browser selects to provide custom scrolling boundaries and clean checkmark states.
- **Unified Error Panels**: Extracted alert banners to a reusable `<ErrorBanner>` component to present clean, user-friendly warnings for network or validation failures.

---

## 🔑 Role-Based Access Control (RBAC)

The dashboard enforces permissions based on three user roles:
1. **ADMIN**:
   - Complete control over the catalog.
   - Full management of products and categories (Create, Edit, Delete).
   - Complete access to overall Sales History statistics and receipts.
2. **MANAGER**:
   - Full management of products and categories (Create, Edit, Delete).
   - Access to view overall Sales History statistics and receipts.
3. **EMPLOYEE**:
   - Restricted catalog management. Can view products and categories.
   - Full access to the POS Terminal to run transactions.
   - Restricted access to Sales History (can only view their own personal checkout receipts).

---

## 📁 System Architecture & Directories

```
src/
├── app/                      # Next.js App Router (16.x)
│   ├── (auth)/               # Authentication Route Groups
│   │   ├── login/            # User login page
│   │   └── register/         # User registration page
│   ├── (dashboard)/          # Authenticated Dashboard Layout
│   │   ├── page.tsx          # Analytics overview (low stock action items list)
│   │   ├── products/         # Products catalog table with category search
│   │   ├── categories/       # Category directory list & add categories form
│   │   └── sales/            # POS checkout terminal & sales history tab views
│   └── globals.css           # Global custom stylesheet & theme variables
├── components/               # Shared components
│   ├── DashboardLayout.tsx   # Responsive sidebar layout shell
│   ├── products/             # Products components
│   │   ├── ProductTable.tsx  # Product listing table
│   │   ├── ProductModal.tsx  # Product add/edit form modal
│   │   └── CategorySelect.tsx# Custom category dropdown search selector
│   ├── sales/                # POS terminal & history components
│   │   ├── ProductCard.tsx   # Individual POS item card
│   │   ├── ProductGrid.tsx   # Catalog grid view with checkout integration
│   │   ├── ProductSearchFilters.tsx # POS category/search filters
│   │   ├── CartPanel.tsx     # Checkout shopping cart panel
│   │   └── SalesTable.tsx    # Expandable receipt table with date parameters
│   └── ui/                   # Shared UI components
│       ├── CustomSelect.tsx  # Reusable select dropdown with overflow safety
│       ├── ErrorBanner.tsx   # Reusable warning alert banner
│       └── Loader.tsx        # Dynamic spinner loader
├── context/                  # Authentication context provider
│   └── AuthContext.tsx       # Auth status, user credentials, and users list caching
├── redux/                    # Redux Toolkit global state store
│   ├── api/                  # RTK Query API endpoints
│   │   ├── baseApi.ts        # API configuration with JWT Bearer Token injector
│   │   ├── authApi.ts        # Authentication queries
│   │   ├── productsApi.ts    # Products catalog queries & mutations
│   │   ├── categoriesApi.ts  # Categories listing queries & mutations
│   │   └── salesApi.ts       # Sales, checkout, and history query parameters
│   └── store.ts              # Redux RTK store configurations
└── types/                    # Common TypeScript type interfaces
```

---

## ⚡ Key Technical Features

### 1. Backend-Driven Search, Filtering, and Pagination
Sales history and product catalogs are paginated, searched, and filtered on the server side using the database to maintain performance when loading hundreds of receipts.
* Category listing filters can be quickly queried from the backend parameters.
* Filters automatically reset page indexes to keep lists synced.

### 2. Auto-Refetch Tag Invalidation
RTK Query cache invalidation tags (`"Product"`, `"Sale"`) ensure that running a checkout in the POS cart immediately updates the available product stock quantities and updates the dashboard metrics without requiring full page refreshes.

### 3. Stat Aggregations at the Database Layer
Statistical details (Total Revenue, Average Order Value, Transactions Count) for filtered sales are calculated inside the backend database using Prisma and returned within the response `meta` envelopes.

---

## ⚙️ Environment Configuration

Create a `.env.local` file in the root directory to customize the backend endpoint:

```env
NEXT_PUBLIC_BASE_API=https://mini-erp-system-backend.vercel.app/api/v1
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### 3. Build for Production
```bash
npm run build
```
The optimized production bundle will build inside the `.next` directory.
