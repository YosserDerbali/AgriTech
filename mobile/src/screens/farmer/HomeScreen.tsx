import React from 'react';
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
import { colors, shadows } from '../../theme/colors';
import { typography, fontFamilies, textPresets } from '../../theme/typography';
import { spacing, radius, padding } from '../../theme/spacing';


export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const insets = useSafeAreaInsets();
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const recentDiagnoses = diagnoses.slice(0, 3);

  const handleHaptics = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  const pendingCount = diagnoses.filter((d) => d.status === 'PENDING').length;
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
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
              <View style={styles.notifBadge}>
                <Text style={styles.notifText}>2</Text>
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
            <Text style={styles.sectionTitle}>Quick Actions</Text>
            <View style={styles.actionsGrid}>
              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'Diagnose' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.successLight }]}>
                  <Feather name="camera" size={24} color={colors.success} />
                </View>
                <Text style={styles.actionText}>Scan Plant</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'History' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.pendingLight }]}>
                  <Ionicons name="time-outline" size={24} color={colors.pending} />
                </View>
                <Text style={styles.actionText}>History</Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.actionCard,
                  pressed && styles.actionCardPressed,
                ]}
                onPress={() => {
                  handleHaptics();
                  navigation.navigate('FarmerTabs', { screen: 'Articles' } as never);
                }}
              >
                <View style={[styles.actionIcon, { backgroundColor: colors.accentSoft }]}>
                  <Feather name="book" size={24} color={colors.accent} />
                </View>
                <Text style={styles.actionText}>Articles</Text>
              </Pressable>
            </View>
          </View>

          {/* Recent Diagnoses */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
              {recentDiagnoses.length > 0 && (
                <Pressable
                  onPress={() => {
                    handleHaptics();
                    navigation.navigate('FarmerTabs', { screen: 'History' } as never);
                  }}
                >
                  <Text style={styles.seeAll}>View all</Text>
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
              <View style={styles.emptyState}>
                <Ionicons name="leaf-outline" size={48} color={colors.textTertiary} />
                <Text style={styles.emptyTitle}>No diagnoses yet</Text>
                <Text style={styles.emptyText}>Start by scanning your first plant</Text>
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
            <Text style={styles.sectionTitle}>Pro Tips</Text>
            <View style={styles.tipCard}>
              <View style={styles.tipIcon}>
                <Text style={styles.tipEmoji}>💡</Text>
              </View>
              <View style={styles.tipContent}>
                <Text style={styles.tipTitle}>Better Results</Text>
                <Text style={styles.tipText}>
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
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
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
    ...textPresets.greeting,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: spacing.xs,
  },
  heroTitle: {
    ...textPresets.greetingName,
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
  notifBadge: {
    position: 'absolute',
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
    backdropFilter: 'blur(10px)',
  },
  statNumber: {
    ...textPresets.statNumber,
    color: '#fff',
    marginBottom: spacing.xs,
  },
  statLabel: {
    ...textPresets.statLabel,
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
  sectionTitle: {
    ...typography.heading4,
    color: colors.text,
  },
  seeAll: {
    ...typography.bodySemibold,
    color: colors.primary,
  },

  // Quick Actions
  actionsGrid: {
    flexDirection: 'row',
    gap: spacing.md,
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
  actionIcon: {
    width: 52,
    height: 52,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionText: {
    ...typography.bodySemibold,
    color: colors.text,
    textAlign: 'center',
  },

  // Empty State
  emptyState: {
    backgroundColor: colors.surface,
    borderRadius: radius['2xl'],
    padding: spacing['3xl'],
    alignItems: 'center',
    gap: spacing.md,
    ...shadows.sm,
  },
  emptyTitle: {
    ...typography.heading5,
    color: colors.text,
  },
  emptyText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
  },
  emptyButton: {
    marginTop: spacing.lg,
    minWidth: 160,
  },

  // Tips
  tipCard: {
    flexDirection: 'row',
    backgroundColor: colors.accentSoft,
    borderRadius: radius.xl,
    padding: spacing.lg,
    alignItems: 'flex-start',
    gap: spacing.lg,
    ...shadows.xs,
  },
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
  tipTitle: {
    ...typography.bodySemibold,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  tipText: {
    ...typography.small,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});
