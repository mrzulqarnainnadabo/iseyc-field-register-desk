# From Girlhood to Greatness — Second Edition

A standalone event website and restricted event-day registration/check-in workspace for **Empower with Hafsat**.

## Approved event information

- **Theme:** Accepting My Greatness — From Becoming Her to Believing in Her.
- **Organiser:** Empower with Hafsat
- **Partner:** Baytal Rihaa
- **Systems partner:** Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- **Date/time:** Sunday, 29 November 2026 · 1:00 PM
- **Venue:** Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- **Audience:** Women aged 20 and above

This is an independent event platform. ISEYC is the systems partner, not the event organiser. Do not invent speakers, programme items, attendance figures or endorsements.

## Application surfaces

- `/` — public event information and registration.
- `/feedback` — anonymous post-event feedback.
- `/staff` — restricted staff access, guest search, filters, cursor pagination, check-in, walk-in capture, CSV export and sign-out.
- `/api/health/notion` — Notion integration health.
- `/api/register`, `/api/feedback`, `/api/staff/*` — server routes.

## Design and performance

- Next.js 15, React 19, TypeScript, Tailwind CSS, Zod and the Notion SDK.
- Uses the original Empower with Hafsat brand asset and a restrained plum/rose/gold palette.
- The hero is a lightweight typographic campaign composition; it does not load the retired generated campaign image or require its external image origin.
- CSS-only entrance and micro-interactions respect `prefers-reduced-motion`.
- No additional animation framework or heavy visual dependency.

## Local setup

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Use the dedicated GTG Notion integration and share the two GTG databases with it.
4. Configure `NOTION_API_KEY`, `NOTION_REGISTRATIONS_DB_ID`, `NOTION_FEEDBACK_DB_ID`, `REGISTER_PASSCODE`, `SESSION_SECRET` (32+ characters) and `NEXT_PUBLIC_SITE_URL`.
5. Run `npm ci`, then `npm run dev`.

Do not reuse the ISEYC × TIRNGAN production databases or credentials. Never commit `.env.local` or expose server credentials in client code.

## Verification and release candidate

The current review branch and exact release-candidate commit are tracked in [PR #2](https://github.com/mrzulqarnainnadabo/iseyc-field-register-desk/pull/2). The current preview URL and CI run are recorded there after each final candidate update.

The current acceptance cycle includes:
- Automated GitHub Actions checks: dependency/security threshold, typecheck, lint, production build, isolated server and Playwright browser QA.
- Live preview checks: homepage, feedback, staff, registration configuration and Notion health.
- Live API regression: registration write/replay, duplicate-person rejection, invalid registration, anonymous feedback write/replay, invalid staff login and unauthenticated staff-list rejection.
- Synthetic registration and feedback records created for the regression were moved to Notion Trash. Follow-up Notion search returned no matches for those synthetic submission IDs. No genuine attendee records were touched.

Automated browser QA includes a 360px mobile-width overflow check. Manual review on a physical mobile device and desktop remains an owner acceptance step.

## Security and operational limitations

- Registration and feedback use server-side validation and report success only after the Notion write succeeds.
- Staff routes require signed sessions; cookies use `httpOnly`, `sameSite=strict` and `secure` in production.
- Rate limiting is bounded but process-local, not distributed.
- Duplicate name/phone protection is query-before-create and is not atomic under concurrent requests.
- Staff access uses a shared passcode, not individual staff identities.
- Offline registration/check-in queueing is not implemented.
- CSV export covers the currently loaded page, not every database row.

## Deployment status — 28 November 2026

- Dedicated Vercel project: `from-girlhood-to-greatness`.
- Canonical domain: `https://fromgirlhoodtogreatness.vercel.app`.
- The production domain remains on the older deployment: `/api/register` reports `configured: false`; `/api/health/notion` returns HTTP 503 and Notion unconfigured.
- The standalone Vercel project remains paused (`live: false`).
- The existing `NOTION_API_KEY` is encrypted but still has `config` visibility and Vercel's `readable-secret` warning. Change its visibility to **Sensitive** in Vercel, preserving the existing value and Preview + Production targets. Do not rotate or expose it.
- `REGISTER_PASSCODE` and `SESSION_SECRET` are already Sensitive.
- PR #2 remains open and unmerged. The production domain has not been promoted, redeployed or unpaused.

## Remaining owner-only release gates

1. Change the existing `NOTION_API_KEY` to Sensitive visibility in Vercel without rotating or exposing its value.
2. Complete authenticated staff acceptance using the owner-held passcode: login, search, filters, pagination, walk-in, check-in, CSV and sign-out. The passcode must not be shared in chat or logs.
3. Complete manual visual review on a physical mobile device and desktop.
4. After those gates, issue a separate explicit production deployment instruction.

The existing ISEYC × TIRNGAN application, data, credentials and domain must remain untouched.
