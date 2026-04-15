import React, { useState, useEffect } from 'react';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  Keyboard,
  TouchableOpacity,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { FarmerStackParamList } from '../../navigation/types';
import { ImageUploader } from '../../components/diagnosis/ImageUploader';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { transcribeVoiceNote } from '../../services/farmerAPI';
import { colors } from '../../theme/colors';

export default function DiagnoseScreen() {
  const minimumRecordingDurationMs = 1000;
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { addDiagnosis, setLoading, isLoading } = useDiagnosisStore();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [plantName, setPlantName] = useState('');
  const [context, setContext] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingDurationMs, setRecordingDurationMs] = useState(0);

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => null);
      }
    };
  }, [recording]);

  const appendTranscript = (transcript: string) => {
    if (!transcript.trim()) {
      return;
    }

    setContext((previous) => {
      const current = previous.trimEnd();
      return current.length > 0 ? `${current}\n${transcript.trim()}` : transcript.trim();
    });
  };

  const handleSubmit = async () => {
    const trimmedPlantName = plantName.trim();

    if (!selectedImage) {
      Alert.alert('Missing image', 'Please select an image first.');
      return;
    }

    setLoading(true);

    try {
      await addDiagnosis({
        imageUrl: selectedImage,
        plantName: trimmedPlantName || undefined,
        context: context.trim() || undefined,
      });

      Alert.alert('Submitted', 'Diagnosis submitted for review.');
      navigation.navigate('FarmerTabs', { screen: 'History' } as never);
    } catch (error) {
      const message = (error as Error)?.message || 'Failed to submit diagnosis.';
      Alert.alert('Diagnosis failed', message);
    } finally {
      setLoading(false);
    }
  };

  const startRecording = async () => {
    if (!selectedImage) {
      Alert.alert('Add an image first', 'Please select an image before adding voice notes.');
      return;
    }

    try {
      const currentPermission = await Audio.getPermissionsAsync();
      const permission =
        currentPermission.status === 'granted'
          ? currentPermission
          : await Audio.requestPermissionsAsync();

      if (permission.status !== 'granted') {
        Alert.alert('Microphone permission needed', 'Please allow microphone access to record voice notes.');
        return;
      }

      await Audio.setAudioModeAsync({
        allowsRecordingIOS: true,
        playsInSilentModeIOS: true,
      });

      const result = await Audio.Recording.createAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      result.recording.setProgressUpdateInterval(200);
      result.recording.setOnRecordingStatusUpdate((status) => {
        if (typeof status.durationMillis === 'number') {
          setRecordingDurationMs(status.durationMillis);
        }
      });
      setRecording(result.recording);
      setRecordingDurationMs(0);
      setIsRecording(true);
    } catch (error) {
      const code = (error as any)?.code;
      const message = (error as Error)?.message || 'Unknown error while starting recording.';
      const lowerMessage = message.toLowerCase();
      const isSimulatorHint =
        Platform.OS === 'ios' &&
        (lowerMessage.includes('simulator') || lowerMessage.includes('not available on ios simulator'));

      const helpText = isSimulatorHint
        ? 'Voice recording is not supported on iOS Simulator. Please test on a physical iPhone.'
        : 'Please verify microphone access in device settings and try again.';

      const diagnostic = code ? `Error code: ${String(code)}\n${message}` : message;
      Alert.alert('Recording could not start', `${diagnostic}\n\n${helpText}`);
    }
  };

  const stopRecordingAndTranscribe = async () => {
    if (!recording) {
      return;
    }

    try {
      setIsRecording(false);
      console.info('[DiagnoseScreen] Stopping voice recording', {
        durationMs: recordingDurationMs,
      });

      await recording.stopAndUnloadAsync();
      console.info('[DiagnoseScreen] Recording stopped and unloaded successfully');

      const uri = recording.getURI();
      console.info('[DiagnoseScreen] Recording URI resolved', { uri });

      setRecording(null);
      setRecordingDurationMs(0);

      await Audio.setAudioModeAsync({ allowsRecordingIOS: false });

      if (!uri) {
        Alert.alert('Recording failed', 'No audio was captured. Please try again.');
        return;
      }

      setIsTranscribing(true);
      console.info('[DiagnoseScreen] Sending voice note for transcription', { uri });
      const transcript = await transcribeVoiceNote(uri);
      console.info('[DiagnoseScreen] Transcription completed', {
        transcriptLength: transcript.trim().length,
      });

      if (!transcript.trim()) {
        Alert.alert('No speech detected', 'Try speaking closer to the microphone and record again.');
        return;
      }

      appendTranscript(transcript);
      Alert.alert('Voice note added', 'Your speech was converted to text and appended to Additional Context.');
    } catch (error) {
      const code = (error as any)?.code;
      const rawMessage = (error as Error)?.message || '';
      const lowerMessage = rawMessage.toLowerCase();

      console.error('[DiagnoseScreen] Voice note recording/transcription failed', {
        code,
        message: rawMessage,
        durationMs: recordingDurationMs,
      });

      if (code === 1010 || lowerMessage.includes('e_audio_nodata')) {
        setRecording(null);
        setRecordingDurationMs(0);
        Alert.alert(
          'Recording too short',
          'No audio data was captured (error 1010). Please hold recording for at least 1 second, then stop.'
        );
        return;
      }

      const message =
        (error as any)?.response?.data?.message ||
        rawMessage ||
        'Could not process voice note. Please try again.';
      Alert.alert('Transcription failed', message);
    } finally {
      await Audio.setAudioModeAsync({ allowsRecordingIOS: false }).catch(() => null);
      setIsTranscribing(false);
    }
  };

  const toggleRecording = async () => {
    if (isRecording) {
      if (recordingDurationMs < minimumRecordingDurationMs) {
        Alert.alert(
          'Recording too short',
          'Please keep recording for at least 1 second before stopping.'
        );
        return;
      }

      await stopRecordingAndTranscribe();
      return;
    }

    await startRecording();
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

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Plant Name</Text>
            <TextInput
              placeholder="Enter the plant name"
              placeholderTextColor={colors.muted}
              value={plantName}
              onChangeText={setPlantName}
              style={styles.plantNameInput}
              returnKeyType="done"
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
              disabled={isTranscribing}
              icon={
                <Feather
                  name={isRecording ? 'mic-off' : 'mic'}
                  size={18}
                  color={isRecording ? colors.textInverse : colors.primary}
                />
              }
            />
            {isRecording ? (
              <Text style={styles.recording}>
                Recording voice note... {(recordingDurationMs / 1000).toFixed(1)}s
              </Text>
            ) : null}
            {isTranscribing ? (
              <View style={styles.transcribingRow}>
                <ActivityIndicator size="small" color={colors.primary} />
                <Text style={styles.transcribingText}>Transcribing voice note...</Text>
              </View>
            ) : null}
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
  plantNameInput: {
    height: 48,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    color: colors.text,
    backgroundColor: colors.surface,
  },
  voiceButton: {
    marginTop: 10,
  },
  recording: {
    marginTop: 8,
    color: colors.error,
    fontSize: 12,
  },
  transcribingRow: {
    marginTop: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  transcribingText: {
    marginLeft: 8,
    color: colors.primary,
    fontSize: 12,
  },
  infoBox: {
    backgroundColor: colors.surface,
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