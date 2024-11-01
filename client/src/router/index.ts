import Login from '../pages/Login';
import Posts from '../pages/Posts';
import Register from '../pages/Register';
import NewPass from '../pages/NewPass';

interface Route {
  path: string;
  component: React.ComponentType<any>;
  exact?: boolean;
}

export const publicRoutes: Route[] = [
  { path: '/login', component: Login, exact: true },
  { path: '/password-reset/:token', component: NewPass, exact: true },
  { path: '/register', component: Register, exact: true },
  { path: '/posts', component: Posts, exact: true },
];
