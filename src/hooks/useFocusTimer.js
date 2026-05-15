import { useEffect } from 'react';
import { useApp } from '../context/AppContext';

const DEEP_FOCUS_SECONDS = 59 * 60 + 59;

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
            toast('Deep focus complete. Take a real break.', 'success');
            addNotification('A 59:59 deep focus session was completed.');
            return DEEP_FOCUS_SECONDS;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusPaused, setFocusSeconds, setFocusActive, toast, addNotification]);
};
