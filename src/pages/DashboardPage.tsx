import { useMemo, useState } from "react";
import { PlatformAreaChart } from "../components/charts/PlatformAreaChart";
import { PlatformBarChart } from "../components/charts/PlatformBarChart";
import { HeatmapGrid } from "../components/charts/HeatmapGrid";
import { PlatformDonutChart } from "../components/charts/PlatformDonutChart";
import { FilterBar } from "../components/filters/FilterBar";
import { NavTabs } from "../components/navigation/NavTabs";
import { DataTable } from "../components/table/DataTable";
import { MetricCard } from "../components/ui/MetricCard";
import { Panel } from "../components/ui/Panel";
import { PLATFORM_COLORS } from "../data/platformTheme";
import { useStreamingData } from "../hooks/useStreamingData";
import type { ContentType } from "../types/streaming";
import {
  byPlatformType,
  genreAgeHeatmap,
  genreComparison,
  getSummaryMetrics,
  oldestByPlatform,
  productionComparison,
  runtimeStats,
  seasonalityComparison,
  seriesSeasonStats,
  topSeriesBySeasons
} from "../utils/analytics";
import { formatMinutes, formatNumber } from "../utils/format";

const platformAccents = [PLATFORM_COLORS.Netflix, PLATFORM_COLORS["Amazon Prime"], PLATFORM_COLORS["Disney+"], "#ffb347"];

