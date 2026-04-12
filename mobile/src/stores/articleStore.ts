import { create } from 'zustand';
import { Article, ArticleFormData } from '../types/article';
import { getArticles } from '../services/farmerAPI';
import {
  createArticle as createAgronomistArticle,
  deleteArticle as deleteAgronomistArticle,
  getMyArticles as getAgronomistArticles,
  updateArticle as updateAgronomistArticle,
} from '../services/agronomistAPI';

const mapArticle = (article: any): Article => ({
  id: article.id,
  authorId: article.author_id,
  authorName: article.author_name || 'Agronomist',
  title: article.title,
  content: article.content,
  excerpt: article.excerpt,
  coverImageUrl: article.cover_image_url || undefined,
  source: article.source,
  externalUrl: article.external_url || undefined,
  tags: article.tags || [],
  createdAt: new Date(article.created_at),
  updatedAt: new Date(article.updated_at),
  published: Boolean(article.published),
});

interface ArticleStore {
  articles: Article[];
  myArticles: Article[];
  isLoading: boolean;
  getAllArticles: () => Promise<void>;
  fetchMyArticles: () => Promise<void>;
  addArticle: (data: ArticleFormData) => Promise<void>;
  updateArticle: (id: string, data: Partial<ArticleFormData>) => Promise<void>;
  deleteArticle: (id: string) => Promise<void>;
  getArticle: (id: string) => Article | undefined;
  getMyArticles: () => Article[];
  setLoading: (loading: boolean) => void;
}

export const useArticleStore = create<ArticleStore>((set, get) => ({
  articles: [],
  myArticles: [],
  isLoading: false,
 getAllArticles: async () => {
  try {
    set({ isLoading: true });

    const articles = await getArticles();
    const formattedArticles = articles.map(mapArticle);
    
    set({
      articles: formattedArticles,
      isLoading: false,
    });
  } catch (error) {
    console.error("Failed to fetch articles", error);
    set({ isLoading: false });
  }
},
  fetchMyArticles: async () => {
    try {
      set({ isLoading: true });
      const articles = await getAgronomistArticles();
      set({ myArticles: articles.map(mapArticle), isLoading: false });
    } catch (error) {
      console.error('Failed to fetch agronomist articles', error);
      set({ isLoading: false });
    }
  },
  addArticle: async (data) => {
    const created = await createAgronomistArticle(data);
    const mapped = mapArticle(created);
    set((state) => ({
      myArticles: [mapped, ...state.myArticles],
    }));
  },
  updateArticle: async (id, data) => {
    const updated = await updateAgronomistArticle(id, data);
    const mapped = mapArticle(updated);
    set((state) => ({
      myArticles: state.myArticles.map((article) => (article.id === id ? mapped : article)),
    }));
  },
  deleteArticle: async (id) => {
    await deleteAgronomistArticle(id);
    set((state) => ({
      myArticles: state.myArticles.filter((article) => article.id !== id),
    }));
  },
  getArticle: (id) => {
    const state = get();
    return state.myArticles.find((a) => a.id === id) || state.articles.find((a) => a.id === id);
  },
  getMyArticles: () => get().myArticles,
  setLoading: (loading) => set({ isLoading: loading }),
}));
