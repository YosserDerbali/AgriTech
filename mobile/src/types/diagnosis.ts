export type DiagnosisStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Diagnosis {
  id: string;
  imageId?: string | null;
  plantId?: number | null;
  diseaseId?: number | null;
  imageUrl: string;
  plantName: string;
  diseaseName: string | null;
  symptoms?: string | null;
  confidence: number | null;
  status: DiagnosisStatus;
  treatment: string | null;
  createdAt: Date;
  updatedAt: Date;
  agronomistNotes: string | null;
}
