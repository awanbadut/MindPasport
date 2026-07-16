"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface ChartItem {
  skillName: string;
  userScore: number;
  industryScore: number;
}

interface SkillGapBarChartProps {
  data: ChartItem[];
  height?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-neutral-200 rounded-lg shadow-lg text-xs">
        <p className="font-semibold text-neutral-800 mb-1">{payload[0].payload.skillName}</p>
        <p className="text-indigo-600">Skor Anda: <span className="font-bold">{payload[0].value}</span></p>
        <p className="text-sky-500">Standar Industri: <span className="font-bold">{payload[1].value}</span></p>
      </div>
    );
  }
  return null;
};

export function SkillGapBarChart({ data, height = 300 }: SkillGapBarChartProps) {
  // Map data to recharts names
  const chartData = data.map(item => ({
    name: item.skillName,
    "Skor Anda": item.userScore,
    "Standar Industri": item.industryScore,
  }));

  return (
    <div className="w-full">
      <ResponsiveContainer width="100%" height={height}>
        <BarChart
          data={chartData}
          layout="vertical"
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#E2E8F0" />
          <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 10, fill: "#94A3B8" }} />
          <YAxis
            type="category"
            dataKey="name"
            width={120}
            tick={{ fontSize: 11, fill: "#475569", fontWeight: 500 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend wrapperStyle={{ fontSize: 11, paddingTop: 10 }} />
          <Bar dataKey="Skor Anda" fill="#4F46E5" radius={[0, 4, 4, 0]} barSize={12} />
          <Bar dataKey="Standar Industri" fill="#0EA5E9" radius={[0, 4, 4, 0]} barSize={12} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
