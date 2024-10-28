import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { publicRoutes } from '../router';

interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

const AppRouter: React.FC = () => {
  return (
    <Routes>
      {publicRoutes.map((route: Route) => (
        <Route
          key={route.path}
          element={<route.component />}
          path={route.path}
        />
      ))}
      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRouter;
