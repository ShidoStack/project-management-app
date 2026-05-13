import { useApp } from '../context/AppContext';
import { uid, pid } from '../utils/helpers';

export const useAppActions = () => {
  const { 
    projects, setProjects, currentProjectId, setCurrentProjectId, 
    setFilterMode, toast, addNotification, setTaskModal, setProjectModalOpen,
    setDetailModalTaskId, currentProject
  } = useApp();

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
    setProjects(prev => prev.map(p => {
      if (p.tasks.find(t => t.id === taskId)) {
        return {
          ...p,
          tasks: p.tasks.map(t => {
            if (t.id === taskId) {
              if (toCol === 'Done' || toCol === 'Archive') {
                addNotification(`Task <strong>${t.title}</strong> marked as complete! 🎉`);
              }
              return { ...t, column: toCol };
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
    if (editId) {
      setProjects(prev => prev.map(p => ({
        ...p,
        tasks: p.tasks.map(t => t.id === editId ? { ...t, ...data } : t)
      })));
      toast('✅ Task updated');
    } else {
      const newTask = { id: uid(), ...data, comments:[], attachments:[], checklist:[] };
      setProjects(prev => prev.map(p => p.id === currentProjectId ? { ...p, tasks: [...p.tasks, newTask] } : p));
      toast('✅ Task created');
      addNotification(`New task <strong>${data.title}</strong> created in ${currentProject.name}`);
    }
    setTaskModal({ open: false, col: '', editId: null });
  };

  const saveProject = (data) => {
    const newProj = { id: pid(), ...data, columns: ['Backlog', 'To Do', 'In Progress', 'Review', 'Done'], tasks: [] };
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
