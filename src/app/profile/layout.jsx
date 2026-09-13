import { Barlow_Condensed, IBM_Plex_Mono } from 'next/font/google';
import HtmlFlag from '@/components/cv/HtmlFlag';
import './profile.css';

const display = Barlow_Condensed({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500', '600'],
  display: 'swap',
  variable: '--font-display',
});

const mono = IBM_Plex_Mono({
  subsets: ['latin', 'latin-ext'],
  weight: ['400', '500'],
  display: 'swap',
  variable: '--font-mono',
});

// /profile and /profile/print share fonts + tokens; each page paints its own background.
export default function ProfileLayout({ children }) {
  return (
    <div data-cv-root className={`${display.variable} ${mono.variable}`}>
      <HtmlFlag />
      {children}
    </div>
  );
}
