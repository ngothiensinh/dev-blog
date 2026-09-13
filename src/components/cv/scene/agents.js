import * as THREE from 'three';
import { C } from './palette';

export const AGENT_DEFS = [
  { id: 'planner', name: 'Planner', color: C.cyan, home: [-4.4, 2.3, -0.6] },
  { id: 'arch', name: 'Architect', color: C.violet, home: [-5.6, 2.6, 1.4] },
  { id: 'b1', name: 'Builder α', color: C.teal, home: [4.6, 2.5, 2.6] },
  { id: 'b2', name: 'Builder β', color: C.teal, home: [6.2, 2.7, 0.2] },
  { id: 'rev', name: 'Reviewer', color: C.cyan, home: [2.6, 3.1, 3.2] },
  { id: 'ops', name: 'Ops', color: C.cyan, home: [-3.2, 2.6, 6.2] },
];

// Agent drone: emissive icosahedron core + wireframe shell + halo ring + additive glow sprite.
export function createAgents(scene, glowTex) {
  const agents = AGENT_DEFS.map((d, i) => {
    const g = new THREE.Group();
    const core = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.3, 0),
      new THREE.MeshStandardMaterial({
        color: d.color,
        emissive: d.color,
        emissiveIntensity: 0.9,
        flatShading: true,
        roughness: 0.4,
      })
    );
    core.castShadow = true;
    g.add(core);
    const shell = new THREE.Mesh(
      new THREE.IcosahedronGeometry(0.46, 1),
      new THREE.MeshStandardMaterial({
        color: 0x1c2331,
        flatShading: true,
        roughness: 0.9,
        transparent: true,
        opacity: 0.55,
        wireframe: true,
      })
    );
    g.add(shell);
    const halo = new THREE.Mesh(
      new THREE.TorusGeometry(0.62, 0.02, 8, 48),
      new THREE.MeshBasicMaterial({ color: d.color, transparent: true, opacity: 0.7 })
    );
    halo.rotation.x = Math.PI / 2.4;
    g.add(halo);
    const glow = new THREE.Sprite(
      new THREE.SpriteMaterial({
        map: glowTex,
        color: d.color,
        transparent: true,
        opacity: 0.45,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      })
    );
    glow.scale.set(2.2, 2.2, 1);
    g.add(glow);
    g.position.fromArray(d.home);
    scene.add(g);
    return {
      ...d,
      g,
      core,
      halo,
      glow,
      homeV: new THREE.Vector3().fromArray(d.home),
      phase: i * 1.3,
    };
  });
  const A = Object.fromEntries(agents.map((a) => [a.id, a]));
  return { agents, A };
}
