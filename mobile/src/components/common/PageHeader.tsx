import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { colors, shadows } from '../../theme/colors';
import { typography } from '../../theme/typography';
import { spacing, radius } from '../../theme/spacing';
import { Button } from '../ui/Button';

type PageHeaderProps = {
  title: string;
  subtitle?: string;
  showBack?: boolean;
  action?: React.ReactNode;
  variant?: 'default' | 'gradient';
};

export function PageHeader({ title, subtitle, showBack, action, variant = 'default' }: PageHeaderProps) {
  const navigation = useNavigation();

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View style={[styles.container, variant === 'gradient' && styles.containerGradient]}>
      <View style={styles.left}>
        {showBack && (
          <Pressable
            style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
            onPress={handleBackPress}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </Pressable>
        )}
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{title}</Text>
          {subtitle && <Text style={styles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {action && <View style={styles.action}>{action}</View>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.lg,
    backgroundColor: colors.background,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerGradient: {
    backgroundColor: colors.primary,
  },
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: radius.lg,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: spacing.md,
    backgroundColor: colors.primaryExtraLight,
  },
  backButtonPressed: {
    backgroundColor: colors.primarySoft,
    transform: [{ scale: 0.95 }],
  },
  titleContainer: {
    flex: 1,
  },
  title: {
    ...typography.heading3,
    color: colors.text,
  },
  subtitle: {
    ...typography.small,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  action: {
    marginLeft: spacing.md,
  },
});
