import { StyleSheet } from 'react-native';
import { Palette } from '@/constants/Styles';

export const styles = StyleSheet.create({
  // =========================
  // HEADER
  // =========================

  header: {
    marginBottom: 20,
    marginTop: 10,
  },

  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 4,
  },

  subtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
  },

  // =========================
  // TABS
  // =========================

  tabs: {
    flexDirection: 'row',
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 14,
    padding: 4,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  tab: {
    flex: 1,
    height: 44,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },

  activeTab: {
    backgroundColor: Palette.surfaceWhite,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 5,
    elevation: 2,
  },

  tabText: {
    fontSize: 13,
    fontWeight: '600',
    color: Palette.textSecondary,
  },

  activeTabText: {
    color: Palette.oceanBlue,
    fontWeight: '700',
  },

  // =========================
  // COMMON CARD
  // =========================

  card: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  cardTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 14,
  },

  // =========================
  // FOOD SCANNER
  // =========================

  scannerCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 18,
    padding: 24,
    marginBottom: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 3,
  },

  cameraCircle: {
    width: 76,
    height: 76,
    borderRadius: 38,
    backgroundColor: Palette.orange,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
  },

  scannerTitle: {
    fontSize: 19,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 6,
  },

  scannerDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
    textAlign: 'center',
    maxWidth: 300,
    marginBottom: 18,
  },

  cameraButton: {
    width: '100%',
    height: 50,
    borderRadius: 12,
    backgroundColor: Palette.orange,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },

  cameraButtonText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },

  // =========================
  // FOOD VISION
  // =========================

  visionButtons: {
    flexDirection: 'row',
    gap: 8,
  },

  visionButton: {
    flex: 1,
    borderRadius: 12,
    paddingVertical: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },

  visionButtonBlue: {
    backgroundColor: Palette.surfaceBlueMuted,
  },

  visionButtonGreen: {
    backgroundColor: Palette.surfaceGreenMuted,
  },

  visionButtonText: {
    fontSize: 12,
    fontWeight: '700',
    marginTop: 6,
  },

  // =========================
  // PHASE INSIGHT
  // =========================

  phaseCard: {
    backgroundColor: Palette.surfaceOrangeMuted,
    borderRadius: 14,
    padding: 15,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.orange,
  },

  phaseTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 5,
  },

  phaseText: {
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSecondary,
  },

  // =========================
  // MACROS
  // =========================

  macroRow: {
    marginBottom: 14,
  },

  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },

  macroLabel: {
    fontSize: 12,
    color: Palette.textSecondary,
  },

  macroValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  progressBackground: {
    height: 7,
    borderRadius: 10,
    backgroundColor: Palette.surfaceMuted,
    overflow: 'hidden',
  },

  progressFill: {
    height: '100%',
    borderRadius: 10,
  },

  // =========================
  // RECENT MEALS
  // =========================

  mealItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },

  mealName: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
    marginBottom: 3,
  },

  mealTime: {
    fontSize: 11,
    color: Palette.textSecondary,
  },

  mealCalories: {
    fontSize: 13,
    fontWeight: '700',
    color: Palette.textPrimary,
  },

  caloriesLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
    textAlign: 'right',
  },

  // =========================
  // RECIPES - SEARCH
  // =========================

  searchRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 14,
  },

  searchBox: {
    flex: 1,
    height: 48,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 13,
  },

  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 14,
    color: Palette.textPrimary,
  },

  filterButton: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: Palette.surfaceWhite,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // =========================
  // RECIPE CARD
  // =========================

  recipeCard: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    marginBottom: 14,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },

  recipeImage: {
    height: 125,
    justifyContent: 'center',
    alignItems: 'center',
  },

  recipeContent: {
    padding: 15,
  },

  recipeHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },

  recipeName: {
    flex: 1,
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginRight: 8,
  },

  recipeMetaRow: {
    flexDirection: 'row',
    gap: 14,
    marginBottom: 12,
  },

  recipeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },

  recipeMetaText: {
    fontSize: 11,
    color: Palette.textSecondary,
  },

  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },

  phaseBadge: {
    backgroundColor: Palette.surfaceOrangeMuted,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  phaseBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Palette.orange,
  },

  tag: {
    backgroundColor: Palette.surfaceMuted,
    borderRadius: 20,
    paddingHorizontal: 9,
    paddingVertical: 5,
  },

  tagText: {
    fontSize: 10,
    fontWeight: '600',
    color: Palette.textSecondary,
  },

  // =========================
  // RECIPE MODAL
  // =========================

modalOverlay: {
  flex:1,
  justifyContent: 'flex-end',
  paddingTop: 120
},

