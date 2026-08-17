import { ScrollView, Text, View } from 'react-native';

import { Palette } from '@/constants/Styles';

export default function FuelTabScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Nutrition intelligence</Text>
      <Text style={styles.subtitle}>Luteal phase • Magnesium & carbs focus</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Craving decoder</Text>
        <View style={styles.chipRow}>
          {['Chocolate', 'Salty', 'Carbs', 'Sweet'].map((item) => (
            <View key={item} style={styles.chip}>
              <Text style={styles.chipText}>{item}</Text>
            </View>
          ))}
        </View>
        <View style={styles.insightBox}>
          <Text style={styles.insightTitle}>Biological driver</Text>
          <Text style={styles.insightText}>Progesterone can lower magnesium and destabilize blood sugar, so a small serving of dark chocolate with almonds is a gentle option.</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Food vision & ingredient scan</Text>
        <View style={styles.dropZone}>
          <Text style={styles.dropZoneText}>📷 Tap camera to log a meal</Text>
        </View>
        <View style={styles.buttonRow}>
          <View style={styles.smallButton}><Text style={styles.smallButtonText}>📷 Snap meal</Text></View>
          <View style={styles.smallButton}><Text style={styles.smallButtonText}>🥕 Scan fridge</Text></View>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Today’s phase-synced recipe</Text>
        <Text style={styles.recipeTitle}>Roasted sweet potato & salmon bowl</Text>
        <Text style={styles.bodyText}>High magnesium • Complex carbs • Prep time 20 mins</Text>
      </View>
    </ScrollView>
  );
}

const styles = {
  container: {
    flexGrow: 1,
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 40,
    backgroundColor: Palette.cream,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Palette.forestGreen,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    marginBottom: 16,
  },
  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    padding: 14,
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 10,
  },
  chip: {
    backgroundColor: Palette.surfaceOrangeMuted,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.orange,
  },
  insightBox: {
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    padding: 10,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },
  insightTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 4,
  },
  insightText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  dropZone: {
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Palette.borderMuted,
    borderRadius: 12,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    backgroundColor: Palette.surfaceSubtle,
  },
  dropZoneText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  smallButton: {
    flex: 1,
    backgroundColor: Palette.surfaceBlueMuted,
    borderRadius: 10,
    paddingVertical: 10,
    alignItems: 'center',
  },
  smallButtonText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.oceanBlue,
  },
  recipeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
};
