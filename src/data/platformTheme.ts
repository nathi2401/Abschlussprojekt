import type { PlatformId } from "../types/streaming";

export const PLATFORM_COLORS: Record<PlatformId, string> = {
  Netflix: "#e50914",
  "Amazon Prime": "#0f3d91",
  "Disney+": "#54b8ff"
};

export const PLATFORM_ORDER: PlatformId[] = ["Netflix", "Amazon Prime", "Disney+"];
