# SwiftShip — Courier Management Frontend

Next.js 15 (App Router) frontend for the courier management backend.

## Stack
Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion · TanStack Query · Axios ·
React Hook Form + Zod · Recharts · next-themes · Sonner

## Getting started
1. Start the backend (see `courier-management-backend/README.md`), by default on `http://localhost:4000`.
2. Copy `.env.example` to `.env.local` and set `NEXT_PUBLIC_API_URL` if the backend runs elsewhere.
3. Install and run:
   ```bash
   npm install
   npm run dev
   ```
   Open http://localhost:3000.

## Scripts
- `npm run dev` — development server
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint

## Structure
```
app/(marketing)   public pages: landing, tracking
app/(auth)        login, register, forgot/reset password
app/(dashboard)   customer (/dashboard), admin (/admin), courier (/courier)
components/ui     shadcn/ui primitives
components/…      brand, shared, marketing and dashboard components
lib/api           typed API client (Axios) and endpoints
lib/i18n          English / বাংলা dictionaries
middleware.ts     role-based route protection
```

## Auth
The JWT from `/api/auth/login` is stored in the `ss_token` cookie. `middleware.ts` reads it to
keep each role in its own area; the backend still verifies every request.
