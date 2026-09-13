import { formatRange } from '@/lib/cv';

// Education + internships, newest first, in the compact timeline treatment.
export default function History({ education, internships }) {
  const items = [
    ...education.map((e) => ({
      key: `edu-${e.institution}`,
      start: e.startDate,
      end: e.endDate,
      meta: e.institution,
      role: `${e.studyType} · ${e.area}`,
      detail: e.score ? `Grade: ${e.score}` : null,
    })),
    ...internships.map((w) => ({
      key: `int-${w.name}-${w.startDate}`,
      start: w.startDate,
      end: w.endDate,
      meta: `${w.name}${w.location ? ` · ${w.location}` : ''}`,
      role: w.position,
      detail: w.highlights?.[0] ?? w.summary ?? null,
    })),
  ].sort((a, b) => (a.start < b.start ? 1 : -1));

  return (
    <ol className='tl compact'>
      {items.map((it) => (
        <li key={it.key} className='tl-item'>
          <div className='tl-meta'>{formatRange(it.start, it.end)}</div>
          <h3 className='tl-role'>{it.role}</h3>
          <div className='tl-org'>{it.meta}</div>
          {it.detail && (
            <ul className='tl-list'>
              <li>{it.detail}</li>
            </ul>
          )}
        </li>
      ))}
    </ol>
  );
}
