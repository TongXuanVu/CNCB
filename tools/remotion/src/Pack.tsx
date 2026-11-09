import React from 'react';

// Gói sticker theo chủ đề (tự vẽ SVG, viền trắng kiểu sticker). Mỗi hàm nhận (size, color?, color2?, local, text?).
// Thêm loại mới: viết 1 hàm vào PACK + 1 dòng vào THEMES, rồi chạy tools/make_catalog.sh.
type P = {size: number; c?: string; c2?: string; local: number; text?: string};
const INK = '#4E342E';
const PINK = '#FF8FB1';
const SH: React.CSSProperties = {filter: 'drop-shadow(0 3px 3px rgba(0,0,0,0.25))', overflow: 'visible'};
const W = {stroke: '#fff', strokeWidth: 5, strokeLinejoin: 'round' as const};
const ln = (c: string, w = 5) => ({fill: 'none', stroke: c, strokeWidth: w, strokeLinecap: 'round' as const, strokeLinejoin: 'round' as const});
const Svg: React.FC<{size: number; vw?: number; style?: React.CSSProperties; children: React.ReactNode}> = ({size, vw = 100, style, children}) => (
  <svg width={size * vw / 100} height={size} viewBox={`0 0 ${vw} 100`} style={{...SH, ...style}}>{children}</svg>);
const Steam: React.FC<{local: number; x: number[]; y: number; c?: string}> = ({local, x, y, c = '#fff'}) => (<>
  {x.map((xx, i) => { const ph = ((local + i * 8) % 30) / 30;
    return <path key={i} d={`M${xx} ${y} q-6 -8 0 -16 q6 -8 0 -16`} {...ln(c, 4)} opacity={Math.sin(ph * Math.PI)} transform={`translate(0 ${-ph * 8})`} />; })}
</>);
const Blush = ({cx1 = 30, cx2 = 70, cy = 60}) => (<>
  <ellipse cx={cx1} cy={cy} rx="7" ry="4" fill={PINK} opacity={0.8} /><ellipse cx={cx2} cy={cy} rx="7" ry="4" fill={PINK} opacity={0.8} /></>);
const FaceBase: React.FC<{size: number; fill: string; children: React.ReactNode}> = ({size, fill, children}) => (
  <Svg size={size}><circle cx="50" cy="50" r="44" fill="#fff" /><circle cx="50" cy="50" r="38" fill={fill} />{children}</Svg>);

