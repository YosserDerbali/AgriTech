import React, { useEffect, useRef } from 'react';
import { ScrollView, StyleSheet, Text, View, Animated } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AgronomistStackParamList } from '../../navigation/types';
import { useArticleStore } from '../../stores/articleStore';
import { ArticleCard } from '../../components/agronomist/ArticleCard';
import { Button } from '../../components/ui/Button';
import { useTheme } from '../../hooks/useTheme';

export default function AgronomistArticlesScreen() {
  const { colors, shadows } = useTheme();
  const navigation = useNavigation<NativeStackNavigationProp<AgronomistStackParamList>>();
  const { getMyArticles, fetchMyArticles } = useArticleStore();
  const myArticles = getMyArticles();

  // Animation refs
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(20)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
    fetchMyArticles();
  }, []);

  // Mount animation
  useFocusEffect(
    React.useCallback(() => {
      // Reset animations
      fadeAnim.setValue(0);
      slideAnim.setValue(20);
      scaleAnim.setValue(0.95);

      // Start entrance animation
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 600,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ]).start();

      return () => {
        // Cleanup when screen loses focus
      };
    }, [fadeAnim, slideAnim, scaleAnim])
  );

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
      color: colors.muted,
      marginBottom: 12,
    },
  });

  return (
    <SafeAreaView style={styles.safeContainer}>
      <Animated.View
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [
              { translateY: slideAnim },
              { scale: scaleAnim },
            ],
          },
        ]}
      >
        <ScrollView
          style={styles.container}
          contentContainerStyle={styles.content}
          contentInsetAdjustmentBehavior="never"
        >
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
      </Animated.View>
    </SafeAreaView>
  );
}
