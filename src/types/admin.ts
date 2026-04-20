export type UserRole = 'FARMER' | 'AGRONOMIST' | 'ADMIN';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive: boolean;
  createdAt: Date;
  lastLoginAt?: Date;
}

export interface AIModel {
  id: string;
  name: string;
  version: string;
  type: 'DISEASE_DETECTION' | 'SPEECH_RECOGNITION' | 'RECOMMENDATION';
  isEnabled: boolean;
  accuracy?: number;
  totalPredictions: number;
  lastUpdated: Date;
}

export interface SystemStats {
  totalUsers: number;
  totalFarmers: number;
  totalAgronomists: number;
  totalAdmins: number;
  totalDiagnoses: number;
  pendingDiagnoses: number;
  approvedDiagnoses: number;
  rejectedDiagnoses: number;
  totalArticles: number;
  avgConfidence: number;
  aiAccuracy: number;
}

export interface SystemConfig {
  maintenanceMode: boolean;
  maxImageSizeMB: number;
  confidenceThreshold: number;
  notificationsEnabled: boolean;
  externalBlogSyncEnabled: boolean;
  externalBlogSyncIntervalHours: number;
}

// RSS Configuration Types
export type RssConfigDataType = 'string' | 'number' | 'boolean' | 'json_array' | 'json_object';

export interface RssFeed {
  url: string;
  authorName: string;
  isActive: boolean;
}

export interface RssConfiguration {
  id: string;
  key: string;
  value: any;
  description: string;
  category: string;
  dataType: RssConfigDataType;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface RssFeedValidation {
  valid: boolean;
  feedTitle?: string;
  itemCount?: number;
  error?: string;
}

export interface RssPreviewResult {
  totalArticles: number;
  articles: Array<{
    title: string;
    url: string;
    feed: string;
    relevant: boolean;
    tags?: string[];
  }>;
  message?: string;
}

export interface RssConfigState {
  configurations: RssConfiguration[];
  feeds: RssFeed[];
  keywords: string[];
  tagKeywords: string[];
  fallbackImages: string[];
  scheduling: {
    syncEnabled: boolean;
    syncIntervalHours: number;
    syncTimeHour: number;
    parserTimeout: number;
    batchSizeMin: number;
    batchSizeMax: number;
    nextSyncTime?: Date;
    isScheduled: boolean;
    cronExpression?: string;
  };
  isLoading: boolean;
  error: string | null;
}
