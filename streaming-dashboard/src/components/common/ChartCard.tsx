import React from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
};

export const ChartCard: React.FC<ChartCardProps> = ({ title, subtitle, action, children }) => (
  <section className="min-w-0 rounded-2xl border border-slate-800/90 bg-slate-900/75 p-5">
    <div className="flex flex-wrap items-start justify-between gap-3">
      <div>
        <h3 className="text-base font-semibold text-white">{title}</h3>
        {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    <div className="mt-5 min-w-0">{children}</div>
  </section>
);
