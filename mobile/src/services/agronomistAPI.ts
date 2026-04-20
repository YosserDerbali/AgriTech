import axiosInstance from "./axiosInstance";
import { ArticleFormData } from "../types/article";

const isLocalAssetUri = (value?: string) => {
  if (!value) {
    return false;
  }

  const normalized = value.trim().toLowerCase();
  return normalized.startsWith("file://") || normalized.startsWith("content://") || normalized.startsWith("ph://");
};

const inferMimeType = (uri: string) => {
  const lower = uri.toLowerCase();
  if (lower.endsWith(".png")) return "image/png";
  if (lower.endsWith(".webp")) return "image/webp";
  if (lower.endsWith(".heic") || lower.endsWith(".heif")) return "image/heic";
  return "image/jpeg";
};

const toArticleFormData = (data: Partial<ArticleFormData>) => {
  const formData = new FormData();

  if (data.title !== undefined) formData.append("title", data.title);
  if (data.content !== undefined) formData.append("content", data.content);
  if (data.excerpt !== undefined) formData.append("excerpt", data.excerpt);
  if (data.tags !== undefined) formData.append("tags", JSON.stringify(data.tags));
  if (data.removeCoverImage !== undefined) formData.append("removeCoverImage", String(Boolean(data.removeCoverImage)));

  if (data.coverImage && isLocalAssetUri(data.coverImage)) {
    formData.append("coverImage", {
      uri: data.coverImage,
      name: "article-cover.jpg",
      type: inferMimeType(data.coverImage),
    } as any);
  }

  return formData;
};

export type DiagnosisReviewStatus = "APPROVED" | "REJECTED";

export interface DiagnosisReviewPayload {
  status?: DiagnosisReviewStatus;
  treatment?: string;
  agronomistNotes?: string;
  diseaseName?: string;
  symptoms?: string;
}

export const getDiagnosisQueue = async () => {
  const response = await axiosInstance.get("/agronomist/diagnoses");
  return response.data;
};

export const getPendingDiagnoses = async () => {
  const response = await axiosInstance.get("/agronomist/diagnoses/pending");
  return response.data;
};

export const getDiagnosisById = async (id: string) => {
  const response = await axiosInstance.get(`/agronomist/diagnoses/${id}`);
  return response.data;
};

export const reviewDiagnosis = async (id: string, payload: DiagnosisReviewPayload) => {
  const response = await axiosInstance.patch(`/agronomist/diagnoses/${id}`, payload);
  return response.data;
};

export const approveDiagnosis = async (id: string, treatment: string, agronomistNotes?: string) => {
  const response = await axiosInstance.patch(`/agronomist/diagnoses/${id}/approve`, {
    treatment,
    agronomistNotes,
    status: "APPROVED",
  });
  return response.data;
};

export const rejectDiagnosis = async (id: string, agronomistNotes: string) => {
  const response = await axiosInstance.patch(`/agronomist/diagnoses/${id}/reject`, {
    agronomistNotes,
    status: "REJECTED",
  });
  return response.data;
};

export const getMyArticles = async () => {
  const response = await axiosInstance.get("/agronomist/articles");
  return response.data;
};

export const createArticle = async (data: ArticleFormData) => {
  const response = await axiosInstance.post("/agronomist/articles", toArticleFormData(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const updateArticle = async (id: string, data: Partial<ArticleFormData>) => {
  const response = await axiosInstance.patch(`/agronomist/articles/${id}`, toArticleFormData(data), {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await axiosInstance.delete(`/agronomist/articles/${id}`);
  return response.data;
};
