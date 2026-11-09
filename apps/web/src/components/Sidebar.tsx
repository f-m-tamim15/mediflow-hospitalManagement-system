
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
  { name: "Dashboard", icon: "⌂", href: "/" },
  { name: "Patients", icon: "♙", href: "/patients" },
  { name: "Doctors", icon: "⚕", href: "/doctors" },
  { name: "Appointments", icon: "▦", href: "/appointments" },
  { name: "Departments", icon: "▤", href: "/departments" },
  { name: "Medical Records", icon: "▧", href: "/medical-records" },
  { name: "prescriptions", icon: "⚙", href: "/prescriptions" },
    { name: "Settings", icon: "⚙", href: "/settings" },

];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex min-h-screen w-64 shrink-0 flex-col bg-slate-900 p-5 text-white">
      <div className="mb-10">
        <h1 className="text-2xl font-bold text-blue-400">MediFlow</h1>
        <p className="mt-1 text-xs text-slate-400">
          Hospital Management
        </p>
      </div>

      <nav className="flex-1 space-y-2">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 rounded-lg px-4 py-3 transition ${
                isActive
                  ? "bg-blue-600 text-white"
                  : "text-slate-300 hover:bg-slate-800"
              }`}
            >
              <span className="text-lg">{item.icon}</span>
              <span className="text-sm font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="border-t border-slate-700 pt-5">
        <p className="text-sm font-medium">Admin User</p>
        <p className="mt-1 text-xs text-slate-400">Administrator</p>
      </div>
    </aside>
  );
}
