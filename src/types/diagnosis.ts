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

export interface DiagnosisRequest {
  imageFile: File;
  voiceNote?: Blob;
  plantContext?: string;
}

export interface AIAnalysisResult {
  diseaseName: string;
  confidence: number;
  plantName: string;
  suggestedTreatment: string;
}
