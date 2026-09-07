# ISEYC Field Register Desk

> Quick reference for this deployment (Notion DB IDs, links, deploy checklist):
> see [SETUP.md](./SETUP.md).

An intake desk — not a public website — used to:

1. **Before 18 September 2026:** collect RSVPs for the Tirngan Sickle Cell Foundation
   5th Anniversary Dinner & Recognition Ceremony ("Five Years of Breaking Cycles and
   Building Futures").
2. **Ongoing:** keep a field/activity register of everyone who takes part in a
   programme activity (outreach visits, counseling sessions, genotype testing days,
   and the anniversary event itself).

Notion is the system of record. This app is the intake surface staff and invitees use
on a phone; every submission writes straight into the relevant Notion database.

**This is not a medical records system.** There are no diagnosis fields, no clinical
notes, and no health data beyond a short, optional "support received" tag for programme
reporting.

---

## How it works

- Two tabs, one desk: **Anniversary RSVP** and **Field participation**.
- The RSVP tab defaults to open until the event date; after that the desk defaults to
  the Field participation tab (staff can still switch tabs manually at any time).
- All writes happen server-side, inside Next.js API routes. The Notion integration
  token is never sent to the browser.
- Field participation can optionally be locked behind a shared staff passcode
  (`REGISTER_PASSCODE`). RSVP stays open to invitees regardless.

## Stack

- Next.js 14 (App Router) + TypeScript
- Tailwind CSS
- `@notionhq/client` (official Notion SDK)
- Zod for server-side validation

---

## Notion setup

Create **three** databases in Notion and connect an internal integration to all three
(Notion → Settings → Connections → your integration → share each database with it).

### Database A — Event RSVPs

| Property | Type |
|---|---|
| `Name` | Title |
| `Phone` | Phone number |
| `Email` | Email (optional) |
| `Role` | Select: Guest, Caregiver, Warrior, Volunteer, Staff, Partner, Media, Other |
| `Organisation` | Text (optional) |
| `Attendance` | Select: Will attend, Maybe, Cannot attend |
| `Plus ones` | Number |
| `Dietary or access note` | Text (optional) |
| `Consent` | Checkbox |
| `Source` | Select: Register Desk, WhatsApp, Referral, Other |
| `Submitted at` | Created time |

### Database B — Activities

| Property | Type |
|---|---|
| `Name` | Title |
| `Date` | Date |
| `Type` | Select: Genotype testing, Medication support, Counseling, Community outreach, School/hospital visit, Caregiver session, Anniversary event, Other |
| `Location` | Text |
| `Notes` | Text (optional) |
| `Recorded by` | Text |

### Database C — Participants

| Property | Type |
|---|---|
| `Name` | Title |
| `Role` | Select: Warrior (living with SCD), Caregiver, Volunteer, Staff, Partner, Community member, Other |
| `Phone` | Phone number (optional) |
| `Age group` | Select: Child, Youth, Adult, Prefer not to say |
| `Support received` | Multi-select: Genotype test, Medication, Counseling, Education only, Recognition, Anniversary attendance, Other |
| `Consent` | Checkbox |
| `Notes` | Text (optional) |
| `Activity` | Relation → Activities database |
| `Submitted at` | Created time |

Property names must match **exactly** (including capitalisation and spacing) — the app
writes to these by name.

---

## Environment variables

Copy `.env.example` to `.env.local` for local development:

```
NOTION_API_KEY=secret_xxx
NOTION_RSVP_DB_ID=dcea4593a1054d5aab80ea06a38ef503
NOTION_ACTIVITIES_DB_ID=d53844be1a8340eb8f60e54223fa4613
NOTION_PARTICIPANTS_DB_ID=d156bdbc4f6d4650ae0be757fec0b002
REGISTER_PASSCODE=
```

The three database IDs above are fixed for this programme's Notion workspace (see
[SETUP.md](./SETUP.md) for the direct Notion links). Only `NOTION_API_KEY` — the
integration secret — is yours to fill in.

- `NOTION_API_KEY` — from an internal integration at notion.so/my-integrations.
- The three DB IDs are already set in `.env.example`.
- `REGISTER_PASSCODE` is optional. If set, staff must enter it before using the Field
  participation tab. Leave blank to keep that tab open too.

---

## Local development

```bash
npm install
cp .env.example .env.local   # then fill in your values
npm run dev
```

Visit `http://localhost:3000`. Check `/api/health` to confirm which env vars are
detected (it never returns secret values, only booleans).

---

## Deploying to Vercel

1. Push this repo to GitHub.
2. In Vercel, "Add New Project" → import the repo.
3. Under **Settings → Environment Variables**, add the same variables as `.env.example`
   for the Production (and Preview, if used) environment.
4. Deploy. Vercel will run `next build` automatically.
5. Visit `/api/health` on the deployed URL to confirm `notionConfigured: true`.

No database, auth provider, or extra infrastructure is required — Notion is the only
backing store.

---

## What this app deliberately does not do

- No user accounts or login system (only an optional shared staff passcode)
- No PDF certificate generation
- No admin analytics dashboard
- No photo upload
- No chat, blog, or multi-language support
- No prices or donation checkout
- No diagnosis, clinical notes, or other medical data

## Project structure

```
src/
  app/
    page.tsx              Main Register Desk UI (both tabs)
    layout.tsx
    globals.css
    api/
      rsvp/route.ts        POST — create an RSVP record
      activity/route.ts    POST — create an activity
      participant/route.ts POST — create a participant, linked to an activity
      activities/route.ts  GET  — list recent activities for the dropdown
      health/route.ts      GET  — config status (no secrets)
  components/              Header, Footer, EventStrip, Tabs, forms, UI primitives
  lib/
    constants.ts           Event facts + Notion select-option lists
    validation.ts           Zod schemas
    notion.ts               Server-only Notion client + page builders
    passcode.ts             Server-only staff passcode check
```
