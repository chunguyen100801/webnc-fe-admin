/* eslint-disable perfectionist/sort-named-imports */
/* eslint-disable perfectionist/sort-imports */
/* eslint-disable unused-imports/no-unused-imports */
/* eslint-disable no-unused-vars */
import { AppContext } from 'src/context/app.context';
import { lazy, Suspense, useContext } from 'react';
import { Outlet, Navigate, useRoutes } from 'react-router-dom';
import path from 'src/constants/path';
import DashboardLayout from 'src/layouts/dashboard';
import ResetPasswordPage from 'src/pages/reset-password';

export const UserPage = lazy(() => import('src/pages/user'));
export const LoginPage = lazy(() => import('src/pages/login'));
export const ClassPage = lazy(() => import('src/pages/class'));
export const Page404 = lazy(() => import('src/pages/page-not-found'));
export const FotgotPasswordPage = lazy(() => import('src/pages/forgotpassword'));
export const ChangePasswordPage = lazy(() => import('src/pages/change-password'));

// ----------------------------------------------------------------------

function ProjectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return isAuthenticated ? <Outlet /> : <Navigate to={path.signin} replace />;
}

function RejectedRoute() {
  const { isAuthenticated } = useContext(AppContext);
  return !isAuthenticated ? <Outlet /> : <Navigate to={path.user} replace />;
}

export default function Router() {
  const routes = useRoutes([
    {
      path: '',
      element: <ProjectedRoute />,
      children: [
        {
          path: '',
          element: (
            <DashboardLayout>
              <Suspense>
                <Outlet />
              </Suspense>
            </DashboardLayout>
          ),
          children: [
            { element: <Navigate to={path.user} replace />, index: true },
            { path: path.user, element: <UserPage /> },
            { path: path.class, element: <ClassPage /> },
            { path: path.change_password, element: <ChangePasswordPage /> },
          ],
        },
      ],
    },
    {
      path: '',
      element: <RejectedRoute />,
      children: [
        {
          path: path.forgotPassword,
          element: <FotgotPasswordPage />,
        },
        {
          path: path.signin,
          element: <LoginPage />,
        },
        {
          path: path.resetPassword,
          element: <ResetPasswordPage />,
        },
      ],
    },
    {
      path: path.notFound,
      element: <Page404 />,
    },
    {
      path: '*',
      element: <Navigate to={path.notFound} replace />,
    },
  ]);

  return routes;
}
