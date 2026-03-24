import type { ContentType, CsvTitleRecord, PlatformId, SeasonName, StreamingTitle } from "../types/streaming";

const platformMap: Record<string, PlatformId> = {
  netflix: "Netflix",
  nflx: "Netflix",
  amazon: "Amazon Prime",
  "amazon prime": "Amazon Prime",
  amz: "Amazon Prime",
  "prime video": "Amazon Prime",
  disney: "Disney+",
  "disney+": "Disney+",
  dnp: "Disney+"
};

const ageRatingMap: Record<string, string> = {
  all: "0+",
  g: "0+",
  pg: "6+",
  "tv-g": "0+",
  "tv-pg": "6+",
  "7+": "6+",
  "13+": "12+",
  "tv-14": "12+",
  "16+": "16+",
  "18+": "18+",
  "tv-ma": "16+",
  r: "16+",
  "nc-17": "18+"
};

const genreAliases: Record<string, string> = {
  scifi: "Sci-Fi",
  "science fiction": "Sci-Fi",
  documentaries: "Documentary",
  suspense: "Thriller",
  children: "Kids",
  kids: "Kids"
};

const toNumber = (value?: string) => {
  if (!value || value.trim() === "") {
    return undefined;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : undefined;
};

const normalizePlatform = (platform?: string, code?: string): PlatformId => {
  const key = (platform || code || "").trim().toLowerCase();
  return platformMap[key] ?? "Netflix";
};

const normalizeType = (type?: string): ContentType => {
  const value = (type || "").trim().toLowerCase();
  return value.includes("show") || value.includes("tv") ? "TV Show" : "Movie";
};

export const deriveSeason = (month?: number, isoDate?: string): SeasonName => {
  const parsedMonth =
    month && month >= 1 && month <= 12
      ? month
      : isoDate
        ? new Date(isoDate).getUTCMonth() + 1
        : undefined;

  switch (parsedMonth) {
    case 12:
    case 1:
    case 2:
      return "Winter";
    case 3:
    case 4:
    case 5:
      return "Spring";
    case 6:
    case 7:
    case 8:
      return "Summer";
    case 9:
    case 10:
    case 11:
      return "Autumn";
    default:
      return "Unknown";
  }
};

export const normalizeGenres = (raw?: string) => {
  if (!raw) {
    return ["Unknown"];
  }

  const genres = raw
    .split(",")
    .map((entry) => entry.trim())
    .filter(Boolean)
    .map((genre) => genreAliases[genre.toLowerCase()] ?? genre);

  return Array.from(new Set(genres)).slice(0, 4);
};

export const normalizeAgeRating = (value?: string) => {
  if (!value) {
    return "Unknown";
  }
  const cleaned = value.trim().toLowerCase();
  return ageRatingMap[cleaned] ?? value.trim().toUpperCase();
};

export const normalizeCsvRow = (row: CsvTitleRecord, index: number): StreamingTitle => ({
  id: row.title_id || `local-${index}`,
  title: row.title?.trim() || `Untitled ${index + 1}`,
  platform: normalizePlatform(row.platform, row.platform_code),
  type: normalizeType(row.type),
  genres: normalizeGenres(row.genres),
  ageRating: normalizeAgeRating(row.rating_standard || row.rating_original),
  releaseYear: toNumber(row.release_year),
  releaseMonth: toNumber(row.date_added_month),
  season: deriveSeason(toNumber(row.date_added_month), row.date_added_iso),
  runtimeMinutes: toNumber(row.runtime_minutes),
  seasons: toNumber(row.seasons_count),
  country: row.country?.trim() || "Unknown",
  language: row.language?.trim() || "Unknown",
  dateAdded: row.date_added_iso?.trim(),
  description: row.description?.trim()
});
