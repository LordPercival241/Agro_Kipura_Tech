"use client";
import { useEffect, useRef } from "react";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from "chart.js";
import { Line } from "react-chartjs-2";
import type { HistoryEntry } from "@/hooks/useDashboardData";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function ChartSection({ history }: { history: HistoryEntry[] }) {
  const recent = history.slice(-30);

  const labels = recent.map((r) => {
    const d = new Date(r.timestamp);
    return `${d.getHours()}:${d.getMinutes().toString().padStart(2, "0")}:${d.getSeconds().toString().padStart(2, "0")}`;
  });

  const data = {
    labels,
    datasets: [
      {
        label: "Suelo (Valor RC)",
        data: recent.map((r) => r.raw.soil_m_analog),
        borderColor: "#2D8B4E",
        backgroundColor: "rgba(45, 139, 78, 0.06)",
        borderWidth: 2.5,
        tension: 0.4,
        fill: true,
        yAxisID: "y" as const,
        pointBackgroundColor: "#2D8B4E",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
      {
        label: "Déficit Presión VPD (kPa)",
        data: recent.map((r) => r.features.vpd_kpa),
        borderColor: "#C9A84C",
        backgroundColor: "rgba(201, 168, 76, 0.04)",
        borderWidth: 2,
        borderDash: [6, 4],
        tension: 0.4,
        yAxisID: "y1" as const,
        pointBackgroundColor: "#C9A84C",
        pointBorderColor: "#fff",
        pointBorderWidth: 2,
        pointRadius: 3,
        pointHoverRadius: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: "index" as const, intersect: false },
    plugins: {
      legend: {
        position: "top" as const,
        labels: { usePointStyle: true, pointStyle: "circle" as const, padding: 20, font: { size: 12, weight: 500 as const } },
      },
      tooltip: {
        backgroundColor: "rgba(44, 30, 20, 0.92)",
        titleColor: "#F5F1EB",
        bodyColor: "#A1887F",
        borderColor: "rgba(45, 139, 78, 0.25)",
        borderWidth: 1,
        padding: 14,
        cornerRadius: 10,
      },
    },
    scales: {
      y: { type: "linear" as const, display: true, position: "left" as const, title: { display: true, text: "Lectura Capacitiva Suelo" }, grid: { color: "rgba(93, 64, 55, 0.06)" } },
      y1: { type: "linear" as const, display: true, position: "right" as const, title: { display: true, text: "VPD (kPa)" }, grid: { drawOnChartArea: false } },
      x: { grid: { color: "rgba(93, 64, 55, 0.06)" }, ticks: { maxRotation: 45, font: { size: 10 } } },
    },
  };

  return (
    <section className="charts-section" id="charts">
      <div className="section-header"><h3>Dinámica Hídrica vs Estrés Atmosférico</h3></div>
      <div className="chart-wrapper">
        {recent.length > 0 ? <Line data={data} options={options} /> : <p style={{ textAlign: "center", color: "var(--text-muted)", padding: "4rem 0" }}>Esperando datos del sensor para generar gráfico...</p>}
      </div>
    </section>
  );
}
