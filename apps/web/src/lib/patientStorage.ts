
export type Patient = {
  id: number;
  name: string;
  email: string;
  phone: string;
  age: number;
  gender: string;
  address: string;
  bloodGroup: string;
};

export const initialPatients: Patient[] = [
  {
    id: 1,
    name: "Rahim Ahmed",
    email: "rahim@example.com",
    phone: "01712345678",
    age: 32,
    gender: "Male",
    address: "Narayanganj",
    bloodGroup: "A+",
  },
  {
    id: 2,
    name: "Nusrat Jahan",
    email: "nusrat@example.com",
    phone: "01812345678",
    age: 27,
    gender: "Female",
    address: "Dhaka",
    bloodGroup: "B+",
  },
  {
    id: 3,
    name: "Karim Uddin",
    email: "karim@example.com",
    phone: "01912345678",
    age: 45,
    gender: "Male",
    address: "Chashara",
    bloodGroup: "O+",
  },
  {
    id: 4,
    name: "Ayesha Akter",
    email: "ayesha@example.com",
    phone: "01612345678",
    age: 24,
    gender: "Female",
    address: "Fatullah",
    bloodGroup: "AB+",
  },
];

const STORAGE_KEY = "mediflow_patients";

export function getPatients(): Patient[] {
  const savedPatients = localStorage.getItem(STORAGE_KEY);

  if (savedPatients === null) {
    return initialPatients;
  }

  try {
    return JSON.parse(savedPatients) as Patient[];
  } catch {
    return initialPatients;
  }
}

export function savePatients(patients: Patient[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(patients));
}
