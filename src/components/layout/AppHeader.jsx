import { Bell, Home, Plus, Settings, Timer, UserRound, WalletCards } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';
import { useAppActions } from '../../hooks/useAppActions';

const AppHeader = () => {
  const { 
    projects, currentProjectId, setCurrentProjectId, setFilterMode,
    workspaces, currentWorkspace, currentWorkspaceId, setCurrentWorkspaceId, createWorkspace,
    currentView, setCurrentView, setFocusActive, notifPanelOpen, setNotifPanelOpen, 
    notifications, setNotifications, setProjectModalOpen, currentUser
  } = useApp();

  const { deleteProject } = useAppActions();
  const navigate = useNavigate();
  const unreadNotifs = notifications.filter(n => !n.read).length;

  const onWorkspaceChange = (workspaceId) => {
    const workspace = workspaces.find(item => item.id === workspaceId);
    setCurrentWorkspaceId(workspaceId);
    navigate(`/workspace/${workspaceId}${workspace?.settings?.currentProjectId ? `/project/${workspace.settings.currentProjectId}` : ''}`);
  };

  const onCreateWorkspace = () => {
    const name = window.prompt('Workspace name:');
    if (!name) return;
    const workspace = createWorkspace({ name, description: 'A new ProjectFlow workspace.' });
    navigate(`/workspace/${workspace.id}`);
  };

  return (
    <header className="app-header">
      <div className="app-logo">Project<span>Flow</span></div>
      <div className="workspace-switcher">
        <WalletCards size={15} />
        <select value={currentWorkspaceId || ''} onChange={event => onWorkspaceChange(event.target.value)} aria-label="Switch workspace">
          {workspaces.map(workspace => <option key={workspace.id} value={workspace.id}>{workspace.name}</option>)}
        </select>
        <button onClick={onCreateWorkspace} title="Create workspace" aria-label="Create workspace"><Plus size={14} /></button>
      </div>
      <div className="header-divider"></div>
      <div className="project-tabs">
        {projects.map(p => (
          <button 
            key={p.id} 
            className={`proj-tab ${p.id === currentProjectId ? 'active' : ''}`} 
            onClick={() => {
              setCurrentProjectId(p.id);
              setFilterMode('all');
              navigate(`/workspace/${currentWorkspace?.id || currentWorkspaceId}/project/${p.id}`);
            }}
          >
            <span className="proj-color" style={{background:p.color}}></span>
            {p.name}
            <span className="tab-close" onClick={(e) => { e.stopPropagation(); deleteProject(p.id); }}>✕</span>
          </button>
        ))}
      </div>
      <button className="btn-add-project" onClick={() => setProjectModalOpen(true)}><Plus size={14} /> Project</button>
      <div className="header-divider"></div>
      <div className="header-actions">
        <div className="view-toggle">
          {['board','list','calendar','overview'].map(v => (
            <button key={v} className={`view-btn ${currentView === v ? 'active' : ''}`} onClick={() => setCurrentView(v)}>
              {v.charAt(0).toUpperCase() + v.slice(1)}
            </button>
          ))}
        </div>
        <button className="header-btn" onClick={() => setFocusActive(true)} title="Focus Mode" aria-label="Focus Mode"><Timer size={17} /></button>
        <button className="header-btn" onClick={() => {
          setNotifPanelOpen(!notifPanelOpen);
          if (!notifPanelOpen) setNotifications(prev => prev.map(n => ({...n, read: true})));
        }} title="Notifications" aria-label="Notifications">
          <Bell size={17} />{unreadNotifs > 0 && <span className="badge"></span>}
        </button>
        <button className="header-btn" onClick={() => navigate('/settings')} title="Settings" aria-label="Settings"><Settings size={17} /></button>
        <button className="header-btn user-chip-btn" title={currentUser?.name || 'User'} aria-label="Current user"><UserRound size={17} /></button>
        <button className="header-btn" onClick={() => navigate('/')} title="Back to home" aria-label="Back to home"><Home size={17} /></button>
      </div>
    </header>
  );
};

export default AppHeader;
