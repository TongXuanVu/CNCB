import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeTheme, Theme, useFonts} from './theme';
import {Sparkle, Squiggle, Star} from './Shapes';

// Mở đầu theo video mẫu: tên kênh hiện từng ký tự + dòng phụ 2 tầng vàng/hồng có sao lấp lánh.
export type TitleProps = {title: string; subtitle?: string; lines?: string[]; seconds?: number; theme?: Partial<Theme>};

export const TitleCard: React.FC<TitleProps> = (p) => {
  const t = mergeTheme(p.theme);
  useFonts({IntroT: t.titleFont, IntroS: t.subFont, IntroC: t.captionFont, Emo: t.emojiFont});
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const chars = Array.from(p.title);
  const typeFrames = Math.max(1, t.typeSeconds * fps);
  const shown = chars.slice(0, Math.ceil(Math.min(1, f / typeFrames) * chars.length)).join('');
  const out = interpolate(f, [durationInFrames - 6, durationInFrames], [1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'});
  const subStart = Math.round(typeFrames * 0.8);
  const pop = spring({frame: f - subStart, fps, config: {damping: 9, stiffness: 140}});
  const [sub1, ...rest] = (p.subtitle ?? '').split('\n');
  const sub2 = rest.join('\n');
  const twinkle = (k: number) => 0.6 + 0.4 * Math.sin((f + k * 7) / 4);
  // tự thu nhỏ khi dòng dài: chừa ~90px mỗi bên cho ngôi sao
  const longest = Math.max(1, ...[sub1, sub2].map((x) => Array.from(x || '').length));
  const subSize = Math.min(t.subSize, Math.floor(540 / (longest * 0.56)));
  const subText = (color: string, stroke: string): React.CSSProperties => ({
    fontFamily: 'IntroS, Emo', fontWeight: 800, fontSize: subSize, lineHeight: 1.05, color,
    WebkitTextStroke: `9px ${stroke}`, paintOrder: 'stroke fill', textShadow: '0 3px 8px rgba(0,0,0,0.25)'});
  return (
    <AbsoluteFill style={{opacity: out, textAlign: 'center'}}>
      <div style={{position: 'absolute', top: t.titleTop, width: '100%', padding: '0 30px', boxSizing: 'border-box',
        fontFamily: 'IntroT, Emo', fontWeight: 800, fontSize: t.titleSize, lineHeight: 1.08, color: t.titleColor,
        whiteSpace: 'pre-line', textShadow: `4px 5px 0 ${t.titleShadow}, 0 0 8px rgba(0,0,0,0.3)`}}>{shown}</div>
      {p.subtitle && f >= subStart ? (
        <div style={{position: 'absolute', top: t.subTop, width: '100%', transform: `scale(${pop})`}}>
          <div style={{position: 'relative', display: 'inline-block', padding: '0 10px'}}>
            <Star size={96} fill={t.star} dot={t.starDot} style={{position: 'absolute', left: -78, top: -54,
              transform: `rotate(${-12 + Math.sin(f / 9) * 6}deg)`}} />
            <Sparkle size={48} fill="#FFFFFF" style={{position: 'absolute', right: -40, top: -44, opacity: twinkle(1)}} />
            <div style={subText(t.sub1Color, t.sub1Stroke)}>{sub1}</div>
            {sub2 ? <div style={subText(t.sub2Color, t.sub2Stroke)}>{sub2}</div> : null}
            <Squiggle width={150} color={t.squiggle} style={{position: 'absolute', left: 20, bottom: -26}} />
            <Star size={72} fill={t.star} dot={t.starDot} style={{position: 'absolute', right: -66, bottom: -6,
              transform: `rotate(${10 - Math.sin(f / 8) * 6}deg)`}} />
            <Sparkle size={34} fill="#B388FF" style={{position: 'absolute', left: 180, bottom: -40, opacity: twinkle(3)}} />
          </div>
        </div>
      ) : null}
      {(p.lines ?? []).map((l, i) => (
        <div key={i} style={{position: 'absolute', top: t.captionTop + i * (t.captionSize + 14), width: '100%',
          opacity: interpolate(f, [subStart + 8 + i * 5, subStart + 16 + i * 5], [0, 1], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}),
          fontFamily: 'IntroC, Emo', fontWeight: 700, fontSize: t.captionSize, color: t.captionColor,
          textShadow: `0 2px 6px ${t.captionShadow}`}}>{l}</div>
      ))}
    </AbsoluteFill>
  );
};
