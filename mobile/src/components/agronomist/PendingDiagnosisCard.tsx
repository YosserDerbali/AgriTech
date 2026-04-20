import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Diagnosis } from '../../types/diagnosis';
import { StatusBadge } from '../ui/StatusBadge';
import { useTheme } from '../../hooks/useTheme';

interface PendingDiagnosisCardProps {
  diagnosis: Diagnosis;
  onPress?: () => void;
}

export function PendingDiagnosisCard({ diagnosis, onPress }: PendingDiagnosisCardProps) {
  const { colors, shadows } = useTheme();
  const isLowConfidence = diagnosis.confidence !== null && diagnosis.confidence < 0.7;

  const styles = StyleSheet.create({
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
    },
    confidenceText: {
      fontSize: 11,
      fontWeight: '600',
      color: colors.text,
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <Pressable onPress={onPress} style={[styles.card, isLowConfidence && staticStyles.lowConfidence]}>
      <View style={staticStyles.imageWrapper}>
        <Image source={{ uri: diagnosis.imageUrl }} style={staticStyles.image} />
      </View>
      <View style={staticStyles.content}>
        <Text style={styles.title}>{diagnosis.plantName}</Text>
        <Text style={styles.subtitle} numberOfLines={1}>
          {diagnosis.diseaseName || 'Analyzing...'}
        </Text>
        <View style={staticStyles.confidenceRow}>
          <View style={[staticStyles.confidenceBadge, isLowConfidence ? staticStyles.confidenceWarning : staticStyles.confidenceOk]}>
            <Text style={styles.confidenceText}>
              {diagnosis.confidence !== null
                ? `${Math.round(diagnosis.confidence * 100)}% confidence`
                : 'Pending'}
            </Text>
          </View>
        </View>
        <View style={staticStyles.metaRow}>
          <StatusBadge status={diagnosis.status} />
          <Text style={styles.metaText}>
            {formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({

  lowConfidence: {
    borderColor: '#FCD34D',
  },
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
  confidenceRow: {
    marginVertical: 6,
  },
  confidenceBadge: {
    alignSelf: 'flex-start',
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  confidenceWarning: {
    backgroundColor: '#FEF3C7',
  },
  confidenceOk: {
    backgroundColor: '#DCFCE7',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});
