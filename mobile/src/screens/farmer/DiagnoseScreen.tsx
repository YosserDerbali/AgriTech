import React, { useState } from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { ImageUploader } from '../../components/diagnosis/ImageUploader';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { colors } from '../../theme/colors';

export default function DiagnoseScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { addDiagnosis, setLoading, isLoading } = useDiagnosisStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [context, setContext] = useState('');
  const [isRecording, setIsRecording] = useState(false);

  const handleSubmit = async () => {
    if (!selectedImage) {
      Alert.alert('Missing image', 'Please select an image first.');
      return;
    }

    setLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 1500));

    addDiagnosis({
      imageUrl: selectedImage,
      plantName: 'Unknown Plant',
      diseaseName: 'Analyzing...',
      confidence: null,
      status: 'PENDING',
      treatment: null,
      agronomistNotes: null,
    });

    setLoading(false);
    Alert.alert('Submitted', 'Diagnosis submitted for review.');
    navigation.navigate('FarmerTabs', { screen: 'History' } as never);
  };

  const toggleRecording = () => {
    if (!selectedImage) {
      Alert.alert('Add an image first', 'Please select an image before adding voice notes.');
      return;
    }
    setIsRecording(!isRecording);
    if (!isRecording) {
      Alert.alert('Voice recording', 'Voice recording is ready for backend integration.');
    }
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoid}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          scrollEnabled={true}
          keyboardShouldPersistTaps="handled"
        >
          <Text style={styles.title}>New Diagnosis</Text>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Image</Text>
            <ImageUploader
              selectedImage={selectedImage}
              onImageSelect={setSelectedImage}
              onClear={() => setSelectedImage(null)}
            />
          </View>

          <TouchableOpacity
            activeOpacity={1}
            style={styles.section}
            onPress={Keyboard.dismiss}
          >
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Additional Context</Text>
              <Text style={styles.optional}>(Optional)</Text>
            </View>
            <Textarea
              placeholder="Describe any symptoms, growing conditions, or concerns..."
              value={context}
              onChangeText={setContext}
              style={styles.textarea}
            />
            <Button
              title={isRecording ? 'Stop Recording' : 'Add Voice Note'}
              variant={isRecording ? 'destructive' : 'outline'}
              onPress={toggleRecording}
              style={styles.voiceButton}
            />
            {isRecording ? <Text style={styles.recording}>Recording voice note...</Text> : null}
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>How it works</Text>
            <Text style={styles.infoText}>
              Your image will be analyzed by AI and reviewed by an agronomist for accurate diagnosis and treatment.
            </Text>
          </View>

          <Button
            title={isLoading ? 'Analyzing...' : 'Submit for Diagnosis'}
            onPress={handleSubmit}
            disabled={!selectedImage || isLoading}
            style={styles.submitButton}
          />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardAvoid: {
    flex: 1,
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
    marginBottom: 16,
  },
  section: {
    marginBottom: 18,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  optional: {
    fontSize: 12,
    color: colors.muted,
  },
  textarea: {
    minHeight: 110,
  },
  voiceButton: {
    marginTop: 10,
  },
  recording: {
    marginTop: 8,
    color: colors.destructive,
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: colors.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 18,
  },
  infoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 6,
  },
  infoText: {
    fontSize: 13,
    color: colors.muted,
  },
  submitButton: {
    marginTop: 6,
  },
});
