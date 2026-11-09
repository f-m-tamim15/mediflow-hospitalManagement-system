
export type PrescriptionMedicine = {
  id: number;
  medicineName: string;
  dosage: string;
  frequency: string;
  duration: string;
  instructions: string;
};

export type Prescription = {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  medicalRecordId: number | null;
  prescriptionDate: string;
  diagnosis: string;
  medicines: PrescriptionMedicine[];
  additionalInstructions: string;
  createdAt: string;
};

const STORAGE_KEY = "mediflow_prescriptions";

export function getPrescriptions(): Prescription[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as Prescription[];
  } catch {
    return [];
  }
}

export function savePrescriptions(prescriptions: Prescription[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(prescriptions)
  );
}
