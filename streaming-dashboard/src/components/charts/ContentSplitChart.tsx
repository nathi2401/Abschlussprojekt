import React from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { contentTypeColors } from "../../config/theme";
import { PlatformBreakdownRow } from "../../types";
import { ChartCard } from "../common/ChartCard";

type ContentSplitChartProps = {
  data: PlatformBreakdownRow[];
  movieCount: number;
  seriesCount: number;
};

type SplitTooltipProps = {
  active?: boolean;
  payload?: Array<{ name?: string; value?: number; color?: string }>;
};

const SplitTooltip: React.FC<SplitTooltipProps> = ({ active, payload }) => {
  if (!active || !payload || payload.length === 0) return null;

  const entry = payload[0];

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#081220] px-4 py-3 shadow-2xl">
      <div className="text-base font-semibold text-white">{entry.name}</div>
      <div className="mt-2 text-sm text-white">Titel: {entry.value}</div>
    </div>
  );
};

export const ContentSplitChart: React.FC<ContentSplitChartProps> = ({ data, movieCount, seriesCount }) => {
  const pieData = [
    { name: "Filme", value: movieCount, color: contentTypeColors.movie },
    { name: "TV-Serien", value: seriesCount, color: contentTypeColors.series }
  ];

  const renderLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent = 0, name = "" }) => {
    const radius = Number(innerRadius) + (Number(outerRadius) - Number(innerRadius)) * 0.58;
    const angle = (-Number(midAngle) * Math.PI) / 180;
    const x = Number(cx) + radius * Math.cos(angle);
    const y = Number(cy) + radius * Math.sin(angle);

    return (
      <text x={x} y={y} fill="#FFFFFF" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>
        {`${String(name)} ${Math.round(Number(percent) * 100)}%`}
      </text>
    );
  };

  return (
    <ChartCard title="Anteil Filme und TV-Serien" subtitle="Kreisdiagramm mit klar getrennten Farben für beide Inhaltstypen">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,260px)_minmax(0,1fr)]">
        <div className="min-w-0">
          <div className="h-[250px] sm:h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={62}
                  outerRadius={96}
                  paddingAngle={4}
                  label={renderLabel}
                  labelLine={false}
                >
                  {pieData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} stroke="#081220" />
                  ))}
                </Pie>
                <Tooltip content={<SplitTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-3 flex flex-wrap items-center justify-center gap-4 text-sm">
            {pieData.map((entry) => (
              <div key={entry.name} className="flex items-center gap-2 text-white">
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
                <span>{entry.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="grid min-w-0 gap-3 sm:grid-cols-2 xl:grid-cols-1">
          {[
            { label: "Filme", value: movieCount, color: contentTypeColors.movie },
            { label: "TV-Serien", value: seriesCount, color: contentTypeColors.series }
          ].map((entry) => (
            <div key={entry.label} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm uppercase tracking-[0.18em] text-white">{entry.label}</div>
                <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.color }} />
              </div>
              <div className="mt-3 text-3xl font-semibold text-white">{entry.value}</div>
            </div>
          ))}
          <div className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4 sm:col-span-2 xl:col-span-1">
            <div className="text-sm uppercase tracking-[0.18em] text-white">Nach Plattform</div>
            <div className="mt-3 space-y-3 text-sm text-white">
              {data.map((row) => (
                <div key={row.platform} className="flex items-start justify-between gap-3">
                  <span className="shrink-0">{row.platform}</span>
                  <span className="text-right">
                    {row.movie} Filme / {row.tv} TV-Serien
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
};
