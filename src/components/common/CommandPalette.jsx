import { AnimatePresence, motion } from 'framer-motion';
import { BarChart3, CalendarDays, CheckSquare, Command, Focus, KanbanSquare, Plus, Search, Settings, Shuffle } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

const CommandPalette = () => {
  const {
    isAuthenticated,
    commandPaletteOpen,
    setCommandPaletteOpen,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    setCurrentView,
    currentProject,
    setTaskModal,
    setFocusActive,
    workspaces
  } = useApp();
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  useEffect(() => {
    const onKeyDown = (event) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setCommandPaletteOpen(open => !open);
      }
      if (event.key === 'Escape') setCommandPaletteOpen(false);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [setCommandPaletteOpen]);

  const close = () => {
    setCommandPaletteOpen(false);
    setQuery('');
  };

  const workspacePath = `/workspace/${currentWorkspaceId}`;
  const commands = useMemo(() => [
    {
      id: 'new-task',
      label: 'Create new task',
      detail: 'Add work to the current project',
      icon: Plus,
      run: () => setTaskModal({ open: true, col: currentProject?.columns?.[0] || '', editId: null })
    },
    {
      id: 'board',
      label: 'Open board',
      detail: 'Return to Kanban planning',
      icon: KanbanSquare,
      run: () => { setCurrentView('board'); navigate(workspacePath); }
    },
    {
      id: 'list',
      label: 'Open list view',
      detail: 'Scan every task as a table',
      icon: CheckSquare,
      run: () => { setCurrentView('list'); navigate(workspacePath); }
    },
    {
      id: 'calendar',
      label: 'Open calendar',
      detail: 'Review deadlines and due work',
      icon: CalendarDays,
      run: () => { setCurrentView('calendar'); navigate('/calendar'); }
    },
    {
      id: 'analytics',
      label: 'Open analytics',
      detail: 'See progress, workload, and completion signals',
      icon: BarChart3,
      run: () => { setCurrentView('overview'); navigate('/analytics'); }
    },
    {
      id: 'focus',
      label: 'Start deep focus',
      detail: 'Begin a 59:59 distraction-free session',
      icon: Focus,
      run: () => setFocusActive(true)
    },
    {
      id: 'settings',
      label: 'Open settings',
      detail: 'Workspace and account preferences',
      icon: Settings,
      run: () => navigate('/settings')
    },
    ...workspaces.map(workspace => ({
      id: `workspace-${workspace.id}`,
      label: `Switch to ${workspace.name}`,
      detail: workspace.description || 'Move into another workspace',
      icon: Shuffle,
      run: () => {
        setCurrentWorkspaceId(workspace.id);
        setCurrentView('board');
        navigate(`/workspace/${workspace.id}`);
      }
    }))
  ], [currentProject, navigate, setCurrentView, setCurrentWorkspaceId, setFocusActive, setTaskModal, workspaces, workspacePath]);

  const filteredCommands = commands.filter(command => {
    const value = `${command.label} ${command.detail}`.toLowerCase();
    return value.includes(query.toLowerCase());
  });

  if (!isAuthenticated) return null;

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <motion.div className="command-overlay" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={close}>
          <motion.div
            className="command-palette"
            initial={{ opacity: 0, y: 18, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            onClick={event => event.stopPropagation()}
          >
            <div className="command-search">
              <Command size={18} />
              <input autoFocus value={query} onChange={event => setQuery(event.target.value)} placeholder="Search actions, views, and workspaces..." />
              <Search size={16} />
            </div>
            <div className="command-results">
              {filteredCommands.map(command => {
                const Icon = command.icon;
                return (
                  <button
                    key={command.id}
                    className="command-item"
                    onClick={() => {
                      command.run();
                      close();
                    }}
                  >
                    <span className="command-icon"><Icon size={17} /></span>
                    <span><strong>{command.label}</strong><small>{command.detail}</small></span>
                  </button>
                );
              })}
              {!filteredCommands.length && (
                <div className="command-empty">No matching command. Try “task”, “calendar”, or a workspace name.</div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;
