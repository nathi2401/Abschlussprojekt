import React, { useEffect, useMemo, useState } from "react";
import { MediaItem } from "../../types";
import { ChartCard } from "./ChartCard";

type DatenlisteProps = {
  rows: MediaItem[];
  onSelectTitle: (item: MediaItem) => void;
};

const columns: Array<keyof MediaItem> = [
  "title",
  "platform",
  "type",
  "genre",
  "age_rating",
  "release_year",
  "release_month",
  "runtime_minutes",
  "seasons"
];

const columnLabels: Record<string, string> = {
  title: "Titel",
  platform: "Plattform",
  type: "Typ",
  genre: "Genre",
  age_rating: "Alter",
  release_year: "Jahr",
  release_month: "Monat",
  runtime_minutes: "Laufzeit",
  seasons: "Staffeln"
};

const renderType = (type: MediaItem["type"]) => (type === "Movie" ? "Film" : "TV-Serie");

export const Datenliste: React.FC<DatenlisteProps> = ({ rows, onSelectTitle }) => {
  const [sortBy, setSortBy] = useState<keyof MediaItem>("release_year");
  const [direction, setDirection] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const pageSize = 100;

  const sortedRows = useMemo(() => {
    const copy = [...rows];
    copy.sort((left, right) => {
      const leftValue = left[sortBy];
      const rightValue = right[sortBy];

      if (typeof leftValue === "number" && typeof rightValue === "number") {
        return direction === "asc" ? leftValue - rightValue : rightValue - leftValue;
      }

      if (leftValue == null) return 1;
      if (rightValue == null) return -1;

      const result = String(leftValue).localeCompare(String(rightValue));
      return direction === "asc" ? result : -result;
    });
    return copy;
  }, [direction, rows, sortBy]);

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const pagedRows = useMemo(() => sortedRows.slice((page - 1) * pageSize, page * pageSize), [page, sortedRows]);

  useEffect(() => {
    setPage(1);
  }, [rows, sortBy, direction]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const toggleSort = (column: keyof MediaItem) => {
    if (column === sortBy) {
      setDirection((current) => (current === "asc" ? "desc" : "asc"));
      return;
    }

    setSortBy(column);
    setDirection(column === "title" ? "asc" : "desc");
  };

  const exportCsv = () => {
    const header = columns.join(",");
    const body = sortedRows
      .map((row) =>
        columns
          .map((column) => {
            const raw = row[column];
            const value = Array.isArray(raw) ? raw.join(" | ") : raw ?? "";
            return `"${String(value).replace(/"/g, '""')}"`;
          })
          .join(",")
      )
      .join("\n");

    const blob = new Blob([`${header}\n${body}`], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "streaming-dashboard-export.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ChartCard
      title="Datenliste"
      subtitle="Sortierbare Liste für Titel, Plattform, Typ, Genre, Alter, Jahr, Monat, Laufzeit und Staffeln"
      action={
        <button className="rounded-2xl border border-slate-700 bg-slate-950/70 px-4 py-2 text-sm text-slate-100 transition hover:border-sky-400" onClick={exportCsv}>
          CSV exportieren
        </button>
      }
    >
      <div className="overflow-hidden rounded-[24px] border border-slate-800">
        <div className="max-h-[540px] overflow-auto">
          <table className="min-w-full border-collapse text-left text-sm text-slate-200">
            <thead className="sticky top-0 bg-slate-950/95 backdrop-blur">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="cursor-pointer px-4 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-slate-400 transition hover:text-white"
                    onClick={() => toggleSort(column)}
                  >
                    {columnLabels[String(column)]} {sortBy === column ? (direction === "asc" ? "^" : "v") : ""}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pagedRows.map((row) => (
                <tr key={row.id} className="border-t border-slate-800 bg-slate-950/40 transition hover:bg-slate-900/80">
                  <td className="px-4 py-3 font-medium text-white">
                    <button className="text-left text-sky-300 transition hover:text-white hover:underline" onClick={() => onSelectTitle(row)}>
                      {row.title}
                    </button>
                  </td>
                  <td className="px-4 py-3">{row.platform}</td>
                  <td className="px-4 py-3">{renderType(row.type)}</td>
                  <td className="px-4 py-3">{row.genre}</td>
                  <td className="px-4 py-3">{row.age_rating}</td>
                  <td className="px-4 py-3">{row.release_year}</td>
                  <td className="px-4 py-3">{row.release_month ?? "-"}</td>
                  <td className="px-4 py-3">{row.runtime_minutes ?? "-"}</td>
                  <td className="px-4 py-3">{row.seasons ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {sortedRows.length > 0 ? (
        <div className="mt-4 flex flex-col gap-3 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
          <div>
            Anzeige {Math.min((page - 1) * pageSize + 1, sortedRows.length)} bis {Math.min(page * pageSize, sortedRows.length)} von {sortedRows.length} Titeln
          </div>
          <div className="flex items-center gap-2">
            <button
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-200 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Zurück
            </button>
            <div className="rounded-xl border border-slate-800 bg-slate-900/70 px-3 py-2 text-slate-200">
              Seite {page} / {totalPages}
            </div>
            <button
              className="rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-slate-200 transition hover:border-sky-400 disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Weiter
            </button>
          </div>
        </div>
      ) : null}
      {sortedRows.length === 0 ? <p className="mt-4 text-sm text-slate-400">Keine Treffer für die aktuelle Filterkombination.</p> : null}
    </ChartCard>
  );
};
