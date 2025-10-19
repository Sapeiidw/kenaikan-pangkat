import BarChartCustom from "@/components/chart/BarChart";
import LineChartCustom from "@/components/chart/LineChart";
import PieChartCustom from "@/components/chart/PieChart";
import { kenaikan_pangkat, status_dokumen } from "@/db/schema";
import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export default async function Page() {
  // Get the Backend API User object when you need access to the user's information

  const dataKenaikanPangkat = await db
    .select({
      label: kenaikan_pangkat.bulan,
      value: sql<number>`SUM(kenaikan_pangkat.value)`.as("value"),
    })
    .from(kenaikan_pangkat)
    .groupBy(kenaikan_pangkat.tahun, kenaikan_pangkat.bulan)
    .orderBy(
      sql`CASE 
      WHEN ${kenaikan_pangkat.bulan} = 'Januari' THEN 1
      WHEN ${kenaikan_pangkat.bulan} = 'Februari' THEN 2
      WHEN ${kenaikan_pangkat.bulan} = 'Maret' THEN 3
      WHEN ${kenaikan_pangkat.bulan} = 'April' THEN 4
      WHEN ${kenaikan_pangkat.bulan} = 'Mei' THEN 5
      WHEN ${kenaikan_pangkat.bulan} = 'Juni' THEN 6
      WHEN ${kenaikan_pangkat.bulan} = 'Juli' THEN 7
      WHEN ${kenaikan_pangkat.bulan} = 'Agustus' THEN 8
      WHEN ${kenaikan_pangkat.bulan} = 'September' THEN 9
      WHEN ${kenaikan_pangkat.bulan} = 'Oktober' THEN 10
      WHEN ${kenaikan_pangkat.bulan} = 'November' THEN 11
      WHEN ${kenaikan_pangkat.bulan} = 'Desember' THEN 12
      ELSE 13
    END`
    );

  const dataStatusDokumen = await db
    .select({
      label: status_dokumen.bulan,
      berhasil: sql<number>`SUM(status_dokumen.berhasil)`.as("berhasil"),
      tidak_berhasil: sql<number>`SUM(status_dokumen.tidak_berhasil)`.as(
        "tidak_berhasil"
      ),
    })
    .from(status_dokumen)
    .groupBy(status_dokumen.tahun, status_dokumen.bulan)
    .orderBy(
      sql`CASE 
      WHEN ${status_dokumen.bulan} = 'Januari' THEN 1
      WHEN ${status_dokumen.bulan} = 'Februari' THEN 2
      WHEN ${status_dokumen.bulan} = 'Maret' THEN 3
      WHEN ${status_dokumen.bulan} = 'April' THEN 4
      WHEN ${status_dokumen.bulan} = 'Mei' THEN 5
      WHEN ${status_dokumen.bulan} = 'Juni' THEN 6
      WHEN ${status_dokumen.bulan} = 'Juli' THEN 7
      WHEN ${status_dokumen.bulan} = 'Agustus' THEN 8
      WHEN ${status_dokumen.bulan} = 'September' THEN 9
      WHEN ${status_dokumen.bulan} = 'Oktober' THEN 10
      WHEN ${status_dokumen.bulan} = 'November' THEN 11
      WHEN ${status_dokumen.bulan} = 'Desember' THEN 12
      ELSE 13
    END`
    );
  // Use `user` to render user details or create UI elements
  return (
    <>
      {/* <div className="flex justify-between items-center px-8 py-2 gap-4 sticky top-0 w-full bg-white shadow">
        <h1 className="text-xl">MAMANK US</h1>
        <UserButton showName />
      </div> */}
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
