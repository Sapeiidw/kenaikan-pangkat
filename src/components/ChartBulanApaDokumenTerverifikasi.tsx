"use client";
import { ArcElement, Chart as ChartJS, Legend, Title, Tooltip } from "chart.js";
import { Pie } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend, Title);

const data = {
  labels: ["Terverifikasi", "Tidak Memenuhi Syarat"],
  datasets: [
    {
      data: [15, 3],
      backgroundColor: ["rgba(75, 192, 192, 0.7)", "rgba(255, 99, 132, 0.7)"],
      borderColor: ["rgba(75, 192, 192, 1)", "rgba(255, 99, 132, 1)"],
      borderWidth: 1,
    },
  ],
};

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Dokumen Terverifikasi - Bulan Mei" },
  },
};

export default function ChartBulanApaDokumenTerverifikasi() {
  return <Pie data={data} options={options} />;
}
