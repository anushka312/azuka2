import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { useAuth } from '@/contexts/AuthContext';

export default function LoginScreen() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const handleLogin = async () => {
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();
    const hasValidEmail = validateEmail(trimmedEmail);
    const hasValidPassword = trimmedPassword.length >= 6;

    setEmailError(hasValidEmail ? '' : 'Please enter a valid email address.');
    setPasswordError(hasValidPassword ? '' : 'Password should be at least 6 characters.');

    if (hasValidEmail && hasValidPassword) {
      await signIn(trimmedEmail);
      router.replace('/home');
    }
  };

  return (
    <View style={[GlobalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View style={[GlobalStyles.cardElevated, { width: '100%', maxWidth: 420 }]}> 
        <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.crimson, fontSize: 24 }]}>Log in</Text>
        <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>Welcome back. Enter your details to continue.</Text>

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Email"
          autoCapitalize="none"
          keyboardType="email-address"
          value={email}
          onChangeText={(value) => {
            setEmail(value);
            if (emailError) setEmailError('');
          }}
        />
        {emailError ? <Text style={{ color: Palette.crimson, marginTop: -8, marginBottom: 8 }}>{emailError}</Text> : null}

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={(value) => {
            setPassword(value);
            if (passwordError) setPasswordError('');
          }}
        />
        {passwordError ? <Text style={{ color: Palette.crimson, marginTop: -8, marginBottom: 8 }}>{passwordError}</Text> : null}

        <Pressable style={[GlobalStyles.btnPrimary, {backgroundColor: Palette.crimson}]} onPress={handleLogin}>
          <Text style={GlobalStyles.btnPrimaryText}>Continue</Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={[GlobalStyles.bodyText, { textAlign: 'center', textDecorationLine: 'underline', textDecorationStyle: 'solid'  }]}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
