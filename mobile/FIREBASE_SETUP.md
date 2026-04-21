# Firebase & Google Sign-In Setup

> **Status**: ✅ Integration complete | ⚠️ Credentials needed

Google Sign-In is ready to use. Just add your Firebase credentials and run the app.

## 1. Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → Sign-in method → Google → Enable

## 2. Get Credentials

### Firebase Config
1. Project Settings → Your apps → Web
2. Copy your config values (API Key, Project ID, etc.)

### Google Client ID
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Credentials → Create OAuth 2.0 Client ID → Web application
3. Copy the Client ID

## 3. Add to `.env.local`

Create `mobile/.env.local`:

```env
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789:web:abc123
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

## 4. Run

```bash
cd mobile
npm install
npm start
```

Scan the QR code and tap **Continue with Google**.

## Built-In

✅ Google buttons on both login screens  
✅ Auto user creation from Google profile  
✅ Session persistence  
✅ JWT token exchange with backend  
✅ Production-ready error handling
