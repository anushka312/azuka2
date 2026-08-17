import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/Styles';

export const styles = StyleSheet.create({

  /* =========================
     SCREEN
  ========================== */

  container: {
    paddingTop: 0,
    paddingBottom: 60,
  },

  header: {
    marginBottom: 20,
  },

  subtitle: {
    marginTop: 4,
    fontSize: 14,
    color: Palette.textSecondary,
  },

  /* =========================
     TABS
  ========================== */

  tabs: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 18,
  },

  tabButton: {
    flex: 1,
    minHeight: 40,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingHorizontal: 10,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.45)',
  },

  tabButtonActive: {
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textSecondary,
  },

  tabTextActive: {
    color: Palette.oceanBlue,
    fontWeight: '700',
  },

  /* =========================
     TODAY - READINESS
  ========================== */

  readinessHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },

  recoveryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  recoveryIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: Palette.surfaceOrangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  recoveryTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  phaseText: {
    marginTop: 3,
    fontSize: 13,
    color: Palette.textSecondary,
  },

  readiness: {
    alignItems: 'flex-end',
  },

  readinessNumber: {
    fontSize: 25,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  readinessLabel: {
    marginTop: 1,
    fontSize: 11,
    color: Palette.textSecondary,
  },

  /* =========================
     BADGES
  ========================== */

  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 14,
  },

  intensityBadge: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
  },

  durationBadge: {
    backgroundColor: Palette.surfaceSubtle,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  lightBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textWhite,
  },

  durationBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  /* =========================
     WARNINGS
  ========================== */

  warningList: {
    gap: 8,
  },

  warning: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    padding: 11,
    borderRadius: 12,
    backgroundColor: Palette.surfaceCrimsonMuted,
    borderWidth: 1,
    borderColor: '#F2CACA',
  },

  warningText: {
    flex: 1,
    fontSize: 12,
    lineHeight: 17,
    color: Palette.textPrimary,
  },

  /* =========================
     EXERCISES
  ========================== */

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 12,
  },

  exerciseRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },

  exerciseRowLast: {
    borderBottomWidth: 0,
  },

  exerciseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  exerciseIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceOrangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  exerciseDuration: {
    marginTop: 3,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  /* =========================
     ACTION BUTTONS
  ========================== */

  actionRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },

  actionButton: {
    flex: 1,
    minHeight: 82,
    borderRadius: 16,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 7,
  },

  actionButtonPrimary: {
    backgroundColor: Palette.oceanBlue,
    borderColor: Palette.oceanBlue,
  },

  actionText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  actionPrimaryText: {
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textWhite,
  },

  /* =========================
     NEXT 7 DAYS
  ========================== */

  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  dateColumn: {
    width: 60,
    alignItems: 'center',
  },

  dayName: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginBottom: 3,
  },

  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  verticalDivider: {
    width: 1,
    height: 42,
    backgroundColor: Palette.borderSubtle,
    marginHorizontal: 12,
  },

  weekInfo: {
    flex: 1,
  },

  weekPhase: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  weekDuration: {
    marginTop: 3,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  weekIntensity: {
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 18,
  },

  weekIntensityText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textWhite,
  },

  /* =========================
     HISTORY
  ========================== */

  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },

  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  historyIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceBlueMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },

  historyType: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  historyMeta: {
    marginTop: 3,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  historyPhase: {
    fontSize: 11,
    color: Palette.textSecondary,
  },
});