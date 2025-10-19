"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import * as React from "react";

interface YearPickerProps {
  initialYear?: string;
  onChange?: (year: string) => void;
}

export function YearPicker({ initialYear, onChange }: YearPickerProps) {
  const [year, setYear] = React.useState(initialYear || "");

  const years = Array.from(
    { length: new Date().getFullYear() - 1945 + 1 },
    (_, i) => new Date().getFullYear() - i
  );

  function handleChange(value: string) {
    setYear(value);
    onChange?.(value); // Notify parent if provided
  }

  return (
    <Select value={year} onValueChange={handleChange}>
      <SelectTrigger className="w-[180px] bg-white">
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
