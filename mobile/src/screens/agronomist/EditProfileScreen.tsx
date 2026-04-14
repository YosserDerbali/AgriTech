import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors, roleColors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';
import { useAppStore } from '../../stores/appStore';

export default function EditProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { user } = useAppStore();

  const [name, setName] = useState(user?.name || 'Dr. Sarah Green');
  const [email, setEmail] = useState(user?.email || 'sarah.green@agri.com');
  const [specialties, setSpecialties] = useState('Plant Pathology, Tomato Crops, Fungal Diseases, Organic Farming');
  const [bio, setBio] = useState(
    'Experienced plant pathologist specializing in tomato and vegetable crop diseases. Passionate about sustainable farming practices.'
  );
  const [experience, setExperience] = useState('8');
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = async () => {
    setIsSaving(true);
    // Simulate API call
    setTimeout(() => {
      setIsSaving(false);
      navigation.goBack();
    }, 1000);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Edit Profile</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Profile Photo Section */}
        <Card style={styles.photoCard}>
          <View style={styles.photoContainer}>
            <View style={styles.profilePhoto}>
              <Feather name="user" size={48} color={roleColors.agronomist.primary} />
            </View>
            <View style={styles.photoActions}>
              <TouchableOpacity style={styles.photoButton}>
                <Feather name="camera" size={16} color={roleColors.agronomist.primary} />
                <Text style={styles.photoButtonText}>Change Photo</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.photoButton, styles.removeButton]}>
                <Feather name="trash-2" size={16} color="#999" />
                <Text style={[styles.photoButtonText, { color: '#999' }]}>Remove</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Card>

        {/* Name Section */}
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

        {/* Email Section */}
        <Card style={styles.section}>
          <Text style={styles.label}>Email Address</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter your email"
            value={email}
            onChangeText={setEmail}
            editable={false}
            placeholderTextColor="#ccc"
          />
          <Text style={styles.helperText}>Email cannot be changed</Text>
        </Card>

        {/* Experience Section */}
        <Card style={styles.section}>
          <Text style={styles.label}>Years of Experience</Text>
          <TextInput
            style={styles.input}
            placeholder="Enter years of experience"
            value={experience}
            onChangeText={setExperience}
            keyboardType="numeric"
            placeholderTextColor="#ccc"
          />
        </Card>

        {/* Specialties Section */}
        <Card style={styles.section}>
          <Text style={styles.label}>Specialties</Text>
          <Text style={styles.helperText}>Comma-separated list</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="e.g., Plant Pathology, Tomato Crops, etc."
            value={specialties}
            onChangeText={setSpecialties}
            multiline
            numberOfLines={2}
            placeholderTextColor="#ccc"
          />
        </Card>

        {/* Bio Section */}
        <Card style={styles.section}>
          <Text style={styles.label}>Professional Bio</Text>
          <Text style={styles.helperText}>Tell farmers about your expertise</Text>
          <TextInput
            style={[styles.input, styles.multilineInput]}
            placeholder="Write a brief bio..."
            value={bio}
            onChangeText={setBio}
            multiline
            numberOfLines={4}
            placeholderTextColor="#ccc"
          />
        </Card>

        {/* Action Buttons */}
        <View style={styles.actions}>
          <Button
            title={isSaving ? 'Saving...' : 'Save Changes'}
            onPress={handleSave}
            disabled={isSaving}
          />
          <Button
            title="Cancel"
            variant="outline"
            onPress={() => navigation.goBack()}
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: colors.text,
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
    backgroundColor: roleColors.agronomist.primarySoft,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 2,
    borderColor: roleColors.agronomist.primary,
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
    backgroundColor: `${roleColors.agronomist.primary}10`,
    gap: 6,
  },
  removeButton: {
    backgroundColor: '#f5f5f5',
  },
  photoButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: roleColors.agronomist.primary,
  },
  section: {
    marginBottom: 16,
    paddingVertical: 12,
    paddingHorizontal: 12,
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
    marginBottom: 8,
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
  multilineInput: {
    textAlignVertical: 'top',
    paddingTop: 12,
  },
  actions: {
    gap: 12,
    marginTop: 8,
  },
});
