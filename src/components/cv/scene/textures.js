import * as THREE from 'three';
import { C, HEX, clamp01, toneHex } from './palette';

// Canvas-backed textures for holo screens. `fonts.mono` / `fonts.display` are the CSS font-family
// lists resolved from next/font variables, so canvas text matches the HUD.
export function screenTex(w = 512, h = 320) {
  const cv = document.createElement('canvas');
  cv.width = w;
  cv.height = h;
  const ctx = cv.getContext('2d');
  const tex = new THREE.CanvasTexture(cv);
  tex.colorSpace = THREE.SRGBColorSpace;
  return { cv, ctx, tex };
}

const lineColor = (l, accent) => {
  if (l.startsWith('@')) return accent;
  if (l.startsWith('+') || l.startsWith('✓')) return HEX.teal;
  if (l.startsWith('-')) return HEX.removed;
  if (l.startsWith('#') || l.startsWith('//')) return HEX.comment;
  return HEX.code;
};

// Types `body` out to `progress` (0..1 of total characters) under a title bar.
export function drawCode(s, { title, body }, progress, accent, fonts) {
  const { ctx, cv, tex } = s;
  ctx.fillStyle = HEX.screen;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.fillStyle = HEX.screenBar;
  ctx.fillRect(0, 0, cv.width, 26);
  ctx.font = `500 13px ${fonts.mono}`;
  ctx.fillStyle = HEX.muted;
  ctx.fillText(title, 12, 18);

  const total = body.reduce((a, l) => a + l.length, 0);
  let budget = Math.floor(total * clamp01(progress));
  ctx.font = `15px ${fonts.mono}`;
  body.forEach((l, i) => {
    if (budget <= 0) return;
    const t = l.slice(0, budget);
    budget -= l.length;
    ctx.fillStyle = lineColor(l, accent);
    ctx.fillText(t, 14, 52 + i * 22);
  });
  if (progress > 0 && progress < 1) {
    const row = Math.min(body.length - 1, Math.floor(progress * body.length));
    ctx.fillStyle = accent;
    ctx.fillRect(14 + (body[row]?.length ?? 0) * 9, 40 + row * 22, 8, 16);
  }
  tex.needsUpdate = true;
}

export function holoPlane(w, h, tex, opacity = 0.92) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ map: tex, transparent: true, opacity, side: THREE.DoubleSide })
  );
  const frame = new THREE.LineSegments(
    new THREE.EdgesGeometry(m.geometry),
    new THREE.LineBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.55 })
  );
  m.add(frame);
  return m;
}

// Radial white sprite used (tinted) for every glow.
export function makeGlowTex() {
  const c = document.createElement('canvas');
  c.width = c.height = 128;
  const g = c.getContext('2d');
  const r = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  r.addColorStop(0, 'rgba(255,255,255,1)');
  r.addColorStop(1, 'rgba(255,255,255,0)');
  g.fillStyle = r;
  g.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(c);
}

// C4 board: boxes stroke themselves perimeter-first, then arrows draw, as p goes 0..1.
const BOARD_BOXES = [
  { x: 40, y: 150, w: 170, h: 78 },
  { x: 260, y: 70, w: 180, h: 78 },
  { x: 260, y: 240, w: 180, h: 78 },
  { x: 490, y: 150, w: 170, h: 78 },
];
const BOARD_ARROWS = [
  [210, 189, 260, 109],
  [210, 189, 260, 279],
  [440, 109, 490, 189],
  [440, 279, 490, 189],
];

export function drawBoard(s, p, content, fonts) {
  const { ctx, cv, tex } = s;
  ctx.fillStyle = HEX.screen;
  ctx.fillRect(0, 0, cv.width, cv.height);
  ctx.strokeStyle = HEX.grid;
  ctx.lineWidth = 1;
  for (let x = 0; x < cv.width; x += 34) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, cv.height);
    ctx.stroke();
  }
  for (let y = 0; y < cv.height; y += 34) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(cv.width, y);
    ctx.stroke();
  }
  ctx.font = `500 14px ${fonts.mono}`;
  ctx.fillStyle = HEX.muted;
  ctx.fillText(content.title, 18, 28);

  const steps = BOARD_BOXES.length + BOARD_ARROWS.length;
  const done = p * steps;
  BOARD_BOXES.forEach((b, i) => {
    const q = clamp01(done - i);
    if (q <= 0) return;
    const text = content.boxes[i] ?? {};
    ctx.strokeStyle = toneHex(text.tone);
    ctx.lineWidth = 2;
    const per = (b.w + b.h) * 2 * q;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    let rem = per;
    let cx = b.x;
    let cy = b.y;
    for (const [dx, dy] of [
      [b.w, 0],
      [0, b.h],
      [-b.w, 0],
      [0, -b.h],
    ]) {
      const len = Math.abs(dx) + Math.abs(dy);
      const k = Math.min(1, rem / len);
      cx += dx * k;
      cy += dy * k;
      ctx.lineTo(cx, cy);
      rem -= len * k;
      if (rem <= 0) break;
    }
    ctx.stroke();
    if (q >= 1) {
      ctx.fillStyle = HEX.ink;
      ctx.font = `500 17px ${fonts.display}`;
      ctx.fillText(text.title ?? '', b.x + 14, b.y + 34);
      ctx.fillStyle = HEX.muted;
      ctx.font = `12px ${fonts.mono}`;
      ctx.fillText(text.sub ?? '', b.x + 14, b.y + 58);
    }
  });
  BOARD_ARROWS.forEach((a, i) => {
    const q = clamp01(done - BOARD_BOXES.length - i);
    if (q <= 0) return;
    ctx.strokeStyle = HEX.cyan;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(a[0], a[1]);
    ctx.lineTo(a[0] + (a[2] - a[0]) * q, a[1] + (a[3] - a[1]) * q);
    ctx.stroke();
  });
  tex.needsUpdate = true;
}

export function drawCrate(s, content, fonts) {
  const { ctx, tex } = s;
  ctx.fillStyle = HEX.amber;
  ctx.fillRect(0, 0, 256, 256);
  ctx.fillStyle = HEX.void;
  ctx.font = `600 44px ${fonts.display}`;
  ctx.fillText(content.title, 40, 120);
  ctx.font = `500 20px ${fonts.mono}`;
  ctx.fillText(content.sub, 40, 160);
  tex.needsUpdate = true;
}

export function drawSpecCard(s, content, fonts) {
  const { ctx, tex } = s;
  ctx.fillStyle = HEX.amber;
  ctx.fillRect(0, 0, 256, 160);
  ctx.fillStyle = HEX.void;
  ctx.font = `600 34px ${fonts.display}`;
  ctx.fillText(content.title, 18, 46);
  ctx.font = `500 15px ${fonts.mono}`;
  content.lines.forEach((l, i) => ctx.fillText(`· ${l}`, 18, 80 + i * 24));
  tex.needsUpdate = true;
}
