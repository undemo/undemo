import { createRequire } from 'node:module';
import { readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const sharp = createRequire(import.meta.url)('sharp');
const root = fileURLToPath(new URL('../', import.meta.url));
const W = 600, H = 200, TOTAL = 160, SCENE = 310;
const captions = ['CYBER BLADE', 'BURST FIRE', 'HEADBUTT', 'NEXT LEVEL'];
const cropRects = JSON.parse(await readFile(`${root}/scripts/sprite-crops.json`, 'utf8'));

async function cropSprite(source, rect, scale, anchor = 0.5) {
  const width = Math.round(rect.width * scale);
  const height = Math.round(rect.height * scale);
  const input = await sharp(source).extract(rect).resize(width, height, { kernel: 'nearest' }).png().toBuffer();
  return { input, width, height, anchor };
}

const heroSource = `${root}/assets/mole-sprites.png`;
const heroes = await Promise.all(cropRects.map((rect, i) => cropSprite(heroSource, rect, 0.145,
  [0.5, 0.5, 0.5, 0.6, 0.4, 0.45, 0.4, 0.4, 0.5, 0.5, 0.35, 0.5, 0.5, 0.5, 0.5, 0.5][i])));
const fxSource = `${root}/assets/combat-effects.png`;
const fxMeta = await sharp(fxSource).metadata();
const effects = await Promise.all(Array.from({ length: 16 }, async (_, i) => {
  const left = Math.round(i % 4 * fxMeta.width / 4);
  const top = Math.round(Math.floor(i / 4) * fxMeta.height / 4);
  const width = Math.round((i % 4 + 1) * fxMeta.width / 4) - left;
  const height = Math.round((Math.floor(i / 4) + 1) * fxMeta.height / 4) - top;
  const cell = await sharp(fxSource).extract({ left, top, width, height }).png().toBuffer();
  const trimmed = await sharp(cell).trim({ threshold: 30 }).png().toBuffer();
  const m = await sharp(trimmed).metadata();
  const target = i >= 12 && i <= 14 ? 40 : [42, 42, 27, 22, 10, 12, 24, 30, 35, 40, 35, 29, 40, 40, 40, 19][i];
  const input = await sharp(trimmed).resize({ height: target, kernel: 'nearest' }).png().toBuffer();
  return { input, width: Math.round(m.width * target / m.height), height: target, anchor: 0.5 };
}));

function background(chapter) {
  const floors = [[10, 180, 110], [84, 135, 110], [154, 90, 95], [218, 45, 70]];
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="600" height="200" viewBox="0 0 600 200">
  <rect width="600" height="200" fill="#151619"/>
  <rect x="306" y="20" width="1" height="160" fill="#333335"/>
  <rect x="28" y="23" width="13" height="4" fill="#ffb454"/><rect x="43" y="23" width="4" height="4" fill="#795633"/>
  <text x="24" y="94" fill="#f3ede2" font-family="Arial,Helvetica,sans-serif" font-weight="900" font-size="69" letter-spacing="-4">undemo</text>
  <text x="28" y="130" fill="#f3ede2" font-family="monospace" font-size="16">Small steps.</text>
  <text x="28" y="152" fill="#ffb454" font-family="monospace" font-size="16">Relentless progress.</text>
  <text x="28" y="180" fill="#998874" font-family="monospace" font-size="7" letter-spacing="1">0${chapter + 1} / ${captions[chapter]}</text>
  <g transform="translate(${SCENE} 0)" shape-rendering="crispEdges">
  <text x="12" y="16" fill="#938a7d" font-family="monospace" font-size="6" letter-spacing="1">ONE DAY. ONE STEP.</text>
  ${[0,1,2,3].map(i => `<rect x="${186+i*12}" y="11" width="7" height="3" fill="${i <= chapter ? '#ffb454' : '#3f3a33'}"/>`).join('')}
  ${floors.map(([x,y,w],i) => `<rect x="${x}" y="${y}" width="${w}" height="4" fill="#c38e49"/><rect x="${x}" y="${y}" width="${w}" height="1" fill="#f3c476"/><rect x="${x+3}" y="${y+4}" width="${w-6}" height="5" fill="#3c332a"/>${Array.from({length: Math.floor(w/12)},(_,n)=>`<rect x="${x+n*12+5}" y="${y+4}" width="1" height="5" fill="#5c4831"/>`).join('')}<text x="${x+3}" y="${y+17}" fill="#6e6253" font-family="monospace" font-size="5">0${i+1}</text>`).join('')}
  </g></svg>`);
}

const bases = await Promise.all(captions.map((_, i) => sharp(background(i)).ensureAlpha().raw().toBuffer()));
const frames = [];

function motion(frame, points) {
  let i = 0;
  while (i + 1 < points.length && frame > points[i + 1][0]) i++;
  const [start, x, y] = points[i];
  if (i + 1 === points.length) return [x, y];
  const [end, nx, ny] = points[i + 1];
  const t = (frame - start) / (end - start);
  return [Math.round(x + (nx - x) * t), Math.round(y + (ny - y) * t)];
}

for (let f = 0; f < TOTAL; f++) {
  const draws = [];
  const impact = [27, 28, 29, 57, 58, 59, 65, 66, 67, 102, 103, 104, 105].includes(f);
  const shake = impact ? (f % 2 ? 1 : -1) : 0;
  const place = (sprite, x, y, centered = false) => draws.push({ input: sprite.input,
    left: SCENE + Math.round(x - sprite.width * sprite.anchor) + shake,
    top: Math.round(y - (centered ? sprite.height / 2 : sprite.height)) });
  const effect = (i, x, y) => place(effects[i], x, y, true);
  const walk = Math.floor(f / 2) % 2 + 1;

  let entry = f < 3 || f >= 22 ? 12 : f < 5 || f >= 20 ? 14 : 13;
  let exit = f < 131 || f >= 153 ? 12 : f < 134 || f >= 150 ? 14 : 13;
  place(effects[entry], 25, 179);
  place(effects[exit], 267, 44);

  if (f < 27) place(heroes[12], 112, 179);
  else if (f <= 29) place(heroes[14], 114, 177);
  else if (f <= 31) place(heroes[13], 117, 174);
  else if (f <= 34) place(heroes[15], 120, 170);
  if (f >= 32 && f <= 35) effect(f < 34 ? 10 : 11, 117, 157);

  if (f < 57) place(heroes[12], 177, 134);
  else if (f <= 59) place(heroes[14], 179, 134);
  else if (f < 65) place(heroes[13], 180, 133);
  else if (f <= 67) place(heroes[14], 182, 131);
  else if (f <= 69) place(heroes[13], 185, 127);
  else if (f <= 72) place(heroes[15], 189, 123);
  if (f >= 69 && f <= 73) effect(f < 72 ? 7 : 11, 187, 115);

  if (f < 102) place(heroes[12], 234, 89);
  else if (f <= 105) place(heroes[14], 237, 86);
  else if (f <= 108) place(heroes[13], 244, 78);
  else if (f <= 112) place(heroes[15], 252, 68);
  if (f >= 109 && f <= 115) effect(f < 112 ? 10 : 11, 253, 56);

  let x, y, pose = 0;
  if (f < 24) {
    [x, y] = motion(f, [[0,20,179],[7,32,179],[20,68,179],[23,68,179]]);
    pose = walk;
  } else if (f < 34) {
    x = 68; y = 179; pose = f < 27 ? 3 : f <= 29 ? 4 : 5;
    if (f >= 27 && f <= 29) { effect(1, 97, 157); effect(2, 108, 155); }
    if (f === 30 || f === 31) effect(3, 115, 153);
  } else if (f < 40) {
    [x, y] = motion(f, [[34,70,177],[36,88,110],[39,103,134]]); pose = 9;
  } else if (f < 50) {
    [x, y] = motion(f, [[40,103,134],[49,125,134]]); pose = f < 43 ? 11 : walk;
  } else if (f < 74) {
    x = 125; y = 134; pose = f === 56 || f === 64 ? 7 : 6;
    if (pose === 7) { x -= 2; effect(4, 150, 117); effect(5, 161, 117); }
    if ((f >= 57 && f <= 59) || (f >= 65 && f <= 67)) effect(6, f < 60 ? 171 : 175, 117);
    if (f === 60 || f === 68) effect(3, 179, 115);
  } else if (f < 80) {
    [x, y] = motion(f, [[74,126,132],[76,149,72],[79,178,89]]); pose = 9;
  } else if (f < 94) {
    x = 178; y = 89; pose = f < 85 ? 11 : f < 88 ? 0 : 8;
  } else if (f < 102) {
    [x, y] = motion(f, [[94,179,82],[97,188,54],[99,199,63],[101,211,84]]); pose = f < 97 ? 9 : 10;
  } else if (f <= 105) {
    x = 213; y = 84; pose = 10; effect(8, 234, 69);
  } else if (f < 112) {
    [x, y] = motion(f, [[106,208,68],[108,204,72],[111,204,89]]); pose = f < 109 ? 9 : 11;
    if (f <= 108) effect(9, 238, 67);
  } else if (f < 120) {
    [x, y] = motion(f, [[112,204,89],[115,220,36],[119,238,44]]); pose = 9;
  } else {
    [x, y] = motion(f, [[120,238,44],[123,238,44],[144,267,44],[149,273,44],[159,273,44]]);
    pose = f < 123 ? 11 : walk;
  }
  if (f >= 3 && f < 148) place(heroes[pose], x, y);
  if ([39,40,79,80,119,120].includes(f)) effect(15, x, y - 2);
  if (f >= 145) place(effects[exit], 267, 44);

  const frame = await sharp(bases[Math.floor(f / 40)], { raw: { width: W, height: H, channels: 4 } })
    .composite(draws).raw().toBuffer();
  frames.push(frame);
}

await mkdir(`${root}/preview`, { recursive: true });
const sampleFrames = [28, 58, 103, 140];
for (let i = 0; i < sampleFrames.length; i++) {
  await sharp(frames[sampleFrames[i]], { raw: { width: W, height: H, channels: 4 } })
    .resize(W * 2, H * 2, { kernel: 'nearest' }).png().toFile(`${root}/preview/chapter-${i + 1}.png`);
}
await sharp(frames[26], { raw: { width: W, height: H, channels: 4 } })
  .resize(W * 2, H * 2, { kernel: 'nearest' }).png().toFile(`${root}/assets/banner-mole-v2.png`);
const enlarged = [];
for (const frame of frames) {
  enlarged.push(await sharp(frame, { raw: { width: W, height: H, channels: 4 } })
    .resize(W * 2, H * 2, { kernel: 'nearest' }).raw().toBuffer());
}
await sharp(Buffer.concat(enlarged), { raw: { width: W * 2, height: H * 2 * TOTAL, channels: 4, pageHeight: H * 2 } })
  .gif({ loop: 0, delay: frames.map((_, i) => i % 2 ? 130 : 120), dither: 0, colours: 128, effort: 7 })
  .toFile(`${root}/assets/banner-mole-v2.gif`);
const metadata = await sharp(`${root}/assets/banner-mole-v2.gif`, { animated: true }).metadata();
console.log(JSON.stringify({ width: metadata.width, height: metadata.pageHeight, frames: metadata.pages,
  duration: metadata.delay.reduce((a, b) => a + b, 0), loop: metadata.loop }));
