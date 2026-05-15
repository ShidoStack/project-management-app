import { AlertTriangle, BarChart3, CalendarCheck2, CalendarClock, CalendarDays, CheckCircle2, Flame, Focus, History, KanbanSquare, ListTodo, PanelLeftClose, PanelLeftOpen, Plus, UserRound } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const Sidebar = () => {
  const { 
    currentView, setCurrentView, filterMode, setFilterMode, 
    projects, setTaskModal, setFocusActive, currentProject,
    currentWorkspaceId, sidebarCollapsed, setSidebarCollapsed
  } = useApp();
  const navigate = useNavigate();
  const allTasks = projects.flatMap(p => p.tasks || []);
  const today = new Date();
  const todayKey = today.toISOString().slice(0, 10);
  const weekEnd = new Date(today);
  weekEnd.setDate(weekEnd.getDate() + 7);
  const recentCutoff = new Date(today);
  recentCutoff.setDate(recentCutoff.getDate() - 7);
  const doneColumns = ['Done', 'Archive', 'Live'];
  const activityDate = task => task.updatedAt || task.createdAt || task.attachments?.find(a => a.addedAt)?.addedAt || task.comments?.find(c => c.createdAt)?.createdAt;

  const counts = {
    my: allTasks.filter(t => t.assignees?.includes('m1')).length,
    overdue: allTasks.filter(t => {
      if (!t.deadline) return false;
      return new Date(t.deadline + 'T23:59:59') < new Date() && t.column !== 'Done';
    }).length,
    today: allTasks.filter(t => t.deadline === todayKey).length,
    week: allTasks.filter(t => {
      if (!t.deadline || doneColumns.includes(t.column)) return false;
      const d = new Date(t.deadline + 'T23:59:59');
      return d >= new Date(todayKey + 'T00:00:00') && d <= weekEnd;
    }).length,
    high: allTasks.filter(t => ['critical', 'high'].includes(t.priority)).length,
    recent: allTasks.filter(t => {
      const date = activityDate(t);
      return date ? new Date(date) >= recentCutoff : false;
    }).length,
    completed: allTasks.filter(t => doneColumns.includes(t.column)).length,
  };

  const items = [
    {id:'board', icon:KanbanSquare, label:'Board', to:`/workspace/${currentWorkspaceId}`},
    {id:'list', icon:ListTodo, label:'List', to:null},
    {id:'calendar', icon:CalendarDays, label:'Calendar', to:'/calendar'},
    {id:'overview', icon:BarChart3, label:'Overview', to:'/analytics'},
  ];

  const filters = [
    {id:'my', icon:UserRound, label:'Assigned to Me', count: counts.my},
    {id:'today', icon:CalendarClock, label:'Due Today', count: counts.today},
    {id:'week', icon:CalendarCheck2, label:'Due This Week', count: counts.week},
    {id:'overdue', icon:AlertTriangle, label:'Overdue', count: counts.overdue},
    {id:'high', icon:Flame, label:'High Priority', count: counts.high},
    {id:'recent', icon:History, label:'Recently Updated', count: counts.recent},
    {id:'completed', icon:CheckCircle2, label:'Completed Recently', count: counts.completed},
  ];

  return (
    <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
      <button className="sidebar-item sidebar-collapse" onClick={() => setSidebarCollapsed(!sidebarCollapsed)} title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}>
        <span className="si-icon">{sidebarCollapsed ? <PanelLeftOpen size={18} /> : <PanelLeftClose size={18} />}</span>
        <span className="si-label">Collapse</span>
      </button>
      <div className="sidebar-section">
        <div className="sidebar-label">Workspace</div>
        {items.map(i => (
          <button key={i.id} className={`sidebar-item ${currentView === i.id ? 'active' : ''}`} title={i.label} onClick={() => { setCurrentView(i.id); if (i.to) navigate(i.to); }}>
            <span className="si-icon"><i.icon size={18} /></span><span className="si-label">{i.label}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Filters</div>
        {filters.map(f => (
          <button key={f.id} className={`sidebar-item ${filterMode === f.id ? 'active' : ''}`} title={f.label} onClick={() => setFilterMode(f.id)}>
            <span className="si-icon"><f.icon size={18} /></span><span className="si-label">{f.label}</span>
            <span className="si-count">{f.count}</span>
          </button>
        ))}
      </div>
      <div className="sidebar-section">
        <div className="sidebar-label">Actions</div>
        <button className="sidebar-item" title="New Task" onClick={() => setTaskModal({ open: true, col: currentProject?.columns[0], editId: null })}>
          <span className="si-icon"><Plus size={18} /></span><span className="si-label">New Task</span>
        </button>
        <button className="sidebar-item" title="Focus Mode" onClick={() => setFocusActive(true)}>
          <span className="si-icon"><Focus size={18} /></span><span className="si-label">Focus Mode</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
