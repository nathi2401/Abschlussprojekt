import React from "react";

export const Spinner: React.FC = () => (
  <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-[28px] border border-slate-800 bg-slate-950/40">
    <div className="h-12 w-12 animate-spin rounded-full border-4 border-slate-700 border-t-sky-400" />
    <p className="text-sm text-slate-400">Streaming-Daten werden lokal geladen...</p>
  </div>
);
