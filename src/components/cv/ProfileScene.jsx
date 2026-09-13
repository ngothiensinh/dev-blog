'use client';

import { useEffect, useRef, useState } from 'react';
import Hud from './Hud';
import { withBasePath } from '@/lib/cv';

const INITIAL_UI = { slide: 0, gateOn: false, shipOn: false };

const sameUi = (a, b) =>
  a.slide === b.slide && a.gateOn === b.gateOn && a.shipOn === b.shipOn;

// The hero HUD (slide 0, corner) is in the static HTML; three + gsap load after hydration.
// `data-static` collapses the 450vh track when motion is reduced or WebGL is unavailable.
export default function ProfileScene({ hud, basics, meta, contentId = 'content' }) {
  const canvasRef = useRef(null);
  const trackRef = useRef(null);
  const refs = useRef({ notes: {}, lines: {} });
  const engine = useRef(null);
  const [ui, setUi] = useState(INITIAL_UI);
  const [toast, setToast] = useState('');
  const [isStatic, setIsStatic] = useState(false);
  const [noWebgl, setNoWebgl] = useState(false);

  useEffect(() => {
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      new URLSearchParams(window.location.search).get('motion') === 'reduce';
    if (reduced) setIsStatic(true);

    let disposed = false;
    let toastTimer;
    const say = (msg, ms = 2200) => {
      setToast(msg);
      clearTimeout(toastTimer);
      toastTimer = setTimeout(() => setToast(''), ms);
    };

    import('./scene').then(({ createScene }) => {
      if (disposed || !canvasRef.current) return;
      const style = getComputedStyle(trackRef.current);
      const fonts = {
        mono: style.getPropertyValue('--font-mono').trim() || '"IBM Plex Mono", monospace',
        display:
          style.getPropertyValue('--font-display').trim() || '"Barlow Condensed", sans-serif',
      };
      const instance = createScene({
        canvas: canvasRef.current,
        track: trackRef.current,
        content: document.getElementById(contentId),
        refs: refs.current,
        hud,
        reduced,
        fonts,
        onState: (next) => setUi((prev) => (sameUi(prev, next) ? prev : next)),
        onToast: say,
      });
      if (!instance) {
        setNoWebgl(true);
        setIsStatic(true);
        return;
      }
      engine.current = instance;
    });

    return () => {
      disposed = true;
      clearTimeout(toastTimer);
      engine.current?.dispose();
      engine.current = null;
    };
  }, [hud, contentId]);

  return (
    <>
      <canvas
        ref={canvasRef}
        className='gl'
        aria-label='3D scene: an architect at a desk directing AI agents through design, build, review and ship'
        hidden={noWebgl}
      />
      <div ref={trackRef} className='scene-track' data-static={isStatic ? '' : undefined}>
        <Hud
          hud={hud}
          basics={basics}
          pdfHref={withBasePath(meta.pdf)}
          ui={ui}
          toast={toast}
          refs={refs.current}
          onApprove={() => engine.current?.approve()}
          onReject={() => engine.current?.reject()}
        />
      </div>
    </>
  );
}
