import React from 'react';
import {ln, drawn, Svg, drop, DROP, HEART, STAR, HappyFace, PINK} from './Doodles';

// Bộ nét trắng vẽ tay THEO CHỦ ĐỀ (bộ 3): đi chơi, em bé & gia đình, nhà & bếp, thời tiết, lễ tết, mua sắm,
// học & chơi, thể thao & sức khoẻ. Cùng quy ước với Doodles.tsx: (size, c = màu nét, local = khung hình từ lúc hiện, prog).
// Dùng: segments[].stickers [{"type": "<tên>", "x", "y", "size", ...}]. Ảnh mẫu: catalog_net_*.png.
type P = {size: number; c: string; local: number; prog: number; text?: string};
const YEL = '#FFE066', RED = '#FF6B81', BLUE = '#90CAF9', GREEN = '#A5D6A7';
const cyc = (local: number, n: number, off = 0) => ((local + off) % n) / n;
const sw = (local: number, k = 6) => Math.sin(local / k);
const Wheel: React.FC<{cx: number; cy: number; r: number; c: string; local: number}> = ({cx, cy, r, c, local}) => (
  <g transform={`rotate(${local * 12} ${cx} ${cy})`}>
    <circle cx={cx} cy={cy} r={r} {...ln(c)} />
    <path d={`M${cx - r * 0.6} ${cy} L${cx + r * 0.6} ${cy} M${cx} ${cy - r * 0.6} L${cx} ${cy + r * 0.6}`} {...ln(c, 2.5)} />
  </g>);
const Flower5: React.FC<{x: number; y: number; s: number; fill: string; c: string}> = ({x, y, s, fill, c}) => (
  <g transform={`translate(${x} ${y}) scale(${s})`}>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="0" cy="-7" rx="5" ry="7" transform={`rotate(${a})`} fill={fill} {...ln(c, 2)} />)}
    <circle r="3" fill={YEL} /></g>);

