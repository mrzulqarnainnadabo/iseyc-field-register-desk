# SETUP — ISEYC × TIRNGAN Community Outreach Intelligence Desk

> Quick reference for deployment, Notion connection and go-live.

## Product

**ISEYC × TIRNGAN Community Outreach Intelligence Desk**  
Privacy-first field data platform for structured community outreach evidence.

Live URL: https://iseyc-field-register-desk.vercel.app  
Repo: https://github.com/mrzulqarnainnadabo/iseyc-field-register-desk

---

## 1. Notion databases (already created)

| Database | ID | Purpose |
|----------|----|---------|
| **Outreach Sessions** | `d6d4516730714d4997ca97fc3571b54c` | One record = one field activity |
| **Community Responses** | `122e3d8ad9234c6da897f57dac89bb0d` | One record = one community encounter |
| **Follow-ups** | `a4d608677a9a489f8242d3e71204b45b` | Optional support pathway |

### Critical step — share the integration

1. Open each of the three databases in Notion.
2. Click the `⋯` menu → **Connections**.
3. Add / share the **same** internal integration that holds your `NOTION_API_KEY`.
4. Confirm the integration has permission to read and write.

Without this step the app will return “database not configured” errors.

---

## 2. Vercel environment variables

In the Vercel project → **Settings → Environment Variables**, set for **Production** (and Preview if desired):

```
NOTION_API_KEY=secret_xxxxxxxx
NOTION_OUTREACH_SESSIONS_DB_ID=d6d4516730714d4997ca97fc3571b54c
NOTION_RESPONSES_DB_ID=122e3d8ad9234c6da897f57dac89bb0d
NOTION_FOLLOWUPS_DB_ID=a4d608677a9a489f8242d3e71204b45b

# Optional — keep legacy DBs for historical data
NOTION_RSVP_DB_ID=dcea4593a1054d5aab80ea06a38ef503
NOTION_ACTIVITIES_DB_ID=d53844be1a8340eb8f60e54223fa4613
NOTION_PARTICIPANTS_DB_ID=d156bdbc4f6d4650ae0be757fec0b002

# Optional staff passcode
REGISTER_PASSCODE=
```

After saving, trigger a **Redeploy** so the new variables are picked up.

---

## 3. Health check

After deploy visit:

```
https://iseyc-field-register-desk.vercel.app/api/health
```

Expected (booleans only):

```json
{
  "ok": true,
  "notionConfigured": true,
  "env": {
    "NOTION_API_KEY": true,
    "NOTION_OUTREACH_SESSIONS_DB_ID": true,
    "NOTION_RESPONSES_DB_ID": true,
    ...
  },
  "staffPasscodeEnabled": false
}
```

---

## 4. Current status

- Anniversary / RSVP UI removed
- Product rebranded to Community Outreach Intelligence Desk
- New Zod schemas + Notion write functions live
- `/api/sessions` and `/api/responses` ready
- Three new Notion databases created and linked
- Legacy field form still available as transitional surface

### Next product work (already prepared in code)

- SessionSetup + progressive ResponseForm UI
- Offline queue + clientSubmissionId
- Insights dashboard

---

## 5. Privacy note

This platform deliberately does **not** collect medical diagnoses, laboratory results or full clinical histories.  
It collects programme-relevant barriers, knowledge and support needs only.  
A formal DPIA is recommended before scaled multi-community deployment under Nigeria’s NDPA.
