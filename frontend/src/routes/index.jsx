import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuthStore } from '../features/auth/store/authStore';

// We will create these pages in Step 3
import LoginPage from '../features/auth/pages/LoginPage';
import RegisterPage from '../features/auth/pages/RegisterPage';
import StudentLayout from '../layouts/StudentLayout';
import AdminLayout from '../layouts/AdminLayout';
import AlumniLayout from '../layouts/AlumniLayout';
import StudentDashboard from '../features/student/pages/StudentDashboard';
import MyApplications from '../features/student/pages/MyApplications';
import PlacementStatus from '../features/student/pages/PlacementStatus';
import AdminDashboard from '../features/admin/pages/AdminDashboard';
import ManageCompanies from '../features/admin/pages/ManageCompanies';
import SelectionCenter from '../features/admin/pages/SelectionCenter';
import AlumniDashboard from '../features/alumni/pages/AlumniDashboard';
import AlumniNetwork from '../features/alumni/pages/AlumniNetwork';
import UserProfile from '../features/profile/pages/UserProfile';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
};

import RoleGuard from './RoleGuard';

const AppRoutes = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        <Route element={<RoleGuard allowedRole="student" />}>
          <Route path="/student" element={<StudentLayout />}>
             <Route index element={<StudentDashboard />} />
             <Route path="applications" element={<MyApplications />} />
             <Route path="status" element={<PlacementStatus />} />
             <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRole="admin" />}>
          <Route path="/admin" element={<AdminLayout />}>
             <Route index element={<AdminDashboard />} />
             <Route path="companies" element={<ManageCompanies />} />
             <Route path="selection" element={<SelectionCenter />} />
             <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route element={<RoleGuard allowedRole="alumni" />}>
          <Route path="/alumni" element={<AlumniLayout />}>
             <Route index element={<AlumniDashboard />} />
             <Route path="network" element={<AlumniNetwork />} />
             <Route path="profile" element={<UserProfile />} />
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
};

export default AppRoutes;
