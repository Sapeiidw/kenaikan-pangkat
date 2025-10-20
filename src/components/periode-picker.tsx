"use client";

import * as React from "react";
import { MonthPicker } from "./month-picker";
import { YearPicker } from "./year-picker";
import { cn } from "@/lib/utils";

interface PeriodePickerProps {
  month?: string;
  year?: string;
  onChange?: (value: { month: string; year: string }) => void;
  className?: string;
}

export function PeriodePicker({
  month,
  year,
  onChange,
  className,
}: PeriodePickerProps) {
  function handleMonthChange(m: string) {
    onChange?.({ month: m, year: year ?? "" });
  }

  function handleYearChange(y: string) {
    onChange?.({ month: month ?? "", year: y });
  }

  return (
    <div className={cn("flex gap-2", className)}>
      <MonthPicker value={month} onChange={handleMonthChange} />
      <YearPicker value={year} onChange={handleYearChange} />
    </div>
  );
}
