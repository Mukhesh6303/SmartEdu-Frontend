import { Link, useLocation } from 'react-router-dom';

export const StudentSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/student', label: 'Home', icon: '🏠', hasSubmenu: false },
    { path: '/student/enroll', label: 'Enroll Courses', icon: '📚', hasSubmenu: false },
    { path: '/student/submit-assignment', label: 'Submit Assignment', icon: '📝', hasSubmenu: false },
    { path: '/student/grades', label: 'Progress', icon: '⭐', hasSubmenu: false },
  ];

  return (
    <div className='sidebar'>
      <div className='sidebar-logo'>
        <div className='sidebar-logo-icon'>🎓</div>
        <h2 className='sidebar-logo-text'>SmartEdu</h2>
      </div>
      <nav className='sidebar-nav'>
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-nav-item ${isActive(item.path) ? 'active' : ''}`}
          >
            <div className='nav-item-content'>
              <span className='nav-item-icon'>{item.icon}</span>
              <span className='nav-item-label'>{item.label}</span>
            </div>
            {item.hasSubmenu && <span className='nav-item-chevron'>›</span>}
          </Link>
        ))}
      </nav>
    </div>
  );
};