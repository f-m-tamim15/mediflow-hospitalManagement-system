
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Sidebar from "@/components/Sidebar";
import {
  type Doctor,
  type DoctorEducation,
  getDoctors,
  saveDoctors,
} from "@/lib/doctorStorage";

export default function AdminDoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showForm, setShowForm] = useState(false);

  const [educationDoctorId, setEducationDoctorId] = useState<number | null>(
    null
  );

  const [editingEducation, setEditingEducation] = useState<{
    doctorId: number;
    education: DoctorEducation;
  } | null>(null);

  useEffect(() => {
    setDoctors(getDoctors());
    setIsLoaded(true);
  }, []);

  function updateDoctors(updatedDoctors: Doctor[]) {
    setDoctors(updatedDoctors);
    saveDoctors(updatedDoctors);
  }

  function handleAddDoctor(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const newDoctor: Doctor = {
      id: Date.now(),
      fullName: String(formData.get("fullName")).trim(),
      email: String(formData.get("email")).trim(),
      phone: String(formData.get("phone")).trim(),
      gender: String(formData.get("gender")),
      dateOfBirth: String(formData.get("dateOfBirth")),
      address: String(formData.get("address")).trim(),
      profilePhoto: "",

      specialization: String(formData.get("specialization")),
      department: String(formData.get("department")),
      designation: String(formData.get("designation")),
      bmdcRegistration: String(formData.get("bmdcRegistration")).trim(),
      yearsOfExperience: 0,

      education: [],
      workplaces: [],
      teachingPositions: [],
      achievements: [],
      availability: [],

      consultationFee: Number(formData.get("consultationFee")),
      acceptingAppointments:
        formData.get("acceptingAppointments") === "on",
      profileVerified: false,
    };

    updateDoctors([...doctors, newDoctor]);
    event.currentTarget.reset();
    setShowForm(false);
  }

  function handleSaveEducation(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const doctorId = Number(formData.get("doctorId"));
    const educationId = Number(formData.get("educationId"));

    const newEducation: DoctorEducation = {
      id: educationId || Date.now(),
      degree: String(formData.get("degree")).trim(),
      institution: String(formData.get("institution")).trim(),
      graduationYear: Number(formData.get("graduationYear")),
      verified: editingEducation?.education.verified ?? false,
    };

    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id !== doctorId) return doctor;

      const updatedEducation = editingEducation
        ? doctor.education.map((item) =>
            item.id === educationId ? newEducation : item
          )
        : [...doctor.education, newEducation];

      return {
        ...doctor,
        education: updatedEducation,
      };
    });

    updateDoctors(updatedDoctors);
    setEditingEducation(null);
    setEducationDoctorId(null);
  }

  function handleVerifyEducation(doctorId: number, educationId: number) {
    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id !== doctorId) return doctor;

      return {
        ...doctor,
        education: doctor.education.map((item) =>
          item.id === educationId
            ? { ...item, verified: !item.verified }
            : item
        ),
      };
    });

    updateDoctors(updatedDoctors);
  }

  function handleDeleteEducation(doctorId: number, educationId: number) {
    const confirmed = window.confirm(
      "Are you sure you want to delete this qualification?"
    );

    if (!confirmed) return;

    const updatedDoctors = doctors.map((doctor) => {
      if (doctor.id !== doctorId) return doctor;

      return {
        ...doctor,
        education: doctor.education.filter(
          (item) => item.id !== educationId
        ),
      };
    });

    updateDoctors(updatedDoctors);
  }

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-100">
        Loading doctors...
      </div>
    );
  }

  const verifiedCount = doctors.filter(
    (doctor) => doctor.profileVerified
  ).length;

  const pendingCount = doctors.length - verifiedCount;

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm font-medium text-blue-600">
              Hospital Administration
            </p>

            <h1 className="mt-2 text-3xl font-bold text-slate-800">
              Doctor Management
            </h1>

            <p className="mt-2 text-slate-500">
              Manage doctor profiles and professional information.
            </p>
          </div>

          <button
            onClick={() => setShowForm(!showForm)}
            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
          >
            {showForm ? "Close Form" : "+ Add Doctor"}
          </button>
        </div>

        {/* Doctor statistics */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Total Doctors</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-800">
              {doctors.length}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">Verified Profiles</p>
            <h2 className="mt-2 text-3xl font-bold text-green-600">
              {verifiedCount}
            </h2>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-sm">
            <p className="text-sm text-slate-500">
              Pending Verification
            </p>
            <h2 className="mt-2 text-3xl font-bold text-orange-500">
              {pendingCount}
            </h2>
          </div>
        </div>

        {/* Add doctor form */}
        {showForm && (
          <div className="mt-8 rounded-xl bg-white p-6 shadow-sm md:p-8">
            <h2 className="mb-6 text-xl font-semibold text-slate-800">
              Add New Doctor
            </h2>

            <form onSubmit={handleAddDoctor}>
              <h3 className="mb-4 font-semibold text-slate-700">
                Personal Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Full Name *
                  </label>
                  <input name="fullName" required placeholder="Dr. John Smith"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Email *
                  </label>
                  <input name="email" type="email" required
                    placeholder="doctor@example.com"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Phone *
                  </label>
                  <input name="phone" required placeholder="01XXXXXXXXX"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Gender *
                  </label>
                  <select name="gender" required defaultValue=""
                    className="w-full rounded-lg border border-slate-300 px-4 py-3">
                    <option value="" disabled>Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Date of Birth *
                  </label>
                  <input name="dateOfBirth" type="date" required
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Address *
                  </label>
                  <input name="address" required placeholder="Doctor's address"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>
              </div>

              <h3 className="mb-4 mt-8 font-semibold text-slate-700">
                Professional Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Specialization *
                  </label>
                  <input name="specialization" required placeholder="Cardiology"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Department *
                  </label>
                  <input name="department" required placeholder="Cardiology Department"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Designation *
                  </label>
                  <input name="designation" required placeholder="Consultant"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    BMDC Registration Number
                  </label>
                  <input name="bmdcRegistration"
                    placeholder="BMDC registration number"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>
              </div>

              <h3 className="mb-4 mt-8 font-semibold text-slate-700">
                Appointment Information
              </h3>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium text-slate-700">
                    Consultation Fee (৳) *
                  </label>
                  <input name="consultationFee" type="number" min="0" required
                    placeholder="1000"
                    className="w-full rounded-lg border border-slate-300 px-4 py-3" />
                </div>

                <div className="flex items-center gap-3 pt-8">
                  <input name="acceptingAppointments" type="checkbox"
                    defaultChecked className="h-4 w-4" />
                  <label className="text-sm text-slate-700">
                    Accepting appointments
                  </label>
                </div>
              </div>

              <p className="mt-6 rounded-lg bg-orange-50 p-4 text-sm text-orange-700">
                This profile will initially be unverified. Staff must
                verify the doctor's credentials before marking the
                profile as verified.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button type="submit"
                  className="rounded-lg bg-blue-600 px-6 py-3 text-sm font-medium text-white hover:bg-blue-700">
                  Save Doctor
                </button>

                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-lg border border-slate-300 px-6 py-3 text-sm font-medium text-slate-700 hover:bg-slate-50">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Doctor directory */}
        <div className="mt-8 rounded-xl bg-white p-6 shadow-sm md:p-8">
          <h2 className="text-xl font-semibold text-slate-800">
            Doctor Directory
          </h2>

          {doctors.length === 0 ? (
            <div className="mt-8 rounded-lg border border-dashed border-slate-300 p-10 text-center">
              <h3 className="font-semibold text-slate-700">
                No doctors added yet
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                Click Add Doctor to register your first doctor.
              </p>
            </div>
          ) : (
            <div className="mt-6 space-y-5">
              {doctors.map((doctor) => (
                <div key={doctor.id}
                  className="rounded-lg border border-slate-200 p-5">

                  <div className="flex flex-wrap items-center justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-slate-800">
                        {doctor.fullName}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.designation} · {doctor.specialization}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.department}
                      </p>
                      <p className="mt-1 text-sm text-slate-500">
                        {doctor.email} · {doctor.phone}
                      </p>
                    </div>

                    <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                      doctor.profileVerified
                        ? "bg-green-100 text-green-700"
                        : "bg-orange-100 text-orange-700"
                    }`}>
                      {doctor.profileVerified ? "Verified" : "Unverified"}
                    </span>
                  </div>

                  {/* Education section */}
                  <div className="mt-6 border-t border-slate-200 pt-5">
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div>
                        <h4 className="font-semibold text-slate-800">
                          Education & Qualifications
                        </h4>
                        <p className="mt-1 text-sm text-slate-500">
                          {doctor.education.length} qualification(s)
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setEducationDoctorId(
                            educationDoctorId === doctor.id ? null : doctor.id
                          );
                          setEditingEducation(null);
                        }}
                        className="rounded-lg bg-blue-50 px-4 py-2 text-sm font-medium text-blue-700 hover:bg-blue-100"
                      >
                        + Add Qualification
                      </button>
                    </div>

                    {doctor.education.length > 0 ? (
                      <div className="mt-4 space-y-3">
                        {doctor.education.map((item) => (
                          <div key={item.id}
                            className="flex flex-wrap items-center justify-between gap-3 rounded-lg bg-slate-50 p-4">

                            <div>
                              <p className="font-medium text-slate-800">
                                {item.degree}
                              </p>
                              <p className="mt-1 text-sm text-slate-500">
                                {item.institution} · {item.graduationYear}
                              </p>
                              <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                                item.verified
                                  ? "bg-green-100 text-green-700"
                                  : "bg-orange-100 text-orange-700"
                              }`}>
                                {item.verified ? "Verified" : "Pending verification"}
                              </span>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <button
                                type="button"
                                onClick={() => {
                                  setEducationDoctorId(doctor.id);
                                  setEditingEducation({
                                    doctorId: doctor.id,
                                    education: item,
                                  });
                                }}
                                className="rounded-md border border-slate-300 px-3 py-2 text-xs font-medium text-slate-700 hover:bg-white"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => handleVerifyEducation(doctor.id, item.id)}
                                className="rounded-md border border-green-300 px-3 py-2 text-xs font-medium text-green-700 hover:bg-green-50"
                              >
                                {item.verified ? "Unverify" : "Verify"}
                              </button>

                              <button
                                type="button"
                                onClick={() => handleDeleteEducation(doctor.id, item.id)}
                                className="rounded-md border border-red-300 px-3 py-2 text-xs font-medium text-red-700 hover:bg-red-50"
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="mt-4 text-sm text-slate-500">
                        No qualifications added yet.
                      </p>
                    )}

                    {/* Add or edit qualification form */}
                    {educationDoctorId === doctor.id && (
                      <form
                        key={`${doctor.id}-${editingEducation?.education.id ?? "new"}`}
                        onSubmit={handleSaveEducation}
                        className="mt-5 rounded-lg border border-blue-200 bg-blue-50/50 p-5"
                      >
                        <h5 className="mb-4 font-semibold text-slate-800">
                          {editingEducation ? "Edit Qualification" : "Add Qualification"}
                        </h5>

                        <input type="hidden" name="doctorId" value={doctor.id} />
                        <input
                          type="hidden"
                          name="educationId"
                          value={editingEducation?.education.id ?? ""}
                        />

                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Degree *
                            </label>
                            <input
                              name="degree"
                              required
                              defaultValue={editingEducation?.education.degree ?? ""}
                              placeholder="MBBS, FCPS, MD, PhD"
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Institution *
                            </label>
                            <input
                              name="institution"
                              required
                              defaultValue={editingEducation?.education.institution ?? ""}
                              placeholder="University or medical college"
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                            />
                          </div>

                          <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                              Graduation Year *
                            </label>
                            <input
                              name="graduationYear"
                              type="number"
                              min="1950"
                              max={new Date().getFullYear()}
                              required
                              defaultValue={editingEducation?.education.graduationYear ?? ""}
                              placeholder="2020"
                              className="w-full rounded-lg border border-slate-300 bg-white px-4 py-3"
                            />
                          </div>
                        </div>

                        <p className="mt-4 text-xs text-slate-500">
                          New qualifications start as pending verification.
                          Staff can verify them after checking the documents.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                          <button
                            type="submit"
                            className="rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                          >
                            {editingEducation ? "Update Qualification" : "Save Qualification"}
                          </button>

                          <button
                            type="button"
                            onClick={() => {
                              setEducationDoctorId(null);
                              setEditingEducation(null);
                            }}
                            className="rounded-lg border border-slate-300 bg-white px-5 py-3 text-sm font-medium text-slate-700"
                          >
                            Cancel
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
