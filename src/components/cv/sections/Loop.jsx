import ScrollTrack from '../ScrollTrack';

// The AI-native delivery loop: six stages, what agents do vs. what I do, and my three roles above it.
export default function Loop({ loop }) {
  return (
    <div className='loop-wrap'>
      <p className='lead'>{loop.lede}</p>
      <ScrollTrack>
      <ol className='loop'>
        {loop.stages.map((s, i) => (
          <li key={s.name} className='loop-stage' data-step>
            <div className='loop-name'>
              <span className='loop-idx'>{String(i + 1).padStart(2, '0')}</span>
              {s.name}
            </div>
            <div className='loop-cols'>
              <div>
                <span className='k'>agents</span>
                {s.agents}
              </div>
              <div>
                <span className='k me'>me</span>
                {s.me}
              </div>
            </div>
          </li>
        ))}
      </ol>
      </ScrollTrack>
      <div className='roles'>
        {loop.roles.map((r) => (
          <div key={r.name} className='role'>
            <div className='eyebrow'>{r.name}</div>
            <p>{r.text}</p>
          </div>
        ))}
      </div>
      <p className='lead outro'>{loop.outro}</p>
    </div>
  );
}
