import React, { useMemo, useState } from "react";
import { AgeGenreHeatmap } from "../components/charts/AgeGenreHeatmap";
import { ContentSplitChart } from "../components/charts/ContentSplitChart";
import { GenreChart } from "../components/charts/GenreChart";
import { LaufzeitChart } from "../components/charts/LaufzeitChart";
import { PlatformProductionChart } from "../components/charts/PlatformProductionChart";
import { ChartCard } from "../components/common/ChartCard";
import { Datenliste } from "../components/common/Datenliste";
import { FilterPanel } from "../components/common/FilterPanel";
import { KpiCard } from "../components/common/KpiCard";
import { Spinner } from "../components/common/Spinner";
import { TitleDetailModal } from "../components/common/TitleDetailModal";
import { platformColors } from "../config/theme";
import { useDashboardData } from "../hooks/useDashboardData";
import { MediaItem } from "../types";

const sectionLinks = [
  { href: "#uebersicht", label: "Übersicht" },
  { href: "#genres", label: "Genres" },
  { href: "#serien", label: "TV-Serien" },
  { href: "#filme", label: "Filme" },
  { href: "#laufzeit", label: "Laufzeit" }
];

export const DashboardPage: React.FC = () => {
  const {
    allItems,
    catalog,
    filteredItems,
    platformBreakdown,
    analysisPlatformBreakdown,
    filmLaufzeit,
    serienLaufzeit,
    oldestMovies,
    oldestShows,
    seasonStats,
    topSeries,
    ageGenreHeatmap,
    topPlatform,
    totals,
    isLoading,
    error
  } = useDashboardData();
  const [selectedItem, setSelectedItem] = useState<MediaItem | null>(null);
  const [oldestMode, setOldestMode] = useState<"movies" | "shows">("movies");

  const lookup = useMemo(() => new Map(allItems.map((item) => [item.title, item])), [allItems]);
  const openByTitle = (title: string) => {
    const match = lookup.get(title);
    if (match) setSelectedItem(match);
  };

  const oldestEntries = oldestMode === "movies" ? oldestMovies : oldestShows;

  return (
    <div className="mx-auto max-w-[1480px] px-4 pb-16 pt-6 md:px-6 xl:px-8">
      <section className="rounded-2xl border border-slate-800 bg-slate-900/72 p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <span className="h-2.5 w-2.5 rounded-full bg-sky-400" />
            <h1 className="text-2xl font-semibold tracking-tight text-white md:text-3xl">Streaming-Analyse Dashboard</h1>
          </div>
          <nav className="flex flex-wrap gap-2 md:justify-end">
            {sectionLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                className="rounded-xl border border-slate-700 bg-slate-900/90 px-3 py-2 text-sm font-medium text-slate-200 transition hover:border-sky-400 hover:text-white"
              >
                {link.label}
              </a>
            ))}
          </nav>
        </div>
      </section>

      <div className="mt-5">
        <FilterPanel catalog={catalog} />
      </div>

      {isLoading ? (
        <div className="mt-6">
          <Spinner />
        </div>
      ) : null}
      {error ? <div className="mt-6 rounded-2xl border border-red-500/40 bg-red-500/10 p-4 text-red-200">{error}</div> : null}

      {!isLoading && !error ? (
        <div className="mt-6 space-y-6">
          <section id="uebersicht" className="scroll-mt-28 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            <KpiCard label="Titel gesamt" value={totals.totalTitles} hint="Alle aktuell gefilterten Inhalte" accent="#43C7FF" />
            <KpiCard label="Filme" value={totals.totalMovies} hint="Im aktiven Datenausschnitt" accent="#FF6B4A" />
            <KpiCard label="TV-Serien" value={totals.totalShows} hint="Im aktiven Datenausschnitt" accent="#43C7FF" />
            <KpiCard label="Stärkste Plattform" value={topPlatform} hint="Größter Katalog im aktuellen Filter" accent={platformColors[topPlatform]} />
          </section>

          <section className="grid gap-5 xl:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
            <ChartCard title="Katalogvergleich je Plattform" subtitle="Gesamtanzahl sowie Aufteilung in Filme und TV-Serien">
              <div className="grid gap-3 lg:grid-cols-3">
                {platformBreakdown.map((row) => (
                  <div key={row.platform} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                    <div className="flex items-center justify-between">
                      <h3 className={`text-sm font-semibold ${row.platform === "Amazon" ? "text-white" : "text-white"}`}>{row.platform}</h3>
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: platformColors[row.platform] }} />
                    </div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>Titel</span>
                        <strong className="text-white">{row.total}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[#FFB19F]">Filme</span>
                        <strong className="text-white">{row.movie}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sky-300">TV-Serien</span>
                        <strong className="text-white">{row.tv}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ChartCard>

            <ContentSplitChart data={platformBreakdown} movieCount={totals.totalMovies} seriesCount={totals.totalShows} />
          </section>

          <section className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_320px]">
            <ChartCard
              title={oldestMode === "movies" ? "Älteste Filme" : "Älteste TV-Serien"}
              subtitle="Unabhängig von den oberen Filtern, direkt aus dem Gesamtdatensatz"
              action={
                <div className="flex gap-2">
                  <button
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${oldestMode === "movies" ? "bg-[#FF6B4A] text-slate-950" : "bg-slate-900 text-slate-300 hover:text-white"}`}
                    onClick={() => setOldestMode("movies")}
                  >
                    Filme
                  </button>
                  <button
                    className={`rounded-full px-3 py-2 text-xs font-medium transition ${oldestMode === "shows" ? "bg-sky-400 text-slate-950" : "bg-slate-900 text-slate-300 hover:text-white"}`}
                    onClick={() => setOldestMode("shows")}
                  >
                    TV-Serien
                  </button>
                </div>
              }
            >
              <div className="space-y-3">
                {oldestEntries.map((entry) => (
                  <button
                    key={`${oldestMode}-${entry.platform}-${entry.title}`}
                    className="w-full rounded-2xl border border-slate-800 bg-slate-900/75 p-4 text-left transition hover:border-sky-400 hover:bg-slate-800/90"
                    onClick={() => openByTitle(entry.title)}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-white">{entry.platform}</span>
                      <span className="text-sm text-slate-300">{entry.release_year}</span>
                    </div>
                    <div className={`mt-2 text-base ${oldestMode === "movies" ? "text-[#FFB19F]" : "text-sky-300"}`}>{entry.title}</div>
                    <div className="mt-1 text-sm text-slate-300">
                      {entry.genre} | {entry.age_rating}
                    </div>
                  </button>
                ))}
              </div>
            </ChartCard>

            <ChartCard title="Gefilterte Titel" subtitle="Aktueller Umfang der Auswahl">
              <div className="flex h-full min-h-[220px] flex-col justify-between rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
                <div>
                  <div className="text-[11px] font-semibold uppercase tracking-[0.2em] text-slate-500">Treffer</div>
                  <div className="mt-3 text-5xl font-semibold text-white">{filteredItems.length}</div>
                </div>
                <p className="text-sm leading-6 text-slate-400">
                  Die oberen Filter beeinflussen nur diese Auswahl und die KPI-Zone. Die unteren Analysen arbeiten davon getrennt.
                </p>
              </div>
            </ChartCard>
          </section>

          <section id="genres" className="scroll-mt-28 grid gap-5 xl:grid-cols-[1.2fr_0.8fr]">
            <GenreChart items={allItems} />
            <AgeGenreHeatmap data={ageGenreHeatmap} />
          </section>

          <section id="serien" className="scroll-mt-28 grid gap-5">
            <ChartCard title="TV-Serien im Fokus" subtitle="Laufzeit und Staffelanzahl unabhängig von den oberen Filtern">
              <div className="grid gap-3 md:grid-cols-3">
                {seasonStats.map((row) => (
                  <div key={row.platform} className="rounded-2xl border border-slate-800 bg-slate-900/75 p-4">
                    <div className="text-sm font-semibold text-white">{row.platform}</div>
                    <div className="mt-4 space-y-2 text-sm text-slate-300">
                      <div className="flex items-center justify-between">
                        <span>TV-Serien</span>
                        <strong className="text-white">{row.showCount}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Durchschnitt Laufzeit</span>
                        <strong className="text-white">{row.avgRuntime === null ? "Keine Daten" : `${row.avgRuntime} Min.`}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Minimale Laufzeit</span>
                        <strong className="text-white">{row.minRuntime === null ? "Keine Daten" : `${row.minRuntime} Min.`}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Median Laufzeit</span>
                        <strong className="text-white">{row.medianRuntime === null ? "Keine Daten" : `${row.medianRuntime} Min.`}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Maximale Laufzeit</span>
                        <strong className="text-white">{row.maxRuntime === null ? "Keine Daten" : `${row.maxRuntime} Min.`}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Durchschnitt Staffeln</span>
                        <strong className="text-white">{row.avgSeasons === null ? "Keine Daten" : row.avgSeasons}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Median Staffeln</span>
                        <strong className="text-white">{row.medianSeasons === null ? "Keine Daten" : row.medianSeasons}</strong>
                      </div>
                      <div className="flex items-center justify-between">
                        <span>Maximale Staffeln</span>
                        <strong className="text-white">{row.maxSeasons === null ? "Keine Daten" : row.maxSeasons}</strong>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2">
                {topSeries.map((series, index) => (
                  <button
                    key={series.id}
                    className="flex w-full items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/75 px-4 py-3 text-left text-sm text-slate-200 transition hover:border-sky-400 hover:bg-slate-800/90"
                    onClick={() => setSelectedItem(series)}
                  >
                    <div>
                      <span className="mr-3 text-slate-500">#{index + 1}</span>
                      <span className="font-medium text-white">{series.title}</span>
                      <span className={`ml-3 ${series.platform === "Amazon" ? "text-white" : "text-sky-300"}`}>{series.platform}</span>
                    </div>
                    <div>{series.seasons} Staffeln</div>
                  </button>
                ))}
              </div>
            </ChartCard>
          </section>

          <section id="filme" className="scroll-mt-28 grid gap-5">
            <PlatformProductionChart data={analysisPlatformBreakdown} />
          </section>

          <section id="laufzeit" className="scroll-mt-28">
            <LaufzeitChart filmStats={filmLaufzeit} serienStats={serienLaufzeit} />
          </section>

          <section>
            <Datenliste rows={filteredItems} onSelectTitle={setSelectedItem} />
          </section>
        </div>
      ) : null}

      <TitleDetailModal item={selectedItem} onClose={() => setSelectedItem(null)} />
    </div>
  );
};
