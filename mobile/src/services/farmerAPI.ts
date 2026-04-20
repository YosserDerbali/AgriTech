import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const API_URL = process.env.EXPO_PUBLIC_API_URL || "http://192.168.1.120:3000";

const API = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

API.interceptors.request.use(async (config) => {
  const token = await AsyncStorage.getItem("authToken");
  
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  
  return config;
}, (error) => {
  return Promise.reject(error);
});

API.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      console.log('401 Unauthorized - Clearing token');
      await AsyncStorage.removeItem('authToken');
    }
    return Promise.reject(error);
  }
);

export const getArticles = async () => {
  const response = await API.get(`/farmer/articles`);
  return response.data;
};

export const getArticleById = async (id: string) => {
  const response = await API.get(`/farmer/articles/${id}`);
  return response.data;
};

export const getMyDiagnoses = async () => {
  const response = await API.get(`/farmer/diagnoses`);
  return response.data;
};

export const getDiagnosisById = async (id: string) => {
  const response = await API.get(`/farmer/diagnoses/${id}`);
  return response.data;
};

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

  const response = await API.post("/farmer/diagnose", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

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
    const response = await API.post("/farmer/transcribe", formData);
    return response.data?.text || "";
  } catch (error) {
    const responseData = (error as any)?.response?.data;
    const message = responseData?.message || (error as Error)?.message || "Failed to transcribe voice note";
    const code = responseData?.code || (error as any)?.code || "TRANSCRIPTION_ERROR";

    console.error("[farmerAPI.transcribeVoiceNote] Request failed", {
      code,
      message,
      status: (error as any)?.response?.status,
    });

    const transcriptionError = new Error(message);
    (transcriptionError as any).code = code;
    (transcriptionError as any).status = (error as any)?.response?.status;
    throw transcriptionError;
  }
};