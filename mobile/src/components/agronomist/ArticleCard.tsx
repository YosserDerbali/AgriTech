import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types/article';
import { colors, shadows } from '../../theme/colors';
import { Badge } from '../ui/Badge';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <View style={styles.row}>
        {article.coverImageUrl ? (
          <Image source={{ uri: article.coverImageUrl }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Text style={styles.placeholderText}>No image</Text>
          </View>
        )}
        <View style={styles.content}>
          <View style={styles.topRow}>
            <Badge
              label={article.source === 'EXTERNAL' ? 'External' : 'Expert'}
              variant={article.source === 'EXTERNAL' ? 'outline' : 'secondary'}
              style={styles.badge}
            />
          </View>
          <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
          <Text style={styles.excerpt} numberOfLines={3}>{article.excerpt}</Text>
          <View style={styles.metaRow}>
            <Text style={[styles.metaText, styles.metaSource]} numberOfLines={2}>
              {article.authorName}
            </Text>
            <Text style={[styles.metaText, styles.metaDate]}>
              {formatDistanceToNow(article.createdAt, { addSuffix: true })}
            </Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadows.soft,
  },
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
    backgroundColor: colors.surfaceAlt,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 12,
    color: colors.textMuted,
    fontWeight: '600',
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
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'flex-start',
  },
  metaText: {
    fontSize: 12,
    color: colors.textMuted,
    lineHeight: 16,
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
