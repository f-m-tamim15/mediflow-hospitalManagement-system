
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { type Patient, getPatients } from "@/lib/patientStorage";

export default function PatientDetailsClient({
  patientId,
}: {
  patientId: number;
}) {
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const patients = getPatients();
    const selectedPatient = patients.find(
      (item) => item.id === patientId
    );

    setPatient(selectedPatient ?? null);
    setIsLoaded(true);
  }, [patientId]);

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        <p className="text-slate-500">Loading patient details...</p>
      </div>
    );
  }

  if (!patient) {
    return (
      <div className="flex min-h-screen bg-slate-100">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="rounded-xl bg-white p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-slate-800">
              Patient Not Found
            </h1>
            <p className="mt-2 text-slate-500">
              This patient does not exist or may have been deleted.
            </p>
            <Link
              href="/patients"
              className="mt-6 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
            >
              Back to Patients
            </Link>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <Link
          href="/patients"
          className="mb-6 inline-block text-sm font-medium text-blue-600 hover:text-blue-800"
        >
          ← Back to Patients
        </Link>

        <div className="rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="mb-8 border-b border-slate-200 pb-6">
            <p className="text-sm font-medium text-slate-500">
              Patient ID: PT-{String(patient.id).padStart(4, "0")}
            </p>
            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              {patient.name}
            </h1>
            <p className="mt-2 text-sm text-slate-500">
              Patient Profile
            </p>
          </div>

          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-1 font-medium text-slate-800">{patient.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="mt-1 font-medium text-slate-800">{patient.email}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Phone Number</p>
              <p className="mt-1 font-medium text-slate-800">{patient.phone}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Age</p>
              <p className="mt-1 font-medium text-slate-800">
                {patient.age} years
              </p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Gender</p>
              <p className="mt-1 font-medium text-slate-800">{patient.gender}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Blood Group</p>
              <p className="mt-1 font-medium text-slate-800">
                {patient.bloodGroup}
              </p>
            </div>

            <div className="sm:col-span-2">
              <p className="text-sm text-slate-500">Address</p>
              <p className="mt-1 font-medium text-slate-800">
                {patient.address}
              </p>
            </div>
          </div>

          <div className="mt-8 border-t border-slate-200 pt-6">
            <Link
              href="/patients"
              className="rounded-lg border border-slate-300 px-5 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Back to Patient List
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}
