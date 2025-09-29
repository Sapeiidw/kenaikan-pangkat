import BarChartCustom from "@/components/chart/BarChart";
import LineChartCustom from "@/components/chart/LineChart";
import PieChartCustom from "@/components/chart/PieChart";
import { kenaikan_pangkat, status_dokumen, testTable } from "@/db/schema";
import { db } from "@/lib/db";
import { UserButton } from "@clerk/nextjs";
import { auth, currentUser } from "@clerk/nextjs/server";
import { sql } from "drizzle-orm";
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

  const dataKenaikanPangkat = await db
    .select({
      label: kenaikan_pangkat.bulan,
      value: sql<number>`SUM(kenaikan_pangkat.value)`.as("value"),
    })
    .from(kenaikan_pangkat)
    .groupBy(kenaikan_pangkat.tahun, kenaikan_pangkat.bulan);

  const dataStatusDokumen = await db
    .select({
      label: status_dokumen.bulan,
      berhasil: sql<number>`SUM(status_dokumen.berhasil)`.as("berhasil"),
      tidak_berhasil: sql<number>`SUM(status_dokumen.tidak_berhasil)`.as(
        "tidak_berhasil"
      ),
    })
    .from(status_dokumen)
    .groupBy(status_dokumen.tahun, status_dokumen.bulan);
  // Use `user` to render user details or create UI elements
  return (
    <>
      <div className="flex justify-between items-center px-8 py-2 gap-4 sticky top-0 w-full bg-white shadow">
        <h1 className="text-xl">MAMANK US</h1>
        <UserButton showName />
      </div>
      <div className="grid grid-cols-12 gap-4 bg-neutral-200 p-8">
        <div className="w-full h-96 col-span-8 bg-white p-4 rounded-2xl shadow">
          {dataKenaikanPangkat && (
            <LineChartCustom
              title="Jumlah Kenaikan Pangkat Pegawai"
              data={dataKenaikanPangkat}
            />
          )}
        </div>
        <div className="w-full h-96 col-span-4 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
          <PieChartCustom
            title="Status Kenaikan Pangkat"
            data={[
              { label: "Input Berkas", value: 7 },
              { label: "Berkas Disimpan", value: 2 },
              { label: "BTS", value: 2 },
              { label: "Sudah TTD Pertek", value: 4 },
            ]}
            field="value"
          />
        </div>
        <div className="w-full h-96 col-span-full bg-white p-4 rounded-2xl shadow">
          {dataStatusDokumen && (
            <BarChartCustom
              title="Status Dokumen Per Bulan"
              data={dataStatusDokumen}
            />
          )}
        </div>

        {/* Three-column section */}

        <div className="w-full h-100 col-span-4 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
          <PieChartCustom
            title="Dokumen Terverifikasi - Bulan Mei"
            data={[
              { label: "Terverifikasi", value: 15 },
              { label: "Tidak Memenuhi Syarat", value: 3 },
            ]}
            field="value"
          />
        </div>
        <div className="w-full h-100 col-span-4 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
          <PieChartCustom
            title="Status Kenaikan Pangkat"
            data={[
              { label: "Input Berkas", value: 7 },
              { label: "Berkas Disimpan", value: 2 },
              { label: "BTS", value: 2 },
              { label: "Sudah TTD Pertek", value: 4 },
              { label: "TMS", value: 1 },
            ]}
            field="value"
          />
        </div>
        <div className="w-full h-100 col-span-4 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
          <PieChartCustom
            title="Status SK Kenaikan Pangkat - Bulan Mei"
            data={[
              { label: "Sudah TTD Pertek", value: 15 },
              { label: "Belum TTD Pertek", value: 3 },
            ]}
            field="value"
          />
        </div>
      </div>
    </>
  );
}
