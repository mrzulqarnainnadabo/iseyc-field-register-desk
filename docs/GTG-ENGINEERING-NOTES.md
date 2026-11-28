# From Girlhood to Greatness — Engineering Notes

## Approved event information

- Event: From Girlhood to Greatness — Second Edition
- Theme: Accepting My Greatness — From Becoming Her to Believing in Her.
- Organiser: Empower with Hafsat
- Partner: Baytal Rihaa
- Systems partner: Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- Date/time: Sunday, 29 November 2026 · 1:00 PM
- Venue: Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- Audience: Women aged 20 and above

The platform is independent. ISEYC is the registration/documentation systems partner, not the event organiser. No unapproved speakers, programme details, attendance figures or endorsements are invented.

## Current implementation

The public event experience is implemented in `src/app/page.tsx`, with styling in `src/app/globals.css` and `src/app/brand-overrides.css`. It includes organiser identity, event story, attendee guidance, event facts, FAQs, venue directions and registration.

The staff desk in `src/components/StaffDesk.tsx` and `src/app/staff/staff.css` supports staff sign-in, guest search, cursor-based pagination, status filters, check-in, walk-in registration, loaded-record metrics, CSV export and sign-out. The interface distinguishes loaded records from total register counts.

Server routes include `/api/staff/login`, `/api/staff/registrations`, `/api/staff/check-in`, `/api/staff/walk-in`, `/api/staff/logout`, public registration and anonymous feedback. Notion is the persistence layer.

The supplied Empower with Hafsat logo asset is `public/brand/empower-with-hafsat.jpg`. The event hero campaign image is separate from the organiser logo.

## Data and security behavior

- Registration checks client submission IDs and exact name/phone pairs before creating a Notion record. This query-before-create protection is not atomic under concurrent requests.
- Walk-in registration creates a checked-in record with a check-in timestamp.
- Feedback persistence supports idempotent submission handling.
- Staff routes require a signed session; unauthenticated list, check-in and walk-in requests are rejected.
- Login, registration and feedback rate limits use bounded process-local in-memory tracking. They are not distributed across serverless instances.
- Staff access uses a shared passcode, not individual officer accounts or per-person attribution.
- Registration reports success only after the Notion write succeeds. A network interruption does not imply a successful registration.
- Offline registration/check-in queueing is not implemented.
- CSV export covers the currently loaded page, not an exhaustive export of every database row.

## Notion databases and live acceptance records

The dedicated Notion page `From Girlhood to Greatness — Event Operations` contains the live event databases:

- Registrations: `4245db88-ef46-817f-8638-f71e34d26205`
- Feedback: `4245db88-ef46-81cc-944a-f1cccceba720`

Their schemas were fetched and match the expected application properties. The source descriptions identify registrations as the source of truth for online registrations and event-day walk-ins, and feedback as anonymous post-event feedback.

The preview's Notion health endpoint returned HTTP 200 with both databases connected. Actual preview website/API test submissions were written to these live event databases and read back:

- Registration: `GTG-TEST-1795857587-d2fd8d04` — QA Test Guest Alpha.
- Registration: `GTG-TEST-1795857613-CLEANUP` — QA Test Guest Beta Cleanup; explicitly labelled synthetic test only.
- Feedback: `GTG-FB-1795857595-b473badb` — anonymous feedback QA record.

A fresh query of both live data sources confirmed that these three records remain active. They have not been moved to Trash. Do not delete or alter them without explicit owner authorization. No genuine attendee records were identified in this QA set.

The preview acceptance report recorded successful creation, idempotent replay, duplicate-name/phone rejection (HTTP 409), invalid registration rejection (HTTP 400), feedback creation/replay, and rejection of invalid staff credentials and unauthenticated staff APIs.

On 28 November 2026, after explicit owner authorization, the three synthetic QA records listed below were moved to Notion Trash. Their exact Client Submission IDs were queried again in their respective active data sources; both queries returned zero matches. Only these three identified test records were moved. No genuine attendee data was touched.

## Repository and CI

- Repository: `mrzulqarnainnadabo/iseyc-field-register-desk` (public).
- Review branch: `feat/gtg-second-edition-review-build`.
- The review branch includes documentation-only release reconciliation commits; consult PR #2 for the exact current head. Application source remains unchanged from the verified preview build.
- Pull request: #2, open and unmerged; base `feat/gtg-second-edition-continuation`.
- GitHub Actions run `46061984501` completed successfully on the stated head. All 12 steps passed: dependency audit/security threshold, typecheck, lint, production build, isolated test server and Playwright browser QA.
- There are no outstanding inline review threads and no submitted PR reviews at the time of the latest check.
- The preview deployment was built from `6acb7f06ee795b506ac5cb300c29afb88f4e233f`. The commits after that preview build are documentation-only; the application code matches the current review branch application code.

