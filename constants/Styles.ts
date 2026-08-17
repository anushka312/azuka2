import { StyleSheet } from 'react-native';

export const FontFamily = {
  brand: 'ArchivoBlack-Regular',
};

export const Palette = {
  // --- Core Brand & Accents ---
  oceanBlue: '#1770AC',
  skyBlue: '#2B9FC8',
  marigold: '#FBB728',
  forestGreen: '#057816',
  crimson: '#A30621',
  orange: '#F26A04',

  // --- Backgrounds & Base Tiers ---
  cream: '#F6ECD3',           // Primary app background (Warm base)
  creamLight: '#FAF4E5',      // Soft, elevated canvas background
  creamDark: '#EFE2C2',       // Deeper contrast base / container background

  // --- Surfaces & Cards ---
  surfaceWhite: '#FFFFFF',    // Primary card / elevated modal surface
  surfaceMuted: '#EFE6CC',    // Standard inset / secondary card fill
  surfaceSubtle: '#F7F3E8',   // Ultra-soft neutral fill for passive containers
  surfaceElevated: '#FCF9F2', // Soft off-white for highlighted cards

  // --- Tinted & Active Surface Fills ---
  surfaceBlueMuted: '#EEF7FF',    // Selected active states (Ocean Blue tint)
  surfaceMarigoldMuted: '#FFF9E6',// Warm alert / focus highlight state
  surfaceGreenMuted: '#E8F5E9',   // Success / health sync callout background
  surfaceCrimsonMuted: '#FDE8E8', // Destructive / warning alert background
  surfaceOrangeMuted: '#FFF2E8',  // Soft orange tint for focus/energy callouts

  // --- Borders & Dividers ---
  borderStrong: '#E2D8BF',    // High-contrast card outlines
  borderMuted: '#E0D6BA',     // Standard input & divider borders
  borderSubtle: '#ECE4D0',    // Soft separators & subtle card outlines
  borderActiveBlue: '#1770AC',// Active border indicator

  // --- Typography & Neutrals ---
  textPrimary: '#111111',     // High-emphasis text
  textSecondary: '#666666',   // Subtitle & label text
  textMuted: '#888888',       // Disabled states & subtle captions
  textSubtle: '#A09888',      // Soft placeholder text
  textWhite: '#FFFFFF',
};

export const GlobalStyles = StyleSheet.create({
  // --- Screens & Layout Containers ---
  screenContainer: {
    flex: 1,
    backgroundColor: Palette.cream,
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  screenContainerLight: {
    flex: 1,
    backgroundColor: Palette.creamLight,
    paddingHorizontal: 20,
    paddingTop: 40,
  },

  // --- Card Variations & Surfaces ---
  cardElevated: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
  },
  cardOutlined: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1.5,
    borderColor: Palette.borderStrong,
  },
  cardInset: {
    backgroundColor: Palette.surfaceMuted,
    borderRadius: 12,
    padding: 14,
    marginVertical: 8,
  },
  cardSubtle: {
    backgroundColor: Palette.surfaceSubtle,
    borderRadius: 12,
    padding: 14,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    marginVertical: 8,
  },
  cardPrimaryAccent: {
    backgroundColor: Palette.oceanBlue,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },

  // --- State-Driven Card Styles ---
  cardActiveBlue: {
    backgroundColor: Palette.surfaceBlueMuted,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1.5,
    borderColor: Palette.borderActiveBlue,
    marginBottom: 12,
  },
  cardMutedHighlight: {
    backgroundColor: Palette.surfaceMarigoldMuted,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.marigold,
    marginBottom: 12,
  },
  cardMutedOrangeHighlight: {
    backgroundColor: Palette.surfaceOrangeMuted,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.orange,
    marginBottom: 12,
  },

  // --- Buttons ---
  btnPrimary: {
    backgroundColor: Palette.oceanBlue,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnPrimaryText: {
    color: Palette.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  btnSecondary: {
    backgroundColor: Palette.skyBlue,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnSecondaryText: {
    color: Palette.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },
  btnOutline: {
    backgroundColor: 'transparent',
    height: 52,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: Palette.textMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnOutlineText: {
    color: Palette.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  btnMuted: {
    backgroundColor: Palette.surfaceMuted,
    height: 52,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnMutedText: {
    color: Palette.textSecondary,
    fontSize: 16,
    fontWeight: '600',
  },
  btnDestructive: {
    backgroundColor: Palette.crimson,
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  btnDestructiveText: {
    color: Palette.textWhite,
    fontSize: 16,
    fontWeight: '600',
  },

  // --- Badges ---
  badgeContainer: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 12,
  },
  badgeMarigold: {
    backgroundColor: Palette.marigold,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeGreen: {
    backgroundColor: Palette.forestGreen,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeCrimson: {
    backgroundColor: Palette.crimson,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeOrange: {
    backgroundColor: Palette.orange,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeMuted: {
    backgroundColor: Palette.surfaceMuted,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
  },
  badgeTextLight: {
    color: Palette.textWhite,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextDark: {
    color: Palette.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  badgeTextMuted: {
    color: Palette.textSecondary,
    fontSize: 12,
    fontWeight: '600',
  },

  // --- Form Inputs ---
  inputField: {
    backgroundColor: Palette.surfaceWhite,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.borderMuted,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Palette.textPrimary,
    marginBottom: 16,
  },
  inputFieldMuted: {
    backgroundColor: Palette.surfaceSubtle,
    height: 50,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Palette.textPrimary,
    marginBottom: 16,
  },

  // --- Typography ---
  brandTitle: {
    fontFamily: FontFamily.brand,
    fontSize: 30,
    fontWeight: '400',
    color: Palette.textPrimary,
    letterSpacing: 0.5,
  },
  brandSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Palette.textSecondary,
    letterSpacing: 0.3,
  },
  headingLarge: {
    fontSize: 28,
    fontWeight: '800',
    color: Palette.textPrimary,
    letterSpacing: -0.5,
  },
  headingMedium: {
    fontSize: 20,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  bodyText: {
    fontSize: 15,
    color: Palette.textPrimary,
    lineHeight: 22,
  },
  captionText: {
    fontSize: 13,
    color: Palette.textSecondary,
  },
  mutedText: {
    fontSize: 13,
    color: Palette.textMuted,
  },
});