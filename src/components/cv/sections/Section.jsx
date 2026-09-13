import RichText from '../RichText';
import Reveal from '../Reveal';

export default function Section({ id, num, eyebrow, title, children }) {
  const titleId = `${id}-title`;
  return (
    <section id={id} className='sec' aria-labelledby={titleId}>
      <Reveal>
        <header className='sec-head'>
          <div className='eyebrow'>
            {num} · {eyebrow}
          </div>
          <h2 id={titleId}>
            <RichText text={title} />
          </h2>
        </header>
        {children}
      </Reveal>
    </section>
  );
}
