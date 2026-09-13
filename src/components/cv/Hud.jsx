import RichText from './RichText';

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
  const { slide, gateOn, shipOn } = ui;

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
