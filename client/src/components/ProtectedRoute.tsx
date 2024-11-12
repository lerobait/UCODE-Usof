import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '../hooks/useAuthStore';

interface ProtectedRouteProps {
  component: React.ComponentType;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  component: Component,
}) => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/posts" />;
  }

  return <Component />;
};

export default ProtectedRoute;
