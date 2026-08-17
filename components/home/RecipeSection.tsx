import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    ScrollView,
} from 'react-native';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';

interface RecipeSectionProps {
    onRecipeSelect: (recipe: string) => void;
}

export default function RecipeSection({
    onRecipeSelect,
}: RecipeSectionProps) {
    return (
        <>
            {/* Section Header */}
            <View style={styles.sectionHeader}>
                <View>
                    <Text style={[GlobalStyles.headingMedium, { color: Palette.orange }]}>
                        Cycle-Synced Recipes
                    </Text>

                    <Text style={GlobalStyles.captionText}>
                        Tailored to Luteal phase needs
                    </Text>
                </View>
            </View>

            {/* Horizontal Recipe Cards */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.recipeScroll}
                contentContainerStyle={{
                    paddingRight: 16,
                }}
            >
                {/* Recipe 1 */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.recipeCard}
                    onPress={() => onRecipeSelect('magnesium')}
                >
                    <View style={styles.recipeIconBg}>
                        <Text style={{ fontSize: 24 }}>
                            🥑
                        </Text>
                    </View>

                    <Text style={styles.recipeTitle}>
                        Magnesium Avocado Cacao Bowl
                    </Text>

                    <View style={styles.recipeTags}>
                        <View style={GlobalStyles.badgeMuted}>
                            <Text style={GlobalStyles.badgeTextMuted}>
                                Anti-Inflammatory
                            </Text>
                        </View>

                        <View style={GlobalStyles.badgeMuted}>
                            <Text style={GlobalStyles.badgeTextMuted}>
                                Magnesium
                            </Text>
                        </View>
                    </View>

                    <Text style={GlobalStyles.captionText}>
                        ⏱ 10 min
                    </Text>
                </TouchableOpacity>

                {/* Recipe 2 */}
                <TouchableOpacity
                    activeOpacity={0.9}
                    style={styles.recipeCard}
                >
                    <View
                        style={[
                            styles.recipeIconBg,
                            {
                                backgroundColor: Palette.surfaceOrangeMuted,
                            },
                        ]}
                    >
                        <Text style={{ fontSize: 24 }}>
                            🍠
                        </Text>
                    </View>

                    <Text style={styles.recipeTitle}>
                        Roasted Sweet Potato & Chickpea Salad
                    </Text>

                    <View style={styles.recipeTags}>
                        <View style={GlobalStyles.badgeMuted}>
                            <Text style={GlobalStyles.badgeTextMuted}>
                                Complex Carbs
                            </Text>
                        </View>

                        <View style={GlobalStyles.badgeMuted}>
                            <Text style={GlobalStyles.badgeTextMuted}>
                                Iron
                            </Text>
                        </View>
                    </View>

                    <Text style={GlobalStyles.captionText}>
                        ⏱ 25 min
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </>
    );
}