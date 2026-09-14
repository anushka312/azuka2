import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Palette, GlobalStyles } from '@/constants/Styles';

interface ErrorCardProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export function ErrorCard({
  title = 'Data Sync Notice',
  message = 'Unable to refresh live bio-adaptive metrics from the engine. Using offline state.',
  onRetry,
}: ErrorCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Ionicons name="alert-circle" size={20} color={Palette.crimson} />
        <Text style={styles.title}>{title}</Text>
      </View>
      <Text style={styles.message}>{message}</Text>
      {onRetry && (
        <Pressable style={styles.retryButton} onPress={onRetry}>
          <Ionicons name="refresh" size={14} color={Palette.crimson} />
          <Text style={styles.retryText}>Retry Connection</Text>
        </Pressable>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Palette.surfaceCrimsonMuted,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: Palette.crimson,
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Palette.crimson,
  },
  message: {
    fontSize: 13,
    color: Palette.textSecondary,
    lineHeight: 18,
    marginBottom: 8,
  },
  retryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    backgroundColor: Palette.surfaceWhite,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Palette.crimson,
    marginTop: 4,
  },
  retryText: {
    fontSize: 12,
    fontWeight: '700',
    color: Palette.crimson,
  },
});
