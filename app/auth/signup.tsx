import { useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [nameError, setNameError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  const validateEmail = (value: string) => /\S+@\S+\.\S+/.test(value.trim());

  const handleSignup = () => {
    const trimmedName = name.trim();
    const trimmedEmail = email.trim();
    const trimmedPassword = password.trim();

    const hasValidName = trimmedName.length >= 2;
    const hasValidEmail = validateEmail(trimmedEmail);
    const hasValidPassword = trimmedPassword.length >= 6;

    setNameError(hasValidName ? '' : 'Please enter your name.');
    setEmailError(hasValidEmail ? '' : 'Please enter a valid email address.');
    setPasswordError(hasValidPassword ? '' : 'Password should be at least 6 characters.');

    if (hasValidName && hasValidEmail && hasValidPassword) {
      router.replace({ pathname: '/profile-setup', params: { name: trimmedName, email: trimmedEmail } });
    }
  };

  return (
    <View style={[GlobalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View style={[GlobalStyles.cardElevated, { width: '100%', maxWidth: 420 }]}> 
        <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.forestGreen, fontSize: 24 }]}>Create account</Text>
        <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>Set up your account to get started.</Text>

        <TextInput
          style={GlobalStyles.inputField}
          placeholder="Name"
          value={name}
          onChangeText={(value) => {
            setName(value);
            if (nameError) setNameError('');
          }}
        />
        {nameError ? <Text style={{ color: Palette.crimson, marginTop: -8, marginBottom: 8 }}>{nameError}</Text> : null}

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

        <Pressable style={[GlobalStyles.btnPrimary, {backgroundColor: Palette.forestGreen}]} onPress={handleSignup}>
          <Text style={GlobalStyles.btnPrimaryText}>Sign up</Text>
        </Pressable>

        <Pressable onPress={() => router.back()}>
          <Text style={[GlobalStyles.bodyText, { textAlign: 'center', textDecorationLine: 'underline', textDecorationStyle: 'solid'}]}>Back</Text>
        </Pressable>
      </View>
    </View>
  );
}
