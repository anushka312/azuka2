
import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';

import {
  createUserWithEmailAndPassword,
} from 'firebase/auth';

import {
  GlobalStyles,
  Palette,
} from '@/constants/Styles';

import { auth } from '@/services/firebase';

export default function SignupScreen() {
  const router = useRouter();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [nameError, setNameError] = useState('');
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
   * SIGN UP
   * ============================================================
   */

  const handleSignup = async () => {
    // Clear previous errors
    setNameError('');
    setEmailError('');
    setPasswordError('');
    setFirebaseError('');

    const trimmedName = name.trim();
    const trimmedEmail = email.trim();

    /*
     * ----------------------------------------------------------
     * CLIENT-SIDE VALIDATION
     * ----------------------------------------------------------
     */

    if (!trimmedName) {
      setNameError('Please enter your name.');
      return;
    }

    if (!trimmedEmail) {
      setEmailError('Please enter your email.');
      return;
    }

    if (!validateEmail(trimmedEmail)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!password) {
      setPasswordError('Please enter a password.');
      return;
    }

    if (password.length < 6) {
      setPasswordError(
        'Password must be at least 6 characters.'
      );
      return;
    }

    if (!confirmPassword) {
      setPasswordError(
        'Please confirm your password.'
      );
      return;
    }

    if (password !== confirmPassword) {
      setPasswordError(
        'Passwords do not match.'
      );
      return;
    }

    /*
     * ----------------------------------------------------------
     * CREATE FIREBASE AUTH ACCOUNT
     *
     * IMPORTANT:
     * We do NOT use the Firebase UID here.
     *
     * Email is passed to profile setup.
     *
     * MongoDB profile creation happens separately during
     * profile setup.
     * ----------------------------------------------------------
     */

    try {
      setIsLoading(true);

      await createUserWithEmailAndPassword(
        auth,
        trimmedEmail,
        password
      );

      /*
       * Firebase authentication account now exists.
       *
       * We intentionally do NOT:
       *
       * - send Firebase UID to MongoDB
       * - create MongoDB profile here
       * - use Firebase UID as userId
       *
       * The next screen will collect the remaining profile
       * information and create the MongoDB user using email.
       */
      console.log(trimmedEmail, trimmedName);
      
      router.replace({
        pathname: '/auth/profile-setup',
        params: {
          email: trimmedEmail,
          name: trimmedName,
        },
      });
    } catch (error: any) {
      console.error('Signup error:', error);

      let message =
        'Something went wrong while creating your account.';

      if (
        error?.code === 'auth/email-already-in-use'
      ) {
        message =
          'An account with this email already exists.';
      } else if (
        error?.code === 'auth/invalid-email'
      ) {
        message =
          'Please enter a valid email address.';
      } else if (
        error?.code === 'auth/weak-password'
      ) {
        message =
          'Your password is too weak. Use at least 6 characters.';
      } else if (
        error?.code === 'auth/network-request-failed'
      ) {
        message =
          'Network error. Please check your internet connection and try again.';
      }

      setFirebaseError(message);

      Alert.alert(
        'Signup failed',
        message
      );
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
          autoCapitalize="words"
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

        {/* CONFIRM PASSWORD */}

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Confirm password"
          secureTextEntry
          value={confirmPassword}
          editable={!isLoading}
          onChangeText={(value) => {
            setConfirmPassword(value);

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
              backgroundColor: Palette.forestGreen,
              opacity: isLoading ? 0.7 : 1,
            },
          ]}
          onPress={handleSignup}
        >
          <Text
            style={GlobalStyles.btnPrimaryText}
          >
            {isLoading
              ? 'Creating account...'
              : 'Sign up'}
          </Text>
        </Pressable>

        {/* BACK */}

        <Pressable
          disabled={isLoading}
          onPress={() => router.back()}
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

