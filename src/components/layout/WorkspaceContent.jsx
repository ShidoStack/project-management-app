import { AnimatePresence, motion } from 'framer-motion';
import { Activity, CalendarClock, CheckCircle2, ChevronDown, Edit3, Filter, MessageSquareText, MoveRight, Paperclip, Plus, Search, UserPlus } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { AttachmentList } from '../common/CommonComponents';

export const Toolbar = () => {
  const { 
    currentProject, currentView, searchQuery, setSearchQuery, 
    filterMode, setFilterMode, setTaskModal 
  } = useApp();
  
  const FILTER_LABELS = {
    all:'All',
    my:'Assigned',
    today:'Today',
    week:'This Week',
    overdue:'Overdue',
    high:'High Priority',
    recent:'Recent',
    completed:'Completed'
  };
  const FILTERS = ['all','my','today','week','overdue','high','recent','completed'];
  
  const cycleFilter = () => {
    const idx = FILTERS.indexOf(filterMode);
    setFilterMode(FILTERS[(idx + 1) % FILTERS.length]);
  };

  const title = (currentProject?.name || '') + ' — ' + currentView.charAt(0).toUpperCase() + currentView.slice(1);
  const taskAttachments = (currentProject?.tasks || []).flatMap(task => (
    (task.attachments || []).map(attachment => ({
      ...attachment,
      source: task.title,
      status: task.column
    }))
  ));
  const progressAttachments = taskAttachments.sort((a, b) => {
    if (!a.addedAt && !b.addedAt) return 0;
    if (!a.addedAt) return 1;
    if (!b.addedAt) return -1;
    return new Date(b.addedAt) - new Date(a.addedAt);
  });

  return (
    <>
      <div className="toolbar">
        <div className="toolbar-title">{title}</div>
        <div className="toolbar-spacer"></div>
        <div className="search-box">
          <Search size={15} />
          <input 
            type="text" 
            placeholder="Search tasks..." 
            value={searchQuery} 
            onChange={(e) => setSearchQuery(e.target.value)} 
          />
        </div>
        <button className="filter-btn" onClick={cycleFilter}>
          <Filter size={15} /> <span>{FILTER_LABELS[filterMode]}</span>
        </button>
        <button className="btn-new-task" onClick={() => setTaskModal({ open: true, col: currentProject?.columns[0], editId: null })}>
          <Plus size={15} /> New Task
        </button>
      </div>
      {progressAttachments.length > 0 && (
        <div className="project-attachments-strip">
          <div className="detail-section-title">Files & Progress Updates</div>
          <AttachmentList attachments={progressAttachments} />
        </div>
      )}
    </>
  );
};

const formatTimelineDate = (value) => {
  if (!value) return 'Earlier';
  const date = new Date(value);
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' });
};

export const ActivityTimeline = () => {
  const { currentProject, setDetailModalTaskId } = useApp();
  const [expanded, setExpanded] = useState(false);
  const icons = {
    comment: MessageSquareText,
    attachment: Paperclip,
    completion: CheckCircle2,
    assignment: UserPlus,
    deadline: CalendarClock,
    move: MoveRight,
    edit: Edit3,
    create: Plus
  };
  const events = (currentProject?.activity || [])
    .map(activity => ({
      ...activity,
      icon: icons[activity.type] || Activity,
      title: activity.message,
      detail: activity.user || 'ProjectFlow',
      date: activity.createdAt
    }))
    .sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0))
    .slice(0, 18);

  if (!events.length) return null;

  return (
    <section className={`activity-timeline ${expanded ? 'expanded' : ''}`} aria-label="Project activity timeline">
      <button className="activity-peek" onClick={() => setExpanded(prev => !prev)} aria-expanded={expanded}>
        <span className="activity-peek-icon"><Activity size={15} /></span>
        <strong>Recent Activity</strong>
        <span>{events.length} updates</span>
        <ChevronDown size={16} className={expanded ? 'open' : ''} />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.div
            className="activity-expanded"
            initial={{ height: 0, opacity: 0, filter: 'blur(6px)' }}
            animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
            exit={{ height: 0, opacity: 0, filter: 'blur(6px)' }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
          >
            <div className="activity-head">
        <div>
          <span className="activity-kicker"><Activity size={14} /> Recent activity</span>
          <h3>Progress you can revisit later</h3>
        </div>
              <button className="activity-collapse" onClick={() => setExpanded(false)}>Collapse</button>
            </div>
            <div className="activity-list">
        {events.map(event => {
          const Icon = event.icon;
          return (
            <button key={event.id} className={`activity-item ${event.type}`} onClick={() => setDetailModalTaskId(event.taskId)}>
              <span className="activity-icon"><Icon size={15} /></span>
              <span className="activity-copy">
                <strong>{event.title}</strong>
                <small>{event.detail}</small>
              </span>
              <time>{formatTimelineDate(event.date)}</time>
            </button>
          );
        })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
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
