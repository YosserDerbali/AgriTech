import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, StyleSheet, Text, View } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { Input } from '../../components/ui/Input';
import { Textarea } from '../../components/ui/Textarea';
import { Button } from '../../components/ui/Button';
import { colors } from '../../theme/colors';

export default function ArticleEditorScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const route = useRoute<RouteProp<AgronomistStackParamList, 'ArticleEditor'>>();
  const { addArticle, updateArticle, deleteArticle, getArticle } = useArticleStore();

  const isEditing = !!route.params?.id;
  const existingArticle = isEditing && route.params?.id ? getArticle(route.params.id) : null;

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [coverImageUrl, setCoverImageUrl] = useState('');
  const [tags, setTags] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (existingArticle) {
      setTitle(existingArticle.title);
      setContent(existingArticle.content);
      setExcerpt(existingArticle.excerpt);
      setCoverImageUrl(existingArticle.coverImageUrl || '');
      setTags(existingArticle.tags.join(', '));
    }
  }, [existingArticle]);

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim() || !excerpt.trim()) {
      Alert.alert('Missing fields', 'Please complete title, content, and excerpt.');
      return;
    }

    setIsSubmitting(true);

    const articleData = {
      title: title.trim(),
      content: content.trim(),
      excerpt: excerpt.trim(),
      coverImageUrl: coverImageUrl.trim() || undefined,
      tags: tags.split(',').map((t) => t.trim()).filter(Boolean),
    };

    if (isEditing && route.params?.id) {
      updateArticle(route.params.id, articleData);
      Alert.alert('Updated', 'Article updated successfully.');
    } else {
      addArticle(articleData);
      Alert.alert('Published', 'Article published successfully.');
    }

    setIsSubmitting(false);
    navigation.goBack();
  };

  const handleDelete = () => {
    if (!route.params?.id) return;
    Alert.alert('Delete Article', 'Are you sure you want to delete this article?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteArticle(route.params!.id!);
          Alert.alert('Deleted', 'Article deleted.');
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>{isEditing ? 'Edit Article' : 'New Article'}</Text>

      {isEditing ? (
        <Button title="Delete" variant="destructive" onPress={handleDelete} style={styles.deleteButton} />
      ) : null}

      <Text style={styles.label}>Cover Image URL (Optional)</Text>
      <Input placeholder="https://example.com/image.jpg" value={coverImageUrl} onChangeText={setCoverImageUrl} style={styles.input} />

      <Text style={styles.label}>Title *</Text>
      <Input placeholder="Enter article title..." value={title} onChangeText={setTitle} style={styles.input} />

      <Text style={styles.label}>Excerpt *</Text>
      <Textarea placeholder="Write a short summary..." value={excerpt} onChangeText={setExcerpt} style={styles.textarea} />

      <Text style={styles.label}>Content *</Text>
      <Textarea placeholder="Write your article content here..." value={content} onChangeText={setContent} style={styles.textareaLarge} />

      <Text style={styles.label}>Tags</Text>
      <Input placeholder="e.g., tomato, disease prevention, organic" value={tags} onChangeText={setTags} style={styles.input} />

      <View style={styles.actionRow}>
        <Button title="Cancel" variant="outline" onPress={() => navigation.goBack()} style={styles.actionButton} />
        <Button title={isEditing ? 'Update' : 'Publish'} onPress={handleSubmit} disabled={isSubmitting} style={styles.actionButtonLast} />
      </View>
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
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    color: colors.muted,
    marginTop: 10,
    marginBottom: 6,
  },
  input: {
    marginBottom: 8,
  },
  textarea: {
    minHeight: 80,
    marginBottom: 8,
  },
  textareaLarge: {
    minHeight: 200,
    marginBottom: 8,
  },
  deleteButton: {
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  actionRow: {
    flexDirection: 'row',
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    marginRight: 10,
  },
  actionButtonLast: {
    flex: 1,
  },
});
