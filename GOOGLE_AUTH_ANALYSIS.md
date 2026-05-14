# Google Authentication Flow Analysis & Issues

## ⚠️ Key Issues Found

### 1. **No Firebase - Actually Using Clerk**

**Current State:**
- ❌ Variable named `firebaseUid` in the database
- ✅ Actually using **Clerk** for OAuth (not Firebase)
- ✅ Comments in code mention "Firebase OAuth" (misleading)

**Evidence:**
```
mobile/src/services/auth/googleAuth.ts → Uses @clerk/clerk-expo
mobile/src/services/auth/clerkConfig.ts → Reads EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY
backend/package.json → NO firebase dependency
```

**Backend Dependencies:**
```json
No Firebase packages installed. The backend is plain Express.js + JWT.
```

---

## 📊 Complete Google Authentication Flow

### Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────┐
│ MOBILE APP (React Native / Expo)                                    │
│                                                                     │
│ User clicks "Continue with Google"                                 │
│           ↓                                                         │
│ GoogleSignInButton.tsx calls handlePress()                         │
│           ↓                                                         │
│ FarmerAuthScreen.tsx → useGoogleAuth hook                          │
│           ↓                                                         │
│ googleAuth.ts → startOAuthFlow() [from @clerk/clerk-expo]          │
│           ↓                                                         │
│ 🔐 CLERK CLOUD:                                                    │
│    - Clerk opens Google OAuth dialog                               │
│    - User grants permission                                         │
│    - Clerk receives OAuth token from Google                        │
│    - Returns createdSessionId to mobile app                        │
│           ↓                                                         │
│ setActive?({ session: createdSessionId })                          │
│ → Clerk session established on mobile device                       │
│           ↓                                                         │
│ signInWithGoogle() returns createdSessionId                        │
│           ↓                                                         │
│ ❌ PROBLEM: This is where flow STOPS                               │
│ The mobile app NEVER sends data to backend!                        │
└─────────────────────────────────────────────────────────────────────┘
```

### What SHOULD Happen (but isn't)

```
┌─────────────────────────────────────────────────────────────────────┐
│ BACKEND (Express.js)                                                │
│                                                                     │
│ POST /auth/google-signin                                           │
│ Expects: {                                                          │
│   email: string,          ← Google account email                   │
│   name: string,           ← Google account name                     │
│   photo?: string,         ← Google profile picture                 │
│   providerUid: string,    ← OAuth provider ID (from Clerk/Google) │
│   role: 'FARMER'/'AGRONOMIST'                                      │
│ }                                                                   │
│           ↓                                                         │
│ Controllers → auth.js → googleSignIn()                             │
│           ↓                                                         │
│ Check if user exists by email                                      │
│           ↓                                                         │
│ If NEW user:                                                        │
│   - Create user with random password                              │
│   - Set firebaseUid = providerUid  ← MISNAMING!                   │
│           ↓                                                         │
│ Generate JWT token                                                 │
│ Return: { token, user }                                            │
└─────────────────────────────────────────────────────────────────────┘
```

---

## 🔍 Where `providerUid` Comes From

### Current Code Flow (Backend):

```javascript
// backend/controllers/auth.js - Line 94-96
exports.googleSignIn = async (req, res) => {
  try {
    const { email, name, photo, providerUid, role } = req.body;
    //                                ^^^^^^^^^^
    //                    Expected from mobile app
    //                    (Currently NOT being sent!)
```

### Mobile Side (Incomplete):

```typescript
// mobile/src/services/auth/googleAuth.ts
export const useGoogleAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const signInWithGoogle = useCallback(async () => {
    const { createdSessionId, setActive } = await startOAuthFlow();
    //      ^^^^^^^^^^^^^^^^
    //      This is Clerk's session ID, NOT Google's OAuth UID!
    
    if (!createdSessionId) {
      throw new Error('Google sign-in was cancelled');
    }

    await setActive?.({ session: createdSessionId });
    
    // ❌ MISSING: Never calls backend /auth/google-signin
    // ❌ MISSING: Never extracts user data from Clerk/Google
    // ❌ MISSING: Never sends providerUid to backend
    
    return createdSessionId;
  }, [startOAuthFlow]);

  return { signInWithGoogle };
};
```

---

## 🎯 Issues Summary

| Issue | Current | Expected |
|-------|---------|----------|
| **Firebase vs Clerk** | Using Clerk, but code says Firebase | Update comments, rename variables |
| **providerUid source** | Backend expects it, mobile never sends it | Extract from Clerk user object |
| **Google OAuth ID** | Not captured anywhere | Get from `useOAuth` user data |
| **Backend integration** | Not called after OAuth succeeds | Call `/auth/google-signin` endpoint |
| **Variable naming** | `firebaseUid` field | Should be `oauthProviderId` or `clerkUserId` |
| **Clerk session sync** | Mobile has Clerk session, backend doesn't know | Send Clerk session token to backend for verification |

---

## 📋 Required Data from Google/Clerk OAuth

When user signs in with Google via Clerk, you need to extract:

```typescript
{
  // From Clerk user object after OAuth
  email: user.primaryEmailAddress?.emailAddress,
  name: user.fullName || user.firstName,
  photo: user.imageUrl,
  clerkUserId: user.id,  // ← This is the OAuth provider UID from Clerk
  role: 'FARMER' // User selects this
}
```

---

## ✅ Recommended Fix

### Step 1: Update Database Model

Rename the field for clarity:
```javascript
// Before
firebaseUid: string

// After  
oauthProviderId: string  // More accurate
// OR
clerkUserId: string      // Specific to Clerk
```

### Step 2: Fix Mobile Auth Flow

```typescript
// mobile/src/services/auth/googleAuth.ts
export const useGoogleAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });
  const { user } = useUser();  // ← Add this to get user data
  const { setUser, setToken } = useAppStore();

  const signInWithGoogle = useCallback(async () => {
    try {
      const { createdSessionId, setActive } = await startOAuthFlow();

      if (!createdSessionId) {
        throw new Error('Google sign-in was cancelled');
      }

      await setActive?.({ session: createdSessionId });

      // ✅ NEW: Extract Clerk user data
      if (user) {
        // ✅ NEW: Send to backend
        const response = await authAPI.googleSignIn({
          email: user.primaryEmailAddress?.emailAddress || '',
          name: user.fullName || 'OAuth User',
          photo: user.imageUrl || undefined,
          clerkUserId: user.id,  // ← Renamed from firebaseUid
          role: useAppStore().currentRole === 'farmer' ? 'FARMER' : 'AGRONOMIST'
        });

        // ✅ NEW: Store backend token
        await setToken(response.token);
        setUser({
          id: response.user.id,
          name: response.user.name,
          email: response.user.email,
          role: response.user.role.toLowerCase()
        });
      }

      return createdSessionId;
    } catch (error) {
      throw error;
    }
  }, [startOAuthFlow, user]);

  return { signInWithGoogle };
};
```

### Step 3: Update Backend Controller

```javascript
// backend/controllers/auth.js
exports.googleSignIn = async (req, res) => {
  try {
    const { email, name, photo, clerkUserId, role } = req.body;  // Renamed
    //                                ^^^^^^^^^^
    //                    Now accurately named

    if (!email || !clerkUserId || !role) {
      return res.status(400).json({ message: "Email, provider UID, and role are required" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      const randomPassword = require('crypto').randomBytes(16).toString('hex');
      const password_hash = await bcrypt.hash(randomPassword, 10);
      
      const now = new Date();
      user = await User.create({
        name: name || 'OAuth User',
        email,
        password_hash,
        role,
        oauthProviderId: clerkUserId,  // ← Renamed from firebaseUid
        profilePhoto: photo || null,
        lastLoginAt: now,
        isActive: true,
      });
    } else {
      user.oauthProviderId = clerkUserId;  // ← Updated
      if (photo) {
        user.profilePhoto = photo;
      }
      user.lastLoginAt = new Date();
      if (user.role !== role) {
        user.role = role;
      }
      await user.save();
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });

    res.json({ token, user: sanitizeUser(user) });
  } catch (error) {
    console.error("OAuth Sign-In error:", error);
    res.status(500).json({ message: "OAuth sign-in failed" });
  }
};
```

---

## 🚀 Current Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Clerk Setup | ✅ Configured | `clerkConfig.ts` checks for key |
| Google OAuth Flow | ⚠️ Partial | Clerk OAuth works, but mobile doesn't send to backend |
| Backend Endpoint | ✅ Ready | `/auth/google-signin` exists and ready |
| Mobile Integration | ❌ Incomplete | Missing backend call after OAuth |
| Variable Naming | ❌ Confusing | `firebaseUid` should be `clerkUserId` or `oauthProviderId` |

---

## Summary

**Do we use Firebase?**
- ❌ No Firebase installed
- ✅ Using **Clerk** for OAuth
- ⚠️ Naming is misleading

**Where does providerUid come from?**
- From **Clerk's user object** after successful Google OAuth
- Should be extracted as `user.id` from the Clerk SDK
- Mobile app needs to extract and send it to backend

**The flow:**
1. User clicks "Continue with Google"
2. Clerk handles OAuth (Google login screen)
3. Mobile gets Clerk session
4. Mobile should extract user data and call backend `/auth/google-signin`
5. Backend creates/updates user and returns JWT
6. Mobile stores JWT and continues

**Key issue:** Step 4 is missing - mobile app never calls the backend endpoint!
