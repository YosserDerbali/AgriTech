# Google Sign-In Implementation Guide

## Overview

This implementation adds Firebase Authentication with Google Sign-In (OAuth 2.0) to the AgriTech mobile app. Users can now:
- Sign in with their Google account on both Farmer and Agronomist screens
- Auto-create accounts if they're new
- Skip password entry while maintaining backend JWT security
- Session persists across app restarts

---

## Files Created

### 1. **Mobile - Firebase Configuration**
📄 `mobile/src/config/firebase.ts` (NEW)
- Initializes Firebase SDK
- Configures auth persistence with AsyncStorage
- Loads credentials from environment variables

### 2. **Mobile - Google Auth Service**
📄 `mobile/src/services/googleAuthService.ts` (NEW)
- `signInWithGoogle()` - Main Google OAuth function
- `signOut()` - Sign out from Firebase and local storage
- `getCurrentFirebaseUser()` - Get current Firebase user
- `onAuthStateChange()` - Listen to auth state changes
- Uses `expo-auth-session` for OAuth flow
- Integrates with backend to issue JWT tokens

### 3. **Mobile - Google Sign-In Button Component**
📄 `mobile/src/components/ui/GoogleSignInButton.tsx` (NEW)
- Modern Material Design button
- Follows Google Brand Guidelines
- Loading states and haptic feedback
- Accessibility support
- Responsive sizing (small/medium/large)

### 4. **Backend - Google Sign-In Endpoint**
📄 `backend/controllers/auth.js` (MODIFIED)
- Added `googleSignIn()` controller
- Creates user from Google data if new
- Updates Firebase UID for returning users
- Issues backend JWT token

---

## Files Modified

### 1. **Mobile - Auth Screen (Farmer)**
📄 `mobile/src/screens/auth/FarmerAuthScreen.tsx` (MODIFIED)
- Added Google Sign-In button
- Added `handleGoogleSignIn()` function
- Updated UI with divider ("OR")
- Integrated with existing auth flow

### 2. **Mobile - Auth Screen (Agronomist)**
📄 `mobile/src/screens/auth/AgronomistAuthScreen.tsx` (MODIFIED)
- Added Google Sign-In button
- Added `handleGoogleSignIn()` function
- Updated UI with divider ("OR")
- Integrated with existing auth flow

### 3. **Mobile - Auth API Service**
📄 `mobile/src/services/authAPI.ts` (MODIFIED)
- Added `GoogleSignInRequest` interface
- Added `googleSignIn()` API method
- Updated `AuthResponse` interface to include photo

### 4. **Backend - Auth Routes**
📄 `backend/routes/auth.js` (MODIFIED)
- Added POST `/auth/google-signin` route

### 5. **Mobile - Dependencies**
📄 `mobile/package.json` (MODIFIED)
- Added `expo-auth-session`: ~6.2.2
- Added `expo-web-browser`: ~13.0.0
- Added `firebase`: ^11.1.0

### 6. **Backend - Dependencies**
📄 `backend/package.json` (MODIFIED)
- Added `crypto`: ^1.0.1 (for random password generation)

### 7. **.gitignore Updates**
📄 `mobile/.gitignore` (MODIFIED)
- Added `google-services.json`
- Added `GoogleService-Info.plist`
- Added `/ios` and `/android` (native builds)
- Added `.env` files

---

## New Configuration Files

### 1. **Setup Instructions**
📄 `mobile/FIREBASE_SETUP.md` (NEW)
- Step-by-step Firebase project setup
- Google OAuth credentials
- Native file placement
- Troubleshooting guide

### 2. **Environment Variables Example**
📄 `mobile/.env.example` (NEW)
- Template for required environment variables
- Firebase config keys
- Google Client ID placeholder
- API URL template

---

## Installation & Setup

### Step 1: Install Dependencies
```bash
cd mobile
npm install
# or
yarn install
```

### Step 2: Set Up Firebase Project
Follow `mobile/FIREBASE_SETUP.md` - It has detailed step-by-step instructions

### Step 3: Create Environment File
```bash
cd mobile
cp .env.example .env.local
```

Then fill in your Firebase credentials:
```env
EXPO_PUBLIC_FIREBASE_API_KEY=YOUR_VALUE
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=YOUR_VALUE
EXPO_PUBLIC_FIREBASE_PROJECT_ID=YOUR_VALUE
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=YOUR_VALUE
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=YOUR_VALUE
EXPO_PUBLIC_FIREBASE_APP_ID=YOUR_VALUE
EXPO_PUBLIC_GOOGLE_CLIENT_ID=YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com
```

### Step 4: Backend Updates
The backend is already configured. Just ensure `.env` has:
```env
JWT_SECRET=your-jwt-secret
DATABASE_URL=your-database-url
```

### Step 5: Test
```bash
npm start
# Then select android or ios
```

---

## Flow Diagram

