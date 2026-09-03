# Invoicing Frontend

A responsive inventory and invoicing frontend for the Invoicing application.

The UI is based on and adapted from the open-source **InvoiceFlow** project by `manas0x`, rather than being built from scratch. Firebase-specific data access was removed and replaced with the application's Cloudflare Workers API.

## Features

- Email/password login and signup
- Session-based authentication
- Admin and user role-aware UI
- Dashboard with sales, inventory and customer summaries
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
├── components.jsx  # Shared responsive UI components
├── App.jsx         # Application shell and routes/views
├── main.jsx        # React entry point
└── index.css       # Tailwind and application styles
```

## Backend

The frontend consumes the separate Cloudflare Workers backend:

`https://github.com/hi-manss/Invoicing-mirco-saas`

Configure the API URL with:

```env
VITE_API_URL=http://localhost:8787/api
```

For production, set `VITE_API_URL` to the deployed Workers API URL.

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

## Responsive UI

The interface is designed mobile-first and adapts across:

- Mobile phones
- Tablets
- Laptops
- Desktop displays

Tables use horizontal scrolling where necessary, forms collapse into single-column layouts on smaller screens, and navigation adapts for compact displays.

## Source Attribution

Visual and interaction patterns were adapted from:

- **InvoiceFlow** — `manas0x/invoiceflow`

The Firebase implementation from the reference project is not used by this application. The adapted frontend communicates with the project's own Cloudflare Workers/D1 backend.

## License

This repository follows the licensing requirements of the source project and any dependencies/components incorporated into the frontend. Review the upstream repository's license before redistributing substantial portions of the adapted UI.