export const DOODLES3: Record<string, (p: P) => React.ReactElement> = {
  // ================= ĐI CHƠI =================
  car_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${Math.abs(sw(local, 2)) * -2}px)`}>
    <path d="M12 66 L12 52 Q14 46 22 45 L30 32 Q33 28 40 28 L62 28 Q68 28 72 34 L80 45 Q90 46 90 54 L90 66 Z" {...ln(c)} />
    <path d="M34 44 L39 34 L50 34 L50 44 Z M56 44 L56 34 L64 34 L71 44 Z" {...ln(c, 3.5)} />
    <Wheel cx={30} cy={68} r={9} c={c} local={local} /><Wheel cx={72} cy={68} r={9} c={c} local={local} />
    {[56, 64, 72].map((y, i) => <path key={y} d={`M${2 - cyc(local, 12, i * 4) * 6} ${y} L${-10 - cyc(local, 12, i * 4) * 6} ${y}`} {...ln(c, 3)} />)}
  </Svg>),
  bus_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${Math.abs(sw(local, 2.5)) * -1.5}px)`}>
    <rect x="10" y="22" width="80" height="50" rx="10" {...ln(c)} />
    {[18, 36, 54].map((x) => <rect key={x} x={x} y="30" width="14" height="14" rx="3" {...ln(c, 3)} />)}
    <rect x="72" y="30" width="12" height="30" rx="3" {...ln(c, 3)} />
    <path d="M10 52 L70 52" {...ln(c, 3)} /><circle cx="16" cy="62" r="3" fill={YEL} />
    <Wheel cx={28} cy={74} r={8} c={c} local={local} /><Wheel cx={72} cy={74} r={8} c={c} local={local} />
  </Svg>),
  plane_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${sw(local, 8) * 3}px) rotate(${sw(local, 10) * 3}deg)`}>
    <path d="M14 54 L70 40 Q86 36 90 42 Q92 48 78 52 L22 66 Z" {...ln(c)} />
    <path d="M44 48 L34 26 L44 24 L60 44 M48 58 L44 76 L52 76 L62 54 M22 60 L14 48 L20 46 L30 56" {...ln(c, 3.5)} />
    <path d="M10 70 Q-2 74 -10 72" {...ln(c, 3)} strokeDasharray="5 6" strokeDashoffset={-local} />
  </Svg>),
  map_pin_line: ({size, c, local}) => { const b = Math.abs(sw(local, 3)) * 6;
    return (<Svg size={size} local={local}>
      <ellipse cx="50" cy="90" rx={16 - b * 0.6} ry="4" {...ln(c, 3)} opacity={0.7} />
      <g transform={`translate(0 ${-b})`}>
        <path d="M50 84 Q24 56 24 38 Q24 14 50 14 Q76 14 76 38 Q76 56 50 84 Z" {...ln(c)} />
        <circle cx="50" cy="38" r="9" fill={RED} {...ln(c, 3)} /></g>
    </Svg>); },
  ticket_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${-8 + sw(local, 9) * 4}deg)`}>
    <path d="M10 30 L90 30 L90 44 Q82 50 90 56 L90 70 L10 70 L10 56 Q18 50 10 44 Z" {...ln(c)} />
    <path d="M66 32 L66 68" {...ln(c, 3)} strokeDasharray="4 5" />
    <path d={STAR} transform="translate(38 50) scale(1.3)" fill={YEL} {...ln(c, 2)} />
    <path d="M74 44 L82 44 M74 56 L82 56" {...ln(c, 3)} />
  </Svg>),
  backpack_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 7) * 3}deg)`}>
    <path d="M38 22 Q38 10 50 10 Q62 10 62 22" {...ln(c)} />
    <path d="M24 40 Q24 22 50 22 Q76 22 76 40 L76 84 Q76 90 70 90 L30 90 Q24 90 24 84 Z" {...ln(c)} />
    <path d="M34 60 L66 60 L66 80 L34 80 Z M34 68 L66 68" {...ln(c, 3.5)} /><circle cx="50" cy="40" r="4" fill={PINK} />
  </Svg>),
  tent_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M10 84 L50 22 L90 84 Z" {...ln(c)} /><path d="M50 22 L50 84 M50 84 L36 84 Q44 66 50 52 Q56 66 64 84" {...ln(c, 3.5)} />
    <path d="M50 22 L50 10" {...ln(c, 3)} /><path d={`M50 10 L${62 + sw(local, 3) * 2} 14 L50 18`} fill={RED} {...ln(c, 2.5)} />
    <path d="M4 86 L96 86" {...ln(c, 3)} />
  </Svg>),
  mountain_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <circle cx="76" cy="24" r={8 + sw(local, 8)} fill={YEL} opacity={0.9} />
    <path d="M6 84 L36 34 L52 58 L64 44 L94 84 Z" {...ln(c)} />
    <path d="M28 48 L34 52 L40 46 L44 50 M58 52 L64 44 L70 52" {...ln(c, 3)} />
  </Svg>),
  sunglasses_line: ({size, c, local}) => { const g = cyc(local, 36);
    return (<Svg size={size} local={local} vh={70}>
      <path d="M8 24 L92 24" {...ln(c)} />
      <path d="M12 24 Q12 52 30 52 Q46 52 46 24 M54 24 Q54 52 70 52 Q88 52 88 24" {...ln(c)} />
      <path d="M46 28 Q50 24 54 28" {...ln(c, 3.5)} />
      {g < 0.5 ? <path d={`M${16 + g * 50} 44 L${24 + g * 50} 30`} {...ln(c, 3)} opacity={Math.sin(g * 2 * Math.PI)} /> : null}
    </Svg>); },
  palm_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M52 92 Q46 64 52 34" {...ln(c)} /><path d="M50 80 L56 80 M49 66 L55 66 M50 52 L56 52" {...ln(c, 3)} />
    <g transform={`rotate(${sw(local, 8) * 6} 52 34)`}>
      <path d="M52 34 Q36 16 14 24 M52 34 Q66 14 88 20 M52 34 Q30 30 20 48 M52 34 Q74 32 84 48" {...ln(c)} />
    </g><circle cx="46" cy="40" r="4" {...ln(c, 3)} /><circle cx="56" cy="40" r="4" {...ln(c, 3)} />
  </Svg>),
  waves_line: ({size, c, local}) => { const o = (local * 1.2) % 24;
    return (<Svg size={size} local={local} vh={70}>
      <defs><clipPath id="wv"><rect x="4" y="0" width="92" height="70" /></clipPath></defs>
      <g clipPath="url(#wv)">{[20, 38, 56].map((y, i) => <path key={y} transform={`translate(${(i % 2 ? o : -o)} 0)`}
        d={`M-24 ${y} q6 -8 12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0 t12 0`} {...ln(c, 4)} />)}</g>
    </Svg>); },

  // ================= EM BÉ & GIA ĐÌNH =================
  baby_face_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <circle cx="50" cy="54" r="34" {...ln(c)} />
    <path d={`M50 20 Q44 8 54 6 Q62 6 58 14`} {...ln(c, 4)} transform={`rotate(${sw(local, 5) * 6} 50 20)`} />
    <HappyFace c={c} y={54} />
  </Svg>),
  rattle_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 2) * 14}deg)`}>
    <circle cx="40" cy="36" r="20" {...ln(c)} /><circle cx="34" cy="32" r="4" fill={PINK} /><circle cx="46" cy="42" r="3" fill={YEL} />
    <path d="M54 50 L78 78" {...ln(c, 6)} /><circle cx="82" cy="82" r="6" {...ln(c)} />
    <path d="M14 18 L8 12 M20 10 L18 4 M62 14 L68 8" {...ln(c, 3)} opacity={Math.abs(sw(local, 2))} />
  </Svg>),
  onesie_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 9) * 4}deg)`}>
    <path d="M36 14 Q50 24 64 14 L84 26 L76 42 L68 38 L68 70 Q68 84 56 88 L56 92 L44 92 L44 88 Q32 84 32 70 L32 38 L24 42 L16 26 Z" {...ln(c)} />
    <path d={HEART} transform="translate(41 46) scale(0.18)" fill={PINK} {...ln(c, 10)} />
    <circle cx="46" cy="86" r="1.6" fill={c} /><circle cx="54" cy="86" r="1.6" fill={c} />
  </Svg>),
  stroller_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateX(${sw(local, 10) * 3}px)`}>
    <path d="M22 50 Q22 20 52 18 L52 50 Z" {...ln(c)} /><path d="M22 50 L80 50 Q78 68 58 70 L36 70 Q22 68 22 50 Z" {...ln(c)} />
    <path d="M80 50 L86 30 L94 30" {...ln(c, 4)} />
    <Wheel cx={34} cy={82} r={8} c={c} local={local / 2} /><Wheel cx={68} cy={82} r={8} c={c} local={local / 2} />
  </Svg>),
  teddy_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 8) * 4}deg)`}>
    <circle cx="30" cy="16" r="8" {...ln(c)} /><circle cx="70" cy="16" r="8" {...ln(c)} />
    <circle cx="50" cy="32" r="22" {...ln(c)} />
    <path d="M42 30 L42 31 M58 30 L58 31" {...ln(c, 5)} /><ellipse cx="50" cy="40" rx="7" ry="5" {...ln(c, 3)} />
    <path d="M32 58 Q24 76 34 90 L66 90 Q76 76 68 58 Q50 50 32 58 Z" {...ln(c)} />
    <path d="M32 62 Q18 62 16 74 M68 62 Q82 62 84 74" {...ln(c)} /><path d={HEART} transform="translate(44 66) scale(0.12)" fill={PINK} />
  </Svg>),
  family_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d={HEART} transform={`translate(41 ${4 - Math.abs(sw(local, 4)) * 3}) scale(0.18)`} fill={PINK} {...ln(c, 10)} />
    <circle cx="26" cy="40" r="11" {...ln(c)} /><path d="M10 86 Q10 58 26 56 Q42 58 42 86" {...ln(c)} />
    <circle cx="74" cy="40" r="11" {...ln(c)} /><path d="M58 86 Q58 58 74 56 Q90 58 90 86" {...ln(c)} />
    <circle cx="50" cy="58" r="8" {...ln(c)} /><path d="M40 90 Q40 72 50 70 Q60 72 60 90" {...ln(c)} />
  </Svg>),
  heart_hands_line: ({size, c, local}) => { const p = 1 + 0.06 * Math.sin(local / 3);
    return (<Svg size={size} local={local}>
      <g transform={`translate(50 46) scale(${p}) translate(-50 -46)`}>
        <path d="M50 80 Q18 58 18 36 Q18 18 34 18 Q46 18 50 32" {...ln(c)} /><path d="M50 80 Q82 58 82 36 Q82 18 66 18 Q54 18 50 32" {...ln(c)} />
        <path d="M30 22 L28 14 M38 20 L37 12 M70 22 L72 14 M62 20 L63 12" {...ln(c, 3)} /></g>
      <path d="M34 84 L40 94 M66 84 L60 94" {...ln(c, 4)} />
    </Svg>); },
  bath_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[30, 48, 64].map((x, i) => { const k = cyc(local, 30, i * 10);
      return <circle key={x} cx={x + Math.sin(k * 6) * 3} cy={46 - k * 34} r={4 + i} {...ln(c, 2.5)} opacity={1 - k} />; })}
    <path d="M8 52 L92 52 L86 74 Q82 84 70 84 L30 84 Q18 84 14 74 Z" {...ln(c)} />
    <path d="M20 52 L20 30 Q20 22 28 22 Q34 22 34 28" {...ln(c, 4)} /><path d="M26 84 L22 92 M74 84 L78 92" {...ln(c, 4)} />
  </Svg>),

  // ================= NHÀ & BẾP =================
  pot_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[38, 50, 62].map((x, i) => { const k = cyc(local, 28, i * 9);
      return <path key={x} d={`M${x} 30 q-5 -6 0 -12 q5 -6 0 -12`} {...ln(c, 3.5)} transform={`translate(0 ${-k * 8})`} opacity={Math.sin(k * Math.PI)} />; })}
    <path d={`M20 40 Q50 ${30 - Math.abs(sw(local, 2)) * 3} 80 40`} {...ln(c)} /><circle cx="50" cy="33" r="3" fill={c} />
    <path d="M18 44 L82 44 L78 82 Q76 88 70 88 L30 88 Q24 88 22 82 Z" {...ln(c)} />
    <path d="M18 52 L8 52 M82 52 L92 52" {...ln(c, 5)} />
  </Svg>),
  pan_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 5) * 3}deg)`}>
    <ellipse cx="42" cy="56" rx="32" ry="22" {...ln(c)} /><path d="M72 50 L96 40" {...ln(c, 7)} />
    <path d="M24 56 Q24 42 40 44 Q56 40 58 54 Q60 68 42 68 Q26 70 24 56 Z" fill="#FFFFFF" opacity={0.9} {...ln(c, 2.5)} />
    <circle cx="42" cy="56" r="7" fill={YEL} />
    {[18, 42, 64].map((x, i) => <path key={x} d={`M${x} 26 L${x + 3} ${18 - (cyc(local, 10, i * 3) * 4)}`} {...ln(c, 3)} opacity={Math.abs(sw(local + i * 4, 2))} />)}
  </Svg>),
  broom_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${sw(local, 4) * 12} 70 10)`}>
      <path d="M70 6 L46 58" {...ln(c, 5)} /><path d="M38 54 L56 62 L50 90 L18 76 Z" {...ln(c)} />
      <path d="M28 70 L24 80 M36 74 L32 84 M44 77 L40 87" {...ln(c, 2.5)} /></g>
    {[0, 1, 2].map((i) => { const k = cyc(local, 24, i * 8); return <circle key={i} cx={10 + i * 8 - k * 6} cy={88 - k * 10} r={3 + k * 3} {...ln(c, 2)} opacity={1 - k} />; })}
  </Svg>),
  washer_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateX(${sw(local, 1.2) * 0.8}px)`}>
    <rect x="16" y="10" width="68" height="80" rx="8" {...ln(c)} /><path d="M16 26 L84 26" {...ln(c, 3)} />
    <circle cx="28" cy="18" r="2.5" fill={c} /><circle cx="38" cy="18" r="2.5" fill={c} />
    <circle cx="50" cy="58" r="22" {...ln(c)} />
    <path d={`M32 60 Q41 ${54 + sw(local, 3) * 4} 50 60 T68 60`} {...ln(BLUE, 3.5)} transform={`rotate(${local * 8} 50 58)`} />
  </Svg>),
  clock_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <circle cx="50" cy="52" r="36" {...ln(c)} />
    {[0, 90, 180, 270].map((a) => <path key={a} d="M50 20 L50 26" {...ln(c, 3)} transform={`rotate(${a} 50 52)`} />)}
    <path d="M50 52 L50 34" {...ln(c, 4)} transform={`rotate(${local * 6} 50 52)`} /><path d="M50 52 L64 52" {...ln(c, 5)} transform={`rotate(${local * 0.5} 50 52)`} />
    <circle cx="50" cy="52" r="3" fill={c} />
  </Svg>),
  alarm_line: ({size, c, local}) => { const r = sw(local, 1) * 8;
    return (<Svg size={size} local={local} extra={`rotate(${r}deg)`}>
      <circle cx="50" cy="54" r="30" {...ln(c)} /><path d="M50 54 L50 36 M50 54 L62 60" {...ln(c, 4)} />
      <path d="M22 30 Q22 14 36 16 M78 30 Q78 14 64 16" {...ln(c, 5)} /><path d="M30 82 L24 92 M70 82 L76 92" {...ln(c, 4)} />
      <path d="M8 46 L2 42 M6 58 L0 60 M92 46 L98 42 M94 58 L100 60" {...ln(c, 3)} opacity={Math.abs(r) / 8} />
    </Svg>); },
  lamp_line: ({size, c, local}) => { const g = 0.6 + 0.4 * Math.abs(sw(local, 6));
    return (<Svg size={size} local={local}>
      <path d="M30 46 L40 14 L60 14 L70 46 Z" {...ln(c)} /><path d="M50 46 L50 82 M32 88 L68 88 Q66 82 50 82 Q34 82 32 88 Z" {...ln(c)} />
      {[-30, 0, 30].map((a) => <path key={a} d="M50 54 L50 66" {...ln(YEL, 3.5)} transform={`rotate(${a} 50 46)`} opacity={g} />)}
    </Svg>); },
  bed_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M10 30 L10 84 M90 54 L90 84 M10 70 L90 70 M10 54 L90 54" {...ln(c)} />
    <rect x="16" y={40 - Math.abs(sw(local, 10)) * 2} width="22" height="14" rx="6" {...ln(c, 3.5)} />
    <path d="M38 54 Q60 40 88 50" {...ln(c, 3.5)} />
  </Svg>),
  plant_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${sw(local, 9) * 5} 50 62)`}>
      <path d="M50 62 L50 28" {...ln(c, 4)} /><path d="M50 44 Q30 40 26 24 Q44 24 50 40 M50 36 Q66 30 72 14 Q56 14 50 30" {...ln(c)} />
      <path d="M50 54 Q36 54 30 44 M50 50 Q64 50 70 40" {...ln(c, 3.5)} /></g>
    <path d="M30 62 L70 62 L64 92 L36 92 Z M28 62 L72 62" {...ln(c)} />
  </Svg>),
  sofa_line: ({size, c, local}) => (<Svg size={size} local={local} vh={80}>
    <path d="M20 44 L20 24 Q20 18 26 18 L74 18 Q80 18 80 24 L80 44" {...ln(c)} />
    <path d="M8 42 Q8 36 14 36 Q20 36 20 42 L20 56 L80 56 L80 42 Q80 36 86 36 Q92 36 92 42 L92 66 L8 66 Z" {...ln(c)} />
    <path d="M50 20 L50 56" {...ln(c, 3)} /><path d="M14 66 L14 74 M86 66 L86 74" {...ln(c, 4)} />
    <path d={HEART} transform={`translate(28 ${28 - Math.abs(sw(local, 5)) * 2}) scale(0.14)`} fill={PINK} />
  </Svg>),

  // ================= THỜI TIẾT & THIÊN NHIÊN =================
  rain_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M24 48 Q10 48 12 36 Q14 24 28 28 Q32 12 50 14 Q66 14 70 30 Q86 26 88 40 Q88 50 76 50 Z" {...ln(c)} />
    {[28, 44, 60, 74].map((x, i) => { const k = cyc(local, 18, i * 5);
      return <path key={x} d={DROP} transform={drop(x - k * 4, 58 + k * 34, 15, 0.8)} fill={BLUE} {...ln(c, 2)} opacity={1 - k * 0.6} />; })}
  </Svg>),
  lightning_line: ({size, c, local}) => { const on = cyc(local, 24) < 0.6;
    return (<Svg size={size} local={local}>
      <path d="M56 6 L26 54 L48 54 L38 94 L76 40 L54 40 L66 6 Z" fill={on ? YEL : 'none'} {...ln(c)} />
      {on ? <path d="M18 30 L8 26 M82 62 L92 66 M80 20 L88 14" {...ln(c, 3)} /> : null}
    </Svg>); },
  snowflake_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${local * 1.5}deg)`}>
    {[0, 60, 120].map((a) => <g key={a} transform={`rotate(${a} 50 50)`}>
      <path d="M50 10 L50 90" {...ln(c)} /><path d="M40 18 L50 26 L60 18 M40 82 L50 74 L60 82" {...ln(c, 3.5)} /></g>)}
    <circle cx="50" cy="50" r="5" fill={BLUE} />
  </Svg>),
  wind_line: ({size, c, local}) => { const o = cyc(local, 30);
    return (<Svg size={size} local={local}>
      <g transform={`translate(${o * 10 - 5} 0)`} opacity={0.6 + 0.4 * Math.sin(o * Math.PI)}>
        <path d="M8 36 L64 36 Q78 36 78 24 Q78 14 68 14 Q60 14 60 22" {...ln(c)} />
        <path d="M14 54 L80 54 Q92 54 92 66 Q92 78 80 78 Q70 78 70 70" {...ln(c)} />
        <path d="M24 70 L52 70" {...ln(c, 4)} /></g>
    </Svg>); },
  tree_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${sw(local, 10) * 3} 50 90)`}>
      <path d="M50 62 Q18 66 18 42 Q16 22 36 22 Q40 6 58 10 Q74 12 74 28 Q88 34 84 50 Q80 64 50 62 Z" {...ln(c)} />
      <circle cx="38" cy="38" r="3" fill={RED} /><circle cx="62" cy="30" r="3" fill={RED} /><circle cx="64" cy="50" r="3" fill={RED} /></g>
    <path d="M46 92 L48 60 M54 92 L52 60 M50 74 L40 66 M50 70 L60 62" {...ln(c, 4)} /><path d="M34 92 L66 92" {...ln(c, 3)} />
  </Svg>),
  cactus_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 8) * 3}deg)`}>
    <path d="M42 66 L42 22 Q42 12 50 12 Q58 12 58 22 L58 66" {...ln(c)} />
    <path d="M42 46 L32 46 Q26 46 26 40 L26 30 M58 40 L68 40 Q74 40 74 34 L74 26" {...ln(c)} />
    <path d="M48 26 L52 28 M48 40 L52 38 M48 54 L52 56" {...ln(c, 2.5)} /><Flower5 x={50} y={10} s={0.5} fill={PINK} c={c} />
    <path d="M30 66 L70 66 L64 90 L36 90 Z" {...ln(c)} />
  </Svg>),
  butterfly_line: ({size, c, local}) => { const f = 0.55 + 0.45 * Math.abs(Math.sin(local / 3));
    return (<Svg size={size} local={local} extra={`translateY(${sw(local, 7) * 4}px)`}>
      <g transform={`translate(50 50) scale(${f} 1) translate(-50 -50)`}>
        <path d="M48 46 Q28 16 14 28 Q6 44 30 52 Q10 62 22 76 Q36 84 48 58 Z" fill={PINK} fillOpacity={0.35} {...ln(c)} />
        <path d="M52 46 Q72 16 86 28 Q94 44 70 52 Q90 62 78 76 Q64 84 52 58 Z" fill={PINK} fillOpacity={0.35} {...ln(c)} /></g>
      <path d="M50 38 L50 70 M50 38 Q44 26 38 22 M50 38 Q56 26 62 22" {...ln(c, 3.5)} />
    </Svg>); },
  cloud_sun_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${local * 1.2} 62 36)`}>{Array.from({length: 8}, (_, i) =>
      <path key={i} d="M62 10 L62 16" {...ln(YEL, 4)} transform={`rotate(${i * 45} 62 36)`} />)}</g>
    <circle cx="62" cy="36" r="14" fill={YEL} opacity={0.9} />
    <path d={`M${22 + sw(local, 9) * 3} 76 Q8 76 10 64 Q12 52 26 56 Q30 40 48 42 Q64 42 66 58 Q82 54 84 66 Q84 76 72 76 Z`} {...ln(c)} />
  </Svg>),

  // ================= LỄ TẾT & DỊP =================
  party_hat_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${-10 + sw(local, 6) * 6}deg)`}>
    <path d="M50 14 L80 86 L20 86 Z" {...ln(c)} /><path d="M36 50 L62 42 M28 70 L72 62" {...ln(c, 3.5)} />
    <circle cx="50" cy="12" r={7 + Math.abs(sw(local, 3)) * 1.5} fill={PINK} {...ln(c, 3)} />
    <path d="M16 88 Q50 96 84 88" {...ln(c, 4)} />
  </Svg>),
  confetti_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {Array.from({length: 12}, (_, i) => { const k = cyc(local, 40, i * 7); const x = 8 + ((i * 37) % 84); const y = -6 + k * 104;
      const col = [c, YEL, PINK, BLUE, GREEN][i % 5];
      return i % 3 === 0 ? <circle key={i} cx={x} cy={y} r="3" fill={col} /> :
        <path key={i} d={`M${x - 4} ${y} L${x + 4} ${y}`} {...ln(col, 3.5)} transform={`rotate(${local * 8 + i * 30} ${x} ${y})`} />; })}
  </Svg>),
  lantern_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M50 2 L50 14" {...ln(c, 3)} />
    <g transform={`rotate(${sw(local, 7) * 8} 50 4)`}>
      <path d="M38 14 L62 14 M36 80 L64 80" {...ln(c, 4)} />
      <path d="M40 16 Q14 46 40 78 L60 78 Q86 46 60 16 Z" fill={RED} fillOpacity={0.35} {...ln(c)} />
      <path d="M50 16 Q40 46 50 78 M50 16 Q60 46 50 78" {...ln(c, 2.5)} />
      <path d="M46 82 L44 96 M50 82 L50 98 M54 82 L56 96" {...ln(YEL, 3)} /></g>
  </Svg>),
  lixi_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 8) * 5}deg) translateY(${Math.abs(sw(local, 4)) * -2}px)`}>
    <rect x="24" y="8" width="52" height="84" rx="6" fill={RED} fillOpacity={0.45} {...ln(c)} />
    <path d="M24 20 Q50 44 76 20" {...ln(c, 3.5)} /><Flower5 x={50} y={58} s={1.15} fill={YEL} c={c} />
  </Svg>),
  firework_line: ({size, c, local}) => { const k = cyc(local, 40); const e = 1 - Math.pow(1 - Math.min(1, k * 1.6), 3); const r = 12 + e * 34;
    return (<Svg size={size} local={local}>
      {Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2; const col = i % 3 === 0 ? YEL : i % 3 === 1 ? PINK : c;
        return <path key={i} d={`M${50 + Math.cos(a) * r * 0.5} ${50 + Math.sin(a) * r * 0.5} L${50 + Math.cos(a) * r} ${50 + Math.sin(a) * r}`}
          {...ln(col, 4.5)} opacity={1 - Math.pow(k, 5)} />; })}
      {Array.from({length: 6}, (_, i) => { const a = (i / 6) * Math.PI * 2 + 0.26;
        return <circle key={'d' + i} cx={50 + Math.cos(a) * (r + 6)} cy={50 + Math.sin(a) * (r + 6)} r="2.5" fill={c} opacity={1 - Math.pow(k, 4)} />; })}
    </Svg>); },
  xmas_tree_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M50 14 L30 42 L40 42 L24 64 L36 64 L18 86 L82 86 L64 64 L76 64 L60 42 L70 42 Z" {...ln(c)} />
    <path d="M44 86 L44 94 L56 94 L56 86" {...ln(c, 3.5)} />
    <path d={STAR} transform={`translate(50 10) scale(${1 + 0.15 * Math.sin(local / 3)})`} fill={YEL} {...ln(c, 2)} />
    {[[42, 52, RED], [58, 72, BLUE], [40, 76, YEL], [56, 50, PINK]].map(([x, y, col], i) =>
      <circle key={i} cx={x as number} cy={y as number} r="3.5" fill={col as string} opacity={0.6 + 0.4 * Math.abs(sw(local + i * 5, 3))} />)}
  </Svg>),
  peach_blossom_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 10) * 3}deg)`}>
    <path d="M6 88 Q34 70 46 48 Q56 30 90 16 M46 48 Q62 54 76 50 M30 72 Q26 58 32 46" {...ln(c, 4.5)} />
    <Flower5 x={60} y={28} s={1.1} fill={PINK} c={c} /><Flower5 x={80} y={50} s={0.9} fill={PINK} c={c} />
    <Flower5 x={30} y={44} s={0.85} fill={PINK} c={c} /><Flower5 x={44} y={64} s={0.6} fill={PINK} c={c} />
    {[0, 1].map((i) => { const k = cyc(local, 50, i * 25);
      return <ellipse key={i} cx={70 - i * 30 + Math.sin(k * 8) * 4} cy={30 + k * 66} rx="3" ry="4.5" fill={PINK} opacity={1 - k} />; })}
  </Svg>),
  love_letter_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 8) * 5}deg)`}>
    <rect x="12" y="26" width="76" height="52" rx="6" {...ln(c)} /><path d="M12 30 L50 58 L88 30" {...ln(c)} />
    <path d={HEART} transform={`translate(40 ${44 - Math.abs(sw(local, 4)) * 3}) scale(0.2)`} fill={RED} {...ln(c, 10)} />
  </Svg>),

  // ================= MUA SẮM & TIỀN =================
  cart_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateX(${sw(local, 6) * 3}px)`}>
    <path d="M6 18 L18 18 L28 66 L80 66" {...ln(c)} /><path d="M22 30 L88 30 L80 54 L26 54" {...ln(c)} />
    <path d="M40 30 L42 54 M56 30 L56 54 M72 30 L68 54" {...ln(c, 3)} />
    <circle cx="34" cy="80" r="7" {...ln(c)} /><circle cx="72" cy="80" r="7" {...ln(c)} />
    <path d={HEART} transform={`translate(48 ${8 - Math.abs(sw(local, 3)) * 3}) scale(0.16)`} fill={PINK} />
  </Svg>),
  bag_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 7) * 4}deg)`}>
    <path d="M36 34 Q36 14 50 14 Q64 14 64 34" {...ln(c)} />
    <path d="M18 34 L82 34 L76 90 L24 90 Z" {...ln(c)} /><circle cx="36" cy="44" r="2.5" fill={c} /><circle cx="64" cy="44" r="2.5" fill={c} />
    <path d={HEART} transform="translate(38 54) scale(0.24)" fill={PINK} {...ln(c, 9)} />
  </Svg>),
  price_tag_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${-20 + sw(local, 5) * 8}deg)`}>
    <path d="M8 16 Q30 6 36 30" {...ln(c, 3)} />
    <path d="M30 26 L58 24 L92 58 L60 90 L26 56 Z" {...ln(c)} /><circle cx="40" cy="36" r="5" {...ln(c, 3)} />
    <path d="M52 62 L70 52 M56 70 L72 60" {...ln(c, 3.5)} />
  </Svg>),
  coin_line: ({size, c, local}) => { const s = Math.abs(Math.cos(local / 6));
    return (<Svg size={size} local={local}>
      <g transform={`translate(50 50) scale(${0.25 + 0.75 * s} 1) translate(-50 -50)`}>
        <circle cx="50" cy="50" r="34" fill={YEL} fillOpacity={0.5} {...ln(c)} /><circle cx="50" cy="50" r="24" {...ln(c, 3)} />
        <text x="50" y="62" textAnchor="middle" fontFamily="Round, Emo" fontWeight={800} fontSize="34" fill={c}>đ</text></g>
      <path d="M86 18 L90 10 M92 26 L98 24" {...ln(c, 3)} opacity={s} />
    </Svg>); },
  wallet_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d={`M24 30 L62 ${14 - Math.abs(sw(local, 5)) * 4} L70 30`} fill={GREEN} fillOpacity={0.4} {...ln(c, 3.5)} />
    <rect x="12" y="30" width="76" height="54" rx="8" {...ln(c)} />
    <path d="M88 46 L66 46 Q58 46 58 54 Q58 62 66 62 L88 62" {...ln(c)} /><circle cx="68" cy="54" r="3" fill={c} />
  </Svg>),
  sale_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${local * 1.5}deg)`}>
    <path d={Array.from({length: 16}, (_, i) => { const a = (i / 16) * Math.PI * 2, r = i % 2 ? 36 : 44;
      return `${i ? 'L' : 'M'}${50 + Math.cos(a) * r} ${50 + Math.sin(a) * r}`; }).join(' ') + ' Z'} fill={RED} fillOpacity={0.35} {...ln(c)} />
    <g transform={`rotate(${-local * 1.5} 50 50)`}>
      <circle cx="38" cy="38" r="6" {...ln(c, 4)} /><circle cx="62" cy="62" r="6" {...ln(c, 4)} /><path d="M64 34 L36 66" {...ln(c, 4.5)} /></g>
  </Svg>),
  receipt_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${(1 - Math.min(1, local / 18)) * 14}px)`}>
    <path d="M24 8 L76 8 L76 88 L70 82 L63 88 L56 82 L50 88 L44 82 L37 88 L30 82 L24 88 Z" {...ln(c)} />
    {[24, 36, 48].map((y) => <path key={y} d={`M34 ${y} L66 ${y}`} {...ln(c, 3)} />)}
    <path d="M34 64 L50 64 M58 64 L66 64" {...ln(c, 4)} />
  </Svg>),

  // ================= HỌC & CHƠI =================
  book_line: ({size, c, local}) => { const t = Math.abs(sw(local, 6));
    return (<Svg size={size} local={local}>
      <path d="M50 26 Q30 16 8 22 L8 80 Q30 74 50 84 Q70 74 92 80 L92 22 Q70 16 50 26 Z" {...ln(c)} /><path d="M50 26 L50 84" {...ln(c, 3)} />
      <path d={`M50 26 Q${66 - t * 6} ${18 + t * 4} ${82 - t * 10} 24`} {...ln(c, 3)} opacity={0.7} />
      {[38, 50, 62].map((y) => <path key={y} d={`M16 ${y} L40 ${y + 2} M60 ${y + 2} L84 ${y}`} {...ln(c, 2.5)} />)}
    </Svg>); },
  pencil_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 4) * 4}deg)`}>
    <path d="M70 8 L90 28 L36 82 L16 62 Z" {...ln(c)} /><path d="M16 62 L8 92 L36 82" {...ln(c)} />
    <path d="M10 84 L8 92 L16 90 Z" fill={c} /><path d="M62 16 L82 36" {...ln(c, 3)} /><path d="M70 8 L90 28" {...ln(PINK, 6)} />
    <path d={`M4 96 Q${16 + Math.min(1, local / 20) * 30} 90 ${20 + Math.min(1, local / 20) * 40} 96`} {...ln(c, 2.5)} opacity={0.8} />
  </Svg>),
  ball_line: ({size, c, local}) => { const k = cyc(local, 22); const hgt = 34 * (1 - Math.pow(2 * k - 1, 2)); const sq = k < 0.06 || k > 0.94 ? 0.85 : 1;
    return (<Svg size={size} local={local}>
      <ellipse cx="50" cy="92" rx={20 - hgt * 0.3} ry="3.5" {...ln(c, 2.5)} opacity={0.4 + 0.4 * (1 - hgt / 34)} />
      <g transform={`translate(0 ${-hgt}) translate(50 88) scale(${1 / sq} ${sq}) translate(-50 -88) rotate(${local * 9} 50 64)`}>
        <circle cx="50" cy="64" r="24" {...ln(c)} /><path d="M26 64 Q50 50 74 64 M50 40 Q36 64 50 88" {...ln(c, 3.5)} /></g>
    </Svg>); },
  kite_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translate(${sw(local, 9) * 4}px, ${sw(local, 6) * 3}px) rotate(${sw(local, 8) * 6}deg)`}>
    <path d="M60 6 L86 34 L60 66 L34 34 Z" fill={PINK} fillOpacity={0.35} {...ln(c)} /><path d="M60 6 L60 66 M34 34 L86 34" {...ln(c, 3)} />
    <path d={`M60 66 Q${48 + sw(local, 3) * 6} 76 50 84 Q${52 - sw(local, 3) * 6} 92 40 98`} {...ln(c, 3)} />
    <path d="M52 78 L46 74 L48 82 Z M46 92 L40 88 L42 96 Z" fill={YEL} />
  </Svg>),
  blocks_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[[12, 58, 'A', RED], [52, 58, 'B', BLUE], [32, 18, 'C', YEL]].map(([x, y, ch, col], i) => (
      <g key={i} transform={`rotate(${i === 2 ? sw(local, 5) * 5 : 0} ${(x as number) + 18} ${(y as number) + 36})`}>
        <rect x={x as number} y={y as number} width="36" height="36" rx="4" fill={col as string} fillOpacity={0.35} {...ln(c)} />
        <text x={(x as number) + 18} y={(y as number) + 27} textAnchor="middle" fontFamily="Round, Emo" fontWeight={800} fontSize="24" fill={c}>{ch as string}</text></g>))}
  </Svg>),
  puzzle_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 7) * 6}deg)`}>
    <path d="M20 30 L40 30 Q36 18 46 16 Q56 16 54 30 L76 30 L76 50 Q88 46 88 56 Q88 66 76 62 L76 84 L56 84 Q60 72 50 72 Q40 72 44 84 L20 84 L20 62 Q30 66 30 56 Q30 46 20 50 Z"
      fill={GREEN} fillOpacity={0.35} {...ln(c)} />
  </Svg>),
  gamepad_line: ({size, c, local}) => { const pr = cyc(local, 16) < 0.3;
    return (<Svg size={size} local={local} vh={80}>
      <path d="M28 20 L72 20 Q94 20 94 46 Q94 70 80 70 Q70 70 64 56 L36 56 Q30 70 20 70 Q6 70 6 46 Q6 20 28 20 Z" {...ln(c)} />
      <path d="M26 30 L26 46 M18 38 L34 38" {...ln(c, 4)} />
      <circle cx="70" cy="32" r={pr ? 3 : 4} fill={pr ? RED : 'none'} {...ln(c, 3)} /><circle cx="80" cy="42" r="4" {...ln(c, 3)} />
    </Svg>); },

  // ================= THỂ THAO & SỨC KHOẺ =================
  bike_line: ({size, c, local}) => (<Svg size={size} local={local} vh={80}>
    <Wheel cx={22} cy={56} r={16} c={c} local={local} /><Wheel cx={78} cy={56} r={16} c={c} local={local} />
    <path d="M22 56 L40 30 L66 30 L78 56 M40 30 L50 56 L66 30 M50 56 L22 56 M36 22 L46 22 M66 30 L62 18 L72 18" {...ln(c)} />
  </Svg>),
  medal_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${sw(local, 6) * 6}deg)`}>
    <path d="M30 6 L44 40 M70 6 L56 40" {...ln(c, 6)} /><path d="M30 6 L44 40" {...ln(RED, 3)} />
    <circle cx="50" cy="62" r="24" fill={YEL} fillOpacity={0.5} {...ln(c)} />
    <path d={STAR} transform={`translate(50 62) scale(${1.4 + 0.1 * Math.sin(local / 3)})`} {...ln(c, 2)} />
  </Svg>),
  thermometer_line: ({size, c, local}) => { const h = 20 + Math.min(1, local / 30) * 34 + Math.sin(local / 4) * 2;
    return (<Svg size={size} local={local}>
      <path d="M42 70 L42 16 Q42 8 50 8 Q58 8 58 16 L58 70" {...ln(c)} /><circle cx="50" cy="78" r="13" {...ln(c)} />
      <circle cx="50" cy="78" r="7" fill={RED} /><path d={`M50 74 L50 ${74 - h}`} {...ln(RED, 5)} />
      {[24, 36, 48].map((y) => <path key={y} d={`M58 ${y} L64 ${y}`} {...ln(c, 2.5)} />)}
    </Svg>); },
  bandage_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${-30 + sw(local, 7) * 4}deg)`}>
    <rect x="8" y="36" width="84" height="28" rx="14" {...ln(c)} /><rect x="36" y="38" width="28" height="24" rx="4" fill={PINK} fillOpacity={0.5} {...ln(c, 2.5)} />
    {[[44, 46], [56, 46], [50, 54], [44, 58], [56, 58]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="1.6" fill={c} />)}
  </Svg>),
  dumbbell_line: ({size, c, local}) => { const y = Math.abs(sw(local, 4)) * -14;
    return (<Svg size={size} local={local}>
      <g transform={`translate(0 ${y + 10})`}>
        <path d="M28 46 L72 46" {...ln(c, 6)} />
        <rect x="14" y="30" width="14" height="32" rx="4" {...ln(c)} /><rect x="72" y="30" width="14" height="32" rx="4" {...ln(c)} />
        <rect x="6" y="36" width="8" height="20" rx="3" {...ln(c, 3.5)} /><rect x="86" y="36" width="8" height="20" rx="3" {...ln(c, 3.5)} /></g>
      <path d="M18 92 L26 84 M50 94 L50 84 M82 92 L74 84" {...ln(c, 3)} opacity={Math.abs(y) / 14} />
    </Svg>); },
  trophy_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M28 12 L72 12 L70 40 Q66 58 50 58 Q34 58 30 40 Z" fill={YEL} fillOpacity={0.45} {...ln(c)} />
    <path d="M28 18 Q12 18 14 30 Q16 42 30 42 M72 18 Q88 18 86 30 Q84 42 70 42" {...ln(c, 4)} />
    <path d="M50 58 L50 72 M36 88 L64 88 L60 72 L40 72 Z" {...ln(c)} />
    {[0, 1, 2].map((i) => { const k = cyc(local, 30, i * 10); return (
      <path key={i} d={STAR} transform={`translate(${20 + i * 30} ${26 - k * 20}) scale(${0.5 * Math.sin(k * Math.PI)})`} fill={YEL} />); })}
  </Svg>),
};

// Nhóm theo chủ đề (cho ảnh mẫu catalog_net_*.png): [trang, tiêu đề, danh sách tên]
export const DOODLE3_GROUPS: [number, string, string[]][] = [
  [11, 'Đi chơi', ['car_line', 'bus_line', 'plane_line', 'map_pin_line', 'ticket_line', 'backpack_line', 'tent_line', 'mountain_line', 'sunglasses_line', 'palm_line', 'waves_line']],
  [11, 'Em bé & gia đình', ['baby_face_line', 'rattle_line', 'onesie_line', 'stroller_line', 'teddy_line', 'family_line', 'heart_hands_line', 'bath_line']],
  [12, 'Nhà & bếp', ['pot_line', 'pan_line', 'broom_line', 'washer_line', 'clock_line', 'alarm_line', 'lamp_line', 'bed_line', 'plant_line', 'sofa_line']],
  [12, 'Thời tiết & thiên nhiên', ['rain_line', 'lightning_line', 'snowflake_line', 'wind_line', 'tree_line', 'cactus_line', 'butterfly_line', 'cloud_sun_line']],
  [13, 'Lễ tết & dịp đặc biệt', ['party_hat_line', 'confetti_line', 'lantern_line', 'lixi_line', 'firework_line', 'xmas_tree_line', 'peach_blossom_line', 'love_letter_line']],
  [13, 'Mua sắm & tiền', ['cart_line', 'bag_line', 'price_tag_line', 'coin_line', 'wallet_line', 'sale_line', 'receipt_line']],
  [14, 'Học & chơi', ['book_line', 'pencil_line', 'ball_line', 'kite_line', 'blocks_line', 'puzzle_line', 'gamepad_line']],
  [14, 'Thể thao & sức khoẻ', ['bike_line', 'medal_line', 'thermometer_line', 'bandage_line', 'dumbbell_line', 'trophy_line']],
];
