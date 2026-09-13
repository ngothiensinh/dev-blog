import * as THREE from 'three';
import { C } from './palette';

export const mat = (color, opts = {}) =>
  new THREE.MeshStandardMaterial({
    color,
    flatShading: true,
    roughness: 0.85,
    metalness: 0.05,
    ...opts,
  });

export function createMaterials() {
  return {
    steel: mat(C.steel),
    line: mat(C.line),
    dark: mat(C.dark),
    ink: mat(0x2a3446),
    amber: mat(C.amber, { roughness: 0.6 }),
    amberDark: mat(0xb8642c),
    skin: mat(0xffc9a0, { roughness: 0.7 }),
    glass: mat(C.dark, { roughness: 0.3, metalness: 0.4 }),
  };
}

export const box = (w, h, d, material, x = 0, y = 0, z = 0, shadow = true) => {
  const mesh = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), material);
  mesh.position.set(x, y, z);
  mesh.castShadow = shadow;
  mesh.receiveShadow = shadow;
  return mesh;
};

// Renderer, camera, lights, platform. Throws if WebGL is unavailable — caller falls back to the static hero.
export function createWorld(canvas, M) {
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
    alpha: false,
    powerPreference: 'high-performance',
  });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.1;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(C.void);
  scene.fog = new THREE.FogExp2(C.void, 0.038);

  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);

  scene.add(new THREE.HemisphereLight(0x7f93b8, 0x0b0e14, 0.9));
  const key = new THREE.DirectionalLight(0xfff1e0, 1.6);
  key.position.set(6, 10, 6);
  key.castShadow = true;
  key.shadow.mapSize.set(1024, 1024);
  key.shadow.camera.left = -14;
  key.shadow.camera.right = 14;
  key.shadow.camera.top = 14;
  key.shadow.camera.bottom = -14;
  key.shadow.bias = -0.0008;
  scene.add(key);
  const rim = new THREE.DirectionalLight(0x6fd3ff, 0.5);
  rim.position.set(-8, 4, -6);
  scene.add(rim);

  // floating platform + edge ring + grid
  const platform = new THREE.Mesh(new THREE.CylinderGeometry(11, 11.6, 0.7, 48), M.steel);
  platform.position.y = -0.35;
  platform.receiveShadow = true;
  scene.add(platform);
  const ring = new THREE.Mesh(
    new THREE.TorusGeometry(11.05, 0.05, 8, 96),
    new THREE.MeshBasicMaterial({ color: C.line })
  );
  ring.rotation.x = Math.PI / 2;
  ring.position.y = 0.01;
  scene.add(ring);
  const grid = new THREE.GridHelper(22, 22, 0x243044, 0x1a2230);
  grid.position.y = 0.015;
  grid.material.transparent = true;
  grid.material.opacity = 0.55;
  scene.add(grid);

  // zone rings on the floor: design (violet), build (teal), ship (cyan)
  for (const [x, z, r, col] of [
    [-6, -1.5, 3.2, C.violet],
    [5.5, 0, 3.2, C.teal],
    [-2, 7, 2.2, C.cyan],
  ]) {
    const zr = new THREE.Mesh(
      new THREE.RingGeometry(r - 0.03, r, 64),
      new THREE.MeshBasicMaterial({
        color: col,
        transparent: true,
        opacity: 0.25,
        side: THREE.DoubleSide,
      })
    );
    zr.rotation.x = -Math.PI / 2;
    zr.position.set(x, 0.02, z);
    scene.add(zr);
  }

  return { renderer, scene, camera };
}
