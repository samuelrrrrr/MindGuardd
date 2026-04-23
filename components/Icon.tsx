import React from 'react';
import Svg, {
  Path,
  Circle,
  Line,
  Polyline,
  Polygon,
  Ellipse,
} from 'react-native-svg';
import { C } from '../constants/Colors';

interface IconProps {
  n: string;
  s?: number;
  c?: string;
}

const Icon: React.FC<IconProps> = ({ n, s = 20, c = C.sub }) => {
  const common = {
    fill: 'none' as const,
    stroke: c,
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  const paths: Record<string, React.ReactNode> = {
    home: (
      <>
        <Path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" {...common} />
        <Polyline points="9 22 9 12 15 12 15 22" {...common} />
      </>
    ),
    insights: (
      <>
        <Circle cx="12" cy="12" r="10" {...common} />
        <Path d="M12 8v4l3 3" {...common} />
      </>
    ),
    plus: (
      <>
        <Line x1="12" y1="5" x2="12" y2="19" {...common} />
        <Line x1="5" y1="12" x2="19" y2="12" {...common} />
      </>
    ),
    activity: (
      <Polyline points="22 12 18 12 15 21 9 3 6 12 2 12" {...common} />
    ),
    trends: (
      <>
        <Line x1="18" y1="20" x2="18" y2="10" {...common} />
        <Line x1="12" y1="20" x2="12" y2="4" {...common} />
        <Line x1="6" y1="20" x2="6" y2="14" {...common} />
      </>
    ),
    bell: (
      <>
        <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" {...common} />
        <Path d="M13.73 21a2 2 0 0 1-3.46 0" {...common} />
      </>
    ),
    moon: (
      <Path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" {...common} />
    ),
    bolt: (
      <Polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill={c} stroke="none" />
    ),
    leaf: (
      <Path d="M17 8C8 10 5.9 16.17 3.82 19.25l1.41 1.41C9.5 19.17 12 17.77 14.5 15c2.5-2.77 4-6.5 4-8.5L17 8z" {...common} />
    ),
    check: (
      <Polyline points="20 6 9 17 4 12" {...common} />
    ),
    heart: (
      <Path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" fill={c} stroke="none" />
    ),
    wind: (
      <>
        <Path d="M9.59 4.59A2 2 0 1 1 11 8H2" {...common} />
        <Path d="M10.59 15.41A2 2 0 1 0 14 16H2" {...common} />
        <Path d="M15.73 3.73A2.5 2.5 0 1 1 19.5 12H2" {...common} />
      </>
    ),
    shield: (
      <Path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" {...common} />
    ),
    sparkle: (
      <Path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 17l-6.2 4.3 2.4-7.4L2 9.4h7.6z" fill={c} stroke="none" />
    ),
    users: (
      <>
        <Path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" {...common} />
        <Circle cx="9" cy="7" r="4" {...common} />
        <Path d="M23 21v-2a4 4 0 0 0-3-3.87" {...common} />
        <Path d="M16 3.13a4 4 0 0 1 0 7.75" {...common} />
      </>
    ),
    run: (
      <>
        <Circle cx="13" cy="4" r="2" {...common} />
        <Path d="M9 7l1 5-3 3 4 5" {...common} />
        <Path d="M17 7l-2 4 2 3" {...common} />
      </>
    ),
    drop: (
      <Path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill={c} stroke="none" />
    ),
    back: (
      <Polyline points="15 18 9 12 15 6" {...common} />
    ),
    wave: (
      <>
        <Path d="M2 12c.5-2 2-3 3.5-3s3 2 4.5 2 3-2 4.5-2 3 1 3.5 3" {...common} />
        <Path d="M2 18c.5-2 2-3 3.5-3s3 2 4.5 2 3-2 4.5-2 3 1 3.5 3" {...common} />
      </>
    ),
    brain: (
      <>
        <Path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96-.46 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2z" {...common} />
        <Path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96-.46 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2z" {...common} />
      </>
    ),
    play: (
      <Polygon points="5 3 19 12 5 21 5 3" fill={c} stroke="none" />
    ),
    pause: (
      <>
        <Line x1="8" y1="5" x2="8" y2="19" strokeWidth="4" stroke={c} />
        <Line x1="16" y1="5" x2="16" y2="19" strokeWidth="4" stroke={c} />
      </>
    ),
    arrow: (
      <>
        <Line x1="5" y1="12" x2="19" y2="12" {...common} />
        <Polyline points="12 5 19 12 12 19" {...common} />
      </>
    ),
    send: (
      <>
        <Line x1="22" y1="2" x2="11" y2="13" {...common} />
        <Polygon points="22 2 15 22 11 13 2 9 22 2" {...common} />
      </>
    ),
  };

  return (
    <Svg width={s} height={s} viewBox="0 0 24 24">
      {paths[n] || null}
    </Svg>
  );
};

export default Icon;
