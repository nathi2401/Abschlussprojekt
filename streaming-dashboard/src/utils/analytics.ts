import {
  DataCatalog,
  FiltersState,
  GenreComparisonRow,
  MetricSummary,
  MediaItem,
  OldestTitleEntry,
  Platform,
  PlatformBreakdownRow,
  PlatformLaufzeitStats,
  PlatformSeriesStats,
  SeasonStatsRow
} from "../types";
import { platformOrder } from "../config/theme";
import { getMedian } from "./dataUtils";

const createPlatformRecord = () => ({
  Netflix: 0,
  Amazon: 0,
  "Disney+": 0
});

const estimateEpisodeRuntime = (item: MediaItem): number | null => {
  if (typeof item.runtime_minutes === "number" && item.runtime_minutes > 0) return item.runtime_minutes;
  if (item.type !== "TV Show") return null;

  const genreText = `${item.genre} ${item.genres.join(" ")}`.toLowerCase();
  const seasons = item.seasons ?? 1;

  if (/(kids|animation|anime)/.test(genreText)) return seasons >= 4 ? 22 : 24;
  if (/(tv comedies|sitcom|comedy)/.test(genreText)) return seasons >= 4 ? 24 : 30;
  if (/(reality tv|reality|talk show|special interest|docuseries)/.test(genreText)) return 35;
  if (/(documentary|history|nature)/.test(genreText)) return 45;
  if (/(crime tv shows|tv dramas|drama|thriller|action|sci-fi|fantasy|mystery|horror)/.test(genreText)) {
    return seasons === 1 ? 50 : 45;
  }

  return seasons >= 3 ? 42 : 45;
};

const buildMetricSummary = (values: number[]): MetricSummary => {
  if (values.length === 0) {
    return {
      count: 0,
      min: null,
      max: null,
      avg: null,
      median: null
    };
  }

  return {
    count: values.length,
    min: Math.min(...values),
    max: Math.max(...values),
    avg: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10,
    median: getMedian(values)
  };
};

export const buildCatalog = (items: MediaItem[]): DataCatalog => ({
  years: Array.from(new Set(items.map((item) => item.release_year))).sort((left, right) => right - left),
  genres: Array.from(new Set(items.flatMap((item) => item.genres))).sort((left, right) => left.localeCompare(right)),
  ageRatings: Array.from(new Set(items.map((item) => item.age_rating))).sort((left, right) => left.localeCompare(right)),
  maxLaufzeit: Math.max(240, ...items.map((item) => item.runtime_minutes ?? 0))
});

export const applyDashboardFilters = (items: MediaItem[], filters: FiltersState): MediaItem[] => {
  const query = filters.query.trim().toLowerCase();

  return items.filter((item) => {
    const matchesPlatform = filters.platform === "All" || item.platform === filters.platform;
    const matchesType = filters.type === "All" || item.type === filters.type;
    const matchesGenre = filters.genre === "All" || item.genres.includes(filters.genre);
    const matchesAge = filters.age_rating === "All" || item.age_rating === filters.age_rating;
    const matchesYear = filters.release_year === "All" || item.release_year === filters.release_year;
    const runtimeValue = item.runtime_minutes ?? 0;
    const matchesLaufzeit = runtimeValue >= filters.runtime_min && runtimeValue <= filters.runtime_max;
    const matchesQuery =
      query.length === 0 ||
      item.title.toLowerCase().includes(query) ||
      item.genre.toLowerCase().includes(query) ||
      String(item.description ?? "").toLowerCase().includes(query);

    return matchesPlatform && matchesType && matchesGenre && matchesAge && matchesYear && matchesLaufzeit && matchesQuery;
  });
};

export const buildPlatformBreakdown = (items: MediaItem[]): PlatformBreakdownRow[] =>
  platformOrder.map((platform) => {
    const platformItems = items.filter((item) => item.platform === platform);
    const movie = platformItems.filter((item) => item.type === "Movie").length;
    const tv = platformItems.filter((item) => item.type === "TV Show").length;
    const total = platformItems.length;

    return {
      platform,
      total,
      movie,
      tv,
      filmAnteil: total === 0 ? 0 : Math.round((movie / total) * 100),
      serienAnteil: total === 0 ? 0 : Math.round((tv / total) * 100)
    };
  });

export const buildGenreComparison = (items: MediaItem[], type: "All" | "Movie" | "TV Show" = "All"): GenreComparisonRow[] => {
  const source = type === "All" ? items : items.filter((item) => item.type === type);
  const map = new Map<string, GenreComparisonRow>();

  source.forEach((item) => {
    item.genres.forEach((genre) => {
      const current = map.get(genre) ?? { genre, total: 0, ...createPlatformRecord() };
      current[item.platform] += 1;
      current.total += 1;
      map.set(genre, current);
    });
  });

  return Array.from(map.values())
    .sort((left, right) => right.total - left.total)
    .slice(0, 12);
};

