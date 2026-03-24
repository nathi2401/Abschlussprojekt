import { PLATFORM_ORDER } from "../data/platformTheme";
import type { ContentType, FilterOptions, FilterState, PlatformId, SeasonName, StreamingTitle, SummaryMetrics } from "../types/streaming";

const SEASONS: SeasonName[] = ["Winter", "Spring", "Summer", "Autumn", "Unknown"];

export const buildFilterOptions = (titles: StreamingTitle[]): FilterOptions => {
  const years = Array.from(new Set(titles.map((title) => title.releaseYear).filter((value): value is number => Boolean(value)))).sort(
    (a, b) => a - b
  );
  const runtimes = titles.map((title) => title.runtimeMinutes).filter((value): value is number => Boolean(value));
  const seasonCounts = titles.map((title) => title.seasons).filter((value): value is number => Boolean(value));

  return {
    platforms: PLATFORM_ORDER,
    genres: Array.from(new Set(titles.flatMap((title) => title.genres))).sort((a, b) => a.localeCompare(b)),
    ageRatings: Array.from(new Set(titles.map((title) => title.ageRating))).sort((a, b) => a.localeCompare(b)),
    years,
    seasons: SEASONS,
    countries: Array.from(new Set(titles.map((title) => title.country || "Unknown"))).sort((a, b) => a.localeCompare(b)),
    runtimeRange: [Math.min(...runtimes, 0), Math.max(...runtimes, 240)],
    seasonCountRange: [Math.min(...seasonCounts, 0), Math.max(...seasonCounts, 20)]
  };
};

export const filterTitles = (titles: StreamingTitle[], filters: FilterState) =>
  titles.filter((title) => {
    const year = title.releaseYear ?? filters.releaseYearRange[0];
    const runtime = title.runtimeMinutes ?? 0;
    const seasons = title.seasons ?? 0;

    return (
      filters.platforms.includes(title.platform) &&
      (filters.type === "All" || title.type === filters.type) &&
      (filters.genres.length === 0 || title.genres.some((genre) => filters.genres.includes(genre))) &&
      (filters.ageRatings.length === 0 || filters.ageRatings.includes(title.ageRating)) &&
      year >= filters.releaseYearRange[0] &&
      year <= filters.releaseYearRange[1] &&
      (filters.seasons.length === 0 || filters.seasons.includes(title.season)) &&
      runtime >= filters.runtimeRange[0] &&
      runtime <= filters.runtimeRange[1] &&
      seasons >= filters.seasonCountRange[0] &&
      seasons <= filters.seasonCountRange[1] &&
      (filters.countries.length === 0 || filters.countries.includes(title.country || "Unknown"))
    );
  });

export const getSummaryMetrics = (titles: StreamingTitle[]): SummaryMetrics => {
  const movies = titles.filter((title) => title.type === "Movie").length;
  const tvShows = titles.filter((title) => title.type === "TV Show").length;
  const dominant = PLATFORM_ORDER.map((platform) => ({
    platform,
    count: titles.filter((title) => title.platform === platform).length
  })).sort((a, b) => b.count - a.count)[0];

  return {
    totalTitles: titles.length,
    movies,
    tvShows,
    dominantPlatform: dominant?.platform ?? null
  };
};

export const byPlatformType = (titles: StreamingTitle[]) =>
  PLATFORM_ORDER.map((platform) => {
    const scoped = titles.filter((title) => title.platform === platform);
    return {
      platform,
      total: scoped.length,
      movies: scoped.filter((title) => title.type === "Movie").length,
      tvShows: scoped.filter((title) => title.type === "TV Show").length
    };
  });

export const genreComparison = (titles: StreamingTitle[], type: "All" | ContentType, percentage = false) => {
  const scoped = type === "All" ? titles : titles.filter((title) => title.type === type);
  const totalsByPlatform = Object.fromEntries(
    PLATFORM_ORDER.map((platform) => [platform, scoped.filter((title) => title.platform === platform).length || 1])
  ) as Record<PlatformId, number>;

  const genres = Array.from(new Set(scoped.flatMap((title) => title.genres))).slice(0, 12);
  return genres.map((genre) => {
    const row: Record<string, string | number> = { genre };
    PLATFORM_ORDER.forEach((platform) => {
      const count = scoped.filter((title) => title.platform === platform && title.genres.includes(genre)).length;
      row[platform] = percentage ? (count / totalsByPlatform[platform]) * 100 : count;
    });
    return row;
  });
};

