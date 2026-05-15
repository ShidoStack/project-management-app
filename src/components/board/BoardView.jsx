import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAppActions } from '../../hooks/useAppActions';
import { formatDate, isOverdue, isDueSoon, getTagClass, memberById } from '../../utils/helpers';

export const TaskCard = ({ task, onDragStart, onClick }) => {
  const dateClass = isOverdue(task.deadline) ? 'overdue' : isDueSoon(task.deadline) ? 'soon' : '';
  const dateIcon = isOverdue(task.deadline) ? '⚠️' : '📅';
  const clDone = (task.checklist || []).filter(c => c.done).length;
  const clTotal = (task.checklist || []).length;

  return (
    <motion.div
      layout
      className={`task-card p-${task.priority}`}
      draggable
      onDragStart={() => onDragStart(task.id)}
      onClick={onClick}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.16, ease: 'easeOut' }}
    >
      {task.tag && <div className="task-tags"><span className={`task-tag ${getTagClass(task.tag)}`}>{task.tag}</span></div>}
      <div className={`task-priority p-${task.priority}`}>{task.priority}</div>
      <div className="task-title">{task.title}</div>
      {task.desc && <div className="task-desc">{task.desc}</div>}
      {clTotal > 0 && (
        <div className="task-checklist-mini">
          <div className="checklist-mini-bar"><div className="checklist-mini-fill" style={{width:Math.round(clDone/clTotal*100)+'%'}}></div></div>
          <span className="checklist-mini-label">{clDone}/{clTotal} done</span>
        </div>
      )}
      <div className="task-footer">
        <div className="task-assignees">
          {(task.assignees||[]).map(mid => {
            const m = memberById(mid);
            return m && <span key={mid} className="task-avatar" style={{background:m.color}} title={m.name}>{m.initials}</span>;
          })}
        </div>
        <div className="task-meta">
          {task.deadline && <span className={`task-date ${dateClass}`}>{dateIcon} {formatDate(task.deadline)}</span>}
          {task.comments?.length > 0 && <span className="task-comments-count">💬 {task.comments.length}</span>}
          {task.attachments?.length > 0 && <span className="task-attach-count">📎 {task.attachments.length}</span>}
        </div>
      </div>
    </motion.div>
  );
};

export const KanbanColumn = ({ col, tasks, onDragStart, onDrop, onNewTask, onOpenDetail }) => {
  const dotColors = { 'Backlog':'#aaa9a6', 'To Do':'#1a4a7a', 'In Progress':'#c4531a', 'Review':'#5b21b6', 'Done':'#2d6a4f', 'Design':'#5b21b6', 'Development':'#1a4a7a', 'Ideas':'#b5500a', 'Planning':'#c4531a', 'Production':'#1a4a7a', 'Live':'#2d6a4f', 'Archive':'#aaa9a6' };
  
  return (
    <div className="kanban-col" onDragOver={(e) => e.preventDefault()} onDrop={() => onDrop(col)}>
      <div className="col-header">
        <span className="col-dot" style={{background:dotColors[col]||'#c4531a'}}></span>
        <span className="col-name">{col}</span>
        <span className="col-count">{tasks.length}</span>
        <span className="col-menu">⋯</span>
      </div>
      <div className="col-cards">
        {tasks.length === 0 && <div className="empty-state"><div className="es-icon">○</div><p>A quiet lane. Drop work here when it is ready.</p></div>}
        {tasks.map(t => (
          <TaskCard key={t.id} task={t} onDragStart={onDragStart} onClick={() => onOpenDetail(t.id)} />
        ))}
      </div>
      <div className="col-add">
        <button className="col-add-btn" onClick={() => onNewTask(col)}>＋ Add task</button>
      </div>
    </div>
  );
};

export const BoardView = () => {
  const { currentProject, filteredTasks, setTaskModal, setDetailModalTaskId, setProjects, toast } = useApp();
  const { moveTask } = useAppActions();
  const [dragTaskId, setDragTaskId] = useState(null);

  if (!currentProject) return null;

  const handleDragStart = (id) => setDragTaskId(id);
  const handleDrop = (toCol) => {
    if (dragTaskId) {
      moveTask(dragTaskId, toCol);
      setDragTaskId(null);
    }
  };

  return (
    <div id="boardView" className="board-view">
      {currentProject.columns.map(col => (
        <KanbanColumn 
          key={col} 
          col={col} 
          tasks={filteredTasks.filter(t => t.column === col)}
          onDragStart={handleDragStart}
          onDrop={handleDrop}
          onNewTask={(column) => setTaskModal({ open: true, col: column, editId: null })}
          onOpenDetail={setDetailModalTaskId}
        />
      ))}
      <button className="add-col-btn" onClick={() => {
        const name = window.prompt('New column name:');
        if (name) {
          setProjects(prev => prev.map(p => p.id === currentProject.id ? { ...p, columns: [...p.columns, name] } : p));
          toast(`✅ Column "${name}" added`);
        }
      }}>＋ Add Column</button>
    </div>
  );
};
