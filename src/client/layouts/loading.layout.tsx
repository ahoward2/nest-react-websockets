import React from 'react';

export const LoadingLayout = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <div className="mx-auto flex h-screen w-screen items-center justify-center bg-gray-900">
      <div> {children}</div>
    </div>
  );
};
