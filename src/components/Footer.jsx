import Link from './Link';
import siteMetadata from '../../data/siteMetadata';
import SocialIcon from '@/components/social-icons';

export default function Footer() {
  return (
    <footer>
      <div className='mt-16 flex flex-col items-center'>
        <div className='mb-3 flex space-x-4'>
          <SocialIcon
            kind='mail'
            href={`mailto:${siteMetadata.info.email}`}
            size={6}
          />
          <SocialIcon kind='github' href={siteMetadata.info.github} size={6} />
          <SocialIcon
            kind='facebook'
            href={siteMetadata.info.facebook}
            size={6}
          />
          {/* <SocialIcon
            kind='youtube'
            href={siteMetadata.info.youtube}
            size={6}
          /> */}
          <SocialIcon
            kind='linkedin'
            href={siteMetadata.info.linkedin}
            size={6}
          />
          {/* <SocialIcon
            kind='twitter'
            href={siteMetadata.info.twitter}
            size={6}
          /> */}
        </div>
        <div className='mb-2 flex space-x-2 text-sm text-gray-500 dark:text-gray-400'>
          <div>{siteMetadata.info.author}</div>
          <div>{` • `}</div>
          <div>{`© ${new Date().getFullYear()}`}</div>
          <div>{` • `}</div>
          <Link href='/'>{siteMetadata.title}</Link>
        </div>
        <div className='mb-8 text-sm text-gray-500 dark:text-gray-400'>
          <Link href='https://github.com/timlrx/tailwind-nextjs-starter-blog'>
            Powered by NextJs starter blog and MDX
          </Link>
        </div>
      </div>
    </footer>
  );
}
