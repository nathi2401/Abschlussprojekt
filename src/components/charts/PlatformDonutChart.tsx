import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from "recharts";
import { PLATFORM_COLORS, PLATFORM_ORDER } from "../../data/platformTheme";

interface PlatformDonutChartProps {
  data: { platform: string; total: number }[];
}

export const PlatformDonutChart = ({ data }: PlatformDonutChartProps) => (
  <div className="h-80 w-full">
    <ResponsiveContainer>
      <PieChart>
        <Pie data={data} dataKey="total" nameKey="platform" innerRadius={70} outerRadius={105} paddingAngle={4}>
          {data.map((entry) => (
            <Cell key={entry.platform} fill={PLATFORM_COLORS[entry.platform as (typeof PLATFORM_ORDER)[number]]} />
          ))}
        </Pie>
        <Tooltip contentStyle={{ backgroundColor: "#0b1220", border: "1px solid rgba(255,255,255,0.1)", borderRadius: 16 }} />
      </PieChart>
    </ResponsiveContainer>
  </div>
);
