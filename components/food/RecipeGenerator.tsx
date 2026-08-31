import React, { useMemo, useState, useEffect, useCallback } from 'react';

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

import {
  getRecipes,
  getUserProfile,
  type Recipe as ApiRecipe,
  type UserProfile,
} from '@/services/api';

import {
  RecipeCardSkeleton,
  Skeleton,
} from '@/components/ui/Skeleton';

import { ErrorCard } from '@/components/ui/StateFeedback';


// =====================================================
// CONSTANTS
// =====================================================

const USER_ID = 'default_user';


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

function getRecipePhase(
  recipe: ApiRecipe
): string {
  const tags = recipe.tags ?? [];

  const phaseTag = tags.find((tag) => {
    const normalized = tag.toLowerCase();

    return phases
      .filter((phase) => phase !== 'All')
      .some(
        (phase) =>
          normalized === phase.toLowerCase() ||
          normalized.includes(phase.toLowerCase())
      );
  });

  if (phaseTag) {
    const normalized = phaseTag.toLowerCase();

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
// HELPER — MAP API RECIPE TO UI RECIPE
// =====================================================

function mapApiRecipeToUiRecipe(
  recipe: ApiRecipe,
  index: number
): Recipe {
  const phase = getRecipePhase(recipe);

  return {
    id: `recipe-${index}-${recipe.name}`,
    name: recipe.name,

    // Your API Recipe type currently does not contain time.
    // Keep a sensible fallback for the UI.
    time: recipe.time
      ? Number.parseInt(recipe.time, 10) || 20
      : 20,

    calories: recipe.calories ?? 0,

    protein: recipe.protein ?? 0,

    phase,

    tags:
      recipe.tags && recipe.tags.length > 0
        ? recipe.tags
        : ['Bio-Adaptive'],

    color:
      index % 2 === 0
        ? Palette.orange
        : Palette.forestGreen,

    description:
      recipe.description ||
      'A nutrient-rich meal recommended by Azuka.',

    ingredients:
      recipe.ingredients ?? [],

    whyItHelps:
      recipe.comments ||
      'Recommended by Azuka based on your nutritional needs.',

    isConsumed:
      recipe.isConsumed ?? false,
  };
}


// =====================================================
// MAIN COMPONENT
// =====================================================

export default function RecipeGenerator() {

  const [recipesList, setRecipesList] = useState<Recipe[]>([]);

  const [foodComment, setFoodComment] = useState(
    'Your personalized nutrition recommendations will appear here.'
  );

  const [loading, setLoading] = useState(true);

  const [errorMsg, setErrorMsg] =
    useState<string | null>(null);

  const [search, setSearch] = useState('');

  const [selectedRecipe, setSelectedRecipe] =
    useState<Recipe | null>(null);

  const [selectedPhase, setSelectedPhase] =
    useState('All');

  const [showFilters, setShowFilters] =
    useState(false);


  // ===================================================
  // FETCH RECIPES
  // ===================================================

  const fetchNutritionGuidance = useCallback(
    async () => {

      try {
        setLoading(true);
        setErrorMsg(null);

        console.log(
          '[RecipeGenerator] Fetching recipes for:',
          USER_ID
        );

        // ------------------------------------------------
        // GET RECIPES FROM FASTAPI
        //
        // GET /api/recipes/{userId}
        // ------------------------------------------------

        const recipes: ApiRecipe[] =
          await getRecipes(USER_ID);

        console.log(
          '[RecipeGenerator] Recipes received:',
          recipes
        );


        // ------------------------------------------------
        // NO RECIPES GENERATED
        // ------------------------------------------------

        if (!recipes || recipes.length === 0) {

          setRecipesList([]);

          setFoodComment(
            'No personalized recipes have been generated yet. Check back after Azuka creates your nutrition plan.'
          );

          return;
        }


        // ------------------------------------------------
        // MAP API DATA TO UI DATA
        // ------------------------------------------------

        const mappedRecipes =
          recipes.map(
            mapApiRecipeToUiRecipe
          );

        setRecipesList(mappedRecipes);


        // ------------------------------------------------
        // CREATE NUTRITION COMMENT
        // ------------------------------------------------

        setFoodComment(
          'These recipes have been personalized by Azuka to support your current nutritional and cycle needs.'
        );

      } catch (err: any) {

        console.warn(
          '[RecipeGenerator] Error loading recipes:',
          err
        );

        setRecipesList([]);

        setFoodComment(
          'Your personalized recipes could not be loaded right now.'
        );

        setErrorMsg(
          'Could not connect to the nutrition service. Please try again.'
        );

      } finally {

        setLoading(false);
      }

    },
    []
  );


  // ===================================================
  // LOAD RECIPES ON MOUNT
  // ===================================================

  useEffect(() => {
    fetchNutritionGuidance();
  }, [fetchNutritionGuidance]);


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
          tag
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
              onPress={() => setSearch('')}
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

      {errorMsg && (

        <ErrorCard
          title="Nutrition Sync Notice"
          message={errorMsg}
          onRetry={
            fetchNutritionGuidance
          }
        />

      )}


      {/* =================================================
          PHASE RECOMMENDATION
      ================================================= */}

      {loading ? (

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

      {loading ? (

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
            onPress={fetchNutritionGuidance}
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

            <Sparkles
              size={19}
              color={Palette.textWhite}
            />

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
                      key={tag}
                      style={styles.tag}
                    >

                      <Text
                        style={
                          styles.tagText
                        }
                      >
                        {tag}
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