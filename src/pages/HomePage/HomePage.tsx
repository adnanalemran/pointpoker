import { useTranslation } from 'react-i18next';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { useRouteMatch } from 'react-router-dom';
import { Divider } from '../../components/Divider/Divider';
import { Footer } from '../../components/Footer/Footer';
import { GoogleAd } from '../../components/GoogleAd/GoogleAd';
import { CreateGame } from '../../components/Poker/CreateGame/CreateGame';
import { JoinGame } from '../../components/Poker/JoinGame/JoinGame';
import { RecentGames } from '../../components/Poker/RecentGames/RecentGames';
import { AboutPlanningPokerContent } from '../AboutPage/AboutPage';
import SessionControllerImage from './../../images/Session.jpg';
import LandingImage from './../../images/background.jpg';

export const HomePage = () => {
  return (
    <>
      <div className='flex flex-col items-center w-full animate-fade-in-down'>
        <HeroSection />
        <GoogleAd />
        <Divider />
        <RecentGamesSection />
        <Divider />
        <UIDesignSection />
        <GoogleAd />
        <Divider />
        <AboutSection />
        <GoogleAd />
      </div>
      <Footer />
    </>
  );
};

import { HTMLAttributes, ReactNode } from 'react';

type SectionProps = {
  children: ReactNode;
  maxWidth?: string;
  className?: string;
};

const Section = ({ children, maxWidth = 'max-w-7xl', className = '' }: SectionProps) => (
  <div
    className={`flex flex-col lg:flex-row w-full ${maxWidth} items-center justify-center ${className}`}
  >
    {children}
  </div>
);

type ColumnProps = {
  children: ReactNode;
  className?: string;
} & HTMLAttributes<HTMLDivElement>;

const Column = ({ children, className = '', ...props }: ColumnProps) => (
  <div className={`w-full lg:w-1/2 px-4 ${className}`} {...props}>
    {children}
  </div>
);

const HeroSection = () => {
  const isJoin = useRouteMatch('/join');
  const { t } = useTranslation();
  return (
    <Section className='pt-8 section-padding'>
      <Column className='flex flex-col items-center animate-slide-in-up'>
        <div className='text-center mb-8'>
          <h1 className='text-4xl md:text-6xl font-bold gradient-text mb-4 animate-float'>
            {t('HomePage.heroSection.title')}
          </h1>
          <p className='text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed'>
            {t('HomePage.heroSection.description')}
          </p>
        </div>
        <div className='p-4 animate-float'>
          <LazyLoadImage
            loading='lazy'
            alt={t('HomePage.heroSection.title')}
            className='w-[500px] h-auto rounded-2xl shadow-2xl modern-card'
            src={LandingImage}
          />
        </div>
      </Column>
      <Column className='flex flex-col items-center animate-slide-in-up' style={{animationDelay: '0.2s'}}>
        <div className='w-full max-w-md'>{isJoin ? <JoinGame /> : <CreateGame />}</div>
      </Column>
    </Section>
  );
};

const RecentGamesSection = () => {
  const { t } = useTranslation();
  return (
    <Section className='section-padding'>
      <Column className='mb-8 lg:mb-0 animate-slide-in-up'>
        <div className='p-6 flex flex-col items-center justify-center'>
          <RecentGames />
        </div>
      </Column>
      <Column className='animate-slide-in-up' style={{animationDelay: '0.2s'}}>
        <div className='p-8 flex flex-col items-center justify-center'>
          <h3 className='text-2xl font-bold mb-4 gradient-text text-center'>
            Recent Sessions
          </h3>
          <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-center max-w-md'>
            {t(
              'HomePage.recentSessions',
              'Here is your recent Planning/Refinement sessions, click on the session name to join the session again.',
            )}
          </p>
        </div>
      </Column>
    </Section>
  );
};

const UIDesignSection = () => {
  const { t } = useTranslation();
  return (
    <Section maxWidth='max-w-5xl' className='section-padding'>
      <Column className='mb-8 lg:mb-0 animate-slide-in-up'>
        <div className='p-8 flex flex-col items-center justify-center'>
          <h2 className='text-3xl font-bold mb-6 gradient-text text-center'>
            {t('HomePage.uiDesignTitle', 'Intuitive UI Design')}
          </h2>
          <p className='text-lg leading-relaxed text-gray-600 dark:text-gray-300 text-center max-w-2xl'>
            {t(
              'HomePage.uiDesignDesc',
              "Beautiful design for voting the story points, showing team members voting status with emojis(👍 - Voting Done, 🤔 - Yet to Vote). Once the card values are revealed, the card color helps to understand if the team's voting is sync or not. Session Moderator has full control on revealing story points and restarting the session.",
            )}
          </p>
        </div>
      </Column>
      <Column className='animate-slide-in-up' style={{animationDelay: '0.2s'}}>
        <div className='flex justify-center'>
          <div className='p-4'>
            <img
              className='w-[600px] h-auto rounded-2xl shadow-2xl modern-card animate-float'
              alt='Session controller'
              src={SessionControllerImage}
            />
          </div>
        </div>
      </Column>
    </Section>
  );
};

const AboutSection = () => (
  <div className='w-full max-w-7xl my-8'>
    <AboutPlanningPokerContent />
  </div>
);

export default HomePage;
