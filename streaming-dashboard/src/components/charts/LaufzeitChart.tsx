import React, { useMemo, useState } from "react";
import { Bar, BarChart, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { contentTypeColors, platformOrder } from "../../config/theme";
import { PlatformLaufzeitStats, PlatformSeriesStats } from "../../types";
import { ChartCard } from "../common/ChartCard";

type LaufzeitChartProps = {
  filmStats: PlatformLaufzeitStats[];
  serienStats: PlatformSeriesStats[];
};

const formatMetric = (value: number | null, suffix: string) => (value === null ? "Keine Daten" : `${value} ${suffix}`);

type MovieTooltipProps = {
  active?: boolean;
  payload?: Array<{ color?: string; name?: string; value?: number }>;
  label?: string;
};

const MovieTooltip: React.FC<MovieTooltipProps> = ({ active, payload, label }) => {
  if (!active || !payload || payload.length === 0) return null;

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#081220] px-4 py-3 shadow-2xl">
      <div className="text-base font-semibold text-white">{label}</div>
      <div className="mt-3 space-y-2 text-sm">
        {payload.map((entry) => (
          <div key={entry.name} className="flex items-center justify-between gap-4">
            <span style={{ color: entry.color }}>{entry.name}</span>
            <span className="text-white">{entry.value} Minuten</span>
          </div>
        ))}
      </div>
    </div>
  );
};

type SeriesTooltipProps = {
  active?: boolean;
  payload?: Array<{ payload?: { platform: string } }>;
  statsByPlatform: Map<string, PlatformSeriesStats>;
};

const SeriesTooltip: React.FC<SeriesTooltipProps> = ({ active, payload, statsByPlatform }) => {
  if (!active || !payload || payload.length === 0) return null;

  const platform = payload[0]?.payload?.platform;
  if (!platform) return null;

  const stats = statsByPlatform.get(platform);
  if (!stats) return null;

  return (
    <div className="rounded-3xl border border-slate-700 bg-[#081220] px-4 py-3 shadow-2xl">
      <div className="text-base font-semibold text-white">{platform}</div>
      <div className="mt-3 space-y-2 text-sm">
        <div className="text-slate-300">Geschätzte Folgenlaufzeit pro Serie</div>
        <div className="text-sky-300">Durchschnittliche Laufzeit: {formatMetric(stats.runtime.avg, "Minuten")}</div>
        <div className="text-slate-200">Minimale Laufzeit: {formatMetric(stats.runtime.min, "Minuten")}</div>
        <div className="text-violet-300">Median Laufzeit: {formatMetric(stats.runtime.median, "Minuten")}</div>
        <div className="text-amber-300">Maximale Laufzeit: {formatMetric(stats.runtime.max, "Minuten")}</div>
        <div className="text-cyan-300">Durchschnittliche Staffelanzahl: {formatMetric(stats.seasons.avg, "Staffeln")}</div>
        <div className="text-fuchsia-300">Median Staffelanzahl: {formatMetric(stats.seasons.median, "Staffeln")}</div>
        <div className="text-emerald-300">Maximale Staffelanzahl: {formatMetric(stats.seasons.max, "Staffeln")}</div>
      </div>
    </div>
  );
};

