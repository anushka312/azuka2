import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/Styles';

export const styles = StyleSheet.create({
  /* =========================
     SCREEN
  ========================== */

  container: {
    paddingTop: 40,
    paddingHorizontal: 20,
    paddingBottom: 60,
    backgroundColor: Palette.cream,
  },

  header: {
    marginBottom: 2,
    marginTop: 10
  },

  subtitle: {
    marginTop: 4,
    marginBottom: 20,
    fontSize: 14,
    lineHeight: 20,
    color: Palette.textSecondary,
  },

  /* =========================
     TODAY EXERCISES
  ========================== */

  exerciseHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  exerciseInfo: {
    flex: 1,
  },

  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  exerciseHint: {
    marginTop: 3,
    fontSize: 11,
    color: Palette.textSecondary,
  },

  tickAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Palette.surfaceBlueMuted,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  tickAllButtonCompleted: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderColor: Palette.forestGreen,
  },

  tickAllCheck: {
    width: 19,
    height: 19,
    borderRadius: 6,
    borderWidth: 1.5,
    borderColor: Palette.oceanBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 6,
  },

  tickAllCheckCompleted: {
    backgroundColor: Palette.forestGreen,
    borderColor: Palette.forestGreen,
  },

  tickAllText: {
    fontSize: 11,
    fontWeight: '700',
    color: Palette.oceanBlue,
  },

  tickAllTextCompleted: {
    color: Palette.forestGreen,
  },

  exerciseRow: {
    minHeight: 68,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 5,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },

  exerciseRowCompleted: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderRadius: 12,
    borderBottomWidth: 0,
    marginVertical: 2,
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

  exerciseIconCompleted: {
    backgroundColor: Palette.surfaceGreenMuted,
  },

  exerciseName: {
    fontSize: 14,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  exerciseNameCompleted: {
    color: Palette.forestGreen,
  },

  exerciseDuration: {
    marginTop: 3,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  exerciseCheck: {
    width: 25,
    height: 25,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: Palette.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 7,
  },

  exerciseCheckCompleted: {
    backgroundColor: Palette.forestGreen,
    borderColor: Palette.forestGreen,
  },

  exerciseArrow: {
    padding: 4,
  },

  /* =========================
     ACTUAL ACTIVITY
  ========================== */

  actualHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 14,
  },

  actualIcon: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: Palette.surfaceBlueMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },

  actualHeaderText: {
    flex: 1,
  },

  actualActivitiesList: {
    marginBottom: 10,
  },

  actualActivity: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
    marginBottom: 8,
    borderRadius: 12,
    backgroundColor: Palette.surfaceGreenMuted,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
  },

  actualActivityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },

  actualActivityText: {
    marginLeft: 9,
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textPrimary,
  },

  addActivityButton: {
    height: 48,
    borderRadius: 12,
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Palette.borderActiveBlue,
    backgroundColor: Palette.surfaceBlueMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addActivityText: {
    marginLeft: 6,
    fontSize: 13,
    fontWeight: '700',
    color: Palette.oceanBlue,
  },

  completedBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    marginBottom: 16,
    borderRadius: 14,
    backgroundColor: Palette.surfaceGreenMuted,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
  },

  completedBannerText: {
    flex: 1,
    marginLeft: 10,
  },

  completedBannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.forestGreen,
  },

  completedBannerSubtitle: {
    marginTop: 2,
    fontSize: 11,
    color: Palette.textSecondary,
  },

  /* =========================
     MODAL ROOT / ANIMATION
  ========================== */

  modalRoot: {
    flex: 1,
    justifyContent: 'flex-end',
  },

  modalOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(17, 17, 17, 0.42)',
  },

  modalTouchArea: {
    ...StyleSheet.absoluteFillObject,
  },

  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: Palette.borderStrong,
    alignSelf: 'center',
    marginBottom: 18,
  },

  /* =========================
     EXERCISE MODAL
  ========================== */

  exerciseModal: {
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 22,
    paddingTop: 10,
    paddingBottom: 30,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 18,
  },

  modalHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 18,
  },

  modalHeaderLeft: {
    flexDirection: 'row',
    flex: 1,
    marginRight: 12,
  },

  modalHeaderText: {
    flex: 1,
    marginLeft: 12,
  },

  modalExerciseIcon: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: Palette.surfaceOrangeMuted,
    alignItems: 'center',
    justifyContent: 'center',
  },

  closeButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceWhite,
    alignItems: 'center',
    justifyContent: 'center',
  },

  modalTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Palette.textPrimary,
  },

  modalSubtitle: {
    marginTop: 4,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  modalDuration: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 7,
  },

  modalDurationText: {
    marginLeft: 5,
    fontSize: 12,
    color: Palette.textSecondary,
  },

  modalSection: {
    marginTop: 16,
  },

  modalSectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 7,
  },

  modalBody: {
    fontSize: 13,
    lineHeight: 20,
    color: Palette.textSecondary,
  },

  modalCompleteButton: {
    height: 50,
    borderRadius: 13,
    backgroundColor: Palette.oceanBlue,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 22,
  },

  modalCompleteButtonDone: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
  },

  modalCompleteText: {
    marginLeft: 7,
    color: Palette.textWhite,
    fontSize: 13,
    fontWeight: '700',
  },

  modalCompleteTextDone: {
    marginLeft: 7,
    color: Palette.forestGreen,
    fontSize: 13,
    fontWeight: '700',
  },

  /* =========================
     ACTIVITY MODAL
  ========================== */

  activityModal: {
    maxHeight: '88%',
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 24,

    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -5,
    },
    shadowOpacity: 0.12,
    shadowRadius: 14,
    elevation: 18,
  },

  activityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: 4,
  },

  activityOption: {
    width: '48.5%',
    minHeight: 68,
    marginBottom: 9,
    padding: 9,
    borderRadius: 14,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    flexDirection: 'row',
    alignItems: 'center',
  },

  activityOptionSelected: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderColor: Palette.forestGreen,
  },

  activityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  activityIconSelected: {
    backgroundColor: Palette.surfaceWhite,
  },

  activityName: {
    flex: 1,
    fontSize: 11,
    fontWeight: '600',
    color: Palette.textSecondary,
  },

  activityNameSelected: {
    color: Palette.forestGreen,
    fontWeight: '700',
  },

  /* =========================
     CUSTOM ACTIVITY
  ========================== */

  customActivity: {
    marginTop: 12,
  },

  customInput: {
    minHeight: 75,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    borderRadius: 13,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 13,
    color: Palette.textPrimary,
    textAlignVertical: 'top',
  },

  addCustomButton: {
    height: 42,
    marginTop: 9,
    borderRadius: 11,
    backgroundColor: Palette.surfaceBlueMuted,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },

  addCustomButtonDisabled: {
    backgroundColor: Palette.surfaceSubtle,
  },

  addCustomText: {
    marginLeft: 5,
    fontSize: 12,
    fontWeight: '700',
    color: Palette.oceanBlue,
  },

  addCustomTextDisabled: {
    color: Palette.textMuted,
  },

  /* =========================
     MODAL ACTIONS
  ========================== */

  customActions: {
    flexDirection: 'row',
    marginTop: 12,
  },

  cancelButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },

  cancelText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textSecondary,
  },

  saveActivityButton: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: Palette.forestGreen,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },

  saveActivityText: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textWhite,
  },
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
   NEXT 7 DAYS
