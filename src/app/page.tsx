import BarChartCustom from "@/components/chart/BarChart";
import LineChartCustom from "@/components/chart/LineChart";
import PieChartCustom from "@/components/chart/PieChart";
import { kenaikan_pangkat, status_dokumen_wajib } from "@/db/schema";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

const dataKenaikanPangkat = await db
  .select({
    label: sql<string>`TRIM(TO_CHAR(DATE '2025-09-01', 'Month'))`.as("label"),
    value: sql<number>`SUM(kenaikan_pangkat.value)`.as("value"),
  })
  .from(kenaikan_pangkat)
  .groupBy(kenaikan_pangkat.periode)
  .orderBy(kenaikan_pangkat.periode);

const dataStatusDokumen = await db
  .select({
    label: sql<string>`TRIM(TO_CHAR(DATE '2025-09-01', 'Month'))`.as("label"),
    berhasil: sql<number>`SUM(status_dokumen_wajib.berhasil)`.as("berhasil"),
    tidak_berhasil: sql<number>`SUM(status_dokumen_wajib.tidak_berhasil)`.as(
      "tidak_berhasil"
    ),
  })
  .from(status_dokumen_wajib)
  .groupBy(status_dokumen_wajib.periode)
  .orderBy(status_dokumen_wajib.periode);

export default async function Page() {
  return (
    <>
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
    </>
  );
}
