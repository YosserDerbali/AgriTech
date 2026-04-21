// Auth Stack Types
export type AuthStackParamList = {
  FarmerAuth: undefined;
  AgronomistAuth: undefined;
};

// Farmer Stack Types
export type FarmerStackParamList = {
  FarmerTabs: undefined;
  Settings: undefined;
  Privacy: undefined;
  Help: undefined;
  EditProfile: undefined;
  Notifications: undefined;
  DiagnosisDetail: { id: string };
  ArticleDetail: { id: string };
};

// Agronomist Stack Types
export type AgronomistStackParamList = {
  AgronomistTabs: undefined;
  Settings: undefined;
  HelpAndSupport: undefined;
  Notifications: undefined;
  EditProfile: undefined;
  ArticleEditor: { articleId?: string };
  DiagnosisReview: { diagnosisId: string };
};

// Article Types
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

// Diagnosis Types
export type DiagnosisStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Diagnosis {
  id: string;
  imageId?: string | null;
  plantId?: number | null;
  diseaseId?: number | null;
  imageUrl: string;
  plantName: string;
  diseaseName: string | null;
  symptoms?: string | null;
  confidence: number | null;
  status: DiagnosisStatus;
  treatment: string | null;
  createdAt: Date;
  updatedAt: Date;
  agronomistNotes: string | null;
}