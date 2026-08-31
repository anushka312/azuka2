
import AsyncStorage from '@react-native-async-storage/async-storage';

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

type AuthUser = {
  userId: string;
  mongoId: string;
  name: string;
  email: string;
};

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  profileCompleted: boolean;

  signIn: (
    userId: string,
    name: string,
    email: string
  ) => Promise<void>;

  signOut: () => Promise<void>;

  completeProfile: () => Promise<void>;
};

const AuthContext =
  createContext<AuthContextValue | undefined>(undefined);

const AUTH_USER_KEY = '@azuka_auth_user';

const getProfileCompletedKey = (userId: string) =>
  `@azuka_profile_completed_${userId}`;

export function AuthProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [user, setUser] =
    useState<AuthUser | null>(null);

  const [profileCompleted, setProfileCompleted] =
    useState(false);

  const [isLoading, setIsLoading] =
    useState(true);

  /*
   * ============================================================
   * RESTORE LOCAL AUTH SESSION
   * ============================================================
   */

  useEffect(() => {
    const restoreAuth = async () => {
      try {
        const storedUser =
          await AsyncStorage.getItem(
            AUTH_USER_KEY
          );

        if (!storedUser) {
          setUser(null);
          setProfileCompleted(false);
          return;
        }

        const parsedUser: AuthUser =
          JSON.parse(storedUser);

        setUser(parsedUser);

        /*
         * Profile completion is stored separately
         * for each user.
         */
        const profileKey =
          getProfileCompletedKey(
            parsedUser.userId
          );

        const storedProfileCompleted =
          await AsyncStorage.getItem(
            profileKey
          );

        setProfileCompleted(
          storedProfileCompleted === 'true'
        );
      } catch (error) {
        console.error(
          'Failed to restore auth:',
          error
        );

        setUser(null);
        setProfileCompleted(false);
      } finally {
        setIsLoading(false);
      }
    };

    restoreAuth();
  }, []);

  /*
   * ============================================================
   * SIGN IN
   * ============================================================
   */

  const signIn = async (
    userId: string,
    name: string,
    email: string
  ) => {
    const authUser: AuthUser = {
      userId,
      name,
      email,
    };

    /*
     * Store the authenticated user.
     */
    setUser(authUser);

    await AsyncStorage.setItem(
      AUTH_USER_KEY,
      JSON.stringify(authUser)
    );

    /*
     * Read THIS USER'S onboarding status.
     *
     * If the key does not exist, this becomes false.
     *
     * Therefore:
     *
     * existing user + onboarding incomplete
     *     -> false
     *     -> profile setup
     *
     * existing user + onboarding complete
     *     -> true
     *     -> tabs
     */
    const profileKey =
      getProfileCompletedKey(userId);

    const storedProfileCompleted =
      await AsyncStorage.getItem(
        profileKey
      );

    const completed =
      storedProfileCompleted === 'true';

    setProfileCompleted(completed);
  };

  /*
   * ============================================================
   * COMPLETE PROFILE
   * ============================================================
   *
   * Call this AFTER profile setup has successfully
   * been saved to your backend.
   */

  const completeProfile = async () => {
    if (!user) {
      throw new Error(
        'Cannot complete profile: user is not authenticated.'
      );
    }

    const profileKey =
      getProfileCompletedKey(
        user.userId
      );

    await AsyncStorage.setItem(
      profileKey,
      'true'
    );

    setProfileCompleted(true);
  };

  /*
   * ============================================================
   * SIGN OUT
   * ============================================================
   */

  const signOut = async () => {
    /*
     * Remove the current authentication session.
     *
     * We intentionally DO NOT remove the user's
     * profile completion key.
     */
    setUser(null);
    setProfileCompleted(false);

    await AsyncStorage.removeItem(
      AUTH_USER_KEY
    );
  };

  /*
   * ============================================================
   * CONTEXT VALUE
   * ============================================================
   */

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      profileCompleted,
      signIn,
      signOut,
      completeProfile,
    }),
    [
      user,
      isLoading,
      profileCompleted,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

/*
 * ============================================================
 * HOOK
 * ============================================================
 */

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
