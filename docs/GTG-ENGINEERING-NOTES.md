# From Girlhood to Greatness — Engineering Notes

## Source reconciliation

The reviewed Claude archive was not present in this repository branch or its reachable Git history. The current application was therefore established from the committed handover, the supplied visual preview, the approved event facts and the connected Notion database schemas. This is a documented reconstruction, not a claim that the original archive's source files were recovered.

The old ISEYC Field Register Desk source and its legacy API routes were retained rather than blindly deleting the previous application. The public root route now serves the GTG event experience. The main branch remains unchanged.

## Approved event information

- Event: From Girlhood to Greatness — Second Edition
- Theme: Accepting My Greatness — From Becoming Her to Believing in Her.
- Organiser: Empower with Hafsat
- In partnership with: Baytal Rihaa
- Systems and Documentation Partner: Initiative for Sustainable Evolution for Youth and Community (ISEYC)
- Date: Sunday, 29 November 2026
- Time: 1:00 PM
- Venue: Yakubu Hub, Surami Road, U/Rimi, Kaduna, Nigeria
- Audience: Women aged 20 and above

These details are centralised in `src/lib/gtg-config.ts` and are rendered on the public page and metadata.

## Visual and brand status

The current page uses the preview's warm ivory, deep plum and restrained gold direction with an editorial serif/sans-serif pairing. It does not invent speakers, testimonials, programme activities, sponsors or attendance figures.

The official Empower with Hafsat / From Girlhood to Greatness logo was not present in the reconciled repository. A typographic wordmark is used as a temporary fallback. The legacy ISEYC/Tirngan brand assets are retained but are not presented as the event's organiser logo or as unapproved partners. See `public/brand/README.md`.

## Technology and dependency security

Current application stack:
- Next.js 15.5.29
- React 19.2.0
- TypeScript 5.5.3
- Tailwind CSS 3.4.4
- Zod 4.6.7
- Notion SDK `@notionhq/client` 2.2.15

The framework and validation packages were moved off the vulnerable reviewed-archive versions. The CI dependency-audit step regenerates the lockfile, runs `npm audit` for the full dependency tree and production dependencies, and enforces the high-severity threshold. On the successful verification run, both audit reports contained zero advisories. The resulting patched lockfile was committed by CI as `17e0c70`.

## Notion registration and feedback

The connected Notion schemas were inspected read-only. The registration and feedback property names, field types and select options match the application mapping.

The production Vercel environment contains the required Notion credentials and database identifiers. Preview deployments do not receive those production secrets; registration and staff access therefore remain disabled on preview. The preview cannot create guest or feedback records.

The application returns a successful registration response only after the Notion page-creation call succeeds. A failed write returns an error and does not show a success confirmation. No synthetic participant or feedback record has been written to the live databases.

A real end-to-end write test remains unperformed because no approved test database has been supplied. Production environment-variable presence is not proof that the Notion API token can write to the configured database.

Duplicate detection checks the client submission ID and exact name/phone pair before creating a record. Notion does not enforce a unique constraint on those properties, so concurrent requests can still race. This limitation is documented rather than hidden or masked by an unapproved external datastore.

## Staff access and security boundaries

Staff access requires `REGISTER_PASSCODE`, `SESSION_SECRET` (at least 32 characters) and the required Notion environment variables. Successful login creates an expiring HMAC-signed, HttpOnly cookie with Secure enabled in production and SameSite=Strict. Check-in verifies that the target record belongs to the configured registration database.

The current staff desk uses a shared event-team passcode, not individual staff identities or role-based permissions. It therefore does not provide per-person check-in attribution. Login and registration rate limits are process-local in-memory controls; they are not shared across serverless instances and should not be described as globally enforced limits.

## Verification evidence

Successful GitHub Actions run: `45911986983` (26 November 2026), on the continuation branch before the CI-generated lockfile commit.

- `npm ci`: passed
- Full dependency audit: zero advisories
- Production dependency audit: zero advisories
- `npm run typecheck`: passed
- `npm run lint`: passed
- `npm run build`: passed
- HTTP smoke checks for the home page, staff page, feedback page and registration/staff configuration endpoints: passed
- Playwright browser tests: 6 passed, 0 failed

The Playwright checks cover approved event facts, mobile horizontal overflow, registration persistence failure, anonymous feedback persistence failure, staff login/check-in access boundaries and invalid API payloads. They use a deliberately invalid Notion token and synthetic CI-only staff credentials; they do not write to production Notion.

A Vercel preview deployment for the review branch completed successfully. No production deployment was triggered.

## Remaining review blockers

1. The organiser must supply the approved event logo before the final visual identity can be signed off.
2. A real Notion write/readback test requires an explicitly approved test database shared with the existing integration.
3. Duplicate detection is not atomic across concurrent serverless requests.
4. Rate limiting is instance-local, not distributed.
5. Staff access is shared-passcode based and does not identify individual officers.
6. The venue text is preserved exactly as supplied; no unverified map pin or directions have been invented.

## Git safeguards

- Working branch: `feat/gtg-second-edition-review-build`
- Intended PR base: `feat/gtg-second-edition-continuation`
- Main branch at last check: `4eaa1d6e2f01e047337d1d67f60b9c352a4bc8e4` (unchanged)
- No direct push to main, force-push, merge or production deployment.
