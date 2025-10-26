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
import { YearPicker } from "../year-picker";
import { MonthPicker } from "../month-picker";

export const formSchema = z4.object({
  id: z4.number().nullish(), // Add optional id for update
  periode: z4.date(),
  tahun: z4.coerce.number<number>().min(1945, "Minimal tahun 1945"),
  bulan: z4.string().min(1, "Bulan tidak boleh kosong"),
  id_opd: z4.coerce.number<number>().min(1, "OPD harus dipilih"),
  value: z4.coerce.number<number>().min(0),
});

type FormData = z4.infer<typeof formSchema>;

interface FormUserProps {
  initialData?: FormData; // pass this if editing
  onSuccess?: () => void; // callback after successful submission
}

export function FormUser({ initialData, onSuccess }: FormUserProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (data: FormData) => {
      const method = data.id ? "PUT" : "POST";
      const url = data.id ? `/api/user/${data.id}` : "/api/user";

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
      queryClient.invalidateQueries({
        queryKey: ["user"],
      });
      onSuccess?.();
    },
    onError: () => {
      toast.error("Gagal menyimpan data. Silakan coba lagi.");
    },
  });

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      periode: new Date(),
      tahun: 0,
      bulan: "",
      id_opd: 0,
      value: 0,
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
    console.log(data, "data");
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-6 mx-auto w-full grid grid-cols-12 gap-x-4"
      >
        {/* Hidden ID field for updates */}
        {initialData?.id && <input type="hidden" {...form.register("id")} />}

        <FormField
          control={form.control}
          name="id_opd"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>OPD</FormLabel>
              <FormControl>
                <select
                  {...field}
                  className="w-full rounded border px-3 py-2 text-sm"
                  disabled={!!initialData!.id_opd}
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
          name="tahun"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Tahun</FormLabel>
              <FormControl>
                <YearPicker
                  className="w-full"
                  value={field.value.toString() ?? ""}
                  onChange={field.onChange}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="bulan"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Bulan</FormLabel>
              <FormControl>
                <MonthPicker
                  className="w-full"
                  value={field.value ? String(field.value) : ""}
                  onChange={(v) => field.onChange(v)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          name="value"
          render={({ field }) => (
            <FormItem className="col-span-full">
              <FormLabel>Kenaikan Pangkat</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  placeholder="0"
                  {...field}
                  required
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          className="col-span-6"
          type="submit"
          disabled={mutation.isPending}
        >
          {mutation.isPending
            ? initialData
              ? "Menyimpan..."
              : "Membuat..."
            : "Simpan"}
        </Button>
        <Button
          className="col-span-6"
          type="reset"
          onClick={() => form.reset()}
          variant={"destructive"}
        >
          Reset
        </Button>
      </form>
    </Form>
  );
}
