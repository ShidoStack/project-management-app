import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

export const useFocusTimer = () => {
  const { focusActive, focusPaused, setFocusSeconds, setFocusActive, toast, addNotification } = useApp();

  useEffect(() => {
    let interval = null;
    if (focusActive && !focusPaused) {
      interval = setInterval(() => {
        setFocusSeconds(prev => {
          if (prev <= 1) {
            clearInterval(interval);
            setFocusActive(false);
            toast('🎉 Focus session complete! Take a break.', 'success');
            addNotification('Focus session of 25 minutes completed! 🎉');
            return 25 * 60;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusPaused, setFocusSeconds, setFocusActive, toast, addNotification]);
};
