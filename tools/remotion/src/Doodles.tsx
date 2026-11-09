import React from 'react';

// Bộ nét vẽ tay TRẮNG kiểu "Yummy!" (giống video tham khảo): nét mảnh, rung nhẹ như vẽ tay (line boil).
// Mỗi hàm nhận (size, c = màu nét, local = khung hình kể từ lúc hiện, prog = 0..1 tiến độ vẽ).
type P = {size: number; c: string; local: number; prog: number};
const PINK = '#FF9EB5';
const ln = (c: string, w = 4.5) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});
const drawn = (p: number) => ({pathLength: 1, strokeDasharray: 1, strokeDashoffset: 1 - p});
const SH: React.CSSProperties = {filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5)) drop-shadow(0 1px 3px rgba(0,0,0,0.5))', overflow: 'visible'};
// Rung kiểu vẽ tay: đổi nhẹ vị trí/góc mỗi 4 khung hình
const boil = (local: number, amt = 1) => {
  const k = Math.floor(local / 4);
  const r = (n: number) => { const x = Math.sin(k * 12.9898 + n * 78.233) * 43758.5453; return x - Math.floor(x) - 0.5; };
  return `translate(${r(1) * 2.2 * amt}px, ${r(2) * 2.2 * amt}px) rotate(${r(3) * 2.4 * amt}deg)`;
};
const Svg: React.FC<{size: number; local: number; vw?: number; vh?: number; children: React.ReactNode; extra?: string}> =
  ({size, local, vw = 100, vh = 100, children, extra = ''}) => (
    <svg width={size * vw / 100} height={size * vh / 100} viewBox={`0 0 ${vw} ${vh}`} style={{...SH, transform: `${boil(local)} ${extra}`}}>{children}</svg>);
const drop = (x: number, y: number, rot: number, s = 1) => `translate(${x} ${y}) rotate(${rot}) scale(${s})`;
const DROP = 'M0 -9 Q7 -1 5 4 Q0 9 -5 4 Q-7 -1 0 -9 Z';
const HEART = 'M50,84 C22,64 6,48 6,30 C6,16 16,7 29,7 C38,7 46,12 50,20 C54,12 62,7 71,7 C84,7 94,16 94,30 C94,48 78,64 50,84 Z';
const STAR = 'M0,-10 L2.9,-3.6 L9.5,-3.1 L4.5,1.4 L5.9,8.1 L0,4.6 L-5.9,8.1 L-4.5,1.4 L-9.5,-3.1 L-2.9,-3.6 Z';
// 2 bàn tay/chân ôm ở dưới (dùng cho thú ló ra)
const Paws: React.FC<{c: string}> = ({c}) => (<>
  <path d="M18 88 Q16 76 28 74 Q40 74 40 86" {...ln(c)} /><path d="M24 76 L25 81 M31 74.5 L31 80" {...ln(c, 3)} />
  <path d="M60 86 Q60 74 72 74 Q84 76 82 88" {...ln(c)} /><path d="M69 74.5 L69 80 M76 76 L75 81" {...ln(c, 3)} />
</>);
const HappyFace: React.FC<{c: string; y?: number}> = ({c, y = 50}) => (<>
  <path d={`M33 ${y} Q37 ${y - 5} 41 ${y}`} {...ln(c, 4)} /><path d={`M59 ${y} Q63 ${y - 5} 67 ${y}`} {...ln(c, 4)} />
  <path d={`M44 ${y + 8} Q47 ${y + 12} 50 ${y + 8} Q53 ${y + 12} 56 ${y + 8}`} {...ln(c, 3.5)} />
  <ellipse cx="30" cy={y + 8} rx="5" ry="3" fill={PINK} opacity={0.85} /><ellipse cx="70" cy={y + 8} rx="5" ry="3" fill={PINK} opacity={0.85} />
</>);

