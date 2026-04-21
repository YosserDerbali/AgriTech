import React, { useState } from 'react';
import { Alert, Image, Pressable, StyleSheet, Text, View } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../hooks/useTheme';

interface ImageUploaderProps {
  selectedImage: string | null;
  onImageSelect: (uri: string) => void;
  onClear: () => void;
}

export function ImageUploader({ selectedImage, onImageSelect, onClear }: ImageUploaderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { colors } = useTheme();

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

  const dynamicStyles = StyleSheet.create({
    container: {
      borderWidth: 2,
      borderColor: colors.border,
      borderStyle: 'dashed',
      borderRadius: 16,
      padding: 20,
      alignItems: 'center',
      backgroundColor: colors.surface,
    },
    title: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    subtitle: {
      fontSize: 14,
      color: colors.textSecondary,
      marginBottom: 16,
    },
    actionButton: {
      paddingHorizontal: 16,
      paddingVertical: 10,
      borderRadius: 8,
      backgroundColor: colors.primary,
      minWidth: 100,
      alignItems: 'center',
    },
    actionText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textInverse,
    },
    outline: {
      backgroundColor: colors.surface,
      borderWidth: 2,
      borderColor: colors.primary,
    },
    outlineText: {
      color: colors.primary,
    },
    clearButton: {
      marginTop: 12,
      paddingHorizontal: 24,
      paddingVertical: 8,
      borderRadius: 8,
      backgroundColor: colors.error,
    },
    clearText: {
      fontSize: 14,
      fontWeight: '600',
      color: colors.textInverse,
    },
  });

  if (selectedImage) {
    return (
      <View style={styles.previewWrapper}>
        <Image source={{ uri: selectedImage }} style={styles.previewImage} />
        <Pressable style={dynamicStyles.clearButton} onPress={onClear}>
          <Text style={dynamicStyles.clearText}>Remove</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View style={dynamicStyles.container}>
      <Text style={dynamicStyles.title}>Upload Plant Image</Text>
      <Text style={dynamicStyles.subtitle}>Take a photo or choose from gallery</Text>
      <View style={styles.buttonRow}>
        <Pressable style={[dynamicStyles.actionButton, styles.withSpacing]} onPress={pickFromCamera} disabled={isLoading}>
          <Text style={dynamicStyles.actionText}>Camera</Text>
        </Pressable>
        <Pressable style={[dynamicStyles.actionButton, dynamicStyles.outline]} onPress={pickFromLibrary} disabled={isLoading}>
          <Text style={[dynamicStyles.actionText, dynamicStyles.outlineText]}>Gallery</Text>
        </Pressable>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  buttonRow: {
    flexDirection: 'row',
  },
  withSpacing: {
    marginRight: 12,
  },
  previewWrapper: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  previewImage: {
    width: '100%',
    height: 220,
  },
});
