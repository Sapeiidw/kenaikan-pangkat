import Link from "next/link";

export default async function Page() {
  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-6xl font-bold">
          Sistem Monitoring Kenaikan Pangkat
        </h1>
        <p className="text-2xl text-center">
          Sistem ini berfungsi untuk memantau kenaikan pangkat yang diterima
          oleh OPD agar dapat memantau kenaikan pangkat secara efektif.
        </p>
        <Link
          href={"/rsud"}
          className="m-4 bg-primary text-background px-4 py-2 rounded"
        >
          Get Started
        </Link>
      </div>
    </>
  );
}
