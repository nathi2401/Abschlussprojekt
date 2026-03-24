import React, { useEffect } from "react";
import { MediaItem } from "../../types";

type TitleDetailModalProps = {
  item: MediaItem | null;
  onClose: () => void;
};

const renderType = (type: MediaItem["type"]) => (type === "Movie" ? "Film" : "TV-Serie");

export const TitleDetailModal: React.FC<TitleDetailModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    if (!item) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose();
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 px-4 py-6 backdrop-blur-sm" onClick={onClose}>
      <div
        className="max-h-[88vh] w-full max-w-2xl overflow-auto rounded-[28px] border border-slate-700 bg-[linear-gradient(180deg,rgba(17,29,48,0.98),rgba(7,17,31,0.98))] p-6 shadow-[0_30px_100px_rgba(2,6,23,0.6)]"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-slate-500">{item.platform}</p>
            <h3 className="mt-2 text-2xl font-semibold text-white">{item.title}</h3>
            <p className="mt-2 text-sm text-slate-300">
              {renderType(item.type)} | {item.release_year} | {item.age_rating}
            </p>
          </div>
          <button
            className="rounded-full border border-slate-700 bg-slate-950/70 px-3 py-2 text-sm text-slate-200 transition hover:border-sky-400 hover:text-white"
            onClick={onClose}
          >
            Schließen
          </button>
        </div>

        <div className="mt-5 grid gap-3 md:grid-cols-2">
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Genre</div>
            <div className="mt-2 text-sm text-slate-100">{item.genre}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Laufzeit</div>
            <div className="mt-2 text-sm text-slate-100">{item.runtime_minutes === null ? "Keine Daten" : `${item.runtime_minutes} Minuten`}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Staffeln</div>
            <div className="mt-2 text-sm text-slate-100">{item.seasons === null ? "Keine Daten" : item.seasons}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Veröffentlichungsmonat</div>
            <div className="mt-2 text-sm text-slate-100">{item.release_month ?? "-"}</div>
          </div>
          <div className="rounded-3xl border border-slate-800 bg-slate-950/45 p-4 md:col-span-2">
            <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Plattform</div>
            <div className="mt-2 text-sm text-slate-100">{item.platform}</div>
          </div>
        </div>

        <div className="mt-5 rounded-3xl border border-slate-800 bg-slate-950/45 p-5">
          <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Beschreibung</div>
          <p className="mt-3 text-sm leading-7 text-slate-200">{item.description || "Keine Beschreibung verfügbar."}</p>
        </div>
      </div>
    </div>
  );
};
