# SwiftShip — Courier Management Frontend

Next.js 15 (App Router) frontend for the courier management backend.

## Stack
Next.js 15 · TypeScript · Tailwind CSS v4 · shadcn/ui (Radix) · Motion · TanStack Query · Axios ·
React Hook Form + Zod · Recharts · next-themes · Sonner

## Quick start (local)
You need two terminals: one for the backend API, one for this frontend.

**1. Backend** (`courier-management-backend`, see its README for details)
```bash
npm install
cp .env.example .env      # fill in MONGODB_URI, JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD
npm run seed:demo         # your admin + demo accounts and sample parcels (or: npm run seed)
npm run dev               # API on http://localhost:4000
```

**2. Frontend** (this repo)
```bash
npm install
cp .env.example .env.local   # NEXT_PUBLIC_API_URL=http://localhost:4000
npm run dev                  # http://localhost:3000  (port busy? npm run dev -- -p 5001)
```

**3. Sign in** with the demo accounts created by `npm run seed:demo`:

| Role | Email | Password |
|---|---|---|
| Admin | admin@swiftship.test | Admin@123 |
| Courier | courier@swiftship.test | Courier@123 |
| Customer | customer@swiftship.test | Customer@123 |

Or create a customer on the Register page. Couriers are added by an admin under Admin → Couriers.

If pages say "Cannot reach the server", the backend is not running or `NEXT_PUBLIC_API_URL` points to the wrong address.
"Forgot password" without Gmail settings prints the reset code in the backend terminal.

## Scripts
- `npm run dev` — development server (webpack; works even where Windows Smart App Control blocks native binaries)
- `npm run dev:turbo` — faster development server with Turbopack (needs the native Next.js compiler)
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

## Pages
| Path | Who | What |
|---|---|---|
| `/` | everyone | Landing page with tracking search |
| `/track`, `/track/[id]` | everyone | Public parcel tracking (no personal data) |
| `/login`, `/register`, `/forgot-password`, `/reset-password` | everyone | Auth |
| `/dashboard`, `/dashboard/parcels`, `/dashboard/parcels/new`, `/dashboard/parcels/[id]` | customer | Overview, parcel list, booking wizard, details with edit/cancel |
| `/admin`, `/admin/parcels`, `/admin/parcels/[id]`, `/admin/couriers` | admin | KPIs and charts, parcel management, couriers |
| `/courier` | courier | Assigned deliveries with one-tap status updates |

## Deploying (e.g. Vercel)
1. Deploy the backend first and merge its `fix/security-and-tracking-api` branch (new endpoints are required).
2. Import this repo in Vercel (framework: Next.js, no extra settings).
3. Set the environment variable `NEXT_PUBLIC_API_URL` to the backend URL,
   e.g. `https://courier-management-backend-swrf.onrender.com` (no trailing slash).
4. Deploy. The backend uses open CORS, so no backend change is needed for the new domain.

The rows in the landing page hero preview (`components/marketing/hero.tsx`) are illustrative sample data, not real parcels.

## Auth
The JWT from `/api/auth/login` is stored in the `ss_token` cookie. `middleware.ts` reads it to
keep each role in its own area; the backend still verifies every request.
