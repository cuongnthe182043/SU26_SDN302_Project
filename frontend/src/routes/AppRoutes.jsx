import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from '../components/ProtectedRoute';
import AppShell from '../layouts/AppShell';
import LandingPage from '../pages/LandingPage';
import LoginPage from '../pages/LoginPage';
import RegisterPage from '../pages/RegisterPage';
import DashboardPage from '../pages/DashboardPage';
import ContactsPage from '../pages/ContactsPage';
import ContactDetailPage from '../pages/ContactDetailPage';
import ContactCreatePage from '../pages/ContactCreatePage';
import ContactEditPage from '../pages/ContactEditPage';
import NearbyContactsPage from '../pages/NearbyContactsPage';
import BlacklistPage from '../pages/BlacklistPage';
import GroupsPage from '../pages/GroupsPage';
import GroupDetailPage from '../pages/GroupDetailPage';
import RecentPage from '../pages/RecentPage';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        element={
          <ProtectedRoute>
            <AppShell />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/contacts" element={<ContactsPage />} />
        <Route path="/contacts/new" element={<ContactCreatePage />} />
        <Route path="/contacts/:id" element={<ContactDetailPage />} />
        <Route path="/contacts/:id/edit" element={<ContactEditPage />} />
        <Route path="/nearby" element={<NearbyContactsPage />} />
        <Route path="/blacklist" element={<BlacklistPage />} />
        <Route path="/groups" element={<GroupsPage />} />
        <Route path="/groups/:id" element={<GroupDetailPage />} />
        <Route path="/recent" element={<RecentPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
