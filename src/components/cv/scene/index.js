import * as THREE from 'three';
import gsap from 'gsap';
import { C, clamp01 } from './palette';
import { createMaterials, createWorld } from './world';
import { makeGlowTex } from './textures';
import { createHuman, createDesk } from './human';
import { createBoard, createTerminals, createLaunchpad } from './stations';
import { createAgents } from './agents';
import { createPaths } from './paths';
import { camPos, camLook, PARK, STATIC, T_CAM } from './cameraRail';
import { createState, buildTimeline, NOTE_TIMING } from './timeline';

const smooth = (x) => x * x * (3 - 2 * x);
const slideFor = (t) => (t < 0.6 ? 0 : t < 3.7 ? 1 : t < 4.9 ? 2 : 3);

// Boots the world on `canvas`, scrubs it with scroll over `track`, parks it behind `content`,
// and drives the HUD through `refs` (per-frame DOM) + `onState` (discrete React state).
// Returns null when WebGL is unavailable so the caller can fall back to the static hero.
export function createScene({ canvas, track, content, refs, hud, reduced, fonts, onState, onToast }) {
  const M = createMaterials();
  let world;
  try {
    world = createWorld(canvas, M);
  } catch (err) {
    console.warn('[profile scene] WebGL unavailable, showing static hero', err);
    return null;
  }
  const { renderer, scene, camera } = world;
  const glowTex = makeGlowTex();
  const { screens } = hud;

  const { human, head } = createHuman(scene, M, glowTex);
  const desk = createDesk(scene, M, fonts, screens);
  const board = createBoard(scene, M, fonts, screens.board);
  const terms = createTerminals(scene, M, fonts, screens);
  const pad = createLaunchpad(scene, M, fonts, screens.crate);
  const { agents, A } = createAgents(scene, glowTex);
  const paths = createPaths(scene, A, glowTex, fonts, screens.specCard);

  const S = createState();
  const ME_ANCHOR = new THREE.Vector3(0, 2.9, 0.3);
  const CRATE_ANCHOR = new THREE.Vector3(-2, 1.9, 7);
  const anchors = {
    spec: () => paths.spec.position,
    planner: () => A.planner.g.position,
    arch: () => A.arch.g.position,
    b1: () => A.b1.g.position,
    b2: () => A.b2.g.position,
    rev: () => A.rev.g.position,
    me: () => ME_ANCHOR,
    ops: () => A.ops.g.position,
    crate: () => CRATE_ANCHOR,
  };
  const notes = hud.notes
    .filter((n) => anchors[n.id] && NOTE_TIMING[n.id])
    .map((n) => ({ id: n.id, anchor: anchors[n.id], ...NOTE_TIMING[n.id] }));

  // scratch vectors
  const tmp = new THREE.Vector3();
  const proj = new THREE.Vector3();
  const ringPos = new THREE.Vector3();
  const camP = new THREE.Vector3();
  const camL = new THREE.Vector3();
  const drift = new THREE.Vector3();
  const dir = new THREE.Vector3();
  const right = new THREE.Vector3();
  const up = new THREE.Vector3();

  const last = { board: -1, type: -1 };
  let lastUi = { slide: -1, step: -1, gateOn: null, shipOn: null };
  let raf = 0;
  let running = false;
  let disposed = false;
  let timeline = null;

  /* ---------- HUD ---------- */
  function updateHUD(t) {
    const next = {
      slide: slideFor(t),
      step: Math.min(5, Math.floor(t + 0.5)),
      gateOn: t > 4.15 && t < 4.75,
      shipOn: t > 5.4,
    };
    if (
      next.slide !== lastUi.slide ||
      next.step !== lastUi.step ||
      next.gateOn !== lastUi.gateOn ||
      next.shipOn !== lastUi.shipOn
    ) {
      lastUi = next;
      onState(next);
    }
    if (refs.railFill) refs.railFill.style.height = `${Math.min(100, (t / T_CAM) * 100)}%`;
    if (refs.hint) refs.hint.style.opacity = t < 0.15 ? '1' : '0';
  }

  // Project each annotation's anchor to the screen; hide when off-screen, behind the camera, or parked.
  function projectNotes(t, park) {
    const w = window.innerWidth;
    const h = window.innerHeight;
    notes.forEach((n) => {
      const el = refs.notes[n.id];
      const line = refs.lines[n.id];
      if (!el || !line) return;
      proj.copy(n.anchor()).project(camera);
      const x = (proj.x * 0.5 + 0.5) * w;
      const y = (-proj.y * 0.5 + 0.5) * h;
      const visible = proj.z < 1 && x > -40 && x < w + 40 && y > 0 && y < h;
      const on = park < 0.05 && t >= n.from && t <= n.to && visible;
      el.classList.toggle('on', on);
      line.setAttribute('opacity', on ? '0.8' : '0');
      if (!on) return;
      let [ox, oy] = n.off;
      if (w < 640) {
        ox = ox < 0 ? -140 : 20;
        oy = oy < 0 ? -40 : 20;
      }
      const lx = Math.max(12, Math.min(w - 220, x + ox));
      const ly = Math.max(60, Math.min(h - 120, y + oy));
      el.style.transform = `translate(${lx}px, ${ly}px)`;
      line.setAttribute('x1', x);
      line.setAttribute('y1', y);
      line.setAttribute('x2', lx + (ox < 0 ? el.offsetWidth : 0));
      line.setAttribute('y2', ly + el.offsetHeight / 2);
    });
  }

  /* ---------- frame ---------- */
  function frame() {
    raf = requestAnimationFrame(frame);
    const time = performance.now() / 1000;
    const t = S.t;
    const u = clamp01(t / T_CAM);
    const park = smooth(clamp01(S.parkP));

    camP.copy(camPos.getPoint(u)).lerp(PARK.p, park);
    camL.copy(camLook.getPoint(u)).lerp(PARK.l, park);
    camP.y += Math.sin(time * 0.6) * 0.03 * (1 - park);
    camera.position.copy(camP);
    camera.lookAt(camL);
    scene.fog.density = 0.038 + 0.05 * park;
    renderer.toneMappingExposure = 1.1 - 0.65 * park;

    // me: breathing, and a glance at the diff during the gate
    human.position.y = Math.sin(time * 1.4) * 0.012;
    head.rotation.y = Math.sin(time * 0.5) * 0.08 + (t > 3.9 && t < 4.9 ? 0.25 : 0);

    // spec card travels desk -> planner -> architect
    paths.spec.scale.setScalar(
      Math.max(0.001, S.specVis) * (1 - Math.max(0, S.specP - 0.92) / 0.08)
    );
    paths.spec.position.copy(paths.specPath.getPoint(S.specP));
    paths.spec.lookAt(camera.position);
    paths.pathLine.geometry.setDrawRange(0, Math.floor(S.specP * 80) + (S.specVis > 0.5 ? 1 : 0));
    paths.pathLine.material.opacity = 0.6 * clamp01(1 - Math.max(0, t - 2.4));

    // board, beams, terminals, returns, diff — canvas textures redraw on integer steps only
    const b = Math.round(S.boardP * 60);
    if (b !== last.board) {
      board.draw(S.boardP);
      last.board = b;
    }
    paths.beams.forEach((l) => {
      l.geometry.setDrawRange(0, Math.floor(S.beamP * 60));
      l.material.opacity = 0.7 * clamp01(1 - Math.max(0, t - 3.8));
    });
    const ty = Math.round(S.typeP * 80);
    if (ty !== last.type) {
      terms.draw(S.typeP);
      last.type = ty;
    }
    paths.returns.forEach((l) => {
      l.geometry.setDrawRange(0, Math.floor(S.retP * 60));
      l.material.opacity = 0.6 * clamp01(1 - Math.max(0, t - 4.4));
    });
    desk.tick(time, S);

    // Ops guide: a point near the right edge of the parked view, sliding down with opsP
    if (park > 0) {
      camera.getWorldDirection(dir);
      right.setFromMatrixColumn(camera.matrixWorld, 0);
      up.setFromMatrixColumn(camera.matrixWorld, 1);
      const dist = 9;
      const half = Math.tan(THREE.MathUtils.degToRad(camera.fov / 2)) * dist;
      drift
        .copy(camera.position)
        .addScaledVector(dir, dist)
        .addScaledVector(right, half * camera.aspect * 0.82)
        .addScaledVector(up, half * (0.55 - 1.1 * clamp01(S.opsP)));
    }

    // agents hover at home, converge into a ring around me during review
    agents.forEach((a, i) => {
      const ang = (i / agents.length) * Math.PI * 2 + time * 0.15;
      ringPos.set(Math.cos(ang) * 2.4, 2.7 + Math.sin(time + i) * 0.05, Math.sin(ang) * 2.4 + 0.3);
      tmp.copy(a.homeV).lerp(ringPos, S.converge);
      if (a.id === 'ops' && park > 0) tmp.lerp(drift, park);
      tmp.y += Math.sin(time * 1.3 + a.phase) * 0.12;
      a.g.position.lerp(tmp, 0.12);
      a.core.rotation.y += 0.01;
      a.core.rotation.x += 0.004;
      a.halo.rotation.z += 0.012;
      let act = 0.35;
      if (a.id === 'planner' && t > 1.4 && t < 2.6) act = 1;
      if (a.id === 'arch' && t > 1.9 && t < 3.1) act = 1;
      if ((a.id === 'b1' || a.id === 'b2') && t > 2.9 && t < 3.9) act = 1;
      if (a.id === 'rev' && t > 3.6 && t < 4.9) act = 1;
      if (a.id === 'ops' && (t > 4.9 || park > 0)) act = 1;
      a.glow.material.opacity += (act * 0.55 - a.glow.material.opacity) * 0.08;
      a.core.material.emissiveIntensity +=
        (0.6 + act * 0.9 - a.core.material.emissiveIntensity) * 0.08;
    });

    // launchpad: crate rises, beam brightens, ring turns amber
    pad.crate.position.y = -0.5 + S.crateP * 1.7;
    pad.crate.rotation.y = S.crateP * Math.PI * 0.5 + time * 0.2 * S.crateP;
    pad.beam.material.opacity = S.crateP * 0.12 * (0.8 + Math.sin(time * 2) * 0.2);
    pad.padRing.material.color.setHex(S.crateP > 0.5 ? C.amber : C.cyan);

    updateHUD(t);
    projectNotes(t, park);
    renderer.render(scene, camera);
  }

  // Reduced motion / no scroll choreography: one wide, slightly dimmed frame behind everything.
  function renderStatic() {
    camera.position.copy(STATIC.p);
    camera.lookAt(STATIC.l);
    scene.fog.density = 0.06;
    renderer.toneMappingExposure = 0.75;
    agents.forEach((a) => a.g.position.copy(a.homeV));
    if (lastUi.slide !== 0) {
      lastUi = { slide: 0, step: 0, gateOn: false, shipOn: false };
      onState(lastUi);
    }
    renderer.render(scene, camera);
  }

  /* ---------- loop control ---------- */
  function start() {
    if (running || reduced || disposed) return;
    running = true;
    raf = requestAnimationFrame(frame);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }
  function onVisibility() {
    if (document.hidden) stop();
    else start();
  }
  function resize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    refs.leaders?.setAttribute('viewBox', `0 0 ${w} ${h}`);
    if (reduced) renderStatic();
  }

  /* ---------- interactions ---------- */
  function reject() {
    S.rev += 1;
    onToast(hud.gate.toastReject);
    agents.forEach((a) =>
      gsap.fromTo(
        a.core.material,
        { emissiveIntensity: 2.2 },
        { emissiveIntensity: 0.9, duration: 1.2, ease: 'power2.out' }
      )
    );
    gsap.fromTo(
      S,
      { diffP: 0 },
      {
        diffP: 1,
        duration: 1.6,
        delay: 0.6,
        ease: 'none',
        onStart: () => desk.invalidate(),
        onComplete: () => onToast(hud.gate.toastRevision.replace('{rev}', String(S.rev))),
      }
    );
  }

  function approve() {
    onToast(hud.gate.toastApprove);
    const rect = track.getBoundingClientRect();
    const target = rect.top + window.scrollY + rect.height - window.innerHeight;
    const startY = window.scrollY;
    const dur = reduced ? 0 : 1600;
    const t0 = performance.now();
    const step = (now) => {
      const k = Math.min(1, (now - t0) / (dur || 1));
      const e = 1 - Math.pow(1 - k, 3);
      window.scrollTo(0, startY + (target - startY) * e);
      if (k < 1) requestAnimationFrame(step);
    };
    step(t0);
  }

  /* ---------- fonts: redraw static textures once web fonts are in ---------- */
  const redrawStatic = () => {
    if (disposed) return;
    desk.invalidate();
    pad.redraw();
    paths.redraw();
    last.board = last.type = -1;
    if (reduced) {
      desk.drawStatic();
      renderStatic();
    }
  };
  if (document.fonts) {
    Promise.all([
      document.fonts.load(`15px ${fonts.mono}`),
      document.fonts.load(`500 17px ${fonts.display}`),
      document.fonts.ready,
    ])
      .then(redrawStatic)
      .catch(() => {});
  }

  /* ---------- boot ---------- */
  window.addEventListener('resize', resize);
  document.addEventListener('visibilitychange', onVisibility);
  resize();
  if (reduced) {
    renderStatic();
  } else {
    timeline = buildTimeline(S, { track, content });
    start();
  }

  function dispose() {
    disposed = true;
    stop();
    timeline?.kill();
    window.removeEventListener('resize', resize);
    document.removeEventListener('visibilitychange', onVisibility);
    scene.traverse((obj) => {
      obj.geometry?.dispose?.();
      const m = obj.material;
      if (m) {
        (Array.isArray(m) ? m : [m]).forEach((mm) => {
          mm.map?.dispose?.();
          mm.dispose?.();
        });
      }
    });
    glowTex.dispose();
    renderer.dispose();
  }

  return { dispose, approve, reject };
}
