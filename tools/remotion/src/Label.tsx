import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeTheme, Theme, useFonts} from './theme';

// Mốc giờ: giờ to đậm + dòng hoạt động bên dưới + dòng emoji nhỏ.
// timeIn/timeOut/textIn/textOut = false khi chữ đó kéo dài sang cảnh trước/sau -> không chạy lại hiệu ứng giữa các cảnh.
// anim (cách dòng chữ hiện): type (đánh máy, mặc định) | wave (từng chữ nảy lên) | pop | slide | fade
// style (kiểu dòng chữ): shadow (mặc định) | outline (chữ tròn viền nâu) | pill (nền tối bo tròn) | tag (nền vàng chữ nâu)
//   | sticker (nền trắng chữ hồng) | comic (chữ vàng viền đen kiểu truyện tranh) | neon (chữ trắng phát sáng hồng, nháy khi hiện)
// Từ khoá bọc trong *...* được tô màu nhấn (theme.accent), vd "Đi chơi chỉ *200k*".
export type LabelProps = {
  time?: string; text?: string; under?: string; pos?: 'top' | 'middle' | 'bottom' | number;
  seconds?: number; delay?: number; anim?: string; style?: string;
  timeIn?: boolean; timeOut?: boolean; textIn?: boolean; textOut?: boolean; theme?: Partial<Theme>;
};

const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};

// Tách chữ thành từng ký tự, đánh dấu ký tự nằm trong *...* (chỉ khi có đủ cặp dấu *)
const parse = (s: string) => {
  const raw = Array.from(s);
  const stars = raw.filter((c) => c === '*').length;
  const useHi = stars >= 2 && stars % 2 === 0;
  const out: {ch: string; hi: boolean}[] = [];
  let hi = false;
  for (const ch of raw) {
    if (useHi && ch === '*') { hi = !hi; continue; }
    out.push({ch, hi});
  }
  return out;
};

