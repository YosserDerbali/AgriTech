import { create } from 'zustand';
import { Article, ArticleFormData } from '@/types/article';

// Mock data for demonstration
const mockArticles: Article[] = [
  {
    id: '1',
    authorId: 'agro-1',
    authorName: 'Dr. Sarah Green',
    title: 'Understanding Early Blight in Tomatoes',
    content: `Early blight is one of the most common diseases affecting tomato plants worldwide. Caused by the fungus Alternaria solani, it can significantly reduce crop yield if not managed properly.

## Symptoms

- Dark, concentric rings on lower leaves (target spots)
- Yellow halos around the spots
- Leaves eventually dry and fall off
- Stems may show dark, sunken lesions

## Prevention

1. **Crop Rotation**: Avoid planting tomatoes in the same location for 2-3 years
2. **Proper Spacing**: Ensure adequate air circulation between plants
3. **Mulching**: Apply organic mulch to prevent soil splash
4. **Watering**: Water at the base, avoid wetting leaves

## Treatment

Apply copper-based fungicides at the first sign of infection. Remove and destroy affected leaves immediately.`,
    excerpt: 'Learn how to identify, prevent, and treat early blight in your tomato crops.',
    coverImageUrl: 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?w=800',
    source: 'AGRONOMIST',
    tags: ['tomato', 'fungal disease', 'early blight', 'prevention'],
    createdAt: new Date(Date.now() - 86400000 * 3),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    published: true,
  },
  {
    id: '2',
    authorId: 'agro-1',
    authorName: 'Dr. Sarah Green',
    title: 'Best Practices for Corn Pest Management',
    content: `Integrated Pest Management (IPM) is essential for sustainable corn production. This guide covers the most effective strategies for managing common corn pests.

## Common Pests

- Corn borers
- Armyworms
- Aphids
- Rootworms

## IPM Strategies

1. **Monitoring**: Regular field scouting
2. **Biological Control**: Encourage natural predators
3. **Cultural Practices**: Crop rotation and resistant varieties
4. **Chemical Control**: Use as last resort, targeted application`,
    excerpt: 'A comprehensive guide to integrated pest management for corn farmers.',
    coverImageUrl: 'https://images.unsplash.com/photo-1601493700631-2b16ec4b4716?w=800',
    source: 'AGRONOMIST',
    tags: ['corn', 'pest management', 'IPM', 'sustainable farming'],
    createdAt: new Date(Date.now() - 86400000 * 7),
    updatedAt: new Date(Date.now() - 86400000 * 5),
    published: true,
  },
];

interface ArticleStore {
  articles: Article[];
  isLoading: boolean;
  addArticle: (data: ArticleFormData) => void;
  updateArticle: (id: string, data: Partial<ArticleFormData>) => void;
  deleteArticle: (id: string) => void;
  getArticle: (id: string) => Article | undefined;
  getMyArticles: () => Article[];
  setLoading: (loading: boolean) => void;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: mockArticles,
  isLoading: false,
  addArticle: (data) => {
    const newArticle: Article = {
      id: Date.now().toString(),
      authorId: 'agro-1', // Mock current user
      authorName: 'Dr. Sarah Green',
      ...data,
      source: 'AGRONOMIST',
      createdAt: new Date(),
      updatedAt: new Date(),
      published: true,
    };
    set((state) => ({
      articles: [newArticle, ...state.articles],
    }));
  },
  updateArticle: (id, data) => {
    set((state) => ({
      articles: state.articles.map((article) =>
        article.id === id
          ? { ...article, ...data, updatedAt: new Date() }
          : article
      ),
    }));
  },
  deleteArticle: (id) => {
    set((state) => ({
      articles: state.articles.filter((article) => article.id !== id),
    }));
  },
  getArticle: (id) => get().articles.find((a) => a.id === id),
  getMyArticles: () => get().articles.filter((a) => a.authorId === 'agro-1'),
  setLoading: (loading) => set({ isLoading: loading }),
}));
