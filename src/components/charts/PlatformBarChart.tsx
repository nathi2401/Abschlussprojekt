import { Bar, BarChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PLATFORM_COLORS } from "../../data/platformTheme";

interface PlatformBarChartProps {
  data: Record<string, string | number>[];
  xKey: string;
  bars: { key: string; label: string }[];
  stacked?: boolean;
}

export const PlatformBarChart = ({ data, xKey, bars, stacked = false }: PlatformBarChartProps) => (
  <div className="h-80 w-full">
    <ResponsiveContainer>
      <BarChart data={data}>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey={xKey} stroke="#cbd5e1" tickLine={false} axisLine={false} />
        <YAxis stroke="#cbd5e1" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
        <Legend />
        {bars.map((bar) => (
          <Bar
            key={bar.key}
            dataKey={bar.key}
            stackId={stacked ? "stack" : undefined}
            fill={PLATFORM_COLORS[bar.key as keyof typeof PLATFORM_COLORS] || "#ffb347"}
            name={bar.label}
            radius={[8, 8, 0, 0]}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  </div>
);
