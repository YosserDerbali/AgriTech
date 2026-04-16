import { create } from 'zustand';
import { Diagnosis } from '../types/diagnosis';
import { createDiagnosis, getMyDiagnoses } from '../services/farmerAPI';
import {
  approveDiagnosis as approveDiagnosisAPI,
  getPendingDiagnoses as getPendingDiagnosesAPI,
  rejectDiagnosis as rejectDiagnosisAPI,
} from '../services/agronomistAPI';

const mapDiagnosis = (d: any): Diagnosis => ({
  id: d.id,
  imageUrl: d.image_url,
  plantName: d.plant_name,
  diseaseName: d.disease_name,
  confidence: d.confidence,
  status: d.status,
  treatment: d.treatment,
  agronomistNotes: d.agronomist_notes,
  createdAt: new Date(d.created_at),
  updatedAt: new Date(d.updated_at),
});

interface DiagnosisStore {
  diagnoses: Diagnosis[];
  isLoading: boolean;
  fetchDiagnoses: () => Promise<void>;
  fetchPendingDiagnoses: () => Promise<void>;
  addDiagnosis: (payload: { imageUrl: string; plantName: string; context?: string }) => Promise<void>;
  getDiagnosis: (id: string) => Diagnosis | undefined;
  getPendingDiagnoses: () => Diagnosis[];
  approveDiagnosis: (id: string, treatment: string, notes?: string) => Promise<void>;
  rejectDiagnosis: (id: string, notes: string) => Promise<void>;
  updateDiagnosis: (id: string, updates: Partial<Diagnosis>) => void;
  setLoading: (loading: boolean) => void;
}

export const useDiagnosisStore = create<DiagnosisStore>((set, get) => ({
  diagnoses: [],
  isLoading: false,
  fetchDiagnoses: async () => {
    const setLoading = get().setLoading;
    try {
      setLoading(true);
      const data = await getMyDiagnoses();
      set({ diagnoses: data.map(mapDiagnosis) });
    } catch (err) {
      console.error('Failed to fetch diagnoses:', err);
    } finally {
      setLoading(false);
    }
  },
  fetchPendingDiagnoses: async () => {
    const setLoading = get().setLoading;
    try {
      setLoading(true);
      const data = await getPendingDiagnosesAPI();
      set({ diagnoses: data.map(mapDiagnosis) });
    } catch (err) {
      console.error('Failed to fetch pending diagnoses:', err);
    } finally {
      setLoading(false);
    }
  },
  addDiagnosis: async ({ imageUrl, plantName, context }) => {
  try {
    set({ isLoading: true });

    const data = await createDiagnosis(imageUrl, plantName, context);
    const newDiagnosis: Diagnosis = {
      id: data.diagnosis.id,
      imageUrl: data.diagnosis.image_url,
      plantName: data.diagnosis.plant_name,
      diseaseName: data.diagnosis.disease_name,
      confidence: data.diagnosis.confidence,
      status: data.diagnosis.status,
      treatment: data.diagnosis.treatment,
      agronomistNotes: data.diagnosis.agronomist_notes,
      createdAt: new Date(data.diagnosis.created_at),
      updatedAt: new Date(data.diagnosis.updated_at),
    };

    set((state) => ({
      diagnoses: [newDiagnosis, ...state.diagnoses],
      isLoading: false,
    }));

  } catch (error) {
    console.error("Error creating diagnosis:", error);
    set({ isLoading: false });
  }
},
//   getDiagnosis:  async (id) => {
//   try {
//     set({ isLoading: true });

//     const data = await getDiagnosisById(id);

//     const diagnosis: Diagnosis = {
//       id: data.id,
//       imageUrl: data.image_url,
//       plantName: data.plant_name,
//       diseaseName: data.disease_name,
//       confidence: data.confidence,
//       status: data.status,
//       treatment: data.treatment,
//       agronomistNotes: data.agronomist_notes,
//       createdAt: new Date(data.created_at),
//       updatedAt: new Date(data.updated_at),
//     };

//     set({ isLoading: false });

//     return diagnosis;

//   } catch (error) {
//     console.error("Error fetching diagnosis:", error);
//     set({ isLoading: false });
//   }
// },
  getDiagnosis: (id) => get().diagnoses.find((d) => d.id === id),
  getPendingDiagnoses: () => get().diagnoses.filter((d) => d.status === 'PENDING'),
  approveDiagnosis: async (id, treatment, notes) => {
    const setLoading = get().setLoading;
    try {
      setLoading(true);
      const updated = await approveDiagnosisAPI(id, treatment, notes);
      set((state) => ({
        diagnoses: state.diagnoses.map((d) => (d.id === id ? mapDiagnosis(updated) : d)),
      }));
    } finally {
      setLoading(false);
    }
  },
  rejectDiagnosis: async (id, notes) => {
    const setLoading = get().setLoading;
    try {
      setLoading(true);
      const updated = await rejectDiagnosisAPI(id, notes);
      set((state) => ({
        diagnoses: state.diagnoses.map((d) => (d.id === id ? mapDiagnosis(updated) : d)),
      }));
    } finally {
      setLoading(false);
    }
  },
  updateDiagnosis: (id, updates) => {
    set((state) => ({
      diagnoses: state.diagnoses.map((d) =>
        d.id === id ? { ...d, ...updates, updatedAt: new Date() } : d
      ),
    }));
  },
  setLoading: (loading) => set({ isLoading: loading }),
}));
