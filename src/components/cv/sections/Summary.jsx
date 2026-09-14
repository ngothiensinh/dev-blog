import RichText from '../RichText';

// Short first-person summary (kept under 70 words in hud.json).
export default function Summary({ text }) {
  return (
    <p className='lead summary'>
      <RichText text={text} />
    </p>
  );
}
