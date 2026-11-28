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

This is an independent event platform. ISEYC is the registration and documentation systems partner, not the event organiser. No unapproved speakers or programme details are invented.

## Application

- `/` — public event website and registration.
- `/staff` — restricted staff sign-in, guest search, cursor pagination, attendance filters, check-in, walk-in capture and CSV export of loaded results.
- `/feedback` — anonymous feedback.
- `/api/health/notion` — Notion integration health.
- `/api/register`, `/api/feedback`, `/api/staff/*` — server routes.

## Stack

Next.js 15, React 19, TypeScript, Tailwind CSS, Zod and the Notion SDK.

## Local setup

1. Use Node.js 20 or newer.
2. Copy `.env.example` to `.env.local`.
3. Use the dedicated GTG Notion integration and share the two GTG databases with it.
4. Configure `NOTION_API_KEY`, `NOTION_REGISTRATIONS_DB_ID`, `NOTION_FEEDBACK_DB_ID`, `REGISTER_PASSCODE`, `SESSION_SECRET` (32+ characters) and `NEXT_PUBLIC_SITE_URL`.
5. Run `npm ci`.
6. Run `npm run dev`.

Do not reuse the ISEYC × TIRNGAN production databases or credentials. Never commit `.env.local` or expose server credentials in client code.

## Verification

The review-branch GitHub Actions run `46061984501` on commit `d7a3db8c989cc96e82fb0d11623f84c5a56ceb4b` completed successfully. All 12 steps passed, including dependency security checks, typecheck, lint, production build and Playwright browser QA.

The preview deployment was independently checked:
- Public event page: HTTP 200.
- `/api/register`: `configured: true`.
- `/api/health/notion`: HTTP 200; registrations and feedback databases connected.
- Synthetic registration and feedback submissions were accepted through the preview and written to the dedicated event databases.
- Duplicate replay and validation behavior passed.
- Invalid staff login and unauthenticated staff API requests were rejected.

Successful authenticated staff operations (correct-passcode login, search, pagination, check-in, walk-in, CSV and logout) have not yet been completed. Manual visual review on physical mobile and desktop devices remains outstanding.

## Security and known limitations

- Registration and feedback use server-side validation and report success only after the Notion write succeeds.
- Duplicate protection is query-before-create and is not atomic under concurrent requests.
- Rate limiting is bounded but process-local, not distributed.
- Staff access uses a shared passcode and does not provide individual staff identities.
- Offline registration/check-in queueing is not implemented.
- CSV export covers the currently loaded page, not every database row.

The `NOTION_API_KEY` environment variable exists in the standalone Vercel project but is still marked with `config` visibility and a `readable-secret` security warning. It must be changed to Sensitive/secret visibility before production release. `REGISTER_PASSCODE` and `SESSION_SECRET` are already Sensitive.

## Deployment status — 28 November 2026

- Dedicated Vercel project: `from-girlhood-to-greatness`.
- Canonical domain: `https://fromgirlhoodtogreatness.vercel.app`.
- Verified preview: `https://from-girlhood-to-greatness-rggjfcmkz.vercel.app`.
- Preview deployment `dpl_8mUJRxYgWoDCr2UdjBtHBr13gN2F` is READY and was built from commit `6acb7f06ee795b506ac5cb300c29afb88f4e233f`.
- The review branch has advanced through documentation-only release reconciliation commits. The application code still matches the preview build; consult PR #2 for the exact current head.
- Preview Notion health is connected. The canonical production domain currently returns HTTP 503 from `/api/health/notion` and `configured: false` from `/api/register`.
- The canonical production homepage returns HTTP 200, but its canonical metadata, robots sitemap reference and sitemap URL still point to the old deployment hostname. A fresh production build must regenerate these values using the configured canonical `NEXT_PUBLIC_SITE_URL`.
- The standalone Vercel project is paused (`live: false`). Do not unpause or promote it until the owner explicitly approves final deployment.
- PR #2 remains open and unmerged. Main has not been changed.

Three labelled synthetic QA submissions created through preview acceptance testing were moved to Notion Trash after the owner explicitly authorized cleanup. Their exact submission IDs were re-queried in the active registrations and feedback data sources after deletion; both queries returned zero active matches. No genuine attendee records were touched:
- `GTG-TEST-1795857587-d2fd8d04` — QA Test Guest Alpha
- `GTG-TEST-1795857613-CLEANUP` — QA Test Guest Beta Cleanup
- `GTG-FB-1795857595-b473badb` — anonymous feedback QA record

## Remaining release gates

1. Change `NOTION_API_KEY` visibility to Sensitive/secret in Vercel without rotating or exposing its value.
2. Configure and verify the production deployment's Notion integration; production currently reports Notion as unconfigured.
3. Complete authenticated staff acceptance using the owner-held passcode, without sharing it in chat or logs.
4. Review the three synthetic records and obtain authorization before moving those exact records to Trash.
5. Complete manual visual QA on mobile and desktop.
6. Confirm the intended production environment variables and run final acceptance against the exact release candidate.
7. Obtain the owner's explicit final deployment instruction before unpausing, promoting, merging or assigning production traffic.

The existing ISEYC × TIRNGAN application, data, credentials and domain must remain untouched.
