import React from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Card } from '../../components/ui/Card';
import { colors } from '../../theme/colors';
import { Feather } from '@expo/vector-icons';

export default function HelpAndSupportScreen() {
  const handleEmail = () => {
    Linking.openURL('mailto:support@agritech.com');
  };

  const handlePhone = () => {
    Linking.openURL('tel:1-800-247-8324');
  };

  const handleWebsite = () => {
    Linking.openURL('https://www.agritech.com/help');
  };

  const handleFAQ = (question: string) => {
    Alert.alert('FAQ', `Answer for: ${question}\n\nThis feature will be available soon.`);
  };

  const contactItems = [
    { id: 'email', label: 'Email', value: 'support@agritech.com', icon: 'mail', onPress: handleEmail },
    { id: 'phone', label: 'Phone', value: '1-800-247-8324', icon: 'phone', onPress: handlePhone },
    { id: 'website', label: 'Website', value: 'www.agritech.com/help', icon: 'globe', onPress: handleWebsite },
  ];

  const faqItems = [
    'How do I take a plant photo for diagnosis?',
    'How long does diagnosis take?',
  ];

  return (
    <SafeAreaView style={styles.safeContainer} edges={['bottom']}>
      <ScrollView 
        style={styles.container} 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.sectionTitle}>Get in Touch</Text>
        <Card style={styles.card}>
          {contactItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.contactItem, index === contactItems.length - 1 && styles.contactItemLast]}
              onPress={item.onPress}
            >
              <View style={styles.contactLeft}>
                <Feather name={item.icon as any} size={20} color={colors.primary} />
                <View>
                  <Text style={styles.contactLabel}>{item.label}</Text>
                  <Text style={styles.contactValue}>{item.value}</Text>
                </View>
              </View>
              <Feather name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>
          ))}
        </Card>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        <Card style={styles.card}>
          {faqItems.map((question, index) => (
            <TouchableOpacity
              key={index}
              style={[styles.faqItem, index === faqItems.length - 1 && styles.faqItemLast]}
              onPress={() => handleFAQ(question)}
            >
              <Text style={styles.faqText}>{question}</Text>
              <Feather name="chevron-right" size={20} color={colors.border} />
            </TouchableOpacity>
          ))}
        </Card>
        <View style={styles.bottomPadding} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background || '#f9f9f9',
  },
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 40,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textSecondary || '#999',
    marginTop: 12,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  card: {
    marginBottom: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
  contactItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  contactItemLast: {
    borderBottomWidth: 0,
  },
  contactLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  contactLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  contactValue: {
    fontSize: 13,
    color: colors.textSecondary || '#999',
    marginTop: 2,
  },
  faqItem: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border || '#eee',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqItemLast: {
    borderBottomWidth: 0,
  },
  faqText: {
    flex: 1,
    fontSize: 15,
    fontWeight: '500',
    color: colors.text,
  },
  bottomPadding: {
    height: 20,
  },
});