import AsyncStorage from '@react-native-async-storage/async-storage';
import {
    createContext,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from 'react';

import {
    createUserWithEmailAndPassword,
    signOut as firebaseSignOut,
    onAuthStateChanged,
    signInWithEmailAndPassword
} from 'firebase/auth';

import { auth } from '@/services/firebase';

import {
    createUserProfile,
    getUserProfileByEmail,
    type CreateUserProfile,
} from '@/services/api';

/* ============================================================
   TYPES
============================================================ */

export type AuthUser = {
  /*
   * IMPORTANT:
   * userId = MongoDB _id
   *
   * NEVER Firebase UID.
   */
  userId: string;
  name: string;
  email: string;
};

type PendingFirebaseUser = {
  email: string;
  name: string;
};

type AuthContextValue = {
  user: AuthUser | null;

  /*
   * Firebase authentication exists.
   *
   * This can be true even when MongoDB profile
   * has NOT been created yet.
   */
  isAuthenticated: boolean;

  /*
   * True once MongoDB profile has been created
   * and MongoDB _id has been stored.
   */
  profileCompleted: boolean;

  isLoading: boolean;

  /*
   * Creates ONLY the Firebase account.
   *
   * MongoDB profile is created later by ProfileSetup.
   */
  signUp: (
    name: string,
    email: string,
    password: string
  ) => Promise<void>;

  /*
   * Existing-user login.
   *
   * Firebase authenticates first.
   * Then MongoDB profile is fetched by email.
   */
  signIn: (
    email: string,
    password: string
  ) => Promise<void>;

  /*
   * Called ONLY by ProfileSetup.
   *
   * Creates MongoDB profile and stores MongoDB _id.
   */
  completeProfile: (
    profile: CreateUserProfile
  ) => Promise<string>;

  signOut: () => Promise<void>;
};

/* ============================================================
   CONTEXT
============================================================ */

const AuthContext =
  createContext<AuthContextValue | undefined>(
    undefined
  );

/* ============================================================
   STORAGE KEYS
============================================================ */

const AUTH_USER_KEY = 'auth_user';

const PENDING_FIREBASE_USER_KEY =
  'pending_firebase_user';

/* ============================================================
   PROVIDER
============================================================ */

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [pendingFirebaseUser, setPendingFirebaseUser] =
    useState<PendingFirebaseUser | null>(null);

  const [isLoading, setIsLoading] =
    useState(true);

  /* ==========================================================
     RESTORE APPLICATION STATE
  ========================================================== */

  useEffect(() => {
    const restoreAuthState = async () => {
      try {
        console.log(
          'AUTH: restoring application state...'
        );

        const [
          storedUser,
          storedPendingUser,
        ] = await Promise.all([
          AsyncStorage.getItem(
            AUTH_USER_KEY
          ),
          AsyncStorage.getItem(
            PENDING_FIREBASE_USER_KEY
          ),
        ]);

        if (storedUser) {
          try {
            const parsedUser: AuthUser =
              JSON.parse(storedUser);

            if (
              parsedUser?.userId &&
              parsedUser?.email
            ) {
              console.log(
                'AUTH: restored MongoDB user:',
                parsedUser.userId
              );

              setUser(parsedUser);
            }
          } catch (error) {
            console.error(
              'AUTH: invalid stored auth user:',
              error
            );

            await AsyncStorage.removeItem(
              AUTH_USER_KEY
            );
          }
        }

        if (storedPendingUser) {
          try {
            const parsedPendingUser: PendingFirebaseUser =
              JSON.parse(storedPendingUser);

            if (parsedPendingUser?.email) {
              console.log(
                'AUTH: restored pending Firebase user:',
                parsedPendingUser.email
              );

              setPendingFirebaseUser(
                parsedPendingUser
              );
            }
          } catch (error) {
            console.error(
              'AUTH: invalid pending Firebase user:',
              error
            );

            await AsyncStorage.removeItem(
              PENDING_FIREBASE_USER_KEY
            );
          }
        }
      } catch (error) {
        console.error(
          'AUTH: restore failed:',
          error
        );
      }
    };

    restoreAuthState();
  }, []);

  /* ==========================================================
     LISTEN TO FIREBASE AUTH
  ========================================================== */

  useEffect(() => {
    const unsubscribe =
      onAuthStateChanged(
        auth,
        async (firebaseUser) => {
          console.log(
            'AUTH: Firebase auth state:',
            firebaseUser?.email ?? null
          );

          /*
           * DO NOT automatically create/fetch MongoDB
           * profiles here.
           *
           * Firebase auth and MongoDB profile are
           * deliberately separate.
           */

          if (!firebaseUser) {
            /*
             * Firebase is logged out.
             *
             * Clear application-level MongoDB user too.
             */
            setUser(null);

            await AsyncStorage.removeItem(
              AUTH_USER_KEY
            );
          }

          setIsLoading(false);
        }
      );

    return unsubscribe;
  }, []);

  /* ==========================================================
     SAVE MONGODB USER
  ========================================================== */

  const saveUser = async (
    authUser: AuthUser
  ) => {
    console.log(
      'AUTH: saving MongoDB application user:',
      authUser
    );

    setUser(authUser);

    await AsyncStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(authUser)
    );
  };

  /* ==========================================================
     SIGN UP
  ========================================================== */

  const signUp = async (
    name: string,
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const trimmedName = name.trim();
      const trimmedEmail =
        email.trim().toLowerCase();

      console.log(
        'AUTH: starting Firebase signup:',
        trimmedEmail
      );

      /*
       * ------------------------------------------------------
       * STEP 1
       *
       * Create Firebase account ONLY.
       * ------------------------------------------------------
       */

      const credential =
        await createUserWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );

      const firebaseUser =
        credential.user;

      console.log(
        'AUTH: Firebase account created'
      );

      console.log(
        'AUTH: Firebase UID:',
        firebaseUser.uid
      );

      /*
       * ------------------------------------------------------
       * STEP 2
       *
       * Store temporary signup information.
       *
       * MongoDB profile does NOT exist yet.
       * ------------------------------------------------------
       */

      const pendingUser: PendingFirebaseUser = {
        name: trimmedName,
        email: trimmedEmail,
      };

      setPendingFirebaseUser(
        pendingUser
      );

      await AsyncStorage.setItem(
        PENDING_FIREBASE_USER_KEY,
        JSON.stringify(pendingUser)
      );

      /*
       * IMPORTANT:
       *
       * DO NOT call createUserProfile() here.
       *
       * ProfileSetup will do that.
       */

      console.log(
        'AUTH: Firebase signup complete.'
      );

      console.log(
        'AUTH: waiting for ProfileSetup.'
      );
    } catch (error) {
      console.error(
        'AUTH: signup failed:',
        error
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     COMPLETE PROFILE
  ========================================================== */

  const completeProfile = async (
    profile: CreateUserProfile
  ): Promise<string> => {
    try {
      setIsLoading(true);

      /*
       * ------------------------------------------------------
       * Verify Firebase user
       * ------------------------------------------------------
       */

      const firebaseUser =
        auth.currentUser;

      if (!firebaseUser) {
        throw new Error(
          'No Firebase user is currently authenticated.'
        );
      }

      /*
       * Use Firebase's authenticated email.
       *
       * We do NOT use Firebase UID as MongoDB ID.
       */

      const authenticatedEmail =
        firebaseUser.email;

      if (!authenticatedEmail) {
        throw new Error(
          'Authenticated Firebase user does not have an email.'
        );
      }

      /*
       * ------------------------------------------------------
       * Safety check
       *
       * The profile email coming from the form must match
       * the authenticated Firebase email.
       * ------------------------------------------------------
       */

      const normalizedFirebaseEmail =
        authenticatedEmail
          .trim()
          .toLowerCase();

      const normalizedProfileEmail =
        profile.email
          .trim()
          .toLowerCase();

      if (
        normalizedFirebaseEmail !==
        normalizedProfileEmail
      ) {
        throw new Error(
          'Profile email does not match the authenticated Firebase account.'
        );
      }

      console.log(
        'AUTH: completing MongoDB profile'
      );

      console.log(
        'AUTH: authenticated email:',
        normalizedFirebaseEmail
      );

      /*
       * ------------------------------------------------------
       * CREATE MONGODB PROFILE
       *
       * THIS is the ONLY place where a new profile
       * is created during signup.
       * ------------------------------------------------------
       */

      console.log(
        'AUTH: calling createUserProfile()'
      );

      console.log(
        'AUTH: starting createUserProfile request...'
      );
      
      const createProfileTimeoutId = setTimeout(() => {
        console.error('AUTH: createUserProfile TIMEOUT - request did not complete in 30 seconds');
      }, 30000);

      let response;
      try {
        response =
          await createUserProfile({
            ...profile,
            email:
              normalizedFirebaseEmail,
          });
        clearTimeout(createProfileTimeoutId);
      } catch (err) {
        clearTimeout(createProfileTimeoutId);
        console.error('AUTH: createUserProfile threw error:', err);
        throw err;
      }

      console.log(
        'AUTH: createUserProfile response:',
        response
      );

      const mongoUserId =
        response?.user_id;

      if (!mongoUserId) {
        throw new Error(
          'MongoDB user ID was not returned by the backend.'
        );
      }

      console.log(
        'AUTH: MongoDB profile created.'
      );

      console.log(
        'AUTH: MongoDB user ID:',
        mongoUserId
      );

      /*
       * ------------------------------------------------------
       * NOW create application-level authenticated user.
       *
       * userId = MongoDB _id
       * ------------------------------------------------------
       */

      const authUser: AuthUser = {
        userId: mongoUserId,
        name: profile.name,
        email: normalizedFirebaseEmail,
      };

      await saveUser(authUser);

      /*
       * Signup/profile setup is now complete.
       */

      setPendingFirebaseUser(null);

      await AsyncStorage.removeItem(
        PENDING_FIREBASE_USER_KEY
      );

      console.log(
        'AUTH: PROFILE COMPLETE'
      );

      console.log(
        'AUTH: MongoDB ID:',
        mongoUserId
      );

      return mongoUserId;
    } catch (error) {
      console.error(
        'AUTH: completeProfile failed:',
        error
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     SIGN IN
  ========================================================== */

  const signIn = async (
    email: string,
    password: string
  ): Promise<void> => {
    try {
      setIsLoading(true);

      const trimmedEmail =
        email.trim().toLowerCase();

      console.log(
        'AUTH: signing in:',
        trimmedEmail
      );

      /*
       * ------------------------------------------------------
       * STEP 1
       *
       * Authenticate with Firebase.
       * ------------------------------------------------------
       */

      const credential =
        await signInWithEmailAndPassword(
          auth,
          trimmedEmail,
          password
        );

      const firebaseUser =
        credential.user;

      const authenticatedEmail =
        firebaseUser.email;

      if (!authenticatedEmail) {
        throw new Error(
          'Firebase account does not have an email address.'
        );
      }

      console.log(
        'AUTH: Firebase login successful'
      );

      console.log(
        'AUTH: Firebase UID:',
        firebaseUser.uid
      );

      /*
       * ------------------------------------------------------
       * STEP 2
       *
       * Find MongoDB profile using EMAIL.
       *
       * This is ONLY for existing users.
       * ------------------------------------------------------
       */

      const mongoUser =
        await getUserProfileByEmail(
          authenticatedEmail
        );

      if (!mongoUser?._id) {
        /*
         * Firebase account exists but MongoDB profile
         * doesn't.
         *
         * This should be treated as incomplete signup,
         * NOT as a new profile creation here.
         */

        console.log(
          'AUTH: Firebase user exists but MongoDB profile does not.'
        );

        await AsyncStorage.setItem(
          PENDING_FIREBASE_USER_KEY,
          JSON.stringify({
            name:
              mongoUser?.name ??
              '',
            email:
              authenticatedEmail,
          })
        );

        throw new Error(
          'PROFILE_NOT_COMPLETED'
        );
      }

      /*
       * ------------------------------------------------------
       * STEP 3
       *
       * MongoDB _id becomes application userId.
       * ------------------------------------------------------
       */

      const authUser: AuthUser = {
        userId: mongoUser._id,
        name: mongoUser.name,
        email: mongoUser.email,
      };

      /*
       * ------------------------------------------------------
       * STEP 4
       *
       * Save in React state + AsyncStorage.
       * ------------------------------------------------------
       */

      await saveUser(authUser);

      console.log(
        'AUTH: EXISTING USER LOGIN COMPLETE'
      );

      console.log(
        'AUTH: MongoDB ID:',
        mongoUser._id
      );
    } catch (error) {
      console.error(
        'AUTH: sign in failed:',
        error
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     SIGN OUT
  ========================================================== */

  const signOut = async () => {
    try {
      setIsLoading(true);

      await firebaseSignOut(auth);

      await AsyncStorage.multiRemove([
        AUTH_USER_KEY,
        PENDING_FIREBASE_USER_KEY,
      ]);

      setUser(null);
      setPendingFirebaseUser(null);

      console.log(
        'AUTH: signed out completely'
      );
    } catch (error) {
      console.error(
        'AUTH: sign out failed:',
        error
      );

      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  /* ==========================================================
     CONTEXT VALUE
  ========================================================== */

  const value = useMemo<AuthContextValue>(
    () => ({
      user,

      /*
       * We consider the APPLICATION authenticated
       * only after MongoDB ID exists.
       *
       * This is important because Azuka needs MongoDB ID.
       */
      isAuthenticated:
        user !== null,

      profileCompleted:
        user !== null &&
        !!user.userId,

      isLoading,

      signUp,
      signIn,
      completeProfile,
      signOut,
    }),
    [
      user,
      isLoading,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/* ============================================================
   HOOK
============================================================ */

export function useAuth() {
  const context =
    useContext(AuthContext);

  if (!context) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return context;
}