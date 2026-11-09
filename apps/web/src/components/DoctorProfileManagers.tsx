
"use client";

import { useState, type FormEvent, type ReactNode } from "react";

import type {
  Doctor,
  DoctorWorkplace,
  DoctorTeachingPosition,
  DoctorAchievement,
  DoctorAvailability,
} from "@/lib/doctorStorage";

type WorkplaceProps = {
  doctor: Doctor;
  onUpdate: (items: DoctorWorkplace[]) => void;
};

type TeachingProps = {
  doctor: Doctor;
  onUpdate: (items: DoctorTeachingPosition[]) => void;
};

type AchievementProps = {
  doctor: Doctor;
  onUpdate: (items: DoctorAchievement[]) => void;
};

type AvailabilityProps = {
  doctor: Doctor;
  onUpdate: (items: DoctorAvailability[]) => void;
  onSettingsUpdate: (
    updates: Partial<
      Pick<Doctor, "consultationFee" | "acceptingAppointments">
    >
  ) => void;
};

const inputClass =
  "w-full rounded-lg border border-gray-300 p-3 text-sm outline-none focus:border-blue-500";

const buttonClass =
  "rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700";

const secondaryButtonClass =
  "rounded-lg border border-gray-300 px-3 py-2 text-sm hover:bg-gray-50";

function Section({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <section className="mt-6 rounded-xl border border-gray-200 bg-white p-5">
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500">{description}</p>
      </div>
      {children}
    </section>
  );
}

function RecordActions({
  onEdit,
  onDelete,
}: {
  onEdit: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={onEdit}
        className={secondaryButtonClass}
      >
        Edit
      </button>

      <button
        type="button"
        onClick={onDelete}
        className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700 hover:bg-red-100"
      >
        Delete
      </button>
    </div>
  );
}

/* =====================================================
   1. WORKPLACE HISTORY
===================================================== */

const emptyWorkplace = {
  hospital: "",
  department: "",
  position: "",
  employmentType: "Full-time" as DoctorWorkplace["employmentType"],
  startDate: "",
  endDate: "",
  isCurrent: false,
};

