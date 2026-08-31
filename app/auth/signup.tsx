
import { useRouter } from 'expo-router';

import { useState } from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createUserWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';

import {
  GlobalStyles,
  Palette,
} from '@/constants/Styles';

import { auth } from '@/services/firebase';

import { useAuth } from '@/contexts/AuthContext';

export default function SignupScreen() {
  const router = useRouter();

  const { signIn } = useAuth();

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [password, setPassword] =
    useState('');

  const [nameError, setNameError] =
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
   * SIGN UP
   * ============================================================
   */

  const handleSignup = async () => {
    const trimmedName =
      name.trim();

    const trimmedEmail =
      email.trim();

    const trimmedPassword =
      password.trim();

    const hasValidName =
      trimmedName.length >= 2;

    const hasValidEmail =
      validateEmail(trimmedEmail);

    const hasValidPassword =
      trimmedPassword.length >= 6;

    /*
     * Validation errors
     */

    setNameError(
      hasValidName
        ? ''
        : 'Please enter your name.'
    );

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
      !hasValidName ||
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
       *
       * Create Firebase account.
       *
       * Firebase automatically signs the user in
       * after successful account creation.
       * ========================================================
       */

      const userCredential =
        await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          trimmedPassword
        );

      const firebaseUser =
        userCredential.user;

      /*
       * ========================================================
       * STEP 2
       *
       * Save the user's name in Firebase.
       * ========================================================
       */

      await updateProfile(
        firebaseUser,
        {
          displayName: trimmedName,
        }
      );

      /*
       * ========================================================
       * STEP 3
       *
       * Tell AuthContext that this user is authenticated.
       *
       * IMPORTANT:
       *
       * We do NOT mark profileCompleted as true.
       *
       * This is a brand-new account, so onboarding
       * still needs to happen.
       *
       * AuthContext's signIn() will see that there is
       * no profile-completed flag for this Firebase UID
       * and therefore set:
       *
       * profileCompleted = false
       * ========================================================
       */

      await signIn(
        firebaseUser.uid,
        trimmedName,
        firebaseUser.email ??
          trimmedEmail
      );

      /*
       * ========================================================
       * STEP 4
       *
       * Navigate to profile setup.
       *
       * We can do this directly because signup ALWAYS
       * creates a brand-new account that hasn't completed
       * onboarding yet.
       * ========================================================
       */

      router.replace(
        '/auth/profile-setup'
      );

    } catch (error: any) {
      console.error(
        'Signup error:',
        error
      );

      switch (error.code) {
        case 'auth/email-already-in-use':
          setFirebaseError(
            'An account with this email already exists.'
          );
          break;

        case 'auth/invalid-email':
          setFirebaseError(
            'Please enter a valid email address.'
          );
          break;

        case 'auth/weak-password':
          setFirebaseError(
            'Password is too weak. Please choose a stronger password.'
          );
          break;

        case 'auth/network-request-failed':
          setFirebaseError(
            'Network error. Please check your internet connection.'
          );
          break;

        default:
          setFirebaseError(
            'Unable to create your account. Please try again.'
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
              color: Palette.forestGreen,
              fontSize: 24,
            },
          ]}
        >
          Create account
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
          Set up your account to get started.
        </Text>

        {/* NAME */}

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Name"
          value={name}
          editable={!isLoading}
          onChangeText={(value) => {
            setName(value);

            if (nameError) {
              setNameError('');
            }

            if (firebaseError) {
              setFirebaseError('');
            }
          }}
        />

        {nameError ? (
          <Text
            style={{
              color: Palette.crimson,
              marginTop: -8,
              marginBottom: 8,
            }}
          >
            {nameError}
          </Text>
        ) : null}

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

        {/* SIGN UP BUTTON */}

        <Pressable
          disabled={isLoading}
          style={[
            GlobalStyles.btnPrimary,
            {
              backgroundColor:
                Palette.forestGreen,
              opacity: isLoading
                ? 0.7
                : 1,
            },
          ]}
          onPress={handleSignup}
        >
          <Text
            style={
              GlobalStyles.btnPrimaryText
            }
          >
            {isLoading
              ? 'Creating account...'
              : 'Sign up'}
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
