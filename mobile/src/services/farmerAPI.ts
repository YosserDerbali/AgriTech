import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import { useAppStore } from "../stores/appStore";
const {token, restoreToken} = useAppStore.getState(); // Get token from Zustand store
const API_URL = "http://192.168.48.122:3000/farmer";



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
  plantName: string,
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

  formData.append("plantName", plantName);

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

export const transcribeVoiceNote = async (audioUri: string) => {
  const normalizedUri = audioUri?.trim();
  const extensionMatch = normalizedUri.match(/\.([a-zA-Z0-9]+)(?:\?|$)/);
  const extension = (extensionMatch?.[1] || "m4a").toLowerCase();

  const mimeTypeByExtension: Record<string, string> = {
    m4a: "audio/mp4",
    mp4: "audio/mp4",
    mp3: "audio/mpeg",
    wav: "audio/wav",
    webm: "audio/webm",
    caf: "audio/x-caf",
  };

  const mimeType = mimeTypeByExtension[extension] || "application/octet-stream";
  const formData = new FormData();

  formData.append("audio", {
    uri: normalizedUri,
    name: `voice-note.${extension}`,
    type: mimeType,
  } as any);

  try {
    // Let axios/react-native set multipart boundary automatically.
    const response = await API.post("/transcribe", formData);

    return response.data?.text || "";
  } catch (error) {
    const responseData = (error as any)?.response?.data;
    const message = responseData?.message || (error as Error)?.message || "Failed to transcribe voice note";
    const code = responseData?.code || (error as any)?.code || "TRANSCRIPTION_ERROR";

    console.error("[farmerAPI.transcribeVoiceNote] Request failed", {
      code,
      message,
      status: (error as any)?.response?.status,
      responseData,
      requestUrl: (error as any)?.config?.url,
    });

    const transcriptionError = new Error(message);
    (transcriptionError as any).code = code;
    (transcriptionError as any).status = (error as any)?.response?.status;
    throw transcriptionError;
  }
};