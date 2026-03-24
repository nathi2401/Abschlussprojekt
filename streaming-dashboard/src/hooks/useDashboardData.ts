import { useDeferredValue, useEffect, useMemo, useState } from "react";
import { useFilters } from "../context/FilterContext";
import { loadData } from "../services/dataService";
import { MediaItem } from "../types";
import {
  applyDashboardFilters,
  buildAgeGenreHeatmap,
  buildCatalog,
  buildLaufzeitStats,
  buildOldestByType,
  buildPlatformBreakdown,
  buildSeriesStats,
  buildSeasonStats,
  buildTopSeries
} from "../utils/analytics";

export const useDashboardData = () => {
  const [allItems, setAllItems] = useState<MediaItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { filters } = useFilters();
  const deferredQuery = useDeferredValue(filters.query);

  useEffect(() => {
    let isMounted = true;

    const run = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const items = await loadData();
        if (isMounted) setAllItems(items);
      } catch (loadError) {
        console.error(loadError);
        if (isMounted) setError("Die Daten konnten lokal nicht geladen werden.");
      } finally {
        if (isMounted) setIsLoading(false);
      }
    };

    run();
    return () => {
      isMounted = false;
    };
  }, []);

  const catalog = useMemo(() => buildCatalog(allItems), [allItems]);
  const effectiveFilters = useMemo(() => ({ ...filters, query: deferredQuery }), [deferredQuery, filters]);
  const filteredItems = useMemo(() => applyDashboardFilters(allItems, effectiveFilters), [allItems, effectiveFilters]);
  const platformBreakdown = useMemo(() => buildPlatformBreakdown(filteredItems), [filteredItems]);
  const analysisItems = useMemo(() => allItems, [allItems]);
  const analysisPlatformBreakdown = useMemo(() => buildPlatformBreakdown(analysisItems), [analysisItems]);
  const filmLaufzeit = useMemo(() => buildLaufzeitStats(analysisItems, "Movie"), [analysisItems]);
  const serienLaufzeit = useMemo(() => buildSeriesStats(analysisItems), [analysisItems]);
  const oldestMovies = useMemo(() => buildOldestByType(analysisItems, "Movie"), [analysisItems]);
  const oldestShows = useMemo(() => buildOldestByType(analysisItems, "TV Show"), [analysisItems]);
  const seasonStats = useMemo(() => buildSeasonStats(analysisItems), [analysisItems]);
  const topSeries = useMemo(() => buildTopSeries(analysisItems), [analysisItems]);
  const ageGenreHeatmap = useMemo(() => buildAgeGenreHeatmap(analysisItems), [analysisItems]);

  const topPlatform = useMemo(() => {
    const [first] = [...platformBreakdown].sort((left, right) => right.total - left.total);
    return first?.platform ?? "Netflix";
  }, [platformBreakdown]);

  const totals = useMemo(
    () => ({
      totalTitles: filteredItems.length,
      totalMovies: filteredItems.filter((item) => item.type === "Movie").length,
      totalShows: filteredItems.filter((item) => item.type === "TV Show").length
    }),
    [filteredItems]
  );

  return {
    allItems,
    filteredItems,
    catalog,
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
  };
};
