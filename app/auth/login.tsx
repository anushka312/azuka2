
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

import { auth } from '../../services/firebase';
import { useAuth } from '../../contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();

  const { signIn } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [firebaseError, setFirebaseError] = useState('');

  const [isLoading, setIsLoading] = useState(false);

  /*
   * ============================================================
   * EMAIL VALIDATION
   * ============================================================
   */

  const validateEmail = (value: string) => {
    return /\S+@\S+\.\S+/.test(value.trim());
  };

  /*
   * ============================================================
   * LOGIN
   * ============================================================
   */

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const hasValidEmail = validateEmail(trimmedEmail);
    const hasValidPassword = trimmedPassword.length >= 6;

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

    if (!hasValidEmail || !hasValidPassword) {
      return;
    }

    try {
      setIsLoading(true);

      /*
       * ========================================================
       * STEP 1
       * Authenticate with Firebase
       * ========================================================
       */

      const credential =
        await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          trimmedPassword
        );

      const firebaseUser = credential.user;

      /*
       * ========================================================
       * STEP 2
       * Update AuthContext
       *
       * AuthContext should determine whether the MongoDB
       * profile exists and update its authentication state.
       *
       * AuthRedirect in _layout.tsx should then decide:
       *
       * profileCompleted === false
       *      -> /auth/profile-setup
       *
       * profileCompleted === true
       *      -> /(tabs)
       * ========================================================
       */

      await signIn(
        firebaseUser.email ?? trimmedEmail,
        trimmedPassword
      );

      /*
       * DO NOT navigate here.
       *
       * AuthRedirect should handle navigation based on
       * AuthContext state.
       */

    } catch (error: any) {
      console.error('Login error:', error);
      console.error('Login error message:', error?.message);
      console.error('Login error code:', error?.code);

      /*
       * ========================================================
       * PROFILE DOES NOT EXIST
       * ========================================================
       *
       * This means Firebase authentication succeeded, but
       * the MongoDB user profile does not exist yet.
       *
       * If AuthContext has already updated its state,
       * AuthRedirect will send the user to ProfileSetup.
       *
       * We only stop the loading state here.
       */

      if (error?.message === 'PROFILE_NOT_COMPLETED') {
        console.log(
          'Firebase user exists, but MongoDB profile does not exist yet.'
        );

        setIsLoading(false);

        return;
      }

      /*
       * ========================================================
       * NORMAL FIREBASE ERROR
       * ========================================================
       */

      let message = 'Unable to log in. Please try again.';

      switch (error?.code) {
        case 'auth/invalid-credential':
        case 'auth/wrong-password':
        case 'auth/user-not-found':
          message = 'Incorrect email or password.';
          break;

        case 'auth/invalid-email':
          message = 'Please enter a valid email address.';
          break;

        case 'auth/user-disabled':
          message = 'This account has been disabled.';
          break;

        case 'auth/too-many-requests':
          message =
            'Too many login attempts. Please try again later.';
          break;

        default:
          message =
            error?.message ||
            'Unable to log in. Please try again.';
      }

      setFirebaseError(message);
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
              backgroundColor: Palette.crimson,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleLogin}
        >
          <Text style={GlobalStyles.btnPrimaryText}>
            {isLoading ? 'Logging in...' : 'Continue'}
          </Text>
        </Pressable>

        {/* BACK */}

        <Pressable
          disabled={isLoading}
          onPress={() => router.replace('/')}
        >
          <Text
            style={[
              GlobalStyles.bodyText,
              {
                textAlign: 'center',
                textDecorationLine: 'underline',
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