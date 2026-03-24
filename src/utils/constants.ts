import type { FilterState } from "../types/streaming";
import { PLATFORM_ORDER } from "../data/platformTheme";

export const SECTION_TABS = [
  { id: "overview", label: "Overview" },
  { id: "genres", label: "Genres" },
  { id: "releases", label: "Release Seasons" },
  { id: "runtime", label: "Runtime" },
  { id: "series", label: "TV Shows" },
  { id: "table", label: "Table" }
] as const;

export const DEFAULT_FILTERS = (
  years: number[],
  runtimeRange: [number, number],
  seasonCountRange: [number, number]
): FilterState => ({
  platforms: [...PLATFORM_ORDER],
  type: "All",
  genres: [],
  ageRatings: [],
  releaseYearRange: [years[0] ?? 1900, years[years.length - 1] ?? new Date().getFullYear()],
  seasons: [],
  runtimeRange,
  seasonCountRange,
  countries: []
});
