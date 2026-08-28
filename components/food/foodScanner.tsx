import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { BlurView } from 'expo-blur';
import {
  Camera,
  ScanLine,
  RotateCcw,
  X,
  Sparkles,
  CheckCircle2,
  Flame,
  Dumbbell,
  Wheat,
  Droplet,
} from 'lucide-react-native';
import * as ImagePicker from 'expo-image-picker';

import { Palette, GlobalStyles } from '@/constants/Styles';

// =====================================================
// TYPES & MOCK DATA
// =====================================================

interface Nutrients {
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  fiber: number;
  magnesium: number;
  iron: number;
  zinc: number;
}

interface ScannedFoodResult {
  dishName: string;
  confidence: number;
  phaseMatch: string;
  benefits: string;
  nutrients: Nutrients;
}

const MOCK_SCAN_RESULT: ScannedFoodResult = {
  dishName: 'Avocado Toast with Poached Egg & Seeds',
  confidence: 0.94,
  phaseMatch: 'Luteal Phase Optimal',
  benefits:
    'High in healthy fats, magnesium, and B vitamins to combat luteal fatigue and keep blood sugar steady.',
  nutrients: {
    calories: 420,
    protein: 18,
    carbs: 34,
    fats: 24,
    fiber: 9,
    magnesium: 85,
    iron: 3.2,
    zinc: 2.1,
  },
};

// =====================================================
// MACRO PROGRESS BAR
// =====================================================

function MacroBar({
  label,
  current,
  target,
  color,
  unit = 'g',
}: {
  label: string;
  current: number;
  target: number;
  color: string;
  unit?: string;
}) {
  const percentage = Math.min((current / target) * 100, 100);

  return (
    <View style={uiStyles.macroBarContainer}>
      <View style={uiStyles.macroBarHeader}>
        <Text style={GlobalStyles.captionText}>{label}</Text>
        <Text style={GlobalStyles.captionText}>
          <Text style={{ color: Palette.textPrimary, fontWeight: '700' }}>
            {current}
          </Text>
          <Text style={{ color: Palette.textSecondary }}>
            {' '}
            / {target}
            {unit}
          </Text>
        </Text>
      </View>
      <View style={uiStyles.progressTrack}>
        <View
          style={[
            uiStyles.progressFill,
            { width: `${percentage}%`, backgroundColor: color },
          ]}
        />
      </View>
    </View>
  );
}

// =====================================================
// MAIN FOOD SCANNER COMPONENT
// =====================================================

