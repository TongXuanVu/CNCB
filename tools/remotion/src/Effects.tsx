import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeTheme, Theme} from './theme';
import {Heart, Sparkle} from './Shapes';

export type FxProps = {seconds?: number; seed?: number; count?: number; theme?: Partial<Theme>};

// Trái tim bay lên từ dưới, lắc nhẹ.
export const Hearts: React.FC<FxProps> = (p) => {
  const t = mergeTheme(p.theme);
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const n = p.count ?? 16;
  return (
    <AbsoluteFill>
      {Array.from({length: n}, (_, i) => {
        const r = (k: string) => random(`${p.seed ?? 0}-${i}-${k}`);
        const start = r('s') * durationInFrames * 0.6;
        const life = 40 + r('l') * 40;
        const k = (f - start) / life;
        if (k < 0 || k > 1) return null;
        const size = 26 + r('z') * 40;
        const x = width * (0.1 + 0.8 * r('x')) + Math.sin(k * 6 + i) * 24;
        const y = height * (0.95 - k * (0.45 + 0.3 * r('h')));
        const opacity = interpolate(k, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
        return <Heart key={i} size={size} fill={t.heart[i % t.heart.length]}
          style={{position: 'absolute', left: x, top: y, opacity, transform: `rotate(${(r('r') - 0.5) * 40}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};

// Tia lấp lánh nhấp nháy ở vị trí ngẫu nhiên.
export const Sparkles: React.FC<FxProps> = (p) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const n = p.count ?? 12;
  return (
    <AbsoluteFill>
      {Array.from({length: n}, (_, i) => {
        const r = (k: string) => random(`${p.seed ?? 0}-sp-${i}-${k}`);
        const phase = (f / (12 + r('p') * 14) + r('o')) % 1;
        const opacity = Math.max(0, Math.sin(phase * Math.PI));
        const size = 18 + r('z') * 34;
        return <Sparkle key={i} size={size} fill={i % 3 === 0 ? '#FFF59D' : '#FFFFFF'}
          style={{position: 'absolute', left: width * r('x'), top: height * (0.08 + 0.84 * r('y')), opacity,
            transform: `scale(${0.6 + 0.4 * opacity})`}} />;
      })}
    </AbsoluteFill>
  );
};

// Vệt sáng ấm loé qua màn hình (giống light leak trong video mẫu).
export const LightLeak: React.FC<FxProps> = (p) => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const k = f / Math.max(1, durationInFrames - 1);
  const opacity = interpolate(k, [0, 0.25, 0.6, 1], [0, 0.85, 0.6, 0]);
  const x = interpolate(k, [0, 1], [-20, 70]);
  return (
    <AbsoluteFill style={{opacity, background:
      `radial-gradient(ellipse 60% 45% at ${x}% 30%, rgba(255,236,190,0.95) 0%, rgba(255,190,120,0.55) 35%, rgba(255,160,90,0) 70%)`}} />
  );
};
