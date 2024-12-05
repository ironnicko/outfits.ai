import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore, AuthState } from '../store/authStore';
import { getTokenLocal } from '../utils/auth';

interface ProtectedRouteProps {
  children: JSX.Element;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = getTokenLocal()||useAuthStore((state: AuthState) => state.token);

  if (!token) {
    // Redirect to login page if not authenticated
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
