# ISEYC Field Register Desk — Setup

**Repo:** https://github.com/mrzulqarnainnadabo/iseyc-field-register-desk  
**Notion home:** https://www.notion.so/3d35db88ef4681d6872ae7f690e8939c  
**Owner:** ISEYC · Programme partner: Tirngan Sickle Cell Foundation

## Notion database IDs (use in Vercel env)

| Env var | Database | ID |
|---------|----------|-----|
| `NOTION_RSVP_DB_ID` | Event RSVPs | `dcea4593a1054d5aab80ea06a38ef503` |
| `NOTION_ACTIVITIES_DB_ID` | Activities | `d53844be1a8340eb8f60e54223fa4613` |
| `NOTION_PARTICIPANTS_DB_ID` | Participants | *(see Participants DB URL after create)* |
| `NOTION_API_KEY` | Integration secret | `secret_…` or `ntn_…` |

Also optional: `REGISTER_PASSCODE` for staff Field tab.

## Claude → GitHub

Push the generated project files into this repo (main branch). Do not recreate the repo.

## After code is on main

1. Connect Notion integration to all three databases (Connections on each DB).
2. Vercel: import this repo, set env vars, deploy.
3. Test RSVP + one participant write.

## Not a medical record

Consent required. Minimal fields. Dignity first.
