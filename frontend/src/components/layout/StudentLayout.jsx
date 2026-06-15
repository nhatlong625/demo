import { Outlet } from 'react-router-dom';
import StudentSidebar from './StudentSidebar';
import Topbar from './Topbar';

function StudentLayout() {
  return (
    <div className="dashboard-layout">
      <StudentSidebar />
      <div className="dashboard-content">
        <Topbar />
        <main className="dashboard-main">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default StudentLayout;
