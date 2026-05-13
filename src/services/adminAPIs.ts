import axios from "axios";
import {
  User,
  UserRole,
  RssConfiguration,
  RssFeedValidation,
  RssPreviewResult,
  AIModel,
} from "@/types/admin";
import { Diagnosis } from "@/types/diagnosis";
import { Article } from "@/types/article";
const API = axios.create({
  baseURL: "http://localhost:3000/admin",
  withCredentials: true, // keep if using cookies
});

// ============================
// 🔹 AUTH INTERCEPTOR
// ============================

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // wherever you store it

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// ============================
// 🔹 USERS
// ============================

export const fetchUsers = async (): Promise<User[]> => {
  const res = await API.get("/users");
  return res.data.data;
};

export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "lastLoginAt">
): Promise<User> => {
  const res = await API.post("/users", data);
  return res.data.data;
};

export const updateUserDetails = async (
  userId: string,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> => {
  const res = await API.patch(`/users/${userId}`, data);
  return res.data.data;
};

export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/role`, { role });
  return res.data.data;
};

export const updateUserStatus = async (
  userId: string
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/status`);
  return res.data.data;
};

export const deleteUser = async (userId: string): Promise<void> => {
  await API.delete(`/users/${userId}`);
};

// ============================
// 🔹 RSS CONFIGURATION
// ============================

export const fetchRssConfigurations = async (): Promise<RssConfiguration[]> => {
  const res = await API.get("/rss-configurations");
  return res.data.data;
};

export const fetchRssConfigurationsByCategory = async (
  category: string
): Promise<RssConfiguration[]> => {
  const res = await API.get(`/rss-configurations/category/${category}`);
  return res.data.data;
};

export const updateRssConfiguration = async (
  key: string,
  value: any
): Promise<RssConfiguration> => {
  const res = await API.patch(`/rss-configurations/${key}`, { value });
  return res.data.data;
};

export const validateRssFeed = async (
  url: string
): Promise<RssFeedValidation> => {
  const res = await API.post("/rss-configurations/validate-feed", { url });
  return res.data.data;
};

export const previewRssSync = async (): Promise<RssPreviewResult> => {
  const res = await API.post("/rss-configurations/preview-sync");
  return res.data.data;
};

export const triggerRssSync = async (): Promise<{ message: string }> => {
  const res = await API.post("/rss-configurations/trigger-sync");
  return res.data;
};

export const fetchRssScheduleInfo = async () => {
  const res = await API.get("/rss-configurations/schedule-info");
  return res.data.data;
};

// ============================
// 🔹 DIAGNOSES
// ============================

export const fetchDiagnoses = async (): Promise<Diagnosis[]> => {
  const res = await API.get("/diagnoses");
  return res.data.data;
};

// ============================
// 🔹 AI MODELS
// ============================

export const fetchAiModels = async (): Promise<AIModel[]> => {
  const res = await API.get("/ai-models");
  return res.data.data;
  
};export const fetchArticles = async (): Promise<Article[]> => {
  const res = await API.get("/articles");
  return res.data.data;
};