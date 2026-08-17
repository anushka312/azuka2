import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';

interface RecipeModalProps {
  visible: boolean;
  onClose: () => void;
}

export default function RecipeModal({
  visible,
  onClose,
}: RecipeModalProps) {
  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
    >
      <View style={styles.recipeModalBackdrop}>
        <View style={styles.recipeModalContainer}>

          <View style={styles.recipeModalHeader}>
            <View
              style={[
                styles.recipeIconBg,
                {
                  width: 60,
                  height: 60,
                  borderRadius: 30,
                },
              ]}
            >
              <Text style={{ fontSize: 32 }}>
                🥑
              </Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtnModal}
            >
              <Ionicons
                name="close"
                size={24}
                color={Palette.textPrimary}
              />
            </TouchableOpacity>
          </View>

          <Text style={[GlobalStyles.headingLarge,{marginTop: -20}]}>
            Magnesium Avocado Cacao Bowl
          </Text>

          <Text
            style={[
              GlobalStyles.bodyText,
              {
                color: Palette.forestGreen,
                marginTop: 8,
              },
            ]}
          >
            Reduces PMS cramping & supports progesterone
            metabolism
          </Text>

          <View style={[styles.macroRow, {marginTop: 10}]}>
            <View style={[styles.macroBox, {backgroundColor: Palette.marigold}]}>
              <Text style={styles.macroVal}>380</Text>
              <Text style={GlobalStyles.badgeTextDark}>kcal</Text>
            </View>

            <View style={[styles.macroBox, {backgroundColor: Palette.marigold}]}>
              <Text style={styles.macroVal}>12g</Text>
              <Text style={GlobalStyles.badgeTextDark}>Protein</Text>
            </View>

            <View style={[styles.macroBox, {backgroundColor: Palette.marigold}]}>
              <Text style={styles.macroVal}>28g</Text>
              <Text style={GlobalStyles.badgeTextDark}>Carbs</Text>
            </View>

            <View style={[styles.macroBox, {backgroundColor: Palette.marigold}]}>
              <Text style={styles.macroVal}>24g</Text>
              <Text style={GlobalStyles.badgeTextDark}>Fat</Text>
            </View>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{
              flex: 1,
              marginTop: 24,
            }}
          >
            {/* Ingredients */}
            <View style={styles.instructionSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="list"
                  size={18}
                  color={Palette.forestGreen}
                />

                <Text style={styles.instructionTitle}>
                  Ingredients
                </Text>
              </View>

              <Text style={styles.bulletText}>
                • 1 ripe avocado, halved
              </Text>

              <Text style={styles.bulletText}>
                • 2 tbsp raw cacao powder
              </Text>

              <Text style={styles.bulletText}>
                • 1 tbsp maple syrup
              </Text>

              <Text style={styles.bulletText}>
                • ¼ cup almond milk
              </Text>

              <Text style={styles.bulletText}>
                • Pinch of sea salt
              </Text>

              <Text style={styles.bulletText}>
                • Pumpkin seeds & hemp hearts to top
              </Text>
            </View>

            {/* Method */}
            <View style={styles.instructionSection}>
              <View style={styles.sectionTitleRow}>
                <Ionicons
                  name="restaurant"
                  size={18}
                  color={Palette.forestGreen}
                />

                <Text style={styles.instructionTitle}>
                  Method
                </Text>
              </View>

              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: '700' }}>
                  1.
                </Text>{' '}
                Blend avocado, cacao, maple syrup, and
                almond milk until silky smooth.
              </Text>

              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: '700' }}>
                  2.
                </Text>{' '}
                Pour into a bowl and season lightly with
                sea salt.
              </Text>

              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: '700' }}>
                  3.
                </Text>{' '}
                Top with pumpkin seeds and hemp hearts.
              </Text>

              <Text style={styles.bulletText}>
                <Text style={{ fontWeight: '700' }}>
                  4.
                </Text>{' '}
                Serve immediately or refrigerate for up to
                4 hrs.
              </Text>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}