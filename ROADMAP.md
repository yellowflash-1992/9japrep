# My-Exam-App — Build & Monetize Roadmap

_Last updated: {today's date}_

## 🎯 Goal

Turn this JAMB/WAEC/NECO CBT practice app into a paid product generating
₦50,000+/month from Nigerian students preparing for 2026 exams.

## 💰 Business Model

---

## 🎯 STRATEGIC PIVOT (March 2026)

### The Market Reality

- **Android market is saturated:** 200+ free JAMB CBT apps on Play Store.
  Top 10 have 100k+ downloads each. Competing head-on = losing.
- **Desktop CBT centers are underserved:** Students practice on phones,
  but take the actual exam on desktop with the real JAMB CBT interface.
  Nobody simulates this well.
- **Cyber cafés (₦100-300/hour):** No internet, Windows desktops, can't
  install apps. Free Android apps can't serve this market.
- **Schools/tutorial centers have money:** ₦30k-100k/year budgets for
  CBT prep tools. But no good options for adding their own questions.

### The Strategic Answer: PWA + B2B Focus

**Do NOT build a separate desktop app. Do NOT chase the crowded mobile
market head-on. Convert to PWA and position as "Real JAMB CBT Simulator."**

| Aspect              | Decision                                                                                    |
| ------------------- | ------------------------------------------------------------------------------------------- |
| Platform            | **PWA** — installable on Android home screen AND desktop, works offline, one codebase       |
| Primary positioning | **"The Real JAMB CBT Simulator"** (not "another JAMB app")                                  |
| Primary revenue     | **B2B** — schools + tutorial centers (₦30-100k/school/year)                                 |
| Secondary revenue   | **B2C** — students on premium (₦2,000 one-time)                                             |
| Competitive moat    | **Admin app** (schools add their own questions) + **offline mode** + **real CBT interface** |
| Target acquisition  | B2B: walk into 5 Ibadan tutorial centers. B2C: WhatsApp groups, TikTok, Twitter             |

### Revenue Projection (Hybrid B2C + B2B)

| Month | B2C users | B2C paying  | B2B schools | Total revenue |
| ----- | --------- | ----------- | ----------- | ------------- |
| 3     | 500       | 8 (₦16k)    | 2 (₦60k)    | ₦76,000       |
| 6     | 3,000     | 45 (₦90k)   | 8 (₦240k)   | ₦330,000      |
| 12    | 10,000    | 150 (₦300k) | 25 (₦750k)  | ₦1,050,000    |

**B2B customers pay 10x more than B2C.** 5 schools = 100+ B2C premium users.

---

## 📋 REVISED PHASES

### PHASE 0 — Foundation ✅ COMPLETE

- [x] Router: HashRouter → BrowserRouter (Vercel-ready)
- [x] USE_MOCK_DATA flag silences api.example.com console errors
- [x] Deploy to Vercel at 9japrep.vercel.app
- [x] Fix case-sensitive imports (Windows → Linux)
- [x] Remove `base` path from vite.config.js
- [x] Rebrand to 9jaPrep
- [x] QuickGrid 2-col on mobile

**State:** App loads, works on mobile without horizontal overflow, no console errors.

---

### PHASE 1.5 — Convert to PWA (4 hours, UNBLOCKS EVERYTHING) 🔥 PRIORITY

**Goal:** App installable on Android home screen + desktop, works offline
after first load. Zero rebuild — just add 3 files + config.

**Why first:** Unlocks B2B sales pitch ("works at cyber cafés with no internet")
and mobile install conversion. Highest ROI per hour of work.

**Steps:**

1. `npm install vite-plugin-pwa`
2. Update `vite.config.js`:

   ```js
   import { VitePWA } from 'vite-plugin-pwa'
   plugins: [
     react({...}),
     tailwindcss(),
     VitePWA({
       registerType: 'autoUpdate',
       manifest: {
         name: '9jaPrep — JAMB, WAEC, NECO CBT',
         short_name: '9jaPrep',
         description: 'Practice real JAMB CBT interface. Works offline.',
         theme_color: '#0f172a',
         background_color: '#f8fafc',
         display: 'standalone',
         start_url: '/',
         icons: [
           { src: 'icon-192.png', sizes: '192x192', type: 'image/png' },
           { src: 'icon-512.png', sizes: '512x512', type: 'image/png' }
         ]
       }
     })
   ]

   ## 📋 PHASES
   ```

### PHASE 0 — Fix Foundation (DONE or nearly done)

**Goal:** App runs locally + deploys without errors

### PHASE 0 — Fix Foundation ✅ COMPLETE

- [x] Router: HashRouter → BrowserRouter (Vercel-ready)
- [x] Kill console spam from 5 mock hooks (USE_MOCK_DATA flag)
- [x] Verify all routes render
- [x] Deploy to Vercel at https://9japrep.vercel.app
- [x] Fix case-sensitive imports (Windows → Linux)
- [x] Remove `base` path from vite.config.js
- [x] Rebrand to CBTify → 9japrep

**Commands:**
\`\`\`bash
npm run dev # verify no console errors
npm run build # verify build succeeds
\`\`\`

**Commit:** `git commit -m "phase 0: foundation fixes"`

---

### PHASE 1 — Polish For Trust (2-3 sessions)

**Goal:** App looks professional, works on all devices, no empty/broken UI

**Phase 1A — Responsive**

- Test at 320 / 375 / 768 / 1280 px
- Fix any horizontal overflow, clipped text, off-screen buttons
- Prompt: "Make X responsive. Check at 375px + 1280px. Show diff, wait for yes."
- Commit after each component: `git commit -m "phase 1: responsive <component>"`

**Phase 1B — Loading + Empty States**

- Every hook already has `loading` and `error` — use them
- Add skeleton loaders or "Loading..." for content sections
- Add "No data available" fallbacks
- Prompt: "Add loading states to all components using useNews/useEvents/etc."

**Phase 1C — Typography + Colors**

- Add Google Fonts (Inter + Playfair Display or similar)
- Consolidate Tailwind theme with brand colors
- Consistent headings, buttons, inputs
- Prompt: same pattern as Hospital project Phase 2

**Phase 1D — Mobile Test on Real Phone**

- Open Vercel URL on your actual phone
- Test every flow: login, take exam, see results, navigate
- Fix anything that feels off

**Commit:** `git commit -m "phase 1: polish complete"`

---

### PHASE 2 — Real Backend (1 week)

**Goal:** Data lives in Supabase, not hardcoded. Users can sign up.

**Phase 2A — Supabase Setup**

1. Create account at supabase.com (free)
2. New project (choose region: EU West)
3. Copy `NEXT_PUBLIC_SUPABASE_URL` + `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. `npm install @supabase/supabase-js`
5. Create `src/lib/supabase.js`:

\`\`\`js
import { createClient } from '@supabase/supabase-js'
export const supabase = createClient(
import.meta.env.VITE_SUPABASE_URL,
import.meta.env.VITE_SUPABASE_ANON_KEY
)
\`\`\`

6. Add `.env.local` (gitignored):
   \`\`\`
   VITE_SUPABASE_URL=https://xxx.supabase.co
   VITE_SUPABASE_ANON_KEY=xxx
   \`\`\`

**Phase 2B — Database Schema**
Run this SQL in Supabase SQL editor:
\`\`\`sql
-- Users are handled by Supabase Auth. This is extra profile data.
create table profiles (
id uuid references auth.users primary key,
full_name text,
exam_type text check (exam_type in ('jamb','waec','neco')),
school text,
created_at timestamptz default now()
);

-- Questions (moved from jambQuestionBank.js etc)
create table questions (
id uuid primary key default gen_random_uuid(),
exam_type text not null,
subject text not null,
year int,
question_text text not null,
options jsonb not null,
correct_option int not null,
explanation text,
is_premium boolean default false,
created_at timestamptz default now()
);

-- Exam attempts
create table attempts (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
exam_type text not null,
subject text,
score int,
total int,
started_at timestamptz default now(),
completed_at timestamptz
);

-- Subscriptions / payments
create table subscriptions (
id uuid primary key default gen_random_uuid(),
user_id uuid references auth.users not null,
plan text check (plan in ('one_time','monthly')),
amount_kobo int,
paystack_ref text unique,
active_until timestamptz,
created_at timestamptz default now()
);

-- Row Level Security (permissive for MVP, tighten later)
alter table profiles enable row level security;
alter table questions enable row level security;
alter table attempts enable row level security;
alter table subscriptions enable row level security;

create policy "read own profile" on profiles for select using (auth.uid() = id);
create policy "update own profile" on profiles for update using (auth.uid() = id);
create policy "read questions" on questions for select using (true);
create policy "read own attempts" on attempts for select using (auth.uid() = user_id);
create policy "insert own attempts" on attempts for insert with check (auth.uid() = user_id);
create policy "read own subscription" on subscriptions for select using (auth.uid() = user_id);
\`\`\`

**Phase 2C — Auth Flow**

- Signup page (email + password)
- Login page (already have modals — replace with Supabase auth calls)
- ProtectedRoute: check `supabase.auth.getSession()`
- Prompt: "Wire up Supabase auth. Replace local login modals with Supabase calls. Show diff per file."

**Phase 2D — Seed Questions**

- Export jambQuestionBank.js data to CSV
- Import to Supabase `questions` table via dashboard
- Update useLogic hook to fetch from Supabase instead of local file

**Commit:** `git commit -m "phase 2: supabase backend + auth"`

---

### PHASE 3 — Wire Admin App (1 week)

**Goal:** Admin can add/edit questions, they appear in exam app

**Phase 3A — Admin app connects to SAME Supabase**

- Add same Supabase credentials to admin app
- Admin auth: use Supabase, role="admin" in profiles table

**Phase 3B — Admin features**

- List all questions (paginated)
- Create question form
- Edit / delete buttons
- Bulk import CSV
- User list (view signups, subscription status)
- Analytics: attempts per day, popular subjects

**Phase 3C — Sync admin → exam**

- No sync needed if both use Supabase (single source of truth)
- When admin adds question with `is_premium=false`, it appears in free exam
- When admin marks `is_premium=true`, only paid users see it

**Commit:** `git commit -m "phase 3: admin wired to supabase"`

---

### PHASE 4 — Payments (3-5 days)

**Goal:** Students can pay ₦2,000 and unlock everything

**Phase 4A — Paystack account**

1. Register at paystack.com (free)
2. Get test secret key (starts with `sk_test_`)
3. Get public key (starts with `pk_test_`)

**Phase 4B — Supabase Edge Function for payment init**
Create `supabase/functions/paystack-init/index.ts`:
\`\`\`ts
import { serve } from "https://deno.land/std/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js"

serve(async (req) => {
const { email, amount } = await req.json()
const res = await fetch('https://api.paystack.co/transaction/initialize', {
method: 'POST',
headers: {
Authorization: `Bearer ${Deno.env.get('PAYSTACK_SECRET_KEY')}`,
'Content-Type': 'application/json'
},
body: JSON.stringify({ email, amount: amount \* 100 }) // kobo
})
const data = await res.json()
return new Response(JSON.stringify(data), { headers: { 'Content-Type': 'application/json' } })
})
\`\`\`

**Phase 4C — Frontend pay button**

- "Unlock Full Access — ₦2,000" button on home + locked-question prompt
- Click → call edge function → redirect to `data.data.authorization_url`
- Callback URL: `https://your-app.vercel.app/payment-callback`
- On callback page: verify reference via Paystack API → update `subscriptions` table → activate user

**Phase 4D — Freemium gates in the app**

- `useSubscription()` hook: returns `isPremium` bool
- In exam questions loop: if `question.is_premium && !isPremium`, show "Unlock to see this question" card
- Lock "Full Mock Exam" behind paywall

**Commit:** `git commit -m "phase 4: paystack payments + freemium"`

---

### PHASE 5 — Deploy + Launch (ongoing)

**Goal:** Real students using it, real money coming in

**Phase 5A — Deploy**

- Push main repo to Vercel: `vercel` CLI or dashboard import
- Add env vars in Vercel dashboard
- Buy domain (Namecheap ~₦10k/year): `myexamapp.com.ng` or similar
- Point domain to Vercel
- Deploy admin app to `admin.myexamapp.com.ng`

**Phase 5B — Legal basics**

- Add Privacy Policy + Terms pages
- Cookie consent (simple banner)
- NDPR: don't store more than needed

**Phase 5C — Launch channels (free first)**

1. Post in 5 WhatsApp student groups ("Free JAMB mock exam this weekend")
2. Visit 3 JAMB tutorial centers in Ibadan → ask owner to share with students
3. Post on Twitter/X with hashtag #JAMB2026
4. Post on Nairaland (Education section)
5. Ask friends to share

**Phase 5D — Track + iterate**

- Add Google Analytics or Plausible (free tier)
- Track: signups, attempts, pay button clicks, conversions
- If conversion < 2%: reduce price or improve locked-question prompt
- If signups < 50 in first week: marketing needs work, not product

**Commit:** `git commit -m "phase 5: launched"`

---

## 🚨 Lessons From Hospital + Todos Projects

**These will save you hours. Read every time you start a session.**

1. **Copilot lies.** After every "yes, applied" or "done" → run `grep` or `git diff` before believing it.
2. **One component per prompt.** Never "fix everything at once."
3. **Commit after each win.** Small commits save you when something breaks.
4. **Test at 375px, 768px, 1280px** after every UI change.
5. **HashRouter for GH Pages, BrowserRouter for Vercel.** Different platforms, different needs.
6. **`vite.config.js` `base` path** must match deployment URL exactly (trailing slash matters).
7. **If a change breaks something** → `git checkout -- <file>` → try smaller scope.
8. **Never `npm audit fix --force`** mid-session. It breaks dependencies.
9. **Add `console.log`** when you can't figure out a state bug — don't guess.
10. **Copilot Chat ≠ file edit.** "Apply" must be clicked, then verify with `git diff`.

## 🎯 Session Start Ritual (do this every new chat)

\`\`\`bash
cd "Coding World/projects/My-Exam-App-using-React"
git status # clean?
git log --oneline -5 # what's the latest commit?
npm run dev # does it start?
\`\`\`

Then paste this into chat:

> "I'm on PHASE X of my ROADMAP.md. Latest commit was Y. Let's continue."

## 📊 Revenue Projections (realistic)

| Month           | Users | Paying | Revenue  |
| --------------- | ----- | ------ | -------- |
| 1 (launch)      | 200   | 5      | ₦10,000  |
| 2               | 500   | 15     | ₦30,000  |
| 3               | 1,000 | 30     | ₦60,000  |
| 6 (JAMB season) | 3,000 | 100    | ₦200,000 |

These assume: working app, decent marketing, no major bugs. Delays = no revenue.

## 🆘 If Stuck

- **Copilot won't apply edits**: use manual file edit + `Ctrl+S`
- **Vercel build fails**: run `npm run build` locally first — fix locally, redeploy
- **Supabase auth broken**: check dashboard → Authentication → Policies
- **Paystack test stuck**: test with `success@simulator.amazonses.com` email + test card `4084084084084081`
- **Lost context**: re-read this file, run Session Start Ritual, pick up at latest `[ ]` task

## ✅ Definition of "Sellable"

Before you charge the first person, ALL must be true:

- [ ] App loads on mobile (real phone, not just DevTools)
- [ ] Signup works
- [ ] Login works
- [ ] Take full mock exam → see score
- [ ] Payment goes through (test mode first, then live)
- [ ] Payment unlocks premium content
- [ ] Refresh doesn't lose progress
- [ ] 5 friends tested it and reported no bugs

**Don't skip this. First bad review from a paying user = game over.**

---

_End of roadmap. Update this file as you go — it's your source of truth._
