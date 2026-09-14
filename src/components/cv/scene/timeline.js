import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// t runs 0..T_END over the pinned track. The camera rail finishes at T_CAM=5 and holds while the
// crate rises (5.15..5.9), so the ship beat (t > 5.4) is reachable.
export const T_END = 5.9;

export function createState() {
  return {
    t: 0,
    specVis: 0,
    specP: 0,
    boardP: 0,
    beamP: 0,
    typeP: 0,
    retP: 0,
    converge: 0,
    diffP: 0,
    crateP: 0,
    parkP: 0,
    opsP: 0,
    rev: 1,
  };
}

// When each annotation shows (in t) and its screen-space offset from the anchored object.
export const NOTE_TIMING = {
  spec: { off: [40, -60], from: 0.8, to: 2.35 },
  planner: { off: [-210, -70], from: 1.9, to: 2.9 },
  arch: { off: [40, -80], from: 2.2, to: 3.0 },
  b1: { off: [-220, 40], from: 3.0, to: 3.85 },
  b2: { off: [30, -70], from: 3.0, to: 3.85 },
  rev: { off: [30, -70], from: 3.6, to: 4.1 },
  me: { off: [-230, -50], from: 4.05, to: 4.85 },
  ops: { off: [-200, -70], from: 5.15, to: 6 },
  crate: { off: [40, -50], from: 5.45, to: 6 },
};

// A: the pinned scene (scrub over the 450vh track). B: park/dim the world as the content arrives.
// C: Ops drifts down the right edge across the content.
export function buildTimeline(S, { track, content }) {
  const tl = gsap.timeline({
    scrollTrigger: { trigger: track, start: 'top top', end: 'bottom bottom', scrub: 0.9 },
  });
  tl.to(S, { t: T_END, duration: T_END, ease: 'none' }, 0)
    .to(S, { specVis: 1, duration: 0.35, ease: 'power2.out' }, 0.75)
    .to(S, { specP: 1, duration: 1.15, ease: 'power1.inOut' }, 1.15)
    .to(S, { boardP: 1, duration: 0.9, ease: 'none' }, 1.95)
    .to(S, { beamP: 1, duration: 0.45, ease: 'power1.inOut' }, 2.85)
    .to(S, { typeP: 1, duration: 0.75, ease: 'none' }, 3.05)
    .to(S, { retP: 1, duration: 0.4, ease: 'power1.inOut' }, 3.6)
    .to(S, { converge: 1, duration: 0.45, ease: 'power2.inOut' }, 3.85)
    .to(S, { diffP: 1, duration: 0.5, ease: 'none' }, 4.15)
    .to(S, { converge: 0, duration: 0.4, ease: 'power2.inOut' }, 4.85)
    .to(S, { crateP: 1, duration: 0.75, ease: 'power2.out' }, 5.15);

  const tweens = [tl];
  if (content) {
    tweens.push(
      gsap.to(S, {
        parkP: 1,
        ease: 'none',
        scrollTrigger: { trigger: content, start: 'top bottom', end: 'top top', scrub: true },
      }),
      gsap.to(S, {
        opsP: 1,
        ease: 'none',
        scrollTrigger: { trigger: content, start: 'top top', end: 'bottom bottom', scrub: true },
      })
    );
  }

  return {
    kill() {
      tweens.forEach((tw) => {
        tw.scrollTrigger?.kill();
        tw.kill();
      });
    },
  };
}

