
"use client";

import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";

type HospitalSettings = {
  hospitalName: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  adminName: string;
  adminEmail: string;
  appointmentDuration: string;
  currency: string;
  allowOnlineAppointments: boolean;
  requireAppointmentConfirmation: boolean;
  emailNotifications: boolean;
  appointmentNotifications: boolean;
  prescriptionNotifications: boolean;
};

const defaultSettings: HospitalSettings = {
  hospitalName: "MediFlow Hospital",
  email: "info@mediflow.com",
  phone: "",
  address: "",
  website: "",
  adminName: "Hospital Administrator",
  adminEmail: "admin@mediflow.com",
  appointmentDuration: "30",
  currency: "BDT",
  allowOnlineAppointments: true,
  requireAppointmentConfirmation: true,
  emailNotifications: true,
  appointmentNotifications: true,
  prescriptionNotifications: true,
};

const STORAGE_KEY = "mediflow_settings";

export default function SettingsPage() {
  const [settings, setSettings] =
    useState<HospitalSettings>(defaultSettings);

  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);

    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
  }, []);

  function updateField(
    field: keyof HospitalSettings,
    value: string | boolean
  ) {
    setSettings((prev) => ({
      ...prev,
      [field]: value,
    }));

    setSaved(false);
  }

  function handleSave() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    setSaved(true);
  }

  function handleReset() {
    if (!confirm("Reset all settings to their default values?")) {
      return;
    }

    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
    setSaved(false);
  }

  return (
    <div className="flex min-h-screen bg-slate-100">
      <Sidebar />

      <main className="min-w-0 flex-1 p-6 lg:p-8">
        <div className="mx-auto max-w-5xl space-y-6">

          <div>
            <h1 className="text-3xl font-bold text-slate-800">
              Settings
            </h1>
            <p className="mt-1 text-slate-500">
              Manage your hospital information and system preferences.
            </p>
          </div>

          {/* Hospital Information */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-800">
                Hospital Information
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Basic information about your hospital.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Hospital Name"
                value={settings.hospitalName}
                onChange={(v) => updateField("hospitalName", v)}
              />

              <Field
                label="Hospital Email"
                type="email"
                value={settings.email}
                onChange={(v) => updateField("email", v)}
              />

              <Field
                label="Phone Number"
                value={settings.phone}
                onChange={(v) => updateField("phone", v)}
              />

              <Field
                label="Website"
                value={settings.website}
                onChange={(v) => updateField("website", v)}
                placeholder="https://example.com"
              />

              <div className="md:col-span-2">
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Hospital Address
                </label>
                <textarea
                  rows={3}
                  value={settings.address}
                  onChange={(e) =>
                    updateField("address", e.target.value)
                  }
                  className="settings-input"
                  placeholder="Enter hospital address"
                />
              </div>
            </div>
          </section>

          {/* Administrator Profile */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-800">
                Administrator Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Administrator contact information.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <Field
                label="Administrator Name"
                value={settings.adminName}
                onChange={(v) => updateField("adminName", v)}
              />

              <Field
                label="Administrator Email"
                type="email"
                value={settings.adminEmail}
                onChange={(v) => updateField("adminEmail", v)}
              />
            </div>
          </section>

          {/* Appointment Settings */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-800">
                Appointment Configuration
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Configure general appointment preferences.
              </p>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Appointment Duration
                </label>
                <select
                  value={settings.appointmentDuration}
                  onChange={(e) =>
                    updateField("appointmentDuration", e.target.value)
                  }
                  className="settings-input"
                >
                  <option value="15">15 minutes</option>
                  <option value="20">20 minutes</option>
                  <option value="30">30 minutes</option>
                  <option value="45">45 minutes</option>
                  <option value="60">60 minutes</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium text-slate-700">
                  Currency
                </label>
                <select
                  value={settings.currency}
                  onChange={(e) =>
                    updateField("currency", e.target.value)
                  }
                  className="settings-input"
                >
                  <option value="BDT">BDT (৳)</option>
                  <option value="USD">USD ($)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <Toggle
                label="Allow Online Appointments"
                description="Allow appointments to be created through the online system."
                checked={settings.allowOnlineAppointments}
                onChange={(v) =>
                  updateField("allowOnlineAppointments", v)
                }
              />

              <Toggle
                label="Require Appointment Confirmation"
                description="Require staff confirmation before an appointment is considered confirmed."
                checked={settings.requireAppointmentConfirmation}
                onChange={(v) =>
                  updateField("requireAppointmentConfirmation", v)
                }
              />
            </div>
          </section>

          {/* Notification Settings */}
          <section className="rounded-xl border border-slate-200 bg-white p-6">
            <div className="mb-5">
              <h2 className="text-xl font-semibold text-slate-800">
                Notification Preferences
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Choose which notifications the system should enable.
              </p>
            </div>

            <div className="space-y-4">
              <Toggle
                label="Email Notifications"
                description="Enable email notification preferences."
                checked={settings.emailNotifications}
                onChange={(v) =>
                  updateField("emailNotifications", v)
                }
              />

              <Toggle
                label="Appointment Notifications"
                description="Enable appointment-related notifications."
                checked={settings.appointmentNotifications}
                onChange={(v) =>
                  updateField("appointmentNotifications", v)
                }
              />

              <Toggle
                label="Prescription Notifications"
                description="Enable prescription-related notifications."
                checked={settings.prescriptionNotifications}
                onChange={(v) =>
                  updateField("prescriptionNotifications", v)
                }
              />
            </div>
          </section>

          {/* Save Actions */}
          <div className="flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white p-5">
            <div>
              {saved ? (
                <p className="font-medium text-emerald-600">
                  Settings saved successfully.
                </p>
              ) : (
                <p className="text-sm text-slate-500">
                  Remember to save your changes.
                </p>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleReset}
                className="rounded-lg border border-slate-300 px-5 py-2.5 font-medium text-slate-700 hover:bg-slate-50"
              >
                Reset
              </button>

              <button
                onClick={handleSave}
                className="rounded-lg bg-blue-600 px-6 py-2.5 font-semibold text-white hover:bg-blue-700"
              >
                Save Settings
              </button>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-sm font-medium text-slate-700">
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="settings-input"
      />
    </div>
  );
}

function Toggle({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-0 last:pb-0">
      <div>
        <p className="font-medium text-slate-800">{label}</p>
        <p className="mt-1 text-sm text-slate-500">{description}</p>
      </div>

      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 shrink-0 accent-blue-600"
      />
    </label>
  );
}
