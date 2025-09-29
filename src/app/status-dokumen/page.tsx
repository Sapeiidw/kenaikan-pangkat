"use client";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z4 from "zod/v4";
import { columns } from "./columns";
import { DataTable } from "./data-table";

// ✅ Schema with coercion for all number fields
export const formSchema = z4.object({
  tahun: z4.coerce.number<number>().min(2000, "Minimal tahun 2000"),
  bulan: z4.string().min(1, "Bulan tidak boleh kosong"),
  id_opd: z4.coerce.number<number>().min(1, "OPD harus dipilih"),
  berhasil: z4.coerce.number<number>().min(0),
  tidak_berhasil: z4.coerce.number<number>().min(0),
});

type FormData = z4.infer<typeof formSchema>;

export async function createStatusDokumen(data: z4.infer<typeof formSchema>) {
  const response = await fetch("/api/status-dokumen", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`Failed to create: ${response.status} - ${errorBody}`);
  }

  return response.json();
}

export default function Page() {
  const mutation = useMutation({
    mutationFn: createStatusDokumen,
    onSuccess: () => {
      toast.success("Success! Create Status Dokumen");
      form.reset();
    },
    onError: () => {
      toast.error("Failed to submit the form. Please try again.");
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun: new Date().getFullYear(),
      bulan: "",
      id_opd: 0,
      berhasil: 0,
      tidak_berhasil: 0,
    },
  });

  const onSubmit = async (data: FormData) => {
    mutation.mutate(data);
  };

  const { data: dataOpd } = useQuery({
    queryKey: ["opd"],
    queryFn: async () => await fetch(`/api/opd`).then((res) => res.json()),
  });

  const { data } = useQuery({
    queryKey: ["status-dokumen"],
    queryFn: async () =>
      await fetch(`/api/status-dokumen`).then((res) => res.json()),
  });

  return (
    <div className="max-w-1/2 mx-auto p-4 flex flex-col gap-4">
      <h1 className="text-2xl font-bold">Status Dokumen</h1>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-6 mx-auto bg-white p-6 rounded-md shadow w-full"
        >
          <FormField
            name="tahun"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Contoh: 2025"
                    {...field}
                    onChange={(e) => field.onChange(e.target.valueAsNumber)}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="bulan"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bulan</FormLabel>
                <FormControl>
                  <Input placeholder="Contoh: Januari" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="id_opd"
            render={({ field }) => (
              <FormItem>
                <FormLabel>OPD</FormLabel>
                <FormControl>
                  <select
                    {...field}
                    className="w-full rounded border px-3 py-2 text-sm"
                  >
                    <option value="">Pilih OPD</option>
                    {dataOpd &&
                      dataOpd?.map(
                        (opd: {
                          id: number;
                          nama: string;
                          singatan: string;
                        }) => (
                          <option key={opd.id} value={opd.id}>
                            {opd.nama}
                          </option>
                        )
                      )}
                  </select>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="berhasil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Berhasil</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            name="tidak_berhasil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tidak Berhasil</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit">Simpan</Button>
        </form>
      </Form>
      {data && <DataTable columns={columns} data={data} />}
    </div>
  );
}
