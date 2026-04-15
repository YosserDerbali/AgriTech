import axiosInstance from "./axiosInstance";
import { ArticleFormData } from "../types/article";

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
  const response = await axiosInstance.post("/agronomist/articles", data);
  return response.data;
};

export const updateArticle = async (id: string, data: Partial<ArticleFormData>) => {
  const response = await axiosInstance.patch(`/agronomist/articles/${id}`, data);
  return response.data;
};

export const deleteArticle = async (id: string) => {
  const response = await axiosInstance.delete(`/agronomist/articles/${id}`);
  return response.data;
};
