"use client";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type KenaikanPangkat = {
  id: string;
  tahun: number;
  bulan: string;
  id_opd: number;
  nama_opd: string;
  berhasil: number;
  tidak_berhasil: number;
};

export const columns: ColumnDef<KenaikanPangkat>[] = [
  {
    accessorKey: "tahun",
    header: "Tahun",
  },
  {
    accessorKey: "bulan",
    header: "Bulan",
  },
  {
    accessorKey: "nama_opd",
    header: "Nama OPD",
  },
  {
    accessorKey: "berhasil",
    header: "Berhasil",
  },
  {
    accessorKey: "tidak_berhasil",
    header: "Tidak Berhasil",
  },
];
