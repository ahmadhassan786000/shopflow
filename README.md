# ShopFlow — E-Commerce Platform

Production-oriented e-commerce app built with Next.js (App Router), TypeScript, PostgreSQL/Prisma, and Auth.js.

## Stack

- **Framework:** Next.js 15 (App Router), React 18, TypeScript
- **UI:** Bootstrap (base components/layout) + Tailwind (utility styling), configured to coexist
- **Database:** PostgreSQL via Prisma ORM
- **Auth:** Auth.js — email/password (bcrypt) + Google + Facebook OAuth, database sessions
- **Validation:** Zod (shared between client forms and server actions)

## Getting started

```bash
npm install
cp .env.example .env      # fill in DATABASE_URL, AUTH_SECRET, OAuth keys
npx prisma migrate dev --name init
npm run prisma:seed        # creates an admin user: admin@example.com / ChangeMe123!
npm run dev
```

Generate `AUTH_SECRET` with `openssl rand -base64 32`.

## Architecture notes

- `src/app` — route groups: `(public)`, `(auth)`, `(customer)`, `admin/`, `api/`
- `src/components` — presentational, reusable, prop-configurable
- `src/services` — business logic (kept out of page components and route handlers)
- `src/lib/validations` — Zod schemas, imported by both client forms and server actions
- `src/lib/authorize.ts` — the actual authorization enforcement layer. `middleware.ts` only
  gates page loads for UX; every sensitive server action re-checks the session and role.

## Build roadmap

- [x] 1. Project setup, config, Prisma schema
- [x] 2. Authentication (register/login/verify/reset) + OAuth
- [x] 3. Layout (navbar, footer, mobile nav)
- [x] 4. Product catalog + categories + search/filter/pagination
- [x] 5. Cart + wishlist
- [x] 6. Checkout + orders
- [x] 7. Admin dashboard (products, categories, orders, users, coupons, reviews)
- [x] 8. Reviews
- [x] 9. Coupons
- [x] 10. Payment integration — architecture in place (`src/services/paymentService.ts`,
      `src/app/api/webhooks/stripe/route.ts`); activate by installing `stripe` and adding
      `PAYMENT_SECRET_KEY` / `STRIPE_WEBHOOK_SECRET`
- [x] 11. Security hardening — HTTP security headers, rate limiting, server-side auth
      checks on every mutation, generic auth error messages, file upload validation
- [x] 12. SEO — dynamic sitemap, robots.txt, per-page metadata, Product structured data
- [x] 13. Testing — example Vitest suite for coupon math (`npm test`); extend with
      integration tests against a real test database for cartService/orderService
- [ ] 14. Deployment — see below

## Deploying

1. Provision a PostgreSQL database (Neon, Supabase, RDS, Railway, etc).
2. Push schema: `npx prisma migrate deploy`.
3. Deploy to Vercel (or any Node host): set all variables from `.env.example` in your
   host's environment settings — never commit real values.
4. Set `NEXT_PUBLIC_SITE_URL` to your production domain (needed for OAuth callbacks,
   sitemap, and Open Graph URLs).
5. Register OAuth redirect URIs with Google/Facebook:
   `https://yourdomain.com/api/auth/callback/google` and `.../facebook`.
6. Point your Stripe webhook to `https://yourdomain.com/api/webhooks/stripe` once
   payment integration is activated.

## What's a working slice vs. what needs your keys to finish

Everything above is real, functional code — not placeholders — with one exception:
live payment processing needs your own Stripe account and keys before money can
actually move (the service layer and webhook route are wired and ready for them).
Everything else — auth, RBAC, catalog, cart, checkout math, orders, the full admin
CRUD suite, reviews, coupons, SEO, and security headers — works end-to-end once
you point `DATABASE_URL` at a real Postgres instance and run the migration.
