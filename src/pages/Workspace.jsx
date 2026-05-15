import { useApp } from '../context/AppContext';
import AppHeader from '../components/layout/AppHeader';
import Sidebar from '../components/layout/Sidebar';
import { Toolbar, ProgressBar, ActivityTimeline } from '../components/layout/WorkspaceContent';
import { BoardView } from '../components/board/BoardView';
import { ListView } from '../components/list/ListView';
import { CalendarView } from '../components/calendar/CalendarView';
import { OverviewView } from '../components/analytics/OverviewView';
import { TaskModal } from '../components/modals/TaskModal';
import { ProjectModal } from '../components/modals/ProjectModal';
import { DetailModal } from '../components/modals/DetailModal';
import { NotificationPanel } from '../components/notifications/NotificationPanel';
import { FocusModeBar } from '../components/common/CommonComponents';
import { useFocusTimer } from '../hooks/useFocusTimer';

const Workspace = () => {
  const { currentView, currentWorkspaceId } = useApp();
  useFocusTimer();

  return (
    <div id="app" className="active" key={currentWorkspaceId}>
      <AppHeader />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">
          <Toolbar />
          <ProgressBar />
          <ActivityTimeline />
          <div className="view-container" style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            {currentView === 'board' && <BoardView />}
            {currentView === 'list' && <ListView />}
            {currentView === 'calendar' && <CalendarView />}
            {currentView === 'overview' && <OverviewView />}
          </div>
        </main>
      </div>

      <TaskModal />
      <ProjectModal />
      <DetailModal />
      <NotificationPanel />
      <FocusModeBar />
    </div>
  );
};

export default Workspace;
