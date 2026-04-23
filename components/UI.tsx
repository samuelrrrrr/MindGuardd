import React, { useState } from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Path,
  LinearGradient,
  Stop,
  Defs,
  Line,
  Polyline,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { C } from '../constants/Colors';

/* ── CARD ── */
interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}
export const Card: React.FC<CardProps> = ({ children, style }) => (
  <View style={[styles.card, style]}>{children}</View>
);

/* ── PILL ── */
interface PillProps {
  label: string;
  color?: string;
  bg?: string;
}
export const Pill: React.FC<PillProps> = ({
  label,
  color = C.purple,
  bg = C.purplePale,
}) => (
  <View style={[styles.pill, { backgroundColor: bg }]}>
    <Text style={[styles.pillText, { color }]}>{label}</Text>
  </View>
);

/* ── RING ── */
interface RingProps {
  value: number;
  max?: number;
  size?: number;
  sw?: number;
  color?: string;
  sub?: string;
}
export const Ring: React.FC<RingProps> = ({
  value,
  max = 100,
  size = 88,
  sw = 10,
  color = C.mint,
  sub,
}) => {
  const r = (size - sw) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ * (1 - value / max);
  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size} style={{ transform: [{ rotate: '-90deg' }] }}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={C.purplePale}
          strokeWidth={sw}
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={color}
          strokeWidth={sw}
          strokeDasharray={circ}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </Svg>
      <View style={[StyleSheet.absoluteFillObject, styles.ringCenter]}>
        <Text style={styles.ringValue}>{value}</Text>
        {sub && <Text style={styles.ringSub}>{sub}</Text>}
      </View>
    </View>
  );
};

/* ── BAR ── */
interface BarProps {
  value: number;
  color?: string;
  bg?: string;
  h?: number;
  style?: ViewStyle;
}
export const Bar: React.FC<BarProps> = ({
  value,
  color = C.purple,
  bg = C.purplePale,
  h = 5,
  style,
}) => (
  <View style={[{ backgroundColor: bg, borderRadius: 99, height: h, overflow: 'hidden' }, style]}>
    <View style={{ width: `${value}%`, backgroundColor: color, height: '100%', borderRadius: 99 }} />
  </View>
);

/* ── LINE CHART ── */
interface LineChartProps {
  data: number[];
  color?: string;
  h?: number;
}
export const LineChart: React.FC<LineChartProps> = ({
  data,
  color = C.purple,
  h = 60,
}) => {
  const W = 300;
  const H = h;
  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;
  const pts = data.map((v, i) => [
    (i / (data.length - 1)) * W,
    H - ((v - min) / range) * (H - 12) - 6,
  ]);
  const d = pts
    .map((p, i) => (i === 0 ? `M ${p[0]},${p[1]}` : `L ${p[0]},${p[1]}`))
    .join(' ');
  const fill = `${d} L ${W},${H} L 0,${H} Z`;
  const gid = `lg${color.replace('#', '')}`;
  const lastPt = pts[pts.length - 1];
  return (
    <Svg width="100%" viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" style={{ display: 'flex' }}>
      <Defs>
        <LinearGradient id={gid} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor={color} stopOpacity="0.2" />
          <Stop offset="100%" stopColor={color} stopOpacity="0.01" />
        </LinearGradient>
      </Defs>
      <Path d={fill} fill={`url(#${gid})`} />
      <Path
        d={d}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Circle cx={lastPt[0]} cy={lastPt[1]} r="4" fill={color} />
    </Svg>
  );
};

/* ── MULTI LINE CHART ── */
interface MultiLineChartProps {
  series: { data: number[]; color: string; label?: string }[];
  h?: number;
}
export const MultiLineChart: React.FC<MultiLineChartProps> = ({
  series,
  h = 140,
}) => {
  const [containerW, setContainerW] = useState(0);
  const W = containerW || 300;
  const H = h;
  const PADDING = { top: 8, bottom: 8 };
  const drawH = H - PADDING.top - PADDING.bottom;

  // ── Shared min/max across ALL series so lines are on the same scale
  const allValues = series.flatMap(s => s.data);
  const globalMin = Math.min(...allValues);
  const globalMax = Math.max(...allValues);
  const range = globalMax - globalMin || 1;

  const toY = (v: number) =>
    PADDING.top + drawH - ((v - globalMin) / range) * drawH;

  return (
    <View
      style={{ height: H, width: '100%' }}
      onLayout={e => setContainerW(e.nativeEvent.layout.width)}
    >
      {containerW > 0 && (
        <Svg width={W} height={H}>
          {/* subtle grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((pct, i) => (
            <Line
              key={i}
              x1={0}
              y1={PADDING.top + drawH * (1 - pct)}
              x2={W}
              y2={PADDING.top + drawH * (1 - pct)}
              stroke={`${C.purplePale}80`}
              strokeWidth={1}
              strokeDasharray="4 4"
            />
          ))}
          {series.map((s, idx) => {
            const pts = s.data.map((v, i) => ({
              x: s.data.length === 1 ? W / 2 : (i / (s.data.length - 1)) * W,
              y: toY(v),
            }));
            const d = pts
              .map((p, i) => (i === 0 ? `M ${p.x},${p.y}` : `L ${p.x},${p.y}`))
              .join(' ');
            const lastPt = pts[pts.length - 1];
            return (
              <React.Fragment key={idx}>
                <Path
                  d={d}
                  fill="none"
                  stroke={s.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <Circle cx={lastPt.x} cy={lastPt.y} r={5} fill={s.color} />
                <Circle cx={lastPt.x} cy={lastPt.y} r={9} fill={`${s.color}30`} />
              </React.Fragment>
            );
          })}
        </Svg>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: C.card,
    borderRadius: 22,
    padding: 18,
    shadowColor: '#12175e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.07,
    shadowRadius: 8,
    elevation: 3,
  },
  pill: {
    borderRadius: 99,
    paddingHorizontal: 11,
    paddingVertical: 3,
    alignSelf: 'flex-start',
  },
  pillText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringValue: {
    fontSize: 22,
    fontWeight: '900',
    color: C.text,
    lineHeight: 24,
  },
  ringSub: {
    fontSize: 9,
    color: C.sub,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.7,
    marginTop: 2,
  },
});
