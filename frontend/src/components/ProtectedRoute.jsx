import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { token, loading } = useAuth();
  if (loading) return <div className="p-6 text-slate-300">Loading...</div>;
  if (!token) return <Navigate to="/login" replace />;
  return children;
}
