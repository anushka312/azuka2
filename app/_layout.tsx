import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from '@react-navigation/native';

import { useFonts } from 'expo-font';

import {
  Stack,
  useRouter,
  useSegments,
} from 'expo-router';

import { StatusBar } from 'expo-status-bar';

import {
  useEffect,
} from 'react';

import 'react-native-reanimated';

import {
  AuthProvider,
  useAuth,
} from '@/contexts/AuthContext';

import {
  AzukaProvider,
} from '@/contexts/AzukaContext';

import {
  useColorScheme,
} from '@/hooks/use-color-scheme';

/*
 * ============================================================
 * EXPO ROUTER SETTINGS
 * ============================================================
 */

export const unstable_settings = {
  anchor: 'index',
};

/*
 * ============================================================
 * AUTH REDIRECT
 * ============================================================
 */


function AuthRedirect() {
  const {
    isAuthenticated,
    isLoading,
    profileCompleted,
  } = useAuth();

  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Wait until AuthContext has restored the user.
    if (isLoading) {
      return;
    }

    const currentGroup = segments[0];
    const currentScreen = segments[1];

    const inAuth = currentGroup === 'auth';
    const inProfileSetup =
      currentGroup === 'auth' &&
      currentScreen === 'profile-setup';

    const inTabs = currentGroup === '(tabs)';
    const inSettings = currentGroup === 'settings';
    const inModal = currentGroup === 'modal';

    // ========================================================
    // NOT LOGGED IN
    // ========================================================

    if (!isAuthenticated) {
      // Welcome screen is allowed.
      if (!currentGroup) {
        return;
      }

      // Login / signup are allowed.
      if (inAuth) {
        return;
      }

      // Everything else requires authentication.
      router.replace('/auth/login');
      return;
    }

    // ========================================================
    // LOGGED IN BUT PROFILE NOT COMPLETE
    // ========================================================

    if (!profileCompleted) {
      // Stay on profile setup.
      if (inProfileSetup) {
        return;
      }

      router.replace('/auth/profile-setup');
      return;
    }

    // ========================================================
    // LOGGED IN + PROFILE COMPLETE
    // ========================================================

    // Don't allow completed users to stay on login/signup.
    if (inAuth) {
      router.replace('/(tabs)/home');
      return;
    }

    // Don't allow completed users to stay on welcome screen.
    if (!currentGroup) {
      router.replace('/(tabs)/home');
      return;
    }

    // Already inside the main app.
    if (inTabs || inSettings || inModal) {
      return;
    }

    // Any other unknown route goes to Home.
    router.replace('/(tabs)/home');
  }, [
    isAuthenticated,
    isLoading,
    profileCompleted,
    segments,
    router,
  ]);

  return null;
}



/*
 * ============================================================
 * APP CONTENT
 * ============================================================
 */

function AppLayout() {
  const colorScheme =
    useColorScheme();

  const [fontsLoaded] =
    useFonts({
      'ArchivoBlack-Regular':
        require(
          '@/assets/fonts/ArchivoBlack-Regular.ttf'
        ),
    });

  /*
   * Wait for fonts.
   */

  if (!fontsLoaded) {
    return null;
  }

  return (
    <AzukaProvider>
      <ThemeProvider
        value={
          colorScheme === 'dark'
            ? DarkTheme
            : DefaultTheme
        }
      >
        {/*
         * AuthRedirect is INSIDE AuthProvider
         * because it uses useAuth().
         */}

        <AuthRedirect />

        <Stack
          screenOptions={{
            headerShown: false,
          }}
        >
          {/* ROOT */}

          <Stack.Screen
            name="index"
          />

          {/* AUTH */}

          <Stack.Screen
            name="auth/login"
          />

          <Stack.Screen
            name="auth/signup"
          />

          <Stack.Screen
            name="auth/profile-setup"
          />

          {/* MAIN APP */}

          <Stack.Screen
            name="(tabs)"
            options={{
              headerShown: false,
            }}
          />

          {/* MODAL */}

          <Stack.Screen
            name="modal"
            options={{
              presentation: 'modal',
              title: 'Modal',
            }}
          />

          {/* SETTINGS */}

          <Stack.Screen
            name="settings"
          />
        </Stack>

        <StatusBar
          style="auto"
        />
      </ThemeProvider>
    </AzukaProvider>
  );
}

/*
 * ============================================================
 * ROOT LAYOUT
 * ============================================================
 */

export default function RootLayout() {
  return (
    <AuthProvider>
      <AppLayout />
    </AuthProvider>
  );
}
