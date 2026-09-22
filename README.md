# Habit Tracker — Auth & Data (Lessons 5.1–5.4)

React + Vite + Supabase. Each signed-in user sees and manages only their own habits.

## Setup

1. Create a project at [supabase.com](https://supabase.com).
2. In your Supabase project → **SQL Editor**, paste and run `sql/schema.sql`. It creates `habits` and `daily_logs`, turns on RLS, and adds owner-only policies for every operation.
3. Copy `.env.example` to `.env` and fill in your project's URL and anon key (Project Settings → API):
   ```
   VITE_SUPABASE_URL=...
   VITE_SUPABASE_ANON_KEY=...
   ```
4. Install and run:
   ```
   npm install
   npm run dev
   ```
5. Sign up with a real-looking email through the app itself (top of `/login`). If your Supabase project has email confirmation on, confirm via the email before signing in. Supabase's default setup also lets you disable confirmation in **Authentication → Providers → Email** while developing.

## What's where

| File | Purpose |
|---|---|
| `src/lib/supabase.js` | Single Supabase client, reads keys from `.env` |
| `sql/schema.sql` | Tables, cascade FK, RLS policies |
| `src/context/AuthContext.jsx` | Session state via `onAuthStateChange` |
| `src/components/ProtectedRoute.jsx` | Redirects to `/login` with no session |
| `src/pages/Login.jsx` | Sign-up / sign-in form |
| `src/api/habits.js` | CRUD, every query scoped to `user_id` |
| `src/pages/HabitTracker.jsx` | List / add / edit / toggle / delete UI |

## Audit checklist (do this before submitting)

- [ ] `git status` shows **no** `.env` file tracked
- [ ] Sign up as a second test account → habit list is **empty**, no error
- [ ] Delete a habit → its `daily_logs` rows are gone too (check the Table Editor)
- [ ] Refresh the page while signed in → still signed in, habits still there
- [ ] Supabase → Authentication → Policies shows 4 policies on `habits` and 4 on `daily_logs`

## If RLS were disabled

With RLS off, the anon key shipped to every browser is the only thing standing between an attacker and the data, and it grants full table access — so an attacker could open the browser console on the deployed site, reuse that same public anon key, and directly read, edit, or delete every user's habits and logs, not just their own.
