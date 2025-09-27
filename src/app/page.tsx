import PieChartCustom from "@/components/chart/PieChart";
import ChartPegawaiKenaikanPangkat from "@/components/ChartPegawaiNaikPangkat";
import ChartTahunanDokumen from "@/components/ChartTahunanDokumen";
import { testTable } from "@/db/schema";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import Link from "next/link";

export default async function Page() {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth();

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return (
      <>
        <div>Sign In to view this page</div>
        <br />
        <Link
          className="bg-neutral-900 text-white rounded p-2 m-2"
          href={"/sign-in"}
        >
          Sign In
        </Link>
        <Link
          className="bg-neutral-900 text-white rounded p-2 m-2"
          href={"/sign-up"}
        >
          Sign Up
        </Link>
      </>
    );
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  const dataTest = await db.select().from(testTable);

  // Use `user` to render user details or create UI elements
  return (
    <>
      <div className="flex items-center px-8 py-2 gap-4 sticky top-0 w-full bg-white shadow">
        <h1 className="text-xl">MAMANK US</h1>
        <span className="ml-auto text-xs ">{user?.fullName}</span>
        <UserButton showName />
      </div>
      <div className="grid grid-flow-row gap-4 bg-neutral-200 p-8">
        <div className="grid grid-cols-3 gap-4">
          <div className="w-full h-96 col-span-2 bg-white p-4 rounded-2xl shadow">
            <ChartPegawaiKenaikanPangkat />
          </div>
          <div className="w-full h-96 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
            <PieChartCustom
              title="Status Kenaikan Pangkat"
              labels={[
                "Input Berkas",
                "Berkas Disimpan",
                "BTS",
                "Sudah TTD Pertek",
                "TMS",
              ]}
              values={[7, 2, 2, 4, 1]}
            />
          </div>
        </div>
        <div className="w-full h-96 bg-white p-4 rounded-2xl shadow">
          <ChartTahunanDokumen />
        </div>

        {/* Three-column section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="w-full h-auto flex justify-center items-center bg-white p-4 rounded-2xl shadow">
            <PieChartCustom
              title="Dokumen Terverifikasi - Bulan Mei"
              labels={["Terverifikasi", "Tidak Memenuhi Syarat"]}
              values={[15, 3]}
            />
          </div>
          <div className="w-full h-auto flex justify-center items-center bg-white p-4 rounded-2xl shadow">
            <PieChartCustom
              title="Status Kenaikan Pangkat"
              labels={[
                "Input Berkas",
                "Berkas Disimpan",
                "BTS",
                "Sudah TTD Pertek",
                "TMS",
              ]}
              values={[7, 2, 2, 4, 1]}
            />
          </div>
          <div className="w-full h-auto flex justify-center items-center bg-white p-4 rounded-2xl shadow">
            <PieChartCustom
              title="Status SK Kenaikan Pangkat - Bulan Mei"
              labels={["Sudah TTD Pertek", "Belum TTD Pertek"]}
              values={[15, 3]}
            />
          </div>
        </div>
      </div>
    </>
  );
}
