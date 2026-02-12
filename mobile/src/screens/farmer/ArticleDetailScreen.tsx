import React from 'react';
import { Linking, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useRoute } from '@react-navigation/native';
import { formatDistanceToNow } from 'date-fns';
import { FarmerStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { Badge } from '../../components/ui/Badge';
import { colors } from '../../theme/colors';

export default function ArticleDetailScreen() {
  const route = useRoute<RouteProp<FarmerStackParamList, 'ArticleDetail'>>();
  const article = useArticleStore((state) => state.getArticle(route.params.id));

  if (!article) {
    return (
      <View style={styles.centered}>
        <Text style={styles.title}>Article not found</Text>
      </View>
    );
  }

  const renderContent = (content: string) => {
    return content.split('\n\n').map((paragraph, index) => {
      if (paragraph.startsWith('## ')) {
        return (
          <Text key={index} style={styles.h2}>
            {paragraph.replace('## ', '')}
          </Text>
        );
      }
      if (paragraph.startsWith('# ')) {
        return (
          <Text key={index} style={styles.h1}>
            {paragraph.replace('# ', '')}
          </Text>
        );
      }
      if (paragraph.includes('\n- ')) {
        const items = paragraph.split('\n- ').filter(Boolean);
        return (
          <View key={index} style={styles.list}>
            {items.map((item, i) => (
              <Text key={i} style={styles.listItem}>• {item.replace(/^- /, '')}</Text>
            ))}
          </View>
        );
      }
      if (/^\d+\.\s/.test(paragraph)) {
        const items = paragraph.split('\n').filter(Boolean);
        return (
          <View key={index} style={styles.list}>
            {items.map((item, i) => (
              <Text key={i} style={styles.listItem}>{item}</Text>
            ))}
          </View>
        );
      }
      return (
        <Text key={index} style={styles.paragraph}>
          {paragraph}
        </Text>
      );
    });
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{article.title}</Text>
      <View style={styles.metaRow}>
        <Text style={styles.meta}>{article.authorName}</Text>
        <Text style={styles.meta}>{formatDistanceToNow(article.createdAt, { addSuffix: true })}</Text>
      </View>
      <Badge
        label={article.source === 'EXTERNAL' ? 'External Source' : 'Expert Article'}
        variant={article.source === 'EXTERNAL' ? 'outline' : 'secondary'}
        style={styles.badge}
      />

      {article.tags.length > 0 ? (
        <View style={styles.tagsRow}>
          {article.tags.map((tag) => (
            <Badge key={tag} label={tag} variant="outline" style={styles.tag} />
          ))}
        </View>
      ) : null}

      {article.source === 'EXTERNAL' && article.externalUrl ? (
        <Text style={styles.link} onPress={() => Linking.openURL(article.externalUrl!)}>
          Read on original source
        </Text>
      ) : null}

      <View style={styles.contentBlock}>{renderContent(article.content)}</View>
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
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  meta: {
    fontSize: 12,
    color: colors.muted,
  },
  badge: {
    marginBottom: 10,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 10,
  },
  tag: {
    marginRight: 8,
    marginBottom: 6,
  },
  link: {
    color: colors.primary,
    marginBottom: 12,
    fontWeight: '600',
  },
  contentBlock: {
    marginTop: 6,
  },
  h1: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 10,
  },
  h2: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
    marginVertical: 8,
  },
  paragraph: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 10,
    lineHeight: 20,
  },
  list: {
    marginBottom: 10,
  },
  listItem: {
    fontSize: 14,
    color: colors.muted,
    marginBottom: 4,
  },
});
