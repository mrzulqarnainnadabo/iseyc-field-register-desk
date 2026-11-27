# From Girlhood to Greatness — Second Edition

A standalone event website and restricted event-day registration/check-in workspace for Empower with Hafsat.

## Approved event information

- **Theme:** Accepting My Greatness — From Becoming Her to Believing in Her.
- **Organiser:** Empower with Hafsat
- **Partner:** Baytal Rihaa
- **Systems partner:** Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- **Date/time:** Sunday, 29 November 2026 · 1:00 PM
- **Venue:** Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- **Audience:** Women aged 20 and above

No unapproved speakers or programme details are invented.

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
3. Create or select a dedicated Notion integration and share the two live event databases with it.
4. Configure `NOTION_API_KEY`, `NOTION_REGISTRATIONS_DB_ID`, `NOTION_FEEDBACK_DB_ID`, `REGISTER_PASSCODE`, `SESSION_SECRET` (32+ characters) and `NEXT_PUBLIC_SITE_URL`.
5. Run `npm ci`.
6. Run `npm run dev`.

Do not reuse the ISEYC × TIRNGAN production databases or credentials. Never commit `.env.local` or expose server credentials in client code.

## Verification

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Dependency security audit
- Playwright browser QA (CI)

The latest review-branch GitHub Actions run passed all 12 steps. Isolated QA registration and feedback writes were independently read back from Notion and then removed from the active QA views. Successful authenticated staff operations against the standalone production databases still require a controlled acceptance test.

## Known limitations

- Offline registration/check-in queueing is not implemented; do not assume a registration is saved when connectivity fails.
- Duplicate protection is query-before-create and is not atomic under concurrent requests.
- Rate limiting is bounded but process-local, not distributed.
- Staff access uses a shared passcode and does not provide individual staff identities.

## Deployment status

The event has its own Vercel project and verified event domains, separate from the existing ISEYC × TIRNGAN Community Outreach Desk. The project has its database IDs, staff passcode, session secret and canonical URL configured. The dedicated Notion API token is still missing, so the backend is not ready. The project is paused and must remain paused until the Notion integration is shared with both live event databases, the API token is configured, and the full acceptance checks pass.

The Vercel deployment API has also returned its daily deployment quota limit; a fresh preview build must wait until that limit resets or the team resolves the quota. No production release should be declared until the backend and staff operations have passed live acceptance.

See [docs/GTG-ENGINEERING-NOTES.md](docs/GTG-ENGINEERING-NOTES.md) for the current evidence and release checklist.
