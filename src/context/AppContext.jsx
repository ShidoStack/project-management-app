import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { getInitialProjects } from '../data/initialData';
import { isOverdue, isDueSoon, formatDate } from '../utils/helpers';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [appActive, setAppActive] = useState(false);
  const [projects, setProjects] = useState([]);
  const [currentProjectId, setCurrentProjectId] = useState(null);
  const [currentView, setCurrentView] = useState('board');
  const [filterMode, setFilterMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notifications, setNotifications] = useState([]);
  const [toasts, setToasts] = useState([]);
  
  const [focusActive, setFocusActive] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(25 * 60);
  
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  
  const [taskModal, setTaskModal] = useState({ open: false, col: '', editId: null });
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [detailModalTaskId, setDetailModalTaskId] = useState(null);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);

  // ── LOAD ──
  useEffect(() => {
    const raw = localStorage.getItem('pf_state');
    if (raw) {
      try {
        const d = JSON.parse(raw);
        setProjects(d.projects || getInitialProjects());
        setCurrentProjectId(d.currentProjectId || (d.projects && d.projects[0]?.id) || 'p1');
        setNotifications(d.notifications || []);
      } catch {
        setProjects(getInitialProjects());
        setCurrentProjectId('p1');
      }
    } else {
      setProjects(getInitialProjects());
      setCurrentProjectId('p1');
    }
  }, []);

  // ── SAVE ──
  useEffect(() => {
    if (projects.length > 0) {
      localStorage.setItem('pf_state', JSON.stringify({
        projects,
        currentProjectId,
        notifications
      }));
    }
  }, [projects, currentProjectId, notifications]);

  // ── DERIVED ──
  const currentProject = useMemo(() => projects.find(p => p.id === currentProjectId), [projects, currentProjectId]);
  
  const filteredTasks = useMemo(() => {
    if (!currentProject) return [];
    let tasks = [...currentProject.tasks];
    const today = new Date().toISOString().slice(0,10);
    if (filterMode === 'my') tasks = tasks.filter(t => t.assignees?.includes('m1'));
    if (filterMode === 'overdue') tasks = tasks.filter(t => isOverdue(t.deadline));
    if (filterMode === 'today') tasks = tasks.filter(t => t.deadline === today);
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      tasks = tasks.filter(t => t.title.toLowerCase().includes(q) || (t.desc || '').toLowerCase().includes(q));
    }
    return tasks;
  }, [currentProject, filterMode, searchQuery]);

  // ── UTILS ──
  const toast = (msg, type='info') => {
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
    setNotifications(prev => [{ id: 'n'+Date.now(), text, time: 'just now', read: false }, ...prev]);
  };

  const value = {
    appActive, setAppActive,
    projects, setProjects,
    currentProjectId, setCurrentProjectId,
    currentProject,
    currentView, setCurrentView,
    filterMode, setFilterMode,
    searchQuery, setSearchQuery,
    notifications, setNotifications,
    notifPanelOpen, setNotifPanelOpen,
    toasts, setToasts,
    focusActive, setFocusActive,
    focusPaused, setFocusPaused,
    focusSeconds, setFocusSeconds,
    calendarMonth, setCalendarMonth,
    calendarYear, setCalendarYear,
    taskModal, setTaskModal,
    projectModalOpen, setProjectModalOpen,
    detailModalTaskId, setDetailModalTaskId,
    filteredTasks,
    toast,
    addNotification
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => useContext(AppContext);
