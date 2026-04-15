import React from 'react';
import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Haptics from 'expo-haptics';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../../hooks/useTheme';
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
  const { colors } = useTheme();

  const dynamicStyles = StyleSheet.create({
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
    title: {
      ...typography.heading3,
      color: colors.text,
    },
    subtitle: {
      ...typography.small,
      color: colors.textSecondary,
      marginTop: spacing.xs,
    },
  });

  const handleBackPress = () => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    navigation.goBack();
  };

  return (
    <View style={[dynamicStyles.container, variant === 'gradient' && dynamicStyles.containerGradient]}>
      <View style={staticStyles.left}>
        {showBack && (
          <Pressable
            style={({ pressed }) => [dynamicStyles.backButton, pressed && dynamicStyles.backButtonPressed]}
            onPress={handleBackPress}
          >
            <Ionicons name="chevron-back" size={24} color={colors.primary} />
          </Pressable>
        )}
        <View style={staticStyles.titleContainer}>
          <Text style={dynamicStyles.title}>{title}</Text>
          {subtitle && <Text style={dynamicStyles.subtitle}>{subtitle}</Text>}
        </View>
      </View>
      {action && <View style={staticStyles.action}>{action}</View>}
    </View>
  );
}

const staticStyles = StyleSheet.create({
  left: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  titleContainer: {
    flex: 1,
  },
  action: {
    marginLeft: spacing.md,
  },
});
