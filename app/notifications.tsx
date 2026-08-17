import { useRouter } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';

export default function NotificationsScreen() {
  const router = useRouter();

  return (
    <View style={[GlobalStyles.screenContainer, { paddingTop: 30 }]}> 
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <Text style={[GlobalStyles.headingMedium, { color: Palette.oceanBlue }]}>Notifications</Text>
        <Pressable onPress={() => router.back()}>
          <Text style={[GlobalStyles.bodyText, { color: Palette.oceanBlue, fontWeight: '700' }]}>Back</Text>
        </Pressable>
      </View>

      <View style={[GlobalStyles.cardElevated]}> 
        <Text style={[GlobalStyles.headingMedium, { color: Palette.forestGreen }]}>3 new updates</Text>
        <Text style={[GlobalStyles.bodyText, { marginTop: 8 }]}>Your workout plan was adjusted for today.</Text>
      </View>

      <View style={[GlobalStyles.cardOutlined]}> 
        <Text style={[GlobalStyles.headingMedium, { color: Palette.marigold }]}>Reminder</Text>
        <Text style={[GlobalStyles.bodyText, { marginTop: 8 }]}>A recovery task is due in 30 minutes.</Text>
      </View>
    </View>
  );
}
