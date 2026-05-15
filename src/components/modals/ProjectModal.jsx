import { motion } from 'framer-motion';
import { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAppActions } from '../../hooks/useAppActions';

export const ProjectModal = () => {
  const { projectModalOpen, setProjectModalOpen } = useApp();
  const { saveProject } = useAppActions();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#c4531a');
  const [deadline, setDeadline] = useState('');

  if (!projectModalOpen) return null;

  const closeModal = () => setProjectModalOpen(false);

  const handleCreate = () => {
    if (!name.trim()) return alert('Name required');
    saveProject({ name, color, deadline });
    setName('');
    setColor('#c4531a');
    setDeadline('');
  };

  return (
    <motion.div className="modal-overlay open" onClick={closeModal} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.16 }}>
      <motion.div className="modal" onClick={e => e.stopPropagation()} initial={{ y: 12, scale: 0.98 }} animate={{ y: 0, scale: 1 }} transition={{ duration: 0.18, ease: 'easeOut' }}>
        <div className="modal-header"><div className="modal-title">New Project</div><button className="modal-close" onClick={closeModal}>✕</button></div>
        <div className="modal-body">
          <div className="form-group"><label className="form-label">Project Name *</label><input className="form-input" value={name} onChange={e => setName(e.target.value)} placeholder="e.g. Website Redesign" /></div>
          <div className="form-row">
            <div className="form-group"><label className="form-label">Project Color</label><select className="form-select" value={color} onChange={e => setColor(e.target.value)}>
              <option value="#c4531a">Terracotta</option><option value="#2d6a4f">Forest</option><option value="#1a4a7a">Navy</option><option value="#5b21b6">Violet</option><option value="#b5500a">Amber</option><option value="#9b2335">Crimson</option>
            </select></div>
            <div className="form-group"><label className="form-label">Project Deadline</label><input type="date" className="form-input" value={deadline} onChange={e => setDeadline(e.target.value)} /></div>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn btn-outline" onClick={closeModal}>Cancel</button>
          <button className="btn btn-accent" onClick={handleCreate}>Create Project</button>
        </div>
      </motion.div>
    </motion.div>
  );
};
