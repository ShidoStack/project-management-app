import { createContext, useContext, useMemo } from 'react';
import { isOverdue } from '../utils/helpers';
import { useUI } from './UIContext';
import { useWorkspace } from './WorkspaceContext';

const ProjectContext = createContext(null);
const DONE_COLUMNS = ['Done', 'Archive', 'Live'];

const addDays = (date, days) => {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
};

const toDate = (value, endOfDay = false) => {
  if (!value) return null;
  return new Date(`${value}T${endOfDay ? '23:59:59' : '00:00:00'}`);
};

const getTaskActivityDate = (task) => {
  const attachmentDates = (task.attachments || []).map(a => a.addedAt).filter(Boolean);
  const commentDates = (task.comments || []).map(c => c.createdAt).filter(Boolean);
  return task.updatedAt || task.createdAt || attachmentDates[0] || commentDates[0] || null;
};

export const ProjectProvider = ({ children }) => {
  const { projects, currentProjectId } = useWorkspace();
  const { filterMode, searchQuery } = useUI();

  const currentProject = useMemo(
    () => projects.find(project => project.id === currentProjectId) || projects[0] || null,
    [projects, currentProjectId]
  );

  const filteredTasks = useMemo(() => {
    if (!currentProject) return [];
    let tasks = [...(currentProject.tasks || [])];
    const now = new Date();
    const today = now.toISOString().slice(0, 10);
    const weekEnd = addDays(now, 7);
    const recentCutoff = addDays(now, -7);

    if (filterMode === 'my') tasks = tasks.filter(task => task.assignees?.includes('m1'));
    if (filterMode === 'overdue') tasks = tasks.filter(task => isOverdue(task.deadline));
    if (filterMode === 'today') tasks = tasks.filter(task => task.deadline === today);
    if (filterMode === 'week') {
      tasks = tasks.filter(task => {
        const date = toDate(task.deadline, true);
        return date && date >= toDate(today) && date <= weekEnd && !DONE_COLUMNS.includes(task.column);
      });
    }
    if (filterMode === 'high') tasks = tasks.filter(task => ['critical', 'high'].includes(task.priority));
    if (filterMode === 'recent') {
      tasks = tasks.filter(task => {
        const date = getTaskActivityDate(task);
        return date ? new Date(date) >= recentCutoff : false;
      });
    }
    if (filterMode === 'completed') {
      tasks = tasks.filter(task => {
        const date = getTaskActivityDate(task);
        return DONE_COLUMNS.includes(task.column) && (!date || new Date(date) >= recentCutoff);
      });
    }
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tasks = tasks.filter(task => (
        task.title.toLowerCase().includes(query) ||
        (task.desc || '').toLowerCase().includes(query)
      ));
    }

    return tasks;
  }, [currentProject, filterMode, searchQuery]);

  return (
    <ProjectContext.Provider value={{ currentProject, filteredTasks }}>
      {children}
    </ProjectContext.Provider>
  );
};

export const useProjectState = () => useContext(ProjectContext);
