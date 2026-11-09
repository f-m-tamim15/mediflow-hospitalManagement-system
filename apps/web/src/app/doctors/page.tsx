
"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getDoctors, type Doctor } from "@/lib/doctorStorage";

export default function DoctorsPage() {
  const [doctors, setDoctors] = useState<Doctor[]>([]);
  const [search, setSearch] = useState("");
  const [specialization, setSpecialization] = useState("All");
  const [department, setDepartment] = useState("All");
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setDoctors(getDoctors());
    setLoaded(true);
  }, []);

  const specializations = useMemo(
    () => [...new Set(doctors.map((d) => d.specialization).filter(Boolean))],
    [doctors]
  );

  const departments = useMemo(
    () => [...new Set(doctors.map((d) => d.department).filter(Boolean))],
    [doctors]
  );

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.fullName.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase());

    const matchesSpecialization =
      specialization === "All" ||
      doctor.specialization === specialization;

    const matchesDepartment =
      department === "All" || doctor.department === department;

    return matchesSearch && matchesSpecialization && matchesDepartment;
  });

  if (!loaded) {
    return <div className="p-10 text-center">Loading doctors...</div>;
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <div className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Find Your Specialist
          </p>
          <h1 className="mt-2 text-3xl font-bold text-slate-800">
            Our Doctors
          </h1>
          <p className="mt-2 text-slate-500">
            Browse doctor profiles, qualifications and consultation details.
          </p>
        </div>

        <div className="mb-8 grid grid-cols-1 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-3">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search doctor or specialization..."
            className="rounded-lg border border-slate-300 px-4 py-3"
          />

          <select
            value={specialization}
            onChange={(e) => setSpecialization(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3"
          >
            <option value="All">All Specializations</option>
            {specializations.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>

          <select
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            className="rounded-lg border border-slate-300 px-4 py-3"
          >
            <option value="All">All Departments</option>
            {departments.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div className="mb-5 text-sm text-slate-500">
          Showing {filteredDoctors.length} doctor(s)
        </div>

        {filteredDoctors.length === 0 ? (
          <div className="rounded-xl border border-dashed border-slate-300 bg-white p-12 text-center">
            <h2 className="font-semibold text-slate-700">
              No doctors found
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              Add doctors through the administration panel or change your filters.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            {filteredDoctors.map((doctor) => (
              <div
                key={doctor.id}
                className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-blue-100 text-2xl font-bold text-blue-700">
                    {doctor.fullName.charAt(0).toUpperCase()}
                  </div>

                  <div className="min-w-0 flex-1">
                    <h2 className="font-semibold text-slate-800">
                      {doctor.fullName}
                    </h2>
                    <p className="mt-1 text-sm text-blue-600">
                      {doctor.designation}
                    </p>
                    <p className="mt-1 text-sm text-slate-500">
                      {doctor.specialization}
                    </p>
                  </div>
                </div>

                <div className="mt-5 space-y-2 text-sm text-slate-600">
                  <p><strong>Department:</strong> {doctor.department}</p>
                  <p><strong>Experience:</strong> {doctor.yearsOfExperience} years</p>
                  <p><strong>Consultation fee:</strong> ৳{doctor.consultationFee}</p>
                  <p>
                    <strong>Appointments:</strong>{" "}
                    {doctor.acceptingAppointments ? "Accepting" : "Not accepting"}
                  </p>
                </div>

                <div className="mt-4 flex flex-wrap gap-2">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium ${
                    doctor.profileVerified
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {doctor.profileVerified ? "Verified profile" : "Profile not verified"}
                  </span>
                </div>

                <Link
                  href={`/doctors/${doctor.id}`}
                  className="mt-5 inline-block rounded-lg bg-blue-600 px-5 py-3 text-sm font-medium text-white hover:bg-blue-700"
                >
                  View Full Profile →
                </Link>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
