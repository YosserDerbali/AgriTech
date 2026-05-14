import axios from "axios";
import { User, UserRole, RssConfiguration, RssFeedValidation, RssPreviewResult } from "@/types/admin";

const API = axios.create({
  baseURL: "http://localhost:3000/admin",
  withCredentials: true, // keep if using cookies
});

// ============================
// 🔹 USERS
// ============================

 API.interceptors.request.use((config) => {
   const token = localStorage.getItem("token"); // wherever you store it

   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
 });
// Get all users
export const fetchUsers = async (): Promise<User[]> => {
  const res = await API.get("/users");
  console.log("Fetched users:", res.data.data);
  return res.data.data;
};

// Create new user
export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "lastLoginAt">
): Promise<User> => {
  console.log("Creating user with data:", data);
  const res = await API.post("/users", data);
  return res.data.data;
};

// Update user general details (name, email, etc.)
export const updateUserDetails = async (
  userId: string,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> => {
  const res = await API.patch(`/users/${userId}`, data);
  return res.data.data;
};

// Update user role
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/role`, { role });
  return res.data.data;
};

// Toggle user active status
export const updateUserStatus = async (
  userId: string
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/status`);
  console.log("Updated user status:", res.data.data);
  return res.data.data;
};


// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
 const res = await API.delete(`/users/${userId}`);
  return res.data.data;
};

// ============================
// 🔹 RSS CONFIGURATION
// ============================

// Get all RSS configurations
export const fetchRssConfigurations = async (): Promise<RssConfiguration[]> => {
  const res = await API.get("/rss-configurations");
  return res.data.data;
};

// Get RSS configurations by category
export const fetchRssConfigurationsByCategory = async (category: string): Promise<RssConfiguration[]> => {
  const res = await API.get(`/rss-configurations/category/${category}`);
  return res.data.data;
};

// Update RSS configuration
export const updateRssConfiguration = async (key: string, value: any): Promise<RssConfiguration> => {
  const res = await API.patch(`/rss-configurations/${key}`, { value });
  return res.data.data;
};

// Validate RSS feed URL
export const validateRssFeed = async (url: string): Promise<RssFeedValidation> => {
  const res = await API.post("/rss-configurations/validate-feed", { url });
  return res.data.data;
};

// Preview RSS sync (dry run)
export const previewRssSync = async (): Promise<RssPreviewResult> => {
  const res = await API.post("/rss-configurations/preview-sync");
  return res.data.data;
};

// Trigger manual RSS sync
export const triggerRssSync = async (): Promise<{ message: string }> => {
  const res = await API.post("/rss-configurations/trigger-sync");
  return res.data;
};

// Get RSS schedule information
export const fetchRssScheduleInfo = async () => {
  const res = await API.get("/rss-configurations/schedule-info");
  return res.data.data;
};

// ============================
// 🔹 AI MODELS
// ============================

export interface AIModel {
  id: string;
  name: string;
  version: string;
  type: string;
  accuracy: number;
  totalPredictions: number;
  isEnabled: boolean;
  lastUpdated: Date;
}

// Get all AI models
export const fetchAiModels = async (): Promise<AIModel[]> => {
  const res = await API.get("/ai-models");
  return res.data.data;
};

// Create new AI model
export const createAiModel = async (
  data: Omit<AIModel, "id" | "lastUpdated">
): Promise<AIModel> => {
  const res = await API.post("/ai-models", data);
  return res.data.data;
};

// Toggle AI model status (enable/disable)
export const toggleAiModel = async (modelId: string): Promise<AIModel> => {
  const res = await API.patch(`/ai-models/${modelId}`);
  return res.data.data;
};

// Delete AI model
export const deleteAiModel = async (modelId: string): Promise<void> => {
  const res = await API.delete(`/ai-models/${modelId}`);
  return res.data.data;
};

// ============================
// 🔹 SYSTEM SETTINGS
// ============================

export interface SystemConfig {
  id: string;
  maintenanceMode: boolean;
  maxImageSizeMB: number;
  confidenceThreshold: number;
  notificationsEnabled: boolean;
  externalBlogSyncEnabled: boolean;
  externalBlogSyncIntervalHours: number;
  createdAt: Date;
  updatedAt: Date;
}

// Get system settings
export const fetchSystemSettings = async (): Promise<SystemConfig> => {
  const res = await API.get("/settings");
  return res.data.data;
};

// Update system settings
export const updateSystemSettings = async (
  data: Partial<Omit<SystemConfig, "id" | "createdAt" | "updatedAt">>
): Promise<SystemConfig> => {
  const res = await API.put("/settings", data);
  return res.data.data;
};