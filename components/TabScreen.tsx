import { ReactNode } from 'react';
import { View, Text } from 'react-native';

import { GlobalStyles, Palette } from '@/constants/Styles';

type TabScreenProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function TabScreen({ title, subtitle, children }: TabScreenProps) {
  return (
    <View style={[GlobalStyles.screenContainer, { paddingTop: 24, paddingBottom: 24 }]}> 
      <View style={{ marginBottom: 18 }}>
        <Text style={[GlobalStyles.headingMedium, { color: Palette.oceanBlue }]}>{title}</Text>
        {subtitle ? <Text style={[GlobalStyles.bodyText, { color: Palette.textSecondary, marginTop: 4 }]}>{subtitle}</Text> : null}
      </View>
      {children}
    </View>
  );
}
