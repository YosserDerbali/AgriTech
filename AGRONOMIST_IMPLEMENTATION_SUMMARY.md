# Agronomist: Minimal Operational Fixes (Summary)

Date: 2026-04-11

## Goal
Make the **Agronomist** flow operational with **minimal changes only**:
- Agronomist can sign in successfully
- Agronomist can reach the agronomist portal routes (e.g. `/agronomist`)

## What Was Implemented 
### 1) Fix web → backend API base URL used by auth
The web app was calling a placeholder host (`http://YOUR_IP_ADRESS:3000`), which caused agronomist login/register requests to fail.

Implemented:
- Web auth API base URL is now `http://localhost:3000`

File changed:
- `src/services/authAPIs.ts`

### 2) Align agronomist demo credentials shown in UI with seeded DB user
The Agronomist Auth page displayed a demo email that did not exist in the database seed.

Implemented:
- Demo email shown/placeholder updated to the seeded active agronomist user

File changed:
- `src/pages/auth/AgronomistAuthPage.tsx`

### 3) Ensure backend CORS allows the Vite dev origin
Backend CORS must allow the frontend dev server origin for the browser to call backend endpoints.

Implemented:
- Backend CORS allows: `http://localhost:5173` and `http://localhost:8080`

File changed:
- `backend/app.js`


## Demo Credentials (Agronomist)
- Email: `sarah@agro.com`
- Password: `password123`


## Notes / Current Limitations
- Agronomist “Pending Queue” and “Articles” UI currently uses in-memory mock stores; actions like approve/reject/edit affect local state only (no backend persistence).
- If you want agronomist operations to be **fully backend-driven**, the next minimal step is to add/enable agronomist endpoints and wire the stores/pages to those endpoints.
