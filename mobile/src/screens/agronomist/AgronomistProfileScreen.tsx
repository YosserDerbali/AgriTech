import React from 'react';
import { Alert, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useDiagnosisStore } from '../../stores/diagnosisStore';
import { useArticleStore } from '../../stores/articleStore';
import { useAppStore } from '../../stores/appStore';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';

const menuItems = ['Notifications', 'Specialties', 'Settings', 'Help & Support'];

export default function AgronomistProfileScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { diagnoses } = useDiagnosisStore();
  const { getMyArticles } = useArticleStore();
  const { user, logout } = useAppStore();

  const approvedByMe = diagnoses.filter((d) => d.status === 'APPROVED').length;
  const myArticles = getMyArticles();

  const handleLogout = () => {
    logout();
    Alert.alert('Signed out', 'Logged out successfully.');
    navigation.navigate('AgronomistTabs', { screen: 'AgronomistDashboard' } as never);
  };

  return (
    <SafeAreaView style={styles.safeContainer}>
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Profile</Text>

      <Card style={styles.profileCard}>
        <Text style={styles.name}>{user?.name || 'Dr. Sarah Green'}</Text>
        <Text style={styles.email}>{user?.email || 'sarah.green@agri.com'}</Text>
        <View style={styles.badgesRow}>
          <Text style={styles.badge}>Senior Agronomist</Text>
          <Text style={styles.badgeMuted}>8 years exp.</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Specialties</Text>
        <View style={styles.badgesRow}>
          {['Plant Pathology', 'Tomato Crops', 'Fungal Diseases', 'Organic Farming'].map((specialty) => (
            <Text key={specialty} style={styles.tag}>
              {specialty}
            </Text>
          ))}
        </View>
      </Card>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{approvedByMe}</Text>
          <Text style={styles.statLabel}>Approved</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>{myArticles.length}</Text>
          <Text style={styles.statLabel}>Articles</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statValue}>4.8</Text>
          <Text style={styles.statLabel}>Rating</Text>
        </View>
      </View>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.aboutText}>
          Experienced plant pathologist specializing in tomato and vegetable crop diseases.
          Passionate about sustainable farming practices and helping farmers implement
          effective disease management strategies.
        </Text>
      </Card>

      <Card style={styles.card}>
        {menuItems.map((item, index) => (
          <Text
            key={item}
            style={[styles.menuItem, index === menuItems.length - 1 && styles.menuItemLast]}
            onPress={() => Alert.alert(item, 'Ready for backend integration.')}
          >
            {item}
          </Text>
        ))}
      </Card>

      <Button title="Sign Out" variant="outline" onPress={handleLogout} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
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
  profileCard: {
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
  badgesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
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
  card: {
    marginBottom: 12,
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
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    backgroundColor: colors.card,
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
    paddingVertical: 12,
    fontSize: 14,
    color: colors.text,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  menuItemLast: {
    borderBottomWidth: 0,
  },
});
