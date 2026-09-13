import * as THREE from 'three';
import { C, HEX } from './palette';
import { box } from './world';
import { screenTex, drawCode, drawBoard, drawCrate, holoPlane } from './textures';

// Design board (Inception): the C4 diagram draws itself as boardP goes 0..1.
export function createBoard(scene, M, fonts, content) {
  const board = new THREE.Group();
  board.position.set(-6.4, 0, -2.2);
  board.rotation.y = 0.85;
  board.add(box(3.4, 2.1, 0.08, M.dark, 0, 2.0, 0));
  for (const x of [-1.5, 1.5]) board.add(box(0.07, 2.0, 0.07, M.line, x, 1.0, 0, false));
  const boardTex = screenTex(680, 420);
  const plane = new THREE.Mesh(
    new THREE.PlaneGeometry(3.2, 1.95),
    new THREE.MeshBasicMaterial({ map: boardTex.tex })
  );
  plane.position.set(0, 2.0, 0.05);
  board.add(plane);
  scene.add(board);

  const draw = (p) => drawBoard(boardTex, p, content, fonts);
  draw(0);
  return { board, draw };
}

// Builders' terminals (Construction): two holo screens that type code and end on green tests.
export function createTerminals(scene, M, fonts, screens) {
  const termA = screenTex();
  const termB = screenTex();
  const terminal = (tex, x, z, ry) => {
    const g = new THREE.Group();
    g.position.set(x, 0, z);
    g.rotation.y = ry;
    g.add(box(0.5, 1.1, 0.5, M.dark, 0, 0.55, 0));
    const p = holoPlane(1.6, 1.0, tex);
    p.position.set(0, 1.85, 0);
    g.add(p);
    scene.add(g);
    return g;
  };
  terminal(termA.tex, 5.2, 1.7, -0.75);
  terminal(termB.tex, 6.4, -1.4, -0.6);

  const draw = (typeP) => {
    drawCode(termA, screens.termA, typeP, HEX.teal, fonts);
    drawCode(termB, screens.termB, Math.max(0, typeP * 1.15 - 0.1), HEX.teal, fonts);
  };
  draw(0);
  return { draw };
}

// Launchpad (Operations): the cv.pdf crate rises in a light beam as crateP goes 0..1.
export function createLaunchpad(scene, M, fonts, content) {
  const pad = new THREE.Group();
  pad.position.set(-2, 0, 7);
  const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.6, 0.25, 32), M.dark);
  base.position.y = 0.12;
  base.receiveShadow = true;
  pad.add(base);
  const padRing = new THREE.Mesh(
    new THREE.TorusGeometry(1.5, 0.03, 8, 64),
    new THREE.MeshBasicMaterial({ color: C.cyan })
  );
  padRing.rotation.x = Math.PI / 2;
  padRing.position.y = 0.26;
  pad.add(padRing);

  const crateTex = screenTex(256, 256);
  const redraw = () => drawCrate(crateTex, content, fonts);
  redraw();
  const crate = new THREE.Mesh(
    new THREE.BoxGeometry(0.9, 0.9, 0.9),
    new THREE.MeshStandardMaterial({ map: crateTex.tex, flatShading: true, roughness: 0.6 })
  );
  crate.castShadow = true;
  crate.position.y = -0.5;
  pad.add(crate);

  const beam = new THREE.Mesh(
    new THREE.CylinderGeometry(1.2, 1.4, 6, 32, 1, true),
    new THREE.MeshBasicMaterial({
      color: C.cyan,
      transparent: true,
      opacity: 0,
      side: THREE.DoubleSide,
      depthWrite: false,
      blending: THREE.AdditiveBlending,
    })
  );
  beam.position.y = 3.2;
  pad.add(beam);
  scene.add(pad);

  return { pad, crate, beam, padRing, redraw };
}
