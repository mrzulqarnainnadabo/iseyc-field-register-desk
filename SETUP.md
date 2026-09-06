# ISEYC Field Register Desk — Setup

**Repo:** https://github.com/mrzulqarnainnadabo/iseyc-field-register-desk  
**Notion home:** https://www.notion.so/3d35db88ef4681d6872ae7f690e8939c  
**Owner:** ISEYC · Programme partner: Tirngan Sickle Cell Foundation

## Notion database IDs (Vercel env)

| Env var | Database | ID |
|---------|----------|-----|
| `NOTION_RSVP_DB_ID` | Event RSVPs | `dcea4593a1054d5aab80ea06a38ef503` |
| `NOTION_ACTIVITIES_DB_ID` | Activities | `d53844be1a8340eb8f60e54223fa4613` |
| `NOTION_PARTICIPANTS_DB_ID` | Participants | `d156bdbc4f6d4650ae0be757fec0b002` |
| `NOTION_API_KEY` | Integration secret | `ntn_…` or `secret_…` |

Optional: `REGISTER_PASSCODE` for staff Field tab.

### Notion links
- Desk home: https://www.notion.so/3d35db88ef4681d6872ae7f690e8939c
- Event RSVPs: https://www.notion.so/dcea4593a1054d5aab80ea06a38ef503
- Activities: https://www.notion.so/d53844be1a8340eb8f60e54223fa4613
- Participants: https://www.notion.so/d156bdbc4f6d4650ae0be757fec0b002

## Claude → GitHub

Push generated project files into **this** repo on `main`. Do not create a second repo.

## After code is on main

1. In Notion: connect your integration to all three databases (⋯ → Connections).
2. Vercel: import this repo → set the four env vars → deploy.
3. Test one RSVP and one participant write.

## Not a medical record

Consent required. Minimal fields. Dignity first.
