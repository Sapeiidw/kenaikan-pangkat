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
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import z4 from "zod/v4";

export const formSchema = z4.object({
  id: z4.number().nullish(), // Add optional id for update
  tahun: z4.coerce.number<number>().min(2000, "Minimal tahun 2000"),
  bulan: z4.string().min(1, "Bulan tidak boleh kosong"),
  id_opd: z4.coerce.number<number>().min(1, "OPD harus dipilih"),
  berhasil: z4.coerce.number<number>().min(0),
  tidak_berhasil: z4.coerce.number<number>().min(0),
});

type FormData = z4.infer<typeof formSchema>;

interface FormStatusDokumenProps {
  initialData?: FormData; // pass this if editing
  onSuccess?: () => void; // callback after successful submission
}

export function FormStatusDokumen({
  initialData,
  onSuccess,
}: FormStatusDokumenProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id
        ? `/api/status-dokumen/${data.id}`
        : "/api/status-dokumen";

      const response = await fetch(url, {
        method,
        body: JSON.stringify(data),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    },
    onSuccess: () => {
      toast.success(initialData ? "Update berhasil!" : "Data berhasil dibuat!");
      form.reset();
      queryClient.invalidateQueries({ queryKey: ["status-dokumen"] });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      tahun: new Date().getFullYear(),
      bulan: "",
      id_opd: 0,
      berhasil: 0,
      tidak_berhasil: 0,
    },
  });

  // If initialData changes (e.g. opening modal with different data), reset form
  useEffect(() => {
    if (initialData) {
      form.reset(initialData);
    }
  }, [initialData, form]);

  const { data: dataOpd } = useQuery({
    queryKey: ["opd"],
    queryFn: async () => await fetch(`/api/opd`).then((res) => res.json()),
  });

  const onSubmit = (data: FormData) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto bg-white p-6 rounded-md shadow w-full"
      >
        {/* Hidden ID field for updates */}
        {initialData?.id && <input type="hidden" {...form.register("id")} />}

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
                    dataOpd.map(
                      (opd: { id: number; nama: string; singatan: string }) => (
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
        <Button type="submit" disabled={mutation.isPending}>
          {mutation.isPending
            ? initialData
              ? "Menyimpan..."
              : "Membuat..."
            : "Simpan"}
        </Button>
      </form>
    </Form>
  );
}