export function WorkplaceManager({
  doctor,
  onUpdate,
}: WorkplaceProps) {
  const items = doctor.workplaces ?? [];

  const [form, setForm] = useState(emptyWorkplace);
  const [editingId, setEditingId] = useState<number | null>(null);

  function reset() {
    setForm(emptyWorkplace);
    setEditingId(null);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: DoctorWorkplace = {
      id: editingId ?? Date.now(),
      ...form,
      hospital: form.hospital.trim(),
      department: form.department.trim(),
      position: form.position.trim(),
      endDate: form.isCurrent ? null : form.endDate || null,
    };

    onUpdate(
      editingId === null
        ? [...items, record]
        : items.map((item) =>
            item.id === editingId ? record : item
          )
    );

    reset();
  }

  function edit(item: DoctorWorkplace) {
    setEditingId(item.id);

    setForm({
      hospital: item.hospital,
      department: item.department,
      position: item.position,
      employmentType: item.employmentType,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      isCurrent: item.isCurrent,
    });
  }

  function remove(id: number) {
    if (!window.confirm("Delete this workplace record?")) return;

    onUpdate(items.filter((item) => item.id !== id));

    if (editingId === id) reset();
  }

  return (
    <Section
      title="Workplace History"
      description="Manage hospitals, clinics and current professional positions."
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            No workplace records added.
          </p>
        )}

        {items.map((item) => (
          <div key={item.id} className="rounded-lg border p-4">
            <div className="flex flex-wrap justify-between gap-3">
              <div>
                <p className="font-semibold">{item.hospital}</p>

                <p className="text-sm text-gray-600">
                  {item.position} · {item.department}
                </p>

                <p className="text-xs text-gray-500">
                  {item.startDate} –{" "}
                  {item.isCurrent
                    ? "Present"
                    : item.endDate || "Not specified"}
                  {" · "}
                  {item.employmentType}
                </p>

                {item.isCurrent && (
                  <span className="mt-2 inline-block rounded-full bg-green-100 px-3 py-1 text-xs text-green-700">
                    Current
                  </span>
                )}
              </div>

              <RecordActions
                onEdit={() => edit(item)}
                onDelete={() => remove(item.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3 border-t pt-5">
        <h4 className="font-semibold">
          {editingId !== null ? "Edit Workplace" : "Add Workplace"}
        </h4>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            className={inputClass}
            placeholder="Hospital / Clinic"
            value={form.hospital}
            onChange={(e) =>
              setForm({ ...form, hospital: e.target.value })
            }
          />

          <input
            required
            className={inputClass}
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <input
            required
            className={inputClass}
            placeholder="Position"
            value={form.position}
            onChange={(e) =>
              setForm({ ...form, position: e.target.value })
            }
          />

          <select
            className={inputClass}
            value={form.employmentType}
            onChange={(e) =>
              setForm({
                ...form,
                employmentType: e.target.value as DoctorWorkplace["employmentType"],
              })
            }
          >
            <option value="Full-time">Full-time</option>
            <option value="Part-time">Part-time</option>
            <option value="Visiting">Visiting</option>
          </select>

          <label className="text-sm">
            Start date
            <input
              required
              type="date"
              className={inputClass}
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            End date
            <input
              type="date"
              disabled={form.isCurrent}
              className={inputClass}
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) =>
              setForm({
                ...form,
                isCurrent: e.target.checked,
                endDate: "",
              })
            }
          />
          This is a current workplace
        </label>

        <div className="flex gap-2">
          <button className={buttonClass}>
            {editingId !== null ? "Update Workplace" : "Add Workplace"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={reset}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </Section>
  );
}

/* =====================================================
   2. ACADEMIC AND TEACHING POSITIONS
===================================================== */

const emptyTeaching = {
  institution: "",
  department: "",
  academicTitle: "Lecturer",
  startDate: "",
  endDate: "",
  isCurrent: false,
};

export function TeachingPositionManager({
  doctor,
  onUpdate,
}: TeachingProps) {
  const items = doctor.teachingPositions ?? [];

  const [form, setForm] = useState(emptyTeaching);
  const [editingId, setEditingId] = useState<number | null>(null);

  function reset() {
    setForm(emptyTeaching);
    setEditingId(null);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: DoctorTeachingPosition = {
      id: editingId ?? Date.now(),
      ...form,
      institution: form.institution.trim(),
      department: form.department.trim(),
      endDate: form.isCurrent ? null : form.endDate || null,
    };

    onUpdate(
      editingId === null
        ? [...items, record]
        : items.map((item) =>
            item.id === editingId ? record : item
          )
    );

    reset();
  }

  function edit(item: DoctorTeachingPosition) {
    setEditingId(item.id);

    setForm({
      institution: item.institution,
      department: item.department,
      academicTitle: item.academicTitle,
      startDate: item.startDate,
      endDate: item.endDate ?? "",
      isCurrent: item.isCurrent,
    });
  }

  function remove(id: number) {
    if (!window.confirm("Delete this academic position?")) return;

    onUpdate(items.filter((item) => item.id !== id));

    if (editingId === id) reset();
  }

  return (
    <Section
      title="Academic & Teaching Positions"
      description="Manage university and medical-college appointments."
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            No academic positions added.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between gap-3 rounded-lg border p-4"
          >
            <div>
              <p className="font-semibold">{item.academicTitle}</p>

              <p className="text-sm text-gray-600">
                {item.institution} · {item.department}
              </p>

              <p className="text-xs text-gray-500">
                {item.startDate} –{" "}
                {item.isCurrent
                  ? "Present"
                  : item.endDate || "Not specified"}
              </p>

              {item.isCurrent && (
                <span className="text-xs font-medium text-green-700">
                  Current position
                </span>
              )}
            </div>

            <RecordActions
              onEdit={() => edit(item)}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3 border-t pt-5">
        <h4 className="font-semibold">
          {editingId !== null ? "Edit Position" : "Add Academic Position"}
        </h4>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            className={inputClass}
            placeholder="University / Medical College"
            value={form.institution}
            onChange={(e) =>
              setForm({ ...form, institution: e.target.value })
            }
          />

          <input
            required
            className={inputClass}
            placeholder="Department"
            value={form.department}
            onChange={(e) =>
              setForm({ ...form, department: e.target.value })
            }
          />

          <select
            className={inputClass}
            value={form.academicTitle}
            onChange={(e) =>
              setForm({ ...form, academicTitle: e.target.value })
            }
          >
            <option>Lecturer</option>
            <option>Assistant Professor</option>
            <option>Associate Professor</option>
            <option>Professor</option>
            <option>Head of Department</option>
            <option>Other</option>
          </select>

          <label className="text-sm">
            Start date
            <input
              required
              type="date"
              className={inputClass}
              value={form.startDate}
              onChange={(e) =>
                setForm({ ...form, startDate: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            End date
            <input
              type="date"
              disabled={form.isCurrent}
              className={inputClass}
              value={form.endDate}
              onChange={(e) =>
                setForm({ ...form, endDate: e.target.value })
              }
            />
          </label>
        </div>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.isCurrent}
            onChange={(e) =>
              setForm({
                ...form,
                isCurrent: e.target.checked,
                endDate: "",
              })
            }
          />
          This is a current teaching position
        </label>

        <div className="flex gap-2">
          <button className={buttonClass}>
            {editingId !== null ? "Update Position" : "Add Position"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={reset}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </Section>
  );
}

/* =====================================================
   3. ACHIEVEMENTS AND CERTIFICATIONS
===================================================== */

const emptyAchievement = {
  title: "",
  description: "",
  year: new Date().getFullYear(),
  type: "Certification" as DoctorAchievement["type"],
  verified: false,
};

export function AchievementManager({
  doctor,
  onUpdate,
}: AchievementProps) {
  const items = doctor.achievements ?? [];

  const [form, setForm] = useState(emptyAchievement);
  const [editingId, setEditingId] = useState<number | null>(null);

  function reset() {
    setForm(emptyAchievement);
    setEditingId(null);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const record: DoctorAchievement = {
      id: editingId ?? Date.now(),
      ...form,
      title: form.title.trim(),
      description: form.description.trim(),
      verified: editingId === null ? false : form.verified,
    };

    onUpdate(
      editingId === null
        ? [...items, record]
        : items.map((item) =>
            item.id === editingId ? record : item
          )
    );

    reset();
  }

  function edit(item: DoctorAchievement) {
    setEditingId(item.id);

    setForm({
      title: item.title,
      description: item.description,
      year: item.year,
      type: item.type,
      verified: item.verified,
    });
  }

  function remove(id: number) {
    if (!window.confirm("Delete this achievement?")) return;

    onUpdate(items.filter((item) => item.id !== id));

    if (editingId === id) reset();
  }

  return (
    <Section
      title="Achievements & Certifications"
      description="Add awards, certifications, publications and research."
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            No achievements added.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between gap-3 rounded-lg border p-4"
          >
            <div className="min-w-0 flex-1">
              <p className="font-semibold">{item.title}</p>

              <p className="text-sm text-gray-600">{item.description}</p>

              <p className="mt-1 text-xs text-gray-500">
                {item.type} · {item.year}
              </p>

              <span
                className={`mt-2 inline-block rounded-full px-3 py-1 text-xs ${
                  item.verified
                    ? "bg-green-100 text-green-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {item.verified ? "Verified" : "Pending verification"}
              </span>
            </div>

            <div className="flex flex-wrap items-start gap-2">
              <button
                type="button"
                className={secondaryButtonClass}
                onClick={() =>
                  onUpdate(
                    items.map((x) =>
                      x.id === item.id
                        ? { ...x, verified: !x.verified }
                        : x
                    )
                  )
                }
              >
                {item.verified ? "Unverify" : "Verify"}
              </button>

              <RecordActions
                onEdit={() => edit(item)}
                onDelete={() => remove(item.id)}
              />
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3 border-t pt-5">
        <h4 className="font-semibold">
          {editingId !== null ? "Edit Achievement" : "Add Achievement"}
        </h4>

        <div className="grid gap-3 md:grid-cols-2">
          <input
            required
            className={inputClass}
            placeholder="Title"
            value={form.title}
            onChange={(e) =>
              setForm({ ...form, title: e.target.value })
            }
          />

          <select
            className={inputClass}
            value={form.type}
            onChange={(e) =>
              setForm({
                ...form,
                type: e.target.value as DoctorAchievement["type"],
              })
            }
          >
            <option value="Award">Award</option>
            <option value="Certification">Certification</option>
            <option value="Publication">Publication</option>
            <option value="Research">Research</option>
          </select>

          <input
            required
            type="number"
            min="1900"
            max="2100"
            className={inputClass}
            value={form.year}
            onChange={(e) =>
              setForm({ ...form, year: Number(e.target.value) })
            }
          />

          <textarea
            required
            className={inputClass}
            placeholder="Description"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
        </div>

        <p className="text-xs text-gray-500">
          New records are pending verification until staff verifies them.
        </p>

        <div className="flex gap-2">
          <button className={buttonClass}>
            {editingId !== null ? "Update Achievement" : "Add Achievement"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={reset}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </Section>
  );
}

/* =====================================================
   4. AVAILABILITY AND CONSULTATION
===================================================== */

const emptyAvailability = {
  day: "Sunday",
  startTime: "09:00",
  endTime: "17:00",
};

export function AvailabilityManager({
  doctor,
  onUpdate,
  onSettingsUpdate,
}: AvailabilityProps) {
  const items = doctor.availability ?? [];

  const [form, setForm] = useState(emptyAvailability);
  const [editingId, setEditingId] = useState<number | null>(null);

  function reset() {
    setForm(emptyAvailability);
    setEditingId(null);
  }

  function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (form.startTime >= form.endTime) {
      window.alert("End time must be later than start time.");
      return;
    }

    const record: DoctorAvailability = {
      id: editingId ?? Date.now(),
      ...form,
    };

    onUpdate(
      editingId === null
        ? [...items, record]
        : items.map((item) =>
            item.id === editingId ? record : item
          )
    );

    reset();
  }

  function edit(item: DoctorAvailability) {
    setEditingId(item.id);

    setForm({
      day: item.day,
      startTime: item.startTime,
      endTime: item.endTime,
    });
  }

  function remove(id: number) {
    if (!window.confirm("Delete this schedule?")) return;

    onUpdate(items.filter((item) => item.id !== id));

    if (editingId === id) reset();
  }

  return (
    <Section
      title="Availability & Consultation"
      description="Set weekly consultation hours and appointment preferences."
    >
      <div className="space-y-3">
        {items.length === 0 && (
          <p className="rounded-lg bg-gray-50 p-3 text-sm text-gray-500">
            No availability schedule added.
          </p>
        )}

        {items.map((item) => (
          <div
            key={item.id}
            className="flex flex-wrap justify-between gap-3 rounded-lg border p-4"
          >
            <div>
              <p className="font-semibold">{item.day}</p>
              <p className="text-sm text-gray-600">
                {item.startTime} – {item.endTime}
              </p>
            </div>

            <RecordActions
              onEdit={() => edit(item)}
              onDelete={() => remove(item.id)}
            />
          </div>
        ))}
      </div>

      <form onSubmit={submit} className="mt-5 space-y-3 border-t pt-5">
        <h4 className="font-semibold">
          {editingId !== null ? "Edit Schedule" : "Add Schedule"}
        </h4>

        <div className="grid gap-3 md:grid-cols-3">
          <select
            className={inputClass}
            value={form.day}
            onChange={(e) =>
              setForm({ ...form, day: e.target.value })
            }
          >
            {[
              "Sunday",
              "Monday",
              "Tuesday",
              "Wednesday",
              "Thursday",
              "Friday",
              "Saturday",
            ].map((day) => (
              <option key={day}>{day}</option>
            ))}
          </select>

          <label className="text-sm">
            Start time
            <input
              required
              type="time"
              className={inputClass}
              value={form.startTime}
              onChange={(e) =>
                setForm({ ...form, startTime: e.target.value })
              }
            />
          </label>

          <label className="text-sm">
            End time
            <input
              required
              type="time"
              className={inputClass}
              value={form.endTime}
              onChange={(e) =>
                setForm({ ...form, endTime: e.target.value })
              }
            />
          </label>
        </div>

        <div className="flex gap-2">
          <button className={buttonClass}>
            {editingId !== null ? "Update Schedule" : "Add Schedule"}
          </button>

          {editingId !== null && (
            <button
              type="button"
              onClick={reset}
              className={secondaryButtonClass}
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 border-t pt-5">
        <h4 className="mb-3 font-semibold">Consultation Settings</h4>

        <label className="mb-3 block text-sm">
          Consultation fee (৳)
          <input
            type="number"
            min="0"
            className={inputClass}
            value={doctor.consultationFee}
            onChange={(e) =>
              onSettingsUpdate({
                consultationFee: Math.max(0, Number(e.target.value)),
              })
            }
          />
        </label>

        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={doctor.acceptingAppointments}
            onChange={(e) =>
              onSettingsUpdate({
                acceptingAppointments: e.target.checked,
              })
            }
          />
          Accepting appointments
        </label>
      </div>
    </Section>
  );
}
