# From Girlhood to Greatness — Second Edition

A responsive event website and restricted event-day registration/check-in workspace for Empower with Hafsat.

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
3. Configure the Notion integration and staff secrets. Never commit `.env.local`.
4. Run `npm ci`.
5. Run `npm run dev`.

Required server environment:
- `NOTION_API_KEY`
- `NOTION_REGISTRATIONS_DB_ID`
- `NOTION_FEEDBACK_DB_ID`
- `REGISTER_PASSCODE`
- `SESSION_SECRET` (at least 32 characters)

The Notion integration must be connected to both registration and feedback databases.

## Verification

- `npm ci`
- `npm run typecheck`
- `npm run lint`
- `npm run build`
- Dependency security audit
- Playwright browser QA (CI)

The current review branch has a successful CI run and an exact-head READY preview deployment. Isolated QA registration and feedback writes were read back from Notion and then removed from the active QA views. Successful authenticated staff operations still require a controlled acceptance test.

## Important limitations

- Offline registration/check-in queueing is not implemented; do not assume a registration is saved when connectivity fails.
- Duplicate protection is query-before-create and is not atomic under concurrent requests.
- Rate limiting is bounded but process-local, not distributed.
- Staff access uses a shared passcode and does not provide individual staff identities.
- The existing production domain serves the older ISEYC × TIRNGAN application. The GTG review branch has not been deployed to that production target; a separate production destination is recommended and still needs secure environment setup.

See [docs/GTG-ENGINEERING-NOTES.md](docs/GTG-ENGINEERING-NOTES.md) for current verification evidence, QA cleanup, deployment boundaries and remaining acceptance requirements.
