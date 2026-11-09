export type DoctorEducation = {
  id: number;
  degree: string;
  institution: string;
  graduationYear: number;
  verified: boolean;
};

export type DoctorWorkplace = {
  id: number;
  hospital: string;
  department: string;
  position: string;
  employmentType: "Full-time" | "Part-time" | "Visiting";
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
};

export type DoctorTeachingPosition = {
  id: number;
  institution: string;
  department: string;
  academicTitle: string;
  startDate: string;
  endDate: string | null;
  isCurrent: boolean;
};

export type DoctorAchievement = {
  id: number;
  title: string;
  description: string;
  year: number;
  type: "Award" | "Certification" | "Publication" | "Research";
  verified: boolean;
};

export type DoctorAvailability = {
  id: number;
  day: string;
  startTime: string;
  endTime: string;
};

export type Doctor = {
  id: number;

  // Personal information
  fullName: string;
  email: string;
  phone: string;
  gender: string;
  dateOfBirth: string;
  address: string;
  profilePhoto: string;

  // Professional information
  specialization: string;
  department: string;
  designation: string;
  bmdcRegistration: string;
  yearsOfExperience: number;

  // Multiple records
  education: DoctorEducation[];
  workplaces: DoctorWorkplace[];
  teachingPositions: DoctorTeachingPosition[];
  achievements: DoctorAchievement[];
  availability: DoctorAvailability[];

  // Appointment information
  consultationFee: number;
  acceptingAppointments: boolean;

  // Profile verification
  profileVerified: boolean;
};

export const initialDoctors: Doctor[] = [];

const STORAGE_KEY = "mediflow_doctors";

export function getDoctors(): Doctor[] {
  const savedDoctors = localStorage.getItem(STORAGE_KEY);

  if (savedDoctors === null) {
    return initialDoctors;
  }

  try {
    return JSON.parse(savedDoctors) as Doctor[];
  } catch {
    return initialDoctors;
  }
}

export function saveDoctors(doctors: Doctor[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(doctors));
}