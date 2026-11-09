// Dùng: node render.mjs <jobs.json>
// jobs = [{"comp":"StepLabel|TitleCard|Cover","props":{...},"out":"/abs/x.mov|.png","still":false,"frame":0}]
// Bundle 1 lần cho cả danh sách; job nào đã có file out thì bỏ qua (chạy lại được khi bị ngắt).
import {bundle} from '@remotion/bundler';
import {renderMedia, renderStill, selectComposition} from '@remotion/renderer';
import chromium from '@sparticuz/chromium';
import fs from 'node:fs'; import path from 'node:path'; import {fileURLToPath} from 'node:url';
const here = path.dirname(fileURLToPath(import.meta.url));
const jobs = JSON.parse(fs.readFileSync(process.argv[2], 'utf8')).filter((j) => !fs.existsSync(j.out));
if (!jobs.length) { console.log('remotion: không có việc'); process.exit(0); }
const browserExecutable = await chromium.executablePath();
const chromiumOptions = {gl: 'swangle'};
const serveUrl = await bundle({entryPoint: path.join(here, 'src/index.ts'),
  publicDir: process.env.CHABONG_ASSETS || path.join(here, 'public')});
for (const j of jobs) {
  const ext = path.extname(j.out);
  const tmp = j.out.slice(0, -ext.length) + '.part' + ext;
  const composition = await selectComposition({serveUrl, id: j.comp, inputProps: j.props, browserExecutable, chromiumOptions});
  if (j.still) {
    await renderStill({composition, serveUrl, output: tmp, inputProps: j.props, browserExecutable, chromiumOptions,
      frame: Math.min(j.frame ?? 0, composition.durationInFrames - 1)});
  } else {
    await renderMedia({composition, serveUrl, codec: 'prores', proResProfile: '4444', pixelFormat: 'yuva444p10le',
      imageFormat: 'png', outputLocation: tmp, inputProps: j.props, browserExecutable, chromiumOptions});
  }
  fs.renameSync(tmp, j.out);
  console.log('remotion OK', j.comp, path.basename(j.out));
}
