import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import {
  STORAGE_KEYS,
  createWorkspaceFromProjects,
  getInitialWorkspaces,
  readJson,
  removeProjectAttachments,
  writeJson
} from './storageUtils';

const WorkspaceContext = createContext(null);

const migrateWorkspaces = () => {
  const storedWorkspaces = readJson(STORAGE_KEYS.workspaces, null);
  if (storedWorkspaces?.length) {
    return storedWorkspaces.map(workspace => ({
      ...workspace,
      projects: removeProjectAttachments(workspace.projects || [])
    }));
  }

  const legacyState = readJson(STORAGE_KEYS.legacyState, null);
  if (legacyState?.projects?.length) {
    return [
      createWorkspaceFromProjects(legacyState.projects, {
        id: 'w-migrated',
        name: 'Migrated Workspace',
        description: 'Created from your original ProjectFlow projects.',
        settings: { currentProjectId: legacyState.currentProjectId || legacyState.projects[0]?.id }
      })
    ];
  }

  return getInitialWorkspaces();
};

export const WorkspaceProvider = ({ children }) => {
  const [workspaces, setWorkspaces] = useState(migrateWorkspaces);
  const [currentWorkspaceId, setCurrentWorkspaceIdState] = useState(() => (
    localStorage.getItem(STORAGE_KEYS.currentWorkspaceId) || migrateWorkspaces()[0]?.id || 'w-default'
  ));
  const [currentProjectId, setCurrentProjectIdState] = useState(() => (
    migrateWorkspaces().find(workspace => workspace.id === localStorage.getItem(STORAGE_KEYS.currentWorkspaceId))
      ?.settings?.currentProjectId || migrateWorkspaces()[0]?.settings?.currentProjectId || 'p1'
  ));

  const currentWorkspace = useMemo(
    () => workspaces.find(workspace => workspace.id === currentWorkspaceId) || workspaces[0] || null,
    [workspaces, currentWorkspaceId]
  );

  const projects = useMemo(() => currentWorkspace?.projects || [], [currentWorkspace]);
  const effectiveCurrentProjectId = projects.some(project => project.id === currentProjectId)
    ? currentProjectId
    : projects[0]?.id || null;

  useEffect(() => {
    writeJson(STORAGE_KEYS.workspaces, workspaces.map(workspace => ({
      ...workspace,
      projects: removeProjectAttachments(workspace.projects || [])
    })));
  }, [workspaces]);

  useEffect(() => {
    if (currentWorkspace?.id) {
      localStorage.setItem(STORAGE_KEYS.currentWorkspaceId, currentWorkspace.id);
    }
  }, [currentWorkspace?.id]);

  const updateWorkspace = (workspaceId, updater) => {
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id !== workspaceId) return workspace;
      const nextWorkspace = typeof updater === 'function' ? updater(workspace) : { ...workspace, ...updater };
      return {
        ...nextWorkspace,
        projects: removeProjectAttachments(nextWorkspace.projects || [])
      };
    }));
  };

  const setCurrentProjectId = (projectId) => {
    setCurrentProjectIdState(projectId);
    if (!currentWorkspace) return;
    updateWorkspace(currentWorkspace.id, workspace => ({
      ...workspace,
      settings: { ...workspace.settings, currentProjectId: projectId }
    }));
  };

  const setCurrentWorkspaceId = (workspaceId) => {
    setCurrentWorkspaceIdState(workspaceId);
    const workspace = workspaces.find(item => item.id === workspaceId);
    const nextProjectId = workspace?.settings?.currentProjectId || workspace?.projects?.[0]?.id || null;
    if (nextProjectId) setCurrentProjectIdState(nextProjectId);
  };

  const setProjects = (updater) => {
    if (!currentWorkspace) return;
    setWorkspaces(prev => prev.map(workspace => {
      if (workspace.id !== currentWorkspace.id) return workspace;
      const nextProjects = typeof updater === 'function' ? updater(workspace.projects || []) : updater;
      return {
        ...workspace,
        projects: removeProjectAttachments(nextProjects)
      };
    }));
  };

  const createWorkspace = ({ name, description = '', members = [], projects: starterProjects = [], settings = {} }) => {
    const workspace = createWorkspaceFromProjects(starterProjects, {
      id: `w-${Date.now()}`,
      name,
      description,
      members,
      settings: {
        theme: settings.theme || 'warm',
        preferredView: settings.preferredView || 'board',
        currentProjectId: null
      }
    });
    setWorkspaces(prev => [...prev, workspace]);
    setCurrentWorkspaceIdState(workspace.id);
    setCurrentProjectIdState(null);
    return workspace;
  };

  const renameWorkspace = (workspaceId, name) => {
    updateWorkspace(workspaceId, workspace => ({ ...workspace, name }));
  };

  const inviteTeammate = (workspaceId, email) => {
    const invitation = { id: `inv-${Date.now()}`, email, status: 'pending', sentAt: new Date().toISOString() };
    updateWorkspace(workspaceId, workspace => ({
      ...workspace,
      invitations: [...(workspace.invitations || []), invitation]
    }));
    return invitation;
  };

  const value = {
    workspaces,
    setWorkspaces,
    currentWorkspace,
    currentWorkspaceId,
    setCurrentWorkspaceId,
    createWorkspace,
    renameWorkspace,
    inviteTeammate,
    projects,
    setProjects,
    currentProjectId: effectiveCurrentProjectId,
    setCurrentProjectId
  };

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
};

export const useWorkspace = () => useContext(WorkspaceContext);
