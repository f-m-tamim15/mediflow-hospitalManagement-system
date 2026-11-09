
"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

import {
  getAppointments,
  saveAppointments,
  type Appointment,
  type AppointmentStatus,
} from "@/lib/appointmentStorage";

import {
  getPatients,
  type Patient,
} from "@/lib/patientStorage";

import {
  getDoctors,
  type Doctor,
} from "@/lib/doctorStorage";

const statuses: AppointmentStatus[] = [
  "Scheduled",
  "Confirmed",
  "In Consultation",
  "Completed",
  "Cancelled",
];

function getTodayDate() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function formatDate(date: string) {
  if (!date) return "-";

  return new Date(`${date}T00:00:00`).toLocaleDateString(
    "en-US",
    {
      year: "numeric",
      month: "short",
      day: "numeric",
    }
  );
}

function getStatusStyle(status: AppointmentStatus) {
  switch (status) {
    case "Scheduled":
      return "bg-blue-100 text-blue-700";
    case "Confirmed":
      return "bg-green-100 text-green-700";
    case "In Consultation":
      return "bg-purple-100 text-purple-700";
    case "Completed":
      return "bg-slate-200 text-slate-700";
    case "Cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}

export default function AppointmentsPage() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [doctors, setDoctors] = useState<Doctor[]>([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);

  const [patientId, setPatientId] = useState("");
  const [doctorId, setDoctorId] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("09:00");
  const [reason, setReason] = useState("");
  const [notes, setNotes] = useState("");

 useEffect(() => {
  const today = getTodayDate();

  setDate(today);
  setAppointments(getAppointments());
  setPatients(getPatients());
  setDoctors(getDoctors());
}, []);

  const updateAppointments = (updated: Appointment[]) => {
    setAppointments(updated);
    saveAppointments(updated);
  };

  const selectedDoctor = doctors.find(
    (doctor) => doctor.id === Number(doctorId)
  );

  const filteredAppointments = useMemo(() => {
    return appointments
      .filter((appointment) => {
        const searchText = search.toLowerCase();

        const matchesSearch =
          appointment.patientName.toLowerCase().includes(searchText) ||
          appointment.doctorName.toLowerCase().includes(searchText) ||
          appointment.reason.toLowerCase().includes(searchText);

        const matchesStatus =
          statusFilter === "All" ||
          appointment.status === statusFilter;

        return matchesSearch && matchesStatus;
      })
      .sort((a, b) => {
        return (
          new Date(`${a.date}T${a.time}`).getTime() -
          new Date(`${b.date}T${b.time}`).getTime()
        );
      });
  }, [appointments, search, statusFilter]);

  const todayAppointments = appointments.filter(
    (appointment) =>
      appointment.date === getTodayDate() &&
      appointment.status !== "Cancelled"
  ).length;

  const scheduledAppointments = appointments.filter(
    (appointment) => appointment.status === "Scheduled"
  ).length;

  const completedAppointments = appointments.filter(
    (appointment) => appointment.status === "Completed"
  ).length;

  const inConsultationAppointments = appointments.filter(
    (appointment) => appointment.status === "In Consultation"
  ).length;

  function handleCreateAppointment(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const patient = patients.find(
      (item) => item.id === Number(patientId)
    );

    const doctor = doctors.find(
      (item) => item.id === Number(doctorId)
    );

    if (!patient || !doctor) {
      alert("Please select a valid patient and doctor.");
      return;
    }

    if (!doctor.acceptingAppointments) {
      alert("This doctor is currently not accepting appointments.");
      return;
    }

    const appointmentDateTime = new Date(`${date}T${time}`);

    if (appointmentDateTime.getTime() < Date.now()) {
      alert("Please select a future appointment date and time.");
      return;
    }

    const newAppointment: Appointment = {
      id: Date.now(),
      patientId: patient.id,
      patientName: patient.name,
      doctorId: doctor.id,
      doctorName: doctor.fullName,
      department: doctor.department,
      date,
      time,
      reason: reason.trim(),
      notes: notes.trim(),
      consultationFee: doctor.consultationFee,
      status: "Scheduled",
      createdAt: new Date().toISOString(),
    };

    updateAppointments([...appointments, newAppointment]);

    setPatientId("");
    setDoctorId("");
    setDate(getTodayDate());
    setTime("09:00");
    setReason("");
    setNotes("");
    setShowForm(false);

    alert("Appointment created successfully!");
  }

  function handleStatusChange(
    appointmentId: number,
    newStatus: AppointmentStatus
  ) {
    const updated = appointments.map((appointment) =>
      appointment.id === appointmentId
        ? { ...appointment, status: newStatus }
        : appointment
    );

    updateAppointments(updated);
  }

  function handleDeleteAppointment(id: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmed) return;

    updateAppointments(
      appointments.filter((appointment) => appointment.id !== id)
    );
  }

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">

          {/* Header */}
          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Appointment Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage patient appointments, schedules and consultation status.
              </p>
            </div>

            <button
              onClick={() => setShowForm(!showForm)}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              {showForm ? "Close Form" : "+ New Appointment"}
            </button>
          </div>

          {/* Statistics */}
          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
            <StatCard
              title="Today's Appointments"
              value={todayAppointments}
              color="blue"
            />
            <StatCard
              title="Scheduled"
              value={scheduledAppointments}
              color="amber"
            />
            <StatCard
              title="In Consultation"
              value={inConsultationAppointments}
              color="purple"
            />
            <StatCard
              title="Completed"
              value={completedAppointments}
              color="green"
            />
          </div>

          {/* Create Appointment Form */}
          {showForm && (
            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                Create New Appointment
              </h2>

              {patients.length === 0 || doctors.length === 0 ? (
                <div className="rounded-lg bg-amber-50 p-5 text-sm text-amber-800">
                  <p className="font-semibold">
                    Patient or doctor records are missing.
                  </p>

                  <p className="mt-2">
                    Add at least one patient and one doctor before booking.
                  </p>

                  <div className="mt-4 flex flex-wrap gap-3">
                    <Link
                      href="/patients"
                      className="font-semibold underline"
                    >
                      Manage Patients
                    </Link>

                    <Link
                      href="/admin/doctors"
                      className="font-semibold underline"
                    >
                      Manage Doctors
                    </Link>
                  </div>
                </div>
              ) : (
                <form
                  onSubmit={handleCreateAppointment}
                  className="grid grid-cols-1 gap-5 md:grid-cols-2"
                >
                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Patient *
                    </label>

                    <select
                      required
                      value={patientId}
                      onChange={(event) => setPatientId(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="">Choose a patient</option>

                      {patients.map((patient) => (
                        <option key={patient.id} value={patient.id}>
                          {patient.name} — {patient.phone}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Select Doctor *
                    </label>

                    <select
                      required
                      value={doctorId}
                      onChange={(event) => setDoctorId(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    >
                      <option value="">Choose a doctor</option>

                      {doctors.map((doctor) => (
                        <option
                          key={doctor.id}
                          value={doctor.id}
                          disabled={!doctor.acceptingAppointments}
                        >
                          {doctor.fullName} — {doctor.specialization}
                          {!doctor.acceptingAppointments
                            ? " (Not accepting appointments)"
                            : ""}
                        </option>
                      ))}
                    </select>

                    {selectedDoctor && (
                      <p className="mt-2 text-sm text-slate-500">
                        Consultation fee: ৳
                        {selectedDoctor.consultationFee}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Appointment Date *
                    </label>

                    <input
                      required
                      type="date"
                      min={getTodayDate()}
                      value={date}
                      onChange={(event) => setDate(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div>
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Appointment Time *
                    </label>

                    <input
                      required
                      type="time"
                      value={time}
                      onChange={(event) => setTime(event.target.value)}
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Reason for Visit *
                    </label>

                    <input
                      required
                      value={reason}
                      onChange={(event) => setReason(event.target.value)}
                      placeholder="e.g. Fever, regular checkup, headache..."
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="mb-2 block text-sm font-medium text-slate-700">
                      Additional Notes
                    </label>

                    <textarea
                      rows={3}
                      value={notes}
                      onChange={(event) => setNotes(event.target.value)}
                      placeholder="Optional notes for the doctor..."
                      className="w-full rounded-lg border border-slate-300 px-4 py-3 outline-none focus:border-blue-500"
                    />
                  </div>

                  <div className="flex flex-wrap gap-3 md:col-span-2">
                    <button
                      type="submit"
                      className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                    >
                      Create Appointment
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowForm(false)}
                      className="rounded-lg border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              )}
            </section>
          )}

          {/* Appointment List */}
          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 lg:flex-row lg:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  All Appointments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredAppointments.length} appointment(s) found
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search patient, doctor..."
                  className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                />

                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                  className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
                >
                  <option value="All">All Statuses</option>

                  {statuses.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {filteredAppointments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-3 text-4xl">📅</div>

                <h3 className="font-semibold text-slate-800">
                  No appointments found
                </h3>

                <p className="mt-2 text-sm text-slate-500">
                  Create a new appointment or change your search filters.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[1000px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Patient</th>
                      <th className="px-5 py-4">Doctor</th>
                      <th className="px-5 py-4">Date & Time</th>
                      <th className="px-5 py-4">Reason</th>
                      <th className="px-5 py-4">Fee</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredAppointments.map((appointment) => (
                      <tr
                        key={appointment.id}
                        className="hover:bg-slate-50"
                      >
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {appointment.patientName}
                          </p>
                          <p className="text-xs text-slate-500">
                            ID: {appointment.patientId}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="font-medium text-slate-800">
                            {appointment.doctorName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {appointment.department}
                          </p>
                        </td>

                        <td className="px-5 py-4">
                          <p className="text-sm font-medium text-slate-800">
                            {formatDate(appointment.date)}
                          </p>
                          <p className="text-xs text-slate-500">
                            {appointment.time}
                          </p>
                        </td>

                        <td className="max-w-[180px] px-5 py-4">
                          <p className="truncate text-sm text-slate-700">
                            {appointment.reason}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm font-medium text-slate-700">
                          ৳{appointment.consultationFee}
                        </td>

                        <td className="px-5 py-4">
                          <select
                            value={appointment.status}
                            onChange={(event) =>
                              handleStatusChange(
                                appointment.id,
                                event.target.value as AppointmentStatus
                              )
                            }
                            className={`rounded-full px-3 py-2 text-xs font-semibold outline-none ${getStatusStyle(
                              appointment.status
                            )}`}
                          >
                            {statuses.map((status) => (
                              <option key={status} value={status}>
                                {status}
                              </option>
                            ))}
                          </select>
                        </td>

                        <td className="px-5 py-4">
                          <button
                            onClick={() =>
                              handleDeleteAppointment(appointment.id)
                            }
                            className="text-sm font-medium text-red-600 hover:text-red-800"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <p className="mt-5 text-xs text-slate-400">
            MediFlow frontend prototype. Appointment information is currently
            stored in this browser's localStorage, not a hospital database.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({
  title,
  value,
  color,
}: {
  title: string;
  value: number;
  color: "blue" | "amber" | "purple" | "green";
}) {
  const colorClasses = {
    blue: "border-blue-500",
    amber: "border-amber-500",
    purple: "border-purple-500",
    green: "border-green-500",
  };

  return (
    <div
      className={`rounded-xl border-l-4 ${colorClasses[color]} bg-white p-5 shadow-sm`}
    >
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}
