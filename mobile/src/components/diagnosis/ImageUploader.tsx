import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors } from '../../theme/colors';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (uri: string) => void;
  onClear: () => void;
}

export function ImageUploader({ selectedImage, onImageSelect, onClear }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);

  const requestPermission = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Camera permission is required to take a photo.');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission required', 'Gallery permission is required to select a photo.');
        return false;
      }
    }
    return true;
  };

  const pickFromCamera = async () => {
    const allowed = await requestPermission('camera');
    if (!allowed) return;

    setIsLoading(true);
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    setIsLoading(false);

    if (!result.canceled && result.assets[0]?.uri) {
      onImageSelect(result.assets[0].uri);
    }
  };

  const pickFromLibrary = async () => {
    const allowed = await requestPermission('library');
    if (!allowed) return;

    setIsLoading(true);
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
    });
    setIsLoading(false);

    if (!result.canceled && result.assets[0]?.uri) {
      onImageSelect(result.assets[0].uri);
    }
  };

  if (selectedImage) {
    return (
      <View style={styles.previewWrapper}>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <Pressable style={styles.clearButton} onPress={onClear}>
          <Text style={styles.clearText}>Remove</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Upload Plant Image</Text>
      <Text style={styles.subtitle}>Take a photo or choose from gallery</Text>
      <View style={styles.buttonRow}>
        <Pressable style={[styles.actionButton, styles.withSpacing]} onPress={pickFromCamera} disabled={isLoading}>
          <Text style={styles.actionText}>Camera</Text>
        </Pressable>
        <Pressable style={[styles.actionButton, styles.outline]} onPress={pickFromLibrary} disabled={isLoading}>
          <Text style={[styles.actionText, styles.outlineText]}>Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 2,
    borderColor: colors.border,
    borderStyle: 'dashed',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    backgroundColor: colors.card,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 16,
    textAlign: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
  },
  actionButton: {
    backgroundColor: colors.primary,
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 12,
  },
  withSpacing: {
    marginRight: 12,
  },
  actionText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  outline: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: colors.border,
  },
  outlineText: {
    color: colors.text,
  },
  previewWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
    backgroundColor: colors.card,
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
  clearButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: 'rgba(255,255,255,0.9)',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
  },
  clearText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
  },
});
