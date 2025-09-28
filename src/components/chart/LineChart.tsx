"use client";
import { getChartColors } from "@/lib/utils";
import {
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useTheme } from "next-themes";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
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

export default function LineChartCustom({ title, data }: ChartProps) {
  const { theme } = useTheme();

  // Theme-based palettes
  const baseColors = getChartColors(theme);

  // Extract all keys except 'label'
  const keys = Object.keys(data[0] || {}).filter((k) => k !== "label");

  const datasets = keys.map((key, idx) => ({
    label: key,
    data: data.map((d) => Number(d[key] ?? 0)),
    borderColor: baseColors[idx % baseColors.length],
    backgroundColor: baseColors[idx % baseColors.length] + "55",
    fill: false, // keep lines distinct
    tension: 0.3,
    pointRadius: 4,
    pointHoverRadius: 6,
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
    interaction: {
      mode: "index" as const,
      intersect: false,
    },
    scales: {
      x: { grid: { display: false } },
      y: { beginAtZero: true },
    },
  };

  return <Line data={chartData} options={options} />;
}
