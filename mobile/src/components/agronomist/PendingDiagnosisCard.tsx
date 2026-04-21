import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { Diagnosis } from '../../types/diagnosis';
import { StatusBadge } from '../ui/StatusBadge';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

interface PendingDiagnosisCardProps {
  diagnosis: Diagnosis;
  onPress?: () => void;
}

export function PendingDiagnosisCard({ diagnosis, onPress }: PendingDiagnosisCardProps) {
  const { colors, shadows } = useTheme();
  const isLowConfidence = diagnosis.confidence !== null && diagnosis.confidence < 0.7;
  const confidencePercent = diagnosis.confidence !== null ? Math.round(diagnosis.confidence * 100) : 0;

  const styles = StyleSheet.create({
    card: {
      flexDirection: 'row',
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      overflow: 'hidden',
      borderWidth: 1.5,
      borderColor: isLowConfidence ? colors.warning : colors.border,
      marginBottom: spacing.lg,
      ...shadows.md,
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 22,
      color: colors.text,
      marginBottom: spacing.xs,
    },
    subtitle: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
      marginBottom: spacing.sm,
    },
    confidenceText: {
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 16,
      color: colors.text,
    },
    metaText: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.textSecondary,
      fontWeight: '500',
    },
    confidenceBadge: {
      alignSelf: 'flex-start',
      borderRadius: radius.full,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
      backgroundColor: isLowConfidence ? colors.warningLight : colors.successLight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.xs,
      marginBottom: spacing.md,
      borderWidth: 1,
      borderColor: isLowConfidence ? colors.warning : colors.success,
    },
    confidenceIcon: {
      fontWeight: '700',
    },
    confidenceRow: {
      marginBottom: spacing.md,
    },
    imageWrapper: {
      width: 100,
      height: 100,
      position: 'relative',
    },
    image: {
      width: '100%',
      height: '100%',
    },
    imagePlaceholder: {
      backgroundColor: colors.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
      width: '100%',
      height: '100%',
    },
    content: {
      flex: 1,
      padding: spacing.lg,
      justifyContent: 'space-between',
    },
    metaRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: spacing.md,
    },
    statusWrapper: {
      // For better alignment
    },
  });

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.75 }
      ]}
    >
      <View style={styles.imageWrapper}>
        {diagnosis.imageUrl ? (
          <Image source={{ uri: diagnosis.imageUrl }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="leaf" size={32} color={colors.textMuted} />
          </View>
        )}
      </View>
      <View style={styles.content}>
        <View>
          <Text style={styles.title}>{diagnosis.plantName}</Text>
          <Text style={styles.subtitle} numberOfLines={1}>
            {diagnosis.diseaseName || 'Analyzing...'}
          </Text>
          <View style={styles.confidenceRow}>
            <View style={styles.confidenceBadge}>
              <Text style={[styles.confidenceIcon, { color: isLowConfidence ? colors.warning : colors.success }]}>
                {isLowConfidence ? '⚠' : '✓'}
              </Text>
              <Text style={styles.confidenceText}>
                {diagnosis.confidence !== null
                  ? `${confidencePercent}% confidence`
                  : 'Pending analysis'}
              </Text>
            </View>
          </View>
        </View>
        <View style={styles.metaRow}>
          <View style={styles.statusWrapper}>
            <StatusBadge status={diagnosis.status} />
          </View>
          <Text style={styles.metaText}>
            {formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}
