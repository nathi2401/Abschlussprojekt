import { ItemType, MediaItem, Platform } from "../types";

export const normalizePlatform = (value: string | undefined): Platform => {
  const text = String(value ?? "").trim().toLowerCase();
  if (text.includes("amazon") || text.includes("prime")) return "Amazon";
  if (text.includes("disney")) return "Disney+";
  return "Netflix";
};

export const normalizeType = (value: string | undefined): ItemType => {
  const text = String(value ?? "").trim().toLowerCase();
  return text.includes("tv") ? "TV Show" : "Movie";
};

export const normalizeAgeRating = (value: string | undefined): string => {
  const rating = String(value ?? "").trim().toUpperCase();
  if (!rating) return "Ohne Freigabe";

  const map: Record<string, string> = {
    ALL: "All",
    "0+": "All",
    "6+": "6+",
    "7+": "7+",
    "9+": "9+",
    G: "G",
    PG: "PG",
    "TV-G": "TV-G",
    "TV-Y": "TV-Y",
    "TV-Y7": "TV-Y7",
    "TV-PG": "TV-PG",
    "PG-13": "PG-13",
    "12+": "12+",
    "13+": "13+",
    "14+": "14+",
    "TV-14": "TV-14",
    "16+": "16+",
    "TV-MA": "TV-MA",
    R: "R",
    "18+": "18+",
    "NC-17": "NC-17",
    NR: "NR",
    UR: "UR"
  };

  return map[rating] ?? rating;
};

export const splitGenres = (genreField: string | undefined): string[] =>
  String(genreField ?? "")
    .split(",")
    .map((genre) => genre.trim())
    .filter(Boolean)
    .map((genre) => genre.replace(/\bIntl\b/gi, "International").replace(/\s+/g, " "));

export const getMedian = (values: number[]): number => {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((left, right) => left - right);
  const middle = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0
    ? Math.round(((sorted[middle - 1] + sorted[middle]) / 2) * 10) / 10
    : sorted[middle];
};

export const getNumericValue = (value: string | undefined): number | null => {
  if (!value) return null;
  const match = value.match(/\d+/);
  return match ? Number(match[0]) : null;
};

export const parseRuntimeMinutes = (value: string | number | null | undefined): number | null => {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? value : null;
  if (!value) return null;

  const text = String(value).trim().toLowerCase();
  if (!text) return null;
  if (/(season|staffel|episode|folge)/.test(text)) return null;

  const hhmmMatch = text.match(/(\d{1,2}):(\d{2})/);
  if (hhmmMatch) {
    const hours = Number(hhmmMatch[1]);
    const minutes = Number(hhmmMatch[2]);
    const total = hours * 60 + minutes;
    return total > 0 ? total : null;
  }

  const valueMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!valueMatch) return null;

  const numeric = Number(valueMatch[1].replace(",", "."));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  if (/(hour|std|stunde|hr)/.test(text)) {
    return Math.round(numeric * 60);
  }

  return Math.round(numeric);
};

export const parseSeasonCount = (value: string | number | null | undefined): number | null => {
  if (typeof value === "number") return Number.isFinite(value) && value > 0 ? Math.trunc(value) : null;
  if (!value) return null;

  const text = String(value).trim().toLowerCase();
  if (!text) return null;

  const valueMatch = text.match(/(\d+(?:[.,]\d+)?)/);
  if (!valueMatch) return null;

  const numeric = Number(valueMatch[1].replace(",", "."));
  if (!Number.isFinite(numeric) || numeric <= 0) return null;

  return Math.trunc(numeric);
};

export const buildFallbackMediaItem = (
  partial: Partial<MediaItem> & Pick<MediaItem, "id" | "title" | "platform" | "type">
): MediaItem => {
  const genres = partial.genres ?? splitGenres(partial.genre);

  return {
    age_rating: "Ohne Freigabe",
    country: "Nicht angegeben",
    date_added: undefined,
    description: "",
    genre: genres.join(", "),
    genres,
    language: "Nicht angegeben",
    release_month: null,
    release_year: new Date().getFullYear(),
    runtime_minutes: null,
    seasons: null,
    ...partial
  };
};
