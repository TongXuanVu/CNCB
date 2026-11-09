import React from 'react';
import {AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeTheme, Theme, useFonts} from './theme';

// Chữ nhỏ theo cảnh (như "Em đòi cả nhà nhảy cùng"): chữ có chân màu kem vàng, hiện mờ dần.
export type CaptionProps = {text: string; seconds?: number; delay?: number; top?: number; theme?: Partial<Theme>};

export const Caption: React.FC<CaptionProps> = (p) => {
  const t = mergeTheme(p.theme);
  useFonts({CapF: t.captionFont, Emo: t.emojiFont});
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const local = f - Math.round((p.delay ?? 0) * fps);
  if (local < 0 || !p.text) return null;
  const opacity = interpolate(local, [0, 6], [0, 1], {extrapolateRight: 'clamp'}) *
    interpolate(f, [durationInFrames - 5, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  return (
    <AbsoluteFill style={{opacity}}>
      <div style={{position: 'absolute', top: p.top ?? t.captionTop, width: '100%', textAlign: 'center', padding: '0 40px',
        boxSizing: 'border-box', fontFamily: 'CapF, Emo', fontWeight: 700, fontSize: t.captionSize, color: t.captionColor,
        lineHeight: 1.25, whiteSpace: 'pre-line', WebkitTextStroke: `${t.captionStrokeWidth}px ${t.captionStroke}`,
        paintOrder: 'stroke fill', textShadow: `0 2px 8px ${t.captionShadow}, 0 0 3px ${t.captionShadow}`}}>{p.text}</div>
    </AbsoluteFill>
  );
};
