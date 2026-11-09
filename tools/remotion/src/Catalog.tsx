import React from 'react';
import {AbsoluteFill} from 'remotion';
import {mergeTheme, Theme, useFonts} from './theme';
import {Doodle, Sticker} from './Stickers';
import {Label} from './Label';
import {THEMES} from './Pack';
import {DOODLE_LIST} from './Doodles';
import {DOODLE2_PAGES} from './Doodles2';
import {CUSTOM, CUSTOM_TEXT, CUSTOM_LABEL} from './Custom';
import {Label} from './Label';

// Bảng mẫu cho agent và người dùng chọn (dựng bằng tools/make_catalog.sh):
//  page 1 catalog_stickers.png  sticker cơ bản      page 2 catalog_chu.png       kiểu chữ mốc giờ
//  page 3 catalog_chude.png     sticker theo chủ đề  page 4 catalog_chu_sticker.png kiểu chữ sticker
//  page 5 catalog_combo.png     combo dựng sẵn (tools/presets.json)
//  page 6 catalog_netve.png     nét trắng vẽ tay kiểu "Yummy!" + chữ ký script
//  page 10 catalog_tutao.png   thư viện tự tạo (Custom.tsx)
//  page 7 catalog_netve2.png    nét trắng mở rộng: ăn uống + cảm xúc   page 8 catalog_netve3.png  thú ló + em bé & trang trí
const BASIC: Partial<Sticker>[] = [
  {type: 'shock'}, {type: 'heart'}, {type: 'cat'}, {type: 'sleep', size: 70}, {type: 'sparkle'},
  {type: 'arrow', size: 70}, {type: 'circle', w: 0.15, h: 0.07}, {type: 'underline', w: 0.15}, {type: 'exclaim'}, {type: 'question'},
  {type: 'frame', w: 0.14, h: 0.09}, {type: 'heart_fill'}, {type: 'hearts', size: 75}, {type: 'star'}, {type: 'stars', size: 70},
  {type: 'flower'}, {type: 'sun'}, {type: 'cloud', size: 65}, {type: 'music'}, {type: 'sweat'},
  {type: 'angry'}, {type: 'burst', size: 62, text: 'WOW'}, {type: 'yum'}, {type: 'laugh'}, {type: 'love'},
  {type: 'cry'}, {type: 'wow'}, {type: 'shy'}, {type: 'bubble', text: 'Ba ơi!', size: 30},
];
const TEXT_STYLES: [string, string][] = [
  ['hand', 'Yummy!'], ['outline', 'ngon xỉu'], ['tag', '200k'], ['marker', 'rẻ quá'], ['neon', 'quẩy lên'],
  ['comic', 'WOW!'], ['sticker', 'dễ thương'], ['gradient', 'Tết đến rồi'], ['retro', 'lên đường!'],
];
const bg = 'linear-gradient(160deg, #6D8B74 0%, #8C7A6B 45%, #4A5A6A 100%)';
const nameCss: React.CSSProperties = {fontFamily: 'Cat', fontSize: 18, fontWeight: 700, color: '#FFF59D', textShadow: '0 1px 3px rgba(0,0,0,0.6)'};
type Preset = {name: string; desc?: string; items: (Partial<Sticker> & {dx?: number; dy?: number})[]};

