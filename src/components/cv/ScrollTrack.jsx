'use client';

import { useEffect, useRef } from 'react';

// Wraps a list of [data-step] items. As the page scrolls, items above the reading line (focus × viewport
// height) become .step-done, the last of them .step-active, and --fill (px) grows for the track line.
export default function ScrollTrack({ children, className = '', focus = 0.45 }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return undefined;
    let raf = 0;
    const update = () => {
      raf = 0;
      const rect = el.getBoundingClientRect();
      const focusY = window.innerHeight * focus;
      el.style.setProperty('--fill', `${Math.max(0, Math.min(rect.height, focusY - rect.top))}px`);
      const steps = el.querySelectorAll('[data-step]');
      let active = -1;
      steps.forEach((s, i) => {
        if (s.getBoundingClientRect().top <= focusY) active = i;
      });
      steps.forEach((s, i) => {
        s.classList.toggle('step-done', i < active);
        s.classList.toggle('step-active', i === active);
      });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, [focus]);

  return (
    <div ref={ref} className={`track ${className}`.trim()}>
      {children}
    </div>
  );
}
