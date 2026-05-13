import React from 'react';
import { useApp } from '../context/AppContext';
import { LandingNav, Hero, Features, HowItWorks, Stats, LandingFooter } from '../components/landing/LandingComponents';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAppActions } from '../hooks/useAppActions';

const Landing = () => {
  const { setAppActive, projects } = useApp();
  const { checkDeadlineAlerts } = useAppActions();
  useScrollReveal();

  const launchApp = () => {
    setAppActive(true);
    checkDeadlineAlerts(projects);
  };

  return (
    <div id="landing">
      <div className="landing-grain"></div>
      <LandingNav onLaunch={launchApp} />
      <Hero onLaunch={launchApp} />
      <Features />
      <HowItWorks />
      <Stats />
      <LandingFooter />
    </div>
  );
};

export default Landing;
