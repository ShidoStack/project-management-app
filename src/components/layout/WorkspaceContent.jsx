import React from 'react';
import { useApp } from '../../context/AppContext';

export const Toolbar = () => {
  const { 
    currentProject, currentView, searchQuery, setSearchQuery, 
    filterMode, setFilterMode, setTaskModal 
  } = useApp();
  
  const FILTER_LABELS = {all:'All', my:'Mine', overdue:'Overdue', today:'Today'};
  const FILTERS = ['all','my','overdue','today'];
  
  const cycleFilter = () => {
    const idx = FILTERS.indexOf(filterMode);
    setFilterMode(FILTERS[(idx + 1) % FILTERS.length]);
  };

  const title = (currentProject?.name || '') + ' — ' + currentView.charAt(0).toUpperCase() + currentView.slice(1);

  return (
    <div className="toolbar">
      <div className="toolbar-title">{title}</div>
      <div className="toolbar-spacer"></div>
      <div className="search-box">
        <span>🔍</span>
        <input 
          type="text" 
          placeholder="Search tasks..." 
          value={searchQuery} 
          onChange={(e) => setSearchQuery(e.target.value)} 
        />
      </div>
      <button className="filter-btn" onClick={cycleFilter}>
        <span>⊟</span> <span>{FILTER_LABELS[filterMode]}</span>
      </button>
      <button className="btn-new-task" onClick={() => setTaskModal({ open: true, col: currentProject?.columns[0], editId: null })}>
        ＋ New Task
      </button>
    </div>
  );
};

export const ProgressBar = () => {
  const { filteredTasks } = useApp();
  
  const total = filteredTasks.length;
  const done = filteredTasks.filter(t => t.column === 'Done' || t.column === 'Archive').length;
  const overdueCount = filteredTasks.filter(t => {
    if (!t.deadline) return false;
    return new Date(t.deadline + 'T23:59:59') < new Date() && t.column !== 'Done';
  }).length;
  
  const pct = total ? Math.round(done/total*100) : 0;

  return (
    <div className="progress-bar-section">
      <div className="prog-label">Progress</div>
      <div className="prog-track"><div className="prog-fill" style={{width:pct+'%'}}></div></div>
      <div className="prog-pct">{pct}%</div>
      <div className="prog-stats">
        <span className="prog-stat"><strong>{total}</strong> total</span>
        <span className="prog-stat"><strong>{done}</strong> done</span>
        <span className="prog-stat"><strong>{overdueCount}</strong> overdue</span>
      </div>
    </div>
  );
};
