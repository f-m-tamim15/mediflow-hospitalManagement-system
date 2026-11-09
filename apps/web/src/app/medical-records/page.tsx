
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getPatients, type Patient } from "@/lib/patientStorage";
import { getDoctors, type Doctor } from "@/lib/doctorStorage";
import {
  getMedicalRecords,
  saveMedicalRecords,
  type MedicalRecord,
} from "@/lib/medicalRecordStorage";

export default function MedicalRecordsPage() {
  const [records, setRecords] = useState<MedicalRecord[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [todayDate, setTodayDate] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    visitDate: "",
    symptoms: "",
    diagnosis: "",
    treatment: "",
    notes: "",
  });

  useEffect(() => {
    setRecords(getMedicalRecords());
    setPatients(getPatients());
    setDoctors(getDoctors());
    setTodayDate(new Date().toLocaleDateString("en-CA"));
    setForm((prev) => ({
      ...prev,
      visitDate: new Date().toLocaleDateString("en-CA"),
    }));
  }, []);

  function updateForm(
    field: keyof typeof form,
    value: string
  ) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function resetForm() {
    setForm({
      patientId: "",
      doctorId: "",
      visitDate: new Date().toLocaleDateString("en-CA"),
      symptoms: "",
      diagnosis: "",
      treatment: "",
      notes: "",
    });
    setEditingId(null);
    setShowForm(false);
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const patient = patients.find(
      (p) => p.id === Number(form.patientId)
    );
    const doctor = doctors.find(
      (d) => d.id === Number(form.doctorId)
    );

    if (!patient || !doctor) {
      alert("Please select a valid patient and doctor.");
      return;
    }

    const record: MedicalRecord = {
      id: editingId ?? Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      visitDate: form.visitDate,
      symptoms: form.symptoms.trim(),
      diagnosis: form.diagnosis.trim(),
      treatment: form.treatment.trim(),
      notes: form.notes.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = editingId
      ? records.map((r) => (r.id === editingId ? record : r))
      : [record, ...records];

    setRecords(updated);
    saveMedicalRecords(updated);
    resetForm();
  }

  function editRecord(record: MedicalRecord) {
    setForm({
      patientId: String(record.patientId),
      doctorId: String(record.doctorId),
      visitDate: record.visitDate,
      symptoms: record.symptoms,
      diagnosis: record.diagnosis,
      treatment: record.treatment,
      notes: record.notes,
    });
    setEditingId(record.id);
    setShowForm(true);
  }

  function deleteRecord(id: number) {
    if (!confirm("Are you sure you want to delete this medical record?")) {
      return;
    }

    const updated = records.filter((r) => r.id !== id);
    setRecords(updated);
    saveMedicalRecords(updated);
  }

  const filteredRecords = records.filter((record) =>
    [
      record.patientName,
      record.doctorName,
      record.diagnosis,
      record.symptoms,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const uniquePatients = new Set(
    records.map((r) => r.patientId)
  ).size;

  const todayRecords = records.filter(
    (r) => r.visitDate === todayDate
  ).length;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Medical Records
              </h1>
              <p className="mt-1 text-slate-500">
                Manage patient consultation and medical history.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setForm({
                  patientId: "",
                  doctorId: "",
                  visitDate: todayDate,
                  symptoms: "",
                  diagnosis: "",
                  treatment: "",
                  notes: "",
                });
                setShowForm(true);
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Add Medical Record
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard title="Total Records" value={records.length} />
            <StatCard title="Patients with Records" value={uniquePatients} />
            <StatCard title="Today's Records" value={todayRecords} />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor, diagnosis..."
              className="record-input"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Patient Medical History
              </h2>
            </div>

            {filteredRecords.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-medium text-slate-600">
                  No medical records found.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Add a medical record to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Visit Date</th>
                      <th className="p-4">Diagnosis</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredRecords.map((record) => (
                      <tr key={record.id}>
                        <td className="p-4 font-medium text-slate-800">
                          {record.patientName}
                        </td>
                        <td className="p-4 text-slate-600">
                          {record.doctorName}
                        </td>
                        <td className="p-4 text-slate-600">
                          {record.visitDate}
                        </td>
                        <td className="p-4 text-slate-600">
                          {record.diagnosis}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => editRecord(record)}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deleteRecord(record.id)}
                              className="font-medium text-red-600 hover:underline"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {showForm && (
            <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
              <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
                <div className="mb-6 flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-800">
                    {editingId ? "Edit Medical Record" : "Add Medical Record"}
                  </h2>
                  <button
                    onClick={resetForm}
                    className="text-2xl text-slate-400 hover:text-slate-700"
                  >
                    ×
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Patient
                      </label>
                      <select
                        required
                        value={form.patientId}
                        onChange={(e) => updateForm("patientId", e.target.value)}
                        className="record-input"
                      >
                        <option value="">Select patient</option>
                        {patients.map((p) => (
                          <option key={p.id} value={p.id}>
                            {p.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="mb-1 block text-sm font-medium">
                        Doctor
                      </label>
                      <select
                        required
                        value={form.doctorId}
                        onChange={(e) => updateForm("doctorId", e.target.value)}
                        className="record-input"
                      >
                        <option value="">Select doctor</option>
                        {doctors.map((d) => (
                          <option key={d.id} value={d.id}>
                            {d.fullName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Visit Date
                    </label>
                    <input
                      type="date"
                      required
                      value={form.visitDate}
                      onChange={(e) => updateForm("visitDate", e.target.value)}
                      className="record-input"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Symptoms
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={form.symptoms}
                      onChange={(e) => updateForm("symptoms", e.target.value)}
                      className="record-input"
                      placeholder="Describe patient's symptoms"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Diagnosis
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={form.diagnosis}
                      onChange={(e) => updateForm("diagnosis", e.target.value)}
                      className="record-input"
                      placeholder="Doctor's diagnosis"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Treatment
                    </label>
                    <textarea
                      required
                      rows={2}
                      value={form.treatment}
                      onChange={(e) => updateForm("treatment", e.target.value)}
                      className="record-input"
                      placeholder="Treatment or advice"
                    />
                  </div>

                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Additional Notes
                    </label>
                    <textarea
                      rows={2}
                      value={form.notes}
                      onChange={(e) => updateForm("notes", e.target.value)}
                      className="record-input"
                      placeholder="Optional notes"
                    />
                  </div>

                  <div className="flex justify-end gap-3 pt-3">
                    <button
                      type="button"
                      onClick={resetForm}
                      className="rounded-lg border border-slate-300 px-5 py-2.5"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-5 py-2.5 font-semibold text-white hover:bg-blue-700"
                    >
                      Save Record
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
}: {
  title: string;
  value: number;
}) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-800">{value}</p>
    </div>
  );
}
