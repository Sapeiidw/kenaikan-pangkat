"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FormStatusDokumenWajib } from "@/components/form/status-dokumen-wajib";
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
  type StatusDokumen = {
    id: number | null;
    periode: Date;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    berhasil: number;
    tidak_berhasil: number;
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<StatusDokumen>({
    id: null,
    periode: new Date(),
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 2, // DISDIK !hardcode
    nama_opd: "",
    berhasil: 0,
    tidak_berhasil: 0,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["status-dokumen-wajib"],
    queryFn: async () =>
      await fetch(`/api/status-dokumen-wajib`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-status-dokumen-wajib"],
    mutationFn: async () => {
      const res = await fetch(`/api/status-dokumen-wajib/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["status-dokumen-wajib"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const FormEdit = (data: StatusDokumen) => {
    setIsOpenForm(true);
    setInit({ ...data, periode: new Date(data.periode) });
  };

  const columns: ColumnDef<StatusDokumen>[] = [
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
      accessorKey: "berhasil",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Berhasil" />
      ),
    },
    {
      accessorKey: "tidak_berhasil",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tidak Berhasil" />
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
      <h1 className="text-2xl font-bold col-span-full">Status Dokumen Wajib</h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Status Dokumen Wajib</DialogTitle>
            <DialogDescription>
              Tambahkan data golongan pegawai
            </DialogDescription>
            <FormStatusDokumenWajib
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
                  berhasil: 0,
                  tidak_berhasil: 0,
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
