import {useEffect, useState} from 'react';
import {continueRender, delayRender, staticFile} from 'remotion';

// Mặc định theo video mẫu (assets/template.mp4); style.json -> "theme" ghi đè từng khóa.
export const defaultTheme = {
  titleFont: 'Montserrat.ttf', subFont: 'Fraunces.ttf', captionFont: 'Lora.ttf', emojiFont: 'NotoColorEmoji.ttf',
  titleColor: '#FFFFFF', titleShadow: 'rgba(30,30,30,0.85)', titleSize: 66, titleTop: 150, typeSeconds: 1.0,
  sub1Color: '#FFF3A6', sub1Stroke: '#F06292', sub2Color: '#F48FB1', sub2Stroke: '#FFFFFF',
  subSize: 64, subTop: 540, squiggle: '#E040FB', star: '#F8BBD0', starDot: '#EC407A',
  captionColor: '#FFF1A8', captionSize: 30, captionTop: 820, captionShadow: 'rgba(0,0,0,0.75)', captionStroke: 'rgba(70,45,20,0.9)', captionStrokeWidth: 4,
  heart: ['#F8BBD0', '#F48FB1', '#FF80AB', '#FFFFFF'],
  // Mốc giờ (kiểu video "Sáng cuối tuần"): giờ to + dòng hoạt động trắng, vị trí trên/giữa/dưới
  timeFont: 'Montserrat.ttf', labelFont: 'Lora.ttf', handFont: 'PatrickHand.ttf', scriptFont: 'DancingScript.ttf',
  timeSize: 66, timeColor: '#FFFFFF', timeShadow: 'rgba(0,0,0,0.6)',
  labelSize: 38, labelColor: '#FFFFFF', labelShadow: 'rgba(0,0,0,0.7)', underSize: 40,
  posTop: 130, posMiddle: 520, posBottom: 900,
  doodle: '#FFFFFF', doodleShadow: 'rgba(0,0,0,0.35)', handSize: 34,
  // Kiểu dòng hoạt động (Label): anim type|wave|pop|slide|fade; style shadow|outline|pill|tag; *từ khoá* tô màu accent
  labelAnim: 'type', labelStyle: 'shadow', accent: '#FFE066', labelStroke: 'rgba(62,39,35,0.95)',
  roundFont: 'Baloo2.ttf', tagBg: '#FFE066', tagColor: '#4E342E', neon: '#FF4FA3',
};
export type Theme = typeof defaultTheme;
export const mergeTheme = (t?: Partial<Theme>): Theme => ({...defaultTheme, ...(t ?? {})});

const cache: Record<string, Promise<void>> = {};
// Chờ font tải xong rồi mới chụp khung hình.
export const useFonts = (fonts: Record<string, string>) => {
  const [handle] = useState(() => delayRender('fonts'));
  useEffect(() => {
    Promise.all(Object.entries(fonts).map(([family, file]) => {
      const key = family + '|' + file;
      if (!cache[key]) {
        cache[key] = new FontFace(family, `url('${staticFile('fonts/' + file)}')`, {weight: '100 900'})
          .load().then((f) => { (document as any).fonts.add(f); });
      }
      return cache[key];
    })).then(() => continueRender(handle)).catch((e) => { console.error('Font lỗi', e); continueRender(handle); });
  }, []);
};
