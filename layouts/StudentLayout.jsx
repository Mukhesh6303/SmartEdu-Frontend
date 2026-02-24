import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { StudentSidebar } from '../components/StudentSidebar';

export const StudentLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.role !== 'student') {
    return <Navigate to='/login' />;
  }

  return (
    <div className='layout-wrapper'>
      <StudentSidebar />
      <div className='content'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};