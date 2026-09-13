import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/addons/geometries/RoundedBoxGeometry.js';
import { C, HEX } from './palette';
import { box } from './world';
import { screenTex, drawCode, drawTerminal, holoPlane, typewriter } from './textures';

const place = (mesh, x, y, z, shadow = true) => {
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = shadow;
  return mesh;
};
const capsule = (r, len, material, x, y, z) =>
  place(new THREE.Mesh(new THREE.CapsuleGeometry(r, len, 3, 10), material), x, y, z);
const rbox = (w, h, d, material, x, y, z, radius = 0.04, shadow = true) =>
  place(new THREE.Mesh(new RoundedBoxGeometry(w, h, d, 2, radius), material), x, y, z, shadow);

// Modern office chair: five-star base, gas lift, cushion, curved backrest, headrest, armrests.
function createChair(M) {
  const chair = new THREE.Group();
  chair.position.set(0, 0, 0.25);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    const spoke = box(0.07, 0.05, 0.6, M.metal, Math.sin(a) * 0.3, 0.06, Math.cos(a) * 0.3, false);
    spoke.rotation.y = a;
    chair.add(spoke);
    const wheel = new THREE.Mesh(new THREE.SphereGeometry(0.06, 8, 6), M.dark);
    wheel.position.set(Math.sin(a) * 0.58, 0.05, Math.cos(a) * 0.58);
    chair.add(wheel);
  }
  chair.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.06, 0.75, 10), M.metal), 0, 0.45, 0, false));
  chair.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.42, 0.16, 20), M.fabric), 0, 0.86, 0));
  // backrest: solid rounded slab with a slight recline; lumbar bar, post and headrest ride on it
  const recline = 0.12;
  const back = rbox(0.92, 1.05, 0.12, M.fabric, 0, 1.48, 0.42, 0.05);
  back.rotation.x = recline;
  chair.add(back);
  const lumbar = rbox(0.7, 0.16, 0.05, M.dark, 0, 1.12, 0.35, 0.02);
  lumbar.rotation.x = recline;
  chair.add(lumbar);
  const post = box(0.06, 0.2, 0.05, M.metal, 0, 2.1, 0.49, false);
  post.rotation.x = recline;
  chair.add(post);
  const headrest = rbox(0.46, 0.2, 0.1, M.fabric, 0, 2.26, 0.52, 0.04);
  headrest.rotation.x = recline;
  chair.add(headrest);
  for (const sx of [-1, 1]) {
    chair.add(box(0.06, 0.32, 0.06, M.metal, sx * 0.52, 1.05, 0.05, false));
    chair.add(rbox(0.1, 0.05, 0.42, M.dark, sx * 0.52, 1.23, 0, 0.02));
  }
  return chair;
}

