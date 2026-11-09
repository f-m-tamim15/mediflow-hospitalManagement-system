
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Sidebar from "@/components/Sidebar";
import { getDoctors, type Doctor } from "@/lib/doctorStorage";

export default function DoctorProfileClient({
  doctorId,
}: {
  doctorId: number;
}) {
  const [doctor, setDoctor] = useState<Doctor | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const found = getDoctors().find((item) => item.id === doctorId);
    setDoctor(found ?? null);
    setLoaded(true);
  }, [doctorId]);

  if (!loaded) {
    return <div className="p-10 text-center">Loading profile...</div>;
  }

  if (!doctor) {
    return (
      <div className="p-10 text-center">
        <h1 className="text-2xl font-bold">Doctor not found</h1>
        <Link href="/doctors" className="mt-4 inline-block text-blue-600">
          Return to Doctor Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        <Link href="/doctors" className="text-sm text-blue-600">
          ← Back to Doctors
        </Link>

        <section className="mt-6 rounded-xl bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-5">
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-blue-100 text-4xl font-bold text-blue-700">
              {doctor.fullName.charAt(0).toUpperCase()}
            </div>

            <div>
              <h1 className="text-2xl font-bold text-slate-800">
                {doctor.fullName}
              </h1>
              <p className="mt-1 text-blue-600">{doctor.designation}</p>
              <p className="text-slate-500">{doctor.specialization}</p>
              <span className={`mt-3 inline-block rounded-full px-3 py-1 text-xs ${
                doctor.profileVerified
                  ? "bg-green-100 text-green-700"
                  : "bg-orange-100 text-orange-700"
              }`}>
                {doctor.profileVerified ? "Verified profile" : "Profile not verified"}
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Personal Information</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>Email:</strong> {doctor.email}</p>
              <p><strong>Phone:</strong> {doctor.phone}</p>
              <p><strong>Gender:</strong> {doctor.gender}</p>
              <p><strong>Date of Birth:</strong> {doctor.dateOfBirth}</p>
              <p><strong>Address:</strong> {doctor.address}</p>
              <p><strong>BMDC Registration:</strong> {doctor.bmdcRegistration || "Not provided"}</p>
              <p><strong>Department:</strong> {doctor.department}</p>
              <p><strong>Experience:</strong> {doctor.yearsOfExperience} years</p>
            </div>
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Consultation Information</h2>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong>Fee:</strong> ৳{doctor.consultationFee}</p>
              <p>
                <strong>Appointment status:</strong>{" "}
                {doctor.acceptingAppointments ? "Accepting appointments" : "Not accepting"}
              </p>
            </div>

            <h3 className="mb-3 mt-6 font-semibold">Availability</h3>
            {doctor.availability.length === 0 ? (
              <p className="text-sm text-slate-500">No availability added.</p>
            ) : (
              doctor.availability.map((item) => (
                <div key={item.id} className="mb-2 rounded-lg bg-slate-50 p-3 text-sm">
                  <strong>{item.day}</strong>
                  <p className="text-slate-500">
                    {item.startTime} – {item.endTime}
                  </p>
                </div>
              ))
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Education & Qualifications</h2>
            {doctor.education.length === 0 ? (
              <p className="text-sm text-slate-500">No qualifications added.</p>
            ) : (
              doctor.education.map((item) => (
                <div key={item.id} className="mb-3 border-b border-slate-100 pb-3">
                  <p className="font-medium">{item.degree}</p>
                  <p className="text-sm text-slate-500">
                    {item.institution} · {item.graduationYear}
                  </p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                    item.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {item.verified ? "Verified" : "Pending verification"}
                  </span>
                </div>
              ))
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Workplace History</h2>
            {doctor.workplaces.length === 0 ? (
              <p className="text-sm text-slate-500">No workplaces added.</p>
            ) : (
              doctor.workplaces.map((item) => (
                <div key={item.id} className="mb-3 border-b border-slate-100 pb-3">
                  <p className="font-medium">{item.hospital}</p>
                  <p className="text-sm text-slate-500">
                    {item.position} · {item.department}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
                  </p>
                </div>
              ))
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Academic & Teaching Positions</h2>
            {doctor.teachingPositions.length === 0 ? (
              <p className="text-sm text-slate-500">No teaching positions added.</p>
            ) : (
              doctor.teachingPositions.map((item) => (
                <div key={item.id} className="mb-3 border-b border-slate-100 pb-3">
                  <p className="font-medium">{item.academicTitle}</p>
                  <p className="text-sm text-slate-500">
                    {item.institution} · {item.department}
                  </p>
                  <p className="text-sm text-slate-500">
                    {item.startDate} – {item.isCurrent ? "Present" : item.endDate}
                  </p>
                </div>
              ))
            )}
          </section>

          <section className="rounded-xl bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-lg font-semibold">Achievements & Certifications</h2>
            {doctor.achievements.length === 0 ? (
              <p className="text-sm text-slate-500">No achievements added.</p>
            ) : (
              doctor.achievements.map((item) => (
                <div key={item.id} className="mb-3 border-b border-slate-100 pb-3">
                  <p className="font-medium">{item.title}</p>
                  <p className="text-sm text-slate-500">
                    {item.type} · {item.year}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">{item.description}</p>
                  <span className={`mt-2 inline-block rounded-full px-2 py-1 text-xs ${
                    item.verified ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                  }`}>
                    {item.verified ? "Verified" : "Pending verification"}
                  </span>
                </div>
              ))
            )}
          </section>
        </div>
      </main>
    </div>
  );
}
