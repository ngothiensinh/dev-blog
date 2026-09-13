import { Fragment } from 'react';

const TOKEN = /(<br\s*\/?>|<em>[\s\S]*?<\/em>)/g;

// Copy in cv.json / hud.json may carry one amber <em> and line breaks; nothing else is interpreted.
export default function RichText({ text }) {
  return text.split(TOKEN).map((part, i) => {
    if (!part) return null;
    if (part.startsWith('<br')) return <br key={i} />;
    if (part.startsWith('<em>')) return <em key={i}>{part.slice(4, -5)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