export const buildAgeGenreHeatmap = (items: MediaItem[]) => {
  const combinations = new Map<string, { label: string; platformCounts: Record<Platform, number>; total: number }>();

  items.forEach((item) => {
    const primaryGenre = item.genres[0] ?? "Nicht angegeben";
    const key = `${primaryGenre}__${item.age_rating}`;
    const entry = combinations.get(key) ?? {
      label: `${primaryGenre} / ${item.age_rating}`,
      platformCounts: { Netflix: 0, Amazon: 0, "Disney+": 0 },
      total: 0
    };
    entry.platformCounts[item.platform] += 1;
    entry.total += 1;
    combinations.set(key, entry);
  });

  const top = Array.from(combinations.values())
    .sort((left, right) => right.total - left.total)
    .slice(0, 10);

  const maxCount = Math.max(1, ...top.map((entry) => Math.max(...platformOrder.map((platform) => entry.platformCounts[platform]))));

  return top.map((entry) => ({
    combination: entry.label,
    total: entry.total,
    cells: platformOrder.map((platform) => ({
      platform,
      count: entry.platformCounts[platform],
      intensity: entry.platformCounts[platform] / maxCount
    }))
  }));
};

export const buildLaufzeitStats = (items: MediaItem[], type: "Movie" | "TV Show"): PlatformLaufzeitStats[] =>
  platformOrder.map((platform) => {
    const platformItems = items.filter((item) => item.platform === platform && item.type === type);
    const mapped = platformItems
      .map((item) => ({ item, value: item.runtime_minutes }))
      .filter((entry): entry is { item: MediaItem; value: number } => typeof entry.value === "number" && entry.value > 0);

    if (mapped.length === 0) {
      return {
        platform,
        count: 0,
        min: 0,
        max: 0,
        avg: 0,
        median: 0,
        shortestTitle: "Keine Daten",
        longestTitle: "Keine Daten",
        unitLabel: "Minuten"
      };
    }

    const values = mapped.map((entry) => entry.value);
    const sorted = [...mapped].sort((left, right) => left.value - right.value);

    return {
      platform,
      count: platformItems.length,
      min: Math.min(...values),
      max: Math.max(...values),
      avg: Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 10) / 10,
      median: getMedian(values),
      shortestTitle: sorted[0].item.title,
      longestTitle: sorted[sorted.length - 1].item.title,
      unitLabel: "Minuten"
    };
  });

export const buildSeriesStats = (items: MediaItem[]): PlatformSeriesStats[] =>
  platformOrder.map((platform) => {
    const shows = items.filter((item) => item.platform === platform && item.type === "TV Show");
    const runtimeValues = shows.map((item) => estimateEpisodeRuntime(item)).filter((value): value is number => typeof value === "number" && value > 0);
    const seasonValues = shows.map((item) => item.seasons).filter((value): value is number => typeof value === "number" && value > 0);

    return {
      platform,
      showCount: shows.length,
      runtime: buildMetricSummary(runtimeValues),
      seasons: buildMetricSummary(seasonValues)
    };
  });

export const buildOldestByType = (items: MediaItem[], type: "Movie" | "TV Show"): OldestTitleEntry[] =>
  platformOrder
    .map((platform) => {
      const candidate = items
        .filter((item) => item.platform === platform && item.type === type)
        .sort((left, right) => left.release_year - right.release_year)[0];

      if (!candidate) return null;

      return {
        platform,
        title: candidate.title,
        release_year: candidate.release_year,
        age_rating: candidate.age_rating,
        genre: candidate.genre
      };
    })
    .filter((entry): entry is OldestTitleEntry => Boolean(entry));

export const buildSeasonStats = (items: MediaItem[]): SeasonStatsRow[] =>
  platformOrder.map((platform) => {
    const shows = items.filter((item) => item.platform === platform && item.type === "TV Show");
    const runtimeValues = shows.map((item) => estimateEpisodeRuntime(item)).filter((value): value is number => typeof value === "number" && value > 0);
    const seasonValues = shows.map((item) => item.seasons).filter((value): value is number => typeof value === "number" && value > 0);
    const runtimeStats = buildMetricSummary(runtimeValues);
    const seasonStats = buildMetricSummary(seasonValues);

    return {
      platform,
      showCount: shows.length,
      runtimeCount: runtimeStats.count,
      minRuntime: runtimeStats.min,
      avgRuntime: runtimeStats.avg,
      medianRuntime: runtimeStats.median,
      maxRuntime: runtimeStats.max,
      seasonCount: seasonStats.count,
      avgSeasons: seasonStats.avg,
      medianSeasons: seasonStats.median,
      maxSeasons: seasonStats.max
    };
  });

export const buildTopSeries = (items: MediaItem[]) =>
  items
    .filter((item) => item.type === "TV Show" && typeof item.seasons === "number" && item.seasons > 0)
    .sort((left, right) => (right.seasons ?? 0) - (left.seasons ?? 0) || left.title.localeCompare(right.title))
    .slice(0, 10);
