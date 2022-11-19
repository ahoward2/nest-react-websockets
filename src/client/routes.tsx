import { Outlet, ReactLocation, Router } from '@tanstack/react-location';
import React, { Suspense } from 'react';
const Login = React.lazy(() => import('./pages/login'));
const Chat = React.lazy(() => import('./pages/chat'));

const location = new ReactLocation();

export const AppRouter = () => {
  return (
    <Router
      location={location}
      routes={[
        {
          path: '/',
          loader: async () => ({
            user: JSON.parse(sessionStorage.getItem('user') || ''),
          }),
          element: async () => (
            <Suspense fallback={<></>}>
              <Login></Login>
            </Suspense>
          ),
        },
        {
          path: 'chat',
          loader: async () => ({
            user: JSON.parse(sessionStorage.getItem('user') || ''),
          }),
          element: async () => (
            <Suspense fallback={<></>}>
              <Chat></Chat>
            </Suspense>
          ),
        },
      ]}
    >
      <Outlet />
    </Router>
  );
};
