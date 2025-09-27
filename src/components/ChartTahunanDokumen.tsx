"use client";
import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const rawData = [
  { month: "Januari", berhasil: 12, tidak: 1 },
  { month: "Februari", berhasil: 14, tidak: 1 },
  { month: "March", berhasil: 8, tidak: 2 },
  { month: "April", berhasil: 9, tidak: 3 },
  { month: "May", berhasil: 11, tidak: 1 },
  { month: "June", berhasil: 10, tidak: 2 },
  { month: "July", berhasil: 9, tidak: 1 },
  { month: "August", berhasil: 12, tidak: 0 },
  { month: "September", berhasil: 13, tidak: 0 },
  { month: "October", berhasil: 6, tidak: 1 },
  { month: "November", berhasil: 4, tidak: 2 },
  { month: "December", berhasil: 9, tidak: 3 },
];

export default function ChartTahunanDokumen() {
  const chartData = {
    labels: rawData.map((d) => d.month),
    datasets: [
      {
        label: "Berhasil",
        data: rawData.map((d) => d.berhasil),
        backgroundColor: "rgba(75, 192, 192, 0.7)",
      },
      {
        label: "Tidak Memenuhi Syarat",
        data: rawData.map((d) => d.tidak),
        backgroundColor: "rgba(255, 99, 132, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: "top" as const },
      title: { display: true, text: "Hasil Pegawai per Bulan" },
    },
  };

  return <Bar data={chartData} options={options} />;

  // return (
  //   <div className="space-y-6">
  //     {/* Chart */}
  //     <Bar data={chartData} options={options} />

  //     {/* Table */}
  //     <div className="overflow-x-auto">
  //       <table className="min-w-full border-collapse border border-gray-300 text-sm">
  //         <thead className="bg-gray-100">
  //           <tr>
  //             <th className="border border-gray-300 px-3 py-2">Bulan</th>
  //             <th className="border border-gray-300 px-3 py-2">Berhasil</th>
  //             <th className="border border-gray-300 px-3 py-2">
  //               Tidak Memenuhi Syarat
  //             </th>
  //           </tr>
  //         </thead>
  //         <tbody>
  //           {rawData.map((row, i) => (
  //             <tr key={i} className="text-center">
  //               <td className="border border-gray-300 px-3 py-2">
  //                 {row.month}
  //               </td>
  //               <td className="border border-gray-300 px-3 py-2">
  //                 {row.berhasil}
  //               </td>
  //               <td className="border border-gray-300 px-3 py-2">
  //                 {row.tidak}
  //               </td>
  //             </tr>
  //           ))}
  //         </tbody>
  //       </table>
  //     </div>
  //   </div>
  // );
}