export default function FoodScanner() {
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [scanResult, setScanResult] = useState<ScannedFoodResult | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);

  // ===================================================
  // CAMERA & GALLERY HANDLERS
  // ===================================================

  const takePhoto = async () => {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Camera Access Required',
        'Please enable camera access in system settings to scan meals.'
      );
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const pickFromGallery = async () => {
    const permission =
      await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert(
        'Photo Access Required',
        'Please enable photo library access to select meal photos.'
      );
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.85,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const openScanner = () => {
    Alert.alert('Scan Your Meal', 'Choose how you would like to import your food.', [
      { text: 'Take Photo', onPress: takePhoto },
      { text: 'Choose from Gallery', onPress: pickFromGallery },
      { text: 'Cancel', style: 'cancel' },
    ]);
  };

  const removeImage = () => {
    setImageUri(null);
    setScanResult(null);
  };

  const handleAnalyzeFood = () => {
    if (!imageUri) return;
    setIsAnalyzing(true);

    setTimeout(() => {
      setIsAnalyzing(false);
      setScanResult(MOCK_SCAN_RESULT);
      setIsModalVisible(true);
    }, 1400);
  };

  return (
    <View style={uiStyles.container}>
      {/* =================================================
          SCANNER CARD
      ================================================= */}
      <View style={GlobalStyles.cardElevated}>
        {!imageUri ? (
          <View style={uiStyles.emptyStateContainer}>
            <View style={uiStyles.iconBadge}>
              <Camera size={26} color={Palette.oceanBlue} />
            </View>

            <Text style={GlobalStyles.headingMedium}>Scan your meal</Text>
            <Text style={uiStyles.cardSubtitle}>
              Capture your food for instant nutrient decomposition and
              phase-adaptive insights.
            </Text>

            <View style={uiStyles.buttonStack}>
              <Pressable
                style={({ pressed }) => [
                  GlobalStyles.btnPrimary,
                  { flexDirection: 'row', gap: 8, marginBottom: 0 },
                  pressed && { opacity: 0.88 },
                ]}
                onPress={openScanner}
              >
                <Camera size={18} color={Palette.textWhite} />
                <Text style={GlobalStyles.btnPrimaryText}>Open Camera</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  GlobalStyles.btnMuted,
                  { flexDirection: 'row', gap: 8, marginBottom: 0 },
                  pressed && { opacity: 0.8 },
                ]}
                onPress={pickFromGallery}
              >
                <ScanLine size={18} color={Palette.orange} />
                <Text style={GlobalStyles.btnMutedText}>
                  Choose from Gallery
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={uiStyles.previewContainer}>
            <View style={uiStyles.imageFrame}>
              <Image source={{ uri: imageUri }} style={uiStyles.previewImage} />
            </View>

            <Text style={GlobalStyles.headingMedium}>Meal captured!</Text>
            <Text style={uiStyles.cardSubtitle}>
              Ready for intelligent nutrition analysis.
            </Text>

            <View style={uiStyles.actionRow}>
              <Pressable
                style={[
                  GlobalStyles.btnOutline,
                  { flex: 1, flexDirection: 'row', gap: 6, marginBottom: 0 },
                ]}
                onPress={removeImage}
                disabled={isAnalyzing}
              >
                <RotateCcw size={16} color={Palette.textSecondary} />
                <Text style={GlobalStyles.btnOutlineText}>Retake</Text>
              </Pressable>

              <Pressable
                style={[
                  GlobalStyles.btnPrimary,
                  { flex: 1.5, flexDirection: 'row', gap: 8, marginBottom: 0 },
                  isAnalyzing && { opacity: 0.75 },
                ]}
                onPress={handleAnalyzeFood}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <ActivityIndicator size="small" color={Palette.textWhite} />
                ) : (
                  <>
                    <ScanLine size={18} color={Palette.textWhite} />
                    <Text style={GlobalStyles.btnPrimaryText}>Analyze Meal</Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* =================================================
          PHASE INSIGHT BANNER
      ================================================= */}
      <View style={uiStyles.phaseBanner}>
        <View style={GlobalStyles.badgeContainer}>
          <View style={GlobalStyles.badgeGreen}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
              <Sparkles size={12} color={Palette.textWhite} />
              <Text style={GlobalStyles.badgeTextLight}>Luteal Phase</Text>
            </View>
          </View>
        </View>
        <Text style={GlobalStyles.bodyText}>
          Prioritize complex carbs, magnesium, and lean proteins to sustain energy
          and manage natural serum glucose shifts.
        </Text>
      </View>

      {/* =================================================
          TODAY'S INTAKE CARD
      ================================================= */}
      <View style={GlobalStyles.cardOutlined}>
        <View style={uiStyles.sectionHeaderRow}>
          <Text style={GlobalStyles.headingMedium}>Today's Intake</Text>
          <Text style={GlobalStyles.captionText}>Daily Goals</Text>
        </View>

        <MacroBar
          label="Calories"
          current={1850}
          target={2100}
          unit=" kcal"
          color={Palette.oceanBlue}
        />
        <MacroBar
          label="Protein"
          current={95}
          target={120}
          color={Palette.forestGreen}
        />
        <MacroBar
          label="Carbohydrates"
          current={180}
          target={200}
          color={Palette.orange}
        />
        <MacroBar
          label="Fats"
          current={65}
          target={70}
          color={Palette.marigold}
        />
      </View>

      {/* =================================================
          ANALYSIS MODAL
      ================================================= */}
      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsModalVisible(false)}
      >
        <View style={uiStyles.modalOverlay}>
          <BlurView intensity={20} tint="light" style={StyleSheet.absoluteFill} />

          <View style={uiStyles.modalSheet}>
            <View style={uiStyles.modalHandle} />

            <Pressable
              onPress={() => setIsModalVisible(false)}
              style={uiStyles.modalCloseButton}
              hitSlop={8}
            >
              <X size={18} color={Palette.textPrimary} />
            </Pressable>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={uiStyles.modalScrollContent}
            >
              {scanResult && (
                <>
                  {/* PHASE BADGE */}
                  <View style={[GlobalStyles.badgeGreen, { alignSelf: 'flex-start', marginBottom: 10 }]}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
                      <Sparkles size={12} color={Palette.textWhite} />
                      <Text style={GlobalStyles.badgeTextLight}>{scanResult.phaseMatch}</Text>
                    </View>
                  </View>

                  <Text style={GlobalStyles.headingMedium}>{scanResult.dishName}</Text>

                  {/* MACRO TILES */}
                  <View style={uiStyles.macroTileGrid}>
                    <View style={uiStyles.macroTile}>
                      <Flame size={18} color={Palette.orange} />
                      <Text style={uiStyles.macroTileValue}>
                        {scanResult.nutrients.calories}
                      </Text>
                      <Text style={GlobalStyles.captionText}>Calories</Text>
                    </View>

                    <View style={uiStyles.macroTile}>
                      <Dumbbell size={18} color={Palette.forestGreen} />
                      <Text style={uiStyles.macroTileValue}>
                        {scanResult.nutrients.protein}g
                      </Text>
                      <Text style={GlobalStyles.captionText}>Protein</Text>
                    </View>

                    <View style={uiStyles.macroTile}>
                      <Wheat size={18} color={Palette.oceanBlue} />
                      <Text style={uiStyles.macroTileValue}>
                        {scanResult.nutrients.carbs}g
                      </Text>
                      <Text style={GlobalStyles.captionText}>Carbs</Text>
                    </View>

                    <View style={uiStyles.macroTile}>
                      <Droplet size={18} color={Palette.marigold} />
                      <Text style={uiStyles.macroTileValue}>
                        {scanResult.nutrients.fats}g
                      </Text>
                      <Text style={GlobalStyles.captionText}>Fats</Text>
                    </View>
                  </View>

                  {/* MICRONUTRIENTS SECTION */}
                  <Text style={[GlobalStyles.brandSubtitle, { marginBottom: 10, color: Palette.textPrimary }]}>
                    Key Micronutrients
                  </Text>

                  <View style={uiStyles.microContainer}>
                    <View style={uiStyles.microRow}>
                      <Text style={GlobalStyles.bodyText}>Dietary Fiber</Text>
                      <Text style={uiStyles.microValue}>
                        {scanResult.nutrients.fiber}g
                      </Text>
                    </View>
                    <View style={uiStyles.microRow}>
                      <Text style={GlobalStyles.bodyText}>Magnesium</Text>
                      <Text style={uiStyles.microValue}>
                        {scanResult.nutrients.magnesium} mg
                      </Text>
                    </View>
                    <View style={uiStyles.microRow}>
                      <Text style={GlobalStyles.bodyText}>Iron</Text>
                      <Text style={uiStyles.microValue}>
                        {scanResult.nutrients.iron} mg
                      </Text>
                    </View>
                    <View style={[uiStyles.microRow, { borderBottomWidth: 0 }]}>
                      <Text style={GlobalStyles.bodyText}>Zinc</Text>
                      <Text style={uiStyles.microValue}>
                        {scanResult.nutrients.zinc} mg
                      </Text>
                    </View>
                  </View>

                  {/* AZUKA PHASE INSIGHT */}
                  <View style={GlobalStyles.cardActiveBlue}>
                    <Text style={[GlobalStyles.brandSubtitle, { color: Palette.textPrimary }]}>
                      Azuka Phase Insight
                    </Text>
                    <Text style={[GlobalStyles.bodyText, { marginTop: 4 }]}>
                      {scanResult.benefits}
                    </Text>
                  </View>

                  {/* LOG BUTTON */}
                  <Pressable
                    onPress={() => {
                      setIsModalVisible(false);
                      Alert.alert('Logged', 'Meal added to today\'s intake!');
                    }}
                    style={({ pressed }) => [
                      GlobalStyles.btnPrimary,
                      {
                        backgroundColor: Palette.forestGreen,
                        flexDirection: 'row',
                        gap: 8,
                        marginTop: 8,
                      },
                      pressed && { opacity: 0.9 },
                    ]}
                  >
                    <CheckCircle2 size={18} color={Palette.textWhite} />
                    <Text style={GlobalStyles.btnPrimaryText}>
                      Log to Daily Intake
                    </Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// =====================================================
// COMPONENT SPECIFIC STYLES
// =====================================================

const uiStyles = StyleSheet.create({
  container: {
    gap: 4,
  },
  emptyStateContainer: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Palette.surfaceBlueMuted,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.borderActiveBlue,
  },
  cardSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 8,
  },
  buttonStack: {
    width: '100%',
    gap: 10,
  },
  previewContainer: {
    alignItems: 'center',
  },
  imageFrame: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
  },
  previewImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  actionRow: {
    flexDirection: 'row',
    gap: 10,
    width: '100%',
    marginTop: 10,
  },
  phaseBanner: {
    backgroundColor: Palette.surfaceGreenMuted,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  macroBarContainer: {
    marginBottom: 12,
  },
  macroBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  progressTrack: {
    height: 8,
    backgroundColor: Palette.borderSubtle,
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(17, 17, 17, 0.35)',
  },
  modalSheet: {
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: '85%',
    borderTopWidth: 1.5,
    borderColor: Palette.borderStrong,
  },
  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Palette.borderStrong,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalCloseButton: {
    position: 'absolute',
    right: 18,
    top: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.surfaceMuted,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  modalScrollContent: {
    paddingBottom: 28,
  },
  macroTileGrid: {
    flexDirection: 'row',
    gap: 8,
    marginVertical: 16,
  },
  macroTile: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    gap: 2,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  macroTileValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Palette.textPrimary,
  },
  microContainer: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 14,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
    marginBottom: 16,
  },
  microRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
  microValue: {
    fontSize: 15,
    fontWeight: '600',
    color: Palette.textPrimary,
  },
});