// Rounded low-poly developer: amber hoodie (the only warm object), headphones, glasses, sneakers.
function createFigure(M) {
  const fig = new THREE.Group();
  for (const sx of [-1, 1]) {
    const thigh = capsule(0.13, 0.42, M.amberDark, sx * 0.18, 1.0, -0.1);
    thigh.rotation.x = Math.PI / 2;
    fig.add(thigh);
    fig.add(capsule(0.11, 0.5, M.amberDark, sx * 0.18, 0.55, -0.42));
    fig.add(rbox(0.24, 0.12, 0.4, M.dark, sx * 0.18, 0.1, -0.52, 0.04));
    fig.add(box(0.22, 0.03, 0.36, M.ink, sx * 0.18, 0.035, -0.52, false));
  }
  const torso = capsule(0.36, 0.5, M.amber, 0, 1.62, 0.08);
  torso.scale.set(1.15, 1, 0.8);
  fig.add(torso);
  const hood = place(new THREE.Mesh(new THREE.SphereGeometry(0.24, 10, 7), M.amber), 0, 2.02, 0.28);
  hood.scale.set(1.15, 0.7, 0.85);
  fig.add(hood);
  const collar = new THREE.Mesh(new THREE.TorusGeometry(0.19, 0.06, 8, 16), M.amber);
  collar.rotation.x = Math.PI / 2;
  place(collar, 0, 2.08, 0.06);
  fig.add(collar);
  fig.add(box(0.03, 0.55, 0.02, M.amberDark, 0, 1.6, -0.22, false)); // zip
  for (const sx of [-1, 1]) {
    const upper = capsule(0.1, 0.42, M.amber, sx * 0.5, 1.68, -0.1);
    upper.rotation.x = 0.6;
    upper.rotation.z = sx * 0.12;
    fig.add(upper);
    const fore = capsule(0.09, 0.4, M.amber, sx * 0.44, 1.36, -0.48);
    fore.rotation.x = -1.3;
    fig.add(fore);
    fig.add(place(new THREE.Mesh(new THREE.SphereGeometry(0.09, 8, 6), M.skin), sx * 0.42, 1.24, -0.74));
  }
  fig.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.1, 0.16, 10), M.skin), 0, 2.12, 0.05, false));

  // head group so hair, glasses and headphones turn with the head
  const head = new THREE.Group();
  head.position.set(0, 2.5, 0.05);
  head.add(place(new THREE.Mesh(new THREE.IcosahedronGeometry(0.33, 1), M.skin), 0, 0, 0));
  const hair = new THREE.Mesh(
    new THREE.SphereGeometry(0.35, 10, 6, 0, Math.PI * 2, 0, Math.PI / 2.2),
    M.dark
  );
  place(hair, 0, 0.06, 0.02);
  hair.rotation.x = 0.15;
  head.add(hair);
  head.add(box(0.62, 0.12, 0.05, M.glass, 0, 0.02, -0.31, false));
  const band = new THREE.Mesh(new THREE.TorusGeometry(0.37, 0.03, 8, 20, Math.PI), M.dark);
  band.position.set(0, 0.04, 0);
  head.add(band);
  for (const sx of [-1, 1]) {
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.11, 0.07, 12), M.dark);
    cup.rotation.z = Math.PI / 2;
    cup.position.set(sx * 0.36, -0.02, 0);
    head.add(cup);
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.08, 0.012, 6, 16),
      new THREE.MeshBasicMaterial({ color: C.cyan })
    );
    ring.rotation.y = Math.PI / 2;
    ring.position.set(sx * 0.4, -0.02, 0);
    head.add(ring);
  }
  fig.add(head);
  return { fig, head };
}

// Me at the centre of the platform, seated, facing -z. Only warm object in the scene.
export function createHuman(scene, M, glowTex) {
  const human = new THREE.Group();
  human.position.set(0, 0, 0.35);
  human.add(createChair(M));
  const { fig, head } = createFigure(M);
  human.add(fig);
  scene.add(human);

  // warm floor glow so the figure reads as the anchor
  const floorGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: C.amber,
      transparent: true,
      opacity: 0.35,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  floorGlow.scale.set(4.5, 1.2, 1);
  floorGlow.position.set(0, 0.2, 0.3);
  scene.add(floorGlow);

  return { human, head };
}

const diffLines = (diff, rev) => ({
  title: diff.title.replace('{pr}', String(40 + rev)).replace('{rev}', String(rev)),
  body: diff.revisions[Math.min(rev, diff.revisions.length) - 1],
});

