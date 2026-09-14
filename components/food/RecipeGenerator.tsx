
import React, {
  useMemo,
  useState,
  useEffect,
  useCallback,
} from 'react';

import {
  Pressable,
  Text,
  TextInput,
  View,
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

import { Palette } from '@/constants/Styles';
import { styles } from './foodStyles';

import RecipeDetailModal, {
  Recipe,
} from './RecipeDetailModal';

import { useAzuka } from '@/contexts/AzukaContext';

import {
  RecipeCardSkeleton,
  Skeleton,
} from '@/components/ui/Skeleton';

import { ErrorCard } from '@/components/ui/StateFeedback';


// =====================================================
// FALLBACK PHASES
// =====================================================

const phases = [
  'All',
  'Menstrual',
  'Follicular',
  'Ovulatory',
  'Luteal',
];


// =====================================================
// HELPER — DETERMINE RECIPE PHASE
// =====================================================

function getRecipePhase(recipe: any): string {
  const tags = Array.isArray(recipe?.tags)
    ? recipe.tags
    : [];

  const phaseTag = tags.find((tag: any) => {
    const normalized = String(tag).toLowerCase();

    return phases
      .filter((phase) => phase !== 'All')
      .some(
        (phase) =>
          normalized === phase.toLowerCase() ||
          normalized.includes(phase.toLowerCase())
      );
  });

  if (phaseTag) {
    const normalized = String(phaseTag).toLowerCase();

    if (normalized.includes('menstrual')) {
      return 'Menstrual';
    }

    if (normalized.includes('follicular')) {
      return 'Follicular';
    }

    if (normalized.includes('ovulatory')) {
      return 'Ovulatory';
    }

    if (normalized.includes('luteal')) {
      return 'Luteal';
    }
  }

  return 'All';
}


// =====================================================
// HELPER — MAP AZUKA RECIPE TO UI RECIPE
// =====================================================

function mapAzukaRecipeToUiRecipe(
  recipe: any,
  index: number
): Recipe {
  const phase = getRecipePhase(recipe);

  return {
    id:
      recipe?._id ??
      recipe?.id ??
      `recipe-${index}-${recipe?.name ?? 'recipe'}`,

    name:
      recipe?.name ??
      recipe?.title ??
      'Personalized Recipe',

    time:
      typeof recipe?.time === 'number'
        ? recipe.time
        : recipe?.time
          ? Number.parseInt(
              String(recipe.time),
              10
            ) || 20
          : 20,

    calories:
      typeof recipe?.calories === 'number'
        ? recipe.calories
        : 0,

    protein:
      typeof recipe?.protein === 'number'
        ? recipe.protein
        : 0,

    phase,

    tags:
      Array.isArray(recipe?.tags) &&
      recipe.tags.length > 0
        ? recipe.tags
        : ['Bio-Adaptive'],

    color:
      index % 2 === 0
        ? Palette.orange
        : Palette.forestGreen,

    description:
      recipe?.description ||
      'A nutrient-rich meal recommended by Azuka.',

    ingredients:
      Array.isArray(recipe?.ingredients)
        ? recipe.ingredients
        : [],

    whyItHelps:
      recipe?.comments ||
      recipe?.whyItHelps ||
      'Recommended by Azuka based on your nutritional needs.',

    isConsumed:
      recipe?.isConsumed ?? false,
  };
}


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function RecipeGenerator() {

  // ===================================================
  // AZUKA CONTEXT
  //
  // The currently authenticated user's recipes are
  // already loaded by AzukaContext.
  //
  // NO default_user.
  // NO hardcoded user ID.
  // NO direct getRecipes() call.
  // ===================================================

  const {
    recipes,
    isLoading,
    isGeneratingPlan,
    error,
    refreshRecipes,
    generatePlan,
  } = useAzuka();


  // ===================================================
  // LOCAL UI STATE
  // ===================================================

  const [foodComment, setFoodComment] = useState(
    'Your personalized nutrition recommendations will appear here.'
  );

  const [search, setSearch] = useState('');

  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null);

  const [selectedPhase, setSelectedPhase] =
    useState('All');

  const [showFilters, setShowFilters] =
    useState(false);


  // ===================================================
  // MAP CONTEXT RECIPES TO UI RECIPES
  // ===================================================

  const recipesList = useMemo(() => {
    if (!recipes || recipes.length === 0) {
      return [];
    }

    return recipes.map(
      (recipe: any, index: number) =>
        mapAzukaRecipeToUiRecipe(
          recipe,
          index
        )
    );
  }, [recipes]);


  // ===================================================
  // DEBUG
  // ===================================================

  useEffect(() => {
    console.log(
      '[RecipeGenerator] Recipes from AzukaContext:',
      recipes
    );
  }, [recipes]);


  // ===================================================
  // UPDATE NUTRITION COMMENT
  // ===================================================

  useEffect(() => {
    if (!recipes || recipes.length === 0) {
      setFoodComment(
        'No personalized recipes have been generated yet. Check back after Azuka creates your nutrition plan.'
      );

      return;
    }

    setFoodComment(
      'These recipes have been personalized by Azuka to support your current nutritional and cycle needs.'
    );
  }, [recipes]);


  // ===================================================
  // REFRESH RECIPES
  // ===================================================

  const fetchNutritionGuidance =
    useCallback(async () => {
      try {
        console.log(
          '[RecipeGenerator] Refreshing recipes through AzukaContext...'
        );

        await refreshRecipes();

        console.log(
          '[RecipeGenerator] Recipes refreshed successfully.'
        );

      } catch (err) {
        console.warn(
          '[RecipeGenerator] Error refreshing recipes:',
          err
        );
      }
    }, [refreshRecipes]);


  // ===================================================
  // GENERATE DAILY PLAN
  // ===================================================

  const handleGeneratePlan =
    useCallback(async () => {
      try {
        console.log(
          '[RecipeGenerator] Generating daily plan through AzukaContext...'
        );

        await generatePlan();

        console.log(
          '[RecipeGenerator] Daily plan generated successfully.'
        );

      } catch (err) {
        console.error(
          '[RecipeGenerator] Failed to generate daily plan:',
          err
        );
      }
    }, [generatePlan]);


  // ===================================================
  // FILTER RECIPES
  // ===================================================

  const filteredRecipes = useMemo(() => {

    const query = search
      .trim()
      .toLowerCase();

    return recipesList.filter((recipe) => {

      const matchesSearch =
        !query ||
        recipe.name
          .toLowerCase()
          .includes(query) ||

        recipe.phase
          .toLowerCase()
          .includes(query) ||

        recipe.tags.some((tag) =>
          String(tag)
            .toLowerCase()
            .includes(query)
        );


      const matchesPhase =
        selectedPhase === 'All' ||
        recipe.phase === selectedPhase;


      return (
        matchesSearch &&
        matchesPhase
      );
    });

  }, [
    search,
    selectedPhase,
    recipesList,
  ]);


  // ===================================================
  // RENDER
  // ===================================================

  return (
    <View>

      {/* =================================================
          SEARCH & FILTER ROW
      ================================================= */}

      <View style={styles.searchRow}>

        <View style={styles.searchBox}>

          <Search
            size={18}
            color={Palette.textMuted}
          />

          <TextInput
            value={search}
            onChangeText={setSearch}
            placeholder="Search recipes..."
            placeholderTextColor={
              Palette.textSubtle
            }
            style={styles.searchInput}
          />

          {search.length > 0 && (
            <Pressable
              onPress={() =>
                setSearch('')
              }
            >
              <X
                size={16}
                color={Palette.textMuted}
              />
            </Pressable>
          )}

        </View>


        {/* FILTER BUTTON */}

        <Pressable
          onPress={() =>
            setShowFilters(
              (previous) => !previous
            )
          }
          style={[
            styles.filterButton,
            showFilters &&
              styles.filterButtonActive,
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
            <View
              style={styles.filterDot}
            />
          )}

        </Pressable>

      </View>


      {/* =================================================
          FILTER PANEL
      ================================================= */}

      {showFilters && (

        <View style={styles.filterPanel}>

          <View style={styles.filterHeader}>

            <Text
              style={styles.filterTitle}
            >
              Filter by phase
            </Text>

            <Pressable
              onPress={() =>
                setShowFilters(false)
              }
            >
              <X
                size={17}
                color={Palette.textSecondary}
              />
            </Pressable>

          </View>


          <View style={styles.filterOptions}>

            {phases.map((phase) => {

              const isSelected =
                selectedPhase === phase;

              return (

                <Pressable
                  key={phase}
                  onPress={() => {
                    setSelectedPhase(
                      phase
                    );

                    setShowFilters(
                      false
                    );
                  }}
                  style={[
                    styles.filterChip,
                    isSelected &&
                      styles.filterChipActive,
                  ]}
                >

                  <Text
                    style={[
                      styles.filterChipText,
                      isSelected &&
                        styles.filterChipTextActive,
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


      {/* =================================================
          ACTIVE FILTER
      ================================================= */}

      {selectedPhase !== 'All' && (

        <View
          style={styles.activeFilterRow}
        >

          <Text
            style={styles.activeFilterText}
          >
            Showing {selectedPhase} recipes
          </Text>

          <Pressable
            onPress={() =>
              setSelectedPhase('All')
            }
          >
            <Text
              style={styles.clearFilterText}
            >
              Clear
            </Text>
          </Pressable>

        </View>
      )}


      {/* =================================================
          ERROR CARD
      ================================================= */}

      {/* {error && (

        <ErrorCard
          title="Nutrition Sync Notice"
          message={error}
          onRetry={
            fetchNutritionGuidance
          }
        />

      )} */}


      {/* =================================================
          PHASE RECOMMENDATION
      ================================================= */}

      {isLoading ? (

        <View
          style={[
            styles.phaseCard,
            { gap: 8 },
          ]}
        >

          <Skeleton
            width="60%"
            height={20}
          />

          <Skeleton
            width="100%"
            height={14}
          />

          <Skeleton
            width="85%"
            height={14}
          />

        </View>

      ) : (

        <View style={styles.phaseCard}>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              marginBottom: 4,
            }}
          >

            <Sparkles
              size={16}
              color={Palette.orange}
            />

            <Text
              style={styles.phaseTitle}
            >
              Bio-Adaptive Nutrition Strategy
            </Text>

          </View>

          <Text
            style={styles.phaseText}
          >
            {foodComment}
          </Text>

        </View>

      )}


      {/* =================================================
          RECIPE CARDS
      ================================================= */}

      {isLoading ? (

        <View style={{ gap: 16 }}>

          <RecipeCardSkeleton />

          <RecipeCardSkeleton />

        </View>

      ) : recipesList.length === 0 ? (

        /* =================================================
           NO RECIPES GENERATED FALLBACK
        ================================================= */

        <View
          style={styles.emptyState}
        >

          <Sparkles
            size={34}
            color={Palette.orange}
          />

          <Text
            style={styles.emptyTitle}
          >
            No recipes generated yet
          </Text>

          <Text
            style={styles.emptyText}
          >
            Azuka hasn't generated personalized
            recipes for you yet. Once your nutrition
            plan is available, your recommended meals
            will appear here.
          </Text>

          <Pressable
            onPress={handleGeneratePlan}
            disabled={isGeneratingPlan}
            style={[
              styles.filterButton,
              {
                width: 48,
                height: 48,
                marginTop: 12,
                backgroundColor:
                  Palette.oceanBlue,
              },
            ]}
          >

            {isGeneratingPlan ? (

              <Text
                style={{
                  color:
                    Palette.textWhite,
                  fontSize: 11,
                  fontWeight: '700',
                }}
              >
                ...
              </Text>

            ) : (

              <Sparkles
                size={19}
                color={
                  Palette.textWhite
                }
              />

            )}

          </Pressable>

        </View>

      ) : filteredRecipes.length === 0 ? (

        /* =================================================
           SEARCH/FILTER EMPTY STATE
        ================================================= */

        <View
          style={styles.emptyState}
        >

          <Search
            size={30}
            color={Palette.textMuted}
          />

          <Text
            style={styles.emptyTitle}
          >
            No recipes found
          </Text>

          <Text
            style={styles.emptyText}
          >
            Try another search or change your
            phase filter.
          </Text>

        </View>

      ) : (

        /* =================================================
           RECIPE LIST
        ================================================= */

        filteredRecipes.map((recipe) => (

          <Pressable
            key={recipe.id}
            onPress={() =>
              setSelectedRecipe(recipe)
            }
            style={({ pressed }) => [
              styles.recipeCard,
              {
                opacity:
                  pressed ? 0.92 : 1,

                transform: [
                  {
                    scale:
                      pressed
                        ? 0.985
                        : 1,
                  },
                ],
              },
            ]}
          >

            {/* IMAGE PLACEHOLDER */}

            <View
              style={[
                styles.recipeImage,
                {
                  backgroundColor:
                    `${recipe.color}18`,
                },
              ]}
            >

              <Flame
                size={48}
                color={recipe.color}
              />

            </View>


            {/* CONTENT */}

            <View
              style={styles.recipeContent}
            >

              <View
                style={styles.recipeHeader}
              >

                <Text
                  style={styles.recipeName}
                >
                  {recipe.name}
                </Text>

                <ChevronRight
                  size={20}
                  color={
                    Palette.textMuted
                  }
                />

              </View>


              {/* META */}

              <View
                style={
                  styles.recipeMetaRow
                }
              >

                <View
                  style={styles.recipeMeta}
                >

                  <Clock
                    size={13}
                    color={
                      Palette.textSecondary
                    }
                  />

                  <Text
                    style={
                      styles.recipeMetaText
                    }
                  >
                    {recipe.time} min
                  </Text>

                </View>


                <View
                  style={styles.recipeMeta}
                >

                  <Flame
                    size={13}
                    color={
                      Palette.textSecondary
                    }
                  />

                  <Text
                    style={
                      styles.recipeMetaText
                    }
                  >
                    {recipe.calories} cal
                  </Text>

                </View>


                <View
                  style={styles.recipeMeta}
                >

                  <Users
                    size={13}
                    color={
                      Palette.textSecondary
                    }
                  />

                  <Text
                    style={
                      styles.recipeMetaText
                    }
                  >
                    {recipe.protein}g protein
                  </Text>

                </View>

              </View>


              {/* TAGS */}

              <View
                style={styles.tagRow}
              >

                {recipe.phase !== 'All' && (

                  <View
                    style={
                      styles.phaseBadge
                    }
                  >

                    <Text
                      style={
                        styles.phaseBadgeText
                      }
                    >
                      {recipe.phase}
                    </Text>

                  </View>

                )}


                {recipe.tags.map(
                  (tag) => (

                    <View
                      key={String(tag)}
                      style={styles.tag}
                    >

                      <Text
                        style={
                          styles.tagText
                        }
                      >
                        {String(tag)}
                      </Text>

                    </View>

                  )
                )}

              </View>

            </View>

          </Pressable>

        ))
      )}


      {/* =================================================
          RECIPE DETAIL MODAL
      ================================================= */}

      <RecipeDetailModal
        visible={
          selectedRecipe !== null
        }
        recipe={selectedRecipe}
        onClose={() =>
          setSelectedRecipe(null)
        }
      />

    </View>
  );
}
