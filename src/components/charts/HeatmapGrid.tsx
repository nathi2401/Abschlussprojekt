import { PLATFORM_ORDER } from "../../data/platformTheme";

interface HeatmapGridProps {
  data: Record<string, string | number>[];
}

export const HeatmapGrid = ({ data }: HeatmapGridProps) => {
  const max = Math.max(...data.flatMap((row) => PLATFORM_ORDER.map((platform) => Number(row[platform]) || 0)), 1);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-separate border-spacing-y-2 text-sm">
        <thead>
          <tr className="text-left text-slate-300">
            <th className="px-3 py-2">Genre</th>
            <th className="px-3 py-2">Rating</th>
            {PLATFORM_ORDER.map((platform) => (
              <th key={platform} className="px-3 py-2">
                {platform}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={`${row.genre}-${row.ageRating}`} className="rounded-2xl bg-white/[0.03]">
              <td className="rounded-l-2xl px-3 py-3 text-white">{String(row.genre)}</td>
              <td className="px-3 py-3 text-slate-300">{String(row.ageRating)}</td>
              {PLATFORM_ORDER.map((platform) => {
                const value = Number(row[platform]) || 0;
                const intensity = 0.15 + value / max;
                return (
                  <td key={platform} className="px-3 py-3">
                    <div
                      className="rounded-xl px-3 py-2 text-center font-medium text-white"
                      style={{
                        background:
                          platform === "Netflix"
                            ? `rgba(229,9,20,${Math.min(intensity, 0.95)})`
                            : platform === "Amazon Prime"
                              ? `rgba(15,61,145,${Math.min(intensity, 0.95)})`
                              : `rgba(84,184,255,${Math.min(intensity, 0.95)})`
                      }}
                    >
                      {value}
                    </div>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
