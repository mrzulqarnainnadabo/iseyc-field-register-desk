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
3. Create two dedicated event databases in Notion (registrations and feedback) and share both with a dedicated Notion integration.
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

The review branch has a successful CI run. Isolated QA registration and feedback writes were independently read back from Notion and then removed from the active QA views. Successful authenticated staff operations still require a controlled acceptance test.

## Known limitations

- Offline registration/check-in queueing is not implemented; do not assume a registration is saved when connectivity fails.
- Duplicate protection is query-before-create and is not atomic under concurrent requests.
- Rate limiting is bounded but process-local, not distributed.
- Staff access uses a shared passcode and does not provide individual staff identities.

## Deployment boundary

The event is deployed separately from the existing ISEYC × TIRNGAN Community Outreach Desk. The dedicated Vercel project and event domains have been created and verified, but the project has no deployment or environment variables yet. Production release remains blocked until the event-specific Notion integration, database IDs, staff passcode and session secret are configured and the authenticated staff acceptance test passes.

See [docs/GTG-ENGINEERING-NOTES.md](docs/GTG-ENGINEERING-NOTES.md) for release evidence and the remaining acceptance checklist.
