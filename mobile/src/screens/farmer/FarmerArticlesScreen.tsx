import React, { useState, useEffect } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { FarmerStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { Article } from '../../types/article';
import { colors, shadows } from '../../theme/colors';

type FilterTab = 'all' | 'agronomist' | 'external';

export default function FarmerArticlesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { articles, isLoading, getAllArticles } = useArticleStore(); // Changed to getAllArticles
  const [tab, setTab] = useState<FilterTab>('all');

  // Filter articles based on source
  const agronomistArticles = articles?.filter((a: Article) => a.source === 'AGRONOMIST') || [];
  const externalArticles = articles?.filter((a: Article) => a.source === 'EXTERNAL') || [];

  const filtered = tab === 'all'
    ? articles || []
    : tab === 'agronomist'
    ? agronomistArticles
    : externalArticles;
  
  useEffect(() => {
    getAllArticles(); // Changed to getAllArticles
  }, []);

  if (isLoading) {
    return (
      <SafeAreaView style={styles.safeContainer}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeContainer}>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Text style={styles.title}>Articles</Text>
        <Text style={styles.subtitle}>Learn from experts and trusted sources</Text>

        <View style={styles.tabs}>
          {['all', 'agronomist', 'external'].map((value) => (
            <Pressable
              key={value}
              onPress={() => setTab(value as FilterTab)}
              style={[styles.tab, tab === value && styles.tabActive]}
            >
              <Text style={[styles.tabText, tab === value && styles.tabTextActive]}>
                {value === 'all' ? 'All' : value === 'agronomist' ? 'Experts' : 'External'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={styles.list}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>No articles yet</Text>
              <Text style={styles.emptyText}>
                {tab === 'agronomist'
                  ? 'Expert articles will appear here'
                  : tab === 'external'
                  ? 'External articles will be synced automatically'
                  : 'Check back later for new articles'}
              </Text>
            </View>
          ) : (
            filtered.map((article: Article) => (
              <ArticleListItem
                key={article.id}
                article={article}
                onPress={() => {
                  if (article.source === 'EXTERNAL' && article.externalUrl) {
                    Linking.openURL(article.externalUrl);
                  } else {
                    navigation.navigate('ArticleDetail', { id: article.id });
                  }
                }}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ArticleListItem({ article, onPress }: { article: Article; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{article.title}</Text>
      <Text style={styles.cardExcerpt}>{article.excerpt}</Text>
      <Text style={styles.cardMeta}>
        {article.authorName} · {article.source === 'EXTERNAL' ? 'External' : 'Expert'} · 
        {formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 16,
    paddingBottom: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 14,
  },
  tabs: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 12,
  },
  tab: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  tabActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  tabText: {
    fontSize: 12,
    color: colors.text,
  },
  tabTextActive: {
    color: colors.textInverse,
  },
  list: {
    marginTop: 6,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
    ...shadows.soft,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  cardExcerpt: {
    fontSize: 13,
    color: colors.textSecondary,
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.textMuted,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
});