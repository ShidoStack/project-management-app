import { getInitialProjects, MEMBERS } from '../data/initialData';

export const STORAGE_KEYS = {
  legacyState: 'pf_state',
  authSession: 'pf_auth_session',
  authUsers: 'pf_auth_users',
  workspaces: 'pf_workspaces',
  currentWorkspaceId: 'pf_current_workspace_id',
  notifications: 'pf_notifications',
  onboarding: 'pf_onboarding'
};

export const removeProjectAttachments = (projectList = []) => (
  projectList.map(project => {
    const nextProject = { ...project, activity: project.activity || [] };
    delete nextProject.attachments;
    return nextProject;
  })
);

export const createWorkspaceFromProjects = (projects, overrides = {}) => ({
  id: overrides.id || `w-${Date.now()}`,
  name: overrides.name || 'ProjectFlow Workspace',
  description: overrides.description || 'A warm workspace for planning, shipping, and tracking progress.',
  members: overrides.members || MEMBERS.slice(0, 3),
  invitations: overrides.invitations || [],
  projects: removeProjectAttachments(projects),
  settings: {
    theme: 'warm',
    preferredView: 'board',
    currentProjectId: projects[0]?.id || 'p1',
    ...(overrides.settings || {})
  }
});

export const getInitialWorkspaces = () => [
  createWorkspaceFromProjects(getInitialProjects(), {
    id: 'w-default',
    name: 'Product Studio',
    description: 'Default workspace migrated from the original ProjectFlow project data.'
  })
];

export const readJson = (key, fallback = null) => {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
};

export const writeJson = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};
