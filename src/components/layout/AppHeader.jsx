import React from 'react';
import { useApp } from '../../context/AppContext';
import { useAppActions } from '../../hooks/useAppActions';

const AppHeader = () => {
  const { 
    projects, currentProjectId, setCurrentProjectId, setFilterMode, 
    currentView, setCurrentView, setFocusActive, notifPanelOpen, setNotifPanelOpen, 
    notifications, setAppActive, setNotifications, setProjectModalOpen
  } = useApp();

  const { deleteProject } = useAppActions();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  return (
    <header className="app-header">
      <div className="app-logo">Project<span>Flow</span></div>
      <div className="header-divider"></div>
      <div className="project-tabs">
        {projects.map(p => (
          <button 
            key={p.id} 
            className={`proj-tab ${p.id === currentProjectId ? 'active' : ''}`} 
            onClick={() => { setCurrentProjectId(p.id); setFilterMode('all'); }}
          >
            <span className="proj-color" style={{background:p.color}}></span>
            {p.name}
            <span className="tab-close" onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}>✕</span>
          </button>
        ))}
      </div>
      <button className="btn-add-project" onClick={() => setProjectModalOpen(true)}>＋ Project</button>
      <div className="header-divider"></div>
      <div className="header-actions">
        <div className="view-toggle">
          {['board','list','calendar','overview'].map(v => (
            <button key={v} className={`view-btn ${currentView === v ? 'active' : ''}`} onClick={() => setCurrentView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <button className="header-btn" onClick={() => setFocusActive(true)} title="Focus Mode">🍅</button>
        <button className="header-btn" onClick={() => {
          setNotifPanelOpen(!notifPanelOpen);
          if (!notifPanelOpen) setNotifications(prev => prev.map(n => ({...n, read: true})));
        }} title="Notifications">
          🔔{unreadNotifs > 0 && <span className="badge"></span>}
        </button>
        <button className="header-btn" onClick={() => setAppActive(false)} title="Back to home">🏠</button>
      </div>
    </header>
  );
};

export default AppHeader;
