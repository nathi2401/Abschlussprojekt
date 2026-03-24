import { useMemo, useState } from "react";
import type { StreamingTitle } from "../../types/streaming";

interface DataTableProps {
  rows: StreamingTitle[];
}

type SortKey = "title" | "platform" | "type" | "releaseYear" | "runtimeMinutes" | "seasons";

export const DataTable = ({ rows }: DataTableProps) => {
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("asc");

  const filtered = useMemo(() => {
    const search = query.toLowerCase().trim();
    const searched = search
      ? rows.filter(
          (row) =>
            row.title.toLowerCase().includes(search) ||
            row.platform.toLowerCase().includes(search) ||
            row.genres.join(", ").toLowerCase().includes(search)
        )
      : rows;

    return [...searched].sort((a, b) => {
      const first = (a[sortKey] ?? "") as string | number;
      const second = (b[sortKey] ?? "") as string | number;
      const compared = typeof first === "number" && typeof second === "number" ? first - second : String(first).localeCompare(String(second));
      return sortDir === "asc" ? compared : -compared;
    });
  }, [query, rows, sortDir, sortKey]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Titel, Plattform oder Genre durchsuchen..." className="w-full rounded-2xl border border-white/10 bg-surface-800 px-4 py-3 text-sm text-white outline-none md:max-w-md" />
        <p className="text-sm text-slate-300">{filtered.length} Datensätze sichtbar</p>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-white/10">
        <table className="min-w-full text-sm">
          <thead className="bg-white/5 text-left text-slate-300">
            <tr>
              {[
                ["title", "Titel"],
                ["platform", "Plattform"],
                ["type", "Typ"],
                ["releaseYear", "Jahr"],
                ["runtimeMinutes", "Laufzeit"],
                ["seasons", "Staffeln"]
              ].map(([key, label]) => (
                <th key={key} className="cursor-pointer px-4 py-3 font-medium" onClick={() => toggleSort(key as SortKey)}>
                  {label}
                </th>
              ))}
              <th className="px-4 py-3 font-medium">Genre</th>
              <th className="px-4 py-3 font-medium">Rating</th>
              <th className="px-4 py-3 font-medium">Monat</th>
              <th className="px-4 py-3 font-medium">Jahreszeit</th>
              <th className="px-4 py-3 font-medium">Land</th>
            </tr>
          </thead>
          <tbody>
            {filtered.slice(0, 250).map((row) => (
              <tr key={row.id} className="border-t border-white/5 text-slate-100">
                <td className="px-4 py-3">{row.title}</td>
                <td className="px-4 py-3">{row.platform}</td>
                <td className="px-4 py-3">{row.type}</td>
                <td className="px-4 py-3">{row.releaseYear ?? "n/a"}</td>
                <td className="px-4 py-3">{row.runtimeMinutes ?? "n/a"}</td>
                <td className="px-4 py-3">{row.seasons ?? "n/a"}</td>
                <td className="px-4 py-3">{row.genres.join(", ")}</td>
                <td className="px-4 py-3">{row.ageRating}</td>
                <td className="px-4 py-3">{row.releaseMonth ?? "n/a"}</td>
                <td className="px-4 py-3">{row.season}</td>
                <td className="px-4 py-3">{row.country ?? "Unknown"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-xs text-slate-400">Aus Performance-Gründen werden maximal 250 Zeilen gleichzeitig dargestellt.</p>
    </div>
  );
};
