import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { AppProvider, useApp } from './context/AppContext';
import { LoginPage, SignupPage } from './pages/AuthPages';
import Landing from './pages/Landing';
import { OnboardingPage } from './pages/Onboarding';
import { SettingsPage } from './pages/Settings';
import Workspace from './pages/Workspace';
import CommandPalette from './components/common/CommandPalette';
import { ToastContainer } from './components/common/CommonComponents';
import './index.css';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useApp();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

const WorkspaceRoute = ({ view }) => {
  const { workspaceId, projectId } = useParams();
  const {
    currentWorkspaceId,
    setCurrentWorkspaceId,
    currentProjectId,
    setCurrentProjectId,
    setCurrentView
  } = useApp();

  useEffect(() => {
    if (workspaceId && workspaceId !== currentWorkspaceId) setCurrentWorkspaceId(workspaceId);
    if (projectId && projectId !== currentProjectId) setCurrentProjectId(projectId);
    if (view) setCurrentView(view);
  }, [workspaceId, projectId, view, currentWorkspaceId, currentProjectId, setCurrentWorkspaceId, setCurrentProjectId, setCurrentView]);

  return (
    <ProtectedRoute>
      <Workspace />
    </ProtectedRoute>
  );
};

const DashboardRedirect = () => {
  const { currentWorkspaceId, workspaces } = useApp();
  const workspaceId = currentWorkspaceId || workspaces[0]?.id || 'w-default';
  return <Navigate to={`/workspace/${workspaceId}`} replace />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/onboarding" element={<OnboardingPage />} />
          <Route path="/dashboard" element={<DashboardRedirect />} />
          <Route path="/workspace/:workspaceId" element={<WorkspaceRoute view="board" />} />
          <Route path="/workspace/:workspaceId/project/:projectId" element={<WorkspaceRoute view="board" />} />
          <Route path="/calendar" element={<WorkspaceRoute view="calendar" />} />
          <Route path="/analytics" element={<WorkspaceRoute view="overview" />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <CommandPalette />
        <ToastContainer />
      </BrowserRouter>
    </AppProvider>
  );
}
