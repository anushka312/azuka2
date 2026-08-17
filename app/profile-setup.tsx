import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { Pressable, Text, TextInput, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSetupScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ name?: string; email?: string }>();
  const { signIn } = useAuth();
  const [name, setName] = useState((params.name as string) || '');
  const [email, setEmail] = useState((params.email as string) || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!name && params.name) {
      setName(params.name as string);
    }
    if (!email && params.email) {
      setEmail(params.email as string);
    }
  }, [email, name, params.email, params.name]);

  const handleContinue = async () => {
    if (!name.trim() || !email.trim()) {
      return;
    }

    setIsSubmitting(true);
    await signIn(email, name);
    router.replace('/home');
  };

  return (
    <View style={[GlobalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View style={[GlobalStyles.cardElevated, { width: '100%', maxWidth: 420 }]}> 
        <Text style={[GlobalStyles.brandTitle, { marginBottom: 8, color: Palette.forestGreen, fontSize: 24 }]}>Almost there</Text>
        <Text style={[GlobalStyles.bodyText, { marginBottom: 20, color: Palette.textSecondary }]}>We’ll finish setting up your account and open the main app.</Text>

        <TextInput style={GlobalStyles.inputField} placeholder="Your name" value={name} onChangeText={setName} />
        <TextInput style={GlobalStyles.inputField} placeholder="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />

        <Pressable style={[GlobalStyles.btnPrimary, { backgroundColor: Palette.forestGreen }]} onPress={handleContinue} disabled={isSubmitting}>
          <Text style={GlobalStyles.btnPrimaryText}>{isSubmitting ? 'Finishing setup...' : 'Continue'}</Text>
        </Pressable>
      </View>
    </View>
  );
}
