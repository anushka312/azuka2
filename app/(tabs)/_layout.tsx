
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';
import { Palette } from '@/constants/Styles';

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,

        // Bottom tab bar
        tabBarActiveTintColor: Palette.skyBlue,
        tabBarInactiveTintColor: Palette.textSecondary,

        tabBarStyle: {
          backgroundColor: Palette.surfaceWhite,
          borderTopColor: Palette.borderMuted,
          height: 96,
          paddingTop: 2,
          paddingBottom: 8,
        },

        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },

        // Icons
        tabBarIcon: ({ color, size }) => {
          const iconMap: Record<
            string,
            keyof typeof Ionicons.glyphMap
          > = {
            home: 'home-outline',
            cycle: 'calendar-outline',
            workout: 'barbell-outline',
            fuel: 'nutrition-outline',
            insights: 'analytics-outline',
          };

          const iconName =
            iconMap[route.name] ?? 'ellipse-outline';

          return (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
            />
          );
        },
      })}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
        }}
      />

      <Tabs.Screen
        name="cycle"
        options={{
          title: 'Cycle',
        }}
      />

      <Tabs.Screen
        name="workout"
        options={{
          title: 'Workout',
        }}
      />

      <Tabs.Screen
        name="fuel"
        options={{
          title: 'Fuel',
        }}
      />

      <Tabs.Screen
        name="insights"
        options={{
          title: 'Insights',
        }}
      />
    </Tabs>
  );
}
