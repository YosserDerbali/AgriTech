# Agronomist Routes/Controllers - Simple Report

## Added Files
- backend/controllers/agronomist.js
- backend/services/agronomist.js

## Updated Files
- backend/routes/agronomist.js
- backend/app.js

## New Base Route
- `/agronomist`

## Implemented Endpoints
- `GET /agronomist/diagnoses/pending`
- `GET /agronomist/diagnoses/:id`
- `PATCH /agronomist/diagnoses/:id/approve`
- `PATCH /agronomist/diagnoses/:id/reject`
- `GET /agronomist/articles`
- `POST /agronomist/articles`
- `PATCH /agronomist/articles/:id`
- `DELETE /agronomist/articles/:id`

## Notes
- All endpoints are protected by `authenticate` + `requireAgronomist`.
- Diagnosis review supports approve/reject with agronomist notes.
- Article endpoints are scoped to the logged-in agronomist (`author_id = req.user.id`).
