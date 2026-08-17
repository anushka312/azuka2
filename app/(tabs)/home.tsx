import React, { useRef, useState } from 'react';

import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  Animated,
  Dimensions,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import {
  CycleCard,
  DailyGuidanceCard,
  RecipeSection,
  BiologicalIntelligence,
  WeeklyTrend,
  RecipeModal,
  Sidebar,
} from '../../components/home';

import {
  Palette,
  GlobalStyles,
} from '../../constants/Styles';

import { styles } from '../../components/home/styles';


// Enable LayoutAnimation on Android
if (
  Platform.OS === 'android' &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}


// Sidebar width
const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;


export default function Home() {

  // -----------------------------
  // STATE
  // -----------------------------

  const [sidebarVisible, setSidebarVisible] =
    useState(false);

  const [isMinimumWin, setIsMinimumWin] =
    useState(false);

  const [mindsetExpanded, setMindsetExpanded] =
    useState(false);

  const [selectedRecipe, setSelectedRecipe] =
    useState<string | null>(null);


  // -----------------------------
  // SIDEBAR ANIMATION
  // -----------------------------

  const slideAnim = useRef(
    new Animated.Value(-SIDEBAR_WIDTH)
  ).current;


  // -----------------------------
  // GREETING
  // -----------------------------

  const getGreeting = () => {
    const hours = new Date().getHours();

    if (hours < 12) {
      return 'Good Morning,';
    }

    if (hours < 18) {
      return 'Good Afternoon,';
    }

    return 'Good Evening,';
  };


  // -----------------------------
  // SIDEBAR
  // -----------------------------

  const openSidebar = () => {
    setSidebarVisible(true);

    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start();
  };


  const closeSidebar = () => {
    Animated.timing(slideAnim, {
      toValue: -SIDEBAR_WIDTH,
      duration: 200,
      useNativeDriver: true,
    }).start(() => {
      setSidebarVisible(false);
    });
  };


  // -----------------------------
  // MINIMUM WIN MODE
  // -----------------------------

  const toggleMinimumWin = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setIsMinimumWin(!isMinimumWin);
  };


  // -----------------------------
  // BIOLOGICAL INTELLIGENCE
  // -----------------------------

  const toggleMindset = () => {
    LayoutAnimation.configureNext(
      LayoutAnimation.Presets.easeInEaseOut
    );

    setMindsetExpanded(!mindsetExpanded);
  };


  // -----------------------------
  // DYNAMIC CYCLE DATA
  // -----------------------------

  const cycleTags = isMinimumWin
    ? ['Gentle Rest', 'Nourish Deeply']
    : ['Light Activity', 'High Protein'];

  const cycleStatus = isMinimumWin
    ? 'Rest Mode'
    : 'Biological Load';


  // -----------------------------
  // RENDER
  // -----------------------------

  return (
    <SafeAreaView
      style={[
        GlobalStyles.screenContainer,
        {
          padding: 10,
          paddingTop: 40,
          backgroundColor: isMinimumWin
            ? Palette.surfaceCrimsonMuted
            : Palette.cream,
        },
      ]}
    >

      {/* ===================================== */}
      {/* TOP BAR */}
      {/* ===================================== */}

      <View
        style={[
          styles.topBar,
          {
            marginBottom: -12,
            paddingBottom: 20,
          },
        ]}
      >

        {/* Greeting */}
        <View style={styles.greetingSection}>

          <TouchableOpacity
            style={styles.iconBtn}
            onPress={openSidebar}
            activeOpacity={0.7}
          >
            <Ionicons
              name="menu-outline"
              size={26}
              color={Palette.textPrimary}
            />
          </TouchableOpacity>


          <View style={styles.greetingTextContainer}>

            <Text style={GlobalStyles.captionText}>
              {getGreeting()}
            </Text>

            <Text style={styles.userName}>
              Alex
            </Text>

          </View>

        </View>


        {/* Right side actions */}
        <View style={styles.actionsSection}>

          {/* Notifications */}
          <TouchableOpacity
            style={styles.iconBtn}
            activeOpacity={0.7}
          >

            <Ionicons
              name="notifications-outline"
              size={22}
              color={Palette.textPrimary}
            />

            <View
              style={styles.notificationBadge}
            />

          </TouchableOpacity>


          {/* Profile */}
          <TouchableOpacity
            style={styles.profileBtn}
            activeOpacity={0.7}
          >

            <Ionicons
              name="person-circle-outline"
              size={26}
              color={Palette.oceanBlue}
            />

          </TouchableOpacity>

        </View>

      </View>


      {/* ===================================== */}
      {/* MAIN CONTENT */}
      {/* ===================================== */}

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: 100,
        }}
      >

        <View style={{ padding: 7 }}>


          {/* ================================= */}
          {/* CYCLE CARD */}
          {/* ================================= */}

          <CycleCard
            progress={0.73}
            phaseName="Luteal"
            cycleDay="Day 22 of cycle"
            statusText={cycleStatus}
            tags={cycleTags}
          />


          {/* ================================= */}
          {/* DAILY GUIDANCE */}
          {/* ================================= */}

          <DailyGuidanceCard
            isMinimumWin={isMinimumWin}
            onToggleMinimumWin={
              toggleMinimumWin
            }
          />


          {/* ================================= */}
          {/* RECIPES */}
          {/* ================================= */}

          <RecipeSection
            onRecipeSelect={
              setSelectedRecipe
            }
          />


          {/* ================================= */}
          {/* BIOLOGICAL INTELLIGENCE */}
          {/* ================================= */}

          {/* <BiologicalIntelligence
            expanded={mindsetExpanded}
            onToggle={toggleMindset}
          /> */}


          {/* ================================= */}
          {/* WEEKLY TREND */}
          {/* ================================= */}

          {/* <WeeklyTrend /> */}

        </View>

      </ScrollView>


      {/* ===================================== */}
      {/* RECIPE MODAL */}
      {/* ===================================== */}

      <RecipeModal
        visible={!!selectedRecipe}
        onClose={() => {
          setSelectedRecipe(null);
        }}
      />


      {/* ===================================== */}
      {/* SIDEBAR */}
      {/* ===================================== */}

      <Sidebar
        visible={sidebarVisible}
        slideAnim={slideAnim}
        onClose={closeSidebar}
        sidebarWidth={SIDEBAR_WIDTH}
      />

    </SafeAreaView>
  );
}