import * as THREE from 'three';
import { C } from './palette';
import { screenTex, drawSpecCard } from './textures';

// Spec card + the lines that carry work around the platform:
// amber dashed path (desk -> Planner -> Architect), violet beams (Architect -> Builders),
// teal returns (Builders -> Reviewer -> desk).
export function createPaths(scene, A, glowTex, fonts, specCard) {
  const specTex = screenTex(256, 160);
  const redraw = () => drawSpecCard(specTex, specCard, fonts);
  redraw();
  const spec = new THREE.Mesh(
    new THREE.PlaneGeometry(0.72, 0.45),
    new THREE.MeshBasicMaterial({ map: specTex.tex, side: THREE.DoubleSide })
  );
  spec.scale.setScalar(0.001);
  scene.add(spec);
  const specGlow = new THREE.Sprite(
    new THREE.SpriteMaterial({
      map: glowTex,
      color: C.amber,
      transparent: true,
      opacity: 0.5,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  specGlow.scale.set(1.8, 1.8, 1);
  spec.add(specGlow);

  const specPath = new THREE.CatmullRomCurve3([
    new THREE.Vector3(0.45, 1.55, -0.55),
    new THREE.Vector3(0.2, 2.9, -0.4),
    new THREE.Vector3(-2.4, 3.2, -1.2),
    A.planner.homeV.clone().add(new THREE.Vector3(0.6, -0.1, 0.3)),
    A.arch.homeV.clone().add(new THREE.Vector3(0.5, -0.2, 0.5)),
  ]);
  const pathLine = new THREE.Line(
    new THREE.BufferGeometry().setFromPoints(specPath.getPoints(80)),
    new THREE.LineDashedMaterial({
      color: C.amber,
      dashSize: 0.18,
      gapSize: 0.12,
      transparent: true,
      opacity: 0.6,
    })
  );
  pathLine.computeLineDistances();
  pathLine.geometry.setDrawRange(0, 0);
  scene.add(pathLine);

  const beams = ['b1', 'b2'].map((id) => {
    const pts = new THREE.CatmullRomCurve3([
      A.arch.homeV.clone(),
      new THREE.Vector3(0, 4.6, 0.5),
      A[id].homeV.clone(),
    ]).getPoints(60);
    const l = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: C.violet, transparent: true, opacity: 0.7 })
    );
    l.geometry.setDrawRange(0, 0);
    scene.add(l);
    return l;
  });

  const returns = ['b1', 'b2'].map((id) => {
    const pts = new THREE.CatmullRomCurve3([
      A[id].homeV.clone(),
      A.rev.homeV.clone(),
      new THREE.Vector3(0.6, 1.9, -1.1),
    ]).getPoints(60);
    const l = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(pts),
      new THREE.LineBasicMaterial({ color: C.teal, transparent: true, opacity: 0.6 })
    );
    l.geometry.setDrawRange(0, 0);
    scene.add(l);
    return l;
  });

  return { spec, specPath, pathLine, beams, returns, redraw };
}
