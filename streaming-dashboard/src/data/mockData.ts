import { MediaItem } from "../types";
import { buildFallbackMediaItem, normalizeAgeRating, normalizePlatform, normalizeType, splitGenres } from "../utils/dataUtils";

const rawFallback = [
  {
    id: "NF-001",
    title: "Red Notice",
    platform: "Netflix",
    type: "Movie",
    genre: "Action, Comedy",
    age_rating: "PG-13",
    release_year: 2021,
    release_month: 11,
    runtime_minutes: 118,
    seasons: null,
    country: "United States",
    description: "Interpol chase, luxury heists and blockbuster pacing."
  },
  {
    id: "NF-002",
    title: "The Crown",
    platform: "Netflix",
    type: "TV Show",
    genre: "Drama, History",
    age_rating: "TV-MA",
    release_year: 2016,
    release_month: 11,
    runtime_minutes: 58,
    seasons: 6,
    country: "United Kingdom",
    description: "Prestige royal drama across several decades."
  },
  {
    id: "AMZ-001",
    title: "The Tomorrow War",
    platform: "Amazon Prime",
    type: "Movie",
    genre: "Action, Sci-Fi",
    age_rating: "16+",
    release_year: 2021,
    release_month: 7,
    runtime_minutes: 138,
    seasons: null,
    country: "United States",
    description: "A time-travel war movie with large-scale spectacle."
  },
  {
    id: "AMZ-002",
    title: "The Boys",
    platform: "Amazon Prime",
    type: "TV Show",
    genre: "Action, Comedy, Drama",
    age_rating: "18+",
    release_year: 2019,
    release_month: 7,
    runtime_minutes: 58,
    seasons: 4,
    country: "United States",
    description: "A violent anti-superhero satire."
  },
  {
    id: "DIS-001",
    title: "The Mandalorian",
    platform: "Disney+",
    type: "TV Show",
    genre: "Action, Adventure, Sci-Fi",
    age_rating: "TV-14",
    release_year: 2019,
    release_month: 11,
    runtime_minutes: 40,
    seasons: 3,
    country: "United States",
    description: "A Star Wars frontier adventure."
  },
  {
    id: "DIS-002",
    title: "Encanto",
    platform: "Disney+",
    type: "Movie",
    genre: "Animation, Family, Fantasy",
    age_rating: "PG",
    release_year: 2021,
    release_month: 11,
    runtime_minutes: 99,
    seasons: null,
    country: "United States",
    description: "A musical family fantasy from Disney."
  }
];

export const mockData: MediaItem[] = rawFallback.map((entry) => {
  const platform = normalizePlatform(entry.platform);
  const type = normalizeType(entry.type);
  const genres = splitGenres(entry.genre);

  return buildFallbackMediaItem({
    ...entry,
    platform,
    type,
    genre: genres.join(", "),
    genres,
    age_rating: normalizeAgeRating(entry.age_rating)
  });
});
