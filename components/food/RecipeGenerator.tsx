import React, { useMemo, useState, useEffect, useCallback } from 'react';
import {
  Pressable,
  Text,
  TextInput,
  View,
  Alert,
} from 'react-native';
import {
  ChevronRight,
  Clock,
  Filter,
  Flame,
  Search,
  Users,
  X,
  Sparkles,
} from 'lucide-react-native';

import { Palette, GlobalStyles } from '@/constants/Styles';
import { styles } from './foodStyles';
import RecipeDetailModal, { Recipe } from './RecipeDetailModal';
import { aiService, RecipeItem, AzukaDailyOutput } from '@/services/aiService';
import { RecipeCardSkeleton, Skeleton } from '@/components/ui/Skeleton';
import { ErrorCard } from '@/components/ui/StateFeedback';

const DEFAULT_RECIPES: Recipe[] = [
  {
    id: '1',
    name: 'High-Protein Buddha Bowl',
    time: 25,
    calories: 520,
    protein: 42,
    phase: 'Luteal',
    tags: ['Anti-inflammatory', 'Iron-rich'],
    color: Palette.orange,
    description:
      'A balanced bowl with complex carbohydrates, protein and micronutrients designed to keep you satisfied during the luteal phase.',
    ingredients: [
      'Quinoa',
      'Chickpeas',
      'Roasted sweet potato',
      'Spinach',
      'Pumpkin seeds',
      'Tahini dressing',
    ],
    whyItHelps:
      'Complex carbohydrates provide sustained energy while pumpkin seeds and leafy greens add magnesium and iron-rich nutrients.',
  },
  {
    id: '2',
    name: 'Quinoa Power Salad',
    time: 15,
    calories: 380,
    protein: 18,
    phase: 'Ovulatory',
    tags: ['Energy boost', 'Light'],
    color: Palette.oceanBlue,
    description:
      'A fresh, nutrient-dense salad designed for lighter meals during the higher-energy part of the cycle.',
    ingredients: [
      'Quinoa',
      'Cucumber',
      'Cherry tomatoes',
      'Avocado',
      'Mixed greens',
      'Lemon dressing',
    ],
    whyItHelps:
      'Fresh vegetables, healthy fats and complex carbohydrates provide a light but nutrient-dense meal.',
  },
  {
    id: '3',
    name: 'Sweet Potato & Chicken',
    time: 35,
    calories: 480,
    protein: 38,
    phase: 'Luteal',
    tags: ['Comfort', 'Carb support'],
    color: Palette.orange,
    description:
      'A warm and satisfying combination of lean protein and slow-digesting carbohydrates.',
    ingredients: [
      'Chicken breast',
      'Sweet potato',
      'Broccoli',
      'Olive oil',
      'Garlic',
      'Mixed herbs',
    ],
    whyItHelps:
      'The combination of protein and complex carbohydrates can make this a satisfying option when appetite and energy needs increase.',
  },
  {
    id: '4',
    name: 'Salmon Omega Bowl',
    time: 20,
    calories: 550,
    protein: 45,
    phase: 'Follicular',
    tags: ['Brain boost', 'Omega-3'],
    color: Palette.forestGreen,
    description:
      'A protein-rich salmon bowl with healthy fats and nutrient-dense vegetables.',
    ingredients: [
      'Salmon',
      'Brown rice',
      'Avocado',
      'Spinach',
      'Sesame seeds',
      'Soy-ginger dressing',
    ],
    whyItHelps:
      'Salmon provides high-quality protein and omega-3 fatty acids alongside nutrient-rich vegetables.',
  },
];

const phases = [
  'All',
  'Menstrual',
  'Follicular',
  'Ovulatory',
  'Luteal',
];

