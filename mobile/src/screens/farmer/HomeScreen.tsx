import React, { useEffect } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, Platform, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather, Ionicons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FarmerStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { DiagnosisCard } from '../../components/diagnosis/DiagnosisCard';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const insets = useSafeAreaInsets();
  const { diagnoses, fetchDiagnoses } = useDiagnosisStore();
  const { colors, shadows } = useTheme();
  const recentDiagnoses = diagnoses.slice(0, 3);

  const handleHaptics = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pendingCount = diagnoses.filter((d) => d.status === 'PENDING').length;
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
    },
    seeAll: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.primary,
    },
    actionCard: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius.xl,
      padding: spacing.lg,
      alignItems: 'center',
      gap: spacing.md,
      ...shadows.sm,
    },
    actionCardPressed: {
      transform: [{ scale: 0.97 }],
      backgroundColor: colors.primaryExtraLight,
    },
    actionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      textAlign: 'center',
    },
    emptyState: {
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      padding: spacing['3xl'],
      alignItems: 'center',
      gap: spacing.md,
      ...shadows.sm,
    },
    emptyTitle: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
    },
    emptyText: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
    },
    notifBadge: {
      position: 'absolute' as const,
      top: -4,
      right: -4,
      backgroundColor: colors.accent,
      borderRadius: radius.full,
      minWidth: 24,
      height: 24,
      justifyContent: 'center',
      alignItems: 'center',
    },
    notifText: {
      fontSize: 10,
      fontWeight: '700',
      color: colors.text,
    },
    tipCard: {
      flexDirection: 'row' as const,
      backgroundColor: colors.accentSoft,
      borderRadius: radius.xl,
      padding: spacing.lg,
      alignItems: 'flex-start',
      gap: spacing.lg,
      ...shadows.xs,
    },
    tipTitle: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    tipText: {
      fontSize: 12,
      color: colors.textSecondary,
      lineHeight: 20,
    },
  });

  useEffect(() => {
    fetchDiagnoses();
  }, []);

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView
        style={dynamicStyles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Section with Gradient */}
        <LinearGradient
          colors={[colors.primary, colors.primaryLight]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.heroGradient, { paddingTop: insets.top + spacing.lg }]}
        >
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.greeting}>Good morning,</Text>
              <Text style={styles.heroTitle}>Farmer</Text>
            </View>
            <Pressable
              style={styles.notifButton}
              onPress={() => {
                handleHaptics();
                navigation.navigate('FarmerTabs', { screen: 'History' } as never);
              }}
            >
              <Ionicons name="notifications-outline" size={24} color="#fff" />
              <View style={dynamicStyles.notifBadge}>
                <Text style={dynamicStyles.notifText}>2</Text>
              </View>
            </Pressable>
          </View>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{diagnoses.length}</Text>
              <Text style={styles.statLabel}>Total Scans</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{pendingCount}</Text>
              <Text style={styles.statLabel}>Pending</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{approvedCount}</Text>
              <Text style={styles.statLabel}>Approved</Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.mainContent}>
          {/* Quick Actions */}
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <Pressable
                style={({ pressed }) => [
                  dynamicStyles.actionCard,
                  pressed && dynamicStyles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'Diagnose' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.successLight }]}>
                  <Feather name="camera" size={24} color={colors.success} />
                </View>
                <Text style={dynamicStyles.actionText}>Scan Plant</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  dynamicStyles.actionCard,
                  pressed && dynamicStyles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'History' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.primarySoft }]}>
                  <Ionicons name="time-outline" size={24} color={colors.primary} />
                </View>
                <Text style={dynamicStyles.actionText}>History</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  dynamicStyles.actionCard,
                  pressed && dynamicStyles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'FarmerArticles' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.accentSoft }]}>
                  <Feather name="book" size={24} color={colors.accent} />
                </View>
                <Text style={dynamicStyles.actionText}>Articles</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Diagnoses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={dynamicStyles.sectionTitle}>Recent Diagnoses</Text>
              {recentDiagnoses.length > 0 && (
                <Pressable
                  onPress={() => {
                    handleHaptics();
                    navigation.navigate('FarmerTabs', { screen: 'History' } as never);
                  }}
                >
                  <Text style={dynamicStyles.seeAll}>View all</Text>
                </Pressable>
              )}
            </View>

            {recentDiagnoses.length > 0 ? (
              <>
                {recentDiagnoses.map((diagnosis) => (
                  <DiagnosisCard
                    key={diagnosis.id}
                    diagnosis={diagnosis}
                    onPress={() => {
                      handleHaptics();
                      navigation.navigate('DiagnosisDetail', { id: diagnosis.id });
                    }}
                  />
                ))}
              </>
            ) : (
              <View style={dynamicStyles.emptyState}>
                <Ionicons name="leaf-outline" size={48} color={colors.textTertiary} />
                <Text style={dynamicStyles.emptyTitle}>No diagnoses yet</Text>
                <Text style={dynamicStyles.emptyText}>Start by scanning your first plant</Text>
                <Button
                  title="Scan Plant"
                  onPress={() => {
                    handleHaptics();
                    navigation.navigate('FarmerTabs', { screen: 'Diagnose' } as never);
                  }}
                  style={styles.emptyButton}
                />
              </View>
            )}
          </View>

          {/* Tips Section */}
          <View style={styles.section}>
            <Text style={dynamicStyles.sectionTitle}>Pro Tips</Text>
            <View style={dynamicStyles.tipCard}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipEmoji}>💡</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={dynamicStyles.tipTitle}>Better Results</Text>
                <Text style={dynamicStyles.tipText}>
                  Take photos in natural daylight and focus on the affected area for more accurate diagnoses.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  content: {
    paddingBottom: spacing.xl,
  },

  // Hero Section
  heroGradient: {
    paddingHorizontal: spacing.lg,
    paddingBottom: spacing.xl,
    borderBottomLeftRadius: radius['4xl'],
    borderBottomRightRadius: radius['4xl'],
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: spacing.xl,
  },
  greeting: {
    fontSize: 14,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  notifButton: {
    position: 'relative',
    width: 44,
    height: 44,
    borderRadius: radius.full,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Stats Row
  statsRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
    marginBottom: spacing.xs,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '500',
    color: 'rgba(255,255,255,0.8)',
  },

  // Main Content
  mainContent: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.xl,
  },

  // Sections
  section: {
    marginBottom: spacing['3xl'],
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.lg,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },

  // Empty State
  emptyButton: {
    marginTop: spacing.lg,
    minWidth: 160,
  },

  // Tips
  tipIcon: {
    fontSize: 24,
    marginTop: spacing.sm,
  },
  tipEmoji: {
    fontSize: 28,
  },
  tipContent: {
    flex: 1,
  },
});