# From Girlhood to Greatness — Engineering Notes

## Source reconciliation
The reviewed Claude archive was not present in the repository branch or its reachable Git history. This implementation is a documented reconstruction based on the committed handover, supplied visual preview, event facts and authoritative Notion schemas. It does not claim to reproduce missing source files or official logo artwork.

The older ISEYC Field Register Desk components and unrelated API routes are retained. The public root route and metadata now serve the GTG event experience. The main branch is unchanged.

## Visual direction
The page uses the preview's warm ivory, deep plum and muted gold palette with an editorial serif/sans-serif pairing. No unverified photography, speaker names, testimonials or official logo files have been invented. The header uses a typographic organiser wordmark until the official asset is committed.

## Notion integration
The registration and feedback property names and select options were read from the connected Notion workspace:
- Registrations database: 4245db88ef46817f8638f71e34d26205
- Feedback database: 4245db88ef4681cc944af1cccceba720

Required server-side variables: NOTION_API_KEY, NOTION_REGISTRATIONS_DB_ID, NOTION_FEEDBACK_DB_ID. The two database IDs already exist in the Vercel project environment. The existing API key is configured there but has not been read or exposed.

The application returns success only after Notion confirms page creation. It does not create a test participant record. Duplicate checks use the client submission ID and exact name+phone pair. Notion does not enforce a unique constraint on those properties, so concurrent submissions with different client IDs could still race. This is a documented limitation without adding an external database or lock service.

## Staff access
Staff access requires REGISTER_PASSCODE and SESSION_SECRET. Session cookies are HttpOnly, Secure in production, SameSite=Strict and HMAC-signed with an expiry. The previous legacy ISEYC passcode helper was hardened to use HMAC and fail closed if required credentials are absent.

## Safe validation
Do not submit real guest data as a test. A successful end-to-end Notion write test requires an explicitly approved test database. A live registration test against the event's production database is intentionally not performed by this change. Rate limiting is process-local and not globally shared across serverless instances.


## Preview and production boundary
Vercel environment inspection showed the Notion API key, database IDs, staff passcode and session secret are configured for the Production target only. They are not copied into Preview. The review deployment therefore disables guest registration and staff sign-in rather than risking writes to the live guest register from a public preview URL. Production credentials were not decrypted or exposed.

## Dependency security audit — 26 November 2026
GitHub Actions ran npm audit against the committed lockfile:
- Full dependency tree: 15 advisories — 1 critical, 7 high, 7 moderate.
- Production dependencies: 4 advisories — 1 critical, 3 high.
- Production-affected packages: Next.js 14.2.35 (critical), PostCSS (high), source-map-js (high), and Zod 3.x (high).
- Development tooling also reports vulnerable versions of eslint-config-next / @next/eslint-plugin-next, glob, brace-expansion, minimatch, postcss-selector-parser and TypeScript ESLint dependencies.

The current stack was retained to match the reviewed application's stated Next.js 14.2.35 / React 18.3.1 baseline. This is a production blocker, not an accepted long-term risk. Next.js 14.2.35 is within the affected range for the critical image-optimization RCE advisory; the Next.js maintainers list patched versions beginning at 15.5.28 or 16.4.1. Zod versions before 4.6.6 are affected by a high-severity memory-exhaustion advisory; the fixed release is 4.6.6 or later. A dependency migration to a patched supported Next.js release and Zod 4.6.7 must be completed and re-audited before production exposure.

## Automated verification
The CI workflow runs npm ci, the dependency audit, TypeScript, lint, production build, HTTP smoke checks and Playwright browser checks. Browser tests use a deliberately invalid Notion token and synthetic CI credentials. They verify that failed Notion persistence never produces a success message. No real guest or feedback records are created.
