# Aegis Secure Chat — Cinematic Landing Page

A scroll-driven, cinematic 3D landing page built with Next.js, React Three Fiber, GSAP ScrollTrigger, and Lenis smooth scroll.

## Setup

```bash
npm install
npm run dev
```

Open http://localhost:3000

## Architecture

- **Persistent 3D canvas** (`components/scene/Scene.tsx`): a single React Three Fiber `<Canvas>` stays mounted behind the whole page. A procedural glass tower (`Tower.tsx`, instanced emissive windows, no external 3D models), a particle fog/dust field (`Atmosphere.tsx`), two idle-flight drones (`Drone.tsx`), and a silhouette skyline (`CityBackdrop.tsx`) live inside it.
- **Scroll-driven camera** (`lib/camera-path.ts`, `components/scene/CameraRig.tsx`): scroll progress (0–1) is sampled every frame against a set of cinematic camera keyframes (position/lookAt/FOV), smoothed with exponential damping plus subtle mouse parallax — this is what turns scrolling into "camera dolly through a building."
- **Smooth scroll** (`components/SmoothScroll.tsx`): Lenis drives an eased scroll feel, ticked from GSAP's ticker so ScrollTrigger and Lenis stay in sync.
- **Shared scroll store** (`lib/scroll-store.ts`): a tiny pub/sub store (not React state) so the R3F render loop can read scroll progress every frame without re-render overhead, while DOM components (the signal rail, section reveals) subscribe normally.
- **Sections** (`components/sections/*`): each narrative beat from the brief (Welcome reveal, Access gate, Lobby, Encryption chamber + biometric scan, Self-destruct countdown, Backup racks, QR auth, Finale) is a DOM overlay animated with GSAP ScrollTrigger, composited over the persistent WebGL canvas — this is deliberate: modeling all ten rooms as unique 3D geometry would tank frame rate, so heavy narrative/data beats (matrix rain, fingerprint scan, glitch, QR) are canvas/SVG/CSS while the continuous 3D layer supplies the "moving through a building" feeling underneath.
- **Postprocessing**: bloom, vignette, and film grain via `@react-three/postprocessing`, kept to a single low-cost pass.

## Notes on this build

- Fonts use system stacks, not Google Fonts — the sandbox this was built in has no network access to fonts.googleapis.com. To restore the originally-designed type pairing, install `next/font/google` with `Space Grotesk` (display), `Inter` (body), `JetBrains Mono` (data/labels) once you have normal network access, and reinstate the `variable` classes in `app/layout.tsx`.
- The QR code and fingerprint graphics are stylized/decorative, not functional codes.
- Tune `CAMERA_KEYS` in `lib/camera-path.ts` to adjust the camera's path — each keyframe is `{ t, pos, look, fov }` on a 0–1 scroll timeline.
- Performance: instancing is used for the tower's windows; the effect composer runs a single low-res bloom pass; consider lowering `dpr` in `Scene.tsx` further for lower-end devices.
