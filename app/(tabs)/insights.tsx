import { ScrollView, Text, View } from 'react-native';

import { Palette } from '@/constants/Styles';

export default function InsightsTabScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.title}>Mindset & trends</Text>
      <Text style={styles.subtitle}>Self-efficacy without guilt</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Adherence metric</Text>
        <Text style={styles.metricValue}>85% monthly adherence</Text>
        <Text style={styles.bodyText}>5 recovery days were auto-adjusted for biology, and consistency stayed intact.</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Energy vs. phase</Text>
        <View style={styles.chartBox}>
          <Text style={styles.chartText}>Energy curve • Luteal drop reflected gently</Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Physiology education</Text>
        <Text style={styles.bodyText}>• Why performance fluctuates during the Luteal phase</Text>
        <Text style={styles.bodyText}>• Reframing missed workouts as stress signals rather than failure</Text>
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
    color: Palette.crimson,
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
  metricValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.oceanBlue,
    marginBottom: 6,
  },
  bodyText: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
  },
  chartBox: {
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    minHeight: 90,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },
  chartText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
};