// Sleek panel-leg desk with a monitor arm holding two holo screens (spec.md left, PR diff right).
export function createDesk(scene, M, fonts, screens) {
  const desk = new THREE.Group();
  desk.position.set(0, 0, -0.85);
  desk.add(rbox(3.2, 0.07, 1.25, M.steel, 0, 1.06, 0, 0.03));
  desk.add(box(3.16, 0.02, 1.21, M.line, 0, 1.015, 0, false));
  for (const sx of [-1, 1]) desk.add(rbox(0.08, 1.0, 1.05, M.line, sx * 1.5, 0.51, 0, 0.02));
  desk.add(box(2.9, 0.06, 0.06, M.line, 0, 0.95, -0.5, false));
  const led = new THREE.Mesh(
    new THREE.BoxGeometry(2.9, 0.015, 0.02),
    new THREE.MeshBasicMaterial({ color: C.cyan, transparent: true, opacity: 0.6 })
  );
  led.position.set(0, 1.0, 0.6);
  desk.add(led);
  // monitor arm
  desk.add(place(new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.035, 0.9, 8), M.metal), 0, 1.5, -0.5, false));
  desk.add(box(1.5, 0.04, 0.04, M.metal, 0, 1.78, -0.45, false));
  // keyboard, trackpad, mug, plant
  desk.add(rbox(1.0, 0.03, 0.32, M.dark, -0.1, 1.11, 0.28, 0.01));
  desk.add(rbox(0.28, 0.02, 0.22, M.dark, 0.62, 1.105, 0.3, 0.01));
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.2, 10), M.ink);
  place(mug, 1.05, 1.2, 0.25);
  desk.add(mug);
  const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.08, 0.18, 8), M.dark);
  place(pot, -1.25, 1.19, 0.3);
  desk.add(pot);
  for (let i = 0; i < 5; i += 1) {
    const a = (i / 5) * Math.PI * 2;
    const leaf = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.32, 5), M.leaf);
    place(leaf, -1.25 + Math.sin(a) * 0.07, 1.42, 0.3 + Math.cos(a) * 0.07, false);
    leaf.rotation.set(Math.cos(a) * 0.5, 0, -Math.sin(a) * 0.5);
    desk.add(leaf);
  }

  const specScreen = screenTex();
  const diffScreen = screenTex(512, 360);
  const monL = holoPlane(1.15, 0.72, specScreen.tex);
  monL.position.set(-0.62, 1.78, -0.32);
  monL.rotation.y = 0.18;
  desk.add(monL);
  const monR = holoPlane(1.15, 0.72, diffScreen.tex);
  monR.position.set(0.62, 1.78, -0.32);
  monR.rotation.y = -0.18;
  desk.add(monR);
  scene.add(desk);

  // Left screen: spec.md types itself out and loops. Right screen: a scrolling agent log until the
  // review diff arrives (S.diffP > 0), then the scroll-driven PR diff. Redraws only when text changes.
  const specTw = typewriter({
    body: [...screens.spec.body, ...(screens.spec.tail ?? [])],
    cps: 26,
    linePause: 0.45,
    holdEnd: 3,
    rows: 11,
  });
  const feedTw = typewriter({ body: screens.terminal.body, cps: 40, linePause: 0.6, holdEnd: 1.5, rows: 13 });
  let lastSpecKey = '';
  let lastRightKey = '';

  function tick(time, S) {
    const spec = specTw(time);
    if (spec.key !== lastSpecKey) {
      drawTerminal(specScreen, screens.spec.title, spec, HEX.amber, fonts);
      lastSpecKey = spec.key;
    }
    if (S.diffP > 0) {
      const key = `diff:${S.rev}:${Math.round(S.diffP * 60)}`;
      if (key !== lastRightKey) {
        drawCode(diffScreen, diffLines(screens.diff, S.rev), S.diffP, HEX.cyan, fonts);
        lastRightKey = key;
      }
    } else {
      const feed = feedTw(time);
      const key = `feed:${feed.key}`;
      if (key !== lastRightKey) {
        drawTerminal(diffScreen, screens.terminal.title, feed, HEX.cyan, fonts);
        lastRightKey = key;
      }
    }
  }
  // Force a redraw on the next tick (e.g. after web fonts load, or when the diff restarts).
  const invalidate = () => {
    lastSpecKey = '';
    lastRightKey = '';
  };
  // Reduced motion / before the first tick: finished spec + the tail of the log, no cursor.
  const drawStatic = () => {
    drawCode(specScreen, screens.spec, 1, HEX.amber, fonts);
    drawCode(
      diffScreen,
      { title: screens.terminal.title, body: screens.terminal.body.slice(-13) },
      1,
      HEX.cyan,
      fonts
    );
  };
  drawStatic();
  return { desk, tick, invalidate, drawStatic };
}
