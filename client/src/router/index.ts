import Login from '../pages/Login';
import Posts from '../pages/Posts';
import Register from '../pages/Register';
import NewPass from '../pages/NewPass';
import FavoritePosts from '../pages/FavoritePosts';
import Categories from '../pages/Categories';
import CategoryPosts from '../pages/CategoryPosts';
import MyPosts from '../pages/MyPosts';

interface Route {
  path: string;
  component: React.ComponentType<object>;
  exact?: boolean;
}

export const privateRoutes: Route[] = [
  { path: '/posts/favorite', component: FavoritePosts, exact: true },
  { path: '/posts/my', component: MyPosts, exact: true },
];

export const publicRoutes: Route[] = [
  { path: '/login', component: Login, exact: true },
  { path: '/password-reset/:token', component: NewPass, exact: true },
  { path: '/register', component: Register, exact: true },
  { path: '/posts', component: Posts, exact: true },
  { path: '/categories', component: Categories, exact: true },
  { path: '/category-posts/:id', component: CategoryPosts, exact: true },
];
