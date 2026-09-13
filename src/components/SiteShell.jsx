import Header from '@/components/nav/Header';
import SectionContainer from '@/components/SectionContainer';
import Footer from '@/components/Footer';

export default function SiteShell({ children }) {
  return (
    <SectionContainer>
      <div className='flex h-screen flex-col justify-between font-sans'>
        <Header />
        <main className='mb-auto'>{children}</main>
        <Footer />
      </div>
    </SectionContainer>
  );
}
