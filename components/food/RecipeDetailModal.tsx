import React, { useState, useEffect } from 'react';
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

interface RecipeDetailModalProps {
    visible: boolean;
    recipe: Recipe | null;
    onClose: () => void;
    onToggleConsumed?: (recipeId: string, consumed: boolean) => void;
}

export default function RecipeDetailModal({
    visible,
    recipe,
    onClose,
    onToggleConsumed,
}: RecipeDetailModalProps) {
    // 1. ALL HOOKS MUST RUN UNCONDITIONALLY AT THE TOP
    const [isConsumed, setIsConsumed] = useState<boolean>(() => !!recipe?.isConsumed);

    useEffect(() => {
        setIsConsumed(!!recipe?.isConsumed);
    }, [recipe?.id, recipe?.isConsumed]);

    // 2. EARLY RETURNS CAN ONLY HAPPEN AFTER ALL HOOKS ARE CALLED
    if (!recipe) {
        return null;
    }

    const handleToggleConsumed = () => {
        const nextState = !isConsumed;
        setIsConsumed(nextState);
        if (onToggleConsumed) {
            onToggleConsumed(recipe.id, nextState);
        }
    };

    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <BlurView
                    intensity={50}
                    tint="dark"
                    style={styles.modalBackdrop}
                />
                <View style={styles.modal}>

                    {/* HANDLE */}
                    <View style={styles.modalHandle} />

                    {/* CLOSE */}
                    <Pressable
                        onPress={onClose}
                        style={styles.modalClose}
                    >
                        <X
                            size={19}
                            color={Palette.textPrimary}
                        />
                    </Pressable>

                    {/* RECIPE IMAGE AREA */}
                    <View
                        style={[
                            styles.modalImage,
                            {
                                backgroundColor: `${recipe.color}18`,
                            },
                        ]}
                    >
                        <Flame
                            size={58}
                            color={recipe.color}
                        />
                    </View>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{
                            paddingBottom: 25,
                        }}
                    >
                        <View style={styles.modalContent}>

                            {/* TITLE */}
                            <Text style={styles.modalTitle}>
                                {recipe.name}
                            </Text>

                            <Text style={styles.modalDescription}>
                                {recipe.description}
                            </Text>

                            {/* STATS */}
                            <View style={styles.modalStats}>
                                <View style={styles.modalStat}>
                                    <Clock
                                        size={17}
                                        color={Palette.oceanBlue}
                                    />

                                    <Text style={styles.modalStatValue}>
                                        {recipe.time} min
                                    </Text>

                                    <Text style={styles.modalStatLabel}>
                                        Prep time
                                    </Text>
                                </View>

                                <View style={styles.modalStat}>
                                    <Flame
                                        size={17}
                                        color={Palette.orange}
                                    />

                                    <Text style={styles.modalStatValue}>
                                        {recipe.calories}
                                    </Text>

                                    <Text style={styles.modalStatLabel}>
                                        Calories
                                    </Text>
                                </View>

                                <View style={styles.modalStat}>
                                    <Users
                                        size={17}
                                        color={Palette.forestGreen}
                                    />

                                    <Text style={styles.modalStatValue}>
                                        {recipe.protein}g
                                    </Text>

                                    <Text style={styles.modalStatLabel}>
                                        Protein
                                    </Text>
                                </View>
                            </View>

                            {/* LOG CONSUMED TOGGLE */}
                            <Pressable
                                onPress={handleToggleConsumed}
                                style={[
                                    styles.doneButton,
                                    {
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        gap: 8,
                                        backgroundColor: isConsumed
                                            ? Palette.forestGreen
                                            : Palette.oceanBlue,
                                        marginBottom: 16,
                                    },
                                ]}
                            >
                                {isConsumed ? (
                                    <CheckCircle2 size={18} color="#FFFFFF" />
                                ) : (
                                    <PlusCircle size={18} color="#FFFFFF" />
                                )}
                                <Text style={styles.doneButtonText}>
                                    {isConsumed ? 'Eaten Today' : 'I Ate This Today'}
                                </Text>
                            </Pressable>

                            {/* INGREDIENTS */}
                            <Text style={styles.modalSectionTitle}>
                                Ingredients
                            </Text>

                            {recipe.ingredients.map(
                                (ingredient) => (
                                    <View
                                        key={ingredient}
                                        style={styles.ingredient}
                                    >
                                        <View
                                            style={styles.ingredientDot}
                                        />

                                        <Text
                                            style={styles.ingredientText}
                                        >
                                            {ingredient}
                                        </Text>
                                    </View>
                                )
                            )}

                            {/* WHY */}
                            <View style={styles.whyBox}>
                                <Text style={styles.whyTitle}>
                                    Why Azuka recommends this
                                </Text>

                                <Text style={styles.whyText}>
                                    {recipe.whyItHelps}
                                </Text>
                            </View>

                            {/* CLOSE BUTTON */}
                            <Pressable
                                onPress={onClose}
                                style={[styles.doneButton, { backgroundColor: Palette.surfaceBlueMuted }]}
                            >
                                <Text style={[styles.doneButtonText, { color: Palette.textPrimary }]}>
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