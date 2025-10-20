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

interface ValuePickerProps {
  value?: string; // <-- accept "value" instead of "initialValue"
  onChange?: (value: string) => void;
  className?: string;
}

export function YearPicker({ value, onChange, className }: ValuePickerProps) {
  const years = Array.from(
    { length: new Date().getFullYear() - 1945 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Select value={value} onValueChange={onChange}>
      <SelectTrigger className={cn("w-[180px] bg-white", className)}>
        <SelectValue placeholder="Select Year" />
      </SelectTrigger>
      <SelectContent>
        {years.map((year) => (
          <SelectItem key={year} value={String(year)}>
            {year}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
