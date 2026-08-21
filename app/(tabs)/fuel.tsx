import React, { useState } from 'react';
import {
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';

import { Palette } from '@/constants/Styles';

import FoodScanner from '@/components/food/foodScanner';
import RecipeGenerator from '@/components/food/RecipeGenerator';

import { styles } from '@/components/food/foodStyles';

type Tab = 'scan' | 'recipes';

export default function FuelTabScreen() {
  const [activeTab, setActiveTab] =
    useState<Tab>('scan');

  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        flexGrow: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 100,
        backgroundColor: Palette.cream,
      }}
    >
      {/* =========================
          HEADER
      ========================= */}

      <View style={styles.header}>
        <Text style={styles.title}>
          Nutrition intelligence
        </Text>

        <Text style={styles.subtitle}>
          Phase-synced nutrition
        </Text>
      </View>

      {/* =========================
          TABS
      ========================= */}

      <View style={styles.tabs}>
        <Pressable
          onPress={() => setActiveTab('scan')}
          style={[
            styles.tab,
            activeTab === 'scan' &&
              styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'scan' &&
                styles.activeTabText,
            ]}
          >
            Food Scanner
          </Text>
        </Pressable>

        <Pressable
          onPress={() => setActiveTab('recipes')}
          style={[
            styles.tab,
            activeTab === 'recipes' &&
              styles.activeTab,
          ]}
        >
          <Text
            style={[
              styles.tabText,
              activeTab === 'recipes' &&
                styles.activeTabText,
            ]}
          >
            Recipes
          </Text>
        </Pressable>
      </View>

      {/* =========================
          CONTENT
      ========================= */}

      {activeTab === 'scan' ? (
        <FoodScanner />
      ) : (
        <RecipeGenerator />
      )}
    </ScrollView>
  );
}