"use client";

import { Button } from "@/components/ui/button";
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
import { DataTable } from "./data-table";
import { FormKenaikanPangkat } from "./form";

export default function Page() {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ["kenaikan-pangkat"],
    queryFn: async () =>
      await fetch(`/api/kenaikan-pangkat`).then((res) => res.json()),
  });

  const deleteMutation = useMutation({
    mutationKey: ["delete-kenaikan-pangkat"],
    mutationFn: async () => {
      const res = await fetch(`/api/kenaikan-pangkat/${init.id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      return res.json();
    },
    onSuccess: () => {
      toast.success("Data berhasil dihapus");
      queryClient.invalidateQueries({ queryKey: ["kenaikan-pangkat"] });
    },
    onError: () => {
      toast.error("Gagal menghapus data");
    },
  });

  const [init, setInit] = useState<KenaikanPangkat>({
    id: null,
    tahun: new Date().getFullYear(),
    bulan: "",
    id_opd: 0,
    nama_opd: "",
    value: 0,
  });

  type KenaikanPangkat = {
    id: number | null;
    tahun: number;
    bulan: string;
    id_opd: number;
    nama_opd: string;
    value: number;
  };
  const columns: ColumnDef<KenaikanPangkat>[] = [
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
      accessorKey: "value",
      header: "Value",
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
    <div className="max-w-1/2 mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Kenaikan Pangkat</h1>
      <FormKenaikanPangkat
        initialData={init}
        onSuccess={() =>
          setInit({
            id: null,
            tahun: new Date().getFullYear(),
            bulan: "",
            id_opd: 0,
            nama_opd: "",
            value: 0,
          })
        }
      />
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
