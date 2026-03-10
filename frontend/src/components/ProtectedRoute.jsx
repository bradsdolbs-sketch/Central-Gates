import { Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from '@/context/AuthContext';

const ProtectedContent = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0A0A0A] flex items-center justify-center">
        <div className="text-[#F5F0EB]">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

const ProtectedRoute = ({ children }) => {
  return (
    <AuthProvider>
      <ProtectedContent>{children}</ProtectedContent>
    </AuthProvider>
  );
};

export default ProtectedRoute;
