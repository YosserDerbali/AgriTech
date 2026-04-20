import { create } from 'zustand';
import { User, AIModel, SystemStats, SystemConfig, UserRole, RssConfiguration, RssFeed, RssFeedValidation, RssPreviewResult, RssConfigState } from '@/types/admin';
import { fetchUsers, createUser, updateUserDetails, updateUserRole, updateUserStatus, deleteUser, fetchRssConfigurations, updateRssConfiguration, validateRssFeed, previewRssSync, triggerRssSync, fetchRssScheduleInfo } from '@/services/adminAPIs';
// Mock users data
const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Farmer',
    email: 'john@farm.com',
    role: 'FARMER',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 30),
    lastLoginAt: new Date(Date.now() - 3600000),
  },
  {
    id: '2',
    name: 'Dr. Sarah Green',
    email: 'sarah@agro.com',
    role: 'AGRONOMIST',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 60),
    lastLoginAt: new Date(Date.now() - 7200000),
  },
  {
    id: '3',
    name: 'Admin User',
    email: 'admin@system.com',
    role: 'ADMIN',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 90),
    lastLoginAt: new Date(),
  },
  {
    id: '4',
    name: 'Maria Fields',
    email: 'maria@farm.com',
    role: 'FARMER',
    isActive: true,
    createdAt: new Date(Date.now() - 86400000 * 15),
    lastLoginAt: new Date(Date.now() - 86400000 * 2),
  },
  {
    id: '5',
    name: 'Dr. Robert Plant',
    email: 'robert@agro.com',
    role: 'AGRONOMIST',
    isActive: false,
    createdAt: new Date(Date.now() - 86400000 * 45),
    lastLoginAt: new Date(Date.now() - 86400000 * 10),
  },
];

// Mock AI Models
const mockAIModels: AIModel[] = [
  {
    id: '1',
    name: 'Plant Disease Classifier',
    version: 'v2.1.0',
    type: 'DISEASE_DETECTION',
    isEnabled: true,
    accuracy: 91.5,
    totalPredictions: 1523,
    lastUpdated: new Date(Date.now() - 86400000 * 7),
  },
  {
    id: '2',
    name: 'Whisper Speech Recognition',
    version: 'v1.0.0',
    type: 'SPEECH_RECOGNITION',
    isEnabled: true,
    accuracy: 95.2,
    totalPredictions: 342,
    lastUpdated: new Date(Date.now() - 86400000 * 14),
  },
  {
    id: '3',
    name: 'Agronomist Recommender',
    version: 'v1.2.0',
    type: 'RECOMMENDATION',
    isEnabled: true,
    accuracy: 88.3,
    totalPredictions: 156,
    lastUpdated: new Date(Date.now() - 86400000 * 3),
  },
];

