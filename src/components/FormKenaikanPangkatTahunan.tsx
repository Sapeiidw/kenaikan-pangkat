"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  dokumenNaikPangkatDetailSchema,
  dokumenNaikPangkatSchema,
} from "@/db/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = dokumenNaikPangkatSchema.extend({
  detail: z.array(dokumenNaikPangkatDetailSchema).min(1),
});

async function createDokumenKenaikanPangkat(
  values: z.infer<typeof formSchema>
) {
  const res = await fetch("/api/kenaikan-pangkat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(values),
  });
  if (!res.ok) throw new Error("Failed to save data");
  return res.json();
}

export default function MyForm() {
  const mutation = useMutation({
    mutationFn: createDokumenKenaikanPangkat,
    onSuccess: (data) => {
      toast.success("Success! Create Dokumen Kenaikan Pangkat");
      form.reset();
    },
    onError: (error) => {
      toast.error("Failed to submit the form. Please try again.");
    },
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      tahun: new Date().getFullYear(),
      berhasil: 0,
      tidak_memenuhi_syarat: 0,
      detail: [
        {
          id_kenaikan_pangkat: 0,
          bulan: "januari",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "februari",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "maret",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "april",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "mei",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "juni",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "juli",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "agustus",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "september",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "oktober",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "november",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
        {
          id_kenaikan_pangkat: 0,
          bulan: "desember",
          berhasil: 0,
          tidak_memenuhi_syarat: 0,
        },
      ],
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  // useFieldArray to manage detail[]
  const { fields } = useFieldArray({
    control: form.control,
    name: "detail",
  });

  return (
    <>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 max-w-3xl mx-auto py-10"
        >
          <FormField
            control={form.control}
            name="tahun"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tahun</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Tahun e.g 2025"
                    type="number"
                    {...field}
                  />
                </FormControl>
                <FormDescription>
                  Tahun data kenaikan pangkat e.g 2025
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Detail Bulanan */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="border rounded-lg p-4 shadow-sm bg-white grid grid-flow-row gap-4"
              >
                <h3 className="font-semibold capitalize">{field.bulan}</h3>
                <FormField
                  control={form.control}
                  name={`detail.${index}.berhasil`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Berhasil</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`detail.${index}.tidak_memenuhi_syarat`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tidak Memenuhi Syarat</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            ))}
          </div>

          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="grid grid-flow-cols">
        <pre>{JSON.stringify(form.formState.errors, null, 2)}</pre>
        <pre>{JSON.stringify(form.getValues(), null, 2)}</pre>
      </div>
    </>
  );
}