export const LaufzeitChart: React.FC<LaufzeitChartProps> = ({ filmStats, serienStats }) => {
  const [modus, setModus] = useState<"Movie" | "TV Show">("Movie");

  const movieChartData = useMemo(
    () =>
      filmStats.map((row) => ({
        platform: row.platform,
        Durchschnitt: row.avg,
        Median: row.median,
        Maximum: row.max
      })),
    [filmStats]
  );

  const seriesRuntimeData = useMemo(
    () =>
      serienStats.map((row) => ({
        platform: row.platform,
        "Durchschnittliche Laufzeit": row.runtime.avg,
        "Median Laufzeit": row.runtime.median,
        "Maximale Laufzeit": row.runtime.max
      })),
    [serienStats]
  );

  const seriesSeasonData = useMemo(
    () =>
      serienStats.map((row) => ({
        platform: row.platform,
        "Durchschnittliche Staffelanzahl": row.seasons.avg,
        "Median Staffelanzahl": row.seasons.median,
        "Maximale Staffelanzahl": row.seasons.max
      })),
    [serienStats]
  );

  const seriesStatsByPlatform = useMemo(() => new Map(serienStats.map((row) => [row.platform, row])), [serienStats]);

  return (
    <ChartCard
      title={modus === "Movie" ? "Filmauswertung nach Laufzeit" : "TV-Serien-Auswertung nach Laufzeit und Staffeln"}
      subtitle={
        modus === "Movie"
          ? "Durchschnitt, Median und Maximum pro Plattform"
          : "Echte Serienmetadaten pro Plattform, getrennt nach Laufzeit und Staffelanzahl"
      }
      action={
        <div className="flex gap-2">
          {(["Movie", "TV Show"] as const).map((entry) => (
            <button
              key={entry}
              className={`rounded-full px-3 py-2 text-xs font-medium transition ${modus === entry ? "bg-sky-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:text-white"}`}
              onClick={() => setModus(entry)}
            >
              {entry === "Movie" ? "Filme" : "TV-Serien"}
            </button>
          ))}
        </div>
      }
    >
      {modus === "Movie" ? (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="h-[340px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={movieChartData}>
                <XAxis dataKey="platform" tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                <YAxis tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                <Tooltip content={<MovieTooltip />} />
                <Legend wrapperStyle={{ color: "#E6EEF8" }} />
                <Bar dataKey="Durchschnitt" fill={contentTypeColors.movie} radius={[6, 6, 0, 0]} />
                <Bar dataKey="Median" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                <Bar dataKey="Maximum" fill="#F5C451" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="grid gap-3">
            {platformOrder.map((platform) => {
              const stats = filmStats.find((entry) => entry.platform === platform);
              if (!stats) return null;

              return (
                <div key={platform} className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-white">{platform}</h4>
                    <span className="text-xs text-slate-400">{stats.count} Titel</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Minimum</div>
                      <div className="mt-1 text-white">{stats.min} Minuten</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Durchschnitt</div>
                      <div className="mt-1 text-white">{stats.avg} Minuten</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Längster Titel</div>
                      <div className="mt-1 text-white">{stats.longestTitle}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Kürzester Titel</div>
                      <div className="mt-1 text-white">{stats.shortestTitle}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="grid gap-4 xl:grid-cols-[1.45fr_0.95fr]">
          <div className="grid gap-4">
            <div className="rounded-[26px] border border-slate-800 bg-slate-950/35 p-4">
              <div className="mb-3 text-sm font-medium text-slate-200">Laufzeit in Minuten</div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seriesRuntimeData}>
                    <XAxis dataKey="platform" tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<SeriesTooltip statsByPlatform={seriesStatsByPlatform} />} />
                    <Legend wrapperStyle={{ color: "#E6EEF8" }} />
                    <Bar dataKey="Durchschnittliche Laufzeit" fill={contentTypeColors.series} radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Median Laufzeit" fill="#8B5CF6" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Maximale Laufzeit" fill="#F5C451" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="rounded-[26px] border border-slate-800 bg-slate-950/35 p-4">
              <div className="mb-3 text-sm font-medium text-slate-200">Staffelanzahl</div>
              <div className="h-[220px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={seriesSeasonData}>
                    <XAxis dataKey="platform" tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                    <YAxis tick={{ fill: "#CBD5E1" }} tickLine={false} axisLine={false} />
                    <Tooltip content={<SeriesTooltip statsByPlatform={seriesStatsByPlatform} />} />
                    <Legend wrapperStyle={{ color: "#E6EEF8" }} />
                    <Bar dataKey="Durchschnittliche Staffelanzahl" fill="#22D3EE" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Median Staffelanzahl" fill="#D946EF" radius={[6, 6, 0, 0]} />
                    <Bar dataKey="Maximale Staffelanzahl" fill="#34D399" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          <div className="grid gap-3">
            {platformOrder.map((platform) => {
              const stats = seriesStatsByPlatform.get(platform);
              if (!stats) return null;

              return (
                <div key={platform} className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-semibold text-white">{platform}</h4>
                    <span className="text-xs text-slate-400">{stats.showCount} Serien</span>
                  </div>
                  <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Durchschnittliche Laufzeit</div>
                      <div className="mt-1 text-white">{formatMetric(stats.runtime.avg, "Minuten")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Minimale Laufzeit</div>
                      <div className="mt-1 text-white">{formatMetric(stats.runtime.min, "Minuten")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Median Laufzeit</div>
                      <div className="mt-1 text-white">{formatMetric(stats.runtime.median, "Minuten")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Durchschnittliche Staffelanzahl</div>
                      <div className="mt-1 text-white">{formatMetric(stats.seasons.avg, "Staffeln")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Median Staffelanzahl</div>
                      <div className="mt-1 text-white">{formatMetric(stats.seasons.median, "Staffeln")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Maximale Laufzeit</div>
                      <div className="mt-1 text-white">{formatMetric(stats.runtime.max, "Minuten")}</div>
                    </div>
                    <div className="rounded-2xl bg-slate-900/70 p-3">
                      <div className="text-slate-400">Maximale Staffelanzahl</div>
                      <div className="mt-1 text-white">{formatMetric(stats.seasons.max, "Staffeln")}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </ChartCard>
  );
};
