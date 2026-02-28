import axios from "axios";

const API_BASE_URL = "http://192.168.0.190:3000";

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: "FARMER" | "AGRONOMIST" | "ADMIN";
    isActive: boolean;
    created_at: string;
    lastLoginAt: string;
  };
}

interface RegisterPayload {
  name: string;
  email: string;
  password: string;
  role: "FARMER" | "AGRONOMIST";
}

interface LoginPayload {
  email: string;
  password: string;
  role?: "FARMER" | "AGRONOMIST";
}

interface AdminLoginPayload {
  email: string;
  password: string;
}

// Create axios instance with base URL
const authAPI = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Add token to requests if available
authAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ✅ FIX: Add proper error handling
authAPI.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("🔴 API Error Details:", {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

/**
 * Register a new farmer or agronomist
 */
export const registerUser = async (payload: RegisterPayload): Promise<AuthResponse> => {
  try {
    console.log("📤 Registering user:", payload);
    const response = await authAPI.post("/auth/register", payload);
    console.log("✅ Registration successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Registration failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Registration failed");
    }
    throw new Error("Registration failed");
  }
};

/**
 * Login as farmer or agronomist
 */
export const loginUser = async (payload: LoginPayload): Promise<AuthResponse> => {
  try {
    console.log("📤 Logging in user:", payload);
    const response = await authAPI.post("/auth/login", payload);
    console.log("✅ Login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Login failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Login failed");
    }
    throw new Error("Login failed");
  }
};

/**
 * Login as admin
 */
export const loginAdmin = async (payload: AdminLoginPayload): Promise<AuthResponse> => {
  try {
    console.log("📤 Admin login:", payload);
    const response = await authAPI.post("/auth/admin/login", payload);
    console.log("✅ Admin login successful:", response.data);
    return response.data;
  } catch (error) {
    console.error("❌ Admin login failed:", error);
    if (axios.isAxiosError(error) && error.response) {
      throw new Error(error.response.data?.message || "Admin login failed");
    }
    throw new Error("Admin login failed");
  }
};

/**
 * Store auth token in localStorage
 */
export const setAuthToken = (token: string) => {
  localStorage.setItem("authToken", token);
  console.log("🔐 Token stored in localStorage");
};

/**
 * Get stored auth token
 */
export const getAuthToken = (): string | null => {
  return localStorage.getItem("authToken");
};

/**
 * Clear auth token
 */
export const clearAuthToken = () => {
  localStorage.removeItem("authToken");
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};