// Mock System Config
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
  aiModels: AIModel[];
  systemConfig: SystemConfig;
  rssConfig: RssConfigState;
  isLoading: boolean;

  // User management
  loadUsers: () => Promise<void>;
  getUsers: () => User[];
  getUsersByRole: (role: UserRole) => User[];
  addUser: (user: Omit<User, 'id' | 'createdAt'>) => Promise<void>;
  updateUser: (userId: string, data: Partial<Omit<User, 'id' | 'createdAt'>>) => Promise<void>;
  updateUserRole: (userId: string, role: UserRole) => Promise<void>;
  toggleUserActive: (userId: string) => Promise<void>;
  deleteUser: (userId: string) => Promise<void>;

  // AI Model management
  getAIModels: () => AIModel[];
  toggleAIModel: (modelId: string) => void;

  // System config
  updateSystemConfig: (config: Partial<SystemConfig>) => void;

  // RSS Configuration management
  loadRssConfigurations: () => Promise<void>;
  updateRssConfiguration: (key: string, value: any) => Promise<void>;
  addRssFeed: (feed: RssFeed) => Promise<void>;
  removeRssFeed: (index: number) => Promise<void>;
  updateRssFeed: (index: number, feed: Partial<RssFeed>) => Promise<void>;
  toggleFeedActive: (index: number) => Promise<void>;
  addKeyword: (keyword: string) => Promise<void>;
  removeKeyword: (index: number) => Promise<void>;
  addTagKeyword: (keyword: string) => Promise<void>;
  removeTagKeyword: (index: number) => Promise<void>;
  addFallbackImage: (url: string) => Promise<void>;
  removeFallbackImage: (index: number) => Promise<void>;
  validateFeedUrl: (url: string) => Promise<RssFeedValidation>;
  previewSync: () => Promise<RssPreviewResult>;
  triggerManualSync: () => Promise<void>;
  refreshScheduleInfo: () => Promise<void>;

  // Stats
  getSystemStats: () => SystemStats;

  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  aiModels: mockAIModels,
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
   loadUsers: async () => {
    set({ isLoading: true });
    const users = await fetchUsers();
    set({ users, isLoading: false });
  },
  getUsers: () => get().users,
  
  getUsersByRole: (role) => get().users.filter((u) => u.role === role),

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
  
  getAIModels: () => get().aiModels,
  
  toggleAIModel: (modelId) => {
    set((state) => ({
      aiModels: state.aiModels.map((m) =>
        m.id === modelId ? { ...m, isEnabled: !m.isEnabled } : m
      ),
    }));
  },
  
  updateSystemConfig: (config) => {
    set((state) => ({
      systemConfig: { ...state.systemConfig, ...config },
    }));
  },
  
  getSystemStats: () => {
    const users = get().users;
    return {
      totalUsers: users.length,
      totalFarmers: users.filter((u) => u.role === 'FARMER').length,
      totalAgronomists: users.filter((u) => u.role === 'AGRONOMIST').length,
      totalAdmins: users.filter((u) => u.role === 'ADMIN').length,
      totalDiagnoses: 156,
      pendingDiagnoses: 12,
      approvedDiagnoses: 132,
      rejectedDiagnoses: 12,
      totalArticles: 24,
      avgConfidence: 0.84,
      aiAccuracy: 91.5,
    };
  },
  
  setLoading: (loading) => set({ isLoading: loading }),

  // RSS Configuration management
  loadRssConfigurations: async () => {
    set((state) => ({
      rssConfig: { ...state.rssConfig, isLoading: true, error: null },
    }));

    try {
      const configs = await fetchRssConfigurations();
      const scheduleInfo = await fetchRssScheduleInfo();

      // Parse configurations into structured state
      const feeds = configs.find((c) => c.key === 'rss_feeds')?.value || [];
      const keywords = configs.find((c) => c.key === 'agri_keywords')?.value || [];
      const tagKeywords = configs.find((c) => c.key === 'tag_keywords')?.value || [];
      const fallbackImages = configs.find((c) => c.key === 'fallback_images')?.value || [];

      set((state) => ({
        rssConfig: {
          ...state.rssConfig,
          configurations: configs,
          feeds,
          keywords,
          tagKeywords,
          fallbackImages,
          scheduling: {
            ...state.rssConfig.scheduling,
            syncEnabled: scheduleInfo?.enabled || false,
            syncIntervalHours: scheduleInfo?.intervalHours || 144,
            syncTimeHour: scheduleInfo?.timeHour || 3,
            nextSyncTime: scheduleInfo?.nextSyncTime,
            isScheduled: scheduleInfo?.isScheduled || false,
            cronExpression: scheduleInfo?.cronExpression,
          },
          isLoading: false,
          error: null,
        },
      }));
    } catch (error) {
      set((state) => ({
        rssConfig: {
          ...state.rssConfig,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to load RSS configurations',
        },
      }));
    }
  },

  updateRssConfiguration: async (key, value) => {
    set((state) => ({
      rssConfig: { ...state.rssConfig, isLoading: true, error: null },
    }));

    try {
      const updatedConfig = await updateRssConfiguration(key, value);

      // Update local state based on what was changed
      set((state) => {
        const newRssConfig = { ...state.rssConfig };
        newRssConfig.configurations = newRssConfig.configurations.map((c) =>
          c.key === key ? updatedConfig : c
        );

        // Update specific sections based on key
        switch (key) {
          case 'rss_feeds':
            newRssConfig.feeds = value;
            break;
          case 'agri_keywords':
            newRssConfig.keywords = value;
            break;
          case 'tag_keywords':
            newRssConfig.tagKeywords = value;
            break;
          case 'fallback_images':
            newRssConfig.fallbackImages = value;
            break;
          case 'sync_enabled':
            newRssConfig.scheduling.syncEnabled = value;
            break;
          case 'sync_interval_hours':
            newRssConfig.scheduling.syncIntervalHours = value;
            break;
          case 'sync_time_hour':
            newRssConfig.scheduling.syncTimeHour = value;
            break;
          case 'parser_timeout':
            newRssConfig.scheduling.parserTimeout = value;
            break;
          case 'batch_size_min':
            newRssConfig.scheduling.batchSizeMin = value;
            break;
          case 'batch_size_max':
            newRssConfig.scheduling.batchSizeMax = value;
            break;
        }

        newRssConfig.isLoading = false;
        return { rssConfig: newRssConfig };
      });

      // Refresh schedule info if scheduling config changed
      if (['sync_enabled', 'sync_interval_hours', 'sync_time_hour'].includes(key)) {
        await get().refreshScheduleInfo();
      }
    } catch (error) {
      set((state) => ({
        rssConfig: {
          ...state.rssConfig,
          isLoading: false,
          error: error instanceof Error ? error.message : 'Failed to update configuration',
        },
      }));
    }
  },

  addRssFeed: async (feed) => {
    const state = get();
    const updatedFeeds = [...state.rssConfig.feeds, feed];
    await get().updateRssConfiguration('rss_feeds', updatedFeeds);
  },

  removeRssFeed: async (index) => {
    const state = get();
    const updatedFeeds = state.rssConfig.feeds.filter((_, i) => i !== index);
    await get().updateRssConfiguration('rss_feeds', updatedFeeds);
  },

  updateRssFeed: async (index, feed) => {
    const state = get();
    const updatedFeeds = state.rssConfig.feeds.map((f, i) =>
      i === index ? { ...f, ...feed } : f
    );
    await get().updateRssConfiguration('rss_feeds', updatedFeeds);
  },

  toggleFeedActive: async (index) => {
    const state = get();
    const updatedFeeds = state.rssConfig.feeds.map((f, i) =>
      i === index ? { ...f, isActive: !f.isActive } : f
    );
    await get().updateRssConfiguration('rss_feeds', updatedFeeds);
  },

  addKeyword: async (keyword) => {
    const state = get();
    const updatedKeywords = [...state.rssConfig.keywords, keyword.trim()];
    await get().updateRssConfiguration('agri_keywords', updatedKeywords);
  },

  removeKeyword: async (index) => {
    const state = get();
    const updatedKeywords = state.rssConfig.keywords.filter((_, i) => i !== index);
    await get().updateRssConfiguration('agri_keywords', updatedKeywords);
  },

  addTagKeyword: async (keyword) => {
    const state = get();
    const updatedKeywords = [...state.rssConfig.tagKeywords, keyword.trim()];
    await get().updateRssConfiguration('tag_keywords', updatedKeywords);
  },

  removeTagKeyword: async (index) => {
    const state = get();
    const updatedKeywords = state.rssConfig.tagKeywords.filter((_, i) => i !== index);
    await get().updateRssConfiguration('tag_keywords', updatedKeywords);
  },

  addFallbackImage: async (url) => {
    const state = get();
    const updatedImages = [...state.rssConfig.fallbackImages, url.trim()];
    await get().updateRssConfiguration('fallback_images', updatedImages);
  },

  removeFallbackImage: async (index) => {
    const state = get();
    const updatedImages = state.rssConfig.fallbackImages.filter((_, i) => i !== index);
    await get().updateRssConfiguration('fallback_images', updatedImages);
  },

  validateFeedUrl: async (url) => {
    return await validateRssFeed(url);
  },

  previewSync: async () => {
    return await previewRssSync();
  },

  triggerManualSync: async () => {
    return await triggerRssSync();
  },

  refreshScheduleInfo: async () => {
    try {
      const scheduleInfo = await fetchRssScheduleInfo();
      set((state) => ({
        rssConfig: {
          ...state.rssConfig,
          scheduling: {
            ...state.rssConfig.scheduling,
            syncEnabled: scheduleInfo?.enabled || false,
            syncIntervalHours: scheduleInfo?.intervalHours || 144,
            syncTimeHour: scheduleInfo?.timeHour || 3,
            nextSyncTime: scheduleInfo?.nextSyncTime,
            isScheduled: scheduleInfo?.isScheduled || false,
            cronExpression: scheduleInfo?.cronExpression,
          },
        },
      }));
    } catch (error) {
      console.error('Failed to refresh schedule info:', error);
    }
  },
}));