export const PACK: Record<string, (p: P) => React.ReactElement> = {
  // ===== Ăn uống =====
  bowl: ({size, c, local}) => (<Svg size={size}>
    <Steam local={local} x={[36, 50, 64]} y={40} />
    <ellipse cx="50" cy="52" rx="40" ry="10" fill="#FFE0B2" {...W} />
    <path d="M10 52 L90 52 Q88 88 50 90 Q12 88 10 52 Z" fill={c ?? '#F48FB1'} {...W} />
    <path d="M24 66 Q50 74 76 66" {...ln('#fff', 4)} opacity={0.8} />
    <rect x="38" y="88" width="24" height="6" rx="3" fill={c ?? '#F48FB1'} {...W} /></Svg>),
  drink: ({size, c, c2}) => (<Svg size={size}>
    <path d="M58 30 L74 4" {...ln(c2 ?? '#FF6F9C', 6)} />
    <path d="M24 28 L76 28 L68 94 L32 94 Z" fill={c ?? '#FFB74D'} {...W} />
    <path d="M24 28 L76 28 L74 40 L26 40 Z" fill="#FFFFFF" opacity={0.55} />
    <rect x="34" y="50" width="12" height="12" rx="2" fill="#fff" opacity={0.7} transform="rotate(12 40 56)" />
    <rect x="52" y="60" width="12" height="12" rx="2" fill="#fff" opacity={0.7} transform="rotate(-10 58 66)" />
    <circle cx="66" cy="28" r="9" fill="#AED581" {...W} /></Svg>),
  coffee: ({size, c, local}) => (<Svg size={size}>
    <Steam local={local} x={[38, 52]} y={34} />
    <path d="M70 48 Q88 48 86 62 Q84 76 68 74" {...ln('#fff', 12)} /><path d="M70 48 Q88 48 86 62 Q84 76 68 74" {...ln(c ?? '#8D6E63', 6)} />
    <rect x="20" y="38" width="52" height="54" rx="10" fill={c ?? '#8D6E63'} {...W} />
    <ellipse cx="46" cy="42" rx="22" ry="5" fill="#FFE0B2" />
    <path d="M38 64 Q46 56 54 64 Q46 76 38 64 Z" fill="#fff" opacity={0.85} /></Svg>),
  cake: ({size, c, local}) => (<Svg size={size}>
    <path d="M50 8 Q56 16 50 22 Q44 16 50 8 Z" fill="#FFB300" transform={`scale(1 ${1 + 0.15 * Math.sin(local / 2)})`} style={{transformOrigin: '50px 22px'}} />
    <rect x="47" y="22" width="6" height="16" rx="2" fill="#81D4FA" />
    <rect x="22" y="38" width="56" height="22" rx="6" fill={c ?? '#F8BBD0'} {...W} />
    <rect x="14" y="58" width="72" height="30" rx="7" fill="#FFF3E0" {...W} />
    <path d="M14 66 Q24 74 34 66 Q44 74 54 66 Q64 74 74 66 Q80 72 86 66" {...ln(c ?? '#F48FB1', 5)} />
    {[30, 50, 70].map((x) => <circle key={x} cx={x} cy={78} r="3.5" fill="#EF5350" />)}</Svg>),
  icecream: ({size, c, c2}) => (<Svg size={size}>
    <path d="M30 54 L50 96 L70 54 Z" fill="#FFCC80" {...W} />
    <path d="M36 60 L58 82 M46 56 L64 72 M62 58 L42 82" {...ln('#E0A060', 3)} />
    <circle cx="38" cy="46" r="16" fill={c2 ?? '#B2DFDB'} {...W} /><circle cx="62" cy="46" r="16" fill={c ?? '#F8BBD0'} {...W} />
    <circle cx="50" cy="30" r="16" fill="#FFF59D" {...W} /><circle cx="50" cy="14" r="5" fill="#EF5350" /></Svg>),
  utensils: ({size}) => (<Svg size={size} style={{}}>
    <g transform="rotate(-25 50 50)">
      <rect x="22" y="40" width="8" height="54" rx="4" fill="#ECEFF1" {...W} /><ellipse cx="26" cy="24" rx="12" ry="18" fill="#ECEFF1" {...W} /></g>
    <g transform="rotate(25 50 50)">
      <rect x="70" y="40" width="8" height="54" rx="4" fill="#ECEFF1" {...W} />
      <path d="M62 8 L62 34 Q62 44 74 44 Q86 44 86 34 L86 8" fill="#ECEFF1" {...W} />
      <path d="M70 8 L70 30 M78 8 L78 30" {...ln('#B0BEC5', 3)} /></g></Svg>),
  steam: ({size, c, local}) => (<Svg size={size} style={{filter: 'none'}}><Steam local={local} x={[30, 50, 70]} y={86} c={c ?? '#fff'} />
    <Steam local={local + 15} x={[40, 60]} y={70} c={c ?? '#fff'} /></Svg>),
  // ===== Đi chơi =====
  car: ({size, c, local}) => (<Svg size={size} vw={130} style={{transform: `translateY(${-Math.abs(Math.sin(local / 3)) * 2}px)`}}>
    <path d="M20 46 L38 22 L86 22 L104 46 Z" fill={c ?? '#4FC3F7'} {...W} />
    <path d="M44 28 L58 28 L58 44 L32 44 Z M64 28 L82 28 L96 44 L64 44 Z" fill="#E1F5FE" />
    <rect x="8" y="44" width="114" height="30" rx="12" fill={c ?? '#4FC3F7'} {...W} />
    <circle cx="110" cy="56" r="5" fill="#FFF59D" />
    {[34, 96].map((x) => (<g key={x} transform={`rotate(${local * 12} ${x} 76)`}>
      <circle cx={x} cy="76" r="14" fill="#37474F" {...W} /><circle cx={x} cy="76" r="5" fill="#CFD8DC" />
      <path d={`M${x - 9} 76 L${x + 9} 76`} {...ln('#CFD8DC', 2)} /></g>))}</Svg>),
  plane: ({size, c, local}) => (<Svg size={size} vw={130} style={{transform: `translateY(${Math.sin(local / 8) * 5}px) rotate(-8deg)`}}>
    <path d="M4 60 L30 60" {...ln('#fff', 4)} strokeDasharray="6 6" />
    <path d="M30 52 L104 46 Q124 50 104 60 L30 64 Q22 58 30 52 Z" fill={c ?? '#FFFFFF'} stroke="#90CAF9" strokeWidth={4} />
    <path d="M62 52 L48 22 L62 22 L82 50 Z" fill="#64B5F6" {...W} /><path d="M64 60 L52 86 L66 86 L82 58 Z" fill="#64B5F6" {...W} />
    <path d="M34 54 L26 38 L36 38 L44 52 Z" fill="#64B5F6" {...W} />
    {[70, 80, 90].map((x) => <circle key={x} cx={x} cy={53} r="3" fill="#42A5F5" />)}</Svg>),
  pin: ({size, c, local}) => (<Svg size={size} style={{transform: `translateY(${-Math.abs(Math.sin(local / 5)) * 8}px)`}}>
    <ellipse cx="50" cy="94" rx="14" ry="4" fill="rgba(0,0,0,0.25)" />
    <path d="M50 92 C50 92 18 58 18 38 A32 32 0 0 1 82 38 C82 58 50 92 50 92 Z" fill={c ?? '#FF5252'} {...W} />
    <circle cx="50" cy="38" r="12" fill="#fff" /></Svg>),
  camera: ({size, c, local}) => (<Svg size={size}>
    <rect x="34" y="18" width="24" height="12" rx="3" fill="#78909C" {...W} />
    <rect x="10" y="28" width="80" height="56" rx="12" fill={c ?? '#90A4AE'} {...W} />
    <circle cx="50" cy="56" r="20" fill="#455A64" {...W} /><circle cx="50" cy="56" r="10" fill="#80DEEA" />
    <circle cx="45" cy="51" r="3" fill="#fff" />
    <circle cx="76" cy="38" r="5" fill={(local % 30) < 3 ? '#FFFFFF' : '#FFEB3B'} /></Svg>),
  balloon: ({size, c, local}) => (<Svg size={size} style={{transform: `translateY(${Math.sin(local / 10) * 6}px) rotate(${Math.sin(local / 14) * 6}deg)`}}>
    <path d="M50 70 Q44 82 52 90 Q58 98 50 100" {...ln('#fff', 3)} />
    <ellipse cx="50" cy="38" rx="28" ry="34" fill={c ?? '#FF6F9C'} {...W} />
    <path d="M45 72 L55 72 L50 66 Z" fill={c ?? '#FF6F9C'} {...W} />
    <ellipse cx="38" cy="24" rx="6" ry="10" fill="#fff" opacity={0.6} transform="rotate(20 38 24)" /></Svg>),
  tree: ({size, c}) => (<Svg size={size}>
    <rect x="42" y="56" width="16" height="38" rx="5" fill="#8D6E63" {...W} />
    <circle cx="50" cy="38" r="30" fill={c ?? '#81C784'} {...W} />
    <circle cx="30" cy="52" r="16" fill={c ?? '#81C784'} /><circle cx="70" cy="52" r="16" fill={c ?? '#81C784'} />
    <circle cx="40" cy="30" r="6" fill="#A5D6A7" /><circle cx="62" cy="44" r="4" fill="#EF5350" /><circle cx="36" cy="50" r="4" fill="#EF5350" /></Svg>),
  // ===== Thời tiết =====
  rain: ({size, local}) => (<Svg size={size}>
    {[30, 50, 70].map((x, i) => { const y = 60 + (((local * 2) + i * 10) % 34);
      return <path key={x} d={`M${x} ${y} l-3 8`} {...ln('#64B5F6', 5)} />; })}
    <path d="M22 58 Q6 58 8 44 Q10 32 24 34 Q26 16 46 16 Q62 16 66 30 Q74 24 84 30 Q96 36 92 50 Q96 58 84 58 Z" fill="#B0BEC5" {...W} /></Svg>),
  rainbow: ({size}) => (<Svg size={size} vw={130}>
    {['#EF5350', '#FFB74D', '#FFF176', '#81C784', '#64B5F6', '#BA68C8'].map((col, i) => (
      <path key={col} d={`M${14 + i * 7} 80 A${51 - i * 7} ${51 - i * 7} 0 0 1 ${116 - i * 7} 80`} {...ln(col, 7)} />))}
    <ellipse cx="18" cy="82" rx="16" ry="10" fill="#fff" /><ellipse cx="112" cy="82" rx="16" ry="10" fill="#fff" /></Svg>),
  moon: ({size, c, local}) => (<Svg size={size}>
    <path d="M60 10 A40 40 0 1 0 90 66 A32 32 0 1 1 60 10 Z" fill={c ?? '#FFE082'} {...W} />
    <path d="M36 54 Q40 50 44 54" {...ln(INK, 3)} /><path d="M38 66 Q42 70 46 66" {...ln(INK, 3)} />
    <ellipse cx="30" cy="62" rx="5" ry="3" fill={PINK} />
    {[[80, 22], [88, 40]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r={3} fill="#fff" opacity={0.4 + 0.6 * Math.abs(Math.sin((local + i * 10) / 6))} />)}</Svg>),
  snow: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${local * 1.5}deg)`}}>
    {[0, 60, 120].map((a) => (<g key={a} transform={`rotate(${a} 50 50)`}>
      <path d="M50 8 L50 92 M50 20 L40 12 M50 20 L60 12 M50 80 L40 88 M50 80 L60 88" {...ln('#fff', 9)} />
      <path d="M50 8 L50 92 M50 20 L40 12 M50 20 L60 12 M50 80 L40 88 M50 80 L60 88" {...ln(c ?? '#81D4FA', 4)} /></g>))}</Svg>),
  umbrella: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 10) * 6}deg)`}}>
    <path d="M50 46 L50 84 Q50 94 40 92 Q34 90 36 84" {...ln('#fff', 10)} /><path d="M50 46 L50 84 Q50 94 40 92 Q34 90 36 84" {...ln('#8D6E63', 5)} />
    <path d="M8 48 Q10 12 50 10 Q90 12 92 48 Q82 40 71 48 Q60 40 50 48 Q40 40 29 48 Q18 40 8 48 Z" fill={c ?? '#BA68C8'} {...W} />
    <path d="M50 10 Q38 26 29 48 M50 10 Q62 26 71 48" {...ln('#fff', 2.5)} opacity={0.7} /></Svg>),
  // ===== Em bé & gia đình =====
  bottle: ({size, c}) => (<Svg size={size}>
    <path d="M42 6 Q50 0 58 6 L60 18 L40 18 Z" fill="#FFCC80" {...W} />
    <rect x="32" y="18" width="36" height="10" rx="4" fill={c ?? '#F48FB1'} {...W} />
    <rect x="30" y="28" width="40" height="64" rx="12" fill="#E3F2FD" {...W} />
    <rect x="34" y="48" width="32" height="40" rx="8" fill="#fff" />
    {[40, 52, 64].map((y) => <path key={y} d={`M58 ${y} L66 ${y}`} {...ln('#90CAF9', 3)} />)}
    <path d="M44 66 Q50 62 56 66" {...ln(PINK, 3)} /></Svg>),
  duck: ({size, c, local}) => (<Svg size={size} vw={110} style={{transform: `rotate(${Math.sin(local / 6) * 6}deg)`}}>
    <path d="M10 60 Q12 90 52 90 Q94 90 98 62 Q80 70 64 60 Z" fill={c ?? '#FFD54F'} {...W} />
    <circle cx="38" cy="42" r="22" fill={c ?? '#FFD54F'} {...W} />
    <path d="M14 42 Q4 46 14 52 L22 48 Z" fill="#FF8A65" {...W} />
    <circle cx="34" cy="36" r="3.5" fill={INK} /><ellipse cx="42" cy="48" rx="5" ry="3" fill={PINK} />
    <path d="M56 70 Q68 62 80 70" {...ln('#F9A825', 3)} /></Svg>),
  bear: ({size, c}) => (<Svg size={size}>
    <circle cx="22" cy="24" r="14" fill={c ?? '#A1887F'} {...W} /><circle cx="78" cy="24" r="14" fill={c ?? '#A1887F'} {...W} />
    <circle cx="22" cy="24" r="6" fill="#D7CCC8" /><circle cx="78" cy="24" r="6" fill="#D7CCC8" />
    <circle cx="50" cy="54" r="38" fill={c ?? '#A1887F'} {...W} />
    <ellipse cx="50" cy="66" rx="16" ry="12" fill="#D7CCC8" />
    <circle cx="36" cy="48" r="4" fill={INK} /><circle cx="64" cy="48" r="4" fill={INK} />
    <ellipse cx="50" cy="60" rx="5" ry="4" fill={INK} /><path d="M44 70 Q50 75 56 70" {...ln(INK, 3)} />
    <Blush cx1={26} cx2={74} cy={62} /></Svg>),
  crown: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 8) * 5}deg)`}}>
    <path d="M12 76 L8 30 L32 50 L50 18 L68 50 L92 30 L88 76 Z" fill={c ?? '#FFD54F'} {...W} />
    <rect x="12" y="74" width="76" height="12" rx="4" fill="#FFB300" {...W} />
    <circle cx="50" cy="56" r="7" fill="#EF5350" /><circle cx="30" cy="62" r="5" fill="#64B5F6" /><circle cx="70" cy="62" r="5" fill="#81C784" />
    {[[8, 30], [50, 18], [92, 30]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="5" fill="#fff" />)}</Svg>),
  bow: ({size, c}) => (<Svg size={size}>
    <path d="M50 50 L14 26 Q4 50 14 74 Z" fill={c ?? '#F48FB1'} {...W} /><path d="M50 50 L86 26 Q96 50 86 74 Z" fill={c ?? '#F48FB1'} {...W} />
    <path d="M44 56 L34 90 L44 84 L50 92 Z M56 56 L66 90 L56 84 L50 92 Z" fill={c ?? '#F48FB1'} {...W} />
    <circle cx="50" cy="50" r="10" fill="#EC407A" {...W} />
    {[[26, 44], [24, 58], [74, 44], [76, 58]].map(([x, y], i) => <circle key={i} cx={x} cy={y} r="2.5" fill="#fff" />)}</Svg>),
  house: ({size, c, local}) => (<Svg size={size}>
    <path d="M8 48 L50 12 L92 48 Z" fill={c ?? '#F48FB1'} {...W} />
    <rect x="18" y="44" width="64" height="48" rx="4" fill="#FFF3E0" {...W} />
    <rect x="42" y="64" width="16" height="28" rx="3" fill="#A1887F" />
    <g transform={`translate(32 60) scale(${0.12 * (1 + 0.1 * Math.sin(local / 4))}) translate(-50 -46)`}>
      <path d="M50,84 C22,64 6,48 6,30 C6,16 16,7 29,7 C38,7 46,12 50,20 C54,12 62,7 71,7 C84,7 94,16 94,30 C94,48 78,64 50,84 Z" fill="#EF5350" /></g>
    <rect x="62" y="52" width="12" height="12" rx="2" fill="#B3E5FC" /></Svg>),
  // ===== Lễ tết =====
  gift: ({size, c, c2, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 3) * (local < 20 ? 6 : 1)}deg)`}}>
    <path d="M50 30 Q34 6 26 18 Q20 30 50 30 Q80 30 74 18 Q66 6 50 30 Z" fill={c2 ?? '#FFD54F'} {...W} />
    <rect x="16" y="30" width="68" height="18" rx="4" fill={c ?? '#EF5350'} {...W} />
    <rect x="22" y="46" width="56" height="46" rx="4" fill={c ?? '#EF5350'} {...W} />
    <rect x="44" y="30" width="12" height="62" fill={c2 ?? '#FFD54F'} /></Svg>),
  popper: ({size, c, local}) => {
    const k = Math.min(1, local / 12);
    const bits = [[-30, -30, '#FF6F9C'], [-10, -42, '#FFD54F'], [12, -38, '#81D4FA'], [28, -22, '#CE93D8'], [-36, -8, '#A5D6A7'], [34, -4, '#FFB74D']];
    return (<Svg size={size}>
      {bits.map(([dx, dy, col], i) => <rect key={i} x={60 + (dx as number) * k} y={36 + (dy as number) * k} width="7" height="4" rx="1" fill={col as string}
        transform={`rotate(${local * 10 + i * 40} ${60 + (dx as number) * k} ${36 + (dy as number) * k})`} />)}
      <path d="M14 92 L44 30 L72 58 Z" fill={c ?? '#FFB74D'} {...W} />
      <path d="M26 68 L52 44 M20 80 L60 50" {...ln('#EF5350', 4)} />
      <ellipse cx="58" cy="44" rx="20" ry="8" transform="rotate(45 58 44)" fill="#FFE0B2" {...W} /></Svg>);
  },
  lantern: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 8) * 6}deg)`, transformOrigin: '50% 0%'}}>
    <path d="M50 0 L50 12" {...ln('#FFD54F', 3)} />
    <rect x="36" y="12" width="28" height="8" rx="2" fill="#FFB300" {...W} />
    <ellipse cx="50" cy="48" rx="34" ry="30" fill={c ?? '#E53935'} {...W} />
    <path d="M50 18 Q30 48 50 78 M50 18 Q70 48 50 78" {...ln('#FFCDD2', 2.5)} opacity={0.7} />
    <rect x="36" y="76" width="28" height="8" rx="2" fill="#FFB300" {...W} />
    <path d="M44 84 L42 98 M50 84 L50 100 M56 84 L58 98" {...ln('#FFB300', 3)} />
    <text x="50" y="56" textAnchor="middle" fontFamily="Round" fontWeight={800} fontSize="20" fill="#FFD54F">Phúc</text></Svg>),
  star_lantern: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 8) * 8}deg)`}}>
    <path d="M78 66 L98 98" {...ln('#fff', 8)} /><path d="M78 66 L98 98" {...ln('#8D6E63', 4)} />
    <path d="M50,6 L61,36 L94,36 L67,55 L77,88 L50,68 L23,88 L33,55 L6,36 L39,36 Z" fill={c ?? '#EF5350'} {...W} />
    <path d="M50,24 L56,40 L72,40 L59,50 L64,66 L50,56 L36,66 L41,50 L28,40 L44,40 Z" fill="#FFEB3B" opacity={0.6 + 0.4 * Math.abs(Math.sin(local / 5))} />
    <path d="M40 88 L38 98 M60 88 L62 98" {...ln('#FFD54F', 3)} /></Svg>),
  xmas_tree: ({size, local}) => (<Svg size={size}>
    <rect x="44" y="80" width="12" height="14" fill="#8D6E63" {...W} />
    <path d="M50 14 L82 82 L18 82 Z" fill="#66BB6A" {...W} />
    <path d="M50 14 L74 56 L26 56 Z" fill="#81C784" />
    {[[40, 60, '#EF5350'], [60, 70, '#FFD54F'], [50, 44, '#64B5F6'], [34, 76, '#CE93D8'], [66, 52, '#EF5350']].map(([x, y, col], i) =>
      <circle key={i} cx={x as number} cy={y as number} r="4.5" fill={col as string} opacity={0.6 + 0.4 * Math.abs(Math.sin((local + i * 7) / 5))} />)}
    <path d="M50,2 L54,11 L64,11 L56,17 L59,26 L50,20 L41,26 L44,17 L36,11 L46,11 Z" fill="#FFD54F" {...W} strokeWidth={3} /></Svg>),
  firework: ({size, c, local}) => {
    const k = (local % 36) / 36;
    const cols = [c ?? '#FF6F9C', '#FFD54F', '#81D4FA', '#CE93D8'];
    return (<Svg size={size} style={{filter: 'drop-shadow(0 0 4px rgba(255,255,255,0.7))'}}>
      {Array.from({length: 12}, (_, i) => { const a = (i / 12) * Math.PI * 2; const r1 = 8 + k * 30, r2 = 14 + k * 38;
        return <path key={i} d={`M${50 + Math.cos(a) * r1} ${50 + Math.sin(a) * r1} L${50 + Math.cos(a) * r2} ${50 + Math.sin(a) * r2}`}
          {...ln(cols[i % 4], 5)} opacity={1 - k * 0.8} />; })}
      <circle cx="50" cy="50" r={4 * (1 - k)} fill="#fff" /></Svg>);
  },
  // ===== Tiền & khen =====
  coin: ({size, c, local}) => (<Svg size={size} style={{transform: `scaleX(${Math.max(0.2, Math.abs(Math.cos(local / 6)))})`}}>
    <circle cx="50" cy="50" r="40" fill={c ?? '#FFC107'} {...W} /><circle cx="50" cy="50" r="30" fill="none" stroke="#FFE082" strokeWidth={4} />
    <text x="50" y="64" textAnchor="middle" fontFamily="Round" fontWeight={800} fontSize="40" fill="#F57F17">đ</text></Svg>),
  cash: ({size, c, text, local}) => (<Svg size={size} vw={140} style={{transform: `rotate(${Math.sin(local / 6) * 5}deg)`}}>
    <rect x="12" y="22" width="116" height="60" rx="8" fill={c ?? '#81C784'} {...W} />
    <rect x="22" y="32" width="96" height="40" rx="5" fill="none" stroke="#C8E6C9" strokeWidth={3} />
    <text x="70" y="62" textAnchor="middle" fontFamily="Round" fontWeight={800} fontSize="28" fill="#1B5E20">{text ?? '200k'}</text></Svg>),
  pricetag: ({size, c, text}) => (<Svg size={size} vw={140} style={{transform: 'rotate(-10deg)'}}>
    <path d="M30 20 L124 20 Q130 20 130 26 L130 74 Q130 80 124 80 L30 80 L6 50 Z" fill={c ?? '#FFD54F'} {...W} />
    <circle cx="26" cy="50" r="6" fill="#fff" />
    <text x="80" y="62" textAnchor="middle" fontFamily="Round" fontWeight={800} fontSize="30" fill="#D84315">{text ?? 'SALE'}</text></Svg>),
  like: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${-Math.abs(Math.sin(local / 5)) * 10}deg)`}}>
    <rect x="10" y="44" width="18" height="46" rx="4" fill="#64B5F6" {...W} />
    <path d="M30 46 L46 18 Q54 10 58 20 L54 40 L82 40 Q92 42 88 54 L82 82 Q78 90 68 90 L30 90 Z" fill={c ?? '#FFD54F'} {...W} />
    <path d="M58 56 L84 56 M58 70 L80 70" {...ln('#F9A825', 3)} /></Svg>),
  check: ({size, c, local}) => (<Svg size={size}>
    <circle cx="50" cy="50" r="40" fill={c ?? '#66BB6A'} {...W} />
    <path d="M30 52 L44 66 L72 36" {...ln('#fff', 9)} pathLength={1} strokeDasharray={1} strokeDashoffset={1 - Math.min(1, local / 15)} /></Svg>),
  fire: ({size, c, local}) => (<Svg size={size} style={{transform: `scale(${1 + 0.05 * Math.sin(local / 2)}, ${1 + 0.07 * Math.sin(local / 3)})`, transformOrigin: '50% 100%'}}>
    <path d="M50 96 Q16 92 18 62 Q20 40 38 24 Q36 44 48 48 Q44 22 62 6 Q62 30 76 42 Q90 58 82 76 Q76 94 50 96 Z" fill={c ?? '#FF7043'} {...W} />
    <path d="M50 90 Q32 86 34 70 Q36 58 46 50 Q48 64 58 66 Q66 72 64 80 Q62 90 50 90 Z" fill="#FFCA28" /></Svg>),
  // ===== Thêm mặt cảm xúc =====
  cool: ({size, c}) => (<FaceBase size={size} fill={c ?? '#FFD54F'}>
    <path d="M18 40 L82 40 L78 52 Q74 58 62 56 L56 46 L44 46 L38 56 Q26 58 22 52 Z" fill="#263238" />
    <path d="M26 44 L34 44" {...ln('#fff', 2.5)} opacity={0.7} /><path d="M62 44 L70 44" {...ln('#fff', 2.5)} opacity={0.7} />
    <path d="M38 68 Q52 76 64 64" {...ln(INK, 4.5)} /></FaceBase>),
  think: ({size, c, local}) => (<FaceBase size={size} fill={c ?? '#FFD54F'}>
    <path d="M28 34 L40 30" {...ln(INK, 3.5)} /><path d="M60 28 Q66 24 72 30" {...ln(INK, 3.5)} />
    <circle cx="36" cy="44" r="5" fill={INK} /><circle cx="64" cy="42" r="5" fill={INK} />
    <circle cx="38" cy="42" r="1.8" fill="#fff" /><circle cx="66" cy="40" r="1.8" fill="#fff" />
    <path d="M40 66 L60 64" {...ln(INK, 4.5)} />
    {[0, 1, 2].map((i) => <circle key={i} cx={78 + i * 9} cy={22 - i * 8} r={3 + i} fill="#fff" opacity={(local / 8) % 3 >= i ? 1 : 0.2} />)}</FaceBase>),
  angry_face: ({size, c, local}) => (<FaceBase size={size} fill={c ?? '#FF8A65'}>
    <g transform={`translate(${Math.sin(local * 1.5) * 1.5} 0)`}>
      <path d="M26 34 L42 42" {...ln(INK, 5)} /><path d="M74 34 L58 42" {...ln(INK, 5)} />
      <circle cx="36" cy="50" r="4.5" fill={INK} /><circle cx="64" cy="50" r="4.5" fill={INK} />
      <path d="M36 72 Q50 62 64 72" {...ln(INK, 5)} /></g></FaceBase>),
  sleepy: ({size, c, local}) => (<FaceBase size={size} fill={c ?? '#FFD54F'}>
    <path d="M26 46 Q34 52 42 46" {...ln(INK, 4.5)} /><path d="M58 46 Q66 52 74 46" {...ln(INK, 4.5)} />
    <ellipse cx="50" cy="68" rx="6" ry="4" fill={INK} />
    <circle cx="66" cy="62" r={4 + 6 * Math.abs(Math.sin(local / 12))} fill="#B3E5FC" opacity={0.85} stroke="#fff" strokeWidth={1.5} />
    <Blush cx1={26} cx2={74} cy={58} /></FaceBase>),
  kiss: ({size, c, local}) => (<FaceBase size={size} fill={c ?? '#FFD54F'}>
    <path d="M28 46 Q34 40 40 46" {...ln(INK, 4)} /><circle cx="64" cy="44" r="4.5" fill={INK} />
    <path d="M50 58 Q58 62 52 66 Q58 70 50 74" {...ln(INK, 4)} />
    <g transform={`translate(${70 + Math.min(1, local / 20) * 10} ${66 - Math.min(1, local / 20) * 30}) scale(0.14) translate(-50 -46)`}>
      <path d="M50,84 C22,64 6,48 6,30 C6,16 16,7 29,7 C38,7 46,12 50,20 C54,12 62,7 71,7 C84,7 94,16 94,30 C94,48 78,64 50,84 Z" fill="#F0446C" /></g>
    <Blush cx1={26} cx2={74} cy={58} /></FaceBase>),
  // ===== Con vật =====
  dog: ({size, c, local}) => (<Svg size={size}>
    <ellipse cx="18" cy="44" rx="12" ry="24" fill="#8D6E63" {...W} transform={`rotate(${15 + Math.sin(local / 5) * 6} 18 30)`} />
    <ellipse cx="82" cy="44" rx="12" ry="24" fill="#8D6E63" {...W} transform={`rotate(${-15 - Math.sin(local / 5) * 6} 82 30)`} />
    <circle cx="50" cy="54" r="36" fill={c ?? '#FFE0B2'} {...W} />
    <circle cx="38" cy="48" r="4.5" fill={INK} /><circle cx="62" cy="48" r="4.5" fill={INK} />
    <ellipse cx="50" cy="62" rx="7" ry="5" fill={INK} />
    <path d="M42 70 Q50 76 58 70" {...ln(INK, 3)} /><path d="M50 72 Q50 84 56 82 Q60 78 56 72" fill="#FF6F91" />
    <Blush cx1={30} cx2={70} cy={62} /></Svg>),
  kitty: ({size, c}) => (<Svg size={size}>
    <path d="M16 46 L22 10 L44 28 Z M84 46 L78 10 L56 28 Z" fill={c ?? '#FFB74D'} {...W} />
    <path d="M22 18 L26 36 M78 18 L74 36" {...ln(PINK, 5)} />
    <circle cx="50" cy="56" r="36" fill={c ?? '#FFB74D'} {...W} />
    <path d="M42 24 L46 34 M50 22 L50 32 M58 24 L54 34" {...ln('#F57C00', 3)} />
    <circle cx="38" cy="54" r="4.5" fill={INK} /><circle cx="62" cy="54" r="4.5" fill={INK} />
    <path d="M47 62 L53 62 L50 66 Z" fill="#FF6F91" /><path d="M42 70 Q46 74 50 70 Q54 74 58 70" {...ln(INK, 3)} />
    <path d="M6 60 L26 62 M6 70 L26 68 M94 60 L74 62 M94 70 L74 68" {...ln('#fff', 2.5)} /></Svg>),
  bunny: ({size, c, local}) => (<Svg size={size}>
    <g transform={`rotate(${Math.sin(local / 6) * 5} 34 40)`}><ellipse cx="34" cy="22" rx="10" ry="24" fill={c ?? '#FFFFFF'} {...W} /><ellipse cx="34" cy="22" rx="5" ry="16" fill="#F8BBD0" /></g>
    <g transform={`rotate(${-Math.sin(local / 6) * 5} 66 40)`}><ellipse cx="66" cy="22" rx="10" ry="24" fill={c ?? '#FFFFFF'} {...W} /><ellipse cx="66" cy="22" rx="5" ry="16" fill="#F8BBD0" /></g>
    <circle cx="50" cy="62" r="32" fill={c ?? '#FFFFFF'} stroke="#F8BBD0" strokeWidth={4} />
    <circle cx="40" cy="58" r="4" fill={INK} /><circle cx="60" cy="58" r="4" fill={INK} />
    <path d="M46 68 L54 68 L50 72 Z" fill="#FF6F91" /><path d="M44 76 Q50 80 56 76" {...ln(INK, 3)} />
    <Blush cx1={30} cx2={70} cy={70} /></Svg>),
  chick: ({size, c, local}) => (<Svg size={size} style={{transform: `translateY(${-Math.abs(Math.sin(local / 4)) * 5}px)`}}>
    <path d="M44 16 Q48 4 54 14 Q60 6 58 18" {...ln(c ?? '#FFD54F', 5)} />
    <ellipse cx="50" cy="56" rx="38" ry="36" fill={c ?? '#FFD54F'} {...W} />
    <path d="M14 58 Q4 50 10 42 Q20 48 18 60 Z M86 58 Q96 50 90 42 Q80 48 82 60 Z" fill={c ?? '#FFD54F'} {...W} />
    <circle cx="38" cy="50" r="4.5" fill={INK} /><circle cx="62" cy="50" r="4.5" fill={INK} />
    <path d="M42 60 L58 60 L50 70 Z" fill="#FF8A65" {...W} strokeWidth={2} />
    <Blush cx1={28} cx2={72} cy={62} /></Svg>),
  // ===== Nhảy, hát, thể thao =====
  mic: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${-20 + Math.sin(local / 5) * 6}deg)`}}>
    <rect x="42" y="44" width="16" height="50" rx="7" fill="#37474F" {...W} />
    <circle cx="50" cy="30" r="22" fill={c ?? '#B0BEC5'} {...W} />
    <path d="M34 22 L66 38 M34 38 L66 22 M50 8 L50 52 M30 30 L70 30" {...ln('#78909C', 2)} />
    <rect x="40" y="46" width="20" height="6" rx="2" fill="#F48FB1" /></Svg>),
  ball: ({size, local}) => (<Svg size={size} style={{transform: `rotate(${local * 6}deg)`}}>
    <circle cx="50" cy="50" r="40" fill="#fff" {...W} />
    {['#EF5350', '#FFD54F', '#64B5F6'].map((col, i) => (
      <path key={col} d="M50 50 L50 10 A40 40 0 0 1 84.6 30 Z" fill={col} transform={`rotate(${i * 120} 50 50)`} />))}
    <circle cx="50" cy="50" r="40" fill="none" stroke="#fff" strokeWidth={5} /><circle cx="50" cy="50" r="7" fill="#fff" /></Svg>),
  medal: ({size, c, local}) => (<Svg size={size} style={{transform: `rotate(${Math.sin(local / 8) * 6}deg)`, transformOrigin: '50% 0%'}}>
    <path d="M30 4 L44 46 L56 46 L42 4 Z" fill="#64B5F6" {...W} /><path d="M70 4 L56 46 L44 46 L58 4 Z" fill="#EF5350" {...W} />
    <circle cx="50" cy="66" r="28" fill={c ?? '#FFC107'} {...W} />
    <path d="M50,48 L55,61 L69,61 L58,69 L62,83 L50,75 L38,83 L42,69 L31,61 L45,61 Z" fill="#FFF59D" /></Svg>),
};

// Nhóm theo chủ đề (dùng cho bảng mẫu + AGENT.md)
export const THEMES: [string, string[]][] = [
  ['Ăn uống', ['bowl', 'drink', 'coffee', 'cake', 'icecream', 'utensils', 'steam']],
  ['Đi chơi', ['car', 'plane', 'pin', 'camera', 'balloon', 'tree']],
  ['Thời tiết', ['rain', 'rainbow', 'moon', 'snow', 'umbrella']],
  ['Em bé & nhà', ['bottle', 'duck', 'bear', 'crown', 'bow', 'house']],
  ['Lễ tết', ['gift', 'popper', 'lantern', 'star_lantern', 'xmas_tree', 'firework']],
  ['Tiền & khen', ['coin', 'cash', 'pricetag', 'like', 'check', 'fire']],
  ['Mặt cảm xúc 2', ['cool', 'think', 'angry_face', 'sleepy', 'kiss']],
  ['Con vật', ['dog', 'kitty', 'bunny', 'chick']],
  ['Nhảy hát', ['mic', 'ball', 'medal']],
];
