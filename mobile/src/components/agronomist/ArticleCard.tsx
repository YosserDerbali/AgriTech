import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types/article';
import { useTheme } from '../../hooks/useTheme';
import { Badge } from '../ui/Badge';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  const { colors, shadows } = useTheme();

  const styles = StyleSheet.create({
    card: {
      backgroundColor: colors.surface,
      borderRadius: 16,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: colors.border,
      marginBottom: 12,
      ...shadows.soft,
    },
    title: {
      fontSize: 16,
      fontWeight: '700',
      color: colors.text,
      marginBottom: 6,
    },
    excerpt: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
      lineHeight: 18,
    },
    metaText: {
      fontSize: 12,
      color: colors.textMuted,
      lineHeight: 16,
    },
    placeholderText: {
      fontSize: 12,
      color: colors.textMuted,
      fontWeight: '600',
    },
  });

  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={staticStyles.row}>
        {article.coverImageUrl ? (
          <Image source={{ uri: article.coverImageUrl }} style={staticStyles.image} />
        ) : (
          <View style={[staticStyles.image, staticStyles.imagePlaceholder]}>
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
          <Text style={styles.excerpt} numberOfLines={3}>{article.excerpt}</Text>
          <View style={staticStyles.metaRow}>
            <Text style={[styles.metaText, staticStyles.metaSource]} numberOfLines={2}>
              {article.authorName}
            </Text>
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
  row: {
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  image: {
    width: 112,
    minHeight: 140,
    borderTopLeftRadius: 16,
    borderBottomLeftRadius: 16,
  },
  imagePlaceholder: {
    backgroundColor: '#e5e7eb',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 12,
    justifyContent: 'space-between',
  },
  topRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  badge: {
    alignSelf: 'flex-start',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  metaSource: {
    flexShrink: 1,
    flexGrow: 1,
    paddingRight: 8,
    minWidth: 0,
  },
  metaDate: {
    flexShrink: 0,
  },
});
