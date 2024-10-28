import Login from '../pages/Login';

interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

export const publicRoutes: Route[] = [
  { path: '/login', component: Login, exact: true },
];