modalBackdrop: {
  ...StyleSheet.absoluteFillObject,
},

  modal: {
    backgroundColor: Palette.surfaceWhite,
    borderTopLeftRadius: 26,
    borderTopRightRadius: 26,
    maxHeight: '90%',
    overflow: 'hidden',
  },

  modalHandle: {
    width: 42,
    height: 4,
    borderRadius: 4,
    backgroundColor: Palette.borderMuted,
    alignSelf: 'center',
    marginTop: 10,
    marginBottom: 7,
  },

  modalImage: {
    height: 155,
    justifyContent: 'center',
    alignItems: 'center',
  },

  modalClose: {
    position: 'absolute',
    right: 15,
    top: 15,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: Palette.surfaceWhite,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },

  modalContent: {
    padding: 20,
  },

  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 6,
  },

  modalDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: Palette.textSecondary,
    marginBottom: 18,
  },

  modalStats: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },

  modalStat: {
    flex: 1,
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    padding: 11,
    alignItems: 'center',
  },

  modalStatValue: {
    fontSize: 15,
    fontWeight: '800',
    color: Palette.oceanBlue,
    marginTop: 5,
  },

  modalStatLabel: {
    fontSize: 10,
    color: Palette.textSecondary,
    marginTop: 2,
  },

  modalSectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Palette.textPrimary,
    marginBottom: 9,
  },

  ingredient: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },

  ingredientDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Palette.forestGreen,
    marginRight: 9,
  },

  ingredientText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },

  whyBox: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderRadius: 13,
    padding: 13,
    marginTop: 10,
    marginBottom: 20,
  },

  whyTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Palette.forestGreen,
    marginBottom: 4,
  },

  whyText: {
    fontSize: 12,
    lineHeight: 18,
    color: Palette.textSecondary,
  },

  doneButton: {
    height: 50,
    borderRadius: 12,
    backgroundColor: Palette.oceanBlue,
    justifyContent: 'center',
    alignItems: 'center',
  },

  doneButtonText: {
    color: Palette.textWhite,
    fontSize: 15,
    fontWeight: '700',
  },

  filterButtonActive: {
  backgroundColor: Palette.oceanBlue,
  borderColor: Palette.oceanBlue,
},

filterDot: {
  position: 'absolute',
  top: 7,
  right: 7,
  width: 7,
  height: 7,
  borderRadius: 4,
  backgroundColor: Palette.orange,
},

filterPanel: {
  backgroundColor: Palette.surfaceWhite,
  borderRadius: 14,
  padding: 14,
  marginBottom: 12,

  borderWidth: 1,
  borderColor: Palette.borderSubtle,

  shadowColor: '#000',
  shadowOffset: {
    width: 0,
    height: 3,
  },
  shadowOpacity: 0.05,
  shadowRadius: 8,
  elevation: 2,
},

filterHeader: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  marginBottom: 12,
},

filterTitle: {
  fontSize: 14,
  fontWeight: '800',
  color: Palette.textPrimary,
},

filterOptions: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  gap: 8,
},

filterChip: {
  paddingHorizontal: 13,
  paddingVertical: 8,
  borderRadius: 20,

  backgroundColor: Palette.surfaceSubtle,

  borderWidth: 1,
  borderColor: Palette.borderMuted,
},

filterChipActive: {
  backgroundColor: Palette.oceanBlue,
  borderColor: Palette.oceanBlue,
},

filterChipText: {
  fontSize: 12,
  fontWeight: '600',
  color: Palette.textSecondary,
},

filterChipTextActive: {
  color: Palette.textWhite,
  fontWeight: '700',
},

activeFilterRow: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',

  paddingHorizontal: 4,
  marginBottom: 10,
},

activeFilterText: {
  fontSize: 11,
  color: Palette.textSecondary,
},

clearFilterText: {
  fontSize: 11,
  fontWeight: '700',
  color: Palette.oceanBlue,
},

emptyState: {
  alignItems: 'center',
  justifyContent: 'center',
  paddingVertical: 45,
},

emptyTitle: {
  fontSize: 16,
  fontWeight: '800',
  color: Palette.textPrimary,
  marginTop: 10,
  marginBottom: 4,
},

emptyText: {
  fontSize: 12,
  color: Palette.textSecondary,
  textAlign: 'center',
  maxWidth: 240,
},

galleryButton: {
  marginTop: 12,
  width: '100%',
  height: 48,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: Palette.orange,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 8,
},

galleryButtonText: {
  fontSize: 15,
  fontWeight: '600',
  color: Palette.orange,
},

imagePreviewContainer: {
  width: '100%',
  height: 220,
  borderRadius: 18,
  overflow: 'hidden',
  marginBottom: 16,
},

foodImage: {
  width: '100%',
  height: '100%',
  resizeMode: 'cover',
},

imageActions: {
  width: '100%',
  flexDirection: 'row',
  gap: 10,
  marginTop: 16,
},

retakeButton: {
  flex: 1,
  height: 48,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: Palette.oceanBlue,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
},

retakeButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: Palette.oceanBlue,
},

analyzeButton: {
  flex: 1,
  height: 48,
  borderRadius: 14,
  backgroundColor: Palette.oceanBlue,
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'center',
  gap: 7,
},

analyzeButtonText: {
  fontSize: 14,
  fontWeight: '600',
  color: Palette.textWhite,
},
});