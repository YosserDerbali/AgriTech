import { create } from 'zustand';
import { Diagnosis } from '../types/diagnosis';
import { createDiagnosis, getDiagnosisById, getMyDiagnoses } from '../services/farmerAPI';
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
  fetchDiagnoses: () => Promise<void>;
  addDiagnosis: (payload: { imageUrl: string; plantName: string; context?: string }) => Promise<void>;
  getDiagnosis: (id: string) => Diagnosis | undefined;
  getPendingDiagnoses: () => Diagnosis[];
  approveDiagnosis: (id: string, treatment: string, notes?: string) => void;
  rejectDiagnosis: (id: string, notes: string) => void;
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
    const diagnoses = data.map((d: any) => ({
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
    }));
    set({ diagnoses });
  } catch (err) {
    console.error('Failed to fetch diagnoses:', err);
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
