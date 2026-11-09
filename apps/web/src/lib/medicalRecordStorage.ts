
export type MedicalRecord = {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  visitDate: string;
  symptoms: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  createdAt: string;
};

const STORAGE_KEY = "mediflow_medical_records";

export function getMedicalRecords(): MedicalRecord[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as MedicalRecord[];
  } catch {
    return [];
  }
}

export function saveMedicalRecords(records: MedicalRecord[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
}
