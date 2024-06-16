"use client";

import { useEffect, useState } from "react";
import { SnapshotType } from "@/types";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
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

export default function SnapshotChart({ data }: { data: SnapshotType[] }) {
  const [chartData, setChartData] = useState<any>(null);
  useEffect(() => {
    const latestEntries = new Map<string, SnapshotType>();

    data.forEach((item) => {
      const existing = latestEntries.get(item.date);
      if (!existing || item.id > existing.id) {
        latestEntries.set(item.date, item);
      }
    });

    const labels: string[] = [];
    const passedData: number[] = [];
    const failedData: number[] = [];
    const todoData: number[] = [];
    const unverifiedData: number[] = [];

    latestEntries.forEach((item) => {
      labels.push(item.date);
      passedData.push(item.passed.length);
      failedData.push(item.failed.length);
      todoData.push(item.todo.length);
      unverifiedData.push(item.unverified.length);
    });

    setChartData({
      labels,
      datasets: [
        {
          label: "Passed",
          data: passedData,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
        },
        {
          label: "Failed",
          data: failedData,
          backgroundColor: "rgba(255, 99, 132, 0.6)",
        },
        {
          label: "To Do",
          data: todoData,
          backgroundColor: "rgba(255, 206, 86, 0.6)",
        },
        {
          label: "Unverified",
          data: unverifiedData,
          backgroundColor: "rgba(153, 102, 255, 0.6)",
        },
      ],
    });
  }, [data]);
  return (
    <div className="">
      {chartData && (
        <Bar
          width="100%"
          aria-label="snapshot-chart"
          height="37%"
          data={chartData}
          options={{
            plugins: {
              title: {
                display: true,
                text: "Test Results by Date",
              },
              tooltip: {
                mode: "index",
                intersect: false,
              },
              legend: {
                display: true,
                position: "top",
              },
            },
            responsive: true,
            scales: {
              x: {
                stacked: true,
              },
              y: {
                stacked: true,
              },
            },
          }}
        />
      )}
    </div>
  );
}