The README and engineering notes have been reconciled with the independently verified deployment and database state. These are documentation-only changes and do not alter application code or deployment behavior. Re-run CI after the final documentation commit.

## Dedicated Vercel project

The event has its own Vercel project, separate from the existing ISEYC × TIRNGAN Community Outreach Desk:

- Project: `from-girlhood-to-greatness`
- Project ID: `prj_vt3luqUQ02mwu8vQIvx6aNAuMsGy`
- Git source: `mrzulqarnainnadabo/iseyc-field-register-desk`
- Canonical event address: `https://fromgirlhoodtogreatness.vercel.app`
- Alternate address: `https://from-girlhood-to-greatness.vercel.app`
- Project Node.js runtime: 22.x.
- Latest READY preview deployment: `dpl_8mUJRxYgWoDCr2UdjBtHBr13gN2F`, URL `https://from-girlhood-to-greatness-rggjfcmkz.vercel.app`.
- The preview deployment's Git commit is `6acb7f06ee795b506ac5cb300c29afb88f4e233f`.
- Vercel project state reports `live: false`; the standalone project remains paused. Do not unpause or promote it without explicit final owner approval.

### Environment variables (verified without decrypting secrets)

- `NOTION_API_KEY`: present for Preview and Production, but returned as `type: encrypted`, `visibility: config`, with Vercel security issue `readable-secret`. It must be changed to Sensitive/secret visibility before release. Do not rotate or expose its value.
- `NOTION_REGISTRATIONS_DB_ID`: configured for Preview and Production with the dedicated registrations database ID.
- `NOTION_FEEDBACK_DB_ID`: configured for Preview and Production with the dedicated feedback database ID.
- `REGISTER_PASSCODE`: Sensitive for Preview and Production.
- `SESSION_SECRET`: Sensitive for Preview and Production.
- `NEXT_PUBLIC_SITE_URL`: configured for Preview and Production as the canonical GTG domain.

An attempted API-only visibility change was rejected: the Vercel environment-variable update wrapper does not expose the required `visibility: secret` field, while the underlying API rejects `type: sensitive` without it. The wrapper schema rejects that extra field. This remains an owner dashboard action; do not delete/recreate the variable or rotate its value as a workaround.

### Live HTTP verification on 28 November 2026

Preview:
- Homepage: HTTP 200.
- `/api/register`: HTTP 200, `configured: true`.
- `/api/health/notion`: HTTP 200, `configured: true`, both databases connected.

Canonical production domain:
- `/api/health/notion`: HTTP 503, `configured: false`.
- `/api/register`: HTTP 200, `configured: false`.
- Canonical production homepage: HTTP 200, but its canonical link, robots sitemap reference and sitemap location point to the old deployment hostname `from-girlhood-to-greatness-d466lffbo.vercel.app`, not `https://fromgirlhoodtogreatness.vercel.app`. The preview's canonical metadata correctly points to the canonical domain. This is consistent with the production deployment having been built before the canonical `NEXT_PUBLIC_SITE_URL` was applied; a fresh production build must regenerate and verify these metadata values.

Production is therefore not operational for registrations or feedback. A working preview does not prove that production has loaded the same integration. Production environment loading and deployment must be resolved and re-tested before release.

## Remaining release acceptance requirements

1. In the Vercel dashboard, change the existing `NOTION_API_KEY` visibility to Sensitive/secret, preserving its current value and Preview/Production targets.
2. Resolve production's unconfigured Notion state. Confirm the production deployment receives the dedicated GTG integration and both correct database IDs; do not reuse ISEYC × TIRNGAN credentials or databases.
3. Complete successful authenticated staff acceptance using the owner-held passcode: login, guest search, filters, pagination, walk-in creation, check-in update, CSV export and logout. Do not expose the passcode in chat or logs.
4. Obtain owner authorization to move the three explicitly listed synthetic records to Trash, then verify only those exact IDs were cleaned up. Preserve all genuine attendee records.
5. Complete manual visual review on physical mobile and desktop devices.
6. Re-run CI after documentation reconciliation and confirm the exact release commit.
7. Verify the production environment and actual website form behavior on the final release candidate.
8. Keep the project paused and PR #2 open/unmerged until the owner gives the final deployment instruction.

## Git and production safeguards

- Repository visibility remains public as explicitly requested.
- Review branch: `feat/gtg-second-edition-review-build`.
- PR base: `feat/gtg-second-edition-continuation`.
- PR #2 remains open and unmerged; main remains untouched.
- Existing ISEYC × TIRNGAN production project, data, credentials and domain remain untouched.
- The standalone GTG project remains paused pending production configuration and final approval.
