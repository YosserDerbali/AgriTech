import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useArticleStore } from '../../stores/articleStore';
import { useAppStore } from '../../stores/appStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function AgronomistProfileScreen() {
  const { colors } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { diagnoses, fetchReviewQueue } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();
  const { user, logout } = useAppStore();

  useEffect(() => {
    fetchReviewQueue().catch(() => null);
  }, [fetchReviewQueue]);

  const approvedByMe = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const myArticles = getMyArticles();
  // code explanation 
  const menuItems = [
    { id: 'notifications', label: 'Notifications', icon: 'bell', onPress: () => navigation.navigate('Notifications') },
    { id: 'settings', label: 'Settings', icon: 'settings', onPress: () => navigation.navigate('Settings') },
    { id: 'help', label: 'Help & Support', icon: 'life-buoy', onPress: () => navigation.navigate('HelpAndSupport') },
  ];

  const handleLogout = () => {
    logout();
    Alert.alert('Signed out', 'Logged out successfully.');
    navigation.navigate('AgronomistTabs', { screen: 'AgronomistDashboard' } as never);
  };

  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
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
      marginBottom: 12,
    },
    name: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    email: {
      fontSize: 13,
      color: colors.muted,
      marginBottom: 10,
    },
    badge: {
      backgroundColor: '#E0F2FE',
      color: colors.text,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 6,
      fontSize: 11,
    },
    badgeMuted: {
      backgroundColor: '#E2E8F0',
      color: colors.muted,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 6,
      fontSize: 11,
    },
    sectionTitle: {
      fontSize: 14,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 8,
    },
    tag: {
      backgroundColor: colors.primarySoft,
      color: colors.primary,
      paddingVertical: 4,
      paddingHorizontal: 10,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 6,
      fontSize: 11,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: 12,
      padding: 12,
      marginHorizontal: 4,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: colors.border,
    },
    statValue: {
      fontSize: 18,
      fontWeight: '700',
      color: colors.accent,
    },
    statLabel: {
      fontSize: 11,
      color: colors.muted,
    },
    aboutText: {
      fontSize: 13,
      color: colors.muted,
    },
    menuItem: {
      paddingVertical: 14,
      paddingHorizontal: 12,
      fontSize: 14,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.border,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    menuItemText: {
      flex: 1,
      fontSize: 14,
      fontWeight: '500',
      color: colors.text,
    },
  });

  const staticStyles = StyleSheet.create({
    profileCard: {
      marginBottom: 12,
    },
    badgesRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    card: {
      marginBottom: 12,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 12,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
    <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
      <Text style={dynamicStyles.title}>Profile</Text>

      <Card style={staticStyles.profileCard}>
        <Text style={dynamicStyles.name}>{user?.name || 'Dr. Sarah Green'}</Text>
        <Text style={dynamicStyles.email}>{user?.email || 'sarah.green@agri.com'}</Text>
        <View style={staticStyles.badgesRow}>
          <Text style={dynamicStyles.badge}>Senior Agronomist</Text>
          <Text style={dynamicStyles.badgeMuted}>8 years exp.</Text>
        </View>
      </Card>

      <Card style={staticStyles.card}>
        <Text style={dynamicStyles.sectionTitle}>Specialties</Text>
        <View style={staticStyles.badgesRow}>
          {['Plant Pathology', 'Tomato Crops', 'Fungal Diseases', 'Organic Farming'].map((specialty) => (
            <Text key={specialty} style={dynamicStyles.tag}>
              {specialty}
            </Text>
          ))}
        </View>
      </Card>

      <View style={staticStyles.statsRow}>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statValue}>{approvedByMe}</Text>
          <Text style={dynamicStyles.statLabel}>Approved</Text>
        </View>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statValue}>{myArticles.length}</Text>
          <Text style={dynamicStyles.statLabel}>Articles</Text>
        </View>
        <View style={dynamicStyles.statBox}>
          <Text style={dynamicStyles.statValue}>4.8</Text>
          <Text style={dynamicStyles.statLabel}>Rating</Text>
        </View>
      </View>

      <Card style={staticStyles.card}>
        <Text style={dynamicStyles.sectionTitle}>About</Text>
        <Text style={dynamicStyles.aboutText}>
          Experienced plant pathologist specializing in tomato and vegetable crop diseases.
          Passionate about sustainable farming practices and helping farmers implement
          effective disease management strategies.
        </Text>
      </Card>

      <Card style={staticStyles.card}>
        {menuItems.map((item, index) => (
          <TouchableOpacity
            key={item.id}
            style={[dynamicStyles.menuItem, index === menuItems.length - 1 && staticStyles.menuItemLast]}
            onPress={item.onPress}
          >
            <Feather name={item.icon as any} size={20} color={colors.primary} />
            <Text style={dynamicStyles.menuItemText}>{item.label}</Text>
            <Feather name="chevron-right" size={20} color={colors.border} />
          </TouchableOpacity>
        ))}
      </Card>

      <Button title="Sign Out" variant="outline" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}


