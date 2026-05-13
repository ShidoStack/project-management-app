import React from 'react';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { 
    currentView, setCurrentView, filterMode, setFilterMode, 
    projects, setTaskModal, setFocusActive, currentProject 
  } = useApp();

  const counts = {
    my: projects.flatMap(p => p.tasks).filter(t => t.assignees?.includes('m1')).length,
    overdue: projects.flatMap(p => p.tasks).filter(t => {
      if (!t.deadline) return false;
      return new Date(t.deadline + 'T23:59:59') < new Date() && t.column !== 'Done';
    }).length,
    today: projects.flatMap(p => p.tasks).filter(t => t.deadline === new Date().toISOString().slice(0,10)).length,
  };

  const items = [
    {id:'board', icon:'📋', label:'Board'},
    {id:'list', icon:'📄', label:'List'},
    {id:'calendar', icon:'📅', label:'Calendar'},
    {id:'overview', icon:'📊', label:'Overview'},
  ];

  const filters = [
    {id:'my', icon:'👤', label:'My Tasks', count: counts.my},
    {id:'overdue', icon:'⚠️', label:'Overdue', count: counts.overdue},
    {id:'today', icon:'📌', label:'Due Today', count: counts.today},
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        {items.map(i => (
          <button key={i.id} className={`sidebar-item ${currentView === i.id ? 'active' : ''}`} onClick={() => setCurrentView(i.id)}>
            <span className="si-icon">{i.icon}</span><span className="si-label">{i.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Filters</div>
        {filters.map(f => (
          <button key={f.id} className={`sidebar-item ${filterMode === f.id ? 'active' : ''}`} onClick={() => setFilterMode(f.id)}>
            <span className="si-icon">{f.icon}</span><span className="si-label">{f.label}</span>
            <span className="si-count">{f.count}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Actions</div>
        <button className="sidebar-item" onClick={() => setTaskModal({ open: true, col: currentProject?.columns[0], editId: null })}>
          <span className="si-icon">➕</span><span className="si-label">New Task</span>
        </button>
        <button className="sidebar-item" onClick={() => setFocusActive(true)}>
          <span className="si-icon">🍅</span><span className="si-label">Focus Mode</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
