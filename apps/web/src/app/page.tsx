
import Link from "next/link";
import Sidebar from "@/components/Sidebar";

const statistics = [
  {
    title: "Total Patients",
    value: "120",
    description: "Registered patients",
    icon: "👥",
    color: "bg-blue-100 text-blue-600",
  },
  {
    title: "Total Doctors",
    value: "18",
    description: "Available doctors",
    icon: "⚕️",
    color: "bg-green-100 text-green-600",
  },
  {
    title: "Appointments",
    value: "32",
    description: "Total appointments",
    icon: "📅",
    color: "bg-purple-100 text-purple-600",
  },
  {
    title: "Revenue",
    value: "৳45,000",
    description: "Sample revenue",
    icon: "৳",
    color: "bg-orange-100 text-orange-600",
  },
];

const appointments = [
  {
    id: 1,
    patient: "Rahim Ahmed",
    doctor: "Dr. Hasan",
    department: "Cardiology",
    date: "02 Nov 2026",
    time: "10:00 AM",
    status: "Confirmed",
  },
  {
    id: 2,
    patient: "Nusrat Jahan",
    doctor: "Dr. Sara",
    department: "Neurology",
    date: "02 Nov 2026",
    time: "11:30 AM",
    status: "Pending",
  },
  {
    id: 3,
    patient: "Karim Uddin",
    doctor: "Dr. Ahmed",
    department: "Medicine",
    date: "02 Nov 2026",
    time: "01:00 PM",
    status: "Completed",
  },
  {
    id: 4,
    patient: "Ayesha Akter",
    doctor: "Dr. Maria",
    department: "Dermatology",
    date: "03 Nov 2026",
    time: "09:30 AM",
    status: "Confirmed",
  },
];

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 md:p-8">
        {/* Dashboard Header */}
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-slate-800">
            Dashboard
          </h1>

          <p className="mt-2 text-slate-500">
            Welcome to MediFlow Hospital Management System.
          </p>
        </header>

        {/* Statistics Cards */}
        <section className="mb-8">
          <h2 className="mb-4 text-xl font-semibold text-slate-800">
            Hospital Overview
          </h2>

          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {statistics.map((item) => (
              <div
                key={item.title}
                className="rounded-xl bg-white p-6 shadow-sm"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-slate-500">
                      {item.title}
                    </p>

                    <h3 className="mt-2 text-2xl font-bold text-slate-800">
                      {item.value}
                    </h3>
                  </div>

                  <div
                    className={`flex h-12 w-12 items-center justify-center rounded-xl text-2xl ${item.color}`}
                  >
                    {item.icon}
                  </div>
                </div>

                <p className="mt-4 text-xs text-slate-400">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Quick Actions */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <h2 className="mb-5 text-xl font-semibold text-slate-800">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <Link
              href="/patients"
              className="flex items-center gap-4 rounded-lg border border-slate-200 p-5 transition hover:border-blue-400 hover:bg-blue-50"
            >
              <span className="text-3xl">👤</span>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Add Patient
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Register a new patient
                </p>
              </div>
            </Link>

            <div className="flex cursor-not-allowed items-center gap-4 rounded-lg border border-slate-200 p-5 opacity-60">
              <span className="text-3xl">🩺</span>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Add Doctor
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Coming in Step 4
                </p>
              </div>
            </div>

            <div className="flex cursor-not-allowed items-center gap-4 rounded-lg border border-slate-200 p-5 opacity-60">
              <span className="text-3xl">📅</span>

              <div>
                <h3 className="font-semibold text-slate-800">
                  Book Appointment
                </h3>
                <p className="mt-1 text-xs text-slate-500">
                  Coming in Step 5
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Recent Appointments */}
        <section className="mb-8 rounded-xl bg-white p-6 shadow-sm">
          <div className="mb-6 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
            <div>
              <h2 className="text-xl font-semibold text-slate-800">
                Recent Appointments
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Overview of recent patient appointments.
              </p>
            </div>

            <Link
              href="/appointments"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              View All
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px] text-left text-sm">
              <thead>
                <tr className="border-b bg-slate-50 text-slate-500">
                  <th className="p-4">Patient</th>
                  <th className="p-4">Doctor</th>
                  <th className="p-4">Department</th>
                  <th className="p-4">Date</th>
                  <th className="p-4">Time</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr
                    key={appointment.id}
                    className="border-b text-slate-700 last:border-0 hover:bg-slate-50"
                  >
                    <td className="p-4 font-medium">
                      {appointment.patient}
                    </td>

                    <td className="p-4">
                      {appointment.doctor}
                    </td>

                    <td className="p-4">
                      {appointment.department}
                    </td>

                    <td className="p-4">
                      {appointment.date}
                    </td>

                    <td className="p-4">
                      {appointment.time}
                    </td>

                    <td className="p-4">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-medium ${
                          appointment.status === "Confirmed"
                            ? "bg-green-100 text-green-700"
                            : appointment.status === "Pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {appointment.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer */}
        <footer className="py-4 text-center text-sm text-slate-400">
          MediFlow Hospital Management System
        </footer>
      </main>
    </div>
  );
}
