import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
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
  const articles = useArticleStore((state) => state.articles);
  const [tab, setTab] = useState<FilterTab>('all');

  const agronomistArticles = articles.filter((a) => a.source === 'AGRONOMIST');
  const externalArticles = articles.filter((a) => a.source === 'EXTERNAL');

  const filtered = tab === 'all'
    ? articles
    : tab === 'agronomist'
    ? agronomistArticles
    : externalArticles;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Articles</Text>
      <Text style={styles.subtitle}>Learn from experts and trusted sources</Text>

      <View style={styles.tabs}>
        {['all', 'agronomist', 'external'].map((value) => (
          <Text
            key={value}
            onPress={() => setTab(value as FilterTab)}
            style={[styles.tab, tab === value && styles.tabActive]}
          >
            {value === 'all' ? 'All' : value === 'agronomist' ? 'Experts' : 'External'}
          </Text>
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
          filtered.map((article) => (
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
  );
}

function ArticleListItem({ article, onPress }: { article: Article; onPress: () => void }) {
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Text style={styles.cardTitle}>{article.title}</Text>
      <Text style={styles.cardExcerpt}>{article.excerpt}</Text>
      <Text style={styles.cardMeta}>{article.source === 'EXTERNAL' ? 'External' : 'Expert'} · {formatDistanceToNow(article.createdAt, { addSuffix: true })}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
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
    color: colors.muted,
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
    color: colors.text,
    fontSize: 12,
    marginRight: 8,
    marginBottom: 8,
  },
  tabActive: {
    backgroundColor: colors.primary,
    color: '#FFFFFF',
    borderColor: colors.primary,
  },
  list: {
    marginTop: 6,
  },
  emptyState: {
    padding: 24,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.card,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 6,
  },
  emptyText: {
    fontSize: 13,
    color: colors.muted,
  },
  card: {
    backgroundColor: colors.card,
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
    color: colors.muted,
    marginBottom: 8,
  },
  cardMeta: {
    fontSize: 12,
    color: colors.muted,
  },
});
