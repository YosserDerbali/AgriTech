import React, { useEffect } from 'react';
import { useAppStore } from '../stores/appStore';

interface ThemeProviderProps {
  children: React.ReactNode;
}

/**
 * ThemeProvider Component
 * 
 * Initializes the theme system on app startup:
 * 1. Restores saved theme preference from AsyncStorage
 * 2. Wraps all child components
 * 
 * This ensures the theme is available to all components via useTheme() hook
 * 
 * Usage:
 *   <ThemeProvider>
 *     <NavigationContainer>
 *       <RootNavigator />
 *     </NavigationContainer>
 *   </ThemeProvider>
 */
export function ThemeProvider({ children }: ThemeProviderProps) {
  const restoreTheme = useAppStore((state) => state.restoreTheme);

  // Initialize theme on app startup
  useEffect(() => {
    restoreTheme();
  }, [restoreTheme]);

  return <>{children}</>;
}
