import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { formatDate, isOverdue, getTagClass, memberById } from '../../utils/helpers';
import { useAppActions } from '../../hooks/useAppActions';
import { AttachmentList } from '../common/CommonComponents';

export const DetailModal = () => {
  const { detailModalTaskId, setDetailModalTaskId, projects, setProjects, setTaskModal, currentUser } = useApp();
  const { deleteTask, moveTask } = useAppActions();
  
  const [newComment, setNewComment] = useState('');

  const detail = (() => {
    if (!detailModalTaskId) return;
    for (const p of projects) {
      const t = p.tasks.find(t => t.id === detailModalTaskId);
      if (t) return { task: t, proj: p };
    }
    return null;
  })();

  const task = detail?.task;
  const proj = detail?.proj;

  if (!detailModalTaskId || !task) return null;
  const clDone = (task.checklist || []).filter(c => c.done).length;
  const clTotal = (task.checklist || []).length;

  const onUpdateChecklist = (clId, done) => {
    const now = new Date().toISOString();
    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.map(t => t.id === task.id ? {
        ...t,
        updatedAt: now,
        checklist: t.checklist.map(cl => cl.id === clId ? { ...cl, done } : cl)
      } : t)
    })));
  };

  const onPostComment = () => {
    if (!newComment.trim()) return;
    const now = new Date().toISOString();
    const eventId = now.replace(/\D/g, '');
    const comment = { id: `c${eventId}`, author: 'm1', text: newComment, time: 'just now', createdAt: now };
    setProjects(prev => prev.map(p => ({
      ...(p.id === proj.id ? {
        ...p,
        activity: [{
          id: `act-${eventId}`,
          type: 'comment',
          message: `Commented on "${task.title}".`,
          taskId: task.id,
          createdAt: now,
          user: currentUser?.name || 'Alex Reed'
        }, ...(p.activity || [])].slice(0, 80)
      } : p),
      tasks: p.tasks.map(t => t.id === task.id ? { ...t, updatedAt: now, comments: [...(t.comments||[]), comment] } : t)
    })));
    setNewComment('');
  };

  return (
    <motion.div className="modal-overlay open" onClick={() => setDetailModalTaskId(null)} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }}>
      <motion.div className="modal modal-lg" onClick={e => e.stopPropagation()} initial={{ y: 12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
        <div className="modal-header">
          <div><div className="modal-title">{task.title}</div><div style={{display:'flex',gap:8,marginTop:6}}>
            <span className={`task-priority p-${task.priority}`}>{task.priority}</span>
            {task.tag && <span className={`task-tag ${getTagClass(task.tag)}`}>{task.tag}</span>}
            <span style={{fontSize:'0.8rem',color:'var(--ink-light)'}}>{task.column}</span>
            {task.deadline && <span className="deadline-tag">{isOverdue(task.deadline)?'⚠️':'📅'} {formatDate(task.deadline)}</span>}
          </div></div>
          <div style={{display:'flex',gap:6,alignItems:'center'}}>
            <button className="btn btn-sm btn-outline" onClick={() => { setDetailModalTaskId(null); setTaskModal({ open: true, col: '', editId: task.id }); }}>✏️ Edit</button>
            <button className="modal-close" onClick={() => setDetailModalTaskId(null)}>✕</button>
          </div>
        </div>
        <div className="modal-body" style={{paddingTop:12}}>
          <div className="task-detail-grid">
            <div className="detail-main">
              <div className="detail-section"><div className="detail-section-title">Description</div><p style={{fontSize:'0.875rem',color:'var(--ink-3)',lineHeight:1.6}}>{task.desc || <em>No description</em>}</p></div>
              {clTotal > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Checklist <span>{clDone}/{clTotal}</span></div>
                  <div className="checklist-mini-bar" style={{height:5}}><div className="checklist-mini-fill" style={{width:(clDone/clTotal*100)+'%'}}></div></div>
                  {(task.checklist||[]).map(cl => (
                    <div key={cl.id} className="checklist-item">
                      <input type="checkbox" className="checklist-cb" checked={cl.done} onChange={e => onUpdateChecklist(cl.id, e.target.checked)} />
                      <span className={`checklist-text ${cl.done?'done':''}`}>{cl.text}</span>
                    </div>
                  ))}
                </div>
              )}
              {(task.attachments||[]).length > 0 && (
                <div className="detail-section">
                  <div className="detail-section-title">Attachments</div>
                  <AttachmentList attachments={task.attachments} />
                </div>
              )}
              <div className="detail-section">
                <div className="detail-section-title">Comments ({(task.comments||[]).length})</div>
                <div id="detailComments">
                  {(task.comments||[]).map(c => {
                    const m = memberById(c.author);
                    return (
                      <div key={c.id} className="comment">
                        <div className="comment-avatar" style={{background:m?.color}}>{m?.initials}</div>
                        <div className="comment-body"><div className="comment-header"><span className="comment-author">{m?.name}</span><span className="comment-time">{c.time}</span></div><div className="comment-text">{c.text}</div></div>
                      </div>
                    );
                  })}
                </div>
                <div className="comment-input-row">
                  <input className="comment-input" value={newComment} onChange={e => setNewComment(e.target.value)} placeholder="Add a comment..." onKeyDown={e => e.key==='Enter' && onPostComment()} />
                  <button className="btn btn-accent btn-sm" onClick={onPostComment}>Post</button>
                </div>
              </div>
            </div>
            <div className="detail-sidebar-modal">
              <div className="detail-section"><div className="detail-section-title">Assigned To</div><div className="member-chips">
                {(task.assignees||[]).map(mid => {const m=memberById(mid); return m && <div key={mid} className="member-chip"><div className="mc-avatar" style={{background:m.color}}>{m.initials}</div>{m.name}</div>})}
              </div></div>
              <div className="detail-section" style={{marginTop:16}}><div className="detail-section-title">Move to Column</div>
                <select className="form-select" value={task.column} onChange={e => moveTask(task.id, e.target.value)}>
                  {proj?.columns.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="detail-section" style={{marginTop:16}}><div className="detail-section-title">Danger Zone</div><button className="btn btn-danger btn-sm" style={{width:'100%'}} onClick={() => deleteTask(task.id)}>Delete Task</button></div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
