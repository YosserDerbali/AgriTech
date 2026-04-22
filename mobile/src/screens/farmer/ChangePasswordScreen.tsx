import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import axiosInstance from '../../services/axiosInstance';

export default function ChangePasswordScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword || !confirmPassword) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (newPassword !== confirmPassword) {
      Alert.alert('Error', 'New passwords do not match');
      return;
    }

    if (newPassword.length < 6) {
      Alert.alert('Error', 'New password must be at least 6 characters');
      return;
    }

    if (currentPassword === newPassword) {
      Alert.alert('Error', 'New password must be different from current password');
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.post('/farmer/change-password', {
        currentPassword,
        newPassword,
      });
      
      Alert.alert('Success', 'Password changed successfully', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
      
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('Change password error:', error);
      const errorMessage = error.response?.data?.message || 'Failed to change password';
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card style={styles.card}>
        {/* Current Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Current Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter current password"
              secureTextEntry={!showCurrentPassword}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowCurrentPassword(!showCurrentPassword)}
              style={styles.eyeIcon}
            >
              <Feather name={showCurrentPassword ? "eye-off" : "eye"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>New Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Enter new password (min 6 characters)"
              secureTextEntry={!showNewPassword}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowNewPassword(!showNewPassword)}
              style={styles.eyeIcon}
            >
              <Feather name={showNewPassword ? "eye-off" : "eye"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Confirm New Password */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Confirm New Password</Text>
          <View style={styles.passwordWrapper}>
            <TextInput
              style={styles.input}
              placeholder="Confirm new password"
              secureTextEntry={!showConfirmPassword}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholderTextColor="#999"
            />
            <TouchableOpacity
              onPress={() => setShowConfirmPassword(!showConfirmPassword)}
              style={styles.eyeIcon}
            >
              <Feather name={showConfirmPassword ? "eye-off" : "eye"} size={20} color="#999" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Save Button */}
        <TouchableOpacity
          style={[styles.saveButton, isLoading && styles.saveButtonDisabled]}
          onPress={handleChangePassword}
          disabled={isLoading}
        >
          {isLoading ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.saveButtonText}>Change Password</Text>
          )}
        </TouchableOpacity>
      </Card>
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
    paddingBottom: 30,
  },
  card: {
    padding: 16,
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  passwordWrapper: {
    position: 'relative',
  },
  input: {
    borderWidth: 1,
    borderColor: '#e0e0e0',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 12,
    paddingRight: 45,
    fontSize: 14,
    color: '#333',
    backgroundColor: '#fafafa',
  },
  eyeIcon: {
    position: 'absolute',
    right: 12,
    top: 12,
  },
  saveButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 8,
  },
  saveButtonDisabled: {
    opacity: 0.6,
  },
  saveButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});