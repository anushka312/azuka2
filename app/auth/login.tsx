
import { useRouter } from 'expo-router';

import { useState } from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  signInWithEmailAndPassword,
} from 'firebase/auth';

import {
  GlobalStyles,
  Palette,
} from '@/constants/Styles';

import { auth } from '@/services/firebase';

import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();

  const { signIn } = useAuth();

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [emailError, setEmailError] =
    useState('');

  const [passwordError, setPasswordError] =
    useState('');

  const [firebaseError, setFirebaseError] =
    useState('');

  const [isLoading, setIsLoading] =
    useState(false);

  /*
   * ============================================================
   * EMAIL VALIDATION
   * ============================================================
   */

  const validateEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(
      value.trim()
    );
  };

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */

  const handleLogin = async () => {
    const trimmedEmail =
      email.trim();

    const trimmedPassword =
      password.trim();

    const hasValidEmail =
      validateEmail(trimmedEmail);

    const hasValidPassword =
      trimmedPassword.length >= 6;

    setEmailError(
      hasValidEmail
        ? ''
        : 'Please enter a valid email address.'
    );

    setPasswordError(
      hasValidPassword
        ? ''
        : 'Password should be at least 6 characters.'
    );

    setFirebaseError('');

    if (
      !hasValidEmail ||
      !hasValidPassword
    ) {
      return;
    }

    try {
      setIsLoading(true);

      /*
       * ========================================================
       * STEP 1
       * Authenticate with Firebase.
       * ========================================================
       */

      const credential =
        await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          trimmedPassword
        );

      const firebaseUser =
        credential.user;

      /*
       * ========================================================
       * STEP 2
       * Update our AuthContext.
       *
       * AuthContext will:
       *
       * 1. Store the user locally
       * 2. Read this user's profileCompleted value
       * 3. Update isAuthenticated
       * 4. Update profileCompleted
       *
       * AuthRedirect in _layout.tsx will then
       * automatically navigate the user.
       * ========================================================
       */

      await signIn(
        firebaseUser.uid,
        firebaseUser.displayName ?? '',
        firebaseUser.email ?? trimmedEmail
      );

      /*
       * IMPORTANT:
       *
       * DO NOT navigate here.
       *
       * AuthRedirect will see the changed AuthContext
       * and send the user to:
       *
       * profileCompleted === false
       *      -> /auth/profile-setup
       *
       * profileCompleted === true
       *      -> /(tabs)
       */

    } catch (error: any) {
      console.error(
        'Login error:',
        error
      );

      switch (error.code) {
        case 'auth/invalid-email':
          setFirebaseError(
            'Please enter a valid email address.'
          );
          break;

        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setFirebaseError(
            'Incorrect email or password.'
          );
          break;

        case 'auth/too-many-requests':
          setFirebaseError(
            'Too many failed attempts. Please try again later.'
          );
          break;

        case 'auth/network-request-failed':
          setFirebaseError(
            'Network error. Please check your internet connection.'
          );
          break;

        default:
          setFirebaseError(
            'Unable to log in. Please try again.'
          );
      }
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * ============================================================
   * UI
   * ============================================================
   */

  return (
    <View
      style={[
        GlobalStyles.screenContainer,
        {
          justifyContent: 'center',
          alignItems: 'center',
        },
      ]}
    >
      <View
        style={[
          GlobalStyles.cardElevated,
          {
            width: '100%',
            maxWidth: 420,
          },
        ]}
      >
        <Text
          style={[
            GlobalStyles.brandTitle,
            {
              marginBottom: 8,
              color: Palette.crimson,
              fontSize: 24,
            },
          ]}
        >
          Log in
        </Text>

        <Text
          style={[
            GlobalStyles.bodyText,
            {
              marginBottom: 20,
              color: Palette.textSecondary,
            },
          ]}
        >
          Welcome back. Enter your details to continue.
        </Text>

        {/* EMAIL */}

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Email"
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          value={email}
          editable={!isLoading}
          onChangeText={(value) => {
            setEmail(value);

            if (emailError) {
              setEmailError('');
            }

            if (firebaseError) {
              setFirebaseError('');
            }
          }}
        />

        {emailError ? (
          <Text
            style={{
              color: Palette.crimson,
              marginTop: -8,
              marginBottom: 8,
            }}
          >
            {emailError}
          </Text>
        ) : null}

        {/* PASSWORD */}

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Password"
          secureTextEntry
          value={password}
          editable={!isLoading}
          onChangeText={(value) => {
            setPassword(value);

            if (passwordError) {
              setPasswordError('');
            }

            if (firebaseError) {
              setFirebaseError('');
            }
          }}
        />

        {passwordError ? (
          <Text
            style={{
              color: Palette.crimson,
              marginTop: -8,
              marginBottom: 8,
            }}
          >
            {passwordError}
          </Text>
        ) : null}

        {/* FIREBASE ERROR */}

        {firebaseError ? (
          <Text
            style={{
              color: Palette.crimson,
              marginBottom: 12,
              textAlign: 'center',
            }}
          >
            {firebaseError}
          </Text>
        ) : null}

        {/* LOGIN BUTTON */}

        <Pressable
          disabled={isLoading}
          style={[
            GlobalStyles.btnPrimary,
            {
              backgroundColor:
                Palette.crimson,
              opacity: isLoading
                ? 0.7
                : 1,
            },
          ]}
          onPress={handleLogin}
        >
          <Text
            style={
              GlobalStyles.btnPrimaryText
            }
          >
            {isLoading
              ? 'Logging in...'
              : 'Continue'}
          </Text>
        </Pressable>

        {/* BACK */}

        <Pressable
          disabled={isLoading}
          onPress={() =>
            router.back()
          }
        >
          <Text
            style={[
              GlobalStyles.bodyText,
              {
                textAlign: 'center',
                textDecorationLine:
                  'underline',
                marginTop: 12,
              },
            ]}
          >
            Back
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
