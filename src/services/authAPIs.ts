import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/auth",
});

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