import React from 'react';
import {Composition} from 'remotion';
import {TitleCard} from './TitleCard';
import {Caption} from './Caption';
import {Label} from './Label';
import {Stickers} from './Stickers';
import {Hearts, LightLeak, Sparkles} from './Effects';
import {Confetti, FloatStars, FrameFx, Prism} from './Effects2';
import {Catalog} from './Catalog';

const FPS = 30;
const byProps = ({props}: {props: any}) => ({durationInFrames: Math.max(1, Math.round((props.seconds ?? 3) * FPS))});
const comp = (id: string, c: any) => (
  <Composition id={id} component={c} width={720} height={1280} fps={FPS} durationInFrames={90}
    defaultProps={{} as any} calculateMetadata={byProps} />
);

export const Root: React.FC = () => (
  <>
    {comp('TitleCard', TitleCard)}
    {comp('Caption', Caption)}
    {comp('Label', Label)}
    {comp('Stickers', Stickers)}
    {comp('Hearts', Hearts)}
    {comp('Sparkles', Sparkles)}
    {comp('LightLeak', LightLeak)}
    {comp('FrameFx', FrameFx)}
    {comp('Prism', Prism)}
    {comp('Confetti', Confetti)}
    {comp('FloatStars', FloatStars)}
    {comp('Catalog', Catalog)}
  </>
);
