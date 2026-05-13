import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import Landing from './pages/Landing';
import Workspace from './pages/Workspace';
import './index.css';

function AppContent() {
  const { appActive } = useApp();
  return appActive ? <Workspace /> : <Landing />;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
