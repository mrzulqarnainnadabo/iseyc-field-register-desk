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

## QA integration verification

The review deployment used isolated Notion QA databases:
- `GTG 2026 — QA Sandbox Registrations`
- `GTG 2026 — QA Sandbox Feedback`

Real HTTP requests through the review application were independently read back from Notion:
- Registration creation passed.
- Replaying the same client submission was recognised as a repeated request.
- Reusing the same name and phone with a new submission ID was rejected as a duplicate (HTTP 409).
- Anonymous feedback creation passed.
- Feedback replay was recognised as repeated.
- Invalid staff passcode and unauthenticated guest-list, check-in and walk-in requests were rejected (HTTP 401).

Both QA records created for those tests were moved to Notion Trash after verification. The active QA views were checked again and returned zero active records. No production event records were created, updated or deleted.

This verifies public registration and feedback writes against QA databases. It does **not** verify successful authenticated staff operations against the live Notion integration.

## Repository and CI

- Repository: `mrzulqarnainnadabo/iseyc-field-register-desk` (public, as requested).
- Review branch: `feat/gtg-second-edition-review-build`.
- Pull request: #2, open and unmerged; base `feat/gtg-second-edition-continuation`.
- Last fully verified code/documentation head before the current release-preparation edits: `b871635fa51107dd5d44c8063d809c631af2620f`.
- GitHub Actions run `46042285531` (run 155) passed all 12 steps: dependency audit/security threshold, typecheck, lint, production build and Playwright browser QA.
- Subsequent changes update the canonical event URL fallback and remove legacy ISEYC database IDs from the event environment template. The latest head must pass CI before acceptance.

## Dedicated Vercel project and domain

The event has its own Vercel project, separate from the existing ISEYC × TIRNGAN Community Outreach Desk:

- Project: `from-girlhood-to-greatness`
- Project ID: `prj_vt3luqUQ02mwu8vQIvx6aNAuMsGy`
- Git source: `mrzulqarnainnadabo/iseyc-field-register-desk`
- Primary event address: `https://fromgirlhoodtogreatness.vercel.app`
- Alternate hyphenated address: `https://from-girlhood-to-greatness.vercel.app`
- Both Vercel project domains were returned as verified.
- Project currently has zero deployments and zero environment variables.

The canonical fallback in `src/lib/gtg-config.ts` now points to the dedicated primary event address. `.env.example` no longer contains the legacy ISEYC/TIRNGAN database IDs; it contains blank placeholders for event-specific credentials and database IDs.

The old Vercel project and its production domain remain untouched. Do not connect the event's production domain to that old project or deploy the event branch to its production target.

## Remaining release acceptance requirements

1. Configure the dedicated project's event-only environment variables: `NOTION_API_KEY`, `NOTION_REGISTRATIONS_DB_ID`, `NOTION_FEEDBACK_DB_ID`, `REGISTER_PASSCODE`, `SESSION_SECRET` (32+ characters) and `NEXT_PUBLIC_SITE_URL`.
2. Create dedicated event registration and feedback databases in Notion and share both with the dedicated integration. Do not reuse the ISEYC × TIRNGAN production databases or credentials.
3. Create a preview deployment from the review branch and verify the public, staff and feedback routes plus `/api/health/notion`.
4. Complete a controlled successful staff acceptance test: login, guest search/pagination, walk-in creation, check-in update and sign-out. Do not expose the passcode in logs or chat.
5. Complete manual visual review on real mobile and desktop devices.
6. Before production release, confirm the production branch/commit and ensure the new domain maps only to this standalone event project.
7. Decide whether offline queueing is required; if so, obtain the original implementation/specification or approve a safe, explicit retry/queue design.
8. Consider distributed rate limiting and atomic duplicate protection before relying on this system for high-concurrency event-day traffic.

## Git safeguards

- Repository visibility remains public as explicitly requested.
- Review branch: `feat/gtg-second-edition-review-build`.
- PR base: `feat/gtg-second-edition-continuation`.
- PR remains open and unmerged; main remains untouched.
- No production event deployment or production data mutation has been made.
