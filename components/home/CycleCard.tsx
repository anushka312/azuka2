import React, { useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import Svg, { Circle } from 'react-native-svg';

import AnimatedReanimated, {
  useSharedValue,
  useAnimatedProps,
  withTiming,
  Easing,
} from 'react-native-reanimated';

import { Palette, GlobalStyles } from '../../constants/Styles';
import { styles } from './styles';


// Animated SVG Circle
const AnimatedCircle =
  AnimatedReanimated.createAnimatedComponent(Circle);


// Props
interface CycleCardProps {
  progress?: number;
  phaseName?: string;
  cycleDay?: string;
  statusText?: string;
  tags?: string[];
}


// Dynamic colors based on progress
const getDynamicColorScheme = (progress: number) => {
  const percentage = Math.round(progress * 100);

  if (percentage <= 33) {
    return {
      primary: Palette.forestGreen,
      mutedSurface: Palette.surfaceGreenMuted,
      statusLabel: 'Low',
    };
  }

  if (percentage <= 66) {
    return {
      primary: Palette.orange,
      mutedSurface: Palette.surfaceOrangeMuted,
      statusLabel: 'Moderate',
    };
  }

  return {
    primary: Palette.crimson,
    mutedSurface: Palette.surfaceCrimsonMuted,
    statusLabel: 'High',
  };
};


export default function CycleCard({
  progress = 0.73,
  phaseName = 'Luteal',
  cycleDay = 'Day 22 of cycle',
  statusText,
  tags = ['Light Activity', 'High Protein'],
}: CycleCardProps) {

  // -----------------------------
  // CIRCLE CONFIG
  // -----------------------------

  const size = 160;
  const strokeWidth = 12;

  const radius =
    (size - strokeWidth) / 2;

  const circumference =
    2 * Math.PI * radius;


  // -----------------------------
  // COLORS
  // -----------------------------

  const dynamicColor =
    getDynamicColorScheme(progress);

  const displayStatus =
    statusText || dynamicColor.statusLabel;


  // -----------------------------
  // ANIMATION
  // -----------------------------

  const animatedProgress =
    useSharedValue(0);


  useEffect(() => {
    animatedProgress.value = withTiming(
      progress,
      {
        duration: 1000,
        easing: Easing.out(Easing.quad),
      }
    );
  }, [progress]);


  const animatedCircleProps =
    useAnimatedProps(() => {

      const strokeDashoffset =
        circumference *
        (1 - animatedProgress.value);

      return {
        strokeDashoffset,
      };
    });


  // -----------------------------
  // UI
  // -----------------------------

  return (
    <View
      style={[
        GlobalStyles.cardElevated,
        styles.cycleCardContainer,
        {
          padding: 10,
        },
      ]}
    >

      {/* ================================= */}
      {/* HEADER */}
      {/* ================================= */}

      <View style={styles.cardHeader}>

        {/* Phase */}
        <View style={styles.phaseTitleContainer}>

          <View
            style={[
              styles.moonBadge,
              {
                backgroundColor:
                  dynamicColor.mutedSurface,
              },
            ]}
          >
            <Ionicons
              name="moon"
              size={14}
              color={dynamicColor.primary}
            />
          </View>


          <View>

            <Text style={styles.phaseTitle}>
              {phaseName}
            </Text>

            <Text
              style={GlobalStyles.captionText}
            >
              {cycleDay}
            </Text>

          </View>

        </View>


        {/* Calendar */}
        <TouchableOpacity
          activeOpacity={0.7}
        >
          <Ionicons
            name="calendar-outline"
            size={22}
            color={Palette.forestGreen}
          />
        </TouchableOpacity>

      </View>


      {/* ================================= */}
      {/* PROGRESS CIRCLE */}
      {/* ================================= */}

      <View style={styles.wheelContainer}>

        <Svg
          width={size}
          height={size}
        >

          {/* Background circle */}
          <Circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={Palette.surfaceMuted}
            strokeWidth={strokeWidth}
            fill="none"
          />


          {/* Animated progress */}
          <AnimatedCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={dynamicColor.primary}
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            animatedProps={
              animatedCircleProps
            }
            strokeLinecap="round"
            transform={`rotate(-90 ${
              size / 2
            } ${size / 2})`}
          />

        </Svg>


        {/* Text inside circle */}
        <View
          style={styles.wheelTextContainer}
        >

          <Text
            style={styles.percentageText}
          >
            {Math.round(progress * 100)}%
          </Text>


          <Text
            style={[
              styles.statusText,
              {
                color:
                  dynamicColor.primary,
              },
            ]}
          >
            {displayStatus}
          </Text>

        </View>

      </View>


      {/* ================================= */}
      {/* TAGS */}
      {/* ================================= */}

      <View style={styles.tagsContainer}>

        {tags.map((tag, index) => (

          <View
            key={index}
            style={[
              styles.pillTag,
              {
                backgroundColor:
                  dynamicColor.mutedSurface,
              },
            ]}
          >

            <Text
              style={[
                styles.pillTagText,
                {
                  color:
                    dynamicColor.primary,
                },
              ]}
            >
              {tag}
            </Text>

          </View>

        ))}

      </View>

    </View>
  );
}