import { useRouter } from 'expo-router';
import { useEffect } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { useAuth } from '@/contexts/AuthContext';

export default function WelcomeScreen() {
  const router = useRouter();

  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.replace('/(tabs)/home');
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
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
        <Text
          style={[
            GlobalStyles.headingMedium,
            {
              color: Palette.oceanBlue,
            },
          ]}
        >
          Loading your space...
        </Text>
      </View>
    );
  }

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
      <View>
        <Text
          style={[
            GlobalStyles.headingMedium,
            {
              color: Palette.textSecondary,
              marginBottom: 5,
            },
          ]}
        >
          Your next step starts here.
        </Text>

        <Text
          style={[
            GlobalStyles.brandTitle,
            {
              marginBottom: 30,
              textAlign: 'center',
              fontSize: 42,
              color: Palette.skyBlue,
            },
          ]}
        >
          Azuka
        </Text>

        <Pressable
          style={[
            GlobalStyles.btnPrimary,
            {
              backgroundColor: Palette.marigold,
            },
          ]}
          onPress={() => router.push('/auth/signup')}
        >
          <Text style={GlobalStyles.btnPrimaryText}>
            Get Started
          </Text>
        </Pressable>

        <View style={{ marginTop: 2 }}>
          <Text
            style={[
              GlobalStyles.bodyText,
              {
                textAlign: 'center',
              },
            ]}
          >
            Already have an account?{' '}

            <Text
              style={styles.loginLink}
              onPress={() => router.push('/auth/login')}
            >
              Log in
            </Text>
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  loginLink: {
    color: Palette.oceanBlue,
    fontWeight: '700',
    textDecorationLine: 'underline',
  },
});