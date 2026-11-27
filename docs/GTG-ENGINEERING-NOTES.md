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

The public event experience is implemented in `src/app/page.tsx`, with styling in `src/app/globals.css` and `src/app/brand-overrides.css`. It includes the organiser identity, event story, attendee guidance, event facts, FAQs, venue directions and registration.

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
- Offline registration/check-in queueing is not implemented. The earlier archive's queue behavior could not be recovered or verified; do not claim offline support.

## QA databases and integration verification

The review deployment uses isolated Notion QA databases:
- `GTG 2026 — QA Sandbox Registrations`
- `GTG 2026 — QA Sandbox Feedback`

The integration health endpoint on the current exact-head preview returned HTTP 200 and reported both QA databases connected.

Real HTTP requests through the application were independently read back from Notion:
- Registration creation passed.
- Replaying the same client submission was recognised as a repeated request.
- Reusing the same name and phone with a new submission ID was rejected as a duplicate (HTTP 409).
- Anonymous feedback creation passed.
- Feedback replay was recognised as repeated.
- Invalid staff passcode and unauthenticated guest-list, check-in and walk-in requests were rejected (HTTP 401).

Both QA records created for those tests were moved to Notion Trash after verification. The active QA views were checked again and returned zero active records. No production event records were created, updated or deleted.

This verifies public registration and feedback writes against QA databases. It does **not** verify successful authenticated staff operations against the live Notion integration.

## Current branch and CI evidence

- Review branch: `feat/gtg-second-edition-review-build`
- Current head: `3609b46d9a7960c554e6755f62dfcd7a03305d03`
- Pull request: #2, open and unmerged; base `feat/gtg-second-edition-continuation`
- Latest GitHub Actions run: `46036133472` (run 151), successful.
- CI includes dependency security checks, TypeScript, ESLint, production build and Playwright browser QA.
- All 12 workflow steps passed; browser QA includes seven tests.

The latest exact-head Vercel review deployment is READY:
- Deployment ID: `dpl_BEBndCvphV3jWxWV1QyL72uadHi7`
- Commit: `3609b46d9a7960c554e6755f62dfcd7a03305d03`
- Public page, staff page and feedback page returned HTTP 200.
- `/api/health/notion` returned HTTP 200 and confirmed both preview QA databases connected.
- `/api/staff/login` and `/api/register` GET configuration checks returned HTTP 200 with configured status.
- CSP includes the approved campaign image host and `frame-ancestors 'none'`.

A local screenshot attempt could not launch Chromium in the Vercel sandbox. CI browser tests passed, but this is not a substitute for a manual physical-device visual review.

## Environment and deployment boundary

The review project's preview environment has QA Notion configuration. A new 32-character staff passcode was configured as a sensitive Vercel environment variable for the review branch and for the existing project's Production environment. The passcode is not retrieved or echoed by tooling.

The current project’s production domain `iseyc-field-register-desk.vercel.app` is still mapped to the older ISEYC × TIRNGAN Community Outreach Desk. Deploying the GTG branch to that project's Production target would replace that older application. The owner has not authorised that replacement. Preserve the existing production deployment.

A separate production destination is the recommended path. A separate Vercel project still requires its own safely configured Notion credentials, database IDs, staff passcode and session secret; write-only secrets must not be decrypted or copied through unsafe channels. No separate production project is yet configured.

## Remaining acceptance requirements

1. Confirm a separate production destination (or explicitly authorise replacement of the existing production app; replacement is not assumed).
2. Configure the separate project's Notion integration and secrets securely.
3. Complete a controlled successful staff acceptance test: login, guest search/pagination, walk-in creation, check-in update and sign-out. Do not expose the passcode in logs or chat.
4. Re-run production smoke tests after deployment and confirm the correct application is served without disturbing the older ISEYC service.
5. Complete manual visual review on real mobile and desktop devices.
6. Decide whether offline queueing is required; if so, obtain the original implementation/specification or approve a safe, explicit retry/queue design.
7. Consider distributed rate limiting and atomic duplicate protection before relying on this system for high-concurrency event-day traffic.

## Git safeguards

- Repository visibility: public, as explicitly requested by the owner.
- Working branch: `feat/gtg-second-edition-review-build`
- PR base: `feat/gtg-second-edition-continuation`
- Main branch last verified at `4eaa1d6e2f01e047337d1d67f60b9c352a4bc8e4`.
- Review work remains unmerged; no direct main change or production deployment has been made.
