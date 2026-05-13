import React from 'react';
import { useApp } from '../../context/AppContext';

export const ToastContainer = () => {
  const { toasts } = useApp();
  return (
    <div className="toast-container">
      {toasts.map(t => (
        <div key={t.id} className={`toast ${t.out?'out':''}`}>
          <span className="toast-icon">{{info:'ℹ️', success:'✅', warn:'⚠️', error:'❌'}[t.type]||'ℹ️'}</span>{t.msg}
        </div>
      ))}
    </div>
  );
};

export const FocusModeBar = () => {
  const { focusActive, focusSeconds, focusPaused, setFocusPaused, setFocusActive } = useApp();
  if (!focusActive) return null;
  
  const m = Math.floor(focusSeconds/60).toString().padStart(2,'0');
  const s = (focusSeconds%60).toString().padStart(2,'0');
  
  return (
    <div className="focus-mode-bar active">
      <span>🍅 Focus Mode</span><span className="focus-timer">{m}:{s}</span>
      <button className="focus-btn pause" onClick={() => setFocusPaused(!focusPaused)}>{focusPaused ? 'Resume' : 'Pause'}</button>
      <button className="focus-btn stop" onClick={() => setFocusActive(false)}>Stop</button>
    </div>
  );
};
