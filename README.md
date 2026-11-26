# From Girlhood to Greatness — Second Edition

A responsive event website and registration/check-in system for From Girlhood to Greatness.

## Event
- Theme: Accepting My Greatness — From Becoming Her to Believing in Her.
- Organiser: Empower with Hafsat
- In partnership with: Baytal Rihaa
- Systems and documentation partner: Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- Date: Sunday, 29 November 2026
- Time: 1:00 PM
- Venue: Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- Audience: Women aged 20 and above

## Stack
Next.js 15.5.29, React 19.2.0, TypeScript 5.5.3, Tailwind CSS 3.4.4, Zod 4.6.7 and the Notion SDK.

## Local setup
1. Use Node.js 20 or newer.
2. Copy .env.example to .env.local.
3. Configure the Notion integration and staff secrets. Never commit .env.local.
4. Run npm ci.
5. Run npm run dev.

## Required environment
- NOTION_API_KEY
- NOTION_REGISTRATIONS_DB_ID
- NOTION_FEEDBACK_DB_ID
- REGISTER_PASSCODE
- SESSION_SECRET (32+ random characters)

The Notion integration must be connected to both event databases. The application uses the existing GTG 2026 registrations and feedback databases; it does not create a new database.

## Routes
- / public event site and registration.
- /staff restricted staff sign-in, registration search, check-in and walk-in capture.
- /feedback anonymous post-event feedback.
- /api/register, /api/feedback and /api/staff/* server routes.

## Checks
- npm ci
- npm run typecheck
- npm run lint
- npm run build
- npm audit --audit-level=high
- Playwright browser QA (CI)

## Important
The previously reviewed Claude archive was not available in repository history. The current GTG implementation is reconstructed from the committed engineering handover, supplied visual preview and connected Notion database schemas. Official logo assets were not present in the branch; the current design uses a typographic wordmark, not an invented official logo.

Notion persistence is attempted server-side and success is returned only after the Notion API confirms creation. No production test record is created. Duplicate checks are best-effort and are not an atomic uniqueness guarantee. Rate limiting is process-local. See docs/GTG-ENGINEERING-NOTES.md.

The existing ISEYC field desk components and historical API routes remain for preservation; the public home route now presents the GTG event website.
