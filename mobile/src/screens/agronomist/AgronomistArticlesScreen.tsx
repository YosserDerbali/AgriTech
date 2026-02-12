import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { ArticleCard } from '../../components/agronomist/ArticleCard';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';

export default function AgronomistArticlesScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { getMyArticles } = useArticleStore();
  const myArticles = getMyArticles();

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>My Articles</Text>
        <Button title="New" onPress={() => navigation.navigate('ArticleEditor', {})} />
      </View>

      {myArticles.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyTitle}>No articles yet</Text>
          <Text style={styles.emptyText}>
            Share your expertise with farmers by writing educational articles.
          </Text>
          <Button title="Write Article" onPress={() => navigation.navigate('ArticleEditor', {})} />
        </View>
      ) : (
        myArticles.map((article) => (
          <ArticleCard
            key={article.id}
            article={article}
            onPress={() => navigation.navigate('ArticleEditor', { id: article.id })}
          />
        ))
      )}
    </ScrollView>
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
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
  },
  emptyState: {
    padding: 20,
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
    marginBottom: 12,
  },
});
