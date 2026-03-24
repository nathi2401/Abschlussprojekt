export type Platform = "Netflix" | "Amazon" | "Disney+";
export type ItemType = "Movie" | "TV Show";

export interface MediaItem {
  id: string;
  title: string;
  platform: Platform;
  type: ItemType;
  genre: string;
  genres: string[];
  subgenre?: string;
  age_rating: string;
  release_year: number;
  release_month: number | null;
  runtime_minutes: number | null;
  seasons: number | null;
  country: string;
  language?: string;
  date_added?: string;
  description?: string;
}

export interface FiltersState {
  platform: Platform | "All";
  type: ItemType | "All";
  genre: string | "All";
  age_rating: string | "All";
  release_year: number | "All";
  runtime_min: number;
  runtime_max: number;
  query: string;
}

export interface DataCatalog {
  years: number[];
  genres: string[];
  ageRatings: string[];
  maxLaufzeit: number;
}

export interface PlatformBreakdownRow {
  platform: Platform;
  total: number;
  movie: number;
  tv: number;
  filmAnteil: number;
  serienAnteil: number;
}

export interface GenreComparisonRow {
  genre: string;
  Netflix: number;
  Amazon: number;
  "Disney+": number;
  total: number;
}

export interface PlatformLaufzeitStats {
  platform: Platform;
  count: number;
  min: number;
  max: number;
  avg: number;
  median: number;
  shortestTitle: string;
  longestTitle: string;
  unitLabel: string;
}

export interface MetricSummary {
  count: number;
  min: number | null;
  max: number | null;
  avg: number | null;
  median: number | null;
}

export interface PlatformSeriesStats {
  platform: Platform;
  showCount: number;
  runtime: MetricSummary;
  seasons: MetricSummary;
}

export interface OldestTitleEntry {
  platform: Platform;
  title: string;
  release_year: number;
  age_rating: string;
  genre: string;
}

export interface SeasonStatsRow {
  platform: Platform;
  showCount: number;
  runtimeCount: number;
  minRuntime: number | null;
  avgRuntime: number | null;
  medianRuntime: number | null;
  maxRuntime: number | null;
  seasonCount: number;
  avgSeasons: number | null;
  medianSeasons: number | null;
  maxSeasons: number | null;
}
