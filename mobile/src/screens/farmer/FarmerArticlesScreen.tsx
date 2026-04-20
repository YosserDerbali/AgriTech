import React, { useState, useEffect } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { formatDistanceToNow } from 'date-fns';
import { FarmerStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { Article } from '../../types/article';
import { useTheme } from '../../hooks/useTheme';
import { ArticleCard } from '../../components/agronomist/ArticleCard';

type FilterTab = 'all' | 'agronomist' | 'external';

export default function FarmerArticlesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<FarmerStackParamList>>();
  const { articles, isLoading, getAllArticles } = useArticleStore(); // Changed to getAllArticles
  const { colors, shadows } = useTheme();
  const [tab, setTab] = useState<FilterTab>('all');

  // Dynamic styles based on theme
  const dynamicStyles = StyleSheet.create({
    safeContainer: {
      flex: 1,
      backgroundColor: colors.background,
    },
    container: {
      flex: 1,
      backgroundColor: colors.background,
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
    content: {
      padding: 16,
      paddingBottom: 30,
    },
    tabs: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 12,
    },
    list: {
      marginTop: 6,
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
      <SafeAreaView style={dynamicStyles.safeContainer}>
        <View style={dynamicStyles.loadingContainer}>
          <Text style={dynamicStyles.loadingText}>Loading articles...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={dynamicStyles.safeContainer}>
      <ScrollView style={dynamicStyles.container} contentContainerStyle={dynamicStyles.content}>
        <Text style={dynamicStyles.title}>Articles</Text>
        <Text style={dynamicStyles.subtitle}>Learn from experts and trusted sources</Text>

        <View style={dynamicStyles.tabs}>
          {['all', 'agronomist', 'external'].map((value) => (
            <Pressable
              key={value}
              onPress={() => setTab(value as FilterTab)}
              style={[dynamicStyles.tab, tab === value && dynamicStyles.tabActive]}
            >
              <Text style={[dynamicStyles.tabText, tab === value && dynamicStyles.tabTextActive]}>
                {value === 'all' ? 'All' : value === 'agronomist' ? 'Experts' : 'External'}
              </Text>
            </Pressable>
          ))}
        </View>

        <View style={dynamicStyles.list}>
          {filtered.length === 0 ? (
            <View style={dynamicStyles.emptyState}>
              <Text style={dynamicStyles.emptyTitle}>No articles yet</Text>
              <Text style={dynamicStyles.emptyText}>
                {tab === 'agronomist'
                  ? 'Expert articles will appear here'
                  : tab === 'external'
                  ? 'External articles will be synced automatically'
                  : 'Check back later for new articles'}
              </Text>
            </View>
          ) : (
            filtered.map((article: Article) => (
              <ArticleCard
                key={article.id}
                article={article}
                onPress={() => navigation.navigate('ArticleDetail', { id: article.id })}
              />
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
