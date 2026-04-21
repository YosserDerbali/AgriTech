import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Feather } from '@expo/vector-icons';
import { Article } from '../../types/article';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';
import { spacing, radius } from '../../theme/spacing';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const { colors, shadows } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: radius['2xl'],
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: spacing.lg,
      ...shadows.md,
    },
    cardContent: {
      flexDirection: 'row',
      alignItems: 'stretch',
    },
    title: {
      fontSize: 16,
      fontWeight: '800',
      lineHeight: 22,
      color: colors.text,
      marginBottom: spacing.sm,
    },
    excerpt: {
      fontSize: 13,
      lineHeight: 19,
      color: colors.textSecondary,
      marginBottom: spacing.md,
    },
    metaText: {
      fontSize: 12,
      lineHeight: 16,
      color: colors.textMuted,
    },
    placeholderText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
    imagePlaceholder: {
      backgroundColor: colors.borderLight,
      alignItems: 'center',
      justifyContent: 'center',
    },
    badgeVariant: {
      backgroundColor: colors.primarySoft,
      borderColor: colors.primary,
      borderWidth: 1,
      borderRadius: radius.full,
    },
  });

  return (
    <Pressable 
      onPress={onPress} 
      style={({ pressed }) => [
        styles.card,
        pressed && { opacity: 0.7 }
      ]}
    >
      <View style={styles.cardContent}>
        {article.coverImageUrl ? (
          <Image source={{ uri: article.coverImageUrl }} style={staticStyles.image} />
        ) : (
          <View style={[staticStyles.image, styles.imagePlaceholder]}>
            <Feather name="image" size={24} color={styles.placeholderText.color} />
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
        <View style={staticStyles.content}>
          <View style={staticStyles.topRow}>
            <Badge
              label={article.source === 'EXTERNAL' ? 'External' : 'Expert'}
              variant={article.source === 'EXTERNAL' ? 'outline' : 'secondary'}
              style={staticStyles.badge}
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
          <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
          <View style={staticStyles.metaRow}>
            <View style={staticStyles.authorInfo}>
              <Text style={[styles.metaText, staticStyles.metaSource]} numberOfLines={1}>
                by {article.authorName}
              </Text>
            </View>
            <Text style={[styles.metaText, staticStyles.metaDate]}>
              {formatDistanceToNow(article.createdAt, { addSuffix: true })}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({
  cardContent: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  image: {
    width: 120,
    minHeight: 140,
    borderTopLeftRadius: radius['2xl'],
    borderBottomLeftRadius: radius['2xl'],
  },
  content: {
    flex: 1,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: spacing.sm,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorInfo: {
    flex: 1,
  },
  metaSource: {
    paddingRight: spacing.md,
    fontWeight: '600',
  },
  metaDate: {
    flexShrink: 0,
    fontWeight: '500',
  },
});
