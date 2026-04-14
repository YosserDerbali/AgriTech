# Google Auth Integration Report

## Scope
Added Google sign-in/sign-up support for mobile Farmer and Agronomist authentication flows, including backend token exchange endpoint and frontend auth buttons.

## Backend Changes

### Updated
- `backend/routes/auth.js`
  - Added route: `POST /auth/google`

- `backend/controllers/auth.js`
  - Added `googleAuth` controller.
  - Verifies Google access token via Google userinfo endpoint.
  - Validates role (`FARMER` or `AGRONOMIST`).
  - Finds existing user by email or creates a new one.
  - Issues app JWT and returns sanitized user payload.

## Mobile Changes

### Added
- `mobile/src/services/googleAuth.ts`
  - Centralized Google OAuth client ID config.
  - Exposes `isGoogleAuthConfigured` helper.

### Updated
- `mobile/src/services/authAPI.ts`
  - Added `googleAuth` API call to `POST /auth/google`.

- `mobile/App.tsx`
  - Added `WebBrowser.maybeCompleteAuthSession()` for OAuth session completion.

- `mobile/src/screens/auth/FarmerAuthScreen.tsx`
  - Added Google OAuth flow with `expo-auth-session`.
  - Added Google button (`Sign in with Google` / `Continue with Google`).
  - On success: stores token, sets user, role, authenticated state.

- `mobile/src/screens/auth/AgronomistAuthScreen.tsx`
  - Added same Google OAuth flow scoped to role `AGRONOMIST`.
  - Added Google button (`Sign in with Google` / `Continue with Google`).

## Dependencies Installed
- `expo-auth-session`
- `expo-web-browser`

## Required Environment Variables
Set these in mobile environment before running OAuth:
- `EXPO_PUBLIC_GOOGLE_EXPO_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_IOS_CLIENT_ID`
- `EXPO_PUBLIC_GOOGLE_ANDROID_CLIENT_ID`

## Notes
- Google button is disabled if OAuth client IDs are not configured.
- Existing email/password auth remains unchanged.
- Role mismatch is rejected by backend to prevent cross-role login issues.
