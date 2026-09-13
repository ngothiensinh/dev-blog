import RichText from './RichText';

// Phase index for the rail, mirroring the prototype: steps 1-2 Inception, 3-4 Construction, 5 Operations.
const phaseFor = (step) => (step <= 2 ? 0 : step <= 4 ? 1 : 2);

export default function Hud({
  hud,
  basics,
  pdfHref,
  ui,
  toast,
  refs,
  onApprove,
  onReject,
}) {
  const { slide, step, gateOn, shipOn } = ui;
  const activePhase = phaseFor(step);
  let stepNo = 0;

  return (
    <div className='hud'>
      <svg className='leaders' aria-hidden='true' ref={(el) => (refs.leaders = el)}>
        {hud.notes.map((n) => (
          <line
            key={n.id}
            ref={(el) => (refs.lines[n.id] = el)}
            stroke='#3a4a63'
            strokeWidth='1'
            opacity='0'
          />
        ))}
      </svg>

      <div className='corner'>
        <strong>{basics.name}</strong>
        {hud.corner.role}
      </div>

      <nav className='rail' aria-label={hud.rail.label}>
        <div className='fill' ref={(el) => (refs.railFill = el)} />
        {hud.rail.phases.map((p, pi) => (
          <div key={p.name} className={`phase${activePhase === pi ? ' on' : ''}`}>
            <span>{p.name}</span>
            <div className='steps'>
              {p.steps.map((s) => {
                stepNo += 1;
                const k = stepNo;
                return (
                  <span key={s} className={k === step ? 'on' : k < step ? 'done' : ''}>
                    {s}
                  </span>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className='head'>
        {hud.slides.map((s, i) => (
          <div key={s.eyebrow} className={`slide${i === slide ? ' on' : ''}`}>
            <div className='eyebrow'>{s.eyebrow}</div>
            <h1>
              <RichText text={s.title} />
            </h1>
            <p>{s.body}</p>
          </div>
        ))}
      </div>

      {hud.notes.map((n) => (
        <div
          key={n.id}
          className={`note ${n.tone}`}
          ref={(el) => (refs.notes[n.id] = el)}
        >
          <b>{n.label}</b>
          <span className='note-full'>{n.text}</span>
          <span className='note-short'>{n.short ?? n.text}</span>
          {n.sub && (
            <>
              <br />
              <small>{n.sub}</small>
            </>
          )}
        </div>
      ))}

      <div className={`toast${toast ? ' on' : ''}`} role='status'>
        {toast}
      </div>
      <div className={`ctrl${gateOn ? ' on' : ''}`} aria-hidden={!gateOn}>
        <button className='btn' type='button' onClick={onReject} tabIndex={gateOn ? 0 : -1}>
          {hud.gate.reject}
        </button>
        <button
          className='btn primary'
          type='button'
          onClick={onApprove}
          tabIndex={gateOn ? 0 : -1}
        >
          {hud.gate.approve}
        </button>
      </div>
      <div className={`ctrl${shipOn ? ' on' : ''}`} aria-hidden={!shipOn}>
        <a className='btn primary' href={pdfHref} download tabIndex={shipOn ? 0 : -1}>
          {hud.ship.download}
        </a>
      </div>

      <div className='hint' ref={(el) => (refs.hint = el)}>
        {hud.hint}
      </div>
    </div>
  );
}
