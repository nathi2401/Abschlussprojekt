interface MetricCardProps {
  label: string;
  value: string;
  accent: string;
  helper?: string;
}

export const MetricCard = ({ label, value, accent, helper }: MetricCardProps) => (
  <div className="rounded-2xl border border-white/10 bg-surface-900/80 p-4 transition-transform duration-200 hover:-translate-y-1 hover:border-white/20">
    <div className="mb-3 h-1.5 rounded-full" style={{ backgroundColor: accent }} />
    <p className="text-sm text-slate-400">{label}</p>
    <p className="mt-2 font-display text-3xl font-semibold text-white">{value}</p>
    {helper ? <p className="mt-2 text-sm text-slate-400">{helper}</p> : null}
  </div>
);
