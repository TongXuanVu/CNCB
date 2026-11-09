import React from 'react';
import {AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {mergeTheme, Theme, useFonts} from './theme';
import {Star, Sparkle} from './Shapes';
import {PACK} from './Pack';
import {DOODLES} from './Doodles';
import {DOODLES2} from './Doodles2';
import {CUSTOM, CUSTOM_TEXT} from './Custom';

// Sticker đặt theo toạ độ (x, y = 0..1 là TÂM hình). Tự vẽ bằng SVG, không dùng hình có bản quyền.
// Xem bảng mẫu: tools/remotion/catalog.png. Danh sách loại (type):
//  Nét trắng vẽ tay : shock | heart | cat | sleep | sparkle | arrow | circle | underline | exclaim | question | frame
//  Hình màu         : heart_fill | hearts | star | stars | flower | sun | cloud | music | sweat | angry | burst
//  Mặt cảm xúc      : yum | laugh | love | cry | wow | shy
//  Chữ              : text (style: hand | outline | tag | marker | neon | comic | sticker | gradient | retro) | bubble
//  Nét trắng mảnh rung kiểu vẽ tay (Doodles.tsx): splash | burst_lines | cat_peek | dog_peek | bunny_peek | bear_peek | swirl
//    | motion_lines | lightbulb | anger_mark | sweat_drop | notes_line | stars_line | crown_line | blush_lines | hearts_line
//    | wave_hand | flower_line | sun_line | exclaim_line | question_line | puff | tears_line ; chữ ký: text style "script"
//  Nét trắng mở rộng (Doodles2.tsx, 56 mẫu: ăn uống, cảm xúc, thú ló, em bé & trang trí) — xem catalog_netve2/3.png
//  Gói chủ đề (Pack.tsx): ăn uống, đi chơi, thời tiết, em bé, lễ tết, tiền & khen, mặt cảm xúc 2, con vật, nhảy hát
// anim: pop | bounce | float | wiggle | spin | pulse | drop | slide | fade | draw | blink | type (chữ đánh máy)
export type Sticker = {type: string; x: number; y: number; size?: number; delay?: number; rotate?: number;
  text?: string; color?: string; color2?: string; until?: number; anim?: string; style?: string;
  w?: number; h?: number; flip?: boolean};
export type StickersProps = {items: Sticker[]; seconds?: number; theme?: Partial<Theme>};

const INK = '#4E342E';
const PINK = '#FF8FB1';
const CL = {extrapolateLeft: 'clamp' as const, extrapolateRight: 'clamp' as const};
const stroke = (c: string, w = 6) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});
// Nét tự vẽ dần (anim draw): p = 0..1
const drawn = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});
const HEART = 'M50,84 C22,64 6,48 6,30 C6,16 16,7 29,7 C38,7 46,12 50,20 C54,12 62,7 71,7 C84,7 94,16 94,30 C94,48 78,64 50,84 Z';

const DRAW_TYPES = new Set(['arrow', 'circle', 'underline']);
export const defaultAnim = (type: string) => (DRAW_TYPES.has(type) ? 'draw' : type === 'frame' ? 'blink' : 'pop');

// Mặt tròn kiểu sticker: viền trắng dày + nền màu
const Face: React.FC<{size: number; fill: string; children?: React.ReactNode}> = ({size, fill, children}) => (
  <svg width={size} height={size} viewBox="0 0 100 100" overflow="visible">
    <circle cx="50" cy="52" r="44" fill="rgba(0,0,0,0.18)" />
    <circle cx="50" cy="50" r="44" fill="#fff" />
    <circle cx="50" cy="50" r="38" fill={fill} />
    {children}
  </svg>
);
const Blush: React.FC<{o?: number}> = ({o = 0.85}) => (<>
  <ellipse cx="26" cy="60" rx="7.5" ry="4.5" fill={PINK} opacity={o} />
  <ellipse cx="74" cy="60" rx="7.5" ry="4.5" fill={PINK} opacity={o} />
</>);

