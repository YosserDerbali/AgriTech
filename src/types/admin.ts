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
