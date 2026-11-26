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