export const seasonalityComparison = (titles: StreamingTitle[], type: "All" | ContentType) =>
  SEASONS.map((season) => {
    const row: Record<string, string | number> = { season };
    const scoped = type === "All" ? titles : titles.filter((title) => title.type === type);
    PLATFORM_ORDER.forEach((platform) => {
      row[platform] = scoped.filter((title) => title.platform === platform && title.season === season).length;
    });
    return row;
  });

export const productionComparison = (titles: StreamingTitle[]) => byPlatformType(titles);

export const genreAgeHeatmap = (titles: StreamingTitle[]) => {
  const counts = new Map<string, number>();
  titles.forEach((title) => {
    title.genres.forEach((genre) => {
      const key = `${title.platform}__${genre}__${title.ageRating}`;
      counts.set(key, (counts.get(key) || 0) + 1);
    });
  });

  const genres = Array.from(new Set(titles.flatMap((title) => title.genres))).slice(0, 8);
  const ageRatings = Array.from(new Set(titles.map((title) => title.ageRating))).slice(0, 6);

  return genres.flatMap((genre) =>
    ageRatings.map((ageRating) => {
      const row: Record<string, string | number> = { genre, ageRating };
      PLATFORM_ORDER.forEach((platform) => {
        row[platform] = counts.get(`${platform}__${genre}__${ageRating}`) || 0;
      });
      return row;
    })
  );
};

export const runtimeStats = (titles: StreamingTitle[], type: ContentType) =>
  PLATFORM_ORDER.map((platform) => {
    const scoped = titles
      .filter((title) => title.platform === platform && title.type === type)
      .filter((title) => Boolean(type === "Movie" ? title.runtimeMinutes : title.runtimeMinutes || title.seasons));
    const values = scoped.map((title) => (type === "Movie" ? title.runtimeMinutes || 0 : (title.runtimeMinutes || 45) * Math.max(title.seasons || 1, 1)));
    const sorted = [...values].sort((a, b) => a - b);
    const average = values.length ? values.reduce((sum, value) => sum + value, 0) / values.length : 0;
    const median =
      sorted.length === 0
        ? 0
        : sorted.length % 2 === 0
          ? (sorted[sorted.length / 2 - 1] + sorted[sorted.length / 2]) / 2
          : sorted[Math.floor(sorted.length / 2)];

    const longestValue = Math.max(...values, 0);
    const shortestValue = scoped.length ? Math.min(...values) : 0;
    const longest = scoped[values.indexOf(longestValue)]?.title || "n/a";
    const shortest = scoped[values.indexOf(shortestValue)]?.title || "n/a";

    return { platform, count: scoped.length, average, median, longest, shortest };
  });

export const oldestByPlatform = (titles: StreamingTitle[], type: ContentType) =>
  PLATFORM_ORDER.map((platform) => {
    const oldest = titles
      .filter((title) => title.platform === platform && title.type === type && Boolean(title.releaseYear))
      .sort((a, b) => (a.releaseYear || 9999) - (b.releaseYear || 9999))[0];
    return { platform, title: oldest?.title || "n/a", year: oldest?.releaseYear ?? null };
  });

export const seriesSeasonStats = (titles: StreamingTitle[]) =>
  PLATFORM_ORDER.map((platform) => {
    const scoped = titles.filter((title) => title.platform === platform && title.type === "TV Show" && Boolean(title.seasons));
    const seasonCounts = scoped.map((title) => title.seasons || 0);
    const average = seasonCounts.length ? seasonCounts.reduce((sum, value) => sum + value, 0) / seasonCounts.length : 0;
    const top = [...scoped].sort((a, b) => (b.seasons || 0) - (a.seasons || 0))[0];
    const low = [...scoped].sort((a, b) => (a.seasons || 0) - (b.seasons || 0))[0];
    return {
      platform,
      average,
      max: top?.seasons || 0,
      min: low?.seasons || 0,
      topTitle: top?.title || "n/a",
      lowTitle: low?.title || "n/a"
    };
  });

export const topSeriesBySeasons = (titles: StreamingTitle[]) =>
  titles
    .filter((title) => title.type === "TV Show" && Boolean(title.seasons))
    .sort((a, b) => (b.seasons || 0) - (a.seasons || 0))
    .slice(0, 10);
