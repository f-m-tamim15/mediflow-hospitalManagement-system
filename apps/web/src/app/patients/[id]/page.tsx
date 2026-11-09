
import { Suspense } from "react";
import PatientDetailsClient from "./PatientDetailsClient";

export default function PatientDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          Loading patient details...
        </div>
      }
    >
      <PatientDetailsContent params={params} />
    </Suspense>
  );
}

async function PatientDetailsContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const patientId = Number(id);

  if (!Number.isInteger(patientId) || patientId <= 0) {
    return <div>Invalid patient ID.</div>;
  }

  return <PatientDetailsClient patientId={patientId} />;
}
