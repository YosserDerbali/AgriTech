import axiosInstance from './axiosInstance';
import { ArticleFormData } from '../types/article';

export const getPendingDiagnoses = async () => {
  const response = await axiosInstance.get('/agronomist/diagnoses/pending');
  return response.data;
};

export const approveDiagnosis = async (
  id: string,
  treatment: string,
  agronomistNotes?: string
) => {
  const response = await axiosInstance.patch(`/agronomist/diagnoses/${id}/approve`, {
    treatment,
    agronomistNotes,
  });
  return response.data;
};

export const rejectDiagnosis = async (id: string, agronomistNotes: string) => {
  const response = await axiosInstance.patch(`/agronomist/diagnoses/${id}/reject`, {
    agronomistNotes,
  });
  return response.data;
};

export const getMyArticles = async () => {
  const response = await axiosInstance.get('/agronomist/articles');
  return response.data;
};

export const createArticle = async (data: ArticleFormData) => {
  const response = await axiosInstance.post('/agronomist/articles', data);
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
