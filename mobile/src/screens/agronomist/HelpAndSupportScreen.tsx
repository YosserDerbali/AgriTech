import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';

export default function HelpAndSupportScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I review a diagnosis?',
      answer:
        'Navigate to the Pending Queue tab, select a diagnosis, review the farmer\'s plant images and symptoms, and provide your professional assessment.',
    },
    {
      id: '2',
      question: 'Can I edit my published articles?',
      answer:
        'Yes, go to the Articles tab, tap the article you want to edit, and use the edit button. Your changes will be reflected immediately.',
    },
    {
      id: '3',
      question: 'How do I increase my rating?',
      answer:
        'Provide helpful, accurate diagnoses and engage with farmer feedback. Your rating improves as farmers rate your reviews positively.',
    },
    {
      id: '4',
      question: 'What file formats can I upload?',
      answer: 'You can upload JPG, PNG, and PDF files for articles and images. Maximum file size is 10MB.',
    },
    {
      id: '5',
      question: 'How do I contact support?',
      answer:
        'You can reach us via email at support@agritech.com or call our help line at 1-800-AGR-TECH.',
    },
  ];

  const contactMethods = [
    {
      id: '1',
      type: 'Email',
      value: 'support@agritech.com',
      icon: 'mail',
      action: () => Linking.openURL('mailto:support@agritech.com'),
    },
    {
      id: '2',
      type: 'Phone',
      value: '1-800-247-8324',
      icon: 'phone',
      action: () => Linking.openURL('tel:1-800-247-8324'),
    },
    {
      id: '3',
      type: 'Website',
      value: 'www.agritech.com/help',
      icon: 'globe',
      action: () => Linking.openURL('https://www.agritech.com/help'),
    },
  ];

  const styles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: 16,
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
    section: {
      marginBottom: 24,
    },
    sectionTitle: {
      fontSize: 18,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 12,
    },
    contactCard: {
      marginBottom: 12,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 8,
    },
    contactIcon: {
      width: 48,
      height: 48,
      borderRadius: 24,
      backgroundColor: `${colors.primary}10`,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 12,
    },
    contactContent: {
      flex: 1,
    },
    contactType: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 4,
    },
    contactValue: {
      fontSize: 14,
      color: colors.primary,
    },
    faqCard: {
      marginBottom: 12,
    },
    faqHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 16,
      paddingHorizontal: 12,
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: 12,
    },
    faqContent: {
      paddingHorizontal: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: 12,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    resourceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: 14,
      paddingHorizontal: 12,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginHorizontal: 12,
    },
    resourceText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
      marginLeft: 12,
    },
    footerSection: {
      alignItems: 'center',
      paddingVertical: 32,
    },
    footerText: {
      fontSize: 12,
      color: colors.textMuted,
      marginBottom: 4,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        contentInsetAdjustmentBehavior="never"
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={styles.title}>Help & Support</Text>
          <View style={{ width: 24 }} />
        </View>

        {/* Contact Methods */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Get in Touch</Text>
          {contactMethods.map((method) => (
            <Card key={method.id} style={styles.contactCard}>
              <TouchableOpacity
                style={styles.contactItem}
                onPress={method.action}
              >
                <View style={styles.contactIcon}>
                  <Feather name={method.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={styles.contactContent}>
                  <Text style={styles.contactType}>{method.type}</Text>
                  <Text style={styles.contactValue}>{method.value}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.textMuted} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* FAQ */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <Card key={faq.id} style={styles.faqCard}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() =>
                  setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)
                }
              >
                <Text style={styles.faqQuestion}>{faq.question}</Text>
                <Feather
                  name={expandedFaqId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
              {expandedFaqId === faq.id && (
                <View style={styles.faqContent}>
                  <Text style={styles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resources</Text>
          <Card>
            <TouchableOpacity
              style={styles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/docs')}
            >
              <Feather name="book" size={20} color={colors.primary} />
              <Text style={styles.resourceText}>Documentation & Guides</Text>
              <Feather name="arrow-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/blog')}
            >
              <Feather name="file-text" size={20} color={colors.primary} />
              <Text style={styles.resourceText}>Blog & Articles</Text>
              <Feather name="arrow-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              style={styles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/community')}
            >
              <Feather name="users" size={20} color={colors.primary} />
              <Text style={styles.resourceText}>Community Forum</Text>
              <Feather name="arrow-right" size={16} color={colors.textMuted} />
            </TouchableOpacity>
          </Card>
        </View>

        <View style={styles.footerSection}>
          <Text style={styles.footerText}>App Version 1.0.0</Text>
          <Text style={styles.footerText}>© 2026 AgriTech. All rights reserved.</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
