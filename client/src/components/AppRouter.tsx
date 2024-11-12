import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes, privateRoutes } from '../router';
import ProtectedRoute from './ProtectedRoute';

interface AppRoute {
  path: string;
  component: React.ComponentType;
  exact?: boolean;
}

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {publicRoutes.map((route: AppRoute) => (
        <Route
          key={route.path}
          element={<route.component />}
          path={route.path}
        />
      ))}
      {privateRoutes.map((route: AppRoute) => (
        <Route
          key={route.path}
          path={route.path}
          element={<ProtectedRoute component={route.component} />}
        />
      ))}
      <Route path="*" element={<Navigate to="/posts" />} />
    </Routes>
  );
};

export default AppRouter;
