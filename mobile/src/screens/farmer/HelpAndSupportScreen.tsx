import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { FarmerStackParamList } from '../../navigation/types';
import { Card } from '../../components/ui/Card';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';
import { Feather } from '@expo/vector-icons';
import { spacing, radius } from '../../theme/spacing';

export default function HelpAndSupportScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const [expandedFaqId, setExpandedFaqId] = useState<string | null>(null);

  const faqs = [
    {
      id: '1',
      question: 'How do I take a plant photo for diagnosis?',
      answer:
        'Open the Camera tab, take a clear photo of the affected plant area in good lighting, and submit it for analysis. Our AI model will provide a diagnosis.',
    },
    {
      id: '2',
      question: 'How long does diagnosis take?',
      answer:
        'Initial AI diagnosis takes just seconds. If an agronomist review is needed, it typically takes 1-24 hours depending on the complexity.',
    },
    {
      id: '3',
      question: 'Can I trust the diagnosis?',
      answer:
        'Our AI is trained on thousands of plant disease images. For serious cases, an agronomist will review the diagnosis to provide expert confirmation.',
    },
    {
      id: '4',
      question: 'What file formats can I upload?',
      answer: 'You can upload JPG, PNG, and WebP images. Maximum file size is 5MB.',
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

  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
    },
    content: {
      padding: spacing.lg,
    },
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: spacing.xl,
    },
    title: {
      fontSize: 28,
      fontWeight: '800',
      letterSpacing: 0.5,
      color: colors.text,
    },
    section: {
      marginBottom: spacing['3xl'],
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: '700',
      letterSpacing: 0.3,
      color: colors.text,
      marginBottom: spacing.md,
      marginTop: spacing.lg,
    },
    contactCard: {
      marginBottom: spacing.lg,
    },
    contactItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    contactIcon: {
      width: 48,
      height: 48,
      borderRadius: radius.lg,
      backgroundColor: colors.primaryLight,
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: spacing.lg,
    },
    contactContent: {
      flex: 1,
    },
    contactType: {
      fontSize: 16,
      fontWeight: '600',
      color: colors.text,
      marginBottom: spacing.xs,
    },
    contactValue: {
      fontSize: 14,
      color: colors.primary,
    },
    faqCard: {
      marginBottom: spacing.lg,
    },
    faqHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    faqQuestion: {
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      flex: 1,
      marginRight: spacing.lg,
    },
    faqContent: {
      paddingHorizontal: spacing.md,
      paddingBottom: spacing.md,
      borderTopWidth: 1,
      borderTopColor: colors.border,
      paddingTop: spacing.md,
    },
    faqAnswer: {
      fontSize: 14,
      color: colors.textSecondary,
      lineHeight: 20,
    },
    resourceItem: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingVertical: spacing.md,
      paddingHorizontal: spacing.md,
    },
    divider: {
      height: 1,
      backgroundColor: colors.borderLight,
      marginHorizontal: spacing.md,
    },
    resourceText: {
      flex: 1,
      fontSize: 15,
      fontWeight: '500',
      color: colors.text,
      marginLeft: spacing.lg,
    },
  });

  const staticStyles = StyleSheet.create({
    headerButton: {
      width: 40,
      height: 40,
      borderRadius: radius.lg,
      backgroundColor: colors.surface,
      borderWidth: 1,
      borderColor: colors.border,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView
        style={dynamicStyles.container}
        contentContainerStyle={dynamicStyles.content}
      >
        <View style={dynamicStyles.header}>
          <TouchableOpacity style={staticStyles.headerButton} onPress={() => navigation.goBack()}>
            <Feather name="arrow-left" size={24} color={colors.text} />
          </TouchableOpacity>
          <Text style={dynamicStyles.title}>Help & Support</Text>
          <View style={{ width: 40 }} />
        </View>

        {/* Contact Methods */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Get in Touch</Text>
          {contactMethods.map((method) => (
            <Card key={method.id} style={dynamicStyles.contactCard}>
              <TouchableOpacity
                style={dynamicStyles.contactItem}
                onPress={method.action}
              >
                <View style={dynamicStyles.contactIcon}>
                  <Feather name={method.icon as any} size={24} color={colors.primary} />
                </View>
                <View style={dynamicStyles.contactContent}>
                  <Text style={dynamicStyles.contactType}>{method.type}</Text>
                  <Text style={dynamicStyles.contactValue}>{method.value}</Text>
                </View>
                <Feather name="chevron-right" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </Card>
          ))}
        </View>

        {/* FAQ */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Frequently Asked Questions</Text>
          {faqs.map((faq) => (
            <Card key={faq.id} style={dynamicStyles.faqCard}>
              <TouchableOpacity
                style={dynamicStyles.faqHeader}
                onPress={() =>
                  setExpandedFaqId(expandedFaqId === faq.id ? null : faq.id)
                }
              >
                <Text style={dynamicStyles.faqQuestion}>{faq.question}</Text>
                <Feather
                  name={expandedFaqId === faq.id ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={colors.primary}
                />
              </TouchableOpacity>
              {expandedFaqId === faq.id && (
                <View style={dynamicStyles.faqContent}>
                  <Text style={dynamicStyles.faqAnswer}>{faq.answer}</Text>
                </View>
              )}
            </Card>
          ))}
        </View>

        {/* Additional Resources */}
        <View style={dynamicStyles.section}>
          <Text style={dynamicStyles.sectionTitle}>Resources</Text>
          <Card>
            <TouchableOpacity
              style={dynamicStyles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/docs')}
            >
              <Feather name="book" size={20} color={colors.primary} />
              <Text style={dynamicStyles.resourceText}>Documentation & Guides</Text>
              <Feather name="arrow-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={dynamicStyles.divider} />
            <TouchableOpacity
              style={dynamicStyles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/blog')}
            >
              <Feather name="file-text" size={20} color={colors.primary} />
              <Text style={dynamicStyles.resourceText}>Blog & Articles</Text>
              <Feather name="arrow-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
            <View style={dynamicStyles.divider} />
            <TouchableOpacity
              style={dynamicStyles.resourceItem}
              onPress={() => Linking.openURL('https://www.agritech.com/community')}
            >
              <Feather name="users" size={20} color={colors.primary} />
              <Text style={dynamicStyles.resourceText}>Community Forum</Text>
              <Feather name="arrow-right" size={16} color={colors.textSecondary} />
            </TouchableOpacity>
          </Card>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}