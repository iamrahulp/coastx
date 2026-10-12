# CoastX

**Experience the Coast. Not Just Visit It.**

CoastX is a mobile-first discovery and booking demo for hands-on experiences around Mangaluru and coastal Karnataka. The project includes a customer marketplace, a demo checkout and CoastX Pass, sample partner and admin workspaces, and the first production database blueprint.

## Deployment Status

The current project can be deployed publicly as a **showcase/demo** on Vercel. It is **not ready to accept real bookings or real customer accounts**. Supabase is not connected to the app, `/profile` uses browser-only demo sign-in, `/admin` and `/partner` are open sample workspaces, and booking checkout is a mock payment. The Supabase schema is a starting migration only; running it does not connect the website to that database.

There are no `/login`, `/signup`, or `/auth/callback` routes yet. Do not add callback URLs in Supabase until those real authentication routes are implemented. `.env.example` contains blank placeholders only; adding keys there by itself does not activate a service.

## Open CoastX

You need Node.js 20.9 or newer. This computer already has Node.js installed.

1. In VS Code, open **Terminal → New Terminal**.
2. Type `npm run dev` and press Enter.
3. Open the local link printed in the terminal, usually `http://localhost:3000`.
4. To stop CoastX, click the terminal and press **Control + C**.
5. To start it again, repeat `npm run dev`.

The app runs without a Supabase account, payment key, map account or weather key. The first-run experience list and operator names are fictional demo content. Replace sample businesses and photographs with authorized real content before a public launch.

## Try The Demo

- **Customer:** open `/profile`, then select **CoastX Guest** or use your own email. The email option is a local shortcut, not a real sign-in.
- **Partner:** open `/partner`. The sidebar links include bookings, availability, reviews and a sample experience draft form.
- **Admin:** open `/admin`. The demo workspace includes review/approval controls for sample partners and listings.
- **Book an experience:** choose any listing, select a date and time, enter guest details, then choose **Confirm demo payment**. No money moves. Your booking and QR CoastX Pass are saved in that browser.

The demo profile, saved hearts, bookings and day plans live in that browser’s local storage. They are not shared between devices or users, and clearing browser data removes them. The public booking API checks names, dates, guest counts, price and demo slot capacity, but its in-memory seat counts reset when a server process restarts and concurrent Vercel instances do not share inventory. Demo confirmations are not payment receipts or real reservations. Do not use demo checkout for actual bookings.

## What Is Included

- Responsive home page, 30 sample coastal activities, search, category filtering, wishlist and explore sorting/filters.
- Experience detail pages, sample conditions and illustrative map previews.
- Customer demo profile, trips, rule-based day planner, and printable QR CoastX Pass.
- Local mock-payment checkout with server-side price and input validation.
- Partner and admin demo workspaces with sample booking actions, listing approval and draft listing form.
- Supabase/PostgreSQL migration with relational tables, RLS policies, and a row-locked slot reservation function.
- Draft legal-policy pages, page metadata, Open Graph metadata, sitemap, robots rules and an installable PWA manifest.

The SQL migration is a production starting point, not a connected database. The partner/admin screens use sample data and are not protected by login or secure user permissions. Map panels are illustrations, weather values are demo values, and demo photos load directly from Unsplash by image ID; they are not stored in CoastX or optimized by Next.js image processing. There is no real identity verification, payment capture, refund or email/SMS notification yet.

## Change The CoastX Look

- **Logo:** the text logo lives in `src/components/site-chrome.tsx`. The install icon is `public/coastx-icon.svg`.
- **Colours and layout:** brand colours and responsive styles are in `src/app/globals.css`.
- **Experiences:** the current demo catalog is in `src/data/experiences.ts`.
- **Photos:** each experience uses an Unsplash image ID in that catalog. Replace those IDs with photos CoastX owns or has permission to use before launch.
- **Locations and categories for Supabase:** edit `supabase/seed.sql`.

## Connect Supabase

Supabase is where production accounts, PostgreSQL data, and uploaded photos should live. The browser demo does not connect to it yet.

