import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/auth",
});

export type AuthRole = "FARMER" | "AGRONOMIST";

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "FARMER" | "AGRONOMIST" | "ADMIN";
    isActive: boolean;
    lastLoginAt: string;
    created_at?: string;
    createdAt?: string;
  };
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: AuthRole;
}

export interface LoginPayload {
  email: string;
  password: string;
  role?: AuthRole;
}

// ============================
// 🔐 ADMIN LOGIN
// ============================

export interface AdminLoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "ADMIN";
    isActive: boolean;
    lastLoginAt: string;
    createdAt: string;
  };
}

export const adminLogin = async (
  email: string,
  password: string
): Promise<AdminLoginResponse> => {
  const res = await API.post("/admin/login", {
    email,
    password,
  });

  return res.data;
};

export const setAuthToken = (token: string) => {
  localStorage.setItem("token", token);
};

export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  const res = await API.post("/register", payload);
  return res.data;
};

export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  const res = await API.post("/login", payload);
  return res.data;
};