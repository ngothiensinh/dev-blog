import Link from '@/components/Link';
import { withBasePath } from '@/lib/cv';

export default function Contact({ basics, meta, footer, download, lede }) {
  return (
    <div className='contact'>
      {lede && <p className='contact-lede'>{lede}</p>}
      <div className='contact-links'>
        <span>
          <span className='k'>email</span>
          <Link href={`mailto:${basics.email}`}>{basics.email}</Link>
        </span>
        {basics.profiles?.map((p) => (
          <span key={p.network}>
            <span className='k'>{p.network}</span>
            <Link href={p.url}>{p.username}</Link>
          </span>
        ))}
      </div>
      <a className='btn primary' href={withBasePath(meta.pdf)} download>
        {download}
      </a>
      <div className='foot'>
        <span>{footer.line}</span>
        <Link href={meta.repo}>{footer.repoLabel}</Link>
        <Link href={meta.actions}>{footer.actionsLabel}</Link>
        <span>· v{meta.version}</span>
        <Link href='/'>{footer.backToBlog}</Link>
      </div>
    </div>
  );
}
