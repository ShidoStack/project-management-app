import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { useAppActions } from '../../hooks/useAppActions';

export const ProjectModal = () => {
  const { projectModalOpen, setProjectModalOpen } = useApp();
  const { saveProject } = useAppActions();
  
  const [name, setName] = useState('');
  const [color, setColor] = useState('#c4531a');
  const [deadline, setDeadline] = useState('');

  if (!projectModalOpen) return null;

  return (
    <div className="modal-overlay open" onClick={() => setProjectModalOpen(false)}>
      <div className="modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header"><div className="modal-title">New Project</div><button className="modal-close" onClick={() => setProjectModalOpen(false)}>✕</button></div>
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
          <button className="btn btn-outline" onClick={() => setProjectModalOpen(false)}>Cancel</button>
          <button className="btn btn-accent" onClick={() => name ? saveProject({name, color, deadline}) : alert('Name required')}>Create Project</button>
        </div>
      </div>
    </div>
  );
};
