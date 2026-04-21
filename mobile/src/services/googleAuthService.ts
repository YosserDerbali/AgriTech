import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import {
  signInWithCredential,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
} from 'firebase/auth';
import { auth } from '../config/firebase';
import { authAPI, RegisterRequest } from './authAPI';

WebBrowser.maybeCompleteAuthSession();

/**
 * Google Sign-In Service
 * Handles Firebase Google Authentication and integration with backend
 */

export interface GoogleSignInResult {
  token: string; // JWT from backend
  user: {
    id: number;
    name: string;
    email: string;
    role: string;
    photo?: string;
  };
}

/**
 * Initialize Google Auth Request
 * This should be called from a component using the hook
 */
export const useGoogleAuth = () => {
  return Google.useAuthRequest({
    clientId: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
  });
};

/**
 * Sign in with Google
 * - Gets Google credential from Expo Auth Session
 * - Authenticates with Firebase
 * - Exchanges Firebase token with backend JWT
 * - Creates or fetches user from backend
 */
export const signInWithGoogle = async (
  idToken: string,
  accessToken: string | undefined,
  role: 'FARMER' | 'AGRONOMIST'
): Promise<GoogleSignInResult> => {
  try {
    if (!idToken) {
      throw new Error('No ID token received from Google');
    }

    // Sign in with Firebase using Google credential
    const credential = GoogleAuthProvider.credential(idToken, accessToken);
    const userCredential = await signInWithCredential(auth, credential);
    
    const firebaseUser = userCredential.user;

    // Send to backend for JWT issuance and user creation/update
    const backendResponse = await authAPI.googleSignIn({
      email: firebaseUser.email || '',
      name: firebaseUser.displayName || 'Google User',
      photo: firebaseUser.photoURL || undefined,
      firebaseUid: firebaseUser.uid,
      role,
    });

    return backendResponse;
  } catch (error) {
    console.error('Google Sign-In Error:', error);
    throw error instanceof Error
      ? error
      : new Error('Google sign-in failed. Please try again.');
  }
};

/**
 * Sign out from both Firebase and local storage
 */
export const signOut = async (): Promise<void> => {
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error('Sign out error:', error);
    throw error instanceof Error
      ? error
      : new Error('Failed to sign out');
  }
};

/**
 * Get current Firebase user
 */
export const getCurrentFirebaseUser = () => {
  return auth.currentUser;
};

/**
 * Listen to Firebase auth state changes
 */
export const onAuthStateChange = (callback: (user: any) => void) => {
  return auth.onAuthStateChanged(callback);
};

export { Google, WebBrowser };
