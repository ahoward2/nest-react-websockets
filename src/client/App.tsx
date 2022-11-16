import React, { Suspense } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
const Login = React.lazy(() => import('./pages/login'));
const Chat = React.lazy(() => import('./pages/chat'));
import { ReactLocation, Outlet, Router } from '@tanstack/react-location';

const location = new ReactLocation();
const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
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
    </QueryClientProvider>
  );
}

export default App;
