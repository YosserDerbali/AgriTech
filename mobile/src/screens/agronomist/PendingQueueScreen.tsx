import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { colors } from '../../theme/colors';

type SortOption = 'newest' | 'oldest' | 'confidence';

export default function PendingQueueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { getPendingDiagnoses } = useDiagnosisStore();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showLowConfidenceOnly, setShowLowConfidenceOnly] = useState(false);

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
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Pending Queue</Text>
      <Text style={styles.subtitle}>{pendingDiagnoses.length} pending</Text>

      <View style={styles.controls}>
        <Text
          style={[styles.filterChip, showLowConfidenceOnly && styles.filterChipActive]}
          onPress={() => setShowLowConfidenceOnly(!showLowConfidenceOnly)}
        >
          Low Confidence ({lowConfidenceCount})
        </Text>

        <View style={styles.sortRow}>
          {(['newest', 'oldest', 'confidence'] as SortOption[]).map((option) => (
            <Text
              key={option}
              style={[styles.sortChip, sortBy === option && styles.sortChipActive]}
              onPress={() => setSortBy(option)}
            >
              {option}
            </Text>
          ))}
        </View>
      </View>

      {filteredDiagnoses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptyText}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 12,
  },
  controls: {
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
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
    backgroundColor: colors.card,
    borderColor: colors.text,
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    marginTop: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
}
);
