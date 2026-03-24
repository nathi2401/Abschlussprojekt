import React, { startTransition } from "react";
import { useFilters } from "../../context/FilterContext";
import { DataCatalog, FiltersState } from "../../types";

type FilterPanelProps = {
  catalog: DataCatalog;
};

const inputClassName =
  "h-10 w-full min-w-0 rounded-xl border border-slate-700 bg-slate-900/80 px-3 text-sm text-slate-100 outline-none transition focus:border-sky-400";

export const FilterPanel: React.FC<FilterPanelProps> = ({ catalog }) => {
  const { filters, setFilters, resetFilters } = useFilters();

  const update = <K extends keyof FiltersState>(field: K, value: FiltersState[K]) => {
    startTransition(() => {
      setFilters((current) => ({ ...current, [field]: value }));
    });
  };

  return (
    <section className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-11">
        <div className="flex items-center xl:col-span-1">
          <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">Filter</div>
        </div>

        <select className={`${inputClassName} xl:col-span-1`} value={filters.platform} onChange={(event) => update("platform", event.target.value as FiltersState["platform"])}>
          <option value="All">Plattformen</option>
          <option value="Netflix">Netflix</option>
          <option value="Amazon">Amazon</option>
          <option value="Disney+">Disney+</option>
        </select>

        <select className={`${inputClassName} xl:col-span-1`} value={filters.type} onChange={(event) => update("type", event.target.value as FiltersState["type"])}>
          <option value="All">Alle Typen</option>
          <option value="Movie">Filme</option>
          <option value="TV Show">TV-Serien</option>
        </select>

        <select className={`${inputClassName} xl:col-span-1`} value={filters.genre} onChange={(event) => update("genre", event.target.value)}>
          <option value="All">Alle Genres</option>
          {catalog.genres.map((genre) => (
            <option key={genre} value={genre}>
              {genre}
            </option>
          ))}
        </select>

        <select className={`${inputClassName} xl:col-span-2`} value={filters.age_rating} onChange={(event) => update("age_rating", event.target.value)}>
          <option value="All">Alle Altersfreigaben</option>
          {catalog.ageRatings.map((rating) => (
            <option key={rating} value={rating}>
              {rating}
            </option>
          ))}
        </select>

        <select
          className={`${inputClassName} xl:col-span-1`}
          value={filters.release_year}
          onChange={(event) => update("release_year", event.target.value === "All" ? "All" : Number(event.target.value))}
        >
          <option value="All">Alle Jahre</option>
          {catalog.years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>

        <input
          className={`${inputClassName} xl:col-span-2`}
          type="search"
          placeholder="Titel oder Beschreibung suchen"
          value={filters.query}
          onChange={(event) => update("query", event.target.value)}
        />

        <div className="flex min-w-0 items-center gap-2 rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-sm text-slate-300 xl:col-span-2">
          <span className="shrink-0">Laufzeit</span>
          <input className="w-full accent-sky-400" type="range" min={0} max={catalog.maxLaufzeit} value={filters.runtime_max} onChange={(event) => update("runtime_max", Number(event.target.value))} />
          <span className="shrink-0 text-xs text-slate-400">{filters.runtime_max}</span>
        </div>

        <button
          className="h-10 rounded-xl border border-slate-700 bg-slate-900/80 px-4 text-sm font-medium text-slate-100 transition hover:border-sky-400 hover:text-white xl:col-span-1"
          onClick={resetFilters}
        >
          Zurücksetzen
        </button>
      </div>
    </section>
  );
};
