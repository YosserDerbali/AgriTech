import React, { useEffect, useState, useRef } from 'react';
import { Animated, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useAppStore } from '../../stores/appStore';
import { DiagnosisStatus } from '../../types/diagnosis';
import { useTheme } from '../../hooks/useTheme';

type FilterType = 'ALL' | DiagnosisStatus;

const filters: { label: string; value: FilterType }[] = [
  { label: 'All', value: 'ALL' },
  { label: 'Pending', value: 'PENDING' },
  { label: 'Approved', value: 'APPROVED' },
  { label: 'Rejected', value: 'REJECTED' },
];

export default function HistoryScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const { fetchDiagnoses } = useDiagnosisStore();
  const { isAuthenticated } = useAppStore();
  const [filter, setFilter] = useState<FilterType>('ALL');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const filterAnimation = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    if (isAuthenticated) {
      fetchDiagnoses().catch(() => null);
    }
  }, [fetchDiagnoses, isAuthenticated]);

  // Mount animation
  useFocusEffect(
    React.useCallback(() => {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.95);

      // Start entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        // Cleanup when screen loses focus
      };
    }, [fadeAnim, slideAnim, scaleAnim])
  );

  useEffect(() => {
    filterAnimation.setValue(0);
    Animated.timing(filterAnimation, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [filter, filterAnimation]);

  const filteredDiagnoses = filter === 'ALL'
    ? diagnoses
    : diagnoses.filter((d) => d.status === filter);

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
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
      gap: 8,
    },
    filterChip: {
      paddingVertical: 6,
      paddingHorizontal: 12,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    filterText: {
      fontSize: 12,
      color: colors.text,
    },
    filterTextActive: {
      color: colors.textInverse,
    },
    list: {
      marginTop: 6,
    },
    emptyState: {
      padding: 24,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: colors.border,
      backgroundColor: colors.surface,
      alignItems: 'center',
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    emptyText: {
      fontSize: 13,
      color: colors.textMuted,
    },
    contentWrapper: {
      opacity: fadeAnim,
      transform: [
        {
          translateY: slideAnim,
        },
        {
          scale: scaleAnim,
        },
      ],
    },
    cardWrapper: {
      marginBottom: 12,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <ScrollView style={styles.container} contentContainerStyle={styles.content}>
          <Animated.View style={styles.contentWrapper}>
          <Text style={styles.title}>Diagnosis History</Text>
          <View style={styles.filtersRow}>
            {filters.map(({ label, value }) => (
              <TouchableOpacity
                key={value}
                onPress={() => setFilter(value)}
                style={[styles.filterChip, filter === value && styles.filterChipActive]}
              >
                <Text style={[styles.filterText, filter === value && styles.filterTextActive]}>
                  {label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Animated.View
            style={[
              styles.list,
              {
                opacity: filterAnimation,
                transform: [
                  {
                    translateY: filterAnimation.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {filteredDiagnoses.length > 0 ? (
              filteredDiagnoses.map((diagnosis) => (
                <Animated.View
                  key={diagnosis.id}
                  style={styles.cardWrapper}
                >
                  <PendingDiagnosisCard
                    diagnosis={diagnosis}
                    onPress={() => navigation.navigate('DiagnosisDetail', { id: diagnosis.id })}
                  />
                </Animated.View>
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
          </Animated.View>
        </Animated.View>
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}