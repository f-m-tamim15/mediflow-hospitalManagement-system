
import { Suspense } from "react";
import DoctorProfileClient from "./DoctorProfileClient";

export default function DoctorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-slate-100">
          Loading doctor profile...
        </div>
      }
    >
      <DoctorProfileContent params={params} />
    </Suspense>
  );
}

async function DoctorProfileContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  return <DoctorProfileClient doctorId={Number(id)} />;
}
