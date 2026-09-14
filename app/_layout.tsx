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

import { useEffect } from 'react';

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


// ============================================================
// EXPO ROUTER SETTINGS
// ============================================================

export const unstable_settings = {
  anchor: 'index',
};


// ============================================================
// AUTH REDIRECT
// ============================================================

function AuthRedirect() {

  const {
    isAuthenticated,
    isLoading,
    profileCompleted,
  } = useAuth();

  const router = useRouter();

  const segments = useSegments();


  useEffect(() => {

    // --------------------------------------------------------
    // Wait until AuthContext has finished restoring auth state
    // --------------------------------------------------------

    if (isLoading) {
      return;
    }


    const currentGroup = segments[0];

    const currentScreen = segments[1];


    const inAuth =
      currentGroup === 'auth';

    const inProfileSetup =
      currentGroup === 'auth' &&
      currentScreen === 'profile-setup';

    const inTabs =
      currentGroup === '(tabs)';

    const inSettings =
      currentGroup === 'settings';

    const inModal =
      currentGroup === 'modal';


    // ========================================================
    // 1. NOT AUTHENTICATED
    // ========================================================

    if (!isAuthenticated) {

      // Root / Welcome screen
      if (!currentGroup) {
        return;
      }

      // Login / Signup / Profile setup
      if (inAuth) {
        return;
      }

      // Everything else requires authentication
      router.replace('/auth/login');

      return;
    }


    // ========================================================
    // 2. AUTHENTICATED BUT PROFILE NOT COMPLETE
    // ========================================================

    if (!profileCompleted) {

      // User must stay on Profile Setup
      if (inProfileSetup) {
        return;
      }

      router.replace('/auth/profile-setup');

      return;
    }


    // ========================================================
    // 3. AUTHENTICATED + PROFILE COMPLETE
    // ========================================================

    // Don't allow completed users to stay inside auth
    if (inAuth) {

      router.replace('/(tabs)/home');

      return;
    }


    // Don't allow completed users to stay on welcome
    if (!currentGroup) {

      router.replace('/(tabs)/home');

      return;
    }


    // Main application routes
    if (
      inTabs ||
      inSettings ||
      inModal
    ) {
      return;
    }


    // Unknown route
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


// ============================================================
// APP CONTENT
// ============================================================

function AppLayout() {

  const colorScheme =
    useColorScheme();


  // ==========================================================
  // FONTS
  // ==========================================================

  const [fontsLoaded] = useFonts({

    'ArchivoBlack-Regular':
      require(
        '@/assets/fonts/ArchivoBlack-Regular.ttf'
      ),

  });


  // ==========================================================
  // WAIT FOR FONTS
  // ==========================================================

  if (!fontsLoaded) {
    return null;
  }


  // ==========================================================
  // APP
  // ==========================================================

  return (

    <AzukaProvider>

      <ThemeProvider
        value={
          colorScheme === 'dark'
            ? DarkTheme
            : DefaultTheme
        }
      >

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


        <StatusBar style="auto" />

      </ThemeProvider>

    </AzukaProvider>
  );
}


// ============================================================
// ROOT LAYOUT
// ============================================================

export default function RootLayout() {

  return (

    <AuthProvider>

      <AppLayout />

    </AuthProvider>

  );
}