export const Catalog: React.FC<{page?: number; seconds?: number; presets?: Preset[]; theme?: Partial<Theme>}> = (p) => {
  const t = mergeTheme(p.theme);
  useFonts({Hand: t.handFont, Round: t.roundFont, Script: t.scriptFont, Emo: t.emojiFont, Cat: t.timeFont});
  const page = p.page ?? 1;
  const cell = (s: Sticker, name: string, w: number, h: number, key: number, left: number, top: number) => (
    <div key={key} style={{position: 'absolute', left, top, width: w, height: h, display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center'}}>
      <div style={{height: h - 34, display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
        <Doodle s={s} t={t} local={24} prog={1} /></div>
      <div style={nameCss}>{name}</div>
    </div>);

  if (page === 2) {
    const rows: [string, string][] = [['shadow', 'type (mặc định)'], ['outline', 'wave'], ['pill', 'pop'], ['tag', 'slide'],
      ['sticker', 'pop'], ['comic', 'wave'], ['neon', 'fade']];
    return (
      <AbsoluteFill style={{background: bg}}>
        {rows.map(([style, anim], i) => (
          <div key={i} style={{position: 'absolute', left: 0, right: 0, top: 10 + i * 180, height: 175}}>
            <div style={{position: 'absolute', top: 2, width: '100%', textAlign: 'center', ...nameCss, fontSize: 20}}>
              style "{style}" · anim "{anim}"</div>
            <Label time="8:00" text="Đi chơi chỉ *200k* nè" pos={34} style={style} anim={anim} seconds={2}
              timeIn={false} timeOut={false} textIn={false} textOut={false} theme={{...p.theme, timeSize: 44}} />
          </div>))}
      </AbsoluteFill>);
  }
  if (page === 3) {
    const rowH = 138, cw = 102;
    return (
      <AbsoluteFill style={{background: bg}}>
        {THEMES.map(([title, types], r) => (
          <div key={r} style={{position: 'absolute', left: 0, right: 0, top: 8 + r * rowH, height: rowH}}>
            <div style={{position: 'absolute', left: 14, top: 0, fontFamily: 'Cat', fontSize: 20, fontWeight: 800, color: '#fff',
              textShadow: '0 1px 3px rgba(0,0,0,0.6)'}}>{title}</div>
            {types.map((ty, i) => cell({type: ty, x: 0, y: 0, size: 70} as Sticker, ty, cw, rowH - 22, i, 4 + i * cw, 22))}
          </div>))}
      </AbsoluteFill>);
  }
  if (page === 4) {
    return (
      <AbsoluteFill style={{background: bg}}>
        {TEXT_STYLES.map(([st, txt], i) => cell({type: 'text', text: txt, style: st, size: 50, x: 0, y: 0} as Sticker,
          `text · style "${st}"`, 360, 200, i, (i % 2) * 360, Math.floor(i / 2) * 210 + 20))}
        {cell({type: 'bubble', text: 'Ba ơi!', size: 40, x: 0, y: 0} as Sticker, 'bubble', 360, 200, 20, 360, 4 * 210 + 20)}
        {cell({type: 'burst', text: '200k', size: 90, x: 0, y: 0} as Sticker, 'burst', 360, 260, 21, 180, 5 * 210 + 10)}
      </AbsoluteFill>);
  }
  if (page === 6) {
    const cols = 5, cw = 720 / cols, ch = 150;
    return (
      <AbsoluteFill style={{background: bg}}>
        {DOODLE_LIST.map((ty, i) => cell({type: ty, x: 0, y: 0, size: 84} as Sticker, ty, cw, ch, i, (i % cols) * cw, Math.floor(i / cols) * ch + 6))}
        {cell({type: 'text', style: 'script', text: 'Yummy!', size: 56, x: 0, y: 0} as Sticker, 'text · style "script"', 360, 200, 90, 0, 5 * ch + 20)}
        {cell({type: 'text', style: 'script', text: 'ngon quá nè', size: 48, x: 0, y: 0} as Sticker, 'text · style "script"', 360, 200, 91, 360, 5 * ch + 20)}
      </AbsoluteFill>);
  }
  if (page === 10) { // catalog_tutao.png: thư viện tự tạo (Custom.tsx)
    const st = Object.keys(CUSTOM), tx = Object.keys(CUSTOM_TEXT), lb = Object.keys(CUSTOM_LABEL);
    const cols = 4, cw = 720 / cols, ch = 170;
    const h1 = Math.ceil(st.length / cols) * ch, h2 = Math.ceil(tx.length / 2) * 130;
    const head = (txt: string, top: number) => <div style={{position: 'absolute', left: 20, top, ...nameCss, fontSize: 26}}>{txt}</div>;
    const empty = !st.length && !tx.length && !lb.length;
    return (
      <AbsoluteFill style={{background: bg}}>
        {empty ? <div style={{position: 'absolute', top: 560, width: '100%', textAlign: 'center', ...nameCss, fontSize: 34}}>
          Thư viện tự tạo đang trống{'\n'}(xem tools/remotion/src/Custom.tsx)</div> : null}
        {st.length ? head('Sticker tự tạo (type)', 10) : null}
        {st.map((ty, i) => cell({type: ty, x: 0, y: 0, size: 100, text: 'mẫu'} as Sticker, ty, cw, ch, i,
          (i % cols) * cw, 44 + Math.floor(i / cols) * ch))}
        {tx.length ? head('Kiểu chữ sticker tự tạo (type "text", style)', 54 + h1) : null}
        {tx.map((nm, i) => cell({type: 'text', style: nm, text: 'Ngon quá!', size: 48, x: 0, y: 0} as Sticker, 'style "' + nm + '"',
          360, 130, 200 + i, (i % 2) * 360, 88 + h1 + Math.floor(i / 2) * 130))}
        {lb.length ? head('Kiểu chữ mốc giờ tự tạo (labels[].style)', 98 + h1 + h2) : null}
        {lb.map((nm, i) => (
          <React.Fragment key={'l' + i}>
            <Label time="" text={'Mẫu *' + nm + '*'} style={nm} pos={140 + h1 + h2 + i * 110} seconds={2}
              timeIn={false} textIn={false} textOut={false} theme={p.theme} />
            <div style={{position: 'absolute', left: 0, width: '100%', textAlign: 'center', top: 212 + h1 + h2 + i * 110, ...nameCss}}>
              {'style "' + nm + '"'}</div>
          </React.Fragment>))}
      </AbsoluteFill>);
  }
  if (page === 7 || page === 8) {
    const list = DOODLE2_PAGES[page - 7], cols = 5, cw = 720 / cols, ch = 152;
    const txt: Record<string, string> = {bubble_line: 'Ba ơi!', bubble_think: 'ăn gì ta?'};
    const phrases = page === 7 ? ['măm măm', 'no căng bụng', 'mlem mlem', 'dễ thương xỉu'] : ['hehe', 'Byee~', 'đi chơi thôi', 'ngủ ngoan nha'];
    const top = Math.ceil(list.length / cols) * ch + 8;
    return (
      <AbsoluteFill style={{background: bg}}>
        {list.map((ty, i) => cell({type: ty, x: 0, y: 0, size: ty.startsWith('bubble') ? 70 : 84, text: txt[ty]} as Sticker, ty, cw, ch, i,
          (i % cols) * cw, Math.floor(i / cols) * ch + 6))}
        {phrases.map((ph, i) => cell({type: 'text', style: 'script', text: ph, size: 44, x: 0, y: 0} as Sticker, 'text · style "script"',
          360, 150, 100 + i, (i % 2) * 360, top + Math.floor(i / 2) * 150))}
      </AbsoluteFill>);
  }
  if (page === 5 || page === 9) { // 9 = catalog_combo2.png (combo mở rộng)
    const ps = p.presets ?? [];
    const cols = 4, cw = 720 / cols, ch = 1280 / Math.ceil(ps.length / cols), k = 0.42;
    return (
      <AbsoluteFill style={{background: bg}}>
        {ps.map((pr, i) => (
          <div key={i} style={{position: 'absolute', left: (i % cols) * cw, top: Math.floor(i / cols) * ch, width: cw, height: ch, overflow: 'hidden'}}>
            <div style={{position: 'absolute', left: cw / 2, top: (ch - 24) / 2, transform: `scale(${k})`}}>
              {pr.items.map((it, j) => (
                <div key={j} style={{position: 'absolute', left: (it.dx ?? 0) * 720, top: (it.dy ?? 0) * 1280,
                  transform: `translate(-50%, -50%) rotate(${it.rotate ?? 0}deg)`}}>
                  <Doodle s={{x: 0, y: 0, ...it} as Sticker} t={t} local={30} prog={1} /></div>))}
            </div>
            <div style={{position: 'absolute', bottom: 4, width: '100%', textAlign: 'center', ...nameCss, fontSize: 17}}>{pr.name}</div>
          </div>))}
      </AbsoluteFill>);
  }
  const cols = 5, cw = 720 / cols, ch = 1280 / 6;
  return (
    <AbsoluteFill style={{background: bg}}>
      {BASIC.map((it, i) => cell({x: 0, y: 0, size: 80, ...it} as Sticker, it.type as string, cw, ch, i, (i % cols) * cw, Math.floor(i / cols) * ch))}
    </AbsoluteFill>);
};