export default function RecipeGenerator() {
  const [recipesList, setRecipesList] = useState<Recipe[]>(DEFAULT_RECIPES);
  const [foodComment, setFoodComment] = useState<string>(
    'Focus on complex carbs, magnesium, protein and anti-inflammatory foods to support your current phase.'
  );
  
  // Loading & Error states
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [search, setSearch] = useState('');
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedPhase, setSelectedPhase] = useState('All');
  const [showFilters, setShowFilters] = useState(false);

  // Fetch AI-generated nutrition recommendations & recipes from FastAPI
  const fetchNutritionGuidance = useCallback(async () => {
    try {
      setLoading(true);
      setErrorMsg(null);
      const plan: AzukaDailyOutput = await aiService.getLatestDailyPlan('default_user');
      
      if (plan) {
        if (plan.food_comment) {
          setFoodComment(plan.food_comment);
        }
        if (plan.recipes && plan.recipes.length > 0) {
          const mapped: Recipe[] = plan.recipes.map((r: RecipeItem, idx: number) => ({
            id: `ai-recipe-${idx}`,
            name: r.name,
            time: 20,
            calories: r.calories || 450,
            protein: r.protein || 30,
            phase: r.tags?.some(t => t.toLowerCase().includes('luteal')) ? 'Luteal' : 'Follicular',
            tags: r.tags || ['Bio-Adaptive', 'High-Protein'],
            color: idx % 2 === 0 ? Palette.orange : Palette.forestGreen,
            description: r.description || 'Nutrient-rich bio-adaptive meal.',
            ingredients: r.ingredients || [],
            whyItHelps: r.comments || 'Specifically recommended to support your metabolic phase.',
          }));

          setRecipesList([...mapped, ...DEFAULT_RECIPES]);
        }
      }
    } catch (err: any) {
      console.warn('[RecipeGenerator] Error loading recipe guidance:', err);
      setErrorMsg('Could not fetch live recipes from engine. Displaying offline library.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNutritionGuidance();
  }, [fetchNutritionGuidance]);

  const filteredRecipes = useMemo(() => {
    const query = search.trim().toLowerCase();

    return recipesList.filter((recipe) => {
      const matchesSearch =
        !query ||
        recipe.name.toLowerCase().includes(query) ||
        recipe.phase.toLowerCase().includes(query) ||
        recipe.tags.some((tag) =>
          tag.toLowerCase().includes(query)
        );

      const matchesPhase =
        selectedPhase === 'All' ||
        recipe.phase === selectedPhase;

      return matchesSearch && matchesPhase;
    });
  }, [search, selectedPhase, recipesList]);

  return (
    <View>
      {/* =========================
          SEARCH & FILTER ROW
      ========================= */}
      <View style={styles.searchRow}>
        <View style={styles.searchBox}>
          <Search size={18} color={Palette.textMuted} />
          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes..."
            placeholderTextColor={Palette.textSubtle}
            style={styles.searchInput}
          />
          {search.length > 0 && (
            <Pressable onPress={() => setSearch('')}>
              <X size={16} color={Palette.textMuted} />
            </Pressable>
          )}
        </View>

        {/* FILTER BUTTON */}
        <Pressable
          onPress={() => setShowFilters((previous) => !previous)}
          style={[
            styles.filterButton,
            showFilters && styles.filterButtonActive,
          ]}
        >
          <Filter
            size={19}
            color={
              showFilters
                ? Palette.textWhite
                : Palette.oceanBlue
            }
          />
          {selectedPhase !== 'All' && (
            <View style={styles.filterDot} />
          )}
        </Pressable>
      </View>

      {/* =========================
          FILTER PANEL
      ========================= */}
      {showFilters && (
        <View style={styles.filterPanel}>
          <View style={styles.filterHeader}>
            <Text style={styles.filterTitle}>
              Filter by phase
            </Text>
            <Pressable onPress={() => setShowFilters(false)}>
              <X size={17} color={Palette.textSecondary} />
            </Pressable>
          </View>

          <View style={styles.filterOptions}>
            {phases.map((phase) => {
              const isSelected = selectedPhase === phase;

              return (
                <Pressable
                  key={phase}
                  onPress={() => {
                    setSelectedPhase(phase);
                    setShowFilters(false);
                  }}
                  style={[
                    styles.filterChip,
                    isSelected && styles.filterChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected && styles.filterChipTextActive,
                    ]}
                  >
                    {phase}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      )}

      {/* =========================
          ACTIVE FILTER
      ========================= */}
      {selectedPhase !== 'All' && (
        <View style={styles.activeFilterRow}>
          <Text style={styles.activeFilterText}>
            Showing {selectedPhase} recipes
          </Text>
          <Pressable onPress={() => setSelectedPhase('All')}>
            <Text style={styles.clearFilterText}>
              Clear
            </Text>
          </Pressable>
        </View>
      )}

      {/* ERROR CARD */}
      {errorMsg && (
        <ErrorCard
          title="Nutrition Sync Notice"
          message={errorMsg}
          onRetry={fetchNutritionGuidance}
        />
      )}

      {/* =========================
          PHASE RECOMMENDATION
      ========================= */}
      {loading ? (
        <View style={[styles.phaseCard, { gap: 8 }]}>
          <Skeleton width="60%" height={20} />
          <Skeleton width="100%" height={14} />
          <Skeleton width="85%" height={14} />
        </View>
      ) : (
        <View style={styles.phaseCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 4 }}>
            <Sparkles size={16} color={Palette.orange} />
            <Text style={styles.phaseTitle}>
              Bio-Adaptive Nutrition Strategy
            </Text>
          </View>

          <Text style={styles.phaseText}>
            {foodComment}
          </Text>
        </View>
      )}

      {/* =========================
          RECIPE CARDS / SKELETONS
      ========================= */}
      {loading ? (
        <View style={{ gap: 16 }}>
          <RecipeCardSkeleton />
          <RecipeCardSkeleton />
        </View>
      ) : (
        filteredRecipes.map((recipe) => (
          <Pressable
            key={recipe.id}
            onPress={() => setSelectedRecipe(recipe)}
            style={({ pressed }) => [
              styles.recipeCard,
              {
                opacity: pressed ? 0.92 : 1,
                transform: [{ scale: pressed ? 0.985 : 1 }],
              },
            ]}
          >
            {/* IMAGE PLACEHOLDER */}
            <View
              style={[
                styles.recipeImage,
                { backgroundColor: `${recipe.color}18` },
              ]}
            >
              <Flame size={48} color={recipe.color} />
            </View>

            {/* CONTENT */}
            <View style={styles.recipeContent}>
              <View style={styles.recipeHeader}>
                <Text style={styles.recipeName}>
                  {recipe.name}
                </Text>
                <ChevronRight size={20} color={Palette.textMuted} />
              </View>

              {/* META */}
              <View style={styles.recipeMetaRow}>
                <View style={styles.recipeMeta}>
                  <Clock size={13} color={Palette.textSecondary} />
                  <Text style={styles.recipeMetaText}>
                    {recipe.time} min
                  </Text>
                </View>

                <View style={styles.recipeMeta}>
                  <Flame size={13} color={Palette.textSecondary} />
                  <Text style={styles.recipeMetaText}>
                    {recipe.calories} cal
                  </Text>
                </View>

                <View style={styles.recipeMeta}>
                  <Users size={13} color={Palette.textSecondary} />
                  <Text style={styles.recipeMetaText}>
                    {recipe.protein}g protein
                  </Text>
                </View>
              </View>

              {/* TAGS */}
              <View style={styles.tagRow}>
                <View style={styles.phaseBadge}>
                  <Text style={styles.phaseBadgeText}>
                    {recipe.phase}
                  </Text>
                </View>

                {recipe.tags.map((tag) => (
                  <View key={tag} style={styles.tag}>
                    <Text style={styles.tagText}>
                      {tag}
                    </Text>
                  </View>
                ))}
              </View>
            </View>
          </Pressable>
        ))
      )}

      {/* =========================
          EMPTY STATE
      ========================= */}
      {!loading && filteredRecipes.length === 0 && (
        <View style={styles.emptyState}>
          <Search size={30} color={Palette.textMuted} />
          <Text style={styles.emptyTitle}>
            No recipes found
          </Text>
          <Text style={styles.emptyText}>
            Try another search or change your phase filter.
          </Text>
        </View>
      )}

      {/* =========================
          RECIPE DETAIL MODAL
      ========================= */}
      <RecipeDetailModal
        visible={selectedRecipe !== null}
        recipe={selectedRecipe}
        onClose={() => setSelectedRecipe(null)}
      />
    </View>
  );
}