
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import {
  type Patient,
  getPatients,
  savePatients,
} from "@/lib/patientStorage";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  age: "",
  gender: "",
  address: "",
  bloodGroup: "",
};

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Load saved patients when the page opens.
  useEffect(() => {
    const savedPatients = getPatients();
    setPatients(savedPatients);
    setIsLoaded(true);
  }, []);

  // Save patients whenever the list changes.
  useEffect(() => {
    if (isLoaded) {
      savePatients(patients);
    }
  }, [patients, isLoaded]);

  // Search patients by name, email, or phone.
  const results = patients.filter((patient) => {
    const searchTerm = search.toLowerCase().trim();

    return (
      patient.name.toLowerCase().includes(searchTerm) ||
      patient.email.toLowerCase().includes(searchTerm) ||
      patient.phone.includes(searchTerm)
    );
  });

  function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (editingId !== null) {
      setPatients((currentPatients) =>
        currentPatients.map((patient) =>
          patient.id === editingId
            ? {
                ...patient,
                name: formData.name.trim(),
                email: formData.email.trim(),
                phone: formData.phone.trim(),
                age: Number(formData.age),
                gender: formData.gender,
                address: formData.address.trim(),
                bloodGroup: formData.bloodGroup,
              }
            : patient
        )
      );
    } else {
      const newPatient: Patient = {
        id: Math.max(0, ...patients.map((patient) => patient.id)) + 1,
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        age: Number(formData.age),
        gender: formData.gender,
        address: formData.address.trim(),
        bloodGroup: formData.bloodGroup,
      };

      setPatients((currentPatients) => [
        ...currentPatients,
        newPatient,
      ]);
    }

    closeForm();
  }

  function handleEdit(patient: Patient) {
    setFormData({
      name: patient.name,
      email: patient.email,
      phone: patient.phone,
      age: String(patient.age),
      gender: patient.gender,
      address: patient.address,
      bloodGroup: patient.bloodGroup,
    });

    setEditingId(patient.id);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this patient?"
    );

    if (!confirmed) return;

    setPatients((currentPatients) =>
      currentPatients.filter((patient) => patient.id !== id)
    );
  }

  function closeForm() {
    setFormData(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <h1 className="text-3xl font-bold text-slate-800">
          Patients
        </h1>

        <p className="mb-8 mt-2 text-slate-500">
          Manage and view registered patients.
        </p>

        <div className="rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Patient List
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                {results.length} patients found
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="search"
                placeholder="Search patients..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-lg border border-slate-300 px-4 py-3 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 sm:max-w-sm"
              />

              <button
                type="button"
                onClick={() => {
                  setFormData(emptyForm);
                  setEditingId(null);
                  setShowForm(true);
                }}
                className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
              >
                + Add Patient
              </button>
            </div>
          </div>

          {showForm && (
            <form
              onSubmit={handleSubmit}
              className="mb-8 rounded-xl border border-slate-200 bg-slate-50 p-5"
            >
              <h3 className="mb-5 text-lg font-semibold text-slate-800">
                {editingId !== null
                  ? "Edit Patient"
                  : "Add New Patient"}
              </h3>

              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Full Name
                  </label>
                  <input
                    required
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    placeholder="Enter full name"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    placeholder="patient@example.com"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Phone
                  </label>
                  <input
                    required
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    placeholder="Enter phone number"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Age
                  </label>
                  <input
                    required
                    type="number"
                    min="0"
                    max="120"
                    value={formData.age}
                    onChange={(e) =>
                      setFormData({ ...formData, age: e.target.value })
                    }
                    placeholder="Enter age"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Gender
                  </label>
                  <select
                    required
                    value={formData.gender}
                    onChange={(e) =>
                      setFormData({ ...formData, gender: e.target.value })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Blood Group
                  </label>
                  <select
                    required
                    value={formData.bloodGroup}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        bloodGroup: e.target.value,
                      })
                    }
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  >
                    <option value="">Select blood group</option>
                    <option value="A+">A+</option>
                    <option value="A-">A-</option>
                    <option value="B+">B+</option>
                    <option value="B-">B-</option>
                    <option value="O+">O+</option>
                    <option value="O-">O-</option>
                    <option value="AB+">AB+</option>
                    <option value="AB-">AB-</option>
                    <option value="Unknown">Unknown</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-slate-700">
                    Address
                  </label>
                  <textarea
                    required
                    rows={2}
                    value={formData.address}
                    onChange={(e) =>
                      setFormData({ ...formData, address: e.target.value })
                    }
                    placeholder="Enter patient's address"
                    className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-3">
                <button
                  type="submit"
                  className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700"
                >
                  {editingId !== null
                    ? "Update Patient"
                    : "Save Patient"}
                </button>

                <button
                  type="button"
                  onClick={closeForm}
                  className="rounded-lg border border-slate-300 bg-white px-5 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-100"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Phone</th>
                  <th className="p-4">Age</th>
                  <th className="p-4">Gender</th>
                  <th className="p-4">Blood Group</th>
                  <th className="p-4">Actions</th>
                </tr>
              </thead>

              <tbody>
                {results.map((patient) => (
                  <tr
                    key={patient.id}
                    className="border-b text-slate-700 last:border-0 hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">{patient.name}</td>
                    <td className="p-4">{patient.email}</td>
                    <td className="p-4">{patient.phone}</td>
                    <td className="p-4">{patient.age}</td>
                    <td className="p-4">{patient.gender}</td>
                    <td className="p-4">{patient.bloodGroup}</td>
                    <td className="p-4">
                      <div className="flex gap-2">
                        <Link
                          href={`/patients/${patient.id}`}
                          className="rounded-md bg-green-50 px-3 py-1.5 text-xs font-medium text-green-700 hover:bg-green-100"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => handleEdit(patient)}
                          className="rounded-md bg-blue-50 px-3 py-1.5 text-xs font-medium text-blue-700 hover:bg-blue-100"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDelete(patient.id)}
                          className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-700 hover:bg-red-100"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {results.length === 0 && (
                  <tr>
                    <td
                      colSpan={7}
                      className="p-8 text-center text-slate-500"
                    >
                      No patients found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
}
