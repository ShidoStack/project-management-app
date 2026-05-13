import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { MEMBERS } from '../../data/initialData';
import { useAppActions } from '../../hooks/useAppActions';

export const TaskModal = () => {
  const { taskModal, currentProject, setTaskModal } = useApp();
  const { saveTask } = useAppActions();
  
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [priority, setPriority] = useState('medium');
  const [column, setColumn] = useState('');
  const [deadline, setDeadline] = useState('');
  const [tag, setTag] = useState('');
  const [assignees, setAssignees] = useState([]);

  useEffect(() => {
    if (taskModal.editId) {
      const task = currentProject.tasks.find(t => t.id === taskModal.editId);
      if (task) {
        setTitle(task.title); setDesc(task.desc || ''); setPriority(task.priority);
        setColumn(task.column); setDeadline(task.deadline || ''); setTag(task.tag || '');
        setAssignees(task.assignees || []);
      }
    } else {
      setTitle(''); setDesc(''); setPriority('medium');
      setColumn(taskModal.col || currentProject?.columns[0]); setDeadline(''); setTag('');
      setAssignees([]);
    }
  }, [taskModal, currentProject]);

  if (!taskModal.open) return null;

  const handleSave = () => {
    if (!title.trim()) return alert('Title required');
    saveTask({ title, desc, priority, column, deadline, tag, assignees }, taskModal.editId);
  };

  return (
    <div className="modal-overlay open" onClick={() => setTaskModal({ open: false, col: '', editId: null })}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">{taskModal.editId ? 'Edit Task' : 'New Task'}</div>
          <button className="modal-close" onClick={() => setTaskModal({ open: false, col: '', editId: null })}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Task Title *</label><input className="form-input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Enter task title..." /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={desc} onChange={e => setDesc(e.target.value)} placeholder="Describe the task..."></textarea></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={priority} onChange={e => setPriority(e.target.value)}>
              <option value="critical">🔴 Critical</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select></div>
            <div className="form-group"><label className="form-label">Status Column</label><select className="form-select" value={column} onChange={e => setColumn(e.target.value)}>
              {currentProject?.columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Deadline</label><input type="date" className="form-input" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
            <div className="form-group"><label className="form-label">Assign Members</label><select className="form-select" multiple style={{height:80}} value={assignees} onChange={e => setAssignees(Array.from(e.target.selectedOptions).map(o => o.value))}>
              {MEMBERS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
            </select></div>
          </div>
          <div className="form-group"><label className="form-label">Tag</label><select className="form-select" value={tag} onChange={e => setTag(e.target.value)}>
            <option value="">No tag</option><option value="design">Design</option><option value="dev">Dev</option><option value="marketing">Marketing</option><option value="research">Research</option><option value="bug">Bug</option><option value="feature">Feature</option><option value="content">Content</option>
          </select></div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={() => setTaskModal({ open: false, col: '', editId: null })}>Cancel</button>
          <button className="btn btn-accent" onClick={handleSave}>Save Task</button>
        </div>
      </div>
    </div>
  );
};
