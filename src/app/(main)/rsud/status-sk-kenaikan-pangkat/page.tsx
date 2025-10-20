"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FormStatusSKKenaikanPangkat } from "@/components/form/status-sk-kenaikan-pangkat";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ColumnDef } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Page() {
  // Golongan Pangkat
  // I,II , III, IV
  // Form
  // tahun bulan opd jumlah I II III IV
  //
  // Status SK Kenpa
  // tahun bulan opd sudah ttd, belum ttd
  //
  // Status Kenaikan Pangkat
  // tahun bulan opd input berkas, berkas disimpan, bts, sudah ttd pertek, tms
  //
  // Status Pegawai
  // nama, nip, golongan (I,II,III,IV) abcd, status (diterima, tms, berkas verif, menunggu ttd, sudah ttd), keterangan
  //
  // Golongan Pangkat
  // IA, IIA, IIIA, IVA

  type StatusSKKenaikanPangkat = {
    id: number | null;
    periode: Date;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    sudah_ttd_pertek: number;
    belum_ttd_pertek: number;
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<StatusSKKenaikanPangkat>({
    id: null,
    periode: new Date(),
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 3, // RSUD !hardcode
    nama_opd: "",
    sudah_ttd_pertek: 0,
    belum_ttd_pertek: 0,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["status-sk-kenaikan-pangkat"],
    queryFn: async () =>
      await fetch(`/api/status-sk-kenaikan-pangkat`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-status-sk-kenaikan-pangkat"],
    mutationFn: async () => {
      const res = await fetch(`/api/status-sk-kenaikan-pangkat/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["status-sk-kenaikan-pangkat"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const FormEdit = (data: StatusSKKenaikanPangkat) => {
    setIsOpenForm(true);
    setInit({ ...data, periode: new Date(data.periode) });
  };

  const columns: ColumnDef<StatusSKKenaikanPangkat>[] = [
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
      accessorKey: "sudah_ttd_pertek",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sudah TTD" />
      ),
    },
    {
      accessorKey: "belum_ttd_pertek",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Belum TTD" />
      ),
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(row.id)}
              >
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => FormEdit(row.original)}>
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setInit(row.original);
                  deleteMutation.mutate();
                }}
              >
                Hapus Data
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  return (
    <>
      <h1 className="text-2xl font-bold col-span-full">
        Status SK Kenaikan Pangkat
      </h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Kenaikan Pangkat</DialogTitle>
            <DialogDescription>
              Tambahkan data kenaikan pangkat
            </DialogDescription>
            <FormStatusSKKenaikanPangkat
              initialData={init}
              onSuccess={() =>
                setInit({
                  id: null,
                  periode: new Date(),
                  tahun: new Date().getFullYear(),
                  bulan: "",
                  id_opd: 0,
                  nama_opd: "",
                  sudah_ttd_pertek: 0,
                  belum_ttd_pertek: 0,
                })
              }
            />
          </DialogHeader>
        </DialogContent>
      </Dialog>
      <div className="col-span-full">
        {data && <DataTable columns={columns} data={data} />}
      </div>
    </>
  );
}