export const Doodle: React.FC<{s: Sticker; t: Theme; local: number; prog: number}> = ({s, t, local, prog}) => {
  const c = s.color ?? t.doodle;
  const size = s.size ?? 110;
  const wob = Math.sin(local / 5);
  const pr = s.anim === 'draw' || (s.anim === undefined && DRAW_TYPES.has(s.type)) ? prog : 1;
  switch (s.type) {
    // ---------- nét trắng vẽ tay ----------
    case 'shock':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `translate(${wob * 2}px, ${-Math.abs(wob) * 2}px)`}}>
          <path d="M30 70 L18 38" {...stroke(c, 7)} /><path d="M50 64 L50 26" {...stroke(c, 7)} /><path d="M70 70 L82 38" {...stroke(c, 7)} />
          <ellipse cx="14" cy="24" rx="5" ry="8" {...stroke(c, 5)} /><ellipse cx="86" cy="24" rx="5" ry="8" {...stroke(c, 5)} />
        </svg>);
    case 'heart':
      return (
        <svg width={size} height={size} viewBox="0 0 100 92" style={{transform: `scale(${1 + 0.06 * Math.sin(local / 4)})`}}>
          <path d={HEART} {...stroke(c, 6)} {...drawn(pr)} />
        </svg>);
    case 'cat':
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${wob * 4}deg)`}}>
          <path d="M18 40 L22 12 L40 28 Q50 25 60 28 L78 12 L82 40 Q90 72 50 80 Q10 72 18 40 Z" {...stroke(c, 5)} />
          <circle cx="37" cy="48" r="3.5" fill={c} /><circle cx="63" cy="48" r="3.5" fill={c} />
          <path d="M42 60 Q46 65 50 60 Q54 65 58 60" {...stroke(c, 4)} />
          <path d="M6 52 L26 55 M6 62 L26 61 M94 52 L74 55 M94 62 L74 61" {...stroke(c, 3.5)} />
          <ellipse cx="30" cy="58" rx="5" ry="3" fill="#FF9EB5" opacity={0.8} /><ellipse cx="70" cy="58" rx="5" ry="3" fill="#FF9EB5" opacity={0.8} />
        </svg>);
    case 'sleep': {
      const z = (k: number) => { const ph = ((local + k * 12) % 36) / 36; return {opacity: Math.sin(ph * Math.PI), y: -ph * 26}; };
      return (
        <svg width={size * 1.3} height={size} viewBox="0 0 130 100">
          <path d="M14 30 Q2 60 14 90" {...stroke(c, 5)} /><path d="M106 30 Q118 60 106 90" {...stroke(c, 5)} />
          <path d="M28 58 Q38 50 48 58" {...stroke(c, 5)} /><path d="M72 58 Q82 50 92 58" {...stroke(c, 5)} />
          <path d="M50 70 Q55 78 60 70 Q65 78 70 70" {...stroke(c, 4.5)} />
          <ellipse cx="28" cy="72" rx="7" ry="4" fill="#FF9EB5" opacity={0.85} /><ellipse cx="92" cy="72" rx="7" ry="4" fill="#FF9EB5" opacity={0.85} />
          {[0, 1, 2].map((k) => { const v = z(k); return (
            <text key={k} x={88 + k * 11} y={30 - k * 6 + v.y} fontFamily="Hand" fontSize={16 + k * 5} fill={c} opacity={v.opacity}>z</text>); })}
        </svg>);
    }
    case 'sparkle':
      return (
        <svg width={size} height={size} viewBox="-50 -50 100 100" style={{opacity: 0.55 + 0.45 * Math.sin(local / 4), transform: `scale(${0.85 + 0.15 * Math.sin(local / 4)})`}}>
          <path d="M0,-44 C4,-10 10,-4 44,0 C10,4 4,10 0,44 C-4,10 -10,4 -44,0 C-10,-4 -4,-10 0,-44 Z" {...stroke(c, 5)} />
        </svg>);
    case 'arrow': // mũi tên cong vẽ tay, chỉ sang phải-lên (xoay bằng rotate, lật bằng flip)
      return (
        <svg width={size * 1.3} height={size} viewBox="0 0 130 100" style={{transform: s.flip ? 'scaleX(-1)' : undefined}}>
          <path d="M10 86 Q24 30 108 26" {...stroke(c, 7)} {...drawn(Math.min(1, pr * 1.25))} />
          <path d="M88 10 L110 26 L90 44" {...stroke(c, 7)} {...drawn(interpolate(pr, [0.75, 1], [0, 1], CL))} />
        </svg>);
    case 'circle': { // khoanh tròn vẽ tay quanh 1 vật; w, h = tỉ lệ khung hình (mặc định 0.4 x 0.25)
      const W = (s.w ?? 0.4) * 720, H = (s.h ?? 0.25) * 1280;
      return (
        <svg width={W} height={H} viewBox="0 0 100 100" preserveAspectRatio="none" overflow="visible">
          <path d="M55 6 C86 6 97 30 95 52 C93 80 62 95 36 92 C10 89 2 64 5 42 C8 18 30 6 60 9 L72 12"
            {...stroke(c, 7)} vectorEffect="non-scaling-stroke" {...drawn(pr)} />
        </svg>);
    }
    case 'underline': { // gạch chân lượn sóng; w = tỉ lệ chiều ngang khung (mặc định 0.45)
      const W = (s.w ?? 0.45) * 720;
      return (
        <svg width={W} height={40} viewBox="0 0 200 40" preserveAspectRatio="none" overflow="visible">
          <path d="M4 22 Q20 6 36 22 T68 22 T100 22 T132 22 T164 22 T196 22" {...stroke(c, 7)} vectorEffect="non-scaling-stroke" {...drawn(pr)} />
        </svg>);
    }
    case 'exclaim': { // "!!" vẽ tay, mặc định vàng
      const cc = s.color ?? '#FFE066';
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `translateY(${-Math.abs(wob) * 3}px)`}}>
          <g style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))'}}>
            <path d="M34 12 L39 62" {...stroke(cc, 11)} /><circle cx="40" cy="82" r="7" fill={cc} />
            <path d="M68 12 L63 62" {...stroke(cc, 11)} /><circle cx="62" cy="82" r="7" fill={cc} />
          </g>
        </svg>);
    }
    case 'question': {
      const cc = s.color ?? '#81D4FA';
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `rotate(${wob * 8}deg)`}}>
          <g style={{filter: 'drop-shadow(0 2px 3px rgba(0,0,0,0.35))'}}>
            <path d="M30 32 Q30 10 52 10 Q74 10 74 30 Q74 46 54 52 L54 64" {...stroke(cc, 11)} />
            <circle cx="54" cy="84" r="7" fill={cc} />
          </g>
        </svg>);
    }
    case 'frame': { // khung trắng chữ nhật (như video mẫu); w, h = tỉ lệ khung hình (mặc định 0.55 x 0.45)
      const W = (s.w ?? 0.55) * 720, H = (s.h ?? 0.45) * 1280;
      return (
        <div style={{width: W, height: H, border: `8px solid ${c}`, boxSizing: 'border-box', borderRadius: 4,
          boxShadow: '0 0 10px rgba(0,0,0,0.25), inset 0 0 10px rgba(0,0,0,0.15)'}} />);
    }
    // ---------- hình màu ----------
    case 'heart_fill': {
      const cc = s.color ?? '#FF6F9C';
      return (
        <svg width={size} height={size} viewBox="0 0 100 92" overflow="visible" style={{transform: `scale(${1 + 0.07 * Math.sin(local / 4)})`}}>
          <path d={HEART} fill={cc} stroke="#fff" strokeWidth={6} strokeLinejoin="round" style={{filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))'}} />
          <path d="M24 22 Q18 30 22 38" {...stroke('rgba(255,255,255,0.8)', 5)} />
        </svg>);
    }
    case 'hearts': { // 3 tim màu bật lần lượt
      const cols = [s.color ?? '#FF6F9C', s.color2 ?? '#FFB3C7', '#CE93D8'];
      const pos = [[38, 58, 1], [78, 30, 0.62], [14, 22, 0.45]];
      return (
        <svg width={size * 1.2} height={size} viewBox="0 0 120 100" overflow="visible">
          {pos.map(([x, y, k], i) => {
            const sc = spring({frame: local - i * 5, fps: 30, config: {damping: 9, stiffness: 170}}) * (1 + 0.06 * Math.sin((local + i * 7) / 4));
            return (
              <g key={i} transform={`translate(${x} ${y}) scale(${(k as number) * sc * 0.5}) translate(-50 -46)`}>
                <path d={HEART} fill={cols[i]} stroke="#fff" strokeWidth={8} strokeLinejoin="round" />
              </g>);
          })}
        </svg>);
    }
    case 'star':
      return <Star size={size} fill={s.color ?? '#FFD54F'} dot={s.color2 ?? '#FF8F00'}
        style={{transform: `rotate(${Math.sin(local / 8) * 10}deg) scale(${1 + 0.05 * Math.sin(local / 4)})`, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))'}} />;
    case 'stars': { // 3 tia lấp lánh nhấp nháy lệch nhịp
      const cols = [s.color ?? '#FFF59D', '#FFFFFF', s.color2 ?? '#F8BBD0'];
      const pos = [[0.35, 0.6, 0.75], [0.78, 0.25, 0.45], [0.82, 0.8, 0.35]];
      return (
        <div style={{position: 'relative', width: size * 1.3, height: size}}>
          {pos.map(([x, y, k], i) => {
            const o = 0.35 + 0.65 * Math.abs(Math.sin((local + i * 9) / 7));
            const z = size * k;
            return <Sparkle key={i} size={z} fill={cols[i]} style={{position: 'absolute', left: x * size * 1.3 - z / 2, top: y * size - z / 2,
              opacity: o, transform: `scale(${0.7 + 0.3 * o})`, filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.8))'}} />;
          })}
        </div>);
    }
    case 'flower': {
      const cc = s.color ?? '#F8BBD0';
      return (
        <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `rotate(${local * 1.2}deg)`, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))'}}>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse key={a} cx="0" cy="-24" rx="17" ry="24" fill={cc} stroke="#fff" strokeWidth={4} transform={`rotate(${a})`} />))}
          <circle r="14" fill={s.color2 ?? '#FFD54F'} stroke="#fff" strokeWidth={4} />
        </svg>);
    }
    case 'sun': {
      const cc = s.color ?? '#FFCA28';
      return (
        <svg width={size} height={size} viewBox="-50 -50 100 100" style={{filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.2))'}}>
          <g transform={`rotate(${local * 2})`}>
            {Array.from({length: 8}, (_, i) => <path key={i} d="M0 -46 L0 -34" {...stroke(cc, 7)} transform={`rotate(${i * 45})`} />)}
          </g>
          <circle r="28" fill={cc} stroke="#fff" strokeWidth={4} />
          <circle cx="-9" cy="-4" r="3" fill={INK} /><circle cx="9" cy="-4" r="3" fill={INK} />
          <path d="M-8 7 Q0 14 8 7" {...stroke(INK, 3.5)} />
          <ellipse cx="-16" cy="6" rx="5" ry="3" fill={PINK} /><ellipse cx="16" cy="6" rx="5" ry="3" fill={PINK} />
        </svg>);
    }
    case 'cloud':
      return (
        <svg width={size * 1.4} height={size} viewBox="0 0 140 100" style={{transform: `translateX(${Math.sin(local / 15) * 6}px)`, filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.2))'}}>
          <path d="M30 80 Q8 80 10 62 Q12 44 32 46 Q34 22 60 22 Q82 22 88 40 Q96 30 110 36 Q128 44 122 62 Q130 80 108 80 Z"
            fill={s.color ?? '#FFFFFF'} stroke="#E3F2FD" strokeWidth={4} />
        </svg>);
    case 'music': {
      const cc = s.color ?? '#CE93D8';
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" style={{transform: `translateY(${Math.sin(local / 6) * 5}px) rotate(${wob * 6}deg)`, filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))'}}>
          <path d="M34 72 L34 22 L80 12 L80 62" {...stroke('#fff', 12)} /><path d="M34 22 L80 12" {...stroke('#fff', 16)} />
          <path d="M34 72 L34 22 L80 12 L80 62" {...stroke(cc, 6)} /><path d="M34 22 L80 12" {...stroke(cc, 10)} />
          <ellipse cx="24" cy="74" rx="13" ry="10" fill={cc} stroke="#fff" strokeWidth={4} transform="rotate(-20 24 74)" />
          <ellipse cx="70" cy="64" rx="13" ry="10" fill={cc} stroke="#fff" strokeWidth={4} transform="rotate(-20 70 64)" />
        </svg>);
    }
    case 'sweat': {
      const cc = s.color ?? '#81D4FA';
      return (
        <svg width={size * 0.8} height={size} viewBox="0 0 80 100" style={{transform: `translateY(${(local % 30) / 30 * 6}px)`}}>
          <path d="M40 6 C40 6 70 46 70 64 A30 30 0 0 1 10 64 C10 46 40 6 40 6 Z" fill={cc} stroke="#fff" strokeWidth={5} />
          <path d="M24 62 Q24 76 34 82" {...stroke('rgba(255,255,255,0.85)', 5)} />
        </svg>);
    }
    case 'angry': { // dấu gân tức 💢 tự vẽ
      const cc = s.color ?? '#FF5252';
      return (
        <svg width={size} height={size} viewBox="-50 -50 100 100" style={{transform: `scale(${1 + 0.1 * Math.abs(Math.sin(local / 3))})`}}>
          {[0, 90, 180, 270].map((a) => (
            <g key={a} transform={`rotate(${a})`}>
              <path d="M-8 -40 Q-8 -8 -40 -8" {...stroke('#fff', 16)} /><path d="M-8 -40 Q-8 -8 -40 -8" {...stroke(cc, 9)} />
            </g>))}
        </svg>);
    }
    case 'burst': { // bùng nổ kiểu truyện tranh có chữ (text), vd "WOW", "200k"
      const pts = Array.from({length: 28}, (_, i) => {
        const r = i % 2 === 0 ? 48 : 36; const a = (i / 28) * Math.PI * 2;
        return `${(Math.cos(a) * r).toFixed(1)},${(Math.sin(a) * r).toFixed(1)}`; }).join(' ');
      return (
        <div style={{position: 'relative', width: size * 1.5, height: size * 1.5, transform: `rotate(${Math.sin(local / 6) * 4}deg)`}}>
          <svg width={size * 1.5} height={size * 1.5} viewBox="-50 -50 100 100" style={{position: 'absolute', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.3))'}}>
            <polygon points={pts} fill={s.color ?? '#FFE066'} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
          </svg>
          <div style={{position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: 'Round, Emo', fontWeight: 800, fontSize: size * 0.36, color: s.color2 ?? '#E53935', lineHeight: 1,
            textAlign: 'center', WebkitTextStroke: '5px #fff', paintOrder: 'stroke fill'}}>{s.text ?? 'WOW'}</div>
        </div>);
    }
    // ---------- mặt cảm xúc (sticker tròn viền trắng) ----------
    case 'yum': // ngon: mắt cười, lè lưỡi
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <path d="M27 46 Q34 37 41 46" {...stroke(INK, 4.5)} /><path d="M59 46 Q66 37 73 46" {...stroke(INK, 4.5)} />
          <path d="M36 60 Q50 72 64 60" {...stroke(INK, 4.5)} />
          <path d={`M52 65 Q${58 + Math.sin(local / 4) * 2} ${80 + Math.sin(local / 4) * 2} 66 63`} fill="#FF6F91" stroke={INK} strokeWidth={3} />
          <Blush />
        </Face>);
    case 'laugh': // cười lớn: mắt > <, miệng há
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <path d="M28 36 L40 43 L28 50" {...stroke(INK, 4.5)} /><path d="M72 36 L60 43 L72 50" {...stroke(INK, 4.5)} />
          <path d={`M30 56 Q50 ${84 + Math.sin(local / 3) * 3} 70 56 Z`} fill={INK} />
          <path d="M40 70 Q50 64 60 70 Q56 78 50 78 Q44 78 40 70 Z" fill="#FF6F91" />
          <path d="M18 40 Q14 48 18 54" {...stroke('#64B5F6', 5)} /><path d="M82 40 Q86 48 82 54" {...stroke('#64B5F6', 5)} />
        </Face>);
    case 'love': { // mắt tim
      const k = 0.17 * (1 + 0.12 * Math.sin(local / 3));
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <g transform={`translate(34 44) scale(${k}) translate(-50 -46)`}><path d={HEART} fill="#F0446C" /></g>
          <g transform={`translate(66 44) scale(${k}) translate(-50 -46)`}><path d={HEART} fill="#F0446C" /></g>
          <path d="M36 62 Q50 75 64 62" {...stroke(INK, 4.5)} />
          <Blush o={0.6} />
        </Face>);
    }
    case 'cry': { // khóc: mắt nhắm, nước mắt chảy
      const d = (local % 24) / 24;
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <path d="M26 44 Q34 50 42 44" {...stroke(INK, 4.5)} /><path d="M58 44 Q66 50 74 44" {...stroke(INK, 4.5)} />
          <path d="M38 70 Q44 62 50 70 Q56 62 62 70" {...stroke(INK, 4.5)} />
          <path d="M32 50 L30 86" {...stroke('#64B5F6', 7)} opacity={0.9} /><path d="M68 50 L70 86" {...stroke('#64B5F6', 7)} opacity={0.9} />
          <circle cx="30" cy={60 + d * 30} r="4" fill="#BBDEFB" /><circle cx="70" cy={60 + ((d + 0.5) % 1) * 30} r="4" fill="#BBDEFB" />
        </Face>);
    }
    case 'wow': // ngạc nhiên: mắt tròn, miệng O
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <path d="M26 32 Q34 26 42 32" {...stroke(INK, 3.5)} /><path d="M58 32 Q66 26 74 32" {...stroke(INK, 3.5)} />
          <circle cx="35" cy="45" r="6" fill={INK} /><circle cx="65" cy="45" r="6" fill={INK} />
          <circle cx="37" cy="43" r="2" fill="#fff" /><circle cx="67" cy="43" r="2" fill="#fff" />
          <ellipse cx="50" cy="68" rx={7 + Math.abs(Math.sin(local / 4)) * 2} ry="9" fill={INK} />
        </Face>);
    case 'shy': // ngại: mắt ^^, má đỏ có gạch
      return (
        <Face size={size} fill={s.color ?? '#FFD54F'}>
          <path d="M28 46 Q34 40 40 46" {...stroke(INK, 4)} /><path d="M60 46 Q66 40 72 46" {...stroke(INK, 4)} />
          <path d="M44 63 Q50 67 56 63" {...stroke(INK, 4)} />
          <ellipse cx="26" cy="58" rx="10" ry="6" fill={PINK} opacity={0.6 + 0.3 * Math.abs(Math.sin(local / 6))} />
          <ellipse cx="74" cy="58" rx="10" ry="6" fill={PINK} opacity={0.6 + 0.3 * Math.abs(Math.sin(local / 6))} />
          <path d="M20 60 L24 54 M26 61 L30 55 M70 60 L74 54 M76 61 L80 55" {...stroke('#E57373', 2.5)} />
        </Face>);
    // ---------- chữ ----------
    case 'bubble': // bong bóng thoại trắng, đuôi bên trái (flip: bên phải)
      return (
        <div style={{position: 'relative', filter: 'drop-shadow(0 3px 4px rgba(0,0,0,0.3))'}}>
          <div style={{background: s.color2 ?? '#FFFFFF', borderRadius: 26, padding: '10px 22px', fontFamily: 'Hand, Emo',
            fontSize: s.size ?? t.handSize + 6, color: s.color ?? INK, whiteSpace: 'pre', lineHeight: 1.1}}>{s.text}</div>
          <svg width="34" height="26" viewBox="0 0 34 26" style={{position: 'absolute', bottom: -20, [s.flip ? 'right' : 'left']: 22,
            transform: s.flip ? 'scaleX(-1)' : undefined}}>
            <path d="M0 0 L34 0 L6 26 Z" fill={s.color2 ?? '#FFFFFF'} />
          </svg>
        </div>);
    default: { // gói chủ đề (Pack.tsx), còn lại là text: style hand | outline | tag | marker | neon | comic | sticker | gradient | retro
      if (CUSTOM[s.type]) return CUSTOM[s.type]({size, c, c2: s.color2, local, prog, text: s.text}); // thư viện tự tạo (Custom.tsx)
      if (PACK[s.type]) return PACK[s.type]({size, c: s.color, c2: s.color2, local, text: s.text});
      if (DOODLES[s.type]) return DOODLES[s.type]({size, c, local, prog});
      if (DOODLES2[s.type]) return DOODLES2[s.type]({size, c, local, prog, text: s.text});
      const txt = s.text ?? '';
      if ((s.style ?? 'hand') === 'script') { // chữ ký viết tay nghiêng + nét gạch đuôi tự vẽ (như "Yummy!")
        const n = Array.from(txt).length;
        const shownS = s.anim === 'type' ? Array.from(txt).slice(0, Math.ceil(interpolate(local, [0, Math.max(6, n * 1.6)], [0, n], CL))).join('') : txt;
        const sw = interpolate(local, [s.anim === 'type' ? n * 1.6 : 4, (s.anim === 'type' ? n * 1.6 : 4) + 12], [0, 1], CL);
        return (
          <div style={{position: 'relative', display: 'inline-block', fontFamily: 'Script, Emo', fontWeight: 700,
            fontSize: (s.size ?? t.handSize) * 1.25, color: c, whiteSpace: 'pre', lineHeight: 1.05, padding: '0 6px 10px',
            textShadow: '0 1px 3px rgba(0,0,0,0.45)'}}>
            {shownS}<span style={{opacity: 0}}>{txt.slice(shownS.length)}</span>
            <svg viewBox="0 0 200 24" preserveAspectRatio="none" style={{position: 'absolute', left: '-4%', bottom: -4, width: '92%', height: 20,
              overflow: 'visible', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.45))'}}>
              <path d="M4 14 Q50 22 110 12 Q160 4 196 8" {...stroke(c, 4)} vectorEffect="non-scaling-stroke" {...drawn(sw)} />
            </svg>
          </div>);
      }
      const shown = s.anim === 'type' ? Array.from(txt).slice(0, Math.ceil(interpolate(local, [0, Math.max(6, Array.from(txt).length * 1.4)], [0, Array.from(txt).length], CL))).join('') : txt;
      const hidden = txt.slice(shown.length);
      const fs = s.size ?? t.handSize;
      const base: React.CSSProperties = {whiteSpace: 'pre', lineHeight: 1.1};
      const st = s.style ?? 'hand';
      const css: React.CSSProperties = CUSTOM_TEXT[st] ? {...base, ...CUSTOM_TEXT[st](fs, s.color, s.color2)} : // kiểu chữ tự tạo
        st === 'outline' ? {...base, fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: c,
          WebkitTextStroke: `${Math.max(4, fs * 0.16)}px ${s.color2 ?? '#F06292'}`, paintOrder: 'stroke fill',
          filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.3))'}
        : st === 'tag' ? {...base, fontFamily: 'Round, Emo', fontWeight: 700, fontSize: fs, color: s.color ?? '#FFFFFF',
          background: s.color2 ?? '#F06292', borderRadius: 999, padding: '4px 20px', boxShadow: '0 3px 6px rgba(0,0,0,0.25)'}
        : st === 'marker' ? {...base, fontFamily: 'Hand, Emo', fontSize: fs, color: s.color ?? INK,
          background: s.color2 ?? '#FFE066', padding: '2px 14px', borderRadius: 6, boxShadow: '0 3px 6px rgba(0,0,0,0.2)'}
        : st === 'neon' ? {...base, fontFamily: 'Round, Emo', fontWeight: 700, fontSize: fs, color: s.color ?? '#FFFFFF',
          textShadow: `0 0 6px ${s.color2 ?? '#FF4FA3'}, 0 0 14px ${s.color2 ?? '#FF4FA3'}, 0 0 26px ${s.color2 ?? '#FF4FA3'}`,
          opacity: interpolate(local, [0, 2, 3, 5, 6, 9], [0, 1, 0.3, 1, 0.5, 1], CL)}
        : st === 'comic' ? {...base, fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: s.color ?? '#FFE066',
          WebkitTextStroke: `${Math.max(3, fs * 0.12)}px #212121`, paintOrder: 'stroke fill', textShadow: '4px 5px 0 #212121',
          transform: 'skewX(-6deg)'}
        : st === 'sticker' ? {...base, fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: s.color ?? '#EC407A',
          background: s.color2 ?? '#FFFFFF', borderRadius: 18, padding: '2px 18px', boxShadow: '0 3px 6px rgba(0,0,0,0.25)'}
        : st === 'gradient' ? {...base, fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: 'transparent',
          background: `linear-gradient(90deg, ${s.color ?? '#FF6F9C'}, ${s.color2 ?? '#FFB74D'})`, WebkitBackgroundClip: 'text',
          backgroundClip: 'text', filter: 'drop-shadow(0 0 1.5px #fff) drop-shadow(0 0 1.5px #fff) drop-shadow(0 3px 3px rgba(0,0,0,0.35))'}
        : st === 'retro' ? {...base, fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: s.color ?? '#FFF3A6',
          textShadow: `3px 3px 0 ${s.color2 ?? '#F06292'}, 6px 6px 0 #7E57C2`}
        : {...base, fontFamily: 'Hand, Emo', fontSize: fs, color: c, textShadow: `0 2px 6px ${t.doodleShadow}, 0 0 2px rgba(0,0,0,0.4)`};
      return <div style={css}>{shown}<span style={{opacity: 0}}>{hidden}</span></div>;
    }
  }
};