export const Label: React.FC<LabelProps> = (p) => {
  const t = mergeTheme(p.theme);
  useFonts({LblT: t.timeFont, LblS: t.labelFont, LblR: t.roundFont, Emo: t.emojiFont});
  const f = useCurrentFrame();
  const {fps, durationInFrames} = useVideoConfig();
  const d0 = Math.round((p.delay ?? 0) * fps);
  const fade = (fin: boolean | undefined, fout: boolean | undefined, lag = 0) => {
    const local = f - d0 - lag;
    if (local < 0 && fin !== false) return 0;
    const a = fin === false ? 1 : interpolate(local, [0, 6], [0, 1], CL);
    const b = fout === false ? 1 : interpolate(f, [durationInFrames - 5, durationInFrames], [1, 0], CL);
    return a * b;
  };
  const top = typeof p.pos === 'number' ? p.pos : p.pos === 'middle' ? t.posMiddle : p.pos === 'bottom' ? t.posBottom : t.posTop;
  const timeOp = fade(p.timeIn, p.timeOut);
  const lag = p.timeIn === false ? 0 : 3;
  const textOp = fade(p.textIn, p.textOut, lag);
  const anim = p.anim ?? t.labelAnim;
  const style = p.style ?? t.labelStyle;
  const entering = p.textIn !== false;
  const local = f - d0 - lag;

  // ---- dòng hoạt động ----
  const chars = parse(p.text ?? '');
  const n = chars.length;
  const typeFrames = Math.max(1, Math.min(0.9 * fps, n * 0.04 * fps));
  const nShown = !entering || anim !== 'type' ? n : Math.ceil(interpolate(local, [0, typeFrames], [0, n], CL));
  const sp = entering ? spring({frame: local, fps, config: {damping: 11, stiffness: 170}}) : 1;
  const blockTf = !entering ? '' : anim === 'pop' ? `scale(${sp})` : anim === 'slide' ? `translateX(${(1 - sp) * -80}px)` : '';

  const dark = style === 'tag';
  const round = ['outline', 'tag', 'sticker', 'comic', 'neon'].includes(style);
  const baseColor = dark ? t.tagColor : style === 'sticker' ? '#EC407A' : style === 'comic' ? '#FFE066' : t.labelColor;
  const accent = dark ? '#D84315' : style === 'sticker' ? '#7E57C2' : style === 'comic' ? '#FF5252' : t.accent;
  const outline = style === 'outline' || style === 'comic';
  const strokeCol = style === 'comic' ? '#212121' : t.labelStroke;
  const font = round ? 'LblR, Emo' : 'LblS, Emo';
  const weight = round ? 700 : 500;
  const textShadow = style === 'shadow' ? `0 2px 6px ${t.labelShadow}, 0 0 2px ${t.labelShadow}`
    : style === 'neon' ? `0 0 6px ${t.neon}, 0 0 14px ${t.neon}, 0 0 26px ${t.neon}`
    : style === 'comic' ? '3px 4px 0 #212121' : 'none';

  // gom theo từ để xuống dòng đúng chỗ (mỗi ký tự là inline-block để nảy được)
  const words: {ch: string; hi: boolean; i: number}[][] = [[]];
  chars.forEach((c, i) => {
    if (c.ch === ' ' || c.ch === '\n') words.push([{...c, i}], []);
    else words[words.length - 1].push({...c, i});
  });
  const renderChar = (c: {ch: string; hi: boolean; i: number}) => {
    if (c.ch === '\n') return <br key={c.i} />;
    if (c.ch === ' ') return <span key={c.i}> </span>;
    let o = c.i < nShown ? 1 : 0;
    let tf = '';
    if (entering && anim === 'wave') {
      const s = spring({frame: local - c.i * 1.2, fps, config: {damping: 9, stiffness: 190}});
      o = Math.min(1, s * 1.6);
      tf = `translateY(${(1 - s) * 28}px)`;
    }
    return (
      <span key={c.i} style={{display: 'inline-block', opacity: o, transform: tf, color: c.hi ? accent : baseColor,
        fontWeight: c.hi ? Math.min(900, weight + 200) : weight}}>{c.ch}</span>);
  };
  const box: React.CSSProperties =
    style === 'pill' ? {display: 'inline-block', background: 'rgba(0,0,0,0.42)', borderRadius: 999, padding: '6px 22px'}
    : dark ? {display: 'inline-block', background: t.tagBg, borderRadius: 10, padding: '4px 18px', transform: 'rotate(-2deg)',
      boxShadow: '0 3px 8px rgba(0,0,0,0.25)'}
    : style === 'sticker' ? {display: 'inline-block', background: '#FFFFFF', borderRadius: 18, padding: '4px 20px',
      boxShadow: '0 3px 8px rgba(0,0,0,0.25)'}
    : style === 'neon' ? {opacity: entering ? interpolate(local, [0, 2, 3, 5, 6, 9], [0, 1, 0.3, 1, 0.5, 1], CL) : 1}
    : {};

  return (
    <AbsoluteFill>
      <div style={{position: 'absolute', top, width: '100%', textAlign: 'center', padding: '0 30px', boxSizing: 'border-box'}}>
        {p.time ? <div style={{opacity: timeOp, fontFamily: 'LblT, Emo', fontWeight: 800, fontSize: t.timeSize,
          lineHeight: 1.05, color: t.timeColor, textShadow: `3px 4px 0 ${t.timeShadow}, 0 0 10px rgba(0,0,0,0.35)`}}>{p.time}</div> : null}
        {n ? <div style={{opacity: textOp, marginTop: 6, transform: blockTf}}>
          <span style={{...box, fontFamily: font, fontSize: t.labelSize, lineHeight: 1.25, textShadow,
            WebkitTextStroke: outline ? `${Math.round(t.labelSize * (style === 'comic' ? 0.14 : 0.18))}px ${strokeCol}` : undefined,
            paintOrder: outline ? 'stroke fill' : undefined}}>
            {words.map((w, k) => <span key={k} style={{display: w.length === 1 && (w[0].ch === ' ' || w[0].ch === '\n') ? 'inline' : 'inline-block'}}>
              {w.map(renderChar)}</span>)}
          </span>
        </div> : null}
        {p.under ? <div style={{opacity: textOp, marginTop: 8, fontFamily: 'Emo', fontSize: t.underSize}}>{p.under}</div> : null}
      </div>
    </AbsoluteFill>
  );
};
