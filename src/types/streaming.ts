export type PlatformId = "Netflix" | "Amazon Prime" | "Disney+";
export type ContentType = "Movie" | "TV Show";
export type SeasonName = "Winter" | "Spring" | "Summer" | "Autumn" | "Unknown";

export interface StreamingTitle {
  id: string;
  title: string;
  platform: PlatformId;
  type: ContentType;
  genres: string[];
  subgenre?: string;
  ageRating: string;
  releaseYear?: number;
  releaseMonth?: number;
  season: SeasonName;
  runtimeMinutes?: number;
  seasons?: number;
  country?: string;
  language?: string;
  dateAdded?: string;
  description?: string;
}

export interface FilterState {
  platforms: PlatformId[];
  type: "All" | ContentType;
  genres: string[];
  ageRatings: string[];
  releaseYearRange: [number, number];
  seasons: SeasonName[];
  runtimeRange: [number, number];
  seasonCountRange: [number, number];
  countries: string[];
}

export interface FilterOptions {
  platforms: PlatformId[];
  genres: string[];
  ageRatings: string[];
  years: number[];
  seasons: SeasonName[];
  countries: string[];
  runtimeRange: [number, number];
  seasonCountRange: [number, number];
}

export interface CsvTitleRecord {
  title_id?: string;
  platform?: string;
  platform_code?: string;
  type?: string;
  title?: string;
  genres?: string;
  rating_standard?: string;
  rating_original?: string;
  release_year?: string;
  date_added_month?: string;
  date_added_iso?: string;
  runtime_minutes?: string;
  seasons_count?: string;
  country?: string;
  language?: string;
  description?: string;
}

export interface SummaryMetrics {
  totalTitles: number;
  movies: number;
  tvShows: number;
  dominantPlatform: PlatformId | null;
}
