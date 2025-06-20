import siteMetadata from '../../../data/siteMetadata';
import Link from '../Link';
import MobileNav from './MobileNav';
import ThemeSwitch from '../ThemeSwitch';
import SearchButton from '../SearchButton';
import headerNavLinks from './navLink';
import Image from 'next/image';

const Header = () => {
  return (
    <header className='flex items-center justify-between py-10'>
      <div>
        <Link href='/profile' aria-label={siteMetadata.headerTitle}>
          <div className='flex items-center justify-between'>
            <div className='mr-3'>
              <Image
                src='/dev-blog/images/avatar.jpg'
                width={100}
                height={100}
                alt='avatar'
                className='h-12 w-12 rounded-full shadow-lg shadow-primary-500'
              />
            </div>
            {typeof siteMetadata.headerTitle === 'string' ? (
              <div className='hidden h-6 text-2xl font-semibold sm:block'>
                {siteMetadata.headerTitle}
              </div>
            ) : (
              siteMetadata.headerTitle
            )}
          </div>
        </Link>
      </div>
      <div className='flex items-center space-x-4 leading-5 sm:space-x-6'>
        {headerNavLinks
          .filter((link) => link.href !== '/')
          .map((link) => (
            <Link
              key={link.title}
              href={link.href}
              className='hidden font-medium text-gray-900 dark:text-gray-100 sm:block'
            >
              {link.title}
            </Link>
          ))}
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  );
};

export default Header;
