"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

interface StatusPegawaiPickerProps {
  value?: string; // controlled by form
  onChange?: (value: string) => void;
  className?: string;
}

const options = [
  { value: "Diterima", label: "Diterima" },
  { value: "TMS", label: "TMS" },
  { value: "Berkas Verif", label: "Berkas Verif" },
  { value: "Menunggu TTD", label: "Menunggu TTD" },
  { value: "Sudah TTD", label: "Sudah TTD" },
];

export function StatusPegawaiPicker({
  value,
  onChange,
  className,
}: StatusPegawaiPickerProps) {
  return (
    <Select value={value ?? ""} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[180px] bg-white", className)}>
        <SelectValue placeholder="Select Status Pegawai" />
      </SelectTrigger>
      <SelectContent>
        {options.map((opt) => (
          <SelectItem key={opt.value} value={opt.value}>
            {opt.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
