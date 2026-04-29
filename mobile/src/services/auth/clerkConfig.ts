const rawClerkPublishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY?.trim() || '';

export const clerkPublishableKey = rawClerkPublishableKey;

export const isClerkConfigured =
  rawClerkPublishableKey.length > 0 &&
  rawClerkPublishableKey !== 'pk_test_your_clerk_publishable_key_here' &&
  rawClerkPublishableKey.startsWith('pk_');