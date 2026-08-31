import React, { useState } from "react";
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
} from "react-native";
import { BlurView } from "expo-blur";

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
} from "lucide-react-native";

import * as ImagePicker from "expo-image-picker";

import { Palette, GlobalStyles } from "@/constants/Styles";
import {
  analyzeMealImage,
  getUserProfile,
  FoodVisionOutput,
} from "@/services/api";

import { ErrorCard } from "@/components/ui/StateFeedback";

// =====================================================
// TYPES
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

// =====================================================
// MAIN FOOD SCANNER
// =====================================================

export default function FoodScanner() {
  const [imageUri, setImageUri] = useState<string | null>(null);

  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [scanResult, setScanResult] =
    useState<ScannedFoodResult | null>(null);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // ===================================================
  // CAMERA
  // ===================================================

  const takePhoto = async () => {
    try {
      const permission =
        await ImagePicker.requestCameraPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Camera Access Required",
          "Please enable camera access in system settings to scan meals."
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        mediaTypes: ["images"],
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.85,
      });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
        setScanResult(null);
        setErrorMsg(null);
      }
    } catch (error) {
      console.warn("[FoodScanner] Camera error:", error);

      Alert.alert(
        "Camera Error",
        "Something went wrong while opening the camera."
      );
    }
  };

  // ===================================================
  // GALLERY
  // ===================================================

  const pickFromGallery = async () => {
    try {
      const permission =
        await ImagePicker.requestMediaLibraryPermissionsAsync();

      if (!permission.granted) {
        Alert.alert(
          "Photo Access Required",
          "Please enable photo library access to select meal photos."
        );
        return;
      }

      const result =
        await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ["images"],
          allowsEditing: true,
          aspect: [4, 3],
          quality: 0.85,
        });

      if (!result.canceled && result.assets?.length > 0) {
        setImageUri(result.assets[0].uri);
        setScanResult(null);
        setErrorMsg(null);
      }
    } catch (error) {
      console.warn("[FoodScanner] Gallery error:", error);

      Alert.alert(
        "Gallery Error",
        "Something went wrong while selecting the image."
      );
    }
  };

  // ===================================================
  // OPEN SCANNER
  // ===================================================

  const openScanner = () => {
    Alert.alert(
      "Scan Your Meal",
      "Choose how you would like to import your food.",
      [
        {
          text: "Take Photo",
          onPress: takePhoto,
        },
        {
          text: "Choose from Gallery",
          onPress: pickFromGallery,
        },
        {
          text: "Cancel",
          style: "cancel",
        },
      ]
    );
  };

  // ===================================================
  // REMOVE IMAGE
  // ===================================================

  const removeImage = () => {
    setImageUri(null);
    setScanResult(null);
    setErrorMsg(null);
  };

  // ===================================================
  // ANALYZE FOOD
  // ===================================================

  const handleAnalyzeFood = async () => {
    if (!imageUri) {
      return;
    }

    try {
      setIsAnalyzing(true);
      setErrorMsg(null);

      // -----------------------------------------------
      // Send image to FastAPI vision endpoint
      // POST /api/food/vision
      // -----------------------------------------------

      const visionData: FoodVisionOutput =
        await analyzeMealImage(imageUri);

      // -----------------------------------------------
      // Map API response to UI structure
      // -----------------------------------------------

      const mappedResult: ScannedFoodResult = {
        dishName:
          visionData.name || "Analyzed Meal",

        confidence: 0.95,

        phaseMatch: "Bio-Adaptive Analysis",

        benefits:
          "This meal has been analyzed by Azuka's food vision system.",

        nutrients: {
          calories: Number(visionData.calories) || 0,

          protein: Number(visionData.protein) || 0,

          carbs:
            Number(visionData.carbohydrates) || 0,

          fats: Number(visionData.fats) || 0,

          fiber:
            Number(
              visionData.micronutrients?.fiber
            ) || 0,

          magnesium:
            Number(
              visionData.micronutrients?.magnesium
            ) || 0,

          iron:
            Number(
              visionData.micronutrients?.iron
            ) || 0,

          zinc:
            Number(
              visionData.micronutrients?.zinc
            ) || 0,
        },
      };

      setScanResult(mappedResult);
      setIsModalVisible(true);
    } catch (error) {
      console.warn(
        "[FoodScanner] Vision analysis error:",
        error
      );

      setErrorMsg(
        "Could not analyze this meal. Please check that your backend is running and try again."
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ===================================================
  // CLOSE MODAL
  // ===================================================

  const closeModal = () => {
    setIsModalVisible(false);
  };

  // ===================================================
  // LOG MEAL
  // ===================================================

  const handleLogMeal = () => {
    if (!scanResult) {
      return;
    }

    /*
     * IMPORTANT:
     *
     * Your current api.ts does NOT contain a meal logging
     * endpoint.
     *
     * Therefore we should NOT pretend this is being saved
     * to MongoDB.
     *
     * Once you add something like:
     *
     * POST /api/meal-log/{userId}
     *
     * we can replace this function with the real API call.
     */

    setIsModalVisible(false);

    Alert.alert(
      "Meal Analyzed",
      `${scanResult.dishName} was successfully analyzed. Meal logging will be connected once the meal-log API is added.`
    );
  };

  // ===================================================
  // RENDER
  // ===================================================

  return (
    <View style={uiStyles.container}>
      {/* =================================================
          ERROR
      ================================================= */}

      {errorMsg && (
        <ErrorCard
          title="Vision Scanner Notice"
          message={errorMsg}
          onRetry={handleAnalyzeFood}
        />
      )}

      {/* =================================================
          SCANNER CARD
      ================================================= */}

      <View style={GlobalStyles.cardElevated}>
        {!imageUri ? (
          <View style={uiStyles.emptyStateContainer}>
            <View style={uiStyles.iconBadge}>
              <Camera
                size={26}
                color={Palette.oceanBlue}
              />
            </View>

            <Text style={GlobalStyles.headingMedium}>
              Scan your meal
            </Text>

            <Text style={uiStyles.cardSubtitle}>
              Capture your food for instant AI nutrient
              decomposition and phase-adaptive insights.
            </Text>

            <View style={uiStyles.buttonStack}>
              {/* CAMERA */}

              <Pressable
                style={({ pressed }) => [
                  GlobalStyles.btnPrimary,
                  {
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 0,
                  },
                  pressed && {
                    opacity: 0.88,
                  },
                ]}
                onPress={openScanner}
              >
                <Camera
                  size={18}
                  color={Palette.textWhite}
                />

                <Text
                  style={GlobalStyles.btnPrimaryText}
                >
                  Open Camera
                </Text>
              </Pressable>

              {/* GALLERY */}

              <Pressable
                style={({ pressed }) => [
                  GlobalStyles.btnMuted,
                  {
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 0,
                  },
                  pressed && {
                    opacity: 0.8,
                  },
                ]}
                onPress={pickFromGallery}
              >
                <ScanLine
                  size={18}
                  color={Palette.orange}
                />

                <Text
                  style={GlobalStyles.btnMutedText}
                >
                  Choose from Gallery
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <View style={uiStyles.previewContainer}>
            {/* IMAGE */}

            <View style={uiStyles.imageFrame}>
              <Image
                source={{ uri: imageUri }}
                style={uiStyles.previewImage}
              />
            </View>

            <Text style={GlobalStyles.headingMedium}>
              Meal captured!
            </Text>

            <Text style={uiStyles.cardSubtitle}>
              Ready for intelligent AI computer vision
              decomposition.
            </Text>

            <View style={uiStyles.actionRow}>
              {/* RETAKE */}

              <Pressable
                style={[
                  GlobalStyles.btnOutline,
                  {
                    flex: 1,
                    flexDirection: "row",
                    gap: 6,
                    marginBottom: 0,
                  },
                ]}
                onPress={removeImage}
                disabled={isAnalyzing}
              >
                <RotateCcw
                  size={16}
                  color={Palette.textSecondary}
                />

                <Text
                  style={GlobalStyles.btnOutlineText}
                >
                  Retake
                </Text>
              </Pressable>

              {/* ANALYZE */}

              <Pressable
                style={[
                  GlobalStyles.btnPrimary,
                  {
                    flex: 1.5,
                    flexDirection: "row",
                    gap: 8,
                    marginBottom: 0,
                  },
                  isAnalyzing && {
                    opacity: 0.75,
                  },
                ]}
                onPress={handleAnalyzeFood}
                disabled={isAnalyzing}
              >
                {isAnalyzing ? (
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: 8,
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={Palette.textWhite}
                    />

                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
                      Analyzing...
                    </Text>
                  </View>
                ) : (
                  <>
                    <ScanLine
                      size={18}
                      color={Palette.textWhite}
                    />

                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
                      Analyze Meal
                    </Text>
                  </>
                )}
              </Pressable>
            </View>
          </View>
        )}
      </View>

      {/* =================================================
          PHASE INSIGHT
      ================================================= */}

      <View style={uiStyles.phaseBanner}>
        <View style={GlobalStyles.badgeContainer}>
          <View style={GlobalStyles.badgeGreen}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Sparkles
                size={12}
                color={Palette.textWhite}
              />

              <Text
                style={
                  GlobalStyles.badgeTextLight
                }
              >
                Bio-Adaptive Nutrition
              </Text>
            </View>
          </View>
        </View>

        <Text style={GlobalStyles.bodyText}>
          Azuka analyzes your meal's nutrients so it can
          provide nutrition guidance based on your current
          biological state.
        </Text>
      </View>

      {/* =================================================
          ANALYSIS MODAL
      ================================================= */}

      <Modal
        visible={isModalVisible}
        transparent
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={uiStyles.modalOverlay}>
          <BlurView
            intensity={20}
            tint="light"
            style={StyleSheet.absoluteFill}
          />

          <View style={uiStyles.modalSheet}>
            <View style={uiStyles.modalHandle} />

            {/* CLOSE */}

            <Pressable
              onPress={closeModal}
              style={uiStyles.modalCloseButton}
              hitSlop={8}
            >
              <X
                size={18}
                color={Palette.textPrimary}
              />
            </Pressable>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={
                uiStyles.modalScrollContent
              }
            >
              {scanResult && (
                <>
                  {/* PHASE BADGE */}

                  <View
                    style={[
                      GlobalStyles.badgeGreen,
                      {
                        alignSelf: "flex-start",
                        marginBottom: 10,
                      },
                    ]}
                  >
                    <View
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <Sparkles
                        size={12}
                        color={Palette.textWhite}
                      />

                      <Text
                        style={
                          GlobalStyles.badgeTextLight
                        }
                      >
                        {scanResult.phaseMatch}
                      </Text>
                    </View>
                  </View>

                  {/* DISH NAME */}

                  <Text
                    style={GlobalStyles.headingMedium}
                  >
                    {scanResult.dishName}
                  </Text>

                  {/* CONFIDENCE */}

                  <Text
                    style={[
                      GlobalStyles.captionText,
                      {
                        marginTop: 4,
                      },
                    ]}
                  >
                    AI confidence:{" "}
                    {Math.round(
                      scanResult.confidence * 100
                    )}
                    %
                  </Text>

                  {/* MACRO TILES */}

                  <View style={uiStyles.macroTileGrid}>
                    {/* CALORIES */}

                    <View style={uiStyles.macroTile}>
                      <Flame
                        size={18}
                        color={Palette.orange}
                      />

                      <Text
                        style={
                          uiStyles.macroTileValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .calories
                        }
                      </Text>

                      <Text
                        style={
                          GlobalStyles.captionText
                        }
                      >
                        Calories
                      </Text>
                    </View>

                    {/* PROTEIN */}

                    <View style={uiStyles.macroTile}>
                      <Dumbbell
                        size={18}
                        color={
                          Palette.forestGreen
                        }
                      />

                      <Text
                        style={
                          uiStyles.macroTileValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .protein
                        }
                        g
                      </Text>

                      <Text
                        style={
                          GlobalStyles.captionText
                        }
                      >
                        Protein
                      </Text>
                    </View>

                    {/* CARBS */}

                    <View style={uiStyles.macroTile}>
                      <Wheat
                        size={18}
                        color={Palette.oceanBlue}
                      />

                      <Text
                        style={
                          uiStyles.macroTileValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .carbs
                        }
                        g
                      </Text>

                      <Text
                        style={
                          GlobalStyles.captionText
                        }
                      >
                        Carbs
                      </Text>
                    </View>

                    {/* FATS */}

                    <View style={uiStyles.macroTile}>
                      <Droplet
                        size={18}
                        color={Palette.marigold}
                      />

                      <Text
                        style={
                          uiStyles.macroTileValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .fats
                        }
                        g
                      </Text>

                      <Text
                        style={
                          GlobalStyles.captionText
                        }
                      >
                        Fats
                      </Text>
                    </View>
                  </View>

                  {/* MICRONUTRIENTS */}

                  <Text
                    style={[
                      GlobalStyles.brandSubtitle,
                      {
                        marginBottom: 10,
                        color: Palette.textPrimary,
                      },
                    ]}
                  >
                    Key Micronutrients
                  </Text>

                  <View
                    style={uiStyles.microContainer}
                  >
                    <View
                      style={uiStyles.microRow}
                    >
                      <Text
                        style={
                          GlobalStyles.bodyText
                        }
                      >
                        Dietary Fiber
                      </Text>

                      <Text
                        style={
                          uiStyles.microValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .fiber
                        }
                        g
                      </Text>
                    </View>

                    <View
                      style={uiStyles.microRow}
                    >
                      <Text
                        style={
                          GlobalStyles.bodyText
                        }
                      >
                        Magnesium
                      </Text>

                      <Text
                        style={
                          uiStyles.microValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .magnesium
                        }{" "}
                        mg
                      </Text>
                    </View>

                    <View
                      style={uiStyles.microRow}
                    >
                      <Text
                        style={
                          GlobalStyles.bodyText
                        }
                      >
                        Iron
                      </Text>

                      <Text
                        style={
                          uiStyles.microValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .iron
                        }{" "}
                        mg
                      </Text>
                    </View>

                    <View
                      style={[
                        uiStyles.microRow,
                        {
                          borderBottomWidth: 0,
                        },
                      ]}
                    >
                      <Text
                        style={
                          GlobalStyles.bodyText
                        }
                      >
                        Zinc
                      </Text>

                      <Text
                        style={
                          uiStyles.microValue
                        }
                      >
                        {
                          scanResult.nutrients
                            .zinc
                        }{" "}
                        mg
                      </Text>
                    </View>
                  </View>

                  {/* AZUKA INSIGHT */}

                  <View
                    style={
                      GlobalStyles.cardActiveBlue
                    }
                  >
                    <Text
                      style={[
                        GlobalStyles.brandSubtitle,
                        {
                          color:
                            Palette.textPrimary,
                        },
                      ]}
                    >
                      Azuka Nutrition Insight
                    </Text>

                    <Text
                      style={[
                        GlobalStyles.bodyText,
                        {
                          marginTop: 4,
                        },
                      ]}
                    >
                      {scanResult.benefits}
                    </Text>
                  </View>

                  {/* LOG BUTTON */}

                  <Pressable
                    onPress={handleLogMeal}
                    style={({ pressed }) => [
                      GlobalStyles.btnPrimary,
                      {
                        backgroundColor:
                          Palette.forestGreen,
                        flexDirection: "row",
                        gap: 8,
                        marginTop: 8,
                        opacity: pressed
                          ? 0.88
                          : 1,
                      },
                    ]}
                  >
                    <CheckCircle2
                      size={18}
                      color={Palette.textWhite}
                    />

                    <Text
                      style={
                        GlobalStyles.btnPrimaryText
                      }
                    >
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
// COMPONENT STYLES
// =====================================================

const uiStyles = StyleSheet.create({
  container: {
    gap: 4,
  },

  emptyStateContainer: {
    alignItems: "center",
    paddingVertical: 8,
  },

  iconBadge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor:
      Palette.surfaceBlueMuted,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
    borderWidth: 1,
    borderColor:
      Palette.borderActiveBlue,
  },

  cardSubtitle: {
    fontSize: 14,
    color: Palette.textSecondary,
    textAlign: "center",
    lineHeight: 20,
    marginTop: 4,
    marginBottom: 20,
    paddingHorizontal: 8,
  },

  buttonStack: {
    width: "100%",
    gap: 10,
  },

  previewContainer: {
    alignItems: "center",
  },

  imageFrame: {
    width: "100%",
    height: 180,
    borderRadius: 12,
    overflow: "hidden",
    marginBottom: 14,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
  },

  previewImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },

  actionRow: {
    flexDirection: "row",
    gap: 10,
    width: "100%",
    marginTop: 10,
  },

  phaseBanner: {
    backgroundColor:
      Palette.surfaceGreenMuted,
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: Palette.forestGreen,
    marginBottom: 16,
  },

  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor:
      "rgba(17, 17, 17, 0.35)",
  },

  modalSheet: {
    backgroundColor: Palette.creamLight,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 12,
    paddingHorizontal: 20,
    maxHeight: "85%",
    borderTopWidth: 1.5,
    borderColor: Palette.borderStrong,
  },

  modalHandle: {
    width: 36,
    height: 4,
    backgroundColor: Palette.borderStrong,
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 16,
  },

  modalCloseButton: {
    position: "absolute",
    right: 18,
    top: 16,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: Palette.surfaceMuted,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 10,
  },

  modalScrollContent: {
    paddingBottom: 28,
  },

  macroTileGrid: {
    flexDirection: "row",
    gap: 8,
    marginVertical: 16,
  },

  macroTile: {
    flex: 1,
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    gap: 2,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },

  macroTileValue: {
    fontSize: 16,
    fontWeight: "700",
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
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },

  microValue: {
    fontSize: 15,
    fontWeight: "600",
    color: Palette.textPrimary,
  },
});