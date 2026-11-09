
export type Department = {
  id: number;
  name: string;
  description: string;
  location: string;
  headOfDepartment: string;
  phone: string;
  status: "Active" | "Inactive";
  createdAt: string;
};

const STORAGE_KEY = "mediflow_departments";

export function getDepartments(): Department[] {
  if (typeof window === "undefined") return [];

  const saved = localStorage.getItem(STORAGE_KEY);

  if (!saved) return [];

  try {
    return JSON.parse(saved) as Department[];
  } catch {
    return [];
  }
}

export function saveDepartments(departments: Department[]) {
  if (typeof window === "undefined") return;

  localStorage.setItem(STORAGE_KEY, JSON.stringify(departments));
}
