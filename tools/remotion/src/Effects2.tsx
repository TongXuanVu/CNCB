import React from 'react';
import {AbsoluteFill, interpolate, random, useCurrentFrame, useVideoConfig} from 'remotion';
import {Star} from './Shapes';
import {FxProps} from './Effects';

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Khung trắng nháy quanh màn hình (như video mẫu): nháy 3 lần đầu cảnh rồi đứng yên, tắt dần cuối cảnh.
export const FrameFx: React.FC<FxProps> = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const blink = f < 24 ? (Math.floor(f / 4) % 2 ? 0.2 : 1) : 1;
  const out = interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], CL);
  return (
    <AbsoluteFill style={{opacity: blink * out}}>
      <div style={{position: 'absolute', left: 60, right: 60, top: 170, bottom: 230, border: '9px solid #fff',
        boxShadow: '0 0 12px rgba(0,0,0,0.25), inset 0 0 12px rgba(0,0,0,0.15)'}} />
    </AbsoluteFill>
  );
};

// Vệt cầu vồng (prism) quét chéo qua màn hình.
export const Prism: React.FC<FxProps> = () => {
  const f = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const k = f / Math.max(1, durationInFrames - 1);
  const x = interpolate(k, [0, 1], [-60, 60]);
  const op = interpolate(k, [0, 0.2, 0.75, 1], [0, 0.9, 0.7, 0]);
  return (
    <AbsoluteFill style={{opacity: op, transform: `translateX(${x}%)`, background:
      'linear-gradient(115deg, rgba(255,255,255,0) 30%, rgba(255,80,160,0.35) 40%, rgba(255,210,80,0.35) 46%, rgba(120,255,200,0.3) 52%, rgba(110,140,255,0.35) 58%, rgba(255,255,255,0) 68%)'}} />
  );
};

// Giấy màu rơi.
export const Confetti: React.FC<FxProps> = (p) => {
  const f = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const cols = ['#FF6F9C', '#FFD54F', '#81D4FA', '#CE93D8', '#A5D6A7', '#FFFFFF'];
  const n = p.count ?? 70;
  return (
    <AbsoluteFill>
      {Array.from({length: n}, (_, i) => {
        const r = (k: string) => random(`${p.seed ?? 0}-cf-${i}-${k}`);
        const start = r('s') * 20;
        const local = f - start;
        if (local < 0) return null;
        const y = -40 + local * (6 + r('v') * 6);
        if (y > height + 40) return null;
        const x = width * r('x') + Math.sin(local / (6 + r('w') * 6)) * 30;
        const rot = local * (8 + r('r') * 10) * (r('d') > 0.5 ? 1 : -1);
        return <div key={i} style={{position: 'absolute', left: x, top: y, width: 20 + r('a') * 12, height: 11 + r('b') * 7,
          background: cols[i % cols.length], borderRadius: 2, transform: `rotate(${rot}deg) scaleY(${Math.cos(local / 5)})`}} />;
      })}
    </AbsoluteFill>
  );
};

// Ngôi sao màu bay lên từ dưới (giống hearts nhưng là sao).
export const FloatStars: React.FC<FxProps> = (p) => {
  const f = useCurrentFrame();
  const {durationInFrames, width, height} = useVideoConfig();
  const cols = ['#FFD54F', '#F8BBD0', '#FFF59D', '#CE93D8'];
  const n = p.count ?? 12;
  return (
    <AbsoluteFill>
      {Array.from({length: n}, (_, i) => {
        const r = (k: string) => random(`${p.seed ?? 0}-st-${i}-${k}`);
        const start = r('s') * durationInFrames * 0.6;
        const life = 40 + r('l') * 40;
        const k = (f - start) / life;
        if (k < 0 || k > 1) return null;
        const size = 24 + r('z') * 30;
        const x = width * (0.08 + 0.84 * r('x')) + Math.sin(k * 6 + i) * 20;
        const y = height * (0.95 - k * (0.4 + 0.3 * r('h')));
        const opacity = interpolate(k, [0, 0.15, 0.75, 1], [0, 1, 1, 0]);
        return <Star key={i} size={size} fill={cols[i % cols.length]}
          style={{position: 'absolute', left: x, top: y, opacity, transform: `rotate(${k * 180}deg)`}} />;
      })}
    </AbsoluteFill>
  );
};
