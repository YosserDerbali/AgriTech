import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { DiagnosisCard } from '../../components/diagnosis/DiagnosisCard';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { DiagnosisStatus } from '../../types/diagnosis';
import { colors } from '../../theme/colors';

type FilterType = 'ALL' | DiagnosisStatus;

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const [filter, setFilter] = useState<FilterType>('ALL');

  const filteredDiagnoses = filter === 'ALL'
    ? diagnoses
    : diagnoses.filter((d) => d.status === filter);

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Diagnosis History</Text>
      <View style={styles.filtersRow}>
        {filters.map(({ label, value }) => (
          <Text
            key={value}
            onPress={() => setFilter(value)}
            style={[styles.filterChip, filter === value && styles.filterChipActive]}
          >
            {label}
          </Text>
        ))}
      </View>

      <View style={styles.list}>
        {filteredDiagnoses.length > 0 ? (
          filteredDiagnoses.map((diagnosis) => (
            <DiagnosisCard
              key={diagnosis.id}
              diagnosis={diagnosis}
              onPress={() => navigation.navigate('DiagnosisDetail', { id: diagnosis.id })}
            />
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No diagnoses found</Text>
            <Text style={styles.emptyText}>
              {filter === 'ALL'
                ? 'Start by scanning your first plant'
                : `No ${filter.toLowerCase()} diagnoses yet`}
            </Text>
          </View>
        )}
      </View>
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
    marginBottom: 12,
  },
  filtersRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  filterChip: {
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
  filterChipActive: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    borderColor: colors.primary,
  },
  list: {
    marginTop: 6,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
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
});
