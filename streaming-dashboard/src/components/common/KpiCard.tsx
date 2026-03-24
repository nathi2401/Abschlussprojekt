import React from "react";

type KpiCardProps = {
  label: string;
  value: string | number;
  hint?: string;
  accent?: string;
};

export const KpiCard: React.FC<KpiCardProps> = ({ label, value, hint, accent = "#43C7FF" }) => (
  <article className="rounded-2xl border border-slate-800 bg-slate-900/75 p-5">
    <div className="flex items-center justify-between gap-3">
      <div className="text-[11px] font-semibold uppercase tracking-[0.22em] text-slate-500">{label}</div>
      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: accent }} />
    </div>
    <div className="mt-4 text-3xl font-semibold text-white">{value}</div>
    {hint ? <p className="mt-2 text-sm text-slate-400">{hint}</p> : null}
  </article>
);
