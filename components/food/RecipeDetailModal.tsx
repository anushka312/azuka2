import React, {
  useState,
  useEffect,
} from 'react';

import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { BlurView } from 'expo-blur';

import {
  Clock,
  Flame,
  Users,
  X,
  CheckCircle2,
  PlusCircle,
} from 'lucide-react-native';

import { Palette } from '@/constants/Styles';
import { styles } from './foodStyles';

/* =====================================================
   RECIPE TYPE
   ===================================================== */

export interface Recipe {
  id: string;

  name: string;

  time: number;

  calories: number;

  protein: number;

  phase: string;

  tags: string[];

  color: string;

  description: string;

  ingredients: string[];

  whyItHelps: string;

  isConsumed?: boolean;
}

/* =====================================================
   PROPS
   ===================================================== */

interface RecipeDetailModalProps {
  visible: boolean;

  recipe: Recipe | null;

  onClose: () => void;

  onToggleConsumed?: (
    recipeId: string,
    consumed: boolean
  ) => void;
}

/* =====================================================
   COMPONENT
   ===================================================== */

export default function RecipeDetailModal({
  visible,
  recipe,
  onClose,
  onToggleConsumed,
}: RecipeDetailModalProps) {

  /*
   * IMPORTANT:
   *
   * Hooks are called before the early return.
   */
  const [isConsumed, setIsConsumed] =
    useState<boolean>(
      () => !!recipe?.isConsumed
    );

  /* ===================================================
     SYNC LOCAL STATE WHEN RECIPE CHANGES
     =================================================== */

  useEffect(() => {
    setIsConsumed(
      !!recipe?.isConsumed
    );
  }, [
    recipe?.id,
    recipe?.isConsumed,
  ]);

  /* ===================================================
     EARLY RETURN
     =================================================== */

  if (!recipe) {
    return null;
  }

  /* ===================================================
     TOGGLE CONSUMED
     =================================================== */

  const handleToggleConsumed = () => {

    const nextState = !isConsumed;

    setIsConsumed(nextState);

    /*
     * Parent component updates its recipe list.
     *
     * At the moment this is local/UI state because
     * api.ts does not have a recipe-consumption endpoint.
     */
    onToggleConsumed?.(
      recipe.id,
      nextState
    );
  };

  /* ===================================================
     RENDER
     =================================================== */

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >

      <View style={styles.modalOverlay}>

        {/* BACKDROP */}

        <BlurView
          intensity={50}
          tint="dark"
          style={styles.modalBackdrop}
        />

        {/* MODAL */}

        <View style={styles.modal}>

          {/* HANDLE */}

          <View
            style={styles.modalHandle}
          />

          {/* CLOSE */}

          <Pressable
            onPress={onClose}
            style={styles.modalClose}
            hitSlop={8}
          >
            <X
              size={19}
              color={Palette.textPrimary}
            />
          </Pressable>

          {/* RECIPE IMAGE */}

          <View
            style={[
              styles.modalImage,
              {
                backgroundColor:
                  `${recipe.color}18`,
              },
            ]}
          >
            <Flame
              size={58}
              color={recipe.color}
            />
          </View>

          {/* CONTENT */}

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{
              paddingBottom: 25,
            }}
          >

            <View style={styles.modalContent}>

              {/* TITLE */}

              <Text
                style={styles.modalTitle}
              >
                {recipe.name}
              </Text>

              {/* DESCRIPTION */}

              <Text
                style={styles.modalDescription}
              >
                {recipe.description}
              </Text>

              {/* STATS */}

              <View
                style={styles.modalStats}
              >

                <View
                  style={styles.modalStat}
                >
                  <Clock
                    size={17}
                    color={Palette.oceanBlue}
                  />

                  <Text
                    style={
                      styles.modalStatValue
                    }
                  >
                    {recipe.time} min
                  </Text>

                  <Text
                    style={
                      styles.modalStatLabel
                    }
                  >
                    Prep time
                  </Text>
                </View>

                <View
                  style={styles.modalStat}
                >
                  <Flame
                    size={17}
                    color={Palette.orange}
                  />

                  <Text
                    style={
                      styles.modalStatValue
                    }
                  >
                    {recipe.calories}
                  </Text>

                  <Text
                    style={
                      styles.modalStatLabel
                    }
                  >
                    Calories
                  </Text>
                </View>

                <View
                  style={styles.modalStat}
                >
                  <Users
                    size={17}
                    color={
                      Palette.forestGreen
                    }
                  />

                  <Text
                    style={
                      styles.modalStatValue
                    }
                  >
                    {recipe.protein}g
                  </Text>

                  <Text
                    style={
                      styles.modalStatLabel
                    }
                  >
                    Protein
                  </Text>
                </View>

              </View>

              {/* PHASE */}

              <View
                style={{
                  alignSelf: 'flex-start',
                  backgroundColor:
                    Palette.surfaceBlueMuted,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  borderRadius: 10,
                  marginBottom: 16,
                }}
              >
                <Text
                  style={{
                    color:
                      Palette.textPrimary,
                    fontSize: 12,
                    fontWeight: '700',
                  }}
                >
                  {recipe.phase} Phase
                </Text>
              </View>

              {/* CONSUMED BUTTON */}

              <Pressable
                onPress={
                  handleToggleConsumed
                }
                style={[
                  styles.doneButton,
                  {
                    flexDirection:
                      'row',
                    alignItems:
                      'center',
                    justifyContent:
                      'center',
                    gap: 8,
                    backgroundColor:
                      isConsumed
                        ? Palette.forestGreen
                        : Palette.oceanBlue,
                    marginBottom: 16,
                  },
                ]}
              >

                {isConsumed ? (
                  <CheckCircle2
                    size={18}
                    color="#FFFFFF"
                  />
                ) : (
                  <PlusCircle
                    size={18}
                    color="#FFFFFF"
                  />
                )}

                <Text
                  style={
                    styles.doneButtonText
                  }
                >
                  {isConsumed
                    ? 'Eaten Today'
                    : 'I Ate This Today'}
                </Text>

              </Pressable>

              {/* INGREDIENTS */}

              <Text
                style={
                  styles.modalSectionTitle
                }
              >
                Ingredients
              </Text>

              {recipe.ingredients.map(
                (ingredient, index) => (
                  <View
                    key={`${ingredient}-${index}`}
                    style={styles.ingredient}
                  >

                    <View
                      style={
                        styles.ingredientDot
                      }
                    />

                    <Text
                      style={
                        styles.ingredientText
                      }
                    >
                      {ingredient}
                    </Text>

                  </View>
                )
              )}

              {/* WHY */}

              <View
                style={styles.whyBox}
              >

                <Text
                  style={styles.whyTitle}
                >
                  Why Azuka recommends
                  this
                </Text>

                <Text
                  style={styles.whyText}
                >
                  {recipe.whyItHelps}
                </Text>

              </View>

              {/* CLOSE */}

              <Pressable
                onPress={onClose}
                style={[
                  styles.doneButton,
                  {
                    backgroundColor:
                      Palette.surfaceBlueMuted,
                  },
                ]}
              >
                <Text
                  style={[
                    styles.doneButtonText,
                    {
                      color:
                        Palette.textPrimary,
                    },
                  ]}
                >
                  Close
                </Text>
              </Pressable>

            </View>

          </ScrollView>

        </View>

      </View>

    </Modal>
  );
}