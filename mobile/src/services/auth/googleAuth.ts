import * as WebBrowser from 'expo-web-browser';
import { useCallback } from 'react';
import { useOAuth } from '@clerk/clerk-expo';

WebBrowser.maybeCompleteAuthSession();

export const useGoogleAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: 'oauth_google' });

  const signInWithGoogle = useCallback(async () => {
    const { createdSessionId, setActive } = await startOAuthFlow();

    if (!createdSessionId) {
      throw new Error('Google sign-in was cancelled');
    }

    await setActive?.({ session: createdSessionId });

    return createdSessionId;
  }, [startOAuthFlow]);

  return { signInWithGoogle };
};
