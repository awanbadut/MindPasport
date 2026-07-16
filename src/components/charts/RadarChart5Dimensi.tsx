'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';

export interface DimensionScore {
  dimension: string;   // key
  label: string;       // display name
  score: number;       // 0–100
  fullMark?: number;
}

interface RadarChart5DimensiProps {
  data: DimensionScore[];
  height?: number;
  showLegend?: boolean;
  compareData?: DimensionScore[]; // optional second dataset for comparison
  primaryLabel?: string;
  compareLabel?: string;
  animated?: boolean;
  className?: string;
}

// Custom tooltip
const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: Array<{ payload: DimensionScore; value: number; name: string }>;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white/95 backdrop-blur-sm border border-slate-200 rounded-lg p-3 shadow-lg">
      <p className="text-xs font-semibold text-slate-600 mb-1">{payload[0].payload.label}</p>
      {payload.map((p) => (
        <div key={p.name} className="flex items-center gap-2 text-sm">
          <span className="font-bold text-slate-900">{Math.round(p.value)}</span>
          <span className="text-slate-400 text-xs">/ 100</span>
        </div>
      ))}
    </div>
  );
};

// Custom angle axis tick
const CustomAngleTick = ({
  x,
  y,
  payload,
  textAnchor,
}: {
  x?: number;
  y?: number;
  payload?: { value: string };
  textAnchor?: "end" | "start" | "inherit" | "middle";
}) => {
  if (!payload) return null;
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor ?? 'middle'}
      fill="#475569"
      fontSize={12}
      fontWeight={600}
      fontFamily="Inter, sans-serif"
    >
      {payload.value}
    </text>
  );
};

export function RadarChart5Dimensi({
  data,
  height = 340,
  showLegend = false,
  compareData,
  primaryLabel = 'Skor Anda',
  compareLabel = 'Rata-rata',
  className = '',
}: RadarChart5DimensiProps) {
  // Merge primary and compare into recharts-compatible format
  const chartData = data.map((d) => {
    const compare = compareData?.find((c) => c.dimension === d.dimension);
    return {
      subject: d.label,
      score: d.score,
      fullMark: d.fullMark ?? 100,
      ...(compare ? { compareScore: compare.score } : {}),
    };
  });

  return (
    <div className={['w-full', className].filter(Boolean).join(' ')}>
      <ResponsiveContainer width="100%" height={height}>
        <RadarChart data={chartData} cx="50%" cy="50%" outerRadius="72%">
          <PolarGrid
            stroke="#E2E8F0"
            strokeWidth={1}
            gridType="polygon"
          />
          <PolarAngleAxis
            dataKey="subject"
            tick={<CustomAngleTick />}
            tickLine={false}
          />
          <PolarRadiusAxis
            angle={90}
            domain={[0, 100]}
            tickCount={5}
            tick={{ fontSize: 10, fill: '#94A3B8' }}
            axisLine={false}
            tickLine={false}
          />

          {compareData && (
            <Radar
              name={compareLabel}
              dataKey="compareScore"
              stroke="#0EA5E9"
              fill="#0EA5E9"
              fillOpacity={0.1}
              strokeWidth={1.5}
              strokeDasharray="4 3"
              dot={false}
            />
          )}

          <Radar
            name={primaryLabel}
            dataKey="score"
            stroke="#4F46E5"
            fill="#4F46E5"
            fillOpacity={0.18}
            strokeWidth={2.5}
            dot={{ r: 4, fill: '#4F46E5', strokeWidth: 2, stroke: '#ffffff' }}
            activeDot={{ r: 6, fill: '#4F46E5', stroke: '#ffffff', strokeWidth: 2 }}
          />

          <Tooltip content={<CustomTooltip />} />
          {showLegend && (
            <Legend
              wrapperStyle={{ fontSize: 12, fontFamily: 'Inter, sans-serif', paddingTop: 12 }}
            />
          )}
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export default RadarChart5Dimensi;
