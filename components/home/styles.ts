import { StyleSheet, Dimensions } from 'react-native';
import { Palette } from '../../constants/Styles';

const { width } = Dimensions.get('window');

export const styles = StyleSheet.create({
  // ==========================================
  // SCREEN & HEADER
  // ==========================================
  screenContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    marginTop: 10,
  },
  greetingSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconBtn: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  greetingTextContainer: {
    marginLeft: 12,
  },
  greetingSmall: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSubtle,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  userName: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  actionsSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  notificationBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 3.5,
    backgroundColor: Palette.crimson,
  },

  // ==========================================
  // SECTION HEADERS
  // ==========================================
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginTop: 10,
    marginBottom: 14,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.3,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
  },

  // ==========================================
  // MINIMUM WIN TOGGLE
  // ==========================================
  minimumWinToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  minimumWinToggleActive: {
    backgroundColor: Palette.crimson,
    borderColor: Palette.crimson,
  },
  minimumWinText: {
    marginLeft: 6,
    fontSize: 11,
    fontWeight: '800',
    color: Palette.textSecondary,
  },
  minimumWinTextActive: {
    color: Palette.surfaceWhite,
  },

  // ==========================================
  // CYCLE & ORCHESTRATOR CARD
  // ==========================================
  cycleCard: {
    padding: 18,
    borderRadius: 20,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  cycleCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    backgroundColor: Palette.creamDark,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  phaseBadgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.orange,
    marginRight: 6,
  },
  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  orchestratorMessage: {
    fontSize: 14,
    lineHeight: 20,
    fontWeight: '600',
    color: Palette.textPrimary,
    marginTop: 14,
  },

  // ==========================================
  // BIOMETRICS GRID
  // ==========================================
  biometricGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  biometricTile: {
    width: (width - 42) / 2,
    backgroundColor: Palette.surfaceWhite,
    padding: 14,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  tileHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  tileIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tileLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSubtle,
    textTransform: 'uppercase',
  },
  tileValue: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  tileMeta: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
    marginTop: 2,
  },

  // ==========================================
  // ANALYTICS & CHART
  // ==========================================
  analyticsCard: {
    padding: 16,
    borderRadius: 20,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginBottom: 20
  },
  chartContainer: {
    height: 120,
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    paddingTop: 20,
    paddingHorizontal: 10,
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    height: 80,
    width: 12,
    backgroundColor: Palette.cream,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  chartLabel: {
    marginTop: 6,
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSubtle,
  },

  // ==========================================
  // SLEEP LOG MODAL
  // ==========================================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 25, 15, 0.45)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    padding: 22,
    maxHeight: '85%',
  },
  modalHandle: {
    width: 38,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderStrong,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Palette.textSecondary,
    marginTop: 2,
    marginBottom: 20,
  },
  selectorGroup: {
    marginBottom: 18,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 8,
  },
  chipRow: {
    flexDirection: 'row',
    gap: 8,
  },
  chipOption: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    alignItems: 'center',
  },
  chipOptionSelected: {
    backgroundColor: Palette.oceanBlue,
    borderColor: Palette.oceanBlue,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textSecondary,
  },
  chipTextSelected: {
    color: Palette.surfaceWhite,
  },
  saveButton: {
    backgroundColor: Palette.oceanBlue,
    borderRadius: 14,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 10,
  },
  saveButtonText: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.surfaceWhite,
  },
});