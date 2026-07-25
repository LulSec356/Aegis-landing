import * as THREE from "three";

export type CamKey = {
  t: number; // 0..1 scroll progress
  pos: [number, number, number];
  look: [number, number, number];
  fov: number;
};

// Narrative beats, condensed from the 10-scene brief into one continuous
// cinematic dolly/orbit path:
// 0.00 far establishing shot of the tower (Hero)
// 0.12 dolly in (Scene 1 - approach)
// 0.24 orbit right, title reveal (Scene 2 - Welcome)
// 0.38 push to entrance (Scene 3 - doors open)
// 0.50 rise + push into facade / interior glow (Scene 4 - lobby)
// 0.63 close orbit near core, data-plane reveal (Scene 5/6 - encryption/biometric)
// 0.78 slow retreat with glitch beat (Scene 7 - self-destruct)
// 0.88 wide pull-back, data racks glow (Scene 8/9 - backup/QR)
// 1.00 full pull-back to sky, logo reveal (Scene 10 - finale)
export const CAMERA_KEYS: CamKey[] = [
  { t: 0.0, pos: [0, 6, 42], look: [0, 10, 0], fov: 45 },
  { t: 0.12, pos: [0, 8, 30], look: [0, 12, 0], fov: 44 },
  { t: 0.24, pos: [10, 10, 22], look: [0, 13, 0], fov: 42 },
  { t: 0.38, pos: [4, 6, 14], look: [0, 8, 0], fov: 40 },
  { t: 0.5, pos: [-3, 5, 8], look: [0, 7, -2], fov: 38 },
  { t: 0.63, pos: [2, 4, 4], look: [0, 4, -6], fov: 36 },
  { t: 0.78, pos: [-2, 3, 3], look: [1, 3, -8], fov: 34 },
  { t: 0.88, pos: [6, 9, 16], look: [0, 9, 0], fov: 40 },
  { t: 1.0, pos: [0, 10, 46], look: [0, 14, 0], fov: 46 },
];

const tmpA = new THREE.Vector3();
const tmpB = new THREE.Vector3();

function findSegment(t: number) {
  const keys = CAMERA_KEYS;
  for (let i = 0; i < keys.length - 1; i++) {
    if (t >= keys[i].t && t <= keys[i + 1].t) {
      return { a: keys[i], b: keys[i + 1], i };
    }
  }
  return { a: keys[keys.length - 2], b: keys[keys.length - 1], i: keys.length - 2 };
}

// smoothstep easing per-segment for a cinematic ease-in/ease-out feel
function ease(x: number) {
  return x * x * (3 - 2 * x);
}

export function sampleCameraPath(
  progress: number,
  outPos: THREE.Vector3,
  outLook: THREE.Vector3
): number {
  const { a, b } = findSegment(progress);
  const span = b.t - a.t || 1;
  const localT = ease(Math.min(1, Math.max(0, (progress - a.t) / span)));

  tmpA.set(...a.pos);
  tmpB.set(...b.pos);
  outPos.copy(tmpA).lerp(tmpB, localT);

  tmpA.set(...a.look);
  tmpB.set(...b.look);
  outLook.copy(tmpA).lerp(tmpB, localT);

  return a.fov + (b.fov - a.fov) * localT;
}
