import * as THREE from 'three';

// Camera position + look-at are two Catmull-Rom curves through the same keyframes;
// scroll progress t/T_CAM scrubs both. Keys are the prototype's (wide -> desk -> board -> builders -> gate -> launchpad).
export const T_CAM = 5;

export const camKeys = [
  { p: [0, 4.6, 13.5], l: [0, 1.6, 0] },
  { p: [2.4, 2.5, 3.4], l: [0, 1.8, -0.7] },
  { p: [-2.6, 2.9, 4.4], l: [-5.4, 2.0, -1.6] },
  { p: [2.4, 2.8, 5.8], l: [5.6, 1.8, 0.4] },
  { p: [0.3, 3.1, 6.4], l: [0, 1.9, -0.2] },
  { p: [3.2, 3.4, 12.2], l: [-2, 1.4, 7] },
];

export const camPos = new THREE.CatmullRomCurve3(
  camKeys.map((k) => new THREE.Vector3(...k.p)),
  false,
  'catmullrom',
  0.35
);
export const camLook = new THREE.CatmullRomCurve3(
  camKeys.map((k) => new THREE.Vector3(...k.l)),
  false,
  'catmullrom',
  0.35
);

// High, slightly tilted wide shot the camera parks on while the CV sections scroll over the world.
export const PARK = { p: new THREE.Vector3(0, 9, 16), l: new THREE.Vector3(0, 0.5, 0) };

// Single frame used when motion is reduced.
export const STATIC = { p: new THREE.Vector3(0, 5.2, 14.5), l: new THREE.Vector3(0, 1.4, 0) };
