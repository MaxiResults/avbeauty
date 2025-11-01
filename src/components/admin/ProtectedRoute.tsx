import { Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext'; // ✅ Use useAuth, não useCustomAuth

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, loading } = useAuth(); // ✅ Use user e loading do AuthContext

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) { // ✅ Verifique user, não isAuthenticated
    return <Navigate to="/admin/login" replace />;
  }

  return <>{children}</>;
};
