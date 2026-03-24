import React from "react";
import { platformColors, platformOrder } from "../../config/theme";
import { ChartCard } from "../common/ChartCard";

type HeatmapRow = {
  combination: string;
  total: number;
  cells: {
    platform: "Netflix" | "Amazon" | "Disney+";
    count: number;
    intensity: number;
  }[];
};

type AgeGenreHeatmapProps = {
  data: HeatmapRow[];
};

export const AgeGenreHeatmap: React.FC<AgeGenreHeatmapProps> = ({ data }) => (
  <ChartCard title="Plattformpräferenzen nach Genre und Altersfreigabe" subtitle="Dezente Heatmap für die stärksten Kombinationen aus Genre und Freigabe">
    <div className="space-y-3">
      <div className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.55fr))] gap-3 text-[11px] font-semibold uppercase tracking-[0.16em] text-slate-500">
        <div>Kombination</div>
        {platformOrder.map((platform) => (
          <div key={platform} className="text-center">
            {platform}
          </div>
        ))}
      </div>

      {data.map((row) => (
        <div key={row.combination} className="grid grid-cols-[minmax(0,1.6fr)_repeat(3,minmax(0,0.55fr))] gap-3">
          <div className="rounded-2xl border border-slate-800/90 bg-slate-900/55 px-4 py-3 text-sm text-slate-100">
            <div className="font-medium">{row.combination}</div>
            <div className="mt-1 text-xs text-slate-500">{row.total} Titel</div>
          </div>
          {row.cells.map((cell) => (
            <div
              key={`${row.combination}-${cell.platform}`}
              className="flex items-center justify-center rounded-2xl border border-slate-800/80 text-sm font-semibold text-white"
              style={{
                backgroundColor: `${platformColors[cell.platform]}${Math.max(12, Math.round(cell.intensity * 45))
                  .toString(16)
                  .padStart(2, "0")}`
              }}
            >
              {cell.count}
            </div>
          ))}
        </div>
      ))}
    </div>
  </ChartCard>
);
