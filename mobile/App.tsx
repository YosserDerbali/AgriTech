import 'react-native-gesture-handler';
import { useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ClerkProvider, tokenCache, useAuth, useUser } from '@clerk/clerk-expo';

import RootNavigator from './src/navigation/RootNavigator';
import { ThemeProvider } from './src/theme/ThemeContext';
import { useTheme } from './src/hooks/useTheme';
import { useAppStore } from './src/stores/appStore';
import { clerkPublishableKey, isClerkConfigured } from './src/services/auth/clerkConfig';

function ClerkStateSync() {
  const { isLoaded, isSignedIn, sessionId } = useAuth();
  const { user: clerkUser } = useUser();
  const token = useAppStore((state) => state.token);
  const currentRole = useAppStore((state) => state.currentRole);
  const setUser = useAppStore((state) => state.setUser);
  const setIsAuthenticated = useAppStore((state) => state.setIsAuthenticated);
  const setClerkSession = useAppStore((state) => state.setClerkSession);

  useEffect(() => {
    if (!isLoaded) {
      return;
    }

    if (isSignedIn && sessionId) {
      setClerkSession(sessionId);
      setIsAuthenticated(true);
      return;
    }

    setClerkSession(null);

    if (!token) {
      setIsAuthenticated(false);
      setUser(null);
    }
  }, [isLoaded, isSignedIn, sessionId, token, setClerkSession, setIsAuthenticated, setUser]);

  useEffect(() => {
    if (!isLoaded || !isSignedIn || !clerkUser) {
      return;
    }

    const email =
      clerkUser.primaryEmailAddress?.emailAddress ||
      clerkUser.emailAddresses[0]?.emailAddress ||
      '';
    const name =
      clerkUser.fullName ||
      [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(' ') ||
      email ||
      'Google user';

    setUser({
      id: clerkUser.id,
      name,
      email,
      role: currentRole,
    });
    setIsAuthenticated(true);
  }, [isLoaded, isSignedIn, clerkUser, currentRole, setIsAuthenticated, setUser]);

  return null;
}

function AppContent() {
  const { isDark } = useTheme();

  return (
    <>
      <ClerkStateSync />
      <NavigationContainer>
        <RootNavigator />
        <StatusBar style={isDark ? 'light' : 'dark'} />
      </NavigationContainer>
    </>
  );
}

export default function App() {
  const app = (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );

  if (!isClerkConfigured) {
    if (__DEV__) {
      console.warn('Clerk is not configured. Google sign-in will be disabled until EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY is set.');
    }

    return app;
  }

  return (
    <ClerkProvider
      publishableKey={clerkPublishableKey}
      tokenCache={tokenCache}
    >
      {app}
    </ClerkProvider>
  );
}