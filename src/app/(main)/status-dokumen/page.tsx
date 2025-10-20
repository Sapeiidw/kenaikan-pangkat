"use client";

import { DataTable } from "@/components/data-table/data-table";
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
import { FormStatusDokumen } from "./form";

export default function Page() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["status-dokumen"],
    queryFn: async () =>
      await fetch(`/api/status-dokumen`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-status-dokumen"],
    mutationFn: async () => {
      const res = await fetch(`/api/status-dokumen/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["status-dokumen"] });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const [isOpenForm, setIsOpenForm] = useState(false);
  const [init, setInit] = useState<StatusDokumen>({
    id: null,
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 0,
    nama_opd: "",
    berhasil: 0,
    tidak_berhasil: 0,
  });

  type StatusDokumen = {
    id: number | null;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    berhasil: number;
    tidak_berhasil: number;
  };
  const columns: ColumnDef<StatusDokumen>[] = [
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
    {
      id: "actions",
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
              <DropdownMenuItem onClick={() => setInit(row.original)}>
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
      <h1 className="text-2xl font-bold col-span-full">Status Dokumen</h1>
      <Dialog open={isOpenForm} onOpenChange={setIsOpenForm}>
        <DialogTrigger asChild>
          <Button onClick={() => setIsOpenForm(true)}>Add</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Form Status Dokumen</DialogTitle>
            <DialogDescription>Tambahkan data status dokumen</DialogDescription>
            <FormStatusDokumen
              initialData={init}
              onSuccess={() =>
                setInit({
                  id: null,
                  tahun: new Date().getFullYear(),
                  bulan: "",
                  id_opd: 0,
                  nama_opd: "",
                  berhasil: 0,
                  tidak_berhasil: 0,
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
