import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, TextInput, Alert, ActivityIndicator, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../stores/appStore';
import axiosInstance from '../../services/axiosInstance';
import * as ImagePicker from 'expo-image-picker';

export default function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { user, setUser } = useAppStore();

  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || '');
  const [farmName, setFarmName] = useState('Green Valley Farm');
  const [location, setLocation] = useState('Iowa, USA');
  const [phoneNumber, setPhoneNumber] = useState('+1 (555) 123-4567');
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  const handleChangePhoto = async () => {
    // Request permission
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }

    // Launch image picker
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  const handleRemovePhoto = () => {
    setProfileImage(null);
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Error', 'Name cannot be empty');
      return;
    }

    setIsSaving(true);
    try {
      console.log('Saving profile with name:', name.trim());
      
      // Update user profile via API
      const response = await axiosInstance.patch('/farmer/profile', {
        name: name.trim(),
      });
      
      console.log('Update response:', response.data);
      
      // Update local state
      if (user && response.data.user) {
        setUser({
          id: user.id,
          name: response.data.user.name,
          email: user.email,
          role: user.role,
        });
      }
      
      Alert.alert('Success', 'Profile updated successfully');
      navigation.goBack();
    } catch (error: any) {
      console.error('Update profile error:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      
      let errorMessage = 'Failed to update profile';
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Profile Photo Section */}
      <Card style={styles.photoCard}>
        <View style={styles.photoContainer}>
          <View style={styles.profilePhoto}>
            {profileImage ? (
              <Image source={{ uri: profileImage }} style={styles.profileImage} />
            ) : (
              <Text style={styles.avatarText}>
                {name.charAt(0).toUpperCase()}
              </Text>
            )}
          </View>
          <View style={styles.photoActions}>
            <TouchableOpacity style={styles.photoButton} onPress={handleChangePhoto}>
              <Feather name="camera" size={16} color={colors.primary} />
              <Text style={styles.photoButtonText}>Change Photo</Text>
            </TouchableOpacity>
            {profileImage && (
              <TouchableOpacity style={[styles.photoButton, styles.removeButton]} onPress={handleRemovePhoto}>
                <Feather name="trash-2" size={16} color="#999" />
                <Text style={[styles.photoButtonText, { color: '#999' }]}>Remove</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Card>

      {/* Full Name Section */}
      <Card style={styles.section}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your full name"
          value={name}
          onChangeText={setName}
          placeholderTextColor="#ccc"
        />
      </Card>

      {/* Email Section (Read-only) */}
      <Card style={styles.section}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={[styles.input, styles.readonlyInput]}
          value={email}
          editable={false}
          placeholderTextColor="#ccc"
        />
        <Text style={styles.helperText}>Email cannot be changed</Text>
      </Card>

      {/* Farm Name Section */}
      <Card style={styles.section}>
        <Text style={styles.label}>Farm Name</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your farm name"
          value={farmName}
          onChangeText={setFarmName}
          placeholderTextColor="#ccc"
        />
      </Card>

      {/* Location Section */}
      <Card style={styles.section}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your location (City, State)"
          value={location}
          onChangeText={setLocation}
          placeholderTextColor="#ccc"
        />
      </Card>

      {/* Phone Number Section */}
      <Card style={styles.section}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          placeholder="Enter your phone number"
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          placeholderTextColor="#ccc"
          keyboardType="phone-pad"
        />
      </Card>

      {/* Save Button */}
      <TouchableOpacity
        style={[styles.saveButton, isSaving && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isSaving}
      >
        {isSaving ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text style={styles.saveButtonText}>Save Changes</Text>
        )}
      </TouchableOpacity>

      {/* Cancel Button */}
      <TouchableOpacity
        style={styles.cancelButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.cancelButtonText}>Cancel</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  content: {
    padding: 16,
    paddingBottom: 40,
  },
  photoCard: {
    marginBottom: 20,
    paddingVertical: 20,
  },
  photoContainer: {
    alignItems: 'center',
  },
  profilePhoto: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    overflow: 'hidden',
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  avatarText: {
    fontSize: 40,
    fontWeight: '700',
    color: 'white',
  },
  photoActions: {
    flexDirection: 'row',
    gap: 12,
  },
  photoButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: `${colors.primary}10`,
    gap: 6,
  },
  removeButton: {
    backgroundColor: '#f5f5f5',
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.primary,
  },
  section: {
    marginBottom: 16,
    padding: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  helperText: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    fontSize: 14,
    color: colors.text,
    backgroundColor: '#fafafa',
  },
  readonlyInput: {
    backgroundColor: '#f5f5f5',
    color: '#999',
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 12,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
  },
  cancelButtonText: {
    color: colors.textSecondary || '#999',
    fontSize: 16,
    fontWeight: '500',
  },
});