import React, { useEffect, useState, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Animated } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

type SortOption = 'newest' | 'oldest' | 'confidence';

export default function PendingQueueScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { getPendingDiagnoses, fetchReviewQueue } = useDiagnosisStore();
  const { colors, shadows } = useTheme();
  const [sortBy, setSortBy] = useState<SortOption>('newest');
  const [showLowConfidenceOnly, setShowLowConfidenceOnly] = useState(false);

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;
  const filterAnim = useRef(new Animated.Value(1)).current;

  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    content: {
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },
    header: {
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    subtitle: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      fontWeight: '500',
      letterSpacing: 0.1,
    },
    filterSection: {
      marginBottom: spacing.xl,
    },
    filterLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      marginBottom: spacing.md,
    },
    filterChip: {
      alignSelf: 'flex-start',
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.text,
      fontSize: 13,
      lineHeight: 18,
      fontWeight: '500',
      marginBottom: spacing.md,
      ...shadows.xs,
    },
    filterChipActive: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
      color: colors.textInverse,
    },
    sortContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
      marginTop: spacing.md,
    },
    sortChip: {
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      borderWidth: 1,
      borderColor: colors.border,
      color: colors.textSecondary,
      fontSize: 12,
      lineHeight: 16,
      fontWeight: '500',
      letterSpacing: 0.2,
      backgroundColor: colors.surface,
    },
    sortChipActive: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      color: colors.primary,
      fontWeight: '600',
    },
    sortLabel: {
      fontSize: 12,
      fontWeight: '600',
      letterSpacing: 0.5,
      color: colors.textTertiary,
      textTransform: 'uppercase',
      marginBottom: spacing.md,
    },
    emptyState: {
      padding: spacing.xl,
      borderRadius: radius['2xl'],
      borderWidth: 1.5,
      borderColor: colors.primary,
      backgroundColor: colors.primarySoft,
      marginTop: spacing.xl,
      alignItems: 'center',
      ...shadows.xs,
    },
    emptyIcon: {
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.2,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    emptyText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      textAlign: 'center',
      letterSpacing: 0.1,
    },
    listContainer: {
      marginTop: spacing.lg,
    },
  });

  useEffect(() => {
    fetchReviewQueue().catch(() => null);
  }, [fetchReviewQueue]);

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

  // Filter/sort change animations
  useEffect(() => {
    filterAnim.setValue(0);
    Animated.timing(filterAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [sortBy, showLowConfidenceOnly, filterAnim]);

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
        <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <View style={dynamicStyles.header}>
          <Text style={dynamicStyles.title}>Pending Queue</Text>
          <Text style={dynamicStyles.subtitle}>
            {pendingDiagnoses.length} diagnosis{pendingDiagnoses.length !== 1 ? 'es' : ''} waiting for review
          </Text>
        </View>

        <View style={dynamicStyles.filterSection}>
          <Text style={dynamicStyles.filterLabel}>Filter</Text>
          <TouchableOpacity
            onPress={() => setShowLowConfidenceOnly(!showLowConfidenceOnly)}
            activeOpacity={0.7}
          >
            <Text style={[dynamicStyles.filterChip, showLowConfidenceOnly && dynamicStyles.filterChipActive]}>
              Low Confidence ({lowConfidenceCount})
            </Text>
          </TouchableOpacity>
        </View>

        <View style={dynamicStyles.filterSection}>
          <Text style={dynamicStyles.sortLabel}>Sort By</Text>
          <View style={dynamicStyles.sortContainer}>
            {(['newest', 'oldest', 'confidence'] as SortOption[]).map((option) => (
              <TouchableOpacity
                key={option}
                onPress={() => setSortBy(option)}
                activeOpacity={0.6}
              >
                <Text
                  style={[dynamicStyles.sortChip, sortBy === option && dynamicStyles.sortChipActive]}
                >
                  {option === 'newest' ? 'Newest' : option === 'oldest' ? 'Oldest' : 'Confidence'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {filteredDiagnoses.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <View style={dynamicStyles.emptyIcon}>
              <Feather
                name={showLowConfidenceOnly ? 'alert-circle' : 'inbox'}
                size={44}
                color={colors.primary}
              />
            </View>
            <Text style={dynamicStyles.emptyTitle}>
              {showLowConfidenceOnly ? 'All good!' : 'All caught up!'}
            </Text>
            <Text style={dynamicStyles.emptyText}>
              {showLowConfidenceOnly
                ? 'No low confidence diagnoses to review.'
                : 'No pending diagnoses in the queue.'}
            </Text>
          </View>
        ) : (
          <Animated.View
            style={[
              dynamicStyles.listContainer,
              {
                opacity: filterAnim,
                transform: [
                  {
                    translateY: filterAnim.interpolate({
                      inputRange: [0, 1],
                      outputRange: [10, 0],
                    }),
                  },
                ],
              },
            ]}
          >
            {filteredDiagnoses.map((diagnosis) => (
              <PendingDiagnosisCard
                key={diagnosis.id}
                diagnosis={diagnosis}
                onPress={() => navigation.navigate('DiagnosisReview', { id: diagnosis.id })}
              />
            ))}
          </Animated.View>
        )}
      </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}
