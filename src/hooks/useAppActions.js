import { useApp } from '../context/AppContext';
import { uid, pid, isOverdue, formatDate } from '../utils/helpers';

export const useAppActions = () => {
  const { 
    projects, setProjects, currentProjectId, setCurrentProjectId, 
    toast, addNotification, setTaskModal, setProjectModalOpen,
    setDetailModalTaskId, currentProject, currentUser
  } = useApp();

  const createActivity = (type, message, taskId, createdAt = new Date().toISOString()) => ({
    id: `act-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    type,
    message,
    taskId,
    createdAt,
    user: currentUser?.name || 'Alex Reed'
  });

  const withActivity = (project, entries = []) => ({
    ...project,
    activity: [...entries, ...(project.activity || [])].slice(0, 80)
  });

  const deleteProject = (id) => {
    if (projects.length <= 1) { toast('⚠️ Cannot delete last project', 'warn'); return; }
    const p = projects.find(p => p.id === id);
    if (!window.confirm(`Delete "${p.name}"?`)) return;
    const newProjects = projects.filter(p => p.id !== id);
    setProjects(newProjects);
    if (currentProjectId === id) setCurrentProjectId(newProjects[0].id);
    toast('🗑️ Project deleted');
  };

  const moveTask = (taskId, toCol) => {
    const now = new Date().toISOString();
    setProjects(prev => prev.map(p => {
      const movingTask = p.tasks.find(t => t.id === taskId);
      if (movingTask) {
        const activity = [
          createActivity('move', `Moved "${movingTask.title}" to ${toCol}.`, taskId, now)
        ];
        if (toCol === 'Done' || toCol === 'Archive' || toCol === 'Live') {
          activity.unshift(createActivity('completion', `Completed "${movingTask.title}".`, taskId, now));
        }
        return {
          ...withActivity(p, activity),
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              if (toCol === 'Done' || toCol === 'Archive') {
                addNotification(`Task <strong>${t.title}</strong> marked as complete! 🎉`);
              }
              return { ...t, column: toCol, updatedAt: now };
            }
            return t;
          })
        };
      }
      return p;
    }));
    toast(`✅ Moved to "${toCol}"`, 'success');
  };

  const deleteTask = (taskId) => {
    if (!window.confirm('Delete this task?')) return;
    setProjects(prev => prev.map(p => ({
      ...p,
      tasks: p.tasks.filter(t => t.id !== taskId)
    })));
    setDetailModalTaskId(null);
    toast('🗑️ Task deleted');
  };

  const saveTask = (data, editId) => {
    const now = new Date().toISOString();
    if (editId) {
      const previousTask = currentProject?.tasks.find(t => t.id === editId);
      const activities = [createActivity('edit', `Updated "${data.title}".`, editId, now)];
      if (previousTask?.deadline !== data.deadline) {
        activities.unshift(createActivity('deadline', `Changed the deadline for "${data.title}".`, editId, now));
      }
      const previousAssignees = (previousTask?.assignees || []).join(',');
      const nextAssignees = (data.assignees || []).join(',');
      if (previousAssignees !== nextAssignees) {
        activities.unshift(createActivity('assignment', `Updated assignees for "${data.title}".`, editId, now));
      }
      if ((data.attachments || []).length > (previousTask?.attachments || []).length) {
        activities.unshift(createActivity('attachment', `Added files to "${data.title}".`, editId, now));
      }
      setProjects(prev => prev.map(p => ({
        ...(p.id === currentProjectId ? withActivity(p, activities) : p),
        tasks: p.tasks.map(t => t.id === editId ? { ...t, ...data, updatedAt: now } : t)
      })));
      toast('✅ Task updated');
    } else {
      const newTask = { id: uid(), comments:[], checklist:[], attachments: [], createdAt: now, updatedAt: now, ...data };
      const activities = [createActivity('create', `Created "${newTask.title}".`, newTask.id, now)];
      if ((newTask.attachments || []).length) {
        activities.unshift(createActivity('attachment', `Attached ${newTask.attachments.length} file${newTask.attachments.length > 1 ? 's' : ''} to "${newTask.title}".`, newTask.id, now));
      }
      if ((newTask.assignees || []).length) {
        activities.unshift(createActivity('assignment', `Assigned teammates to "${newTask.title}".`, newTask.id, now));
      }
      setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...withActivity(p, activities), tasks: [...p.tasks, newTask] } : p));
      toast('✅ Task created');
      addNotification(`New task <strong>${data.title}</strong> created in ${currentProject.name}`);
    }
    setTaskModal({ open: false, col: '', editId: null });
  };

  const saveProject = (data) => {
    const newProj = { id: pid(), ...data, columns: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'], tasks: [], activity: [] };
    setProjects(prev => [...prev, newProj]);
    setCurrentProjectId(newProj.id);
    setProjectModalOpen(false);
    toast(`🚀 Project "${data.name}" created!`);
  };

  const checkDeadlineAlerts = (currentProjects) => {
    const allTasks = currentProjects.flatMap(p => p.tasks);
    const overdue = allTasks.filter(t => {
      if (!t.deadline) return false;
      return new Date(t.deadline + 'T23:59:59') < new Date() && t.column!=='Done' && t.column!=='Archive';
    });
    const soon = allTasks.filter(t => {
      if (!t.deadline) return false;
      const d = new Date(t.deadline + 'T00:00:00');
      const now = new Date();
      const diff = (d - now) / (1000*60*60*24);
      return diff >= 0 && diff <= 3 && !isOverdue(t.deadline) && t.column!=='Done';
    });

    overdue.slice(0,3).forEach(t => {
      addNotification(`⚠️ <strong>${t.title}</strong> is overdue!`);
    });
    soon.slice(0,2).forEach(t => {
      addNotification(`⏰ <strong>${t.title}</strong> is due soon (${formatDate(t.deadline)})`);
    });
  };

  return { deleteProject, moveTask, deleteTask, saveTask, saveProject, checkDeadlineAlerts };
};
