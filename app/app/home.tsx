import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';

export default function HomeScreen() {
  const router = useRouter();

  return (
    <View style={[GlobalStyles.screenContainer, { justifyContent: 'center', alignItems: 'center' }]}> 
      <View > 

        <Text style={[GlobalStyles.brandTitle, { marginBottom: 10 }]}>Welcome back!</Text>
        <Text style={[GlobalStyles.bodyText, { color: Palette.textSecondary, marginBottom: 24 }]}>This is your basic app home screen after login or sign-up.</Text>

        <Pressable style={GlobalStyles.btnPrimary} onPress={() => router.replace('/')}>
          <Text style={GlobalStyles.btnPrimaryText}>Go to start</Text>
        </Pressable>
      </View>
    </View>
  );
}
