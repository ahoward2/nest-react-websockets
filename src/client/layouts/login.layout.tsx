import React from 'react';

export const LoginLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <div className="mx-auto flex h-screen w-screen justify-center bg-gray-900">
      {children}
    </div>
  );
};
