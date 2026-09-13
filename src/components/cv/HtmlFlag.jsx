'use client';

import { useEffect } from 'react';

// Marks <html> while a /profile route is mounted so profile.css can force a dark
// color-scheme + void background outside the page's own box (overscroll, scrollbars).
export default function HtmlFlag() {
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute('data-cv', '');
    return () => html.removeAttribute('data-cv');
  }, []);
  return null;
}
