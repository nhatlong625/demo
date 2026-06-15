import SearchBar from '../common/SearchBar';
import Avatar from '../common/Avatar';
import { currentUser } from '../../mocks/userMock';
import logoImg from '../../assets/images/logo.jpg';

function Topbar({ isAdmin = false }) {
  if (isAdmin) {
    return (
      <header className="admin-topbar">
        <div className="admin-search-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="admin-search-icon">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            placeholder="Search users, documents, or settings..." 
            className="admin-search-input"
          />
        </div>

        <div className="admin-topbar-actions">
          <button className="admin-notification-btn" type="button" aria-label="Notifications">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className="bell-icon">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/>
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>
            </svg>
            <span className="notification-badge-dot"></span>
          </button>

          <div className="admin-profile-section">
            <div className="admin-avatar-wrapper">
              <img src={logoImg} alt="Admin Avatar" className="admin-avatar-img" />
            </div>
            <div className="admin-profile-info">
              <span className="admin-profile-name">Admin</span>
              <span className="admin-profile-role">Super Admin</span>
            </div>
          </div>
        </div>
      </header>
    );
  }

  return (
    <div className="topbar">
      <SearchBar placeholder="Search courses, docs, or quizzes" />
      <div className="topbar-actions">
        <button className="icon-chip" type="button">!</button>
        <Avatar name={currentUser.name} />
      </div>
    </div>
  );
}

export default Topbar;
