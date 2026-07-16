"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface HistoryItem {
  calculatedAt: string;
  finalScore: number;
}

interface ReadinessScoreLineChartProps {
  data: HistoryItem[];
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const dateStr = new Date(payload[0].payload.calculatedAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
    return (
      <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg text-xs">
        <p className="text-neutral-400 mb-1">{dateStr}</p>
        <p className="text-indigo-600 font-bold">Skor: {Math.round(payload[0].value)}</p>
      </div>
    );
  }
  return null;
};

export function ReadinessScoreLineChart({ data, height = 260 }: ReadinessScoreLineChartProps) {
  // Map values for chart
  const chartData = data.map(item => ({
    ...item,
    formattedDate: new Date(item.calculatedAt).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
    }),
    Score: Math.round(item.finalScore),
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
          <XAxis
            dataKey="formattedDate"
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            domain={[0, 100]}
            tick={{ fontSize: 10, fill: "#94A3B8" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Line
            type="monotone"
            dataKey="Score"
            stroke="#4F46E5"
            strokeWidth={3}
            dot={{ r: 4, fill: "#4F46E5", strokeWidth: 2, stroke: "#ffffff" }}
            activeDot={{ r: 6, strokeWidth: 2, stroke: "#ffffff", fill: "#4F46E5" }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
