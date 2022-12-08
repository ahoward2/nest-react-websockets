import React from 'react';

export const ChatLayout = ({
  children,
}: {
  children: React.ReactElement[];
}) => {
  return (
    <div className="mx-auto flex h-screen w-screen justify-center bg-gray-900">
      <div className="flex h-full w-full flex-col px-2 md:w-8/12 lg:w-6/12 xl:w-4/12">
        {children}
      </div>
    </div>
  );
};
