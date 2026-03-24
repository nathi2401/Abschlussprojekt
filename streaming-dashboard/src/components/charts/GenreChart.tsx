import React, { useMemo, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { platformColors } from "../../config/theme";
import { MediaItem } from "../../types";
import { buildGenreComparison } from "../../utils/analytics";
import { ChartCard } from "../common/ChartCard";

type GenreChartProps = {
  items: MediaItem[];
};

export const GenreChart: React.FC<GenreChartProps> = ({ items }) => {
  const [typeMode, setTypeMode] = useState<"All" | "Movie" | "TV Show">("All");
  const [valueMode, setValueMode] = useState<"absolute" | "percent">("absolute");

  const rawData = useMemo(() => buildGenreComparison(items, typeMode), [items, typeMode]);
  const chartData = useMemo(() => {
    if (valueMode === "absolute") return rawData;

    return rawData.map((row) => ({
      genre: row.genre,
      Netflix: row.total === 0 ? 0 : Math.round((row.Netflix / row.total) * 100),
      Amazon: row.total === 0 ? 0 : Math.round((row.Amazon / row.total) * 100),
      "Disney+": row.total === 0 ? 0 : Math.round((row["Disney+"] / row.total) * 100),
      total: row.total
    }));
  }, [rawData, valueMode]);

  return (
    <ChartCard
      title="Genre-Gegenüberstellung"
      subtitle="Top Genres im Plattformvergleich mit Umschaltung für Inhaltstyp und Wertebasis"
      action={
        <div className="flex flex-wrap gap-2">
          {(["All", "Movie", "TV Show"] as const).map((mode) => (
            <button
              key={mode}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${typeMode === mode ? "bg-sky-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:text-white"}`}
              onClick={() => setTypeMode(mode)}
            >
              {mode === "All" ? "Alle" : mode === "Movie" ? "Filme" : "TV-Serien"}
            </button>
          ))}
          {(["absolute", "percent"] as const).map((mode) => (
            <button
              key={mode}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${valueMode === mode ? "bg-white text-slate-950" : "bg-slate-900 text-slate-300 hover:text-white"}`}
              onClick={() => setValueMode(mode)}
            >
              {mode === "absolute" ? "Absolut" : "Prozent"}
            </button>
          ))}
        </div>
      }
    >
      <div className="h-[360px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 12, right: 8, left: -12, bottom: 4 }}>
            <XAxis dataKey="genre" tick={{ fill: "#CBD5E1", fontSize: 12 }} tickLine={false} axisLine={false} interval={0} angle={-18} textAnchor="end" height={72} />
            <YAxis tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} unit={valueMode === "percent" ? "%" : ""} />
            <Tooltip
              contentStyle={{ backgroundColor: "#081220", border: "1px solid #24354E", borderRadius: 18, color: "#FFFFFF" }}
              formatter={(value: number) => [valueMode === "percent" ? `${value}%` : value, valueMode === "percent" ? "Anteil" : "Titel"]}
            />
            <Legend wrapperStyle={{ color: "#E6EEF8" }} />
            <Bar dataKey="Netflix" fill={platformColors.Netflix} radius={[6, 6, 0, 0]} />
            <Bar dataKey="Amazon" fill={platformColors.Amazon} stroke="#24354E" radius={[6, 6, 0, 0]} />
            <Bar dataKey="Disney+" fill={platformColors["Disney+"]} radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};
