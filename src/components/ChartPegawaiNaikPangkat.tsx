"use client";
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

const data = [
  { month: "Januari", value: 13 },
  { month: "Februari", value: 15 },
  { month: "March", value: 10 },
  { month: "April", value: 12 },
  { month: "May", value: 12 },
  { month: "June", value: 12 },
  { month: "July", value: 8 },
  { month: "August", value: 12 },
  { month: "September", value: 13 },
  { month: "October", value: 7 },
  { month: "November", value: 6 },
  { month: "December", value: 12 },
];

export default function EmployeeLineChart() {
  const chartData = {
    labels: data.map((d) => d.month),
    datasets: [
      {
        label: "Jumlah Pegawai",
        data: data.map((d) => d.value),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        tension: 0.3, // smooth line
        fill: true, // area under line
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Jumlah Pegawai per Bulan" },
    },
  };

  return <Line data={chartData} options={options} />;
}
