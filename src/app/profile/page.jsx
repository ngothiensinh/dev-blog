import { getCv, getHud, isInternship } from '@/lib/cv';
import ProfileScene from '@/components/cv/ProfileScene';
import Section from '@/components/cv/sections/Section';
import Experience from '@/components/cv/sections/Experience';
import Certifications from '@/components/cv/sections/Certifications';
import History from '@/components/cv/sections/History';
import Skills from '@/components/cv/sections/Skills';
import Contact from '@/components/cv/sections/Contact';
import Summary from '@/components/cv/sections/Summary';

const cv = getCv();
const hud = getHud();
const sectionById = (id) => hud.sections.find((s) => s.id === id);

export const metadata = {
  title: 'Profile',
  description: cv.basics.summary,
};

export default function ProfilePage() {
  const work = cv.work.filter((w) => !isInternship(w));
  const internships = cv.work.filter(isInternship);

  return (
    <>
      <ProfileScene hud={hud} basics={cv.basics} meta={cv.meta} />
      <main id='content' className='sections'>
        <Section {...sectionById('summary')}>
          <Summary text={hud.summary.body} />
        </Section>
        <Section {...sectionById('experience')}>
          <Experience work={work} />
        </Section>
        <Section {...sectionById('certifications')}>
          <Certifications certificates={cv.certificates} />
        </Section>
        <Section {...sectionById('history')}>
          <History education={cv.education} internships={internships} />
        </Section>
        <Section {...sectionById('skills')}>
          <Skills skills={cv.skills} />
        </Section>
        <Section {...sectionById('contact')}>
          <Contact
            basics={cv.basics}
            meta={cv.meta}
            footer={hud.footer}
            download={hud.ship.download}
            lede={hud.contact.lede}
          />
        </Section>
      </main>
    </>
  );
}
