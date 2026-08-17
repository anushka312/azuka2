import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/Styles';

export const styles = StyleSheet.create({

  /* =========================
     SCREEN
  ========================== */

  screen: {
    flex: 1,
    backgroundColor: Palette.cream,
  },

  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 30,
    paddingBottom: 50,
  },

  /* =========================
     HEADER
  ========================== */

  header: {
    marginBottom: 18,
  },

  title: {
    fontSize: 27,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },

  subtitle: {
    marginTop: 5,
    fontSize: 13,
    color: Palette.textSecondary,
  },

  /* =========================
     PHASE
  ========================== */

  phaseCard: {
    padding: 18,
    backgroundColor: Palette.creamLight,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  phaseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  smallLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.textSubtle,
    letterSpacing: 1,
    marginBottom: 4,
  },

  phaseTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  phaseSubtitle: {
    marginTop: 3,
    fontSize: 13,
    color: Palette.textSecondary,
  },

  phaseBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cream,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },

  phaseDot: {
    width: 7,
    height: 7,
    borderRadius: 4,
    marginRight: 6,
  },

  phaseBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },

  progressTrack: {
    height: 7,
    backgroundColor: Palette.creamDark,
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 18,
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  helperText: {
    marginTop: 8,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  /* =========================
     CALENDAR
  ========================== */

  calendarCard: {
    padding: 16,
    backgroundColor: Palette.creamLight,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  calendarHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  monthTitleContainer: {
    alignItems: 'center',
    flex: 1,
  },

  monthTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  monthSubtitle: {
    fontSize: 11,
    color: Palette.textSecondary,
    marginTop: 3,
  },

  monthButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.cream,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  weekRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },

  weekDayCell: {
    flex: 1,
    alignItems: 'center',
  },

  weekDayText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSubtle,
  },

  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  dayCell: {
    width: '14.2857%',
    height: 54,
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 4,
  },

  dayNumberContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },

  dayNumber: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  selectedDay: {
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1.5,
    borderColor: Palette.oceanBlue,
    borderRadius: 10,
  },

  selectedDayText: {
    color: Palette.oceanBlue,
    fontWeight: '800',
  },

  todayIndicator: {
    position: 'absolute',
    bottom: -10,
    width: 4,
    height: 4,
    borderRadius: 2,
  },

  todayDay: {
    borderWidth: 0,
  },

  todayDayText: {
    color: Palette.oceanBlue,
    fontWeight: '800',
  },

  dayIndicator: {
    width: 5,
    height: 5,
    borderRadius: 3,
    marginTop: 4,
  },

  /* =========================
     CALENDAR LEGEND
  ========================== */

  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 10,
    marginTop: 15,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },

  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  legendDot: {
    width: 7,
    height: 7,
    borderRadius: 3.5,
    marginRight: 5,
  },

  legendText: {
    fontSize: 10,
    color: Palette.textSecondary,
  },

  /* =========================
     SIGNALS
  ========================== */

  sectionCard: {
    padding: 18,
    backgroundColor: Palette.creamLight,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },

  sectionTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  sectionSubtitle: {
    marginTop: 3,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  loggerIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  /* EMPTY STATE */

  loggerEmpty: {
    alignItems: 'center',
    paddingVertical: 20,
  },

  loggerEmptyIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },

  loggerEmptyTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  loggerEmptyText: {
    marginTop: 5,
    fontSize: 12,
    lineHeight: 17,
    color: Palette.textSecondary,
    textAlign: 'center',
    maxWidth: 250,
  },

  logButton: {
    marginTop: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.forestGreen,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 11,
  },

  logButtonText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '800',
    color: Palette.surfaceWhite,
  },

  /* LOGGED STATE */

  loggedSummary: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  loggedSummaryLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  loggedCheck: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  loggedSummaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  loggedSummarySubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: Palette.textSecondary,
  },

  editText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.oceanBlue,
  },

  loggedSymptoms: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
    marginTop: 14,
  },

  loggedChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  loggedChipDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },

  loggedChipText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.textSecondary,
  },

  moreChip: {
    backgroundColor: Palette.cream,
    borderRadius: 18,
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  moreChipText: {
    fontSize: 10,
    fontWeight: '800',
    color: Palette.textSecondary,
  },

  viewRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 14,
    paddingTop: 13,
    borderTopWidth: 1,
    borderTopColor: Palette.borderSubtle,
  },

  viewRecordText: {
    fontSize: 12,
    fontWeight: '800',
    color: Palette.oceanBlue,
  },

  /* =========================
     SYMPTOM LOGGER
  ========================== */

  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  symptomModal: {
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingHorizontal: 20,
    paddingTop: 10,
    maxHeight: '88%',
  },

  sheetHandle: {
    alignSelf: 'center',
    width: 42,
    height: 4,
    borderRadius: 2,
    backgroundColor: Palette.borderStrong,
    marginBottom: 18,
  },

  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 18,
  },

  sheetDate: {
    fontSize: 21,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  sheetSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* CURRENT RECORD */

  currentRecord: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 14,
    padding: 13,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  currentRecordTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 8,
  },

  recordRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 9,
  },

  recordIcon: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: Palette.cream,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  recordContent: {
    flex: 1,
  },

  recordName: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  recordMeta: {
    marginTop: 2,
    fontSize: 10,
    color: Palette.textSecondary,
  },

  /* CATEGORY TABS */

  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 10,
  },

  categoryScroll: {
    marginBottom: 14,
  },

  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.cream,
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginRight: 7,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  categoryChipActive: {
    backgroundColor: Palette.surfaceWhite,
    borderColor: Palette.orange,
  },

  categoryText: {
    marginLeft: 5,
    fontSize: 11,
    fontWeight: '700',
    color: Palette.textSecondary,
  },

  categoryTextActive: {
    color: Palette.orange,
  },

  /* SYMPTOM OPTIONS */

  symptomOptionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 18,
  },

  symptomOption: {
    width: '48%',
    minHeight: 48,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 12,
    paddingHorizontal: 11,
    paddingVertical: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  symptomOptionSelected: {
    backgroundColor: Palette.cream,
    borderColor: Palette.crimson,
  },

  symptomOptionText: {
    flex: 1,
    marginLeft: 7,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },

  symptomOptionTextSelected: {
    color: Palette.crimson,
    fontWeight: '800',
  },

  /* SAVE */

  saveRecordButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.oceanBlue,
    borderRadius: 13,
    paddingVertical: 13,
    paddingHorizontal: 16,
  },

  saveRecordButtonDisabled: {
    opacity: 0.45,
  },

  saveRecordText: {
    marginRight: 7,
    fontSize: 13,
    fontWeight: '800',
    color: Palette.surfaceWhite,
  },

  modalBottomSpace: {
    height: 25,
  },

  /* =========================
     DETAIL MODAL
  ========================== */

  detailModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(30, 25, 15, 0.30)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 22,
  },

  detailModal: {
    width: '100%',
    backgroundColor: Palette.creamLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  detailTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  detailSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  severityRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 16,
    marginBottom: 18,
  },

  severityChip: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: 11,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  severityText: {
    fontSize: 11,
    fontWeight: '800',
    color: Palette.textSecondary,
  },

  removeSymptomButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    marginBottom: 8,
  },

  removeSymptomText: {
    marginLeft: 6,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.crimson,
  },

  detailSaveButton: {
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Palette.oceanBlue,
    borderRadius: 12,
    paddingVertical: 12,
  },

  detailSaveText: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.surfaceWhite,
  },
});