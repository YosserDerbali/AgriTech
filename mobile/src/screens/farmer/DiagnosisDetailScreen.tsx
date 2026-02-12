import React from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format } from 'date-fns';
import { FarmerStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';

export default function DiagnosisDetailScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const route = useRoute<RouteProp<FarmerStackParamList, 'DiagnosisDetail'>>();
  const diagnosis = useDiagnosisStore((s) => s.getDiagnosis(route.params.id));

  if (!diagnosis) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Diagnosis not found</Text>
        <Button title="Go to History" variant="outline" onPress={() => navigation.goBack()} />
      </View>
    );
  }

  const handleReport = () => {
    Alert.alert('Report', 'Report feature ready for backend integration.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Image source={{ uri: diagnosis.imageUrl }} style={styles.image} />
      <View style={styles.statusWrap}>
        <StatusBadge status={diagnosis.status} />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>{diagnosis.diseaseName || 'Pending Analysis'}</Text>
        <Text style={styles.subheading}>Plant: {diagnosis.plantName}</Text>
        <Text style={styles.metaText}>Submitted {format(diagnosis.createdAt, 'MMM d, yyyy h:mm a')}</Text>
      </View>

      {diagnosis.confidence !== null && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>AI Confidence</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${diagnosis.confidence * 100}%` }]} />
          </View>
          <Text style={styles.progressValue}>{Math.round(diagnosis.confidence * 100)}%</Text>
        </Card>
      )}

      {diagnosis.status === 'APPROVED' && diagnosis.treatment && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Treatment Recommendation</Text>
          <Text style={styles.cardText}>{diagnosis.treatment}</Text>
        </Card>
      )}

      {diagnosis.agronomistNotes && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Agronomist Notes</Text>
          <Text style={styles.cardText}>{diagnosis.agronomistNotes}</Text>
        </Card>
      )}

      {diagnosis.status === 'PENDING' && (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Awaiting Expert Review</Text>
          <Text style={styles.cardText}>
            An agronomist will review your submission and provide treatment recommendations soon.
          </Text>
        </Card>
      )}

      {diagnosis.status === 'REJECTED' && (
        <Card style={[styles.card, styles.rejected]}>
          <Text style={styles.cardTitle}>Review Required</Text>
          <Text style={styles.cardText}>
            {diagnosis.agronomistNotes || 'Please submit a new image with better quality for accurate diagnosis.'}
          </Text>
        </Card>
      )}

      <Button title="Report Incorrect Prediction" variant="outline" onPress={handleReport} />
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 16,
    marginBottom: 12,
  },
  statusWrap: {
    marginBottom: 12,
    alignItems: 'flex-start',
  },
  section: {
    marginBottom: 16,
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subheading: {
    fontSize: 14,
    color: colors.muted,
    marginTop: 6,
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 6,
  },
  card: {
    marginBottom: 14,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  cardText: {
    fontSize: 13,
    color: colors.muted,
  },
  progressTrack: {
    height: 10,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
  },
  progressFill: {
    height: 10,
    backgroundColor: colors.primary,
  },
  progressValue: {
    marginTop: 6,
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  rejected: {
    borderColor: '#FCA5A5',
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
});
