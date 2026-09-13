import Link from '@/components/Link';
import { formatRange, isCurrent } from '@/lib/cv';

export default function Experience({ work }) {
  return (
    <ol className='tl'>
      {work.map((w, i) => {
        const current = isCurrent(w);
        return (
          <li
            key={`${w.name}-${w.position}-${i}`}
            className={`tl-item${current ? ' current' : ''}`}
          >
            <div className='tl-meta'>
              <span className={current ? 'now' : undefined}>
                {formatRange(w.startDate, w.endDate)}
              </span>
              {w.location && <> · {w.location}</>}
            </div>
            <h3 className='tl-role'>{w.position}</h3>
            <div className='tl-org'>
              {w.url ? <Link href={w.url}>{w.name}</Link> : w.name}
            </div>
            {w.highlights?.length > 0 && (
              <ul className='tl-list'>
                {w.highlights.map((h) => (
                  <li key={h}>{h}</li>
                ))}
              </ul>
            )}
            {w.keywords?.length > 0 && (
              <div className='tl-tags'>{w.keywords.join(' · ')}</div>
            )}
          </li>
        );
      })}
    </ol>
  );
}
