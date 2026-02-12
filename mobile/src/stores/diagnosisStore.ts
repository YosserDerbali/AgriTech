import { create } from 'zustand';
import { Diagnosis } from '../types/diagnosis';

const mockDiagnoses: Diagnosis[] = [
  {
    id: '1',
    imageUrl: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400',
    plantName: 'Tomato',
    diseaseName: 'Early Blight',
    confidence: 0.87,
    status: 'APPROVED',
    treatment: 'Apply copper-based fungicide. Remove affected leaves. Ensure proper spacing for air circulation.',
    createdAt: new Date(Date.now() - 86400000 * 2),
    updatedAt: new Date(Date.now() - 86400000),
    agronomistNotes: 'Common issue in humid conditions. Recommend preventive spraying.',
  },
  {
    id: '2',
    imageUrl: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=400',
    plantName: 'Corn',
    diseaseName: 'Leaf Rust',
    confidence: 0.72,
    status: 'PENDING',
    treatment: null,
    createdAt: new Date(Date.now() - 3600000 * 5),
    updatedAt: new Date(Date.now() - 3600000 * 5),
    agronomistNotes: null,
  },
  {
    id: '3',
    imageUrl: 'https://images.unsplash.com/photo-1518977676601-b53f82ber2a?w=400',
    plantName: 'Apple',
    diseaseName: 'Powdery Mildew',
    confidence: 0.45,
    status: 'REJECTED',
    treatment: null,
    createdAt: new Date(Date.now() - 86400000 * 5),
    updatedAt: new Date(Date.now() - 86400000 * 3),
    agronomistNotes: 'Image quality too low. Please submit a clearer photo of the affected area.',
  },
];

interface DiagnosisStore {
  diagnoses: Diagnosis[];
  isLoading: boolean;
  addDiagnosis: (diagnosis: Omit<Diagnosis, 'id' | 'createdAt' | 'updatedAt'>) => void;
  getDiagnosis: (id: string) => Diagnosis | undefined;
  getPendingDiagnoses: () => Diagnosis[];
  approveDiagnosis: (id: string, treatment: string, notes?: string) => void;
  rejectDiagnosis: (id: string, notes: string) => void;
  updateDiagnosis: (id: string, updates: Partial<Diagnosis>) => void;
  setLoading: (loading: boolean) => void;
}

export const useDiagnosisStore = create<DiagnosisStore>((set, get) => ({
  diagnoses: mockDiagnoses,
  isLoading: false,
  addDiagnosis: (diagnosis) => {
    const newDiagnosis: Diagnosis = {
      ...diagnosis,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    set((state) => ({
      diagnoses: [newDiagnosis, ...state.diagnoses],
    }));
  },
  getDiagnosis: (id) => get().diagnoses.find((d) => d.id === id),
  getPendingDiagnoses: () => get().diagnoses.filter((d) => d.status === 'PENDING'),
  approveDiagnosis: (id, treatment, notes) => {
    set((state) => ({
      diagnoses: state.diagnoses.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'APPROVED' as const,
              treatment,
              agronomistNotes: notes || d.agronomistNotes,
              updatedAt: new Date(),
            }
          : d
      ),
    }));
  },
  rejectDiagnosis: (id, notes) => {
    set((state) => ({
      diagnoses: state.diagnoses.map((d) =>
        d.id === id
          ? {
              ...d,
              status: 'REJECTED' as const,
              agronomistNotes: notes,
              updatedAt: new Date(),
            }
          : d
      ),
    }));
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
