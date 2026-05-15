import { createContext, useContext, useEffect, useState } from 'react';
import { STORAGE_KEYS, readJson, writeJson } from './storageUtils';

const NotificationContext = createContext(null);

export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => readJson(STORAGE_KEYS.notifications, []));
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    writeJson(STORAGE_KEYS.notifications, notifications);
  }, [notifications]);

  const toast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, msg, type }]);
    setTimeout(() => {
      setToasts(prev => prev.map(t => t.id === id ? { ...t, out: true } : t));
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, 250);
    }, 3000);
  };

  const addNotification = (text) => {
    setNotifications(prev => [{ id: `n${Date.now()}`, text, time: 'just now', read: false }, ...prev]);
  };

  return (
    <NotificationContext.Provider value={{ notifications, setNotifications, toasts, toast, addNotification }}>
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => useContext(NotificationContext);
