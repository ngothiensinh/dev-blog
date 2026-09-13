import Link from '@/components/Link';
import { formatDate, latestCertificate } from '@/lib/cv';

export default function Certifications({ certificates }) {
  const latest = latestCertificate(certificates);
  return (
    <ul className='certs'>
      {certificates.map((c) => (
        <li key={c.name} className={`cert${c === latest ? ' latest' : ''}`}>
          <span className='cert-name'>{c.name}</span>
          <span className='cert-meta'>
            {c.issuer} · {formatDate(c.date)}
            {c.url && (
              <>
                {' · '}
                <Link href={c.url}>credential</Link>
              </>
            )}
          </span>
        </li>
      ))}
    </ul>
  );
}
