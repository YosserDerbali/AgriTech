import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { useTheme } from '../../hooks/useTheme';

type SortOption = 'newest' | 'oldest' | 'confidence';

export default function PendingQueueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { getPendingDiagnoses, fetchReviewQueue } = useDiagnosisStore();
  const { colors } = useTheme();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showLowConfidenceOnly, setShowLowConfidenceOnly] = useState(false);

  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
    },
    subtitle: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 12,
    },
    filterChip: {
      alignSelf: 'flex-start',
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 12,
      marginBottom: 10,
    },
    filterChipActive: {
      backgroundColor: colors.accent,
      borderColor: colors.accent,
      color: '#FFFFFF',
    },
    sortChip: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 12,
      marginRight: 8,
      marginBottom: 8,
    },
    sortChipActive: {
      backgroundColor: colors.surface,
      borderColor: colors.text,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 13,
      color: colors.textSecondary,
    },
  });

  useEffect(() => {
    fetchReviewQueue().catch(() => null);
  }, [fetchReviewQueue]);

  const pendingDiagnoses = getPendingDiagnoses();
  const filteredDiagnoses = pendingDiagnoses
    .filter((d) => !showLowConfidenceOnly || (d.confidence !== null && d.confidence < 0.7))
    .sort((a, b) => {
      switch (sortBy) {
        case 'oldest':
          return a.createdAt.getTime() - b.createdAt.getTime();
        case 'confidence':
          return (a.confidence || 0) - (b.confidence || 0);
        case 'newest':
        default:
          return b.createdAt.getTime() - a.createdAt.getTime();
      }
    });

  const lowConfidenceCount = pendingDiagnoses.filter(
    (d) => d.confidence !== null && d.confidence < 0.7
  ).length;

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={staticStyles.content}>
        <Text style={dynamicStyles.title}>Pending Queue</Text>
        <Text style={dynamicStyles.subtitle}>{pendingDiagnoses.length} pending</Text>

      <View style={staticStyles.controls}>
        <Text
          style={[dynamicStyles.filterChip, showLowConfidenceOnly && dynamicStyles.filterChipActive]}
          onPress={() => setShowLowConfidenceOnly(!showLowConfidenceOnly)}
        >
          Low Confidence ({lowConfidenceCount})
        </Text>

        <View style={staticStyles.sortRow}>
          {(['newest', 'oldest', 'confidence'] as SortOption[]).map((option) => (
            <Text
              key={option}
              style={[dynamicStyles.sortChip, sortBy === option && dynamicStyles.sortChipActive]}
              onPress={() => setSortBy(option)}
            >
              {option}
            </Text>
          ))}
        </View>
      </View>

      {filteredDiagnoses.length === 0 ? (
        <View style={staticStyles.emptyState}>
          <Text style={dynamicStyles.emptyTitle}>All caught up!</Text>
          <Text style={dynamicStyles.emptyText}>
            {showLowConfidenceOnly
              ? 'No low confidence diagnoses to review.'
              : 'No pending diagnoses in the queue.'}
          </Text>
        </View>
      ) : (
        filteredDiagnoses.map((diagnosis) => (
          <PendingDiagnosisCard
            key={diagnosis.id}
            diagnosis={diagnosis}
            onPress={() => navigation.navigate('DiagnosisReview', { id: diagnosis.id })}
          />
        ))
      )}
      </ScrollView>
    </SafeAreaView>
  );
}

const staticStyles = StyleSheet.create({
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  controls: {
    marginBottom: 12,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    marginTop: 8,
  },
});