```
User clicks "Continue with Google"
    ↓
Google OAuth Modal Opens (Web Browser)
    ↓
User signs in with Google
    ↓
Google returns ID Token & Access Token
    ↓
Firebase authenticates with Google credential
    ↓
firebaseUser.getIdToken() called
    ↓
Backend: POST /auth/google-signin with user data
    ↓
Backend: Check if user exists
    ├─ NEW: Create user with random password
    └─ EXISTING: Update Firebase UID
    ↓
Backend: Issue JWT token
    ↓
App: Store JWT in AsyncStorage
    ↓
App: Update Zustand store (isAuthenticated, user, role)
    ↓
Navigation to Home Screen
```

---

## API Endpoint

### POST `/auth/google-signin`

**Request:**
```json
{
  "email": "user@gmail.com",
  "name": "User Name",
  "photo": "https://...",
  "firebaseUid": "firebase-uid-xxx",
  "role": "FARMER" | "AGRONOMIST"
}
```

**Response:**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": 123,
    "name": "User Name",
    "email": "user@gmail.com",
    "role": "FARMER",
    "photo": "https://..."
  }
}
```

---

## Security Considerations

### ✅ Implemented
- Google OAuth 2.0 with secure credential exchange
- Firebase auth state persistence
- JWT tokens issued by backend
- Private credentials in `.env.local` (not in repo)
- Sensitive files in `.gitignore`
- Random password generation for Google users

### 📋 Recommended for Production
- Enable reCAPTCHA in Firebase Console
- Use separate Firebase projects for dev/prod
- Rotate Firebase credentials regularly
- Add rate limiting to `/auth/google-signin`
- Store photo URLs securely (optional field)
- Add email verification for non-Google users
- Implement refresh token rotation

---

## User Experience

### Farmer Screen
```
[Logo]
"Farmer Portal"
"Sign in to continue to AgriScan"

[Continue with Google 🔵]

────────── OR ──────────

[Email input field]
[Password input field]
[Sign In button]

[Don't have an account? Sign Up]
[Are you an agronomist?] [Sign in as Agronomist]
```

### Agronomist Screen (Similar)
```
[Logo]
"Agronomist Portal"
"Sign in to review diagnoses and help farmers"

[Continue with Google 🔵]

────────── OR ──────────

[Name input field]
[Email input field]
[Password input field]
[Specialties textarea]
[Experience input field]
[Create Account button]

[Already have an account? Sign In]
[Are you a farmer?] [Sign in as Farmer]
```

---

## Error Handling

The implementation handles:
- ✅ Google sign-in cancelled by user
- ✅ No internet connection
- ✅ Firebase initialization failures
- ✅ Backend API errors
- ✅ Missing Firebase credentials
- ✅ Duplicate email errors (from backend)
- ✅ Role mismatch errors

All errors show user-friendly Alert dialogs.

---

## Session Persistence

Sessions are automatically persisted via:
1. **Firebase**: `initializeAuth()` with `getReactNativePersistence(AsyncStorage)`
2. **Backend**: JWT stored in `AsyncStorage` via `setToken()`
3. **App State**: Zustand store is restored on app launch

User stays signed in after app restart.

---

## Testing Checklist

- [ ] Create test Google account
- [ ] Test "Continue with Google" on Farmer screen
- [ ] Test "Continue with Google" on Agronomist screen
- [ ] Verify new user created in database
- [ ] Verify returning user updates correctly
- [ ] Check JWT token is stored
- [ ] Verify session persists after app restart
- [ ] Test disconnect/reconnect network
- [ ] Test sign out clears all data
- [ ] Verify role assignment (farmer vs agronomist)
- [ ] Test cancel Google sign-in
- [ ] Check profile photo is retrieved

---

## Troubleshooting

### Error: "Google Sign-In was cancelled or failed"
- ✅ Check `EXPO_PUBLIC_GOOGLE_CLIENT_ID` in `.env.local`
- ✅ Ensure Google OAuth is enabled in Firebase Console
- ✅ Reload Expo app after changing `.env.local`

### Error: "No ID token received from Google"
- ✅ Verify Firebase config is correct
- ✅ Check Firebase console → Google sign-in provider is enabled
- ✅ Verify OAuth consent screen is configured

### Error: "Cannot read property 'firebaseUid'"
- ✅ Ensure backend User model has `firebaseUid` column
- ✅ Run migrations if needed

### Google button not showing
- ✅ Check `GoogleSignInButton` import in screen files
- ✅ Verify component path is correct
- ✅ Check Expo Icons are installed

---

## Next Steps (Optional Enhancements)

1. **Two-Factor Authentication**
   - Enable 2FA in Firebase Console
   
2. **Profile Picture Upload**
   - Save profilePhoto from Google to database
   
3. **Account Linking**
   - Allow users to link email/password with Google account
   
4. **Social Login Others**
   - Add Facebook, GitHub, Apple Sign-In using same pattern

5. **Analytics**
   - Track sign-in methods (Google vs email/password)

---

## Support

For Firebase issues: [Firebase Documentation](https://firebase.google.com/docs)
For Expo Auth: [Expo Auth Session](https://docs.expo.dev/guides/authentication/)
For OAuth: [Google OAuth 2.0](https://developers.google.com/identity/protocols/oauth2)