export const DOODLES: Record<string, (p: P) => React.ReactElement> = {
  // Giật mình / bối rối: 2 vệt cong + giọt bắn ra (đặt cạnh đầu, rotate/flip để đổi hướng)
  splash: ({size, c, local}) => {
    const k = Math.min(1, local / 10);
    return (<Svg size={size} local={local}>
      <path d="M84 78 Q52 66 40 30" {...ln(c, 5)} {...drawn(Math.min(1, local / 8))} />
      <path d="M92 60 Q74 42 78 12" {...ln(c, 5)} {...drawn(Math.min(1, local / 8))} />
      <path d={DROP} transform={drop(30 - k * 8, 26 - k * 8, -40)} {...ln(c, 3.5)} />
      <path d={DROP} transform={drop(56 - k * 3, 12 - k * 8, -10, 0.8)} {...ln(c, 3.5)} />
      <path d={DROP} transform={drop(20 - k * 10, 52, -75, 0.9)} {...ln(c, 3.5)} />
      <ellipse cx={14 - k * 6} cy="74" rx="5" ry="3.5" {...ln(c, 3)} />
    </Svg>);
  },
  // Tia nhấn tỏa ra (góc màn hình / cạnh vật cần nhấn)
  burst_lines: ({size, c, local}) => {
    const g = Math.min(1, local / 8); const pulse = 1 + 0.08 * Math.sin(local / 3);
    return (<Svg size={size} local={local}>
      {Array.from({length: 9}, (_, i) => { const a = (i / 9) * Math.PI * 2 - Math.PI / 2;
        const r1 = 16 * pulse, r2 = r1 + (i % 2 ? 12 : 22) * g;
        return <path key={i} d={`M${50 + Math.cos(a) * r1} ${50 + Math.sin(a) * r1} L${50 + Math.cos(a) * r2} ${50 + Math.sin(a) * r2}`} {...ln(c, 4)} />; })}
    </Svg>);
  },
  // Thú nét trắng ló ra, 2 tay ôm (đặt ngay cạnh tay bé / mép bàn)
  cat_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M20 54 L24 20 L40 36 Q50 33 60 36 L76 20 L80 54 Q82 74 50 76 Q18 74 20 54 Z" {...ln(c)} />
    <path d="M27 30 L30 38 M73 30 L70 38" {...ln(PINK, 3)} />
    <HappyFace c={c} y={52} />
    <path d="M6 58 L20 60 M8 66 L21 65 M94 58 L80 60 M92 66 L79 65" {...ln(c, 2.5)} />
    <Paws c={c} /></Svg>),
  dog_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M24 34 Q10 30 10 50 Q12 62 22 58" {...ln(c)} /><path d="M76 34 Q90 30 90 50 Q88 62 78 58" {...ln(c)} />
    <path d="M24 34 Q30 18 50 18 Q70 18 76 34 Q82 72 50 76 Q18 72 24 34 Z" {...ln(c)} />
    <HappyFace c={c} y={46} /><ellipse cx="50" cy="50" rx="4" ry="3" fill={c} />
    <Paws c={c} /></Svg>),
  bunny_peek: ({size, c, local}) => (<Svg size={size} local={local} vh={110}>
    <g transform="translate(0 10)">
      <path d="M38 34 Q30 -4 40 -6 Q48 -6 46 32" {...ln(c)} /><path d="M54 32 Q52 -6 62 -6 Q72 -4 62 34" {...ln(c)} />
      <path d="M40 30 Q40 6 41 2 M60 30 Q60 6 59 2" {...ln(PINK, 3)} />
      <path d="M22 54 Q22 30 50 30 Q78 30 78 54 Q78 76 50 76 Q22 76 22 54 Z" {...ln(c)} />
      <HappyFace c={c} y={52} /><Paws c={c} /></g></Svg>),
  bear_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <circle cx="26" cy="28" r="9" {...ln(c)} /><circle cx="74" cy="28" r="9" {...ln(c)} />
    <path d="M22 50 Q22 24 50 24 Q78 24 78 50 Q78 76 50 76 Q22 76 22 50 Z" {...ln(c)} />
    <ellipse cx="50" cy="60" rx="10" ry="7" {...ln(c, 3.5)} />
    <HappyFace c={c} y={46} /><Paws c={c} /></Svg>),
  // Chóng mặt @_@ (xoắn ốc tự vẽ rồi quay)
  swirl: ({size, c, local}) => {
    const pts = Array.from({length: 90}, (_, k) => { const a = k / 89 * Math.PI * 6.2; const r = 2 + a * 2.2;
      return `${(50 + Math.cos(a) * r).toFixed(1)} ${(50 + Math.sin(a) * r).toFixed(1)}`; });
    return (<Svg size={size} local={local} extra={`rotate(${local * 5}deg)`}>
      <path d={`M${pts.join(' L')}`} {...ln(c, 4)} {...drawn(Math.min(1, local / 12))} /></Svg>);
  },
  // Vạch chuyển động (bé chạy, quay đầu nhanh) — vạch ở bên TRÁI, rotate để đổi hướng
  motion_lines: ({size, c, local}) => (<Svg size={size} local={local} vw={120} vh={80}>
    {[[14, 20, 70], [6, 40, 84], [18, 60, 64]].map(([x, y, w], i) => {
      const off = ((local * 3 + i * 7) % 20);
      return <path key={i} d={`M${x + off} ${y} L${x + (w as number)} ${y}`} {...ln(c, 4.5)} opacity={0.6 + 0.4 * Math.sin((local + i * 5) / 3)} />; })}
  </Svg>),
  // Ý tưởng / à ra thế
  lightbulb: ({size, c, local}) => (<Svg size={size} local={local}>
    {[-60, -30, 0, 30, 60].map((a) => <path key={a} d="M50 6 L50 0" transform={`rotate(${a} 50 40)`} {...ln(c, 4)} opacity={0.5 + 0.5 * Math.abs(Math.sin(local / 4))} />)}
    <path d="M36 62 Q24 50 26 36 Q30 14 50 14 Q70 14 74 36 Q76 50 64 62 L62 72 L38 72 Z" {...ln(c)} />
    <path d="M40 80 L60 80 M43 88 L57 88" {...ln(c)} /><path d="M44 60 L46 42 L50 50 L54 42 L56 60" {...ln('#FFE066', 3)} />
  </Svg>),
  anger_mark: ({size, c, local}) => (<Svg size={size} local={local} extra={`scale(${1 + 0.1 * Math.abs(Math.sin(local / 3))})`}>
    {[0, 90, 180, 270].map((a) => <path key={a} d="M42 14 Q42 42 14 42" transform={`rotate(${a} 50 50)`} {...ln(c, 5.5)} />)}
  </Svg>),
  sweat_drop: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${(local % 30) / 30 * 6}px)`}>
    <path d="M40 10 Q66 44 62 60 Q58 76 40 76 Q22 76 20 60 Q16 44 40 10 Z" {...ln(c)} />
    <path d="M30 56 Q30 66 38 68" {...ln(c, 3)} /><path d={DROP} transform={drop(76, 30, 20, 1.1)} {...ln(c, 3.5)} />
  </Svg>),
  notes_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${Math.sin(local / 6) * 5}px)`}>
    <path d="M26 74 L26 22 L44 18" {...ln(c)} /><ellipse cx="18" cy="76" rx="9" ry="7" transform="rotate(-20 18 76)" {...ln(c)} />
    <path d="M60 66 L60 26 L88 18 L88 58" {...ln(c)} /><path d="M60 34 L88 26" {...ln(c)} />
    <ellipse cx="52" cy="68" rx="9" ry="7" transform="rotate(-20 52 68)" {...ln(c)} /><ellipse cx="80" cy="60" rx="9" ry="7" transform="rotate(-20 80 60)" {...ln(c)} />
  </Svg>),
  stars_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[[30, 60, 2.4], [70, 30, 1.7], [78, 74, 1.2]].map(([x, y, s], i) => (
      <path key={i} d={STAR} transform={`translate(${x} ${y}) scale(${(s as number) * (0.85 + 0.15 * Math.sin((local + i * 8) / 4))})`} {...ln(c, 2)} />))}
  </Svg>),
  crown_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 8) * 5}deg)`}>
    <path d="M16 74 L12 32 L32 52 L50 22 L68 52 L88 32 L84 74 Z" {...ln(c)} />
    <path d="M16 74 L84 74" {...ln(c)} /><circle cx="12" cy="28" r="4" {...ln(c, 3)} /><circle cx="50" cy="18" r="4" {...ln(c, 3)} /><circle cx="88" cy="28" r="4" {...ln(c, 3)} />
  </Svg>),
  // Má ửng hồng: đặt 1 cái lên mỗi má (hoặc dùng cả cặp bằng w lớn)
  blush_lines: ({size, c, local}) => (<Svg size={size} local={local} vh={60}>
    <ellipse cx="50" cy="32" rx="36" ry="18" fill={PINK} opacity={0.55 + 0.2 * Math.abs(Math.sin(local / 6))} />
    <path d="M30 40 L38 24 M46 42 L54 24 M62 40 L70 24" {...ln(c, 4)} />
  </Svg>),
  hearts_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[[34, 66, 0.3], [64, 40, 0.22], [40, 24, 0.15]].map(([x, y, s], i) => {
      const up = ((local + i * 10) % 40) / 40;
      return <path key={i} d={HEART} transform={`translate(${(x as number) - 50 * (s as number)} ${(y as number) - 46 * (s as number) - up * 10}) scale(${s})`}
        {...ln(c, 4.5 / (s as number))} opacity={Math.sin(up * Math.PI) * 0.5 + 0.5} />; })}
  </Svg>),
  // Tay vẫy (Byee)
  wave_hand: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${Math.sin(local / 3) * 14} 50 86)`}>
      <path d="M34 86 Q24 70 26 54 L26 34 Q26 28 31 28 Q36 28 36 34 L36 50 L36 20 Q36 14 41 14 Q46 14 46 20 L46 48 L46 16 Q46 10 51 10 Q56 10 56 16 L56 48 L56 22 Q56 16 61 16 Q66 16 66 22 L66 58 L72 48 Q76 42 81 46 Q84 50 80 56 L68 78 Q62 86 54 86 Z" {...ln(c)} />
    </g>
    <path d="M10 30 Q6 20 12 12 M90 30 Q94 20 88 12" {...ln(c, 4)} opacity={Math.abs(Math.sin(local / 3))} />
  </Svg>),
  flower_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${local}deg)`}>
    {[0, 72, 144, 216, 288].map((a) => <ellipse key={a} cx="50" cy="28" rx="11" ry="17" transform={`rotate(${a} 50 50)`} {...ln(c, 4)} />)}
    <circle cx="50" cy="50" r="9" fill="#FFE066" stroke={c} strokeWidth={3.5} />
  </Svg>),
  sun_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${local * 1.5} 50 50)`}>{Array.from({length: 8}, (_, i) => <path key={i} d="M50 8 L50 18" transform={`rotate(${i * 45} 50 50)`} {...ln(c)} />)}</g>
    <circle cx="50" cy="50" r="22" {...ln(c)} /><HappyFace c={c} y={48} />
  </Svg>),
  exclaim_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${-Math.abs(Math.sin(local / 4)) * 4}px)`}>
    <path d="M40 14 Q46 12 46 18 L44 58 Q40 62 38 58 L34 20 Q34 14 40 14 Z" {...ln(c, 4)} /><circle cx="41" cy="74" r="5" {...ln(c, 4)} />
    <path d="M60 22 L68 16 M62 34 L74 32 M58 44 L66 50" {...ln(c, 3.5)} />
  </Svg>),
  question_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 5) * 8}deg)`}>
    <path d="M32 32 Q32 12 52 12 Q70 12 70 30 Q70 44 54 50 L54 60" {...ln(c, 5)} /><circle cx="54" cy="76" r="5" {...ln(c, 4)} />
  </Svg>),
  // Hơi thở dài / bụi khi chạy (phù...)
  puff: ({size, c, local}) => {
    const k = (local % 30) / 30;
    return (<Svg size={size} local={local} vw={120} vh={80}>
      {[[30, 50, 14], [56, 36, 18], [86, 48, 12]].map(([x, y, r], i) => (
        <circle key={i} cx={(x as number) + k * 10} cy={(y as number) - k * 6} r={(r as number) * (0.8 + 0.3 * k)} {...ln(c, 4)} opacity={1 - k * 0.6} />))}
    </Svg>);
  },
  // Nước mắt chảy thành dòng (đặt ngay dưới mắt bé)
  tears_line: ({size, c, local}) => (<Svg size={size} local={local} vw={120} vh={90}>
    {[0, 1].map((i) => { const x = i ? 92 : 28; const d = ((local + i * 9) % 18) / 18;
      return (<g key={i}>
        <path d={`M${x} 6 Q${x - 3} 30 ${x - 9} 58 Q${x - 11} 74 ${x} 76 Q${x + 11} 74 ${x + 9} 58 Q${x + 3} 30 ${x} 6`} {...ln(c, 4)} />
        <path d={DROP} transform={drop(x + (i ? 14 : -14), 40 + d * 40, 0, 0.8)} {...ln(c, 3)} opacity={1 - d} /></g>); })}
  </Svg>),
};

export const DOODLE_LIST = Object.keys(DOODLES);

// dùng chung cho Doodles2.tsx
export {ln, drawn, boil, Svg, drop, DROP, HEART, STAR, Paws, HappyFace, PINK};
