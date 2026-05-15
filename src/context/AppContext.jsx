import { createContext, useContext } from 'react';
import { AuthProvider, useAuth } from './AuthContext';
import { NotificationProvider, useNotifications } from './NotificationContext';
import { ProjectProvider, useProjectState } from './ProjectContext';
import { UIProvider, useUI } from './UIContext';
import { WorkspaceProvider, useWorkspace } from './WorkspaceContext';

const AppContext = createContext(null);

const AppBridge = ({ children }) => {
  const auth = useAuth();
  const notifications = useNotifications();
  const projectState = useProjectState();
  const ui = useUI();
  const workspace = useWorkspace();

  const value = {
    ...auth,
    ...notifications,
    ...projectState,
    ...ui,
    ...workspace
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const AppProvider = ({ children }) => (
  <AuthProvider>
    <NotificationProvider>
      <UIProvider>
        <WorkspaceProvider>
          <ProjectProvider>
            <AppBridge>{children}</AppBridge>
          </ProjectProvider>
        </WorkspaceProvider>
      </UIProvider>
    </NotificationProvider>
  </AuthProvider>
);

export const useApp = () => useContext(AppContext);
