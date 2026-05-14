import React, { useState, useEffect, useRef } from 'react';
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
  Animated,
  Dimensions,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Audio } from 'expo-av';
import { FarmerStackParamList } from '../../navigation/types';
import { ImageUploader } from '../../components/diagnosis/ImageUploader';
import { Button } from '../../components/ui/Button';
import { Textarea } from '../../components/ui/Textarea';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { transcribeVoiceNote } from '../../services/farmerAPI';
import { useTheme } from '../../hooks/useTheme';

export default function DiagnoseScreen() {
  const { colors, shadows } = useTheme();
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

  // Step management
  const [currentStep, setCurrentStep] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(1)).current;

  const steps = [
    { id: 0, title: 'Upload Image', icon: 'camera', required: true },
    { id: 1, title: 'Plant Name', icon: 'leaf', required: false },
    { id: 2, title: 'Additional Context', icon: 'message-square', required: false },
    { id: 3, title: 'Review & Submit', icon: 'check-circle', required: true },
  ];

  useEffect(() => {
    return () => {
      if (recording) {
        recording.stopAndUnloadAsync().catch(() => null);
      }
    };
  }, [recording]);

  // Reset form when screen comes into focus
  useFocusEffect(
    React.useCallback(() => {
      resetDiagnosisForm();

      // Mount animations
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.95);

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
    }, [fadeAnim, slideAnim, scaleAnim])
  );

  const appendTranscript = (transcript: string) => {
    if (!transcript.trim()) {
      return;
    }

    setContext((previous) => {
      const current = previous.trimEnd();
      return current.length > 0 ? `${current}\n${transcript.trim()}` : transcript.trim();
    });
  };

  // Step navigation with animations
  const animateTransition = (direction: 'next' | 'prev') => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 150,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'next' ? -50 : 50,
        duration: 0,
        useNativeDriver: true,
      }),
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ]).start();
  };

  const nextStep = () => {
    if (currentStep < steps.length - 1) {
      animateTransition('next');
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      animateTransition('prev');
      setCurrentStep(currentStep - 1);
    }
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 0: // Image upload
        return selectedImage !== null;
      case 1: // Plant name
        return true; // Optional
      case 2: // Context
        return true; // Optional
      case 3: // Review
        return selectedImage !== null;
      default:
        return false;
    }
  };

  // Reset function to clear all state
  const resetDiagnosisForm = () => {
    setCurrentStep(0);
    setSelectedImage(null);
    setPlantName('');
    setContext('');
    setIsRecording(false);
    setIsTranscribing(false);
    setRecording(null);
    setRecordingDurationMs(0);
    // Reset animations
    fadeAnim.setValue(1);
    slideAnim.setValue(0);
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
    header: {
      marginBottom: 24,
    },
    title: {
      fontSize: 22,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 16,
      textAlign: 'center',
    },
    progressContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      marginBottom: 24,
    },
    stepIndicator: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 2,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
      marginHorizontal: 8,
      backgroundColor: colors.surface,
    },
    stepIndicatorActive: {
      borderColor: colors.primary,
      backgroundColor: colors.primary,
    },
    stepIndicatorCompleted: {
      borderColor: colors.success,
      backgroundColor: colors.success,
    },
    stepIcon: {
      color: colors.muted,
    },
    stepIconActive: {
      color: colors.textInverse,
    },
    stepIconCompleted: {
      color: colors.textInverse,
    },
    stepLine: {
      height: 2,
      backgroundColor: colors.border,
      flex: 1,
      marginHorizontal: 8,
    },
    stepLineActive: {
      backgroundColor: colors.primary,
    },
    stepContainer: {
      flex: 1,
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    },
    stepTitle: {
      fontSize: 20,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 8,
      textAlign: 'center',
    },
    stepDescription: {
      fontSize: 14,
      color: colors.textSecondary,
      textAlign: 'center',
      marginBottom: 24,
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
      color: colors.textSecondary,
    },
    navigationButtons: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: 24,
    },
    navButton: {
      flex: 1,
      marginHorizontal: 8,
    },
    submitButton: {
      marginTop: 6,
    },
    reviewSection: {
      marginBottom: 16,
    },
    reviewItem: {
      flexDirection: 'row',
      alignItems: 'center',
      padding: 12,
      backgroundColor: colors.surface,
      borderRadius: 12,
      marginBottom: 8,
      borderWidth: 1,
      borderColor: colors.border,
    },
    reviewItemText: {
      flex: 1,
      fontSize: 14,
      color: colors.text,
    },
    reviewItemIcon: {
      marginRight: 12,
    },
  });

  const renderProgressIndicator = () => (
    <View style={styles.progressContainer}>
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <View
            style={[
              styles.stepIndicator,
              index === currentStep && styles.stepIndicatorActive,
              index < currentStep && styles.stepIndicatorCompleted,
            ]}
          >
            <Feather
              name={step.icon as any}
              size={20}
              style={[
                styles.stepIcon,
                index === currentStep && styles.stepIconActive,
                index < currentStep && styles.stepIconCompleted,
              ]}
            />
          </View>
          {index < steps.length - 1 && (
            <View
              style={[
                styles.stepLine,
                index < currentStep && styles.stepLineActive,
              ]}
            />
          )}
        </React.Fragment>
      ))}
    </View>
  );

  const renderStepContent = () => {
    const stepDescriptions = {
      0: 'Upload a clear photo of your plant to get started',
      1: 'Give your plant a name to help identify it',
      2: 'Add any additional details about symptoms or conditions',
      3: 'Review your information before submitting',
    };

    switch (currentStep) {
      case 0:
        return (
          <Animated.View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Upload Plant Image</Text>
            <Text style={styles.stepDescription}>{stepDescriptions[0]}</Text>
            <View style={styles.section}>
              <ImageUploader
                selectedImage={selectedImage}
                onImageSelect={setSelectedImage}
                onClear={() => setSelectedImage(null)}
              />
            </View>
          </Animated.View>
        );

      case 1:
        return (
          <Animated.View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Plant Name</Text>
            <Text style={styles.stepDescription}>{stepDescriptions[1]}</Text>
            <View style={styles.section}>
              <TextInput
                placeholder="Enter the plant name (optional)"
                placeholderTextColor={colors.muted}
                value={plantName}
                onChangeText={setPlantName}
                style={styles.plantNameInput}
                returnKeyType="done"
                autoFocus
              />
            </View>
          </Animated.View>
        );

      case 2:
        return (
          <Animated.View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Additional Context</Text>
            <Text style={styles.stepDescription}>{stepDescriptions[2]}</Text>
            <TouchableOpacity
              activeOpacity={1}
              style={styles.section}
              onPress={Keyboard.dismiss}
            >
              <Textarea
                placeholder="Describe any symptoms, growing conditions, or concerns..."
                value={context}
                onChangeText={setContext}
                style={styles.textarea}
                autoFocus
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
          </Animated.View>
        );

      case 3:
        return (
          <Animated.View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Review & Submit</Text>
            <Text style={styles.stepDescription}>{stepDescriptions[3]}</Text>

            <View style={styles.reviewSection}>
              <View style={styles.reviewItem}>
                <Feather name="camera" size={20} color={colors.primary} style={styles.reviewItemIcon} />
                <Text style={styles.reviewItemText}>
                  {selectedImage ? 'Image uploaded' : 'No image selected'}
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Feather name="leaf" size={20} color={plantName.trim() ? colors.primary : colors.muted} style={styles.reviewItemIcon} />
                <Text style={styles.reviewItemText}>
                  {plantName.trim() || 'No plant name provided'}
                </Text>
              </View>

              <View style={styles.reviewItem}>
                <Feather name="message-square" size={20} color={context.trim() ? colors.primary : colors.muted} style={styles.reviewItemIcon} />
                <Text style={styles.reviewItemText}>
                  {context.trim() ? 'Context provided' : 'No additional context'}
                </Text>
              </View>
            </View>

            <View style={styles.infoBox}>
              <Text style={styles.infoTitle}>How it works</Text>
              <Text style={styles.infoText}>
                Your image will be analyzed by AI and reviewed by an agronomist for accurate diagnosis and treatment.
              </Text>
            </View>
          </Animated.View>
        );

      default:
        return null;
    }
  };

  const renderNavigationButtons = () => (
    <View style={styles.navigationButtons}>
      {currentStep > 0 && (
        <Button
          title="Previous"
          variant="outline"
          onPress={prevStep}
          style={styles.navButton}
        />
      )}
      {currentStep < steps.length - 1 ? (
        <Button
          title="Next"
          onPress={nextStep}
          disabled={!canProceedToNext()}
          style={styles.navButton}
        />
      ) : (
        <Button
          title={isLoading ? 'Analyzing...' : 'Submit for Diagnosis'}
          onPress={handleSubmit}
          disabled={!selectedImage || isLoading}
          style={styles.navButton}
        />
      )}
    </View>
  );

  return (
    <SafeAreaView style={styles.safeContainer}>
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
          <View style={styles.header}>
            <Text style={styles.title}>New Diagnosis</Text>
            {renderProgressIndicator()}
          </View>

          {renderStepContent()}
          {renderNavigationButtons()}
        </ScrollView>
      </KeyboardAvoidingView>
      </Animated.View>
    </SafeAreaView>
  );
}