import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Diagnosis } from '../../types/diagnosis';
import { StatusBadge } from '../ui/StatusBadge';
import { useTheme } from '../../hooks/useTheme';

interface DiagnosisCardProps {
  diagnosis: Diagnosis;
  onPress?: () => void;
}

export function DiagnosisCard({ diagnosis, onPress }: DiagnosisCardProps) {
  const { colors, shadows } = useTheme();

  const dynamicStyles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      ...shadows.soft,
    },
    title: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <Pressable onPress={onPress} style={dynamicStyles.card}>
      <View style={styles.imageWrapper}>
        <Image source={{ uri: diagnosis.imageUrl }} style={styles.image} />
      </View>
      <View style={styles.content}>
        <Text style={dynamicStyles.title}>{diagnosis.plantName}</Text>
        <Text style={dynamicStyles.subtitle} numberOfLines={1}>
          {diagnosis.diseaseName || 'Analyzing...'}
        </Text>
        <View style={styles.metaRow}>
          <StatusBadge status={diagnosis.status} />
          <Text style={dynamicStyles.metaText}>
            {formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  imageWrapper: {
    width: 90,
    height: 90,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  content: {
    flex: 1,
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
