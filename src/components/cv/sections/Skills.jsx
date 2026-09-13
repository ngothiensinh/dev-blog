export default function Skills({ skills }) {
  return (
    <div className='skills'>
      {skills.map((group) => (
        <div key={group.name} className='skill-group'>
          <div className='eyebrow'>{group.name}</div>
          <ul>
            {group.keywords.map((k) => (
              <li key={k}>{k}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
