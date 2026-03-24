import { useEffect, useMemo, useState } from "react";
import type { FilterOptions, FilterState, StreamingTitle } from "../types/streaming";
import { buildFilterOptions, filterTitles } from "../utils/analytics";
import { DEFAULT_FILTERS } from "../utils/constants";
import { parseCsvText, readFileAsText } from "../utils/csv";

export const useStreamingData = () => {
  const [titles, setTitles] = useState<StreamingTitle[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState | null>(null);

  useEffect(() => {
    const load = async () => {
      setStatus("loading");
      try {
        const response = await fetch("/data/titles_flat_combined.csv");
        if (!response.ok) {
          throw new Error("CSV konnte nicht geladen werden.");
        }
        const parsed = await parseCsvText(await response.text());
        const options = buildFilterOptions(parsed);
        setTitles(parsed);
        setFilters(DEFAULT_FILTERS(options.years, options.runtimeRange, options.seasonCountRange));
        setStatus("ready");
      } catch (loadError) {
        setError(loadError instanceof Error ? loadError.message : "Unbekannter Fehler");
        setStatus("error");
      }
    };
    void load();
  }, []);

  const options: FilterOptions = useMemo(() => buildFilterOptions(titles), [titles]);
  const filteredTitles = useMemo(() => (filters ? filterTitles(titles, filters) : titles), [filters, titles]);

  const resetFilters = () => {
    setFilters(DEFAULT_FILTERS(options.years, options.runtimeRange, options.seasonCountRange));
  };

  const importCsv = async (file: File) => {
    const text = await readFileAsText(file);
    const parsed = await parseCsvText(text);
    const nextOptions = buildFilterOptions(parsed);
    setTitles(parsed);
    setFilters(DEFAULT_FILTERS(nextOptions.years, nextOptions.runtimeRange, nextOptions.seasonCountRange));
  };

  return { titles, filteredTitles, status, error, filters, setFilters, options, resetFilters, importCsv };
};
