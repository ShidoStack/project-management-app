import { createContext, useContext, useState } from 'react';

const UIContext = createContext(null);

export const UIProvider = ({ children }) => {
  const [appActive, setAppActive] = useState(false);
  const [currentView, setCurrentView] = useState('board');
  const [filterMode, setFilterMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [focusActive, setFocusActive] = useState(false);
  const [focusPaused, setFocusPaused] = useState(false);
  const [focusSeconds, setFocusSeconds] = useState(59 * 60 + 59);
  const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
  const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
  const [taskModal, setTaskModal] = useState({ open: false, col: '', editId: null });
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [workspaceModalOpen, setWorkspaceModalOpen] = useState(false);
  const [detailModalTaskId, setDetailModalTaskId] = useState(null);
  const [notifPanelOpen, setNotifPanelOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);

  const value = {
    appActive, setAppActive,
    currentView, setCurrentView,
    filterMode, setFilterMode,
    searchQuery, setSearchQuery,
    focusActive, setFocusActive,
    focusPaused, setFocusPaused,
    focusSeconds, setFocusSeconds,
    calendarMonth, setCalendarMonth,
    calendarYear, setCalendarYear,
    taskModal, setTaskModal,
    projectModalOpen, setProjectModalOpen,
    workspaceModalOpen, setWorkspaceModalOpen,
    detailModalTaskId, setDetailModalTaskId,
    notifPanelOpen, setNotifPanelOpen,
    sidebarCollapsed, setSidebarCollapsed,
    commandPaletteOpen, setCommandPaletteOpen
  };

  return <UIContext.Provider value={value}>{children}</UIContext.Provider>;
};

export const useUI = () => useContext(UIContext);
