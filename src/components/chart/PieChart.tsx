"use client";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

// 12+ distinct colors (cycled if needed)
const COLORS = [
  "#4dc9f6",
  "#f67019",
  "#f53794",
  "#537bc4",
  "#acc236",
  "#166a8f",
  "#00a950",
  "#58595b",
  "#8549ba",
  "#e6194b",
  "#3cb44b",
  "#ffe119",
  "#4363d8",
  "#f58231",
  "#911eb4",
  "#46f0f0",
];

interface PieChartProps {
  title?: string;
  labels: string[];
  values: number[];
}

export default function PieChartCustom({
  title,
  labels,
  values,
}: PieChartProps) {
  const total = values.reduce((sum, v) => sum + v, 0);
  const data = {
    labels,
    datasets: [
      {
        data: values,
        backgroundColor: values.map((_, i) => COLORS[i % COLORS.length]),
        borderColor: values.map((_, i) => COLORS[i % COLORS.length]),
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { position: "right" as const },
      title: title ? { display: true, text: title } : { display: false },
    },
  };

  return <Pie data={data} options={options} />;
}
