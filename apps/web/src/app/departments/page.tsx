
"use client";

import { useEffect, useState, type FormEvent } from "react";
import Sidebar from "@/components/Sidebar";
import {
  getDepartments,
  saveDepartments,
  type Department,
} from "@/lib/departmentStorage";

const emptyForm = {
  name: "",
  description: "",
  location: "",
  headOfDepartment: "",
  phone: "",
  status: "Active" as "Active" | "Inactive",
};

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    setDepartments(getDepartments());
  }, []);

  function updateDepartments(updated: Department[]) {
    setDepartments(updated);
    saveDepartments(updated);
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const name = form.name.trim();

    if (!name) return;

    const duplicate = departments.some(
      (department) =>
        department.name.toLowerCase() === name.toLowerCase() &&
        department.id !== editingId
    );

    if (duplicate) {
      alert("This department already exists.");
      return;
    }

    if (editingId !== null) {
      const updated = departments.map((department) =>
        department.id === editingId
          ? { ...department, ...form, name }
          : department
      );

      updateDepartments(updated);
    } else {
      const newDepartment: Department = {
        id: Date.now(),
        ...form,
        name,
        createdAt: new Date().toISOString(),
      };

      updateDepartments([...departments, newDepartment]);
    }

    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  function handleEdit(department: Department) {
    setForm({
      name: department.name,
      description: department.description,
      location: department.location,
      headOfDepartment: department.headOfDepartment,
      phone: department.phone,
      status: department.status,
    });

    setEditingId(department.id);
    setShowForm(true);
  }

  function handleDelete(id: number) {
    if (!window.confirm("Delete this department?")) return;

    updateDepartments(
      departments.filter((department) => department.id !== id)
    );
  }

  function handleCancel() {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  }

  const filteredDepartments = departments.filter((department) =>
    [
      department.name,
      department.description,
      department.location,
      department.headOfDepartment,
    ]
      .join(" ")
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  const activeCount = departments.filter(
    (department) => department.status === "Active"
  ).length;

  return (
    <div className="min-h-screen bg-slate-100 md:flex">
      <Sidebar />

      <main className="min-w-0 flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-7xl">

          <div className="mb-8 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">
                Department Management
              </h1>
              <p className="mt-2 text-sm text-slate-500">
                Manage hospital departments and their information.
              </p>
            </div>

            <button
              onClick={() => {
                if (showForm) {
                  handleCancel();
                } else {
                  setShowForm(true);
                }
              }}
              className="rounded-lg bg-blue-600 px-5 py-3 font-medium text-white hover:bg-blue-700"
            >
              {showForm ? "Close Form" : "+ Add Department"}
            </button>
          </div>

          <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
            <StatCard title="Total Departments" value={departments.length} />
            <StatCard title="Active Departments" value={activeCount} />
            <StatCard
              title="Inactive Departments"
              value={departments.length - activeCount}
            />
          </div>

          {showForm && (
            <section className="mb-8 rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="mb-6 text-xl font-bold text-slate-900">
                {editingId ? "Edit Department" : "Add New Department"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="grid grid-cols-1 gap-5 md:grid-cols-2"
              >
                <Field label="Department Name *">
                  <input
                    required
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    placeholder="e.g. Cardiology"
                    className="input"
                  />
                </Field>

                <Field label="Head of Department">
                  <input
                    value={form.headOfDepartment}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        headOfDepartment: e.target.value,
                      })
                    }
                    placeholder="Department head"
                    className="input"
                  />
                </Field>

                <Field label="Department Location">
                  <input
                    value={form.location}
                    onChange={(e) =>
                      setForm({ ...form, location: e.target.value })
                    }
                    placeholder="e.g. Floor 2, Room 204"
                    className="input"
                  />
                </Field>

                <Field label="Contact Phone">
                  <input
                    value={form.phone}
                    onChange={(e) =>
                      setForm({ ...form, phone: e.target.value })
                    }
                    placeholder="Department phone"
                    className="input"
                  />
                </Field>

                <Field label="Status">
                  <select
                    value={form.status}
                    onChange={(e) =>
                      setForm({
                        ...form,
                        status: e.target.value as "Active" | "Inactive",
                      })
                    }
                    className="input"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </Field>

                <div className="md:col-span-2">
                  <Field label="Description">
                    <textarea
                      rows={3}
                      value={form.description}
                      onChange={(e) =>
                        setForm({
                          ...form,
                          description: e.target.value,
                        })
                      }
                      placeholder="Describe this department..."
                      className="input"
                    />
                  </Field>
                </div>

                <div className="flex flex-wrap gap-3 md:col-span-2">
                  <button
                    type="submit"
                    className="rounded-lg bg-blue-600 px-6 py-3 font-medium text-white hover:bg-blue-700"
                  >
                    {editingId ? "Save Changes" : "Create Department"}
                  </button>

                  <button
                    type="button"
                    onClick={handleCancel}
                    className="rounded-lg border border-slate-300 px-6 py-3 text-slate-700 hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </section>
          )}

          <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
            <div className="flex flex-col justify-between gap-4 border-b border-slate-200 p-5 sm:flex-row sm:items-center">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Hospital Departments
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {filteredDepartments.length} department(s)
                </p>
              </div>

              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search departments..."
                className="rounded-lg border border-slate-300 px-4 py-2 outline-none focus:border-blue-500"
              />
            </div>

            {filteredDepartments.length === 0 ? (
              <div className="p-12 text-center">
                <div className="mb-3 text-4xl">🏥</div>
                <h3 className="font-semibold text-slate-800">
                  No departments found
                </h3>
                <p className="mt-2 text-sm text-slate-500">
                  Add a department to get started.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[850px] text-left">
                  <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                    <tr>
                      <th className="px-5 py-4">Department</th>
                      <th className="px-5 py-4">Department Head</th>
                      <th className="px-5 py-4">Location</th>
                      <th className="px-5 py-4">Phone</th>
                      <th className="px-5 py-4">Status</th>
                      <th className="px-5 py-4">Actions</th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-slate-100">
                    {filteredDepartments.map((department) => (
                      <tr key={department.id} className="hover:bg-slate-50">
                        <td className="px-5 py-4">
                          <p className="font-semibold text-slate-800">
                            {department.name}
                          </p>
                          <p className="mt-1 max-w-[220px] truncate text-xs text-slate-500">
                            {department.description || "No description"}
                          </p>
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {department.headOfDepartment || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {department.location || "-"}
                        </td>

                        <td className="px-5 py-4 text-sm text-slate-700">
                          {department.phone || "-"}
                        </td>

                        <td className="px-5 py-4">
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              department.status === "Active"
                                ? "bg-green-100 text-green-700"
                                : "bg-slate-200 text-slate-600"
                            }`}
                          >
                            {department.status}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div className="flex gap-3">
                            <button
                              onClick={() => handleEdit(department)}
                              className="text-sm font-medium text-blue-600 hover:text-blue-800"
                            >
                              Edit
                            </button>

                            <button
                              onClick={() => handleDelete(department.id)}
                              className="text-sm font-medium text-red-600 hover:text-red-800"
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
          </section>

          <p className="mt-5 text-xs text-slate-400">
            Department data is currently saved in this browser's localStorage.
          </p>
        </div>
      </main>
    </div>
  );
}

function StatCard({ title, value }: { title: string; value: number }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <p className="text-sm text-slate-500">{title}</p>
      <p className="mt-2 text-3xl font-bold text-slate-900">{value}</p>
    </div>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-medium text-slate-700">
        {label}
      </label>
      {children}
    </div>
  );
}
