import React from 'react';
import {ln, drawn, boil, Svg, drop, DROP, HEART, STAR, Paws, HappyFace, PINK} from './Doodles';

// Bộ nét trắng vẽ tay MỞ RỘNG (08/11/2026 — khách thích kiểu nét trắng, làm thêm). Cùng quy ước với Doodles.tsx:
// (size, c = màu nét, local = khung hình kể từ lúc hiện, prog, text = chữ cho bubble_line/bubble_think).
type P = {size: number; c: string; local: number; prog: number; text?: string};
const YEL = '#FFE066', GREEN = '#A5D6A7', INK = '#5D4037', RED = '#FF6B81';
const SPARK4 = 'M0 -12 Q2 -2 12 0 Q2 2 0 12 Q-2 2 -12 0 Q-2 -2 0 -12 Z';
const cyc = (local: number, n: number, off = 0) => ((local + off) % n) / n;
const cl = (x: number) => Math.max(0, Math.min(1, x));
const SHD: React.CSSProperties = {filter: 'drop-shadow(0 0 1px rgba(0,0,0,0.5)) drop-shadow(0 1px 3px rgba(0,0,0,0.5))'};

export const DOODLES2: Record<string, (p: P) => React.ReactElement> = {
  // ================= ĂN UỐNG =================
  // Khói bốc lên (đặt trên tô/ly nóng)
  steam_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[30, 50, 70].map((x, i) => { const k = cyc(local, 30, i * 9);
      return <path key={i} d={`M${x} 88 Q${x - 9} 72 ${x} 58 Q${x + 9} 44 ${x} 30`} transform={`translate(0 ${-k * 12})`}
        {...ln(c, 5)} opacity={Math.sin(k * Math.PI) * 0.25 + 0.75} />; })}
  </Svg>),
  bowl_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[34, 48].map((x, i) => <path key={i} d={`M${x} 40 Q${x - 5} 32 ${x} 26 Q${x + 5} 20 ${x} 12`} {...ln(c, 3.5)}
      transform={`translate(0 ${-cyc(local, 24, i * 8) * 6})`} opacity={0.4 + 0.6 * Math.sin(cyc(local, 24, i * 8) * Math.PI)} />)}
    <path d="M18 50 Q24 41 32 46 Q38 38 46 44 Q52 38 58 45" {...ln(c, 3.5)} />
    <path d="M60 46 L88 12 M68 48 L94 18" {...ln(c, 4)} />
    <path d="M12 50 L88 50 Q86 82 50 84 Q14 82 12 50 Z" {...ln(c)} />
    <path d="M38 84 L36 92 L64 92 L62 84" {...ln(c, 3.5)} />
  </Svg>),
  // Đũa gắp sợi mì (đung đưa)
  chopsticks_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${Math.sin(local / 5) * 4} 88 10)`}>
      <path d="M86 6 L30 68 M95 13 L39 75" {...ln(c, 4.5)} />
      <path d="M33 70 Q28 82 33 94 M37 72 Q41 84 36 96 M35 71 Q31 86 41 97" {...ln(c, 3)} />
    </g></Svg>),
  // Ly trà sữa trân châu
  cup_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 7) * 4}deg)`}>
    <path d="M58 26 L68 2" {...ln(c, 5)} />
    <path d="M22 34 L78 34 M25 34 Q50 14 75 34" {...ln(c)} />
    <path d="M27 34 L33 92 L67 92 L73 34" {...ln(c)} />
    <path d="M30 54 Q50 60 71 54" {...ln(c, 3)} />
    {[[41, 83], [51, 85], [61, 83], [46, 75], [57, 75]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3.6} {...ln(c, 3)} />)}
  </Svg>),
  // Chảy nước miếng (đặt cạnh khóe miệng bé)
  drool_line: ({size, c, local}) => { const k = cyc(local, 36);
    return (<Svg size={size} local={local} vw={60}>
      <path d={`M30 4 Q27 ${18 + k * 8} 30 ${30 + k * 10}`} {...ln(c, 4.5)} />
      <path d={DROP} transform={drop(30, 42 + k * 10, 0, 2.2)} {...ln(c, 2.2)} />
      <path d={DROP} transform={drop(30, 70 + k * 22, 0, 0.9)} {...ln(c, 3)} opacity={1 - k} />
    </Svg>); },
  // Bánh kem có nến lung linh
  cake_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M50 42 L50 30" {...ln(c, 4)} />
    <path d="M50 28 Q43 20 50 9 Q57 20 50 28 Z" fill={YEL} stroke={c} strokeWidth={3}
      transform={`translate(50 28) scale(${1 + 0.12 * Math.sin(local / 2)} ${1 + 0.18 * Math.sin(local / 1.6)}) translate(-50 -28)`} />
    <path d="M26 62 L26 44 L74 44 L74 62" {...ln(c)} />
    <path d="M14 62 L86 62 L86 90 L14 90 Z" {...ln(c)} />
    <path d="M14 72 Q22 79 30 72 Q38 79 46 72 Q54 79 62 72 Q70 79 78 72 Q82 76 86 72" {...ln(c, 3)} />
  </Svg>),
  icecream_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 6) * 5}deg)`}>
    <path d="M32 52 L50 95 L68 52" {...ln(c)} />
    <path d="M38 60 L58 80 M63 59 L45 82 M50 56 L62 66" {...ln(c, 3)} />
    <path d="M30 53 Q22 42 33 34 Q36 19 50 19 Q64 19 67 34 Q78 42 70 53 Q50 58 30 53 Z" {...ln(c)} />
    <path d="M40 55 Q40 64 44 64 Q47 63 46 55" {...ln(c, 3)} />
    <circle cx="52" cy="13" r="5.5" fill={RED} stroke={c} strokeWidth={3} />
  </Svg>),
  fork_spoon_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 5) * 6}deg)`}>
    <g transform="rotate(-24 50 54)"><ellipse cx="50" cy="22" rx="10" ry="15" {...ln(c)} /><path d="M50 37 L50 94" {...ln(c)} /></g>
    <g transform="rotate(24 50 54)"><path d="M40 8 L40 26 Q40 36 50 36 Q60 36 60 26 L60 8 M50 8 L50 30 M50 36 L50 94" {...ln(c)} /></g>
  </Svg>),
  // Cơm nắm cười
  rice_ball_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${-Math.abs(Math.sin(local / 5)) * 4}px)`}>
    <path d="M50 12 Q60 12 70 30 L86 62 Q92 82 70 84 L30 84 Q8 82 14 62 L30 30 Q40 12 50 12 Z" {...ln(c)} />
    <path d="M37 84 L37 66 L63 66 L63 84" {...ln(c, 4)} />
    <HappyFace c={c} y={46} />
  </Svg>),
  drumstick_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 5) * 6}deg)`}>
    <path d="M60 42 Q76 22 58 10 Q36 2 26 22 Q18 42 38 54 Q50 60 60 42 Z" {...ln(c)} />
    <path d="M46 54 L67 75 M56 45 L76 65" {...ln(c, 4)} />
    <circle cx="70" cy="81" r="6.5" {...ln(c, 4)} /><circle cx="82" cy="69" r="6.5" {...ln(c, 4)} />
    <path d="M34 22 Q38 15 45 15" {...ln(c, 3)} />
  </Svg>),
  banhmi_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 6) * 4}deg)`}>
    <g transform="rotate(-20 50 50)">
      <path d="M18 61 Q30 70 44 64 Q58 72 72 64 Q82 68 86 58" {...ln(GREEN, 3.5)} />
      <path d="M10 50 Q10 36 30 34 L72 34 Q92 36 90 50 Q92 64 72 66 L30 66 Q10 64 10 50 Z" {...ln(c)} />
      <path d="M28 43 L36 55 M44 42 L52 55 M60 42 L68 55" {...ln(c, 3.5)} />
    </g></Svg>),
  watermelon_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 6) * 5}deg)`}>
    <path d="M10 38 L90 38 Q90 86 50 86 Q10 86 10 38 Z" {...ln(c)} />
    <path d="M19 40 Q21 75 50 76 Q79 75 81 40" {...ln(GREEN, 3.5)} />
    <path d="M32 50 L33 57 M45 57 L46 64 M55 57 L54 64 M68 50 L67 57" {...ln(c, 4.5)} />
  </Svg>),
  egg_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`scale(${1 + 0.04 * Math.sin(local / 4)})`}>
    <path d="M20 50 Q14 26 36 20 Q50 10 66 18 Q90 24 86 50 Q90 76 64 80 Q50 90 34 80 Q12 74 20 50 Z" {...ln(c)} />
    <circle cx="52" cy="50" r="15" fill={YEL} stroke={c} strokeWidth={3.5} />
    <path d="M45 48 Q47 45 49 48 M55 48 Q57 45 59 48 M48 55 Q52 59 56 55" {...ln(INK, 2.5)} />
  </Svg>),
  cookie_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${local * 0.8}deg)`}>
    <path d="M78 28 Q70 26 72 18 Q64 11 50 12 Q14 14 12 50 Q14 86 50 88 Q86 86 88 50 Q88 40 85 35 Q76 37 78 28 Z" {...ln(c)} />
    {[[36, 36], [56, 30], [40, 62], [62, 60], [26, 52], [50, 48]].map(([x, y], i) => <ellipse key={i} cx={x} cy={y} rx={3.5} ry={3} fill={c} />)}
  </Svg>),

  // ================= CẢM XÚC / PHẢN ỨNG =================
  // Sao xoay quanh đầu (choáng)
  dizzy_stars: ({size, c, local}) => (<Svg size={size} local={local} vh={70}>
    <ellipse cx="50" cy="35" rx="40" ry="13" {...ln(c, 2.5)} opacity={0.5} />
    {[0, 1, 2].map((i) => { const a = local / 6 + i * 2.094; const x = 50 + Math.cos(a) * 40, y = 35 + Math.sin(a) * 13;
      return <path key={i} d={STAR} transform={`translate(${x} ${y}) scale(${1.4 + 0.35 * Math.sin(a)})`} {...ln(c, 2.4)} />; })}
  </Svg>),
  // Vạch u ám dọc rủ xuống (thất vọng, xỉu)
  worry_lines: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateX(${Math.sin(local * 1.7) * 1.5}px)`}>
    {[[18, 54], [32, 78], [46, 62], [60, 84], [74, 58], [86, 72]].map(([x, l], i) =>
      <path key={i} d={`M${x} 8 L${x} ${l}`} {...ln(c, 3.5)} {...drawn(cl((local - i * 2) / 10))} opacity={0.85} />)}
  </Svg>),
  // Mây mưa trên đầu (buồn, ủ rũ)
  gloom_lines: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M24 46 Q10 46 12 34 Q14 24 26 26 Q28 10 46 12 Q58 10 62 22 Q70 16 80 22 Q90 28 86 38 Q92 46 82 48 Z" {...ln(c)} />
    {[28, 46, 64, 80].map((x, i) => { const k = cyc(local, 20, i * 5);
      return <path key={i} d={`M${x} ${56 + k * 30} L${x - 4} ${66 + k * 30}`} {...ln(c, 3.5)} opacity={1 - k} />; })}
  </Svg>),
  // Bóng loáng / sạch bong / tỏa sáng
  shine_lines: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M18 72 L40 50 M30 84 L48 66" {...ln(c, 4.5)} />
    <path d={SPARK4} transform={`translate(70 30) scale(${1.5 + 0.4 * Math.sin(local / 3)})`} {...ln(c, 2.4)} />
    <path d={SPARK4} transform={`translate(82 64) scale(${0.75 + 0.3 * Math.sin(local / 3 + 2)})`} {...ln(c, 3)} />
  </Svg>),
  zzz_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[[28, 76, 1], [52, 50, 0.75], [72, 28, 0.55]].map(([x, y, s], i) => { const k = cyc(local, 36, i * 10);
      return <path key={i} d="M-12 -12 L12 -12 L-12 12 L12 12" transform={`translate(${x + k * 4} ${y - k * 8}) scale(${s})`}
        {...ln(c, 5 / s)} opacity={1 - k * 0.15} />; })}
  </Svg>),
  // Dấu "..." (cạn lời / đang nghĩ)
  dots_line: ({size, c, local}) => (<Svg size={size} local={local} vh={40}>
    {[25, 50, 75].map((x, i) => <circle key={i} cx={x} cy={20} r={6.5} fill={c} opacity={Math.min(3, Math.floor(local / 6) % 6) > i ? 1 : 0.3} />)}
  </Svg>),
  // Môi hôn + tim nhỏ bay
  kiss_line: ({size, c, local}) => { const k = cyc(local, 30);
    return (<Svg size={size} local={local}>
      <path d="M12 54 Q28 32 41 41 Q50 34 59 41 Q72 32 88 54 Q72 78 50 78 Q28 78 12 54 Z" {...ln(c)} />
      <path d="M12 54 Q50 61 88 54" {...ln(c, 3.5)} />
      <path d={HEART} transform={`translate(${68 + k * 6} ${14 - k * 10}) scale(0.2)`} fill={PINK} stroke={c} strokeWidth={4 / 0.2} opacity={1 - k * 0.6} />
    </Svg>); },
  broken_heart_line: ({size, c, local}) => { const g = cl(local / 12) * 5;
    return (<Svg size={size} local={local}>
      <path d="M50,20 C46,12 38,7 29,7 C16,7 6,16 6,30 C6,48 22,64 50,84 L44,66 L54,50 L44,36 Z" transform={`translate(${-g} 0) rotate(${-g} 50 84)`} {...ln(c)} />
      <path d="M50,20 C54,12 62,7 71,7 C84,7 94,16 94,30 C94,48 78,64 50,84 L44,66 L54,50 L44,36 Z" transform={`translate(${g} 0) rotate(${g} 50 84)`} {...ln(c)} />
    </Svg>); },
  // Mắt lấp lánh (mê quá, đặt đúng 2 mắt hoặc cạnh mặt)
  sparkle_eyes: ({size, c, local}) => (<Svg size={size} local={local} vh={60}>
    {[28, 72].map((x, i) => <path key={i} d={SPARK4} transform={`translate(${x} 30) rotate(${local * 3}) scale(${1.9 + 0.35 * Math.sin(local / 3)})`}
      {...ln(c, 2.2)} fill={YEL} />)}
    <path d={SPARK4} transform={`translate(50 8) scale(${0.5 + 0.2 * Math.sin(local / 2)})`} {...ln(c, 3)} />
  </Svg>),
  // Tim đập thình thịch
  heart_beat: ({size, c, local}) => { const s = 1 + 0.13 * Math.max(0, Math.sin(local / 2.5));
    return (<Svg size={size} local={local}>
      <g transform={`translate(50 46) scale(${s}) translate(-50 -46)`}><path d={HEART} transform="translate(15 14) scale(0.7)" {...ln(c, 4.5 / 0.7)} /></g>
      <path d="M8 22 L16 28 M92 22 L84 28 M4 50 L13 50 M96 50 L87 50" {...ln(c, 3.5)} opacity={0.4 + 0.6 * Math.max(0, Math.sin(local / 2.5))} />
    </Svg>); },
  // Vạch giật mình tỏa quanh đỉnh đầu (đặt trên đầu bé)
  shock_lines: ({size, c, local}) => (<Svg size={size} local={local} vh={80}>
    {Array.from({length: 7}, (_, i) => { const a = (200 + i * 23.3) * Math.PI / 180; const r1 = 30, r2 = 44 + (i % 2 ? 0 : 7) * Math.abs(Math.sin(local / 2));
      return <path key={i} d={`M${50 + Math.cos(a) * r1} ${72 + Math.sin(a) * r1} L${50 + Math.cos(a) * r2} ${72 + Math.sin(a) * r2}`} {...ln(c, 4.5)} />; })}
  </Svg>),
  peace_hand: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${Math.sin(local / 4) * 8} 50 92)`}>
      <path d="M34 92 Q26 78 30 64 L30 57 Q30 51 36 51 L38 51 L30 17 Q29 10 35 9 Q41 9 42 15 L48 46 L54 13 Q55 7 61 8 Q66 9 65 15 L59 51 Q66 51 68 56 Q72 52 76 56 Q80 61 76 71 Q72 88 60 92 Z" {...ln(c)} />
      <path d="M38 51 Q45 53 48 59 M59 51 Q63 56 68 57" {...ln(c, 3)} />
    </g></Svg>),
  thumbs_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateY(${-Math.abs(Math.sin(local / 4)) * 5}px)`}>
    <path d="M30 46 L44 46 L50 22 Q52 12 60 14 Q66 16 64 26 L60 42 L80 42 Q88 44 86 52 Q84 56 80 58 Q86 60 84 66 Q82 70 78 70 Q82 74 78 80 Q74 86 66 86 L30 86 Z" {...ln(c)} />
    <path d="M30 46 L30 86 L16 86 L16 46 Z" {...ln(c)} />
    <path d="M80 58 L68 58 M78 70 L66 70" {...ln(c, 3)} />
  </Svg>),
  // Ngón tay chỉ sang phải (flip để chỉ sang trái)
  point_hand: ({size, c, local}) => (<Svg size={size} local={local} extra={`translateX(${Math.sin(local / 3) * 5}px)`}>
    <path d="M10 40 L22 40 Q30 34 40 34 L84 34 Q92 34 92 41 Q92 48 84 48 L58 48 Q64 50 64 56 Q64 62 58 62 Q64 64 62 70 Q60 74 54 74 Q58 78 54 82 Q50 86 44 86 L32 86 Q24 86 22 80 L10 80 Z" {...ln(c)} />
    <path d="M58 48 L46 48 M58 62 L46 62 M54 74 L44 74" {...ln(c, 3)} />
  </Svg>),

  // ================= THÚ LÓ RA =================
  pig_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M27 31 L22 13 L41 25" {...ln(c)} /><path d="M73 31 L78 13 L59 25" {...ln(c)} />
    <path d="M20 52 Q20 26 50 26 Q80 26 80 52 Q80 76 50 76 Q20 76 20 52 Z" {...ln(c)} />
    <path d="M33 44 Q37 39 41 44 M59 44 Q63 39 67 44" {...ln(c, 4)} />
    <ellipse cx="50" cy="57" rx="12" ry="8" {...ln(c, 4)} fill={PINK} fillOpacity={0.5} />
    <ellipse cx="45" cy="57" rx="2" ry="3" fill={c} /><ellipse cx="55" cy="57" rx="2" ry="3" fill={c} />
    <ellipse cx="28" cy="58" rx="5" ry="3" fill={PINK} opacity={0.85} /><ellipse cx="72" cy="58" rx="5" ry="3" fill={PINK} opacity={0.85} />
    <Paws c={c} /></Svg>),
  duck_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M47 26 Q44 13 52 11 M51 25 Q55 15 62 16" {...ln(c, 3.5)} />
    <path d="M22 54 Q22 24 50 24 Q78 24 78 54 Q78 76 50 76 Q22 76 22 54 Z" {...ln(c)} />
    <path d="M33 46 Q37 41 41 46 M59 46 Q63 41 67 46" {...ln(c, 4)} />
    <path d="M38 57 Q50 48 62 57 Q50 67 38 57 Z" fill={YEL} stroke={c} strokeWidth={3.5} />
    <ellipse cx="29" cy="58" rx="5" ry="3" fill={PINK} opacity={0.85} /><ellipse cx="71" cy="58" rx="5" ry="3" fill={PINK} opacity={0.85} />
    <Paws c={c} /></Svg>),
  // Gà con ló khỏi vỏ trứng
  chick_peek: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 4) * 5}deg)`}>
    <path d="M48 22 Q46 11 53 9" {...ln(c, 3.5)} />
    <path d="M25 52 Q22 22 50 22 Q78 22 75 52" {...ln(c)} />
    <circle cx="40" cy="38" r="3.3" fill={c} /><circle cx="60" cy="38" r="3.3" fill={c} />
    <path d="M45 44 L55 44 L50 51 Z" fill={YEL} stroke={c} strokeWidth={2.5} strokeLinejoin="round" />
    <ellipse cx="33" cy="47" rx="4.5" ry="2.6" fill={PINK} opacity={0.85} /><ellipse cx="67" cy="47" rx="4.5" ry="2.6" fill={PINK} opacity={0.85} />
    <path d="M20 52 L29 60 L38 51 L46 60 L54 51 L62 60 L71 51 L80 58 L79 70 Q76 88 50 88 Q24 88 21 70 Z" {...ln(c)} />
  </Svg>),
  panda_peek: ({size, c, local}) => (<Svg size={size} local={local}>
    <circle cx="26" cy="28" r="9" fill={c} /><circle cx="74" cy="28" r="9" fill={c} />
    <path d="M22 50 Q22 24 50 24 Q78 24 78 50 Q78 76 50 76 Q22 76 22 50 Z" {...ln(c)} />
    <ellipse cx="37" cy="48" rx="7.5" ry="10" transform="rotate(-30 37 48)" fill={c} />
    <ellipse cx="63" cy="48" rx="7.5" ry="10" transform="rotate(30 63 48)" fill={c} />
    <circle cx="38" cy="47" r="2.6" fill={INK} /><circle cx="62" cy="47" r="2.6" fill={INK} />
    <ellipse cx="50" cy="59" rx="4" ry="3" fill={c} /><path d="M45 65 Q50 69 55 65" {...ln(c, 3)} />
    <Paws c={c} /></Svg>),
  // Chân mèo (đệm thịt hồng) — dập dập
  cat_paw: ({size, c, local}) => (<Svg size={size} local={local} extra={`scale(${1 - 0.08 * Math.abs(Math.sin(local / 4))})`}>
    <path d="M28 70 Q28 50 50 50 Q72 50 72 70 Q72 87 50 85 Q28 87 28 70 Z" {...ln(c)} />
    <ellipse cx="50" cy="70" rx="12" ry="8" fill={PINK} opacity={0.8} />
    {[[20, 44, -25], [37, 28, -10], [63, 28, 10], [80, 44, 25]].map(([x, y, r], i) =>
      <ellipse key={i} cx={x} cy={y} rx={7} ry={9.5} transform={`rotate(${r} ${x} ${y})`} {...ln(c, 4)} fill={PINK} fillOpacity={0.6} />)}
  </Svg>),
  // Dấu chân thú đi chéo (hiện lần lượt)
  paw_prints: ({size, c, local}) => (<Svg size={size} local={local}>
    {[[22, 82], [44, 64], [54, 40], [77, 22]].map(([x, y], i) => (
      <g key={i} transform={`translate(${x} ${y}) rotate(${i % 2 ? 30 : 10}) scale(0.9)`} opacity={local >= i * 6 ? 1 : 0}>
        <ellipse cx="0" cy="5" rx="8" ry="7" fill={c} />
        {[[-9, -5], [-3.5, -10], [3.5, -10], [9, -5]].map(([tx, ty], j) => <circle key={j} cx={tx} cy={ty} r={3.3} fill={c} />)}
      </g>))}
  </Svg>),
  fish_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${Math.sin(local / 3) * 6} 50 50)`}>
      <path d="M16 50 Q34 24 62 34 Q72 38 76 50 Q72 62 62 66 Q34 76 16 50 Z" {...ln(c)} />
      <path d="M76 50 L94 36 L92 64 Z" {...ln(c)} />
      <circle cx="31" cy="46" r="3.3" fill={c} /><path d="M44 40 Q50 50 44 60" {...ln(c, 3)} />
    </g>
    {[0, 1].map((i) => { const k = cyc(local, 30, i * 15);
      return <circle key={i} cx={10 + i * 4} cy={36 - k * 26} r={3 + i * 1.5} {...ln(c, 2.5)} opacity={1 - k} />; })}
  </Svg>),

  // ================= EM BÉ & TRANG TRÍ =================
  bottle_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${-15 + Math.sin(local / 5) * 6}deg)`}>
    <path d="M43 20 L44 10 Q50 2 56 10 L57 20" {...ln(c, 4)} />
    <path d="M36 20 L64 20 L64 28 L36 28 Z" {...ln(c, 4)} />
    <path d="M38 28 L62 28 Q68 32 68 40 L68 86 Q68 92 62 92 L38 92 Q32 92 32 86 L32 40 Q32 32 38 28 Z" {...ln(c)} />
    <path d="M33 50 Q50 46 67 50" {...ln(c, 3)} />
    <path d="M32 62 L42 62 M32 72 L42 72 M32 82 L42 82" {...ln(c, 3)} />
  </Svg>),
  // Bàn chân em bé
  footprint_line: ({size, c, local}) => {
    const foot = (x: number, y: number, r: number, fx: number, k: number, show: boolean) => (
      <g key={k} transform={`translate(${x} ${y}) rotate(${r}) scale(${fx} 1)`} opacity={show ? 1 : 0}>
        <path d="M0 24 Q-11 24 -11 8 Q-13 -12 0 -14 Q13 -14 11 6 Q11 24 0 24 Z" {...ln(c, 4)} />
        {[[-9, -19, 2.3], [-4, -23, 2.6], [1.5, -24.5, 2.8], [7, -23, 3.1], [13, -18, 3.8]].map(([tx, ty, tr], j) =>
          <circle key={j} cx={tx} cy={ty} r={tr} fill={c} />)}
      </g>);
    return (<Svg size={size} local={local}>{foot(32, 68, -14, -1, 0, true)}{foot(68, 40, 14, 1, 1, local >= 8)}</Svg>);
  },
  balloon_line: ({size, c, local}) => (<Svg size={size} local={local} vh={110}>
    <g transform={`translate(0 ${Math.sin(local / 8) * 4}) rotate(${Math.sin(local / 10) * 6} 50 74)`}>
      <path d="M50 70 Q22 60 24 34 Q28 8 50 8 Q72 8 76 34 Q78 60 50 70 Z" {...ln(c)} />
      <path d="M45 75 L55 75 L50 69 Z" {...ln(c, 3)} />
      <path d="M50 75 Q43 85 52 91 Q59 97 50 106" {...ln(c, 3)} />
      <path d="M36 28 Q39 19 47 16" {...ln(c, 3.5)} />
    </g></Svg>),
  ribbon_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 5) * 5}deg)`}>
    <path d="M46 56 Q40 72 32 88 M54 56 Q60 72 68 88" {...ln(c, 4)} />
    <path d="M50 48 Q30 24 14 30 Q6 48 14 66 Q30 72 50 48 Z" {...ln(c)} />
    <path d="M50 48 Q70 24 86 30 Q94 48 86 66 Q70 72 50 48 Z" {...ln(c)} />
    <path d="M22 42 Q30 46 37 48 M78 42 Q70 46 63 48" {...ln(c, 3)} />
    <ellipse cx="50" cy="48" rx="7" ry="9" fill={PINK} stroke={c} strokeWidth={4} />
  </Svg>),
  // Bong bóng thoại nét trắng — chữ lấy từ "text"
  bubble_line: ({size, c, local, text}) => (
    <div style={{...SHD, position: 'relative', display: 'inline-block', transform: boil(local, 0.6)}}>
      <div style={{border: `${Math.max(3, size * 0.035)}px solid ${c}`, borderRadius: size * 0.4, padding: `${size * 0.1}px ${size * 0.22}px`,
        minWidth: size * 0.7, fontFamily: 'Hand, Emo', fontSize: size * 0.3, color: c, textAlign: 'center',
        whiteSpace: 'pre', lineHeight: 1.1}}>{text ?? ''}</div>
      <svg width={size * 0.3} height={size * 0.28} viewBox="0 0 30 28" style={{position: 'absolute', left: size * 0.2, bottom: -size * 0.24, overflow: 'visible'}}>
        <path d="M2 0 Q4 16 0 27 Q15 18 22 0" fill="none" stroke={c} strokeWidth={Math.max(3, size * 0.035) * 30 / (size * 0.3)} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>),
  // Bong bóng suy nghĩ (đám mây + chấm tròn) — chữ lấy từ "text"
  bubble_think: ({size, c, local, text}) => (
    <div style={{...SHD, position: 'relative', width: size * 1.4, height: size * 1.05, transform: boil(local, 0.6)}}>
      <svg width={size * 1.4} height={size * 1.05} viewBox="0 0 140 105" style={{position: 'absolute', left: 0, top: 0, overflow: 'visible'}}>
        <path d="M30 70 Q8 70 10 52 Q10 36 28 36 Q30 14 56 14 Q74 6 88 18 Q108 10 120 28 Q136 34 132 52 Q134 70 112 72 Q100 84 78 76 Q60 86 46 74 Q38 76 30 70 Z" {...ln(c, 4)} />
        <circle cx="26" cy="86" r="6" {...ln(c, 3.5)} /><circle cx="13" cy="99" r="3.5" {...ln(c, 3)} />
      </svg>
      <div style={{position: 'absolute', left: size * 0.12, right: size * 0.08, top: size * 0.18, height: size * 0.5, display: 'flex',
        alignItems: 'center', justifyContent: 'center', fontFamily: 'Hand, Emo', fontSize: size * 0.26, color: c, textAlign: 'center',
        whiteSpace: 'pre', lineHeight: 1.05}}>{text ?? ''}</div>
    </div>),
  cloud_line: ({size, c, local}) => (<Svg size={size} local={local} vh={80} extra={`translateX(${Math.sin(local / 12) * 6}px)`}>
    <path d="M24 64 Q8 64 10 50 Q12 38 26 40 Q26 22 44 22 Q58 20 62 34 Q68 26 78 30 Q90 34 88 46 Q96 52 90 60 Q86 66 76 64 Z" {...ln(c)} />
    <path d="M38 48 Q41 45 44 48 M56 48 Q59 45 62 48 M46 54 Q50 58 54 54" {...ln(c, 3)} />
  </Svg>),
  moon_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M58 10 Q32 18 32 48 Q32 78 62 86 Q36 94 20 72 Q6 46 22 24 Q36 6 58 10 Z" {...ln(c)} />
    <path d="M22 50 Q26 54 30 50" {...ln(c, 3)} />
    <path d={STAR} transform={`translate(74 30) scale(${1.2 + 0.3 * Math.sin(local / 4)})`} {...ln(c, 2.4)} />
    <path d={STAR} transform={`translate(82 64) scale(${0.8 + 0.25 * Math.sin(local / 4 + 2)})`} {...ln(c, 3)} />
  </Svg>),
  rainbow_line: ({size, c, local}) => (<Svg size={size} local={local} vh={80}>
    {[38, 29, 20].map((r, i) => <path key={i} d={`M${50 - r} 66 A${r} ${r} 0 0 1 ${50 + r} 66`} {...ln(c, 4)} {...drawn(cl((local - i * 3) / 10))} />)}
    <path d="M4 68 Q4 58 14 60 Q18 52 26 58 Q32 60 30 68 Z" {...ln(c, 3.5)} />
    <path d="M70 68 Q70 58 80 60 Q84 52 92 58 Q98 60 96 68 Z" {...ln(c, 3.5)} />
  </Svg>),
  leaf_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <g transform={`rotate(${Math.sin(local / 6) * 10} 30 82)`}>
      <path d="M30 82 L22 94" {...ln(c)} />
      <path d="M30 82 Q18 40 50 20 Q80 6 86 14 Q90 40 70 64 Q52 84 30 82 Z" {...ln(c)} />
      <path d="M30 82 Q52 52 80 18" {...ln(c, 3.5)} />
      <path d="M46 60 L42 46 M57 46 L55 32 M52 54 L66 56 M63 41 L75 43" {...ln(c, 3)} />
    </g></Svg>),
  // 1 trái tim tự vẽ rồi đập nhẹ
  heart_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`scale(${local > 14 ? 1 + 0.06 * Math.sin(local / 3) : 1})`}>
    <path d={HEART} transform="translate(8 6) scale(0.84)" {...ln(c, 5 / 0.84)} {...drawn(cl(local / 14))} />
  </Svg>),
  // Lấp lánh 4 cánh (rất hay dùng: cạnh mặt bé, món ăn)
  sparkle4_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d={SPARK4} transform={`translate(44 54) scale(${2.8 + 0.5 * Math.sin(local / 3)})`} {...ln(c, 1.5)} />
    <path d={SPARK4} transform={`translate(80 22) scale(${1.1 + 0.4 * Math.sin(local / 3 + 2)})`} {...ln(c, 3)} />
    <path d={SPARK4} transform={`translate(84 74) scale(${0.6 + 0.3 * Math.sin(local / 3 + 4)})`} {...ln(c, 4)} />
  </Svg>),
  // Mũi tên cong vẽ tay (rotate/flip để đổi hướng)
  arrow_curve_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M14 14 Q18 70 78 78" {...ln(c, 5)} {...drawn(cl(local / 10))} />
    <path d="M62 64 L80 78 L62 90" {...ln(c, 5)} opacity={local >= 9 ? 1 : 0} />
  </Svg>),
  // Vòng khoanh vẽ tay (quanh món, giá tiền)
  circle_scribble: ({size, c, local}) => (<Svg size={size} local={local} vw={140} vh={90}>
    <path d="M72 12 Q130 14 128 46 Q124 80 66 80 Q12 78 12 46 Q14 14 76 13 Q102 13 116 22" {...ln(c, 4.5)} {...drawn(cl(local / 14))} />
  </Svg>),
  underline_wave: ({size, c, local}) => (<Svg size={size} local={local} vw={140} vh={30}>
    <path d="M6 16 Q20 4 34 16 Q48 28 62 16 Q76 4 90 16 Q104 28 118 16 Q126 10 134 14" {...ln(c, 4.5)} {...drawn(cl(local / 12))} />
  </Svg>),
  pacifier_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 5) * 8}deg)`}>
    <circle cx="50" cy="26" r="15" {...ln(c)} />
    <path d="M42 64 Q42 86 50 86 Q58 86 58 64" {...ln(c)} />
    <path d="M18 52 Q18 40 50 40 Q82 40 82 52 Q82 66 50 66 Q18 66 18 52 Z" {...ln(c)} />
    <ellipse cx="50" cy="53" rx="7" ry="6" fill={PINK} stroke={c} strokeWidth={3} />
  </Svg>),
  house_line: ({size, c, local}) => (<Svg size={size} local={local}>
    {[0, 1].map((i) => { const k = cyc(local, 30, i * 15);
      return <circle key={i} cx={70 + k * 6} cy={12 - k * 10} r={3 + k * 4} {...ln(c, 3)} opacity={1 - k} />; })}
    <path d="M66 30 L66 18 L74 18 L74 36" {...ln(c, 4)} />
    <path d="M12 48 L50 16 L88 48" {...ln(c)} />
    <path d="M22 41 L22 86 L78 86 L78 41" {...ln(c)} />
    <path d="M42 86 L42 64 L58 64 L58 86" {...ln(c)} />
    <path d={HEART} transform="translate(43 45) scale(0.14)" fill={PINK} stroke={c} strokeWidth={3 / 0.14} />
  </Svg>),
  umbrella_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 6) * 5}deg)`}>
    {[8, 92].map((x, i) => { const k = cyc(local, 20, i * 10);
      return <path key={i} d={DROP} transform={drop(x, 40 + k * 46, 0, 0.8)} {...ln(c, 3)} opacity={1 - k} />; })}
    <path d="M50 12 L50 6" {...ln(c, 4)} />
    <path d="M10 50 Q14 14 50 12 Q86 14 90 50 Q80 42 70 50 Q60 42 50 50 Q40 42 30 50 Q20 42 10 50 Z" {...ln(c)} />
    <path d="M50 50 L50 84 Q50 92 42 92 Q36 92 36 86" {...ln(c)} />
  </Svg>),
  gift_line: ({size, c, local}) => (<Svg size={size} local={local} extra={`rotate(${Math.sin(local / 2.5) * (Math.floor(local / 20) % 2 ? 0 : 6)}deg)`}>
    <path d="M50 34 Q34 10 26 22 Q22 32 50 34 Q78 32 74 22 Q66 10 50 34" {...ln(c, 4)} />
    <path d="M12 34 L88 34 L88 46 L12 46 Z" {...ln(c)} />
    <path d="M18 46 L82 46 L82 88 L18 88 Z" {...ln(c)} />
    <path d="M50 34 L50 88" {...ln(c)} />
  </Svg>),
  camera_line: ({size, c, local}) => { const flash = Math.floor(local / 12) % 3 === 0;
    return (<Svg size={size} local={local}>
      <path d="M12 34 L32 34 L38 24 L62 24 L68 34 L88 34 Q92 34 92 40 L92 80 Q92 86 86 86 L14 86 Q8 86 8 80 L8 40 Q8 34 12 34 Z" {...ln(c)} />
      <circle cx="50" cy="58" r="17" {...ln(c)} /><circle cx="50" cy="58" r="8" {...ln(c, 3)} />
      <rect x="74" y="42" width="8" height="5" rx="2" fill={c} />
      <path d="M84 16 L90 8 M92 22 L100 20 M76 12 L76 4" {...ln(c, 3.5)} opacity={flash ? 1 : 0} />
    </Svg>); },
  paper_plane_line: ({size, c, local}) => (<Svg size={size} local={local}>
    <path d="M36 66 Q18 76 22 94" {...ln(c, 3)} strokeDasharray="5 7" />
    <g transform={`translate(${Math.sin(local / 8) * 4} ${Math.cos(local / 8) * 3})`}>
      <path d="M92 12 L12 42 L40 52 Z" {...ln(c)} /><path d="M92 12 L40 52 L50 80 Z" {...ln(c)} />
      <path d="M40 52 L46 62" {...ln(c, 3)} />
    </g></Svg>),
};

// Thứ tự trong 2 trang ảnh mẫu: catalog_netve2 (ăn uống + cảm xúc), catalog_netve3 (thú + em bé/trang trí)
const ALL = Object.keys(DOODLES2);
export const DOODLE2_PAGES = [ALL.slice(0, ALL.indexOf('pig_peek')), ALL.slice(ALL.indexOf('pig_peek'))];
