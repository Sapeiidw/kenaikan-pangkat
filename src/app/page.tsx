import PieChartCustom from "@/components/chart/PieChart";
import ChartPegawaiKenaikanPangkat from "@/components/ChartPegawaiNaikPangkat";
import ChartTahunanDokumen from "@/components/ChartTahunanDokumen";
import { testTable } from "@/db/schema";
import { db } from "@/lib/db";
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function Page() {
  // Use `auth()` to access `isAuthenticated` - if false, the user is not signed in
  const { isAuthenticated } = await auth();

  // Protect the route by checking if the user is signed in
  if (!isAuthenticated) {
    return <div>Sign in to view this page</div>;
  }

  // Get the Backend API User object when you need access to the user's information
  const user = await currentUser();

  const dataTest = await db.select().from(testTable);

  // Use `user` to render user details or create UI elements
  return (
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
  );
}
