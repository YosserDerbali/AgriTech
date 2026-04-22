import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Diagnosis } from '../types/diagnosis';
import { createDiagnosis, getMyDiagnoses } from '../services/farmerAPI';
import {
  approveDiagnosis as approveDiagnosisAPI,
  getDiagnosisQueue,
  getPendingDiagnoses as getPendingDiagnosesAPI,
  rejectDiagnosis as rejectDiagnosisAPI,
  reviewDiagnosis,
} from '../services/agronomistAPI';

const mapDiagnosis = (d: any): Diagnosis => ({
  id: d.id,
  imageId: d.image_id ?? null,
  plantId: d.plant_id ?? null,
  diseaseId: d.disease_id ?? null,
  imageUrl: d.image_url,
  plantName: d.plant_name,
  diseaseName: d.disease_name,
  symptoms: d.symptoms ?? null,
  confidence: d.confidence,
  status: d.status,
  treatment: d.treatment ?? null,
  agronomistNotes: d.agronomist_notes ?? null,
  createdAt: new Date(d.created_at),
  updatedAt: new Date(d.updated_at || d.created_at),
});

const mergeDiagnosis = (diagnoses: Diagnosis[], nextDiagnosis: Diagnosis) =>
  diagnoses.map((diagnosis) => (diagnosis.id === nextDiagnosis.id ? nextDiagnosis : diagnosis));

interface DiagnosisStore {
  diagnoses: Diagnosis[];
  isLoading: boolean;
  fetchDiagnoses: () => Promise<void>;
  fetchPendingDiagnoses: () => Promise<void>;
  fetchReviewQueue: () => Promise<void>;
  addDiagnosis: (payload: { imageUrl: string; plantName?: string; context?: string }) => Promise<void>;
  getDiagnosis: (id: string) => Diagnosis | undefined;
  getPendingDiagnoses: () => Diagnosis[];
  approveDiagnosis: (id: string, treatment: string, notes?: string) => Promise<void>;
  rejectDiagnosis: (id: string, notes: string) => Promise<void>;
  updateDiagnosis: (id: string, updates: Partial<Diagnosis>) => Promise<void>;
  setLoading: (loading: boolean) => void;
}

export const useDiagnosisStore = create<DiagnosisStore>((set, get) => ({
  diagnoses: [],
  isLoading: false,
  fetchDiagnoses: async () => {
    const setLoading = get().setLoading;
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        // User is not authenticated, skip fetch
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getMyDiagnoses();
      set({ diagnoses: data.map(mapDiagnosis) });
    } catch (err: any) {
      // Skip 401 errors silently (user logged out)
      if (err?.response?.status !== 401) {
        console.error('Failed to fetch diagnoses:', err);
      }
    } finally {
      setLoading(false);
    }
  },
  fetchPendingDiagnoses: async () => {
    const setLoading = get().setLoading;
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getPendingDiagnosesAPI();
      set({ diagnoses: data.map(mapDiagnosis) });
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error('Failed to fetch pending diagnoses:', err);
      }
    } finally {
      setLoading(false);
    }
  },
  fetchReviewQueue: async () => {
    const setLoading = get().setLoading;
    try {
      const token = await AsyncStorage.getItem("authToken");
      if (!token) {
        setLoading(false);
        return;
      }
      setLoading(true);
      const data = await getDiagnosisQueue();
      set({ diagnoses: data.map(mapDiagnosis) });
    } catch (err: any) {
      if (err?.response?.status !== 401) {
        console.error('Failed to fetch diagnoses:', err);
      }
    } finally {
      setLoading(false);
    }
  },
  addDiagnosis: async ({ imageUrl, plantName, context }) => {
    try {
      set({ isLoading: true });

      const normalizedPlantName = plantName?.trim() || 'Unknown Plant';
      const data = await createDiagnosis(imageUrl, normalizedPlantName, context);
      const newDiagnosis = mapDiagnosis(data.diagnosis);

      set((state) => ({
        diagnoses: [newDiagnosis, ...state.diagnoses],
        isLoading: false,
      }));
    } catch (error) {
      const responseData = (error as any)?.response?.data;
      const backendMessage = responseData?.message || (error as Error)?.message || 'Failed to create diagnosis';

      console.error('Error creating diagnosis:', {
        message: backendMessage,
        code: responseData?.code || (error as any)?.code,
        status: (error as any)?.response?.status,
        responseData,
      });

      set({ isLoading: false });
      throw new Error(backendMessage);
    }
  },
  getDiagnosis: (id) => get().diagnoses.find((d) => d.id === id),
  getPendingDiagnoses: () => get().diagnoses.filter((d) => d.status === 'PENDING'),
  approveDiagnosis: async (id, treatment, notes) => {
    try {
      set({ isLoading: true });
      const data = await approveDiagnosisAPI(id, treatment, notes);
      const updatedDiagnosis = mapDiagnosis(data.diagnosis || data);
      set((state) => ({
        diagnoses: mergeDiagnosis(state.diagnoses, updatedDiagnosis),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  rejectDiagnosis: async (id, notes) => {
    try {
      set({ isLoading: true });
      const data = await rejectDiagnosisAPI(id, notes);
      const updatedDiagnosis = mapDiagnosis(data.diagnosis || data);
      set((state) => ({
        diagnoses: mergeDiagnosis(state.diagnoses, updatedDiagnosis),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  updateDiagnosis: async (id, updates) => {
    try {
      set({ isLoading: true });
      const data = await reviewDiagnosis(id, {
        diseaseName: updates.diseaseName ?? undefined,
        symptoms: updates.symptoms ?? undefined,
        treatment: updates.treatment ?? undefined,
        agronomistNotes: updates.agronomistNotes ?? undefined,
      });
      const updatedDiagnosis = mapDiagnosis(data.diagnosis || data);
      set((state) => ({
        diagnoses: mergeDiagnosis(state.diagnoses, updatedDiagnosis),
        isLoading: false,
      }));
    } catch (error) {
      set({ isLoading: false });
      throw error;
    }
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
