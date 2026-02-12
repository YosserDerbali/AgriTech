import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useArticleStore } from '../../stores/articleStore';
import { AgronomistStatCard } from '../../components/agronomist/AgronomistStatCard';
import { PendingDiagnosisCard } from '../../components/agronomist/PendingDiagnosisCard';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';

export default function AgronomistDashboardScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { diagnoses, getPendingDiagnoses } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();

  const pendingDiagnoses = getPendingDiagnoses();
  const approvedCount = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const rejectedCount = diagnoses.filter((d) => d.status === 'REJECTED').length;
  const myArticles = getMyArticles();

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Dashboard</Text>

        <View style={styles.welcomeCard}>
          <Text style={styles.welcomeTitle}>Welcome back, Dr. Green!</Text>
          <Text style={styles.welcomeText}>
            You have {pendingDiagnoses.length} diagnoses waiting for your review.
        </Text>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AgronomistStatCard title="Pending Review" value={pendingDiagnoses.length} variant="warning" />
        </View>
        <View style={styles.statItemLast}>
          <AgronomistStatCard title="Approved" value={approvedCount} variant="success" trend={{ value: 12, isPositive: true }} />
        </View>
      </View>
      <View style={styles.statsRow}>
        <View style={styles.statItem}>
          <AgronomistStatCard title="Rejected" value={rejectedCount} />
        </View>
        <View style={styles.statItemLast}>
          <AgronomistStatCard title="My Articles" value={myArticles.length} variant="accent" />
        </View>
      </View>

      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Pending Diagnoses</Text>
        <Text style={styles.link} onPress={() => navigation.navigate('AgronomistTabs', { screen: 'PendingQueue' } as never)}>
          View All
        </Text>
      </View>

      {pendingDiagnoses.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>All caught up!</Text>
          <Text style={styles.emptyText}>No pending diagnoses to review.</Text>
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

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Quick Actions</Text>
        <View style={styles.quickRow}>
          <Button
            title="Review Queue"
            variant="outline"
            icon={<Feather name="camera" size={18} color={colors.text} />}
            onPress={() => navigation.navigate('AgronomistTabs', { screen: 'PendingQueue' } as never)}
            style={styles.quickButton}
          />
          <Button
            title="Write Article"
            variant="outline"
            icon={<Feather name="camera" size={18} color={colors.text} />}
            onPress={() => navigation.navigate('ArticleEditor', {})}
            style={styles.quickButtonLast}
          />
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
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  welcomeCard: {
    backgroundColor: '#E0F2FE',
    padding: 16,
    borderRadius: 16,
    marginBottom: 16,
  },
  welcomeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  welcomeText: {
    fontSize: 13,
    color: colors.muted,
  },
  statsRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  statItem: {
    flex: 1,
    marginRight: 12,
  },
  statItemLast: {
    flex: 1,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
  link: {
    fontSize: 13,
    color: colors.accent,
    fontWeight: '600',
  },
  emptyState: {
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#BBF7D0',
    backgroundColor: '#ECFDF5',
    marginBottom: 12,
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
  section: {
    marginTop: 12,
  },
  quickRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  quickButton: {
    flex: 1,
    marginRight: 10,
  },
  quickButtonLast: {
    flex: 1,
  },
});