export const DashboardPage = () => {
  const { filteredTitles, status, error, filters, setFilters, options, resetFilters, importCsv } = useStreamingData();
  const [activeTab, setActiveTab] = useState("overview");
  const [genreType, setGenreType] = useState<"All" | ContentType>("All");
  const [genreAsPercent, setGenreAsPercent] = useState(false);
  const [releaseType, setReleaseType] = useState<"All" | ContentType>("All");

  const summary = useMemo(() => getSummaryMetrics(filteredTitles), [filteredTitles]);
  const overviewByPlatform = useMemo(() => byPlatformType(filteredTitles), [filteredTitles]);
  const genresData = useMemo(() => genreComparison(filteredTitles, genreType, genreAsPercent), [filteredTitles, genreAsPercent, genreType]);
  const seasonalityData = useMemo(() => seasonalityComparison(filteredTitles, releaseType), [filteredTitles, releaseType]);
  const productionData = useMemo(() => productionComparison(filteredTitles), [filteredTitles]);
  const heatmapData = useMemo(() => genreAgeHeatmap(filteredTitles), [filteredTitles]);
  const movieRuntime = useMemo(() => runtimeStats(filteredTitles, "Movie"), [filteredTitles]);
  const showRuntime = useMemo(() => runtimeStats(filteredTitles, "TV Show"), [filteredTitles]);
  const oldestMovies = useMemo(() => oldestByPlatform(filteredTitles, "Movie"), [filteredTitles]);
  const oldestShows = useMemo(() => oldestByPlatform(filteredTitles, "TV Show"), [filteredTitles]);
  const seasonStats = useMemo(() => seriesSeasonStats(filteredTitles), [filteredTitles]);
  const topSeries = useMemo(() => topSeriesBySeasons(filteredTitles), [filteredTitles]);

  if (status === "loading" || !filters) {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel rounded-3xl p-8 text-center shadow-glow">
          <p className="font-display text-2xl text-white">Daten werden geladen...</p>
          <p className="mt-2 text-slate-300">Die lokale CSV-Datei wird eingelesen und normalisiert.</p>
        </div>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex min-h-screen items-center justify-center px-6">
        <div className="glass-panel rounded-3xl p-8 text-center shadow-glow">
          <p className="font-display text-2xl text-white">Fehler beim Laden</p>
          <p className="mt-2 text-slate-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 md:px-6 xl:px-8">
      <header className="mb-6 rounded-[2rem] border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.03] p-6 shadow-glow">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <p className="mb-2 text-sm uppercase tracking-[0.25em] text-slate-300">Streaming Analytics MVP</p>
            <h1 className="font-display text-4xl font-semibold leading-tight text-white md:text-5xl">
              Interaktive Vergleichsanalyse für Netflix, Amazon Prime und Disney+
            </h1>
            <p className="mt-4 max-w-2xl text-slate-300">
              Lokal startbares Dashboard mit KPI-Cards, Filter-Slicern, Genre-Vergleichen, Laufzeit-Analysen,
              Staffel-Auswertungen und interaktiver Datentabelle.
            </p>
          </div>
          <NavTabs activeTab={activeTab} onSelect={setActiveTab} />
        </div>
      </header>

      <div className="space-y-6">
        <FilterBar filters={filters} options={options} onChange={setFilters} onReset={resetFilters} onImport={importCsv} />

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Titel gesamt" value={formatNumber(summary.totalTitles)} accent={platformAccents[0]} helper="Alle aktuell gefilterten Inhalte" />
          <MetricCard label="Filme" value={formatNumber(summary.movies)} accent={platformAccents[1]} helper="Nur Movie-Datensätze" />
          <MetricCard label="TV-Shows" value={formatNumber(summary.tvShows)} accent={platformAccents[2]} helper="Nur TV Show-Datensätze" />
          <MetricCard label="Führende Plattform" value={summary.dominantPlatform ?? "n/a"} accent={platformAccents[3]} helper="Meiste Inhalte im aktuellen Filter" />
        </section>

        {(activeTab === "overview" || activeTab === "genres") && (
          <>
            <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
              <Panel title="Plattformvergleich: Filme vs. TV-Shows" subtitle="Absolute Anzahl und Verteilung pro Plattform.">
                <PlatformBarChart data={overviewByPlatform} xKey="platform" stacked bars={[{ key: "movies", label: "Filme" }, { key: "tvShows", label: "TV-Shows" }]} />
              </Panel>
              <Panel title="Anteil aller Inhalte" subtitle="Titel gesamt pro Plattform im Donut-Chart.">
                <PlatformDonutChart data={overviewByPlatform} />
              </Panel>
            </div>

            <Panel
              title="Genre-Gegenüberstellung"
              subtitle="Zwischen absoluten Werten und Prozentanteilen umschaltbar; optional nach Filmen oder TV-Shows eingrenzen."
              action={
                <div className="flex flex-wrap gap-2">
                  <select value={genreType} onChange={(event) => setGenreType(event.target.value as "All" | ContentType)} className="rounded-full border border-white/10 bg-surface-800 px-4 py-2 text-sm text-white">
                    <option value="All">Alle Typen</option>
                    <option value="Movie">Filme</option>
                    <option value="TV Show">TV-Shows</option>
                  </select>
                  <button type="button" onClick={() => setGenreAsPercent((current) => !current)} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white">
                    {genreAsPercent ? "Absolute Werte" : "Prozent anzeigen"}
                  </button>
                </div>
              }
            >
              <PlatformBarChart data={genresData} xKey="genre" bars={[{ key: "Netflix", label: "Netflix" }, { key: "Amazon Prime", label: "Amazon Prime" }, { key: "Disney+", label: "Disney+" }]} />
            </Panel>
          </>
        )}

        {(activeTab === "overview" || activeTab === "releases") && (
          <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
            <Panel
              title="Veröffentlichungen nach Jahreszeit"
              subtitle="Jahreszeit wird aus Monat oder Datum abgeleitet."
              action={
                <select value={releaseType} onChange={(event) => setReleaseType(event.target.value as "All" | ContentType)} className="rounded-full border border-white/10 bg-surface-800 px-4 py-2 text-sm text-white">
                  <option value="All">Alle Typen</option>
                  <option value="Movie">Filme</option>
                  <option value="TV Show">TV-Shows</option>
                </select>
              }
            >
              <PlatformAreaChart data={seasonalityData} xKey="season" />
            </Panel>
            <Panel title="Welche Plattform produziert am meisten?" subtitle="Absolute Volumen pro Plattform, getrennt nach Inhaltstyp.">
              <PlatformBarChart data={productionData} xKey="platform" bars={[{ key: "movies", label: "Filme" }, { key: "tvShows", label: "TV-Shows" }]} />
            </Panel>
          </div>
        )}

        {(activeTab === "overview" || activeTab === "genres") && (
          <Panel title="Plattformpräferenzen nach Genre und Altersfreigabe" subtitle="Heatmap-artige Matrix zur Kombination von Genre und Age Rating.">
            <HeatmapGrid data={heatmapData.slice(0, 18)} />
          </Panel>
        )}

        {(activeTab === "overview" || activeTab === "runtime") && (
          <div className="grid gap-6 xl:grid-cols-2">
            <Panel title="Filmauswertung nach Laufzeit" subtitle="Anzahl, Durchschnitt, Median sowie längster und kürzester Film pro Plattform.">
              <div className="grid gap-4 md:grid-cols-3">
                {movieRuntime.map((item) => (
                  <div key={item.platform} className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
                    <div className="mb-3 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[item.platform] }} />
                    <h3 className="font-display text-lg text-white">{item.platform}</h3>
                    <p className="mt-2 text-sm text-slate-300">Filme: {formatNumber(item.count)}</p>
                    <p className="text-sm text-slate-300">Durchschnitt: {formatMinutes(Math.round(item.average))}</p>
                    <p className="text-sm text-slate-300">Median: {formatMinutes(Math.round(item.median))}</p>
                    <p className="mt-3 text-xs text-slate-400">Längster: {item.longest}</p>
                    <p className="text-xs text-slate-400">Kürzester: {item.shortest}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel title="TV-Show-Auswertung nach Laufzeit" subtitle="Bei Serien wird eine sinnvolle Ersatzkennzahl aus Laufzeit und Staffelanzahl verwendet.">
              <div className="grid gap-4 md:grid-cols-3">
                {showRuntime.map((item) => (
                  <div key={item.platform} className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
                    <div className="mb-3 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[item.platform] }} />
                    <h3 className="font-display text-lg text-white">{item.platform}</h3>
                    <p className="mt-2 text-sm text-slate-300">TV-Shows: {formatNumber(item.count)}</p>
                    <p className="text-sm text-slate-300">Durchschnitt: {formatMinutes(Math.round(item.average))}</p>
                    <p className="text-sm text-slate-300">Median: {formatMinutes(Math.round(item.median))}</p>
                    <p className="mt-3 text-xs text-slate-400">Längste: {item.longest}</p>
                    <p className="text-xs text-slate-400">Kürzeste: {item.shortest}</p>
                  </div>
                ))}
              </div>
            </Panel>
          </div>
        )}

        {(activeTab === "overview" || activeTab === "series") && (
          <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <Panel title="Älteste Filme und TV-Shows" subtitle="Vergleich auf Basis des Veröffentlichungsjahres.">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
                  <h3 className="mb-3 font-display text-lg text-white">Älteste Filme</h3>
                  <div className="space-y-3">
                    {oldestMovies.map((item) => (
                      <div key={item.platform} className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="font-medium text-white">{item.platform}</p>
                        <p className="text-sm text-slate-300">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.year ?? "n/a"}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
                  <h3 className="mb-3 font-display text-lg text-white">Älteste TV-Shows</h3>
                  <div className="space-y-3">
                    {oldestShows.map((item) => (
                      <div key={item.platform} className="rounded-2xl bg-white/[0.04] p-3">
                        <p className="font-medium text-white">{item.platform}</p>
                        <p className="text-sm text-slate-300">{item.title}</p>
                        <p className="text-xs text-slate-400">{item.year ?? "n/a"}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Panel>

            <Panel title="Serien mit den meisten und wenigsten Staffeln" subtitle="Durchschnittliche Staffelanzahl pro Plattform plus Top-Serien.">
              <div className="mb-5 grid gap-4 md:grid-cols-3">
                {seasonStats.map((item) => (
                  <div key={item.platform} className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
                    <div className="mb-3 h-1.5 rounded-full" style={{ backgroundColor: PLATFORM_COLORS[item.platform] }} />
                    <h3 className="font-display text-lg text-white">{item.platform}</h3>
                    <p className="mt-2 text-sm text-slate-300">Durchschnitt: {item.average.toFixed(1)} Staffeln</p>
                    <p className="text-sm text-slate-300">Maximum: {item.max}</p>
                    <p className="text-sm text-slate-300">Minimum: {item.min}</p>
                    <p className="mt-3 text-xs text-slate-400">Top-Serie: {item.topTitle}</p>
                    <p className="text-xs text-slate-400">Kleinste Serie: {item.lowTitle}</p>
                  </div>
                ))}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-white/10">
                <table className="min-w-full text-sm">
                  <thead className="bg-white/5 text-left text-slate-300">
                    <tr>
                      <th className="px-4 py-3">Titel</th>
                      <th className="px-4 py-3">Plattform</th>
                      <th className="px-4 py-3">Staffeln</th>
                      <th className="px-4 py-3">Genre</th>
                    </tr>
                  </thead>
                  <tbody>
                    {topSeries.map((title) => (
                      <tr key={title.id} className="border-t border-white/5">
                        <td className="px-4 py-3 text-white">{title.title}</td>
                        <td className="px-4 py-3 text-slate-300">{title.platform}</td>
                        <td className="px-4 py-3 text-slate-300">{title.seasons}</td>
                        <td className="px-4 py-3 text-slate-300">{title.genres.join(", ")}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </Panel>
          </div>
        )}

        {(activeTab === "overview" || activeTab === "table") && (
          <Panel title="Interaktive Datentabelle" subtitle="Suche, Sortierung und Filterung auf Basis der normalisierten Daten.">
            <DataTable rows={filteredTitles} />
          </Panel>
        )}
      </div>
    </div>
  );
};