// Chuyển động của cả sticker: trả về transform + opacity
export const motion = (anim: string, local: number, fps: number) => {
  const sp = spring({frame: local, fps, config: {damping: 10, stiffness: 160}});
  const fadeIn = interpolate(local, [0, 6], [0, 1], CL);
  switch (anim) {
    case 'bounce': return {tf: `translateY(${-Math.abs(Math.sin(local / 6)) * 16}px) scale(${sp})`, op: 1};
    case 'float': return {tf: `translateY(${Math.sin(local / 10) * 10}px) scale(${sp})`, op: 1};
    case 'wiggle': return {tf: `rotate(${Math.sin(local / 3) * 9}deg) scale(${sp})`, op: 1};
    case 'spin': return {tf: `rotate(${local * 4}deg) scale(${sp})`, op: 1};
    case 'pulse': return {tf: `scale(${sp * (1 + 0.1 * Math.sin(local / 4))})`, op: 1};
    case 'drop': return {tf: `translateY(${(1 - sp) * -260}px)`, op: fadeIn};
    case 'slide': return {tf: `translateX(${(1 - sp) * -220}px)`, op: fadeIn};
    case 'fade': case 'draw': case 'type': return {tf: '', op: fadeIn};
    case 'blink': return {tf: '', op: local < 24 ? (Math.floor(local / 4) % 2 ? 0.25 : 1) : 1};
    default: return {tf: `scale(${sp})`, op: 1}; // pop
  }
};

export const Stickers: React.FC<StickersProps> = (p) => {
  const t = mergeTheme(p.theme);
  useFonts({Hand: t.handFont, Round: t.roundFont, Script: t.scriptFont, Emo: t.emojiFont});
  const f = useCurrentFrame();
  const {fps, width, height, durationInFrames} = useVideoConfig();
  return (
    <AbsoluteFill>
      {(p.items ?? []).map((s, i) => {
        const start = Math.round((s.delay ?? 0) * fps);
        const end = s.until ? Math.round(s.until * fps) : durationInFrames;
        const local = f - start;
        if (local < 0 || f > end) return null;
        const prog = interpolate(local, [0, 0.6 * fps], [0, 1], CL);
        const m = motion(s.anim ?? defaultAnim(s.type), local, fps);
        const out = interpolate(f, [end - 5, end], [1, 0], CL);
        return (
          <div key={i} style={{position: 'absolute', left: s.x * width, top: s.y * height, opacity: out * m.op,
            transform: `translate(-50%, -50%) rotate(${s.rotate ?? 0}deg) ${m.tf}`}}>
            <Doodle s={s} t={t} local={local} prog={prog} />
          </div>);
      })}
    </AbsoluteFill>
  );
};
