import { getCv, formatDate, formatRange, isInternship } from '@/lib/cv';
import './print.css';

const cv = getCv();

export const metadata = {
  title: 'CV · print',
  robots: { index: false, follow: false },
};

const short = (url) => url.replace(/^https?:\/\/(www\.)?/, '').replace(/\/$/, '');
const certName = (name) => name.replace(/^Microsoft Certified:\s*/, '');

// Rendered to out/cv.pdf by scripts/render-cv.mjs (Playwright, A4). Also prints cleanly from the browser.
export default function PrintPage() {
  const { basics, work, education, certificates, skills, projects, meta } = cv;
  const roles = work.filter((w) => !isInternship(w));
  const internships = work.filter(isInternship);

  return (
    <article className='cv-print'>
      <header className='p-head'>
        <div>
          <h1>{basics.name}</h1>
          <div className='p-label'>{basics.label}</div>
        </div>
        <ul className='p-contact'>
          <li>
            {basics.location.city}, {basics.location.countryCode}
          </li>
          <li>
            <a href={`mailto:${basics.email}`}>{basics.email}</a>
          </li>
          {basics.profiles.map((p) => (
            <li key={p.network}>
              <a href={p.url}>{short(p.url)}</a>
            </li>
          ))}
        </ul>
      </header>

      <section className='p-sec'>
        <h2>Summary</h2>
        <p className='p-summary'>{basics.summary}</p>
      </section>

      <section className='p-sec'>
        <h2>Experience</h2>
        {roles.map((w, i) => (
          <div className='p-item' key={`${w.name}-${w.position}-${i}`}>
            <div className='p-row'>
              <h3>
                {w.position} <span className='p-org'>· {w.name}</span>
              </h3>
              <span className='p-dates'>{formatRange(w.startDate, w.endDate)}</span>
            </div>
            <ul>
              {w.highlights?.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>
            {w.keywords?.length > 0 && <div className='p-tags'>{w.keywords.join(' · ')}</div>}
          </div>
        ))}
      </section>

      <section className='p-sec p-two'>
        <div>
          <h2>Skills</h2>
          {skills.map((g) => (
            <div className='p-skill' key={g.name}>
              <b>{g.name}</b> {g.keywords.join(', ')}
            </div>
          ))}
        </div>
        <div>
          <h2>Certificates</h2>
          <ul className='p-list'>
            {certificates.map((c) => (
              <li key={c.name}>
                <span>{certName(c.name)}</span>
                <span className='p-dates'>{formatDate(c.date)}</span>
              </li>
            ))}
          </ul>
          <h2>Education</h2>
          {education.map((e) => (
            <div className='p-item' key={e.institution}>
              <div className='p-row'>
                <h3>{e.institution}</h3>
                <span className='p-dates'>{formatRange(e.startDate, e.endDate)}</span>
              </div>
              <div className='p-org'>
                {e.studyType} · {e.area}
                {e.score && ` · ${e.score}`}
              </div>
            </div>
          ))}
          <h2>Early experience</h2>
          <ul className='p-list'>
            {internships.map((w) => (
              <li key={`${w.name}-${w.startDate}`}>
                <span>
                  {w.position} · {w.name}
                </span>
                <span className='p-dates'>{formatRange(w.startDate, w.endDate)}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className='p-sec'>
        <h2>Selected projects</h2>
        <ul className='p-projects'>
          {projects.map((p) => (
            <li key={p.name}>
              <b>{p.name}</b> <span className='p-org'>· {p.entity}</span> — {p.description}
            </li>
          ))}
        </ul>
      </section>

      <footer className='p-foot'>
        Generated from cv.json · v{meta.version} · {meta.lastModified} · {short(basics.url)}
      </footer>
    </article>
  );
}
