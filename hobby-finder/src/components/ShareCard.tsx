'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
} from 'recharts';
import type { Hobby, Locale } from '@/types';

const CHART_SIZE = 340;
const radiusTicks = [2, 4, 6, 8, 10].map((value, index) => ({ value, coordinate: value, index }));
const GRID_MAX_R = 100;
const gridRadii = [2, 4, 6, 8, 10].map((v) => (v / 10) * GRID_MAX_R);

export interface RiasecPoint {
  trait: string;
  value: number;
  fullMark: number;
}

interface ShareCardProps {
  shareCardTitle: string;
  shareCardTop3Label: string;
  riasecData: RiasecPoint[];
  top3: { hobby: Hobby }[];
  locale: Locale;
  backgroundColor: string;
  textColor: string;
  borderColor: string;
  accentColor: string;
}

export default function ShareCard({
  shareCardTitle,
  shareCardTop3Label: top3Label,
  riasecData,
  top3,
  locale,
  backgroundColor,
  textColor,
  borderColor,
  accentColor,
}: ShareCardProps) {
  return (
    <div
      className="rounded-2xl border-2 flex flex-col items-center justify-center p-8"
      style={{
        width: 800,
        height: 500,
        backgroundColor,
        color: textColor,
        borderColor,
      }}
    >
      <h2
        className="text-2xl font-bold text-center mb-6"
        style={{ color: textColor }}
      >
        {shareCardTitle}
      </h2>

      <div className="flex items-center gap-8 w-full flex-1">
        <div
          className="rounded-xl border flex items-center justify-center flex-shrink-0"
          style={{
            width: CHART_SIZE,
            height: CHART_SIZE,
            borderColor,
            background: 'rgba(255,255,255,0.03)',
          }}
        >
          <RadarChart width={CHART_SIZE} height={CHART_SIZE} data={riasecData}>
            <PolarGrid stroke="rgba(107, 95, 122, 0.35)" gridType="circle" polarRadius={gridRadii} />
            <PolarAngleAxis
              dataKey="trait"
              tick={{ fontSize: 10, fill: textColor }}
            />
            <PolarRadiusAxis
              angle={90}
              domain={[0, 10]}
              ticks={radiusTicks}
              tick={{ fontSize: 9, fill: textColor, opacity: 0.8 }}
            />
            <Radar
              name="RIASEC"
              dataKey="value"
              stroke={accentColor}
              fill={accentColor}
              fillOpacity={0.4}
              strokeWidth={2}
            />
          </RadarChart>
        </div>

        <div className="flex-1">
          <p className="text-sm font-semibold uppercase tracking-wider mb-3 opacity-80">
            {top3Label}
          </p>
          <ol className="list-decimal list-inside space-y-2">
            {top3.map(({ hobby }, i) => (
              <li
                key={hobby.id}
                className="text-lg font-semibold"
                style={{ color: textColor }}
              >
                {hobby.name[locale]}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}
