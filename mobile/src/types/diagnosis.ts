export type DiagnosisStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface Diagnosis {
  id: string;
  imageUrl: string;
  plantName: string;
  diseaseName: string | null;
  confidence: number | null;
  status: DiagnosisStatus;
  treatment: string | null;
  createdAt: Date;
  updatedAt: Date;
  agronomistNotes: string | null;
}
