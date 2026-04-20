import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useArticleStore } from '../../stores/articleStore';
import { AgronomistStatCard } from '../../components/agronomist/AgronomistStatCard';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

export default function AgronomistDashboardScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { diagnoses, getPendingDiagnoses, fetchReviewQueue } = useDiagnosisStore();
  const { getMyArticles, fetchMyArticles } = useArticleStore();

  useEffect(() => {
    fetchReviewQueue().catch(() => null);
  }, [fetchReviewQueue]);

  const pendingDiagnoses = getPendingDiagnoses();
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const rejectedCount = diagnoses.filter((d) => d.status === 'REJECTED').length;
  const myArticles = getMyArticles();

  useEffect(() => {
    fetchReviewQueue().catch(() => null);
    fetchMyArticles().catch(() => null);
  }, [fetchReviewQueue, fetchMyArticles]);

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
    title: {
      fontSize: 32,
      fontWeight: '700',
      letterSpacing: -0.5,
      color: colors.text,
      marginBottom: spacing.xl,
    },
    welcomeCard: {
      backgroundColor: colors.primary,
      padding: spacing.xl,
      borderRadius: radius['3xl'],
      marginBottom: spacing.xl,
      ...shadows.md,
    },
    welcomeCardContent: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    welcomeTextContainer: {
      flex: 1,
    },
    welcomeTitle: {
      fontSize: 20,
      fontWeight: '700',
      letterSpacing: -0.4,
      color: colors.textInverse,
      marginBottom: spacing.sm,
    },
    welcomeSubtitle: {
      fontSize: 15,
      fontWeight: '500',
      letterSpacing: 0.1,
      color: colors.textInverse,
      opacity: 0.95,
      lineHeight: 22,
    },
    welcomeIcon: {
      marginLeft: spacing.lg,
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: 'rgba(255,255,255,0.2)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    sectionHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginTop: spacing.xl,
      marginBottom: spacing.lg,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '700',
      letterSpacing: -0.3,
      color: colors.text,
    },
    link: {
      fontSize: 13,
      color: colors.primary,
      fontWeight: '600',
      letterSpacing: 0.2,
      paddingHorizontal: spacing.md,
      paddingVertical: spacing.xs,
    },
    emptyState: {
      padding: spacing.xl,
      borderRadius: radius['2xl'],
      borderWidth: 1.5,
      borderColor: colors.primaryLight,
      backgroundColor: colors.primarySoft,
      marginBottom: spacing.lg,
      alignItems: 'center',
      ...shadows.xs,
    },
    emptyStateIcon: {
      marginBottom: spacing.lg,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: -0.2,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    emptyText: {
      fontSize: 13,
      lineHeight: 20,
      color: colors.textSecondary,
      textAlign: 'center',
      letterSpacing: 0.1,
    },
    section: {
      marginTop: spacing.xl,
    },
    quickButtonsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginTop: spacing.lg,
    },
    quickButton: {
      flex: 1,
    },
  });

  const staticStyles = StyleSheet.create({
    statsRow: {
      flexDirection: 'row',
      gap: spacing.md,
      marginBottom: spacing.lg,
    },
    statItem: {
      flex: 1,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Dashboard</Text>

        <View style={dynamicStyles.welcomeCard}>
          <View style={dynamicStyles.welcomeCardContent}>
            <View style={dynamicStyles.welcomeTextContainer}>
              <Text style={dynamicStyles.welcomeTitle}>Welcome back</Text>
              <Text style={dynamicStyles.welcomeSubtitle}>
                {pendingDiagnoses.length === 0 
                  ? '✓ All caught up!' 
                  : `${pendingDiagnoses.length} awaiting your review`}
              </Text>
            </View>
            <View style={dynamicStyles.welcomeIcon}>
              <Feather 
                name={pendingDiagnoses.length === 0 ? 'check-circle' : 'alert-circle'} 
                size={24} 
                color={colors.textInverse} 
              />
            </View>
          </View>
        </View>

        <View style={staticStyles.statsRow}>
          <View style={staticStyles.statItem}>
            <AgronomistStatCard 
              title="Pending" 
              value={pendingDiagnoses.length} 
              variant="warning"
              icon="clock"
            />
          </View>
          <View style={staticStyles.statItem}>
            <AgronomistStatCard 
              title="Approved" 
              value={approvedCount} 
              variant="success"
              trend={{ value: 12, isPositive: true }}
              icon="check"
            />
          </View>
        </View>

        <View style={staticStyles.statsRow}>
          <View style={staticStyles.statItem}>
            <AgronomistStatCard 
              title="Rejected" 
              value={rejectedCount}
              icon="x-circle"
            />
          </View>
          <View style={staticStyles.statItem}>
            <AgronomistStatCard 
              title="Articles" 
              value={myArticles.length} 
              variant="accent"
              icon="file-text"
            />
          </View>
        </View>

        <View style={dynamicStyles.sectionHeader}>
          <Text style={dynamicStyles.sectionTitle}>Recent Activity</Text>
          {pendingDiagnoses.length > 0 && (
            <TouchableOpacity onPress={() => navigation.navigate('AgronomistTabs', { screen: 'PendingQueue' } as never)}>
              <Text style={dynamicStyles.link}>View All</Text>
            </TouchableOpacity>
          )}
        </View>

        {pendingDiagnoses.length === 0 ? (
          <View style={dynamicStyles.emptyState}>
            <View style={dynamicStyles.emptyStateIcon}>
              <Feather name="inbox" size={40} color={colors.primary} />
            </View>
            <Text style={dynamicStyles.emptyTitle}>All caught up!</Text>
            <Text style={dynamicStyles.emptyText}>No pending diagnoses to review right now.</Text>
          </View>
        ) : (
          pendingDiagnoses.slice(0, 2).map((diagnosis) => (
            <PendingDiagnosisCard
              key={diagnosis.id}
              diagnosis={diagnosis}
              onPress={() => navigation.navigate('DiagnosisReview', { id: diagnosis.id })}
            />
          ))
        )}

        <View style={dynamicStyles.section}>
          <View style={dynamicStyles.sectionHeader}>
            <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
          </View>
          <View style={dynamicStyles.quickButtonsRow}>
            <Button
              title="Review Queue"
              icon={<Feather name="inbox" size={18} />}
              onPress={() => navigation.navigate('AgronomistTabs', { screen: 'PendingQueue' } as never)}
              style={dynamicStyles.quickButton}
            />
            <Button
              title="Write Article"
              icon={<Feather name="edit-3" size={18} />}
              onPress={() => navigation.navigate('ArticleEditor', {})}
              style={dynamicStyles.quickButton}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


