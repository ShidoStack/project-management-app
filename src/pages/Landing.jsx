import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { LandingNav, Hero, Features, HowItWorks, Stats, Pricing, LandingFooter } from '../components/landing/LandingComponents';
import { useScrollReveal } from '../hooks/useScrollReveal';
import { useAppActions } from '../hooks/useAppActions';

const Landing = () => {
  const { isAuthenticated, currentWorkspaceId, setAppActive, projects, workspaces } = useApp();
  const { checkDeadlineAlerts } = useAppActions();
  const navigate = useNavigate();
  useScrollReveal();

  const launchApp = () => {
    setAppActive(true);
    checkDeadlineAlerts(projects);
    if (isAuthenticated) {
      navigate(`/workspace/${currentWorkspaceId || workspaces[0]?.id || 'w-default'}`);
    } else {
      navigate('/login');
    }
  };

  return (
    <div id="landing">
      <div className="landing-grain"></div>
      <LandingNav onLaunch={launchApp} />
      <Hero onLaunch={launchApp} />
      <Features />
      <HowItWorks />
      <Stats />
      <Pricing onLaunch={launchApp} />
      <LandingFooter />
    </div>
  );
};

export default Landing;
