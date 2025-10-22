"use client";

import BarChartCustom from "@/components/chart/BarChart";
import LineChartCustom from "@/components/chart/LineChart";
import PieChartCustom from "@/components/chart/PieChart";
import { MonthPicker } from "@/components/month-picker";
import { YearPicker } from "@/components/year-picker";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

export default function Page() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());

  const { data: dataKenaikanPangkat } = useQuery({
    queryKey: ["kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  const { data: dataStatusDokumen } = useQuery({
    queryKey: ["status-dokumen-wajib", year],
    queryFn: async () =>
      await fetch(
        `/api/status-dokumen-wajib?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  const { data: dataStatusPegawai } = useQuery({
    queryKey: ["status-pegawai", year],
    queryFn: async () =>
      await fetch(
        `/api/status-pegawai?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  const { data: dataStatusKenaikanPangkat } = useQuery({
    queryKey: ["status-kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/status-kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}&month=${month}`
      ).then((res) => res.json()),
  });
  const { data: dataStatusSKKenaikanPangkat } = useQuery({
    queryKey: ["status-sk-kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/status-sk-kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}&month=${month}`
      ).then((res) => res.json()),
  });

  return (
    <>
      <div className="col-span-full bg-white flex justify-between items-center p-4 rounded-2xl shadow">
        <h1 className="text-lg">Tahunan</h1>
        <YearPicker value={year} onChange={setYear} />
      </div>
      <div className="w-full h-96 col-span-full bg-white p-4 rounded-2xl shadow">
        {dataKenaikanPangkat && (
          <LineChartCustom
            title="Jumlah Kenaikan Pangkat Pegawai"
            data={dataKenaikanPangkat}
          />
        )}
      </div>

      <div className="w-full h-96 col-span-full bg-white p-4 rounded-2xl shadow">
        {dataStatusDokumen && (
          <BarChartCustom
            title="Status Dokumen Per Bulan"
            data={dataStatusDokumen}
          />
        )}
      </div>

      <div className="col-span-full bg-white flex items-center p-4 rounded-2xl shadow">
        <h1 className="text-lg">Bulanan</h1>
        <MonthPicker value={month} onChange={setMonth} className="ml-auto" />
        <YearPicker value={year} onChange={setYear} />
      </div>

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
          data={dataStatusKenaikanPangkat ?? []}
          field="value"
        />
      </div>
      <div className="w-full h-100 col-span-4 flex justify-center items-center bg-white p-4 rounded-2xl shadow">
        <PieChartCustom
          title="Status SK Kenaikan Pangkat"
          data={dataStatusSKKenaikanPangkat ?? []}
          field="value"
        />
      </div>
    </>
  );
}
