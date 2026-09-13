import * as THREE from 'three';
import { C, HEX } from './palette';
import { box } from './world';
import { screenTex, drawCode, holoPlane } from './textures';

// The only warm object in the scene: me, seated at the desk, facing -z.
export function createHuman(scene, M, glowTex) {
  const human = new THREE.Group();
  human.position.set(0, 0, 0.35);
  // chair
  human.add(box(0.9, 0.12, 0.9, M.dark, 0, 0.85, 0.25));
  human.add(box(0.9, 1.0, 0.1, M.dark, 0, 1.35, 0.68));
  human.add(box(0.08, 0.85, 0.08, M.line, 0, 0.42, 0.25, false));
  human.add(box(0.7, 0.06, 0.7, M.line, 0, 0.03, 0.25, false));
  // legs (seated)
  for (const sx of [-1, 1]) {
    human.add(box(0.26, 0.26, 0.72, M.amberDark, sx * 0.19, 1.02, -0.15));
    human.add(box(0.24, 0.8, 0.24, M.amberDark, sx * 0.19, 0.55, -0.5));
    human.add(box(0.26, 0.12, 0.42, M.dark, sx * 0.19, 0.08, -0.6));
  }
  // torso (hoodie)
  human.add(box(0.86, 0.95, 0.5, M.amber, 0, 1.6, 0.05));
  human.add(box(0.5, 0.2, 0.3, M.amber, 0, 2.1, 0.1));
  // arms reaching to the keyboard
  for (const sx of [-1, 1]) {
    const up = box(0.22, 0.55, 0.22, M.amber, sx * 0.56, 1.75, -0.05);
    up.rotation.x = -0.5;
    human.add(up);
    const fore = box(0.2, 0.55, 0.2, M.amber, sx * 0.5, 1.4, -0.42);
    fore.rotation.x = -1.35;
    human.add(fore);
    human.add(box(0.18, 0.1, 0.22, M.skin, sx * 0.48, 1.24, -0.7));
  }
  // head, glasses, hair
  const head = new THREE.Mesh(new THREE.DodecahedronGeometry(0.34, 0), M.skin);
  head.position.set(0, 2.45, 0.05);
  head.castShadow = true;
  human.add(head);
  human.add(box(0.72, 0.16, 0.07, M.glass, 0, 2.48, -0.28, false));
  human.add(box(0.62, 0.22, 0.6, M.dark, 0, 2.7, 0.06));
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

// Desk with two holo monitors: left shows spec.md, right shows the PR diff.
export function createDesk(scene, M, fonts, screens) {
  const desk = new THREE.Group();
  desk.position.set(0, 0, -0.85);
  desk.add(box(2.8, 0.08, 1.1, M.dark, 0, 1.05, 0));
  for (const [x, z] of [
    [-1.3, -0.45],
    [1.3, -0.45],
    [-1.3, 0.45],
    [1.3, 0.45],
  ]) {
    desk.add(box(0.06, 1.02, 0.06, M.line, x, 0.51, z, false));
  }
  desk.add(box(1.1, 0.03, 0.36, M.line, 0, 1.1, 0.25, false)); // keyboard
  const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.08, 0.2, 10), M.ink);
  mug.position.set(0.95, 1.19, 0.25);
  mug.castShadow = true;
  desk.add(mug);

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

  const drawSpec = () => drawCode(specScreen, screens.spec, 1, HEX.amber, fonts);
  const drawDiff = (p, rev) => drawCode(diffScreen, diffLines(screens.diff, rev), p, HEX.cyan, fonts);
  drawSpec();
  drawDiff(0, 1);
  return { desk, drawSpec, drawDiff };
}
