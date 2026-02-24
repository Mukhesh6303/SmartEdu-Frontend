import { useNavigate } from 'react-router-dom';

export default function Navbar() {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <>
      <div className='navbar-brand-header'>
        <div className='brand-logo'>🎓</div>
        <h1 className='brand-title'>SmartEdu – Your Academic Platform</h1>
      </div>
      <div className='navbar'>
        <div className='navbar-left'>
          <div className='navbar-icon'>👤</div>
          <div>
            <h3 className='navbar-title'>Course Management System</h3>
            <p className='navbar-subtitle'>{user?.role === 'admin' ? 'Admin Portal' : 'Student Portal'}</p>
          </div>
        </div>
      <div className='navbar-right'>
        <span className='user-email'>{user?.email}</span>
        <span className='user-role'>{user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}</span>
        <button
          onClick={() => {
            localStorage.removeItem('user');
            navigate('/login');
          }}
          className='btn-logout'
          title='Logout'
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
            <polyline points="16 17 21 12 16 7"></polyline>
            <line x1="21" y1="12" x2="9" y2="12"></line>
          </svg>
          Logout
        </button>
      </div>
    </div>
    </>
  );
}