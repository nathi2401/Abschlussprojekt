import { Platform } from "../types";

export const platformColors: Record<Platform, string> = {
  Netflix: "#E50914",
  Amazon: "#FFFFFF",
  "Disney+": "#43C7FF"
};

export const contentTypeColors = {
  movie: "#FF6B4A",
  series: "#43C7FF",
  neutral: "#9CA3AF"
} as const;

export const dashboardTheme = {
  background: "#07111F",
  panel: "#0F1B2E",
  panelAlt: "#13243A",
  border: "#24354E",
  text: "#E6EEF8",
  muted: "#91A4BC",
  success: "#30D49D",
  warning: "#F5C451"
};

export const platformOrder: Platform[] = ["Netflix", "Amazon", "Disney+"];
