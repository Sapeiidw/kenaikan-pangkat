"use client";

import BarChartCustom from "@/components/chart/BarChart";
import LineChartCustom from "@/components/chart/LineChart";
import PieChartCustom from "@/components/chart/PieChart";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { MonthPicker } from "@/components/month-picker";
import { YearPicker } from "@/components/year-picker";
import { useQuery } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { useState } from "react";

export default function Page() {
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [month, setMonth] = useState((new Date().getMonth() + 1).toString());

  // Kenaikan Pangkat
  const { data: dataKenaikanPangkat } = useQuery({
    queryKey: ["kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  // Status Dokumen
  const { data: dataStatusDokumen } = useQuery({
    queryKey: ["status-dokumen-wajib", year],
    queryFn: async () =>
      await fetch(
        `/api/status-dokumen-wajib?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  // Status Kenaikan Pangkat
  const { data: dataStatusKenaikanPangkat } = useQuery({
    queryKey: ["status-kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/status-kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}&month=${month}`
      ).then((res) => res.json()),
  });

  // Status SK Kenaikan Pangkat
  const { data: dataStatusSKKenaikanPangkat } = useQuery({
    queryKey: ["status-sk-kenaikan-pangkat", year],
    queryFn: async () =>
      await fetch(
        `/api/status-sk-kenaikan-pangkat?for=dashboard&id_opd=3&year=${year}&month=${month}`
      ).then((res) => res.json()),
  });

  // Golongan Pegawai
  const { data: dataGolonganPegawai } = useQuery({
    queryKey: ["golongan-pegawai", year],
    queryFn: async () =>
      await fetch(
        `/api/golongan-pegawai?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  // Status Pegawai
  const { data: dataStatusPegawai } = useQuery({
    queryKey: ["status-pegawai", year],
    queryFn: async () =>
      await fetch(
        `/api/status-pegawai?for=dashboard&id_opd=3&year=${year}`
      ).then((res) => res.json()),
  });

  const columns: ColumnDef<unknown>[] = [
    {
      accessorKey: "tahun",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tahun" />
      ),
      cell: ({ row }) => {
        return new Date(row.getValue("periode")).getFullYear();
      },
    },
    {
      accessorKey: "periode",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Bulan" />
      ),
      cell: ({ row }) => {
        return new Date(row.getValue("periode")).toLocaleDateString("id-ID", {
          month: "long",
        });
      },
    },
    {
      accessorKey: "nama_opd",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama OPD" />
      ),
    },
    {
      accessorKey: "nama",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nama" />
      ),
    },
    {
      accessorKey: "nip",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="NIP" />
      ),
    },
    {
      accessorKey: "golongan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Golongan" />
      ),
    },
    {
      accessorKey: "status",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Status" />
      ),
    },
    {
      accessorKey: "keterangan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Keterangan" />
      ),
    },
  ];
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
          title="Golongan Pegawai"
          data={dataGolonganPegawai ?? []}
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
      <div className="w-full col-span-full flex flex-col bg-white p-4 rounded-2xl shadow">
        <h1>Status Pegawai</h1>
        {dataStatusPegawai && (
          <DataTable columns={columns} data={dataStatusPegawai} />
        )}
      </div>
    </>
  );
}
