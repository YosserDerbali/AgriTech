import React, { useEffect } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useArticleStore } from '../../stores/articleStore';
import { useAppStore } from '../../stores/appStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { spacing, radius } from '../../theme/spacing';

export default function AgronomistProfileScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { diagnoses, fetchReviewQueue } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();
  const { user, logout, isAuthenticated } = useAppStore();

  useEffect(() => {
    if (isAuthenticated) {
      fetchReviewQueue().catch(() => null);
    }
  }, [fetchReviewQueue, isAuthenticated]);

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
      padding: spacing.lg,
      paddingBottom: spacing['3xl'],
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
      marginBottom: spacing.xl,
    },
    name: {
      fontSize: 22,
      fontWeight: '800',
      lineHeight: 28,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    email: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
      marginBottom: spacing.lg,
    },
    badgeContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    badge: {
      backgroundColor: colors.primary,
      color: colors.textInverse,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 16,
    },
    badgeMuted: {
      backgroundColor: colors.borderLight,
      color: colors.text,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: '600',
      lineHeight: 16,
      borderWidth: 1,
      borderColor: colors.border,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: colors.text,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
    },
    specialtiesContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: spacing.sm,
    },
    tag: {
      backgroundColor: colors.accentSoft,
      color: colors.accent,
      paddingVertical: spacing.sm,
      paddingHorizontal: spacing.md,
      borderRadius: radius.full,
      fontSize: 12,
      fontWeight: '700',
      lineHeight: 16,
      borderWidth: 1.5,
      borderColor: colors.accent,
    },
    statsRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      gap: spacing.md,
      marginVertical: spacing.lg,
    },
    statBox: {
      flex: 1,
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      padding: spacing.md,
      borderWidth: 1.5,
      borderColor: colors.border,
      alignItems: 'center',
      justifyContent: 'center',
      ...shadows.sm,
    },
    statValue: {
      fontSize: 24,
      fontWeight: '800',
      lineHeight: 30,
      color: colors.primary,
      marginBottom: spacing.xs,
    },
    statLabel: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.textSecondary,
      fontWeight: '600',
      textAlign: 'center',
    },
    aboutText: {
      fontSize: 14,
      lineHeight: 21,
      color: colors.textSecondary,
    },
    menuItem: {
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
      fontSize: 14,
      color: colors.text,
      borderBottomWidth: 1,
      borderBottomColor: colors.borderLight,
      flexDirection: 'row',
      alignItems: 'center',
      gap: spacing.lg,
    },
    menuItemText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '600',
      lineHeight: 21,
      color: colors.text,
    },
    menuItemIcon: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.primarySoft,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  const staticStyles = StyleSheet.create({
    profileCard: {
      marginBottom: spacing.lg,
    },
    card: {
      marginBottom: spacing.lg,
    },
    menuItemLast: {
      borderBottomWidth: 0,
    },
    signOutButton: {
      marginTop: spacing.lg,
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Profile</Text>

        <Card style={staticStyles.profileCard}>
          <Text style={dynamicStyles.name}>{user?.name || 'Dr. Sarah Green'}</Text>
          <Text style={dynamicStyles.email}>{user?.email || 'sarah.green@agri.com'}</Text>
          <View style={dynamicStyles.badgeContainer}>
            <Text style={dynamicStyles.badge}>Senior Agronomist</Text>
            <Text style={dynamicStyles.badgeMuted}>8 years exp.</Text>
          </View>
        </Card>

        <Card style={staticStyles.card}>
          <Text style={dynamicStyles.sectionTitle}>Specialties</Text>
          <View style={dynamicStyles.specialtiesContainer}>
            {['Plant Pathology', 'Tomato Crops', 'Fungal Diseases', 'Organic Farming'].map((specialty) => (
              <Text key={specialty} style={dynamicStyles.tag}>
                {specialty}
              </Text>
            ))}
          </View>
        </Card>

        <View style={dynamicStyles.statsRow}>
          <View style={dynamicStyles.statBox}>
            <Feather name="check-circle" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={dynamicStyles.statValue}>{approvedByMe}</Text>
            <Text style={dynamicStyles.statLabel}>Approved</Text>
          </View>
          <View style={dynamicStyles.statBox}>
            <Feather name="file-text" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
            <Text style={dynamicStyles.statValue}>{myArticles.length}</Text>
            <Text style={dynamicStyles.statLabel}>Articles</Text>
          </View>
          <View style={dynamicStyles.statBox}>
            <Feather name="star" size={24} color={colors.primary} style={{ marginBottom: spacing.xs }} />
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
              activeOpacity={0.6}
            >
              <View style={dynamicStyles.menuItemIcon}>
                <Feather name={item.icon as any} size={18} color={colors.primary} />
              </View>
              <Text style={dynamicStyles.menuItemText}>{item.label}</Text>
              <Feather name="chevron-right" size={20} color={colors.borderLight} />
            </TouchableOpacity>
          ))}
        </Card>

        <View style={staticStyles.signOutButton}>
          <Button title="Sign Out" variant="outline" onPress={handleLogout} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}


