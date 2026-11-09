import React from 'react';
import {ln, drawn, boil, Svg, drop, DROP, HEART, STAR, PINK} from './Doodles';

// ============================================================================================
// THƯ VIỆN TỰ TẠO — sticker / kiểu chữ Claude tạo thêm khi thư viện có sẵn không có loại phù hợp.
// Tạo xong thì lưu luôn ở đây để các video sau dùng lại. Quy trình: AGENT.md mục "Tạo sticker / kiểu chữ mới".
// - Tên: chữ thường, không dấu, nối bằng "_" (vd "tim_doi", "chu_bong_bong"); KHÔNG trùng tên có sẵn.
// - Mỗi mục có 1 dòng chú thích: dùng khi nào + ngày tạo.
// - Sau khi thêm/sửa: chạy tools/make_catalog.sh -> ảnh tools/remotion/catalog_tutao.png.
// Đồ có sẵn (DOODLES, DOODLES2, PACK, kiểu chữ trong Stickers.tsx/Label.tsx) KHÔNG sửa ở đây.
// ============================================================================================

// Giữ import các hàm vẽ dùng chung để sticker mới viết gọn (nét vẽ tay, hiệu ứng nét rung, giọt, tim, sao...).
export const _helpers = {ln, drawn, boil, Svg, drop, DROP, HEART, STAR, PINK};

// ---- 1. Sticker hình: dùng trong segments[].stickers với "type": "<tên>" ----
// Tham số: size (px), c (màu chính, mặc định trắng), c2 (màu phụ), local (khung hình từ lúc hiện -> làm chuyển động),
// prog (0..1, tiến độ nét tự vẽ), text (chữ nếu sticker có chữ).
export type CustomP = {size: number; c: string; c2?: string; local: number; prog: number; text?: string};
export const CUSTOM: Record<string, (p: CustomP) => React.ReactElement> = {
  // Mẫu để chép khi tạo mới (xoá dấu // ở đầu các dòng):
  // ten_sticker: ({size, c, local}) => ( // dùng khi ...; tạo ngày dd/mm/yyyy
  //   <svg width={size} height={size} viewBox="0 0 100 100">
  //     <circle cx="50" cy="50" r={30 + 3 * Math.sin(local / 5)} fill="none" stroke={c} strokeWidth={6} />
  //   </svg>),
};

// ---- 2. Kiểu chữ cho sticker chữ: segments[].stickers với "type": "text", "style": "<tên>" ----
// Trả về CSS cho khối chữ. fs = cỡ chữ, c/c2 = màu người dùng truyền (color/color2) nếu có.
// Font có sẵn (đã nạp): 'Round, Emo' (chữ tròn đậm), 'Hand, Emo' (viết tay), 'Script, Emo' (chữ ký nghiêng).
export const CUSTOM_TEXT: Record<string, (fs: number, c?: string, c2?: string) => React.CSSProperties> = {
  // ten_kieu: (fs, c, c2) => ({fontFamily: 'Round, Emo', fontWeight: 800, fontSize: fs, color: c ?? '#FFFFFF',
  //   WebkitTextStroke: `${fs * 0.12}px ${c2 ?? '#8E24AA'}`, paintOrder: 'stroke fill'}), // dùng khi ...; tạo ngày ...
};

// ---- 3. Kiểu chữ cho dòng hoạt động của mốc giờ: labels[].style = "<tên>" ----
// Mỗi khoá đều không bắt buộc; bỏ trống thì dùng như kiểu "shadow" mặc định.
export type LabelStyle = {
  color?: string;        // màu chữ
  accent?: string;       // màu từ khoá *...*
  round?: boolean;       // true = font tròn đậm, false = font có chân
  stroke?: string;       // màu viền chữ (có thì vẽ viền)
  strokeWidth?: number;  // độ dày viền (tỉ lệ theo cỡ chữ, vd 0.16)
  textShadow?: string;   // bóng chữ (CSS)
  box?: React.CSSProperties; // khung nền quanh chữ (CSS), vd {display:'inline-block', background:'#FFF', borderRadius:16, padding:'4px 18px'}
};
export const CUSTOM_LABEL: Record<string, LabelStyle> = {
  // ten_kieu: {color: '#FFFFFF', accent: '#FFD54F', round: true, stroke: '#6D4C41', strokeWidth: 0.16}, // dùng khi ...; tạo ngày ...
};
