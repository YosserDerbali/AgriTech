import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types/article';
import { colors, shadows } from '../../theme/colors';

interface ArticleCardProps {
  article: Article;
  onPress?: () => void;
}

export function ArticleCard({ article, onPress }: ArticleCardProps) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      {article.coverImageUrl ? (
        <Image source={{ uri: article.coverImageUrl }} style={styles.image} />
      ) : null}
      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.metaText}>
            {formatDistanceToNow(article.createdAt, { addSuffix: true })}
          </Text>
          {article.tags[0] ? <Text style={styles.metaText}>#{article.tags[0]}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.card,
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadows.soft,
  },
  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  excerpt: {
    fontSize: 13,
    color: colors.muted,
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metaText: {
    fontSize: 12,
    color: colors.muted,
  },
});
