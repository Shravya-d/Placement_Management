import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

const RoleGuard = ({ allowedRole }) => {
  const { role, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (role !== allowedRole) return <Navigate to={`/${role}`} replace />;

  return <Outlet />;
};

export default RoleGuard;
