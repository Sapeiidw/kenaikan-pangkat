"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FormStatusKenaikanPangkat } from "@/components/form/status-kenaikan-pangkat";
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
  type StatusKenaikanPangkat = {
    id: number | null;
    periode: Date;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    input_berkas: number;
    berkas_disimpan: number;
    bts: number;
    sudah_ttd_pertek: number;
    tms: number;
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<StatusKenaikanPangkat>({
    id: null,
    periode: new Date(),
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 2, // DISDIK !hardcode
    nama_opd: "",
    input_berkas: 0,
    berkas_disimpan: 0,
    bts: 0,
    sudah_ttd_pertek: 0,
    tms: 0,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["status-kenaikan-pangkat"],
    queryFn: async () =>
      await fetch(`/api/status-kenaikan-pangkat`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-status-kenaikan-pangkat"],
    mutationFn: async () => {
      const res = await fetch(`/api/status-kenaikan-pangkat/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["status-kenaikan-pangkat"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const FormEdit = (data: StatusKenaikanPangkat) => {
    setIsOpenForm(true);
    setInit({ ...data, periode: new Date(data.periode) });
  };

  const columns: ColumnDef<StatusKenaikanPangkat>[] = [
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
      accessorKey: "input_berkas",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Input Berkas" />
      ),
    },
    {
      accessorKey: "berkas_disimpan",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Berkas Disimpan" />
      ),
    },
    {
      accessorKey: "bts",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="BTS" />
      ),
    },
    {
      accessorKey: "sudah_ttd_pertek",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Sudah TTD" />
      ),
    },
    {
      accessorKey: "tms",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="TMS" />
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
        Status Kenaikan Pangkat
      </h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Status Kenaikan Pangkat</DialogTitle>
            <DialogDescription>
              Tambahkan data status sk kenaikan pangkat
            </DialogDescription>
            <FormStatusKenaikanPangkat
              initialData={init}
              onSuccess={() => {
                setIsOpenForm(false);
                setInit({
                  id: null,
                  periode: new Date(),
                  tahun: new Date().getFullYear(),
                  bulan: "",
                  id_opd: 2, // DISDIK !hardcode
                  nama_opd: "",
                  input_berkas: 0,
                  berkas_disimpan: 0,
                  bts: 0,
                  sudah_ttd_pertek: 0,
                  tms: 0,
                });
              }}
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
