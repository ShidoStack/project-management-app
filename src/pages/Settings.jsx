import { Navigate } from 'react-router-dom';
import { LogOut, MailPlus, PencilLine } from 'lucide-react';
import { useState } from 'react';
import { useApp } from '../context/AppContext';

export const SettingsPage = () => {
  const {
    isAuthenticated,
    currentWorkspace,
    renameWorkspace,
    inviteTeammate,
    logout,
    toast
  } = useApp();
  const [name, setName] = useState(currentWorkspace?.name || '');
  const [inviteEmail, setInviteEmail] = useState('');

  if (!isAuthenticated) return <Navigate to="/login" replace />;

  const saveName = () => {
    if (!name.trim() || !currentWorkspace) return;
    renameWorkspace(currentWorkspace.id, name.trim());
    toast('Workspace renamed', 'success');
  };

  const sendInvite = () => {
    if (!inviteEmail.trim() || !currentWorkspace) return;
    inviteTeammate(currentWorkspace.id, inviteEmail.trim());
    setInviteEmail('');
    toast('Invitation simulated locally', 'success');
  };

  return (
    <div id="app" className="active">
      <main className="settings-page">
        <div className="settings-card">
          <div className="section-label">Workspace settings</div>
          <h1>{currentWorkspace?.name || 'Workspace'}</h1>
          <div className="settings-row">
            <label>Workspace name<input value={name} onChange={event => setName(event.target.value)} /></label>
            <button className="btn btn-accent" onClick={saveName}><PencilLine size={15} />Rename</button>
          </div>
          <div className="settings-row">
            <label>Invite teammate<input value={inviteEmail} onChange={event => setInviteEmail(event.target.value)} placeholder="name@example.com" /></label>
            <button className="btn btn-outline" onClick={sendInvite}><MailPlus size={15} />Invite</button>
          </div>
          <button className="btn btn-danger" onClick={logout}><LogOut size={15} />Log out</button>
        </div>
      </main>
    </div>
  );
};
