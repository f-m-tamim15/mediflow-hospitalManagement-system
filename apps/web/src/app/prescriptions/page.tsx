
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import { getPatients, type Patient } from "@/lib/patientStorage";
import { getDoctors, type Doctor } from "@/lib/doctorStorage";
import {
  getMedicalRecords,
  type MedicalRecord,
} from "@/lib/medicalRecordStorage";
import {
  getPrescriptions,
  savePrescriptions,
  type Prescription,
  type PrescriptionMedicine,
} from "@/lib/prescriptionStorage";

const emptyMedicine = (): PrescriptionMedicine => ({
  id: 0,
  medicineName: "",
  dosage: "",
  frequency: "",
  duration: "",
  instructions: "",
});

export default function PrescriptionsPage() {
  const [prescriptions, setPrescriptions] = useState<Prescription[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [records, setRecords] = useState<MedicalRecord[]>([]);

  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Prescription | null>(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [todayDate, setTodayDate] = useState("");

  const [form, setForm] = useState({
    patientId: "",
    doctorId: "",
    medicalRecordId: "",
    prescriptionDate: "",
    diagnosis: "",
    additionalInstructions: "",
  });

  const [medicines, setMedicines] = useState<PrescriptionMedicine[]>([]);

 useEffect(() => {
  setPrescriptions(getPrescriptions());
  setPatients(getPatients());
  setDoctors(getDoctors());
  setRecords(getMedicalRecords());

  const today = new Date().toLocaleDateString("en-CA");
  setTodayDate(today);

  setForm((prev) => ({
    ...prev,
    prescriptionDate: today,
  }));

  // Initialize the first medicine after the component mounts
  setMedicines([
    {
      id: Date.now(),
      medicineName: "",
      dosage: "",
      frequency: "",
      duration: "",
      instructions: "",
    },
  ]);
}, []);
  function updateForm(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function updateMedicine(
    id: number,
    field: keyof PrescriptionMedicine,
    value: string
  ) {
    setMedicines((prev) =>
      prev.map((medicine) =>
        medicine.id === id
          ? { ...medicine, [field]: value }
          : medicine
      )
    );
  }

  function addMedicine() {
    setMedicines((prev) => [...prev, emptyMedicine()]);
  }

  function removeMedicine(id: number) {
    if (medicines.length === 1) {
      alert("A prescription must have at least one medicine.");
      return;
    }

    setMedicines((prev) =>
      prev.filter((medicine) => medicine.id !== id)
    );
  }

  function resetForm() {
    setForm({
      patientId: "",
      doctorId: "",
      medicalRecordId: "",
      prescriptionDate: todayDate,
      diagnosis: "",
      additionalInstructions: "",
    });

    setMedicines([emptyMedicine()]);
    setEditingId(null);
    setShowForm(false);
  }

  function handleMedicalRecordChange(recordId: string) {
    updateForm("medicalRecordId", recordId);

    if (!recordId) return;

    const record = records.find(
      (r) => r.id === Number(recordId)
    );

    if (!record) return;

    setForm((prev) => ({
      ...prev,
      medicalRecordId: recordId,
      patientId: String(record.patientId),
      doctorId: String(record.doctorId),
      diagnosis: record.diagnosis,
    }));
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

    const validMedicines = medicines.filter(
      (m) =>
        m.medicineName.trim() &&
        m.dosage.trim() &&
        m.frequency.trim() &&
        m.duration.trim()
    );

    if (validMedicines.length === 0) {
      alert("Please enter at least one complete medicine.");
      return;
    }

    const prescription: Prescription = {
      id: editingId ?? Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      medicalRecordId: form.medicalRecordId
        ? Number(form.medicalRecordId)
        : null,
      prescriptionDate: form.prescriptionDate,
      diagnosis: form.diagnosis.trim(),
      medicines: validMedicines,
      additionalInstructions: form.additionalInstructions.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = editingId
      ? prescriptions.map((p) =>
          p.id === editingId ? prescription : p
        )
      : [prescription, ...prescriptions];

    setPrescriptions(updated);
    savePrescriptions(updated);
    resetForm();
  }

  function editPrescription(prescription: Prescription) {
    setForm({
      patientId: String(prescription.patientId),
      doctorId: String(prescription.doctorId),
      medicalRecordId: prescription.medicalRecordId
        ? String(prescription.medicalRecordId)
        : "",
      prescriptionDate: prescription.prescriptionDate,
      diagnosis: prescription.diagnosis,
      additionalInstructions: prescription.additionalInstructions,
    });

    setMedicines(
      prescription.medicines.map((medicine) => ({ ...medicine }))
    );

    setEditingId(prescription.id);
    setViewing(null);
    setShowForm(true);
  }

  function deletePrescription(id: number) {
    if (!confirm("Are you sure you want to delete this prescription?")) {
      return;
    }

    const updated = prescriptions.filter((p) => p.id !== id);

    setPrescriptions(updated);
    savePrescriptions(updated);
    setViewing(null);
  }

  const filteredPrescriptions = prescriptions.filter((p) =>
    [
      p.patientName,
      p.doctorName,
      p.diagnosis,
      ...p.medicines.map((m) => m.medicineName),
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const todayCount = prescriptions.filter(
    (p) => p.prescriptionDate === todayDate
  ).length;

  const medicineCount = prescriptions.reduce(
    (total, p) => total + p.medicines.length,
    0
  );

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-7xl space-y-6">

          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-slate-800">
                Prescriptions
              </h1>
              <p className="mt-1 text-slate-500">
                Create and manage patient prescriptions.
              </p>
            </div>

            <button
              onClick={() => {
                setEditingId(null);
                setMedicines([emptyMedicine()]);
                setForm({
                  patientId: "",
                  doctorId: "",
                  medicalRecordId: "",
                  prescriptionDate: todayDate,
                  diagnosis: "",
                  additionalInstructions: "",
                });
                setShowForm(true);
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              + Create Prescription
            </button>
          </div>

          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <StatCard
              title="Total Prescriptions"
              value={prescriptions.length}
            />
            <StatCard
              title="Today's Prescriptions"
              value={todayCount}
            />
            <StatCard
              title="Total Medicine Entries"
              value={medicineCount}
            />
          </div>

          <div className="rounded-xl border border-slate-200 bg-white p-5">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient, doctor, diagnosis or medicine..."
              className="prescription-input"
            />
          </div>

          <div className="overflow-hidden rounded-xl border border-slate-200 bg-white">
            <div className="border-b border-slate-200 p-5">
              <h2 className="text-lg font-semibold text-slate-800">
                Prescription History
              </h2>
            </div>

            {filteredPrescriptions.length === 0 ? (
              <div className="p-12 text-center">
                <p className="font-medium text-slate-600">
                  No prescriptions found.
                </p>
                <p className="mt-1 text-sm text-slate-400">
                  Create a prescription to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="p-4">Patient</th>
                      <th className="p-4">Doctor</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Diagnosis</th>
                      <th className="p-4">Medicines</th>
                      <th className="p-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredPrescriptions.map((p) => (
                      <tr key={p.id}>
                        <td className="p-4 font-medium text-slate-800">
                          {p.patientName}
                        </td>
                        <td className="p-4 text-slate-600">
                          {p.doctorName}
                        </td>
                        <td className="p-4 text-slate-600">
                          {p.prescriptionDate}
                        </td>
                        <td className="p-4 text-slate-600">
                          {p.diagnosis || "—"}
                        </td>
                        <td className="p-4 text-slate-600">
                          {p.medicines.length}
                        </td>
                        <td className="p-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => setViewing(p)}
                              className="font-medium text-emerald-600 hover:underline"
                            >
                              View
                            </button>
                            <button
                              onClick={() => editPrescription(p)}
                              className="font-medium text-blue-600 hover:underline"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => deletePrescription(p.id)}
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
        </div>
      </main>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-3xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                {editingId ? "Edit Prescription" : "Create Prescription"}
              </h2>
              <button
                onClick={resetForm}
                className="text-2xl text-slate-400 hover:text-slate-700"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div className="grid gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Patient
                  </label>
                  <select
                    required
                    value={form.patientId}
                    onChange={(e) => updateForm("patientId", e.target.value)}
                    className="prescription-input"
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
                    Prescribing Doctor
                  </label>
                  <select
                    required
                    value={form.doctorId}
                    onChange={(e) => updateForm("doctorId", e.target.value)}
                    className="prescription-input"
                  >
                    <option value="">Select doctor</option>
                    {doctors.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.fullName}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Medical Record (Optional)
                  </label>
                  <select
                    value={form.medicalRecordId}
                    onChange={(e) =>
                      handleMedicalRecordChange(e.target.value)
                    }
                    className="prescription-input"
                  >
                    <option value="">No linked record</option>
                    {records.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.patientName} — {r.visitDate} — {r.diagnosis}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="mb-1 block text-sm font-medium">
                    Prescription Date
                  </label>
                  <input
                    type="date"
                    required
                    value={form.prescriptionDate}
                    onChange={(e) =>
                      updateForm("prescriptionDate", e.target.value)
                    }
                    className="prescription-input"
                  />
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Diagnosis
                </label>
                <textarea
                  rows={2}
                  value={form.diagnosis}
                  onChange={(e) => updateForm("diagnosis", e.target.value)}
                  className="prescription-input"
                  placeholder="Enter diagnosis"
                />
              </div>

              <div className="border-t border-slate-200 pt-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-lg font-semibold text-slate-800">
                    Medicines
                  </h3>
                  <button
                    type="button"
                    onClick={addMedicine}
                    className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700"
                  >
                    + Add Medicine
                  </button>
                </div>

                <div className="space-y-4">
                  {medicines.map((medicine, index) => (
                    <div
                      key={medicine.id}
                      className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                    >
                      <div className="mb-4 flex items-center justify-between">
                        <h4 className="font-semibold text-slate-700">
                          Medicine {index + 1}
                        </h4>
                        <button
                          type="button"
                          onClick={() => removeMedicine(medicine.id)}
                          className="text-sm font-medium text-red-600 hover:underline"
                        >
                          Remove
                        </button>
                      </div>

                      <div className="grid gap-4 md:grid-cols-2">
                        <Field
                          label="Medicine Name"
                          value={medicine.medicineName}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "medicineName", v)
                          }
                          placeholder="Medicine name"
                        />

                        <Field
                          label="Dosage"
                          value={medicine.dosage}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "dosage", v)
                          }
                          placeholder="e.g. 500 mg"
                        />

                        <Field
                          label="Frequency"
                          value={medicine.frequency}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "frequency", v)
                          }
                          placeholder="e.g. As prescribed"
                        />

                        <Field
                          label="Duration"
                          value={medicine.duration}
                          onChange={(v) =>
                            updateMedicine(medicine.id, "duration", v)
                          }
                          placeholder="e.g. 5 days"
                        />

                        <div className="md:col-span-2">
                          <Field
                            label="Medicine Instructions"
                            value={medicine.instructions}
                            onChange={(v) =>
                              updateMedicine(medicine.id, "instructions", v)
                            }
                            placeholder="e.g. Take with food (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Additional Instructions
                </label>
                <textarea
                  rows={3}
                  value={form.additionalInstructions}
                  onChange={(e) =>
                    updateForm("additionalInstructions", e.target.value)
                  }
                  className="prescription-input"
                  placeholder="Follow-up advice or additional instructions"
                />
              </div>

              <div className="flex justify-end gap-3 border-t border-slate-200 pt-4">
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
                  Save Prescription
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {viewing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-black/50 p-4">
          <div className="my-8 w-full max-w-2xl rounded-2xl bg-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-800">
                Prescription Details
              </h2>
              <button
                onClick={() => setViewing(null)}
                className="text-2xl text-slate-400"
              >
                ×
              </button>
            </div>

            <div className="grid gap-3 border-b border-slate-200 pb-5 sm:grid-cols-2">
              <Detail label="Patient" value={viewing.patientName} />
              <Detail label="Doctor" value={viewing.doctorName} />
              <Detail label="Date" value={viewing.prescriptionDate} />
              <Detail label="Diagnosis" value={viewing.diagnosis || "—"} />
            </div>

            <h3 className="mb-3 mt-5 font-semibold text-slate-800">
              Prescribed Medicines
            </h3>

            <div className="space-y-3">
              {viewing.medicines.map((medicine, index) => (
                <div
                  key={medicine.id}
                  className="rounded-lg border border-slate-200 p-4"
                >
                  <p className="font-semibold text-slate-800">
                    {index + 1}. {medicine.medicineName}
                  </p>
                  <p className="mt-2 text-sm text-slate-600">
                    Dosage: {medicine.dosage}
                  </p>
                  <p className="text-sm text-slate-600">
                    Frequency: {medicine.frequency}
                  </p>
                  <p className="text-sm text-slate-600">
                    Duration: {medicine.duration}
                  </p>
                  {medicine.instructions && (
                    <p className="mt-2 text-sm text-slate-600">
                      Instructions: {medicine.instructions}
                    </p>
                  )}
                </div>
              ))}
            </div>

            {viewing.additionalInstructions && (
              <div className="mt-5 rounded-lg bg-slate-50 p-4">
                <p className="font-semibold text-slate-700">
                  Additional Instructions
                </p>
                <p className="mt-1 text-sm text-slate-600">
                  {viewing.additionalInstructions}
                </p>
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => setViewing(null)}
                className="rounded-lg bg-slate-800 px-5 py-2.5 font-semibold text-white"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
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

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        required
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="prescription-input"
      />
    </div>
  );
}

function Detail({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-slate-500">{label}</p>
      <p className="mt-1 font-medium text-slate-800">{value}</p>
    </div>
  );
}
