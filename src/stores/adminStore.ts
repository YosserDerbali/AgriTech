import { create } from 'zustand';
import {
  User,
  AIModel,
  SystemStats,
  SystemConfig,
  UserRole,
  RssConfiguration,
  RssFeed,
  RssFeedValidation,
  RssPreviewResult,
  RssConfigState,
} from '@/types/admin';

import {
  fetchUsers,
  createUser,
  updateUserDetails,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  fetchArticles,
  fetchDiagnoses,
  fetchAiModels,
  fetchRssConfigurations,
  updateRssConfiguration,
  validateRssFeed,
  previewRssSync,
  triggerRssSync,
  fetchRssScheduleInfo,
} from '@/services/adminAPIs';

const mockConfig: SystemConfig = {
  maintenanceMode: false,
  maxImageSizeMB: 10,
  confidenceThreshold: 0.7,
  notificationsEnabled: true,
  externalBlogSyncEnabled: true,
  externalBlogSyncIntervalHours: 6,
};

interface AdminStore {
  users: User[];
  articles: any[];
  diagnoses: any[];
  aiModels: AIModel[];

  systemConfig: SystemConfig;
  rssConfig: RssConfigState;

  isLoading: boolean;

  // Data loading
  loadSystemData: () => Promise<void>;

  // Users
  loadUsers: () => Promise<void>;
  getUsers: () => User[];
  getUsersByRole: (role: UserRole) => User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userId: string, data: Partial<User>) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // AI Models
  getAIModels: () => AIModel[];
  toggleAIModel: (modelId: string) => void;

  // System config
  updateSystemConfig: (config: Partial<SystemConfig>) => void;

  // Stats
  getSystemStats: () => SystemStats;

  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  articles: [],
  diagnoses: [],
  aiModels: [],

  systemConfig: mockConfig,

  rssConfig: {
    configurations: [],
    feeds: [],
    keywords: [],
    tagKeywords: [],
    fallbackImages: [],
    scheduling: {
      syncEnabled: false,
      syncIntervalHours: 144,
      syncTimeHour: 3,
      parserTimeout: 10000,
      batchSizeMin: 5,
      batchSizeMax: 8,
      isScheduled: false,
    },
    isLoading: false,
    error: null,
  },

  isLoading: false,

  // ============================
  // 🔹 LOAD ALL SYSTEM DATA
  // ============================
  loadSystemData: async () => {
    set({ isLoading: true });

    try {
      const [users, articles, diagnoses, aiModels] =
        await Promise.all([
          fetchUsers(),
          fetchArticles(),
          fetchDiagnoses(),
          fetchAiModels(),
        ]);

      set({
        users,
        articles,
        diagnoses,
        aiModels,
        isLoading: false,
      });
    } catch (error) {
      console.error('Failed to load system data:', error);
      set({ isLoading: false });
    }
  },

  // ============================
  // 🔹 USERS
  // ============================

  loadUsers: async () => {
    set({ isLoading: true });
    const users = await fetchUsers();
    set({ users, isLoading: false });
  },

  getUsers: () => get().users,

  getUsersByRole: (role) =>
    get().users.filter((u) => u.role === role),

  addUser: async (userData) => {
    set({ isLoading: true });
    const newUser = await createUser(userData);
    set((state) => ({
      users: [newUser, ...state.users],
      isLoading: false,
    }));
  },

  updateUser: async (userId, data) => {
    set({ isLoading: true });
    const updatedUser = await updateUserDetails(userId, data);
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? updatedUser : u
      ),
      isLoading: false,
    }));
  },

  updateUserRole: async (userId, role) => {
    set({ isLoading: true });
    const updatedUser = await updateUserRole(userId, role);
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? updatedUser : u
      ),
      isLoading: false,
    }));
  },

  toggleUserActive: async (userId) => {
    set({ isLoading: true });
    const updatedUser = await updateUserStatus(userId);
    set((state) => ({
      users: state.users.map((u) =>
        u.id === userId ? updatedUser : u
      ),
      isLoading: false,
    }));
  },

  deleteUser: async (userId) => {
    set({ isLoading: true });
    await deleteUser(userId);
    set((state) => ({
      users: state.users.filter((u) => u.id !== userId),
      isLoading: false,
    }));
  },

  // ============================
  // 🔹 AI MODELS
  // ============================

  getAIModels: () => get().aiModels,

  toggleAIModel: (modelId) => {
    set((state) => ({
      aiModels: state.aiModels.map((m) =>
        m.id === modelId
          ? { ...m, isEnabled: !m.isEnabled }
          : m
      ),
    }));
  },

  // ============================
  // 🔹 SYSTEM CONFIG
  // ============================

  updateSystemConfig: (config) => {
    set((state) => ({
      systemConfig: { ...state.systemConfig, ...config },
    }));
  },

  // ============================
  // 🔹 SYSTEM STATS
  // ============================

  getSystemStats: () => {
  const { users, articles, diagnoses, aiModels } = get();

  // User breakdown
  const totalFarmers = users.filter((u) => u.role === "FARMER").length;
  const totalAgronomists = users.filter((u) => u.role === "AGRONOMIST").length;
  const totalAdmins = users.filter((u) => u.role === "ADMIN").length;

  // Diagnosis breakdown
  const totalDiagnoses = diagnoses.length;

  // If your Diagnosis model has a `status` field,
  // this will work. Otherwise these will be 0.
  const pendingDiagnoses = diagnoses.filter(
    (d: any) => d.status === "PENDING"
  ).length;

  const approvedDiagnoses = diagnoses.filter(
    (d: any) => d.status === "APPROVED"
  ).length;

  const rejectedDiagnoses = diagnoses.filter(
    (d: any) => d.status === "REJECTED"
  ).length;

  // AI model stats
  const enabledModels = aiModels.filter((m) => m.isEnabled);

  const avgAccuracy =
    enabledModels.length > 0
      ? enabledModels.reduce(
          (sum, m) => sum + (m.accuracy || 0),
          0
        ) / enabledModels.length
      : 0;

  return {
    totalUsers: users.length,
    totalFarmers,
    totalAgronomists,
    totalAdmins,

    totalDiagnoses,
    pendingDiagnoses,
    approvedDiagnoses,
    rejectedDiagnoses,

    totalArticles: articles.length,

    avgConfidence: 0, // Only calculate if diagnosis has confidence field
    aiAccuracy: Number(avgAccuracy.toFixed(2)),
  };
},

  setLoading: (loading) => set({ isLoading: loading }),
}));