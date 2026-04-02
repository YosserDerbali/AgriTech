import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppStore } from "../stores/appStore";
const {token, restoreToken} = useAppStore.getState(); // Get token from Zustand store
const API_URL = "http://192.168.51.196:3000/farmer";



// Helper to get token
const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});



 API.interceptors.request.use(async (config) => {
  
    const token =   await AsyncStorage.getItem("authToken");
    
   if (token) {
     config.headers.Authorization = `Bearer ${token}`;
   }

   return config;
 });

/* =========================
   ARTICLES
========================= */

// Get all articles
export const getArticles = async () => {
  const response = await API.get(`/articles`);
  return response.data;
};

// Get single article
export const getArticleById = async (id: string) => {
  const response = await API.get(`/articles/${id}`, );
  return response.data;
};

/* =========================
   DIAGNOSES
========================= */

// Get farmer diagnoses
export const getMyDiagnoses = async () => {
  const response = await API.get(`/diagnoses`,);

  return response.data;
};

// Get single diagnosis
export const getDiagnosisById = async (id: string) => {
  const response = await API.get(`/diagnoses/${id}`, );
  return response.data;
};

/* =========================
   CREATE DIAGNOSIS
========================= */

export const createDiagnosis = async (
  image: any,
  context?: string
) => {
  const formData = new FormData();

  formData.append("image", {
    uri: image,
    name: "plant.jpg",
    type: "image/jpeg",
  } as any);

  if (context) {
    formData.append("context", context);
  }

  const response = await API.post(
    "/diagnose",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return response.data;
};