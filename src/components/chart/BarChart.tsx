"use client";
import { getChartColors } from "@/lib/utils";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useTheme } from "next-themes";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

interface ChartRecord {
  label: string;
  [key: string]: string | number;
}

interface ChartProps {
  title?: string;
  data: ChartRecord[];
}

export default function BarChartCustom({ title, data }: ChartProps) {
  const { theme } = useTheme();

  // Theme-based palettes
  const baseColors = getChartColors(theme);

  // Extract all keys except 'label' as datasets
  const keys = Object.keys(data[0] || {}).filter((k) => k !== "label");

  const datasets = keys.map((key, idx) => ({
    label: key,
    data: data.map((d) => Number(d[key] ?? 0)),
    backgroundColor: baseColors[idx % baseColors.length] + "cc",
    borderColor: baseColors[idx % baseColors.length],
    borderWidth: 1,
    borderRadius: 6,
  }));

  const chartData = {
    labels: data.map((d) => d.label),
    datasets,
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: title ? { display: true, text: title } : { display: false },
      tooltip: { mode: "index" as const, intersect: false },
    },
    scales: {
      x: { stacked: false, grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return <Bar data={chartData} options={options} />;
}
