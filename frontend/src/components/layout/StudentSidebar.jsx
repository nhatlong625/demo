import { NavLink } from 'react-router-dom';
import Avatar from '../common/Avatar';
import { currentUser } from '../../mocks/userMock';

const items = [
  ['home', 'Home'],
  ['courses', 'Courses'],
  ['my-courses', 'My Courses'],
  ['library', 'Library'],
  ['upload-document', 'Upload'],
  ['ai-tutor', 'AI Tutor'],
  ['practice-tests', 'Practice Tests'],
  ['profile', 'Profile'],
  ['settings', 'Settings'],
];

function StudentSidebar() {
  return (
    <aside className="dashboard-sidebar">
      <NavLink className="brand" to="/student/home">
        <span className="brand-mark">AS</span>
        <span>AI StudyHub</span>
      </NavLink>

      <nav className="sidebar-menu">
        {items.map(([slug, label]) => (
          <NavLink
            key={slug}
            to={'/student/' + slug}
            className={({ isActive }) => ['sidebar-link', isActive ? 'active' : ''].join(' ').trim()}
          >
            <span className="sidebar-icon">{label.slice(0, 2)}</span>
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="layout-user-card">
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <Avatar name={currentUser.name} />
          <div>
            <strong>{currentUser.name}</strong>
            <div className="muted" style={{ fontSize: '0.9rem' }}>{currentUser.major}</div>
          </div>
        </div>
      </div>
    </aside>
  );
}

export default StudentSidebar;
