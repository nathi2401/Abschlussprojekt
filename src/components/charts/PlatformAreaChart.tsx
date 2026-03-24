import { Area, AreaChart, CartesianGrid, Legend, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { PLATFORM_COLORS } from "../../data/platformTheme";

interface PlatformAreaChartProps {
  data: Record<string, string | number>[];
  xKey: string;
}

export const PlatformAreaChart = ({ data, xKey }: PlatformAreaChartProps) => (
  <div className="h-80 w-full">
    <ResponsiveContainer>
      <AreaChart data={data}>
        <defs>
          {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
            <linearGradient key={platform} id={`gradient-${platform}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="rgba(148,163,184,0.12)" vertical={false} />
        <XAxis dataKey={xKey} stroke="#cbd5e1" tickLine={false} axisLine={false} />
        <YAxis stroke="#cbd5e1" tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
        <Legend />
        {Object.entries(PLATFORM_COLORS).map(([platform, color]) => (
          <Area key={platform} type="monotone" dataKey={platform} stroke={color} fill={`url(#gradient-${platform})`} strokeWidth={2} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  </div>
);
