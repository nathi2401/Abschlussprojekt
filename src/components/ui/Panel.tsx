import type { PropsWithChildren, ReactNode } from "react";

interface PanelProps extends PropsWithChildren {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export const Panel = ({ title, subtitle, action, className = "", children }: PanelProps) => (
  <section className={`glass-panel rounded-3xl p-5 shadow-glow ${className}`}>
    <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div>
        <h2 className="font-display text-xl font-semibold text-white">{title}</h2>
        {subtitle ? <p className="mt-1 text-sm text-slate-300">{subtitle}</p> : null}
      </div>
      {action}
    </div>
    {children}
  </section>
);
