import { Outlet, Navigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import { AdminSidebar } from '../components/AdminSidebar';

export const AdminLayout = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  if (user?.role !== 'admin') {
    return <Navigate to='/login' />;
  }

  return (
    <div className='layout-wrapper'>
      <AdminSidebar />
      <div className='content'>
        <Navbar />
        <Outlet />
      </div>
    </div>
  );
};