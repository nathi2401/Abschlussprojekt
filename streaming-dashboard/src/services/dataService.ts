import { mockData } from "../data/mockData";
import { MediaItem } from "../types";
import { parseCsv } from "../utils/csv";
import { buildFallbackMediaItem, normalizeAgeRating, normalizePlatform, normalizeType, parseRuntimeMinutes, parseSeasonCount, splitGenres } from "../utils/dataUtils";

const DATA_SOURCE = "/data/titles_flat_combined.csv";

const getFirstField = (row: Record<string, string>, candidates: string[]): string | undefined =>
  candidates.map((key) => row[key]).find((value) => typeof value === "string" && value.trim().length > 0);

const mapCsvRowToMediaItem = (row: Record<string, string>): MediaItem => {
  const genres = splitGenres(getFirstField(row, ["genres", "genre", "listed_in"]));
  const releaseMonth =
    Number(row.date_added_month) > 0
      ? Number(row.date_added_month)
      : row.date_added_iso
        ? new Date(row.date_added_iso).getMonth() + 1
        : null;
  const runtime = parseRuntimeMinutes(
    getFirstField(row, ["runtime_minutes", "runtime", "duration_minutes"]) ??
      (row.duration_unit === "min" ? getFirstField(row, ["duration_value", "duration"]) : undefined)
  );
  const seasons = parseSeasonCount(
    getFirstField(row, ["seasons_count", "season_count", "seasons", "number_of_seasons"]) ??
      (row.duration_unit && /(season|staffel)/i.test(row.duration_unit) ? getFirstField(row, ["duration_value", "duration"]) : undefined)
  );

  return buildFallbackMediaItem({
    id: row.title_id || row.platform_show_id || `${row.platform}_${row.title}`,
    title: row.title || "Ohne Titel",
    platform: normalizePlatform(row.platform),
    type: normalizeType(row.type),
    genre: genres.join(", "),
    genres,
    subgenre: genres[1],
    age_rating: normalizeAgeRating(row.rating_standard || row.rating_original),
    release_year: Number(row.release_year) || new Date().getFullYear(),
    release_month: releaseMonth,
    runtime_minutes: runtime,
    seasons,
    country: row.country?.trim() || "Nicht angegeben",
    date_added: row.date_added_iso || undefined,
    description: row.description || ""
  });
};

export const loadData = async (): Promise<MediaItem[]> => {
  try {
    const response = await fetch(DATA_SOURCE);
    if (!response.ok) {
      throw new Error(`CSV-Ladevorgang fehlgeschlagen: ${response.status}`);
    }

    const text = await response.text();
    const rows = parseCsv(text);
    const parsed = rows
      .map(mapCsvRowToMediaItem)
      .filter((item) => item.title && item.release_year);

    return parsed.length > 0 ? parsed : mockData;
  } catch (error) {
    console.warn("Wechsel auf lokale Fallback-Daten, weil die CSV nicht geladen werden konnte.", error);
    return mockData;
  }
};
