import { create } from 'zustand';
import { User, AIModel, SystemStats, SystemConfig, UserRole } from '@/types/admin';
import { fetchUsers, createUser, updateUserDetails, updateUserRole, updateUserStatus, deleteUser } from '@/services/adminAPIs';
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
  
  // Stats
  getSystemStats: () => SystemStats;
  
  setLoading: (loading: boolean) => void;
}

export const useAdminStore = create<AdminStore>((set, get) => ({
  users: [],
  aiModels: mockAIModels,
  systemConfig: mockConfig,
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
}));
