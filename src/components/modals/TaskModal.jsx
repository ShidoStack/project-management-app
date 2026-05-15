import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { MEMBERS } from '../../data/initialData';
import { useAppActions } from '../../hooks/useAppActions';
import { getCustomMembers, memberById, saveCustomMember } from '../../utils/helpers';
import { AttachmentDropzone } from '../common/CommonComponents';

const getInitialTaskForm = (taskModal, currentProject) => {
  const task = taskModal.editId
    ? currentProject?.tasks.find(t => t.id === taskModal.editId)
    : null;

  return {
    title: task?.title || '',
    desc: task?.desc || '',
    priority: task?.priority || 'medium',
    column: task?.column || taskModal.col || currentProject?.columns[0] || '',
    deadline: task?.deadline || '',
    tag: task?.tag || '',
    assignees: task?.assignees || [],
    attachments: task?.attachments || []
  };
};

const TaskModalContent = ({ initialForm }) => {
  const { taskModal, currentProject, setTaskModal } = useApp();
  const { saveTask } = useAppActions();
  const [form, setForm] = useState(initialForm);
  const [assigneeQuery, setAssigneeQuery] = useState('');
  const [customMembers, setCustomMembers] = useState(getCustomMembers);

  const updateForm = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const closeModal = () => setTaskModal({ open: false, col: '', editId: null });

  const handleSave = () => {
    if (!form.title.trim()) return alert('Title required');
    saveTask(form, taskModal.editId);
  };

  const allMembers = [...MEMBERS, ...customMembers];
  const filteredMembers = allMembers.filter(member => (
    member.name.toLowerCase().includes(assigneeQuery.toLowerCase())
  ));
  const selectedMembers = form.assignees.map(id => memberById(id)).filter(Boolean);
  const hasExactMatch = allMembers.some(member => member.name.toLowerCase() === assigneeQuery.trim().toLowerCase());

  const toggleAssignee = (id) => {
    updateForm('assignees', form.assignees.includes(id)
      ? form.assignees.filter(memberId => memberId !== id)
      : [...form.assignees, id]);
  };

  const inviteAssignee = () => {
    const name = assigneeQuery.trim();
    if (!name) return;
    const initials = name.split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase() || name.slice(0, 2).toUpperCase();
    const member = saveCustomMember({
      id: `guest-${Date.now()}`,
      name,
      initials,
      color: '#8f4b2e'
    });
    setCustomMembers(prev => [...prev, member]);
    updateForm('assignees', [...form.assignees, member.id]);
    setAssigneeQuery('');
  };

  return (
    <motion.div className="modal-overlay open" onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }}>
      <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ y: 12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
        <div className="modal-header">
          <div className="modal-title">{taskModal.editId ? 'Edit Task' : 'New Task'}</div>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Task Title *</label><input className="form-input" value={form.title} onChange={e => updateForm('title', e.target.value)} placeholder="Enter task title..." /></div>
          <div className="form-group"><label className="form-label">Description</label><textarea className="form-textarea" value={form.desc} onChange={e => updateForm('desc', e.target.value)} placeholder="Describe the task..."></textarea></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Priority</label><select className="form-select" value={form.priority} onChange={e => updateForm('priority', e.target.value)}>
              <option value="critical">🔴 Critical</option><option value="high">🟠 High</option><option value="medium">🟡 Medium</option><option value="low">🟢 Low</option>
            </select></div>
            <div className="form-group"><label className="form-label">Status Column</label><select className="form-select" value={form.column} onChange={e => updateForm('column', e.target.value)}>
              {currentProject?.columns.map(c => <option key={c} value={c}>{c}</option>)}
            </select></div>
          </div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Deadline</label><input type="date" className="form-input" value={form.deadline} onChange={e => updateForm('deadline', e.target.value)} /></div>
            <div className="form-group">
              <label className="form-label">Assign Members</label>
              <div className="assignee-picker">
                <div className="assignee-selected">
                  {selectedMembers.length === 0 && <span>No one assigned yet</span>}
                  {selectedMembers.map(member => (
                    <button key={member.id} type="button" className="assignee-chip" onClick={() => toggleAssignee(member.id)}>
                      <span style={{ background: member.color }}>{member.initials}</span>{member.name}
                    </button>
                  ))}
                </div>
                <input
                  className="form-input"
                  value={assigneeQuery}
                  onChange={e => setAssigneeQuery(e.target.value)}
                  placeholder="Search or invite teammate..."
                />
                <div className="assignee-results">
                  {filteredMembers.slice(0, 5).map(member => (
                    <button key={member.id} type="button" className={form.assignees.includes(member.id) ? 'selected' : ''} onClick={() => toggleAssignee(member.id)}>
                      <span style={{ background: member.color }}>{member.initials}</span>{member.name}
                    </button>
                  ))}
                  {assigneeQuery.trim() && !hasExactMatch && (
                    <button type="button" className="invite-option" onClick={inviteAssignee}>Invite {assigneeQuery.trim()}</button>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="form-group"><label className="form-label">Tag</label><select className="form-select" value={form.tag} onChange={e => updateForm('tag', e.target.value)}>
            <option value="">No tag</option><option value="design">Design</option><option value="dev">Dev</option><option value="marketing">Marketing</option><option value="research">Research</option><option value="bug">Bug</option><option value="feature">Feature</option><option value="content">Content</option>
          </select></div>
          <AttachmentDropzone attachments={form.attachments} onChange={attachments => updateForm('attachments', attachments)} />
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-accent" onClick={handleSave}>Save Task</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export const TaskModal = () => {
  const { taskModal, currentProject } = useApp();

  if (!taskModal.open) return null;

  const initialForm = getInitialTaskForm(taskModal, currentProject);
  const modalKey = `${taskModal.editId || 'new'}-${taskModal.col || initialForm.column}`;

  return <TaskModalContent key={modalKey} initialForm={initialForm} />;
};
