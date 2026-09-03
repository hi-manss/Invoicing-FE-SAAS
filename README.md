# Invoicing Frontend

A responsive inventory and invoicing frontend for the Invoicing application.

The frontend is being expanded toward the visual language and workflow patterns of **Hisaabo** while remaining connected to this application's own Cloudflare Workers + D1 backend. Hisaabo's public source is used as an implementation reference and adapted selectively for an internal/self-hosted business application.

## Features

- Email/password login and signup
- Session-based authentication
- Admin and user role-aware UI
- Dashboard with sales, inventory and customer summaries
- Hisaabo-style page headers, compact surfaces and status badges
- Hisaabo-style pill tabs and segmented controls
- Responsive slide-over/detail panels
- Date-range filtering primitives
- Quick-action cards and keyboard shortcut affordances
- Product/inventory CRUD
- Product and SKU search
- Customer CRUD and search
- Invoice creation with product search and cart
- Automatic stock reduction when an invoice is created
- Cash, UPI, Bank, Credit and Other payment methods
- Invoice history with search and pagination
- Invoice details
- Invoice PDF generation/download through the backend
- Admin invoice cancellation with stock restoration
- Inventory movement/history view
- Responsive layouts for mobile, tablet and desktop
- Tailwind CSS design system
- Lucide icons
- Framer Motion interactions

## Tech Stack

- React 19
- Vite
- Tailwind CSS
- Framer Motion
- Lucide React
- Cloudflare Workers API
- Cloudflare D1 backend

## Repository Structure

```text
src/
├── api.js          # Backend API client
├── components.jsx  # Shared Hisaabo-style UI primitives
├── App.jsx         # Application shell and views
├── main.jsx        # React entry point
└── index.css       # Tailwind and application styles
```

## Backend

The frontend consumes the separate Cloudflare Workers backend:

`https://github.com/hi-manss/Invoicing-mirco-saas`

Configure the API URL with:

```env
VITE_API_BASE_URL=http://localhost:8787/api
```

For production, set `VITE_API_BASE_URL` to the deployed Workers API URL.

## Local Development

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

## Authentication

The frontend uses the backend's HttpOnly session cookie. API requests are made with credentials enabled, so the session is not stored as a password/token in local storage.

Signup creates a normal `USER` account. Administrative operations are shown only for users whose backend role is `ADMIN`.

## Money & Invoice PDFs

Product prices and invoice totals are stored by the backend in paise. The frontend converts paise to INR for display.

Invoice PDFs are generated directly by the backend from D1 database values. The frontend does not use object storage/R2 for invoices.

## Hisaabo Source Attribution

The frontend uses and adapts visual and interaction patterns from the public **Hisaabo** repository:

`https://github.com/hisaabo/hisaabo`

Examples include the page-header structure, pill tabs, segmented controls, compact badges, detail fields, slide-over presentation, date-range controls, and invoice/document workflow patterns. The adapted application keeps its own React/Vite frontend and Cloudflare Workers/D1 API instead of importing Hisaabo's tRPC/business-account infrastructure.

Hisaabo's repository is distributed under the **O'Saasy License v1.0**. This application is intended for internal/self-hosted business use; the license/copyright notice must be retained when distributing substantial portions of the adapted Hisaabo source. See the upstream `LICENSE` file for the complete terms.

## Responsive UI

The interface is designed mobile-first and adapts across:

- Mobile phones
- Tablets
- Laptops
- Desktop displays

Tables use horizontal scrolling where necessary, forms collapse into single-column layouts on smaller screens, and navigation adapts for compact displays.

## License

See the upstream Hisaabo license for the terms covering adapted Hisaabo source, and the licenses of all other incorporated dependencies/source projects.
