import type { ChangeEvent } from "react";
import type { FilterOptions, FilterState } from "../../types/streaming";

interface FilterBarProps {
  filters: FilterState;
  options: FilterOptions;
  onChange: (next: FilterState) => void;
  onReset: () => void;
  onImport: (file: File) => Promise<void>;
}

const toggleArrayValue = <T,>(values: T[], value: T) => (values.includes(value) ? values.filter((item) => item !== value) : [...values, value]);

export const FilterBar = ({ filters, options, onChange, onReset, onImport }: FilterBarProps) => {
  const handleFile = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      await onImport(file);
      event.target.value = "";
    }
  };

  return (
    <div className="glass-panel rounded-3xl p-5 shadow-glow">
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="font-display text-xl font-semibold text-white">Filter & Datenimport</h2>
          <p className="mt-1 text-sm text-slate-300">Alle Diagramme und Tabellen reagieren auf die gewählten Slicer.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <label className="cursor-pointer rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10">
            CSV importieren
            <input type="file" accept=".csv,text/csv" className="hidden" onChange={handleFile} />
          </label>
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-100 hover:bg-white/10"
          >
            Filter zurücksetzen
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <p className="mb-3 text-sm font-medium text-slate-200">Plattform</p>
          <div className="flex flex-wrap gap-2">
            {options.platforms.map((platform) => {
              const active = filters.platforms.includes(platform);
              return (
                <button
                  key={platform}
                  type="button"
                  onClick={() => onChange({ ...filters, platforms: toggleArrayValue(filters.platforms, platform) })}
                  className={`rounded-full px-3 py-1.5 text-sm transition ${
                    active ? "bg-white text-surface-950" : "bg-white/5 text-slate-300 hover:bg-white/10"
                  }`}
                >
                  {platform}
                </button>
              );
            })}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Typ</label>
          <select
            value={filters.type}
            onChange={(event) => onChange({ ...filters, type: event.target.value as FilterState["type"] })}
            className="w-full rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="All">Alle Inhalte</option>
            <option value="Movie">Filme</option>
            <option value="TV Show">TV-Shows</option>
          </select>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Genre</label>
          <select
            value=""
            onChange={(event) => {
              const value = event.target.value;
              if (value) {
                onChange({ ...filters, genres: toggleArrayValue(filters.genres, value) });
              }
            }}
            className="w-full rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Genre auswählen</option>
            {options.genres.map((genre) => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.genres.map((genre) => (
              <button
                key={genre}
                type="button"
                onClick={() => onChange({ ...filters, genres: filters.genres.filter((item) => item !== genre) })}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white"
              >
                {genre} x
              </button>
            ))}
          </div>
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Altersfreigabe</label>
          <select
            value=""
            onChange={(event) => {
              const value = event.target.value;
              if (value) {
                onChange({ ...filters, ageRatings: toggleArrayValue(filters.ageRatings, value) });
              }
            }}
            className="w-full rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white outline-none"
          >
            <option value="">Rating auswählen</option>
            {options.ageRatings.map((ageRating) => (
              <option key={ageRating} value={ageRating}>
                {ageRating}
              </option>
            ))}
          </select>
          <div className="mt-3 flex flex-wrap gap-2">
            {filters.ageRatings.map((ageRating) => (
              <button
                key={ageRating}
                type="button"
                onClick={() => onChange({ ...filters, ageRatings: filters.ageRatings.filter((item) => item !== ageRating) })}
                className="rounded-full bg-white/10 px-3 py-1 text-xs text-white"
              >
                {ageRating} x
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-4">
        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Erscheinungsjahr: {filters.releaseYearRange[0]} - {filters.releaseYearRange[1]}
          </label>
          <input type="range" min={options.years[0] ?? 1900} max={options.years[options.years.length - 1] ?? 2026} value={filters.releaseYearRange[0]} onChange={(event) => onChange({ ...filters, releaseYearRange: [Number(event.target.value), filters.releaseYearRange[1]] })} className="w-full" />
          <input type="range" min={options.years[0] ?? 1900} max={options.years[options.years.length - 1] ?? 2026} value={filters.releaseYearRange[1]} onChange={(event) => onChange({ ...filters, releaseYearRange: [filters.releaseYearRange[0], Number(event.target.value)] })} className="mt-2 w-full" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Laufzeit: {filters.runtimeRange[0]} - {filters.runtimeRange[1]} min
          </label>
          <input type="range" min={options.runtimeRange[0]} max={options.runtimeRange[1]} value={filters.runtimeRange[0]} onChange={(event) => onChange({ ...filters, runtimeRange: [Number(event.target.value), filters.runtimeRange[1]] })} className="w-full" />
          <input type="range" min={options.runtimeRange[0]} max={options.runtimeRange[1]} value={filters.runtimeRange[1]} onChange={(event) => onChange({ ...filters, runtimeRange: [filters.runtimeRange[0], Number(event.target.value)] })} className="mt-2 w-full" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Staffeln: {filters.seasonCountRange[0]} - {filters.seasonCountRange[1]}
          </label>
          <input type="range" min={options.seasonCountRange[0]} max={options.seasonCountRange[1]} value={filters.seasonCountRange[0]} onChange={(event) => onChange({ ...filters, seasonCountRange: [Number(event.target.value), filters.seasonCountRange[1]] })} className="w-full" />
          <input type="range" min={options.seasonCountRange[0]} max={options.seasonCountRange[1]} value={filters.seasonCountRange[1]} onChange={(event) => onChange({ ...filters, seasonCountRange: [filters.seasonCountRange[0], Number(event.target.value)] })} className="mt-2 w-full" />
        </div>

        <div className="rounded-2xl border border-white/10 bg-surface-900/70 p-4">
          <label className="mb-2 block text-sm font-medium text-slate-200">Jahreszeit</label>
          <div className="flex flex-wrap gap-2">
            {options.seasons.map((season) => {
              const active = filters.seasons.includes(season);
              return (
                <button key={season} type="button" onClick={() => onChange({ ...filters, seasons: toggleArrayValue(filters.seasons, season) })} className={`rounded-full px-3 py-1.5 text-sm ${active ? "bg-white text-surface-950" : "bg-white/5 text-slate-300"}`}>
                  {season}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-white/10 bg-surface-900/70 p-4">
        <label className="mb-2 block text-sm font-medium text-slate-200">Land / Produktionsland</label>
        <select
          value=""
          onChange={(event) => {
            const value = event.target.value;
            if (value) {
              onChange({ ...filters, countries: toggleArrayValue(filters.countries, value) });
            }
          }}
          className="w-full rounded-xl border border-white/10 bg-surface-800 px-3 py-2 text-sm text-white outline-none md:max-w-sm"
        >
          <option value="">Land auswählen</option>
          {options.countries.slice(0, 100).map((country) => (
            <option key={country} value={country}>
              {country}
            </option>
          ))}
        </select>
        <div className="mt-3 flex flex-wrap gap-2">
          {filters.countries.map((country) => (
            <button
              key={country}
              type="button"
              onClick={() => onChange({ ...filters, countries: filters.countries.filter((item) => item !== country) })}
              className="rounded-full bg-white/10 px-3 py-1 text-xs text-white"
            >
              {country} x
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
