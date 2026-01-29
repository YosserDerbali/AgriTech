export type ArticleSource = 'AGRONOMIST' | 'EXTERNAL';

export interface Article {
  id: string;
  authorId: string;
  authorName: string;
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl?: string;
  source: ArticleSource;
  externalUrl?: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  published: boolean;
}

export interface ArticleFormData {
  title: string;
  content: string;
  excerpt: string;
  coverImageUrl?: string;
  tags: string[];
}
