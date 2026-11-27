# From Girlhood to Greatness — Engineering Notes

## Approved event information

- Event: From Girlhood to Greatness — Second Edition
- Theme: Accepting My Greatness — From Becoming Her to Believing in Her.
- Organiser: Empower with Hafsat
- Partner: Baytal Rihaa
- Systems partner: Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- Date: Sunday, 29 November 2026
- Time: 1:00 PM
- Venue: Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- Audience: Women aged 20 and above

No speaker names, programme details, attendance figures or endorsements are invented.

## Current implementation

The public event experience is implemented in `src/app/page.tsx`, with styling in `src/app/globals.css` and `src/app/brand-overrides.css`. It includes organiser identity, event story, attendee guidance, event facts, FAQs, venue directions and registration.

The staff desk in `src/components/StaffDesk.tsx` and `src/app/staff/staff.css` supports staff sign-in, guest search, cursor-based pagination, status filters, check-in, walk-in registration, loaded-record metrics, CSV export and sign-out. The interface distinguishes loaded records from total register counts.

Server routes include `/api/staff/login`, `/api/staff/registrations`, `/api/staff/check-in`, `/api/staff/walk-in`, `/api/staff/logout`, public registration and anonymous feedback. Notion is the persistence layer.

The supplied Empower with Hafsat logo asset is `public/brand/empower-with-hafsat.jpg`. No unapproved speakers or programme items are displayed.

## Data and security behavior

- Registration checks client submission IDs and exact name/phone pairs before creating a Notion record. This query-before-create protection is not atomic under concurrent requests.
- Walk-in registration creates a checked-in record with a check-in timestamp.
- Feedback persistence supports idempotent submission handling.
- Staff routes require a signed session; unauthenticated list, check-in and walk-in requests are rejected.
- Login, registration and feedback rate limits use bounded process-local in-memory tracking. They are not distributed across serverless instances.
- Staff access uses a shared passcode, not individual officer accounts or per-person attribution.
- Registration reports success only after the Notion write succeeds. A network interruption does not imply a successful registration.
- Offline registration/check-in queueing is not implemented. Do not claim offline support.

## Notion workspaces and QA

The dedicated Notion page `From Girlhood to Greatness — Event Operations` contains the live event databases:
- `GTG 2026 — Registrations`
- `GTG 2026 — Feedback`

Both production data sources were fetched and their schemas match the application's expected properties. Both were queried and confirmed to contain zero active records at the time of verification.

Separate test-only databases remain isolated:
- `GTG 2026 — QA Sandbox Registrations`
- `GTG 2026 — QA Sandbox Feedback`

Real HTTP requests through the earlier review application were independently read back from the QA databases:
- Registration creation passed.
- Replaying the same client submission was recognised as a repeated request.
- Reusing the same name and phone with a new submission ID was rejected as a duplicate (HTTP 409).
- Anonymous feedback creation passed.
- Feedback replay was recognised as repeated.
- Invalid staff passcode and unauthenticated guest-list, check-in and walk-in requests were rejected (HTTP 401).

Both QA records created for those tests were moved to Notion Trash after verification. The active QA views were checked again and returned zero active records. No production event records were created, updated or deleted.

The Notion API token has **not** been configured in the standalone Vercel project. The production databases still need to be shared with the dedicated Notion integration whose token is used by the app. The prior QA integration tests do not prove that the new project's integration has access.

## Repository and CI

- Repository: `mrzulqarnainnadabo/iseyc-field-register-desk` (public, as requested).
- Review branch: `feat/gtg-second-edition-review-build`.
- Current head: `6acb7f06ee795b506ac5cb300c29afb88f4e233f`.
- Pull request: #2, open and unmerged; base `feat/gtg-second-edition-continuation`.
- GitHub Actions run `46061696813` (run 164) passed all 12 workflow steps on application commit `d71bbc8acc2e59d95376569c2283dc4579f2e6f3`: dependency audit/security threshold, typecheck, lint, production build and Playwright browser QA.
- The verified application changes include the canonical event URL fallback and an environment template with no legacy ISEYC database IDs. The later commit updating this engineering note is documentation-only and must retain a passing CI check.

## Dedicated Vercel project

The event has its own Vercel project, separate from the existing ISEYC × TIRNGAN Community Outreach Desk:

- Project: `from-girlhood-to-greatness`
- Project ID: `prj_vt3luqUQ02mwu8vQIvx6aNAuMsGy`
- Git source: `mrzulqarnainnadabo/iseyc-field-register-desk`
- Canonical event address: `https://fromgirlhoodtogreatness.vercel.app`
- Alternate address: `https://from-girlhood-to-greatness.vercel.app`
- Both domains are verified and attached to this separate project.
- Project Node.js runtime is set to 22.x.

Vercel environment configuration is partially complete:
- `NOTION_REGISTRATIONS_DB_ID` — configured to the dedicated live registrations database.
- `NOTION_FEEDBACK_DB_ID` — configured to the dedicated live feedback database.
- `REGISTER_PASSCODE` — configured as a sensitive variable for Preview and Production.
- `SESSION_SECRET` — generated independently and configured as a sensitive variable for Preview and Production.
- `NEXT_PUBLIC_SITE_URL` — configured to the canonical event domain.
- `NOTION_API_KEY` — **missing**. This is the remaining required application credential.

A preview deployment and a production-target deployment were automatically created by the Git-linked project. The production-target deployment was paused after it was detected serving the incomplete application. The standalone project's custom domains are therefore not currently serving the site. The ISEYC × TIRNGAN project and its production domain were not changed.

The most recent READY preview deployment was built from the current review branch head before the latest environment variables were added. Its Notion health endpoint correctly returned HTTP 503 because `NOTION_API_KEY` is absent. It must be redeployed after the token is configured so the new environment is loaded.

The Vercel deployment API returned HTTP 402 with the `api-deployments-free-per-day` limit (retry after 86,400 seconds). Do not retry deployment creation through the same API before the limit resets or the team resolves the quota. The production project remains paused while release prerequisites are incomplete.

## Remaining release acceptance requirements

1. Create or select a dedicated Notion integration for the event, share both live event databases with it, and add its API token directly to the standalone Vercel project's `NOTION_API_KEY` environment variable. Do not paste the token into chat or reuse the ISEYC × TIRNGAN production integration.
2. After the Vercel deployment quota resets or is resolved, create a fresh preview deployment so it loads all configured environment variables.
3. Verify `/api/health/notion` reports both databases connected; verify the public registration and anonymous feedback routes without leaving test records in the live databases.
4. Complete a controlled successful staff acceptance test: login, guest search/pagination, walk-in creation, check-in update and sign-out. Do not expose the passcode in logs or chat.
5. Complete manual visual review on real mobile and desktop devices.
6. Confirm the release commit and unpause the standalone project only when the public form, backend and staff desk pass acceptance.
7. Decide whether offline queueing is required; if so, obtain the original implementation/specification or approve a safe, explicit retry/queue design.
8. Consider distributed rate limiting and atomic duplicate protection before relying on this system for high-concurrency event-day traffic.

## Git and production safeguards

- Repository visibility remains public as explicitly requested.
- Review branch: `feat/gtg-second-edition-review-build`.
- PR base: `feat/gtg-second-edition-continuation`.
- PR remains open and unmerged; main remains untouched.
- Existing ISEYC × TIRNGAN production project and its data remain untouched.
- The new standalone event project is paused until the Notion integration and acceptance checks are complete.
