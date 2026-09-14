import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, ViewStyle, DimensionValue } from 'react-native';
import { Palette } from '@/constants/Styles';

interface SkeletonProps {
  width?: DimensionValue;
  height?: number;
  borderRadius?: number;
  style?: ViewStyle | ViewStyle[];
}

export function Skeleton({ width = '100%', height = 20, borderRadius = 8, style }: SkeletonProps) {
  const opacityAnim = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(opacityAnim, {
          toValue: 0.75,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0.35,
          duration: 800,
          useNativeDriver: true,
        }),
      ])
    );
    animation.start();

    return () => animation.stop();
  }, [opacityAnim]);

  return (
    <Animated.View
      style={[
        styles.skeleton,
        {
          width,
          height,
          borderRadius,
          opacity: opacityAnim,
        },
        style,
      ]}
    />
  );
}

/**
 * Pre-built Skeleton for Biometric Cards & Tiles
 */
export function BiometricGridSkeleton() {
  return (
    <View style={styles.gridContainer}>
      <View style={styles.tileSkeleton}>
        <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={24} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} />
      </View>
      <View style={styles.tileSkeleton}>
        <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={24} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} />
      </View>
      <View style={styles.tileSkeleton}>
        <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={24} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} />
      </View>
      <View style={styles.tileSkeleton}>
        <Skeleton width={32} height={32} borderRadius={16} style={{ marginBottom: 10 }} />
        <Skeleton width="60%" height={14} style={{ marginBottom: 6 }} />
        <Skeleton width="80%" height={24} style={{ marginBottom: 6 }} />
        <Skeleton width="40%" height={12} />
      </View>
    </View>
  );
}

/**
 * Pre-built Skeleton for Workout List Cards
 */
export function WorkoutListSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 16 }}>
        <Skeleton width="50%" height={20} />
        <Skeleton width="25%" height={20} borderRadius={12} />
      </View>
      {[1, 2, 3].map((key) => (
        <View key={key} style={styles.exerciseRowSkeleton}>
          <Skeleton width={38} height={38} borderRadius={19} />
          <View style={{ flex: 1, gap: 6, marginHorizontal: 12 }}>
            <Skeleton width="70%" height={16} />
            <Skeleton width="40%" height={12} />
          </View>
          <Skeleton width={24} height={24} borderRadius={6} />
        </View>
      ))}
    </View>
  );
}

/**
 * Pre-built Skeleton for Recipe Cards
 */
export function RecipeCardSkeleton() {
  return (
    <View style={styles.cardSkeleton}>
      <Skeleton width="100%" height={120} borderRadius={12} style={{ marginBottom: 14 }} />
      <Skeleton width="65%" height={20} style={{ marginBottom: 8 }} />
      <View style={{ flexDirection: 'row', gap: 12, marginBottom: 12 }}>
        <Skeleton width={60} height={14} />
        <Skeleton width={60} height={14} />
        <Skeleton width={80} height={14} />
      </View>
      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Skeleton width={70} height={22} borderRadius={11} />
        <Skeleton width={90} height={22} borderRadius={11} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  skeleton: {
    backgroundColor: Palette.borderStrong,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 16,
  },
  tileSkeleton: {
    width: '48%',
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.borderSubtle,
  },
  cardSkeleton: {
    backgroundColor: Palette.surfaceWhite,
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: Palette.borderStrong,
  },
  exerciseRowSkeleton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Palette.borderSubtle,
  },
});
