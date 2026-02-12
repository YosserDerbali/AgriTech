import React from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { FarmerStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { DiagnosisCard } from '../../components/diagnosis/DiagnosisCard';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';

export default function HomeScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const diagnoses = useDiagnosisStore((s) => s.diagnoses);
  const recentDiagnoses = diagnoses.slice(0, 3);

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.hero}>
          <Text style={styles.heroTitle}>Welcome back! 👋</Text>
          <Text style={styles.heroSubtitle}>
            Protect your crops with AI-powered disease detection
          </Text>
          <Button
            title="New Diagnosis"
            icon={<Feather name="camera" size={20} color={colors.success} />}
            textColor={colors.success}
            onPress={() => navigation.navigate('FarmerTabs', { screen: 'Diagnose' } as never)}
            style={styles.heroButton}
          />
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Diagnoses</Text>
            <Text style={styles.link} onPress={() => navigation.navigate('FarmerTabs', { screen: 'History' } as never)}>
              View all
            </Text>
          </View>

          {recentDiagnoses.length > 0 ? (
            recentDiagnoses.map((diagnosis) => (
              <DiagnosisCard
                key={diagnosis.id}
                diagnosis={diagnosis}
                onPress={() => navigation.navigate('DiagnosisDetail', { id: diagnosis.id })}
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No diagnoses yet</Text>
              <Text style={styles.emptyText}>Start by scanning your first plant.</Text>
              <Button
                title="Scan Plant"
                onPress={() => navigation.navigate('FarmerTabs', { screen: 'Diagnose' } as never)}
                style={styles.emptyButton}
              />
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quick Tips</Text>
          <View style={styles.tipCard}>
            <Text style={styles.tipText}>
              💡 Pro tip: Take photos in natural daylight and focus on the affected area.
            </Text>
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
    paddingBottom: 24,
  },
  hero: {
    padding: 20,
    backgroundColor: colors.primary,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 6,
  },
  heroSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.85)',
    marginBottom: 16,
  },
  heroButton: {
    backgroundColor: '#FFFFFF',
  },
  section: {
    paddingHorizontal: 16,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
  link: {
    fontSize: 14,
    color: colors.primary,
    fontWeight: '600',
  },
  emptyState: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: colors.border,
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
    marginBottom: 12,
  },
  emptyButton: {
    alignSelf: 'flex-start',
  },
  tipCard: {
    backgroundColor: '#E2E8F0',
    padding: 16,
    borderRadius: 16,
    marginTop: 10,
  },
  tipText: {
    color: colors.text,
    fontSize: 13,
  },
});
