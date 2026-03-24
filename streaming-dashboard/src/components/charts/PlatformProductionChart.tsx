import React from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { contentTypeColors } from "../../config/theme";
import { PlatformBreakdownRow } from "../../types";
import { ChartCard } from "../common/ChartCard";

type PlatformProductionChartProps = {
  data: PlatformBreakdownRow[];
};

export const PlatformProductionChart: React.FC<PlatformProductionChartProps> = ({ data }) => (
  <ChartCard title="Plattformvergleich nach Inhaltstyp" subtitle="Filme und TV-Serien sind in allen Balken farblich eindeutig getrennt">
    <div className="h-[320px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <XAxis dataKey="platform" tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
          <Tooltip
            contentStyle={{ backgroundColor: "#081220", border: "1px solid #24354E", borderRadius: 18 }}
            formatter={(value: number, name: string) => [value, name === "movie" ? "Filme" : "TV-Serien"]}
          />
          <Legend wrapperStyle={{ color: "#E6EEF8" }} />
          <Bar dataKey="movie" name="Filme" stackId="content" fill={contentTypeColors.movie} radius={[6, 6, 0, 0]} />
          <Bar dataKey="tv" name="TV-Serien" stackId="content" fill={contentTypeColors.series} radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  </ChartCard>
);