1. Go to [supabase.com](https://supabase.com) and create a project for CoastX.
2. In the project dashboard, open **Project Settings → API**. Copy the project URL and the **publishable/anon key**.
3. Copy `.env.example` to a new file named `.env.local` in the CoastX folder. Paste the URL into `NEXT_PUBLIC_SUPABASE_URL` and the publishable/anon key into `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
4. Keep `SUPABASE_SERVICE_ROLE_KEY` private. It may only be used by secure server code. Never put it in a `NEXT_PUBLIC_` variable, a web page, or a message.
5. Open Supabase **SQL Editor**, run `supabase/migrations/202610120001_coastx_core.sql`, then run `supabase/seed.sql`.
6. Supabase **Authentication → Providers** is where email and later Google sign-in are configured. Create private Storage buckets and restrict uploads to the signed-in partner who owns each listing.

**Important:** the current CoastX pages do not read these Supabase variables and no `/auth/callback` route exists. The SQL files do not configure Authentication URLs, create demo users, seed demo experiences, or connect the frontend. A developer must implement and test the Supabase Auth/session integration before adding any production redirect URL. After that route exists, the Supabase Auth URL allow-list should include the exact production callback, for example `https://YOUR-VERCEL-DOMAIN/auth/callback`, plus the local callback used for testing. Do not configure a guessed domain.

The schema starts a booking as `pending_payment`. Only a server-side Razorpay signature/webhook verification should change a live booking to `confirmed`. Add real authentication, secure route checks, scheduled release of expired seat holds, tested RLS policies and an audited admin onboarding path before connecting real users.

## Connect Real Payments

Create a Razorpay account at [razorpay.com](https://razorpay.com), enable a test account first, and use Razorpay’s official server SDK to create orders and verify signatures. Configure the webhook in the Razorpay dashboard. Add its values to `.env.local` as `RAZORPAY_KEY_ID`, `RAZORPAY_KEY_SECRET` and `RAZORPAY_WEBHOOK_SECRET`.

The current checkout is deliberately labelled **DEMO CHECKOUT** and does not connect to Razorpay. Razorpay environment variables are unused. Do not mark a real booking paid from a browser success message. Validate Razorpay signatures on the server and only confirm payment from the verified server response/webhook.

## Connect Maps And Weather

- Create a Mapbox account at [mapbox.com](https://www.mapbox.com), create a restricted public map token, and add it as `NEXT_PUBLIC_MAPBOX_TOKEN`. Replace the illustrative map panels with a real map and actual, reviewed experience coordinates.
- Choose a weather provider that covers the Indian coast. Add its private key as `WEATHER_API_KEY` and call it from a server endpoint. Cache forecasts, show their time/source, and have local operators make final safety and cancellation decisions.
- The sample map pins and weather conditions are not navigation or safety information.

## Checks

In the VS Code terminal:

```sh
npm test
npm run lint
npm run typecheck
npm run build
```

The production build includes 30 listing pages and can take a short while. The current automated tests cover Vercel/local site URL selection only. Add browser and database tests for authentication, payments, RLS and persistent booking capacity before a real launch. The local mock-payment path is only a demonstration, not a payment-integration test.

## Deploy

Vercel is the simplest hosting option for this Next.js app.

1. Create a GitHub account at [github.com](https://github.com) if you do not already have one. This workspace has no GitHub remote yet.
2. Create a new **private** repository named `coastx`. Do not upload `.env.local`, credentials, or customer information.
3. Create a Vercel account at [vercel.com](https://vercel.com), choose **Add New → Project**, connect GitHub, and import `coastx`.
4. Keep the detected Next.js framework and the `npm run build` build command. Vercel provides the free `*.vercel.app` URL and supplies its own deployment domain variables.
5. For the public demo, no API environment values are required. `NEXT_PUBLIC_SITE_URL` is optional because the app reads Vercel’s production hostname automatically. Never paste a service-role key or payment secret into a `NEXT_PUBLIC_` field.
6. Deploy and test the demo URL. This deployment does not activate Supabase, real authentication, or live payments. Connect those only after their application integration is implemented and verified.

The CoastX admin and partner dashboards in this demo are not access-controlled and must not be presented as secure production dashboards.

## Before Taking Real Bookings

Connect Supabase Auth and RLS, persist listing/time-slot content, enforce role checks on every private route and server action, implement Razorpay order creation and verified webhooks/refunds, add reservation expiration and concurrency tests, replace all fictional operators/photos with consented content, connect real mapping/weather sources, review legal and safety policies professionally, and test the complete mobile flow against production-like accounts.