"use client";

import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { DataTable } from "@/components/data-table/data-table";
import { FormGolonganPegawai } from "@/components/form/golongan-pegawai";
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
  type GolonganPangkat = {
    id: number | null;
    periode: Date;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    golongan_i: number;
    golongan_ii: number;
    golongan_iii: number;
    golongan_iv: number;
  };

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<GolonganPangkat>({
    id: null,
    periode: new Date(),
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 3, // RSUD !hardcode
    nama_opd: "",
    golongan_i: 0,
    golongan_ii: 0,
    golongan_iii: 0,
    golongan_iv: 0,
  });

  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["golongan-pegawai"],
    queryFn: async () =>
      await fetch(`/api/golongan-pegawai?id_opd=3`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-golongan-pegawai"],
    mutationFn: async () => {
      const res = await fetch(`/api/golongan-pegawai/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({
        queryKey: ["golongan-pegawai"],
      });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const FormEdit = (data: GolonganPangkat) => {
    setIsOpenForm(true);
    setInit({ ...data, periode: new Date(data.periode) });
  };

  const columns: ColumnDef<GolonganPangkat>[] = [
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
      accessorKey: "golongan_i",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Golongan I" />
      ),
    },
    {
      accessorKey: "golongan_ii",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Golongan II" />
      ),
    },
    {
      accessorKey: "golongan_iii",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Golongan III" />
      ),
    },
    {
      accessorKey: "golongan_iv",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Golongan IV" />
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
      <h1 className="text-2xl font-bold col-span-full">Golongan Pegawai</h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Golongan Pegawai</DialogTitle>
            <DialogDescription>
              Tambahkan data golongan pegawai
            </DialogDescription>
            <FormGolonganPegawai
              initialData={init}
              onSuccess={() => {
                setIsOpenForm(false);
                setInit({
                  id: null,
                  periode: new Date(),
                  tahun: new Date().getFullYear(),
                  bulan: "",
                  id_opd: 3, // RSUD !hardcode
                  nama_opd: "",
                  golongan_i: 0,
                  golongan_ii: 0,
                  golongan_iii: 0,
                  golongan_iv: 0,
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
