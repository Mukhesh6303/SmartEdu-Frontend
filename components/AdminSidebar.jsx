import { Link, useLocation } from 'react-router-dom';

export const AdminSidebar = () => {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  const navItems = [
    { path: '/admin', label: 'Home', icon: '🏠', hasSubmenu: false },
    { path: '/admin/create-course', label: 'Create Course', icon: '📚', hasSubmenu: false },
    { path: '/admin/manage-courses', label: 'Manage Courses', icon: '📖', hasSubmenu: true },
    { path: '/admin/create-assignment', label: 'Create Assignment', icon: '📝', hasSubmenu: false },
    { path: '/admin/manage-assignments', label: 'Manage Assignments', icon: '📋', hasSubmenu: true },
    { path: '/admin/manage-students', label: 'Manage Students', icon: '👥', hasSubmenu: false },
    { path: '/admin/view-submissions', label: 'View Submissions', icon: '✅', hasSubmenu: false },
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