import React from 'react';

// Ngôi sao 5 cánh có chấm, tia lấp lánh 4 cánh, gạch lượn, trái tim (tự vẽ, không dùng sticker có bản quyền).
export const Star: React.FC<{size: number; fill: string; dot?: string; style?: React.CSSProperties}> = ({size, fill, dot, style}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    <path d="M0,-48 L12,-15 L46,-15 L18,6 L29,40 L0,19 L-29,40 L-18,6 L-46,-15 L-12,-15 Z"
      fill={fill} stroke="#fff" strokeWidth={5} strokeLinejoin="round" />
    {dot ? [[-6, -12], [8, -4], [-10, 6], [5, 12], [0, 0]].map(([x, y], i) =>
      <circle key={i} cx={x} cy={y} r={2.6} fill={dot} />) : null}
  </svg>
);
export const Sparkle: React.FC<{size: number; fill: string; style?: React.CSSProperties}> = ({size, fill, style}) => (
  <svg width={size} height={size} viewBox="-50 -50 100 100" style={style}>
    <path d="M0,-48 C4,-10 10,-4 48,0 C10,4 4,10 0,48 C-4,10 -10,4 -48,0 C-10,-4 -4,-10 0,-48 Z" fill={fill} />
  </svg>
);
export const Squiggle: React.FC<{width: number; color: string; style?: React.CSSProperties}> = ({width, color, style}) => (
  <svg width={width} height={24} viewBox={`0 0 ${width} 24`} style={style}>
    <path d={Array.from({length: Math.floor(width / 24)}, (_, i) => `${i === 0 ? 'M' : ''}${i * 24},12 q6,-10 12,0 t12,0`).join(' ')}
      fill="none" stroke={color} strokeWidth={5} strokeLinecap="round" />
  </svg>
);
export const Heart: React.FC<{size: number; fill: string; style?: React.CSSProperties}> = ({size, fill, style}) => (
  <svg width={size} height={size} viewBox="0 0 100 92" style={style}>
    <path d="M50,88 C20,66 2,48 2,28 C2,12 14,2 28,2 C38,2 46,8 50,16 C54,8 62,2 72,2 C86,2 98,12 98,28 C98,48 80,66 50,88 Z" fill={fill} />
  </svg>
);
