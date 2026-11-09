
export type AppointmentStatus =
  | "Scheduled"
  | "Confirmed"
  | "In Consultation"
  | "Completed"
  | "Cancelled";

export type Appointment = {
  id: number;
  patientId: number;
  patientName: string;
  doctorId: number;
  doctorName: string;
  department: string;
  date: string;
  time: string;
  reason: string;
  notes: string;
  consultationFee: number;
  status: AppointmentStatus;
  createdAt: string;
};

const STORAGE_KEY = "mediflow_appointments";

export function getAppointments(): Appointment[] {
  if (typeof window === "undefined") return [];

  const savedAppointments = localStorage.getItem(STORAGE_KEY);

  if (savedAppointments === null) return [];

  try {
    return JSON.parse(savedAppointments) as Appointment[];
  } catch {
    return [];
  }
}

export function saveAppointments(appointments: Appointment[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(appointments)
  );
}
