"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FormStatusPegawai } from "@/components/form/status-pegawai";
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

import { useAuth } from "@clerk/nextjs";

export default function Page() {
  const user = useAuth();
  type StatusPegawai = {
    id: number | null;
    periode: Date;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    nama: string;
    nip: string;
    golongan: string;
    status: string;
    keterangan: string;
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<StatusPegawai>({
    id: null,
    periode: new Date(),
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 2, // DISDIK !hardcode
    nama_opd: "",
    nama: "",
    nip: "",
    golongan: "",
    status: "",
    keterangan: "",
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["status-pegawai"],
    queryFn: async () =>
      await fetch(`/api/status-pegawai?id_opd=2`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-status-pegawai"],
    mutationFn: async () => {
      const res = await fetch(`/api/status-pegawai/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["status-pegawai"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const FormEdit = (data: StatusPegawai) => {
    setIsOpenForm(true);
    setInit({ ...data, periode: new Date(data.periode) });
  };

  const columns: ColumnDef<StatusPegawai>[] = [
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
              <DropdownMenuItem
                onClick={() => FormEdit(row.original)}
                disabled={user.sessionClaims?.role !== "admin"}
              >
                Edit Data
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={user.sessionClaims?.role !== "admin"}
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
      <h1 className="text-2xl font-bold col-span-full">Status Pegawai</h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Status Pegawai</DialogTitle>
            <DialogDescription>Tambahkan data status pegawai</DialogDescription>
            <FormStatusPegawai
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
                  nama: "",
                  nip: "",
                  golongan: "",
                  status: "",
                  keterangan: "",
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
