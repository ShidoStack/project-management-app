import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useScrollReveal = () => {
  const { appActive } = useApp();

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) e.target.classList.add('visible');
      });
    }, { threshold: 0.15 });

    const targets = document.querySelectorAll('.reveal, .step-card');
    targets.forEach(el => observer.observe(el));
    
    const handleScroll = () => {
      const nav = document.getElementById('landNav');
      if (nav) nav.classList.toggle('scrolled', window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      targets.forEach(el => observer.unobserve(el));
      window.removeEventListener('scroll', handleScroll);
    };
  }, [appActive]);
};
