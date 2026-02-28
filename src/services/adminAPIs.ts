import axios from "axios";
import { User, UserRole } from "@/types/admin";

const API = axios.create({
  baseURL: "http://localhost:3000/admin",
  withCredentials: true, // keep if using cookies/sessions
});

// Add token to requests if available
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// 🔹 Get all users
export const fetchUsers = async (): Promise<User[]> => {
  const res = await API.get("/users");
  return res.data;
};

// 🔹 Update user role
export const updateUserRole = async (userId: string, role: UserRole): Promise<User> => {
  const res = await API.patch(`/users/${userId}/role`, { role });
  return res.data;
};

// 🔹 Update user active status
export const updateUserStatus = async (userId: string): Promise<User> => {
  const res = await API.patch(`/users/${userId}/status`);
  return res.data;
};

// 🔹 Delete user
export const deleteUser = async (userId: string): Promise<void> => {
  await API.delete(`/users/${userId}`);
};
