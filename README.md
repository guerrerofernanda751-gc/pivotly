# Pivotly

A simple financial diagnosis for entrepreneurs and small business owners in
Mexico. Users answer a short questionnaire and get a clear "financial
traffic light" result — Stable, Review, or Attention — along with practical
tools and short lessons matched to their result.

**Tagline:** Make smarter moves for your business.

## Tech stack

- [Next.js](https://nextjs.org/) (App Router)
- [Tailwind CSS](https://tailwindcss.com/)
- [Supabase](https://supabase.com/) (database, connected but not yet used for data)
- Deployed on [Vercel](https://vercel.com/)

## Getting started (local development)

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env.local` and fill in your Supabase project URL
   and anon key (found in your Supabase project under Settings > API).
3. Run the dev server:
   ```
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Description |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase project's public anon key |

## Project status (Builder Infrastructure sprint)

This week's scope is intentionally limited to the project shell:

- ✅ Homepage, navbar, footer
- ✅ `/docs` placeholder page
- ✅ Supabase project created and connected (no real data yet)
- ✅ Deployed to Vercel

Not in scope yet: the real diagnosis questionnaire, price calculator logic,
authentication, or any live database reads/writes.
Week 0 status: homepage, navigation, and Supabase connection verified live on the deployed site.
