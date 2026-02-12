import React, { useState } from 'react';
import { Alert, Image, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { format, formatDistanceToNow } from 'date-fns';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { StatusBadge } from '../../components/ui/StatusBadge';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';

export default function DiagnosisReviewScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const route = useRoute<RouteProp<AgronomistStackParamList, 'DiagnosisReview'>>();
  const { getDiagnosis, approveDiagnosis, rejectDiagnosis, updateDiagnosis } = useDiagnosisStore();

  const diagnosis = getDiagnosis(route.params.id);

  const [isEditing, setIsEditing] = useState(false);
  const [editedDisease, setEditedDisease] = useState(diagnosis?.diseaseName || '');
  const [treatment, setTreatment] = useState(diagnosis?.treatment || '');
  const [notes, setNotes] = useState(diagnosis?.agronomistNotes || '');
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectForm, setShowRejectForm] = useState(false);

  if (!diagnosis) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Diagnosis not found</Text>
      </View>
    );
  }

  const isLowConfidence = diagnosis.confidence !== null && diagnosis.confidence < 0.7;

  const handleApprove = () => {
    if (!treatment.trim()) {
      Alert.alert('Missing treatment', 'Please provide treatment recommendations.');
      return;
    }
    approveDiagnosis(diagnosis.id, treatment, notes);
    Alert.alert('Approved', 'Diagnosis approved successfully.');
    navigation.goBack();
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      Alert.alert('Missing reason', 'Please provide a reason for rejection.');
      return;
    }
    rejectDiagnosis(diagnosis.id, rejectionReason);
    Alert.alert('Rejected', 'Diagnosis rejected.');
    navigation.goBack();
  };

  const handleSaveEdits = () => {
    updateDiagnosis(diagnosis.id, { diseaseName: editedDisease });
    setIsEditing(false);
    Alert.alert('Updated', 'Diagnosis updated.');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Review Diagnosis</Text>
      <StatusBadge status={diagnosis.status} />

      <Card style={styles.card}>
        <Image source={{ uri: diagnosis.imageUrl }} style={styles.image} />
        <Text style={styles.plantName}>{diagnosis.plantName}</Text>
      </Card>

      <Card style={[styles.card, isLowConfidence && styles.lowConfidence]}>
        <Text style={styles.cardTitle}>AI Analysis</Text>
        {isLowConfidence ? <Text style={styles.warning}>Low confidence</Text> : null}

        <Text style={styles.label}>Detected Disease</Text>
        {isEditing ? (
          <View style={styles.row}>
            <Input value={editedDisease} onChangeText={setEditedDisease} style={styles.flex} />
            <Button title="Save" onPress={handleSaveEdits} style={styles.saveButton} />
          </View>
        ) : (
          <View style={styles.row}>
            <Text style={styles.value}>{diagnosis.diseaseName || 'Unknown'}</Text>
            {diagnosis.status === 'PENDING' ? (
              <Button title="Edit" variant="outline" onPress={() => setIsEditing(true)} />
            ) : null}
          </View>
        )}

        <Text style={styles.label}>Confidence Score</Text>
        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {
                width: `${(diagnosis.confidence || 0) * 100}%`,
                backgroundColor: isLowConfidence ? colors.warning : colors.success,
              },
            ]}
          />
        </View>
        <Text style={styles.value}>
          {diagnosis.confidence !== null ? `${Math.round(diagnosis.confidence * 100)}%` : 'N/A'}
        </Text>

        <Text style={styles.metaText}>{format(diagnosis.createdAt, 'MMM d, yyyy HH:mm')}</Text>
        <Text style={styles.metaText}>{formatDistanceToNow(diagnosis.createdAt, { addSuffix: true })}</Text>
      </Card>

      {diagnosis.status === 'PENDING' && !showRejectForm ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Treatment Recommendation</Text>
          <Textarea
            placeholder="Provide detailed treatment recommendations..."
            value={treatment}
            onChangeText={setTreatment}
            style={styles.textarea}
          />
          <Textarea
            placeholder="Additional notes (optional)"
            value={notes}
            onChangeText={setNotes}
            style={styles.textarea}
          />
        </Card>
      ) : null}

      {diagnosis.status === 'PENDING' && showRejectForm ? (
        <Card style={[styles.card, styles.rejectCard]}>
          <Text style={styles.cardTitle}>Rejection Reason</Text>
          <Textarea
            placeholder="Please explain why this diagnosis is being rejected..."
            value={rejectionReason}
            onChangeText={setRejectionReason}
            style={styles.textarea}
          />
        </Card>
      ) : null}

      {diagnosis.status !== 'PENDING' && diagnosis.treatment ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Treatment</Text>
          <Text style={styles.value}>{diagnosis.treatment}</Text>
        </Card>
      ) : null}

      {diagnosis.status !== 'PENDING' && diagnosis.agronomistNotes ? (
        <Card style={styles.card}>
          <Text style={styles.cardTitle}>Agronomist Notes</Text>
          <Text style={styles.value}>{diagnosis.agronomistNotes}</Text>
        </Card>
      ) : null}

      {diagnosis.status === 'PENDING' ? (
        <View style={styles.actionRow}>
          <Button
            title={showRejectForm ? 'Back to Approval' : 'Reject'}
            variant="outline"
            onPress={() => setShowRejectForm(!showRejectForm)}
            style={styles.actionButton}
          />
          <Button
            title={showRejectForm ? 'Confirm Rejection' : 'Approve'}
            onPress={showRejectForm ? handleReject : handleApprove}
            style={styles.actionButtonLast}
          />
        </View>
      ) : null}
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
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  card: {
    marginBottom: 14,
  },
  image: {
    width: '100%',
    height: 180,
    borderRadius: 12,
    marginBottom: 8,
  },
  plantName: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 8,
  },
  value: {
    fontSize: 14,
    color: colors.text,
    marginBottom: 8,
  },
  warning: {
    color: colors.warning,
    fontSize: 12,
    marginBottom: 6,
  },
  lowConfidence: {
    borderColor: '#FCD34D',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  flex: {
    flex: 1,
  },
  saveButton: {
    marginLeft: 8,
  },
  progressTrack: {
    height: 8,
    backgroundColor: '#E2E8F0',
    borderRadius: 999,
    overflow: 'hidden',
    marginTop: 6,
  },
  progressFill: {
    height: 8,
  },
  metaText: {
    fontSize: 11,
    color: colors.muted,
  },
  textarea: {
    minHeight: 90,
    marginTop: 8,
  },
  rejectCard: {
    borderColor: '#FCA5A5',
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 6,
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
  },
  actionButtonLast: {
    flex: 1,
  },
});
