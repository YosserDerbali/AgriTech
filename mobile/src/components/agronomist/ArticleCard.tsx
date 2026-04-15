import React from 'react';
import { Image, Pressable, StyleSheet, Text, View } from 'react-native';
import { formatDistanceToNow } from 'date-fns';
import { Article } from '../../types/article';
import { useTheme } from '../../hooks/useTheme';

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
      fontSize: 15,
      fontWeight: '600',
      color: colors.text,
      marginBottom: 6,
    },
    excerpt: {
      fontSize: 13,
      color: colors.textSecondary,
      marginBottom: 8,
    },
    metaText: {
      fontSize: 12,
      color: colors.textSecondary,
    },
  });

  return (
    <Pressable onPress={onPress} style={styles.card}>
      {article.coverImageUrl ? (
        <Image source={{ uri: article.coverImageUrl }} style={staticStyles.image} />
      ) : null}
      <View style={staticStyles.content}>
        <Text style={styles.title} numberOfLines={2}>{article.title}</Text>
        <Text style={styles.excerpt} numberOfLines={2}>{article.excerpt}</Text>
        <View style={staticStyles.metaRow}>
          <Text style={styles.metaText}>
            {formatDistanceToNow(article.createdAt, { addSuffix: true })}
          </Text>
          {article.tags[0] ? <Text style={styles.metaText}>#{article.tags[0]}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const staticStyles = StyleSheet.create({

  image: {
    width: '100%',
    height: 160,
  },
  content: {
    padding: 12,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});