========================= */

weekRow: {
  flexDirection: 'row',
  alignItems: 'center',
  minHeight: 64,
},

dateColumn: {
  width: 58,
  alignItems: 'center',
  justifyContent: 'center',
},

dayName: {
  fontSize: 11,
  fontWeight: '600',
  color: Palette.textSecondary,
  marginBottom: 4,
},

dateText: {
  fontSize: 14,
  fontWeight: '800',
  color: Palette.textPrimary,
},

verticalDivider: {
  width: 1,
  height: 42,
  backgroundColor: Palette.borderSubtle,
  marginHorizontal: 14,
},

weekInfo: {
  flex: 1,
  justifyContent: 'center',
},

weekPhase: {
  fontSize: 14,
  fontWeight: '700',
  color: Palette.textPrimary,
},

weekDuration: {
  marginTop: 4,
  fontSize: 12,
  color: Palette.textSecondary,
},

weekIntensity: {
  paddingHorizontal: 11,
  paddingVertical: 7,
  borderRadius: 18,
  minWidth: 70,
  alignItems: 'center',
},

weekIntensityText: {
  fontSize: 10,
  fontWeight: '700',
  color: Palette.textWhite,
},
/* =========================
   HISTORY
========================= */

historyCard: {
  backgroundColor: Palette.surfaceWhite,
  borderRadius: 16,
  padding: 15,
  marginBottom: 10,
  borderWidth: 1,
  borderColor: Palette.borderSubtle,
},

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
  backgroundColor: Palette.surfaceGreenMuted,
  alignItems: 'center',
  justifyContent: 'center',
  marginRight: 12,
  borderWidth: 1,
  borderColor: Palette.forestGreen,
},

historyType: {
  fontSize: 14,
  fontWeight: '700',
  color: Palette.textPrimary,
},

historyMeta: {
  marginTop: 4,
  fontSize: 12,
  color: Palette.textSecondary,
},

historyPhase: {
  fontSize: 11,
  fontWeight: '600',
  color: Palette.textSecondary,
  backgroundColor: Palette.surfaceSubtle,
  paddingHorizontal: 9,
  paddingVertical: 6,
  borderRadius: 14,
},
});