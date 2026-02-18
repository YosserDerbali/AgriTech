import axios from "axios";
import { User, UserRole } from "@/types/admin";

const API = axios.create({
  baseURL: "http://localhost:5000/api/admin",
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
  return res.data;
};

// Create new user
export const createUser = async (
  data: Omit<User, "id" | "createdAt" | "lastLoginAt">
): Promise<User> => {
  const res = await API.post("/users", data);
  return res.data;
};

// Update user general details (name, email, etc.)
export const updateUserDetails = async (
  userId: string,
  data: Partial<Omit<User, "id" | "createdAt">>
): Promise<User> => {
  const res = await API.patch(`/users/${userId}`, data);
  return res.data;
};

// Update user role
export const updateUserRole = async (
  userId: string,
  role: UserRole
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/role`, { role });
  return res.data;
};

// Toggle user active status
export const updateUserStatus = async (
  userId: string
): Promise<User> => {
  const res = await API.patch(`/users/${userId}/status`);
  return res.data;
};

// Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  await API.delete(`/users/${userId}`);